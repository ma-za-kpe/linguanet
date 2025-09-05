// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Voice Shares NFT
 * @notice NFTs representing ownership shares in language models and revenue rights
 * @dev Each NFT represents a voice contribution with associated metadata and revenue share
 */
contract VoiceSharesNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct VoiceShare {
        address contributor;
        string language;
        uint256 timestamp;
        uint256 duration; // in seconds
        uint256 qualityScore; // 0-100
        string audioIPFSHash;
        uint256 revenueEarned;
        uint256 modelVersion; // Which AI model version this contributed to
        bool isValidator; // If contributor is also a validator
        uint256 rarityTier; // 1-5, based on language rarity
    }
    
    // Token ID to Voice Share mapping
    mapping(uint256 => VoiceShare) public voiceShares;
    
    // Language to total shares mapping
    mapping(string => uint256) public languageShareCounts;
    
    // Contributor to their NFT IDs
    mapping(address => uint256[]) public contributorTokens;
    
    // Revenue distribution tracking
    mapping(uint256 => uint256) public pendingRevenue;
    uint256 public totalRevenueDistributed;
    
    // Guardian NFT tiers
    enum GuardianTier { None, Novice, Expert, Master, Guardian }
    mapping(address => GuardianTier) public guardianStatus;
    mapping(address => uint256) public contributionStreak;
    
    // Events
    event VoiceShareMinted(
        uint256 indexed tokenId,
        address indexed contributor,
        string language,
        uint256 qualityScore
    );
    event RevenueDistributed(uint256 indexed tokenId, uint256 amount);
    event GuardianTierUpgraded(address indexed contributor, GuardianTier newTier);
    
    constructor() ERC721("LinguaDAO Voice Shares", "VOICE") {}
    
    /**
     * @notice Mint a new Voice Share NFT
     * @param contributor Address of the voice contributor
     * @param language Language code of the recording
     * @param duration Duration of the recording in seconds
     * @param qualityScore Quality score from AI validation
     * @param audioIPFSHash IPFS hash of the audio file
     * @param rarityTier Rarity tier based on language endangerment
     */
    function mintVoiceShare(
        address contributor,
        string memory language,
        uint256 duration,
        uint256 qualityScore,
        string memory audioIPFSHash,
        uint256 rarityTier
    ) public onlyOwner returns (uint256) {
        require(qualityScore <= 100, "Invalid quality score");
        require(rarityTier >= 1 && rarityTier <= 5, "Invalid rarity tier");
        require(duration >= 10 && duration <= 300, "Invalid duration");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(contributor, tokenId);
        
        VoiceShare memory newShare = VoiceShare({
            contributor: contributor,
            language: language,
            timestamp: block.timestamp,
            duration: duration,
            qualityScore: qualityScore,
            audioIPFSHash: audioIPFSHash,
            revenueEarned: 0,
            modelVersion: 1,
            isValidator: false,
            rarityTier: rarityTier
        });
        
        voiceShares[tokenId] = newShare;
        languageShareCounts[language]++;
        contributorTokens[contributor].push(tokenId);
        
        // Update contribution streak
        contributionStreak[contributor]++;
        _updateGuardianTier(contributor);
        
        // Set metadata URI (could point to IPFS metadata)
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", audioIPFSHash, "/metadata.json")));
        
        emit VoiceShareMinted(tokenId, contributor, language, qualityScore);
        
        return tokenId;
    }
    
    /**
     * @notice Distribute revenue to Voice Share holders
     * @param tokenIds Array of token IDs to distribute to
     * @param amounts Corresponding amounts for each token
     */
    function distributeRevenue(
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) external onlyOwner {
        require(tokenIds.length == amounts.length, "Mismatched arrays");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_exists(tokenIds[i]), "Token does not exist");
            
            pendingRevenue[tokenIds[i]] += amounts[i];
            voiceShares[tokenIds[i]].revenueEarned += amounts[i];
            totalRevenueDistributed += amounts[i];
            
            emit RevenueDistributed(tokenIds[i], amounts[i]);
        }
    }
    
    /**
     * @notice Claim pending revenue for a Voice Share
     * @param tokenId Token ID to claim revenue for
     */
    function claimRevenue(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        uint256 pending = pendingRevenue[tokenId];
        require(pending > 0, "No pending revenue");
        
        pendingRevenue[tokenId] = 0;
        
        // Transfer USDC or native token to the owner
        // (Implementation would connect to payment contract)
        
        emit RevenueDistributed(tokenId, pending);
    }
    
    /**
     * @notice Update guardian tier based on contributions
     * @param contributor Address to update tier for
     */
    function _updateGuardianTier(address contributor) internal {
        uint256 streak = contributionStreak[contributor];
        GuardianTier currentTier = guardianStatus[contributor];
        GuardianTier newTier = currentTier;
        
        if (streak >= 100 && currentTier < GuardianTier.Guardian) {
            newTier = GuardianTier.Guardian;
        } else if (streak >= 50 && currentTier < GuardianTier.Master) {
            newTier = GuardianTier.Master;
        } else if (streak >= 25 && currentTier < GuardianTier.Expert) {
            newTier = GuardianTier.Expert;
        } else if (streak >= 10 && currentTier < GuardianTier.Novice) {
            newTier = GuardianTier.Novice;
        }
        
        if (newTier != currentTier) {
            guardianStatus[contributor] = newTier;
            emit GuardianTierUpgraded(contributor, newTier);
        }
    }
    
    /**
     * @notice Get multiplier bonus based on Guardian tier
     * @param contributor Address to check
     */
    function getGuardianMultiplier(address contributor) public view returns (uint256) {
        GuardianTier tier = guardianStatus[contributor];
        if (tier == GuardianTier.Guardian) return 200; // 2x
        if (tier == GuardianTier.Master) return 175; // 1.75x
        if (tier == GuardianTier.Expert) return 150; // 1.5x
        if (tier == GuardianTier.Novice) return 125; // 1.25x
        return 100; // 1x
    }
    
    /**
     * @notice Get all NFTs owned by a contributor
     * @param contributor Address to query
     */
    function getContributorTokens(address contributor) public view returns (uint256[] memory) {
        return contributorTokens[contributor];
    }
    
    /**
     * @notice Get voice share statistics for a language
     * @param language Language code to query
     */
    function getLanguageStats(string memory language) public view returns (
        uint256 totalShares,
        uint256 totalDuration,
        uint256 avgQuality
    ) {
        totalShares = languageShareCounts[language];
        uint256 qualitySum = 0;
        uint256 durationSum = 0;
        uint256 count = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (_exists(i) && keccak256(bytes(voiceShares[i].language)) == keccak256(bytes(language))) {
                qualitySum += voiceShares[i].qualityScore;
                durationSum += voiceShares[i].duration;
                count++;
            }
        }
        
        totalDuration = durationSum;
        avgQuality = count > 0 ? qualitySum / count : 0;
    }
    
    // Required overrides for multiple inheritance
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}