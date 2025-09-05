// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voice Shares NFT
 * @notice NFTs representing ownership shares in language models and revenue rights
 * @dev Each NFT represents a voice contribution with associated metadata and revenue share
 */
contract VoiceSharesNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    
    uint256 private _tokenIdCounter;
    
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
    
    // Mapping from token ID to voice share data
    mapping(uint256 => VoiceShare) public voiceShares;
    
    // Revenue tracking
    mapping(uint256 => uint256) public pendingRevenue;
    mapping(address => uint256) public totalRevenueByContributor;
    
    // Guardian tier system
    mapping(address => uint256) public contributorTier; // 0: Novice, 1: Expert, 2: Master, 3: Guardian
    mapping(address => uint256) public contributionCount;
    
    // Language stats
    mapping(string => uint256) public languageContributions;
    mapping(string => uint256) public languageRevenue;
    
    // Events
    event VoiceShareMinted(uint256 indexed tokenId, address indexed contributor, string language, uint256 rarityTier);
    event RevenueDistributed(uint256 indexed tokenId, uint256 amount);
    event TierUpgraded(address indexed contributor, uint256 newTier);
    event ValidationCompleted(uint256 indexed tokenId, address indexed validator, uint256 qualityScore);
    
    constructor(address initialOwner) 
        ERC721("Voice Shares", "VOICE") 
        Ownable(initialOwner) 
    {}
    
    /**
     * @notice Mint a new Voice Share NFT
     * @param contributor Address of the voice contributor
     * @param language Language code (e.g., "TWI", "YOR")
     * @param audioIPFSHash IPFS hash of the audio recording
     * @param duration Duration of the recording in seconds
     * @param qualityScore Quality score from validation (0-100)
     * @param rarityTier Rarity tier based on language (1-5)
     */
    function mintVoiceShare(
        address contributor,
        string memory language,
        string memory audioIPFSHash,
        uint256 duration,
        uint256 qualityScore,
        uint256 rarityTier
    ) public onlyOwner returns (uint256) {
        require(qualityScore <= 100, "Invalid quality score");
        require(rarityTier >= 1 && rarityTier <= 5, "Invalid rarity tier");
        require(duration >= 10 && duration <= 300, "Invalid duration");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
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
        
        // Update language stats
        languageContributions[language]++;
        contributionCount[contributor]++;
        
        // Check for tier upgrade
        _checkTierUpgrade(contributor);
        
        emit VoiceShareMinted(tokenId, contributor, language, rarityTier);
        
        return tokenId;
    }
    
    /**
     * @notice Distribute revenue to NFT holders
     * @param tokenIds Array of token IDs to distribute revenue to
     * @param amounts Array of revenue amounts for each token
     */
    function distributeRevenue(
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) external onlyOwner {
        require(tokenIds.length == amounts.length, "Mismatched arrays");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_ownerOf(tokenIds[i]) != address(0), "Token does not exist");
            
            pendingRevenue[tokenIds[i]] += amounts[i];
            voiceShares[tokenIds[i]].revenueEarned += amounts[i];
            
            address owner = ownerOf(tokenIds[i]);
            totalRevenueByContributor[owner] += amounts[i];
            
            string memory language = voiceShares[tokenIds[i]].language;
            languageRevenue[language] += amounts[i];
            
            emit RevenueDistributed(tokenIds[i], amounts[i]);
        }
    }
    
    /**
     * @notice Claim pending revenue for a token
     * @param tokenId Token ID to claim revenue for
     */
    function claimRevenue(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        uint256 pending = pendingRevenue[tokenId];
        require(pending > 0, "No pending revenue");
        
        pendingRevenue[tokenId] = 0;
        // In production, this would transfer actual tokens
        // For now, it's tracked internally
        
        emit RevenueDistributed(tokenId, pending);
    }
    
    /**
     * @notice Set validator status for a contributor
     * @param contributor Address of the contributor
     * @param tokenId Token ID they validated
     * @param qualityScore Quality score assigned
     */
    function setValidator(
        address contributor,
        uint256 tokenId,
        uint256 qualityScore
    ) external onlyOwner {
        require(qualityScore <= 100, "Invalid quality score");
        
        // Mark contributor as validator
        if (contributionCount[contributor] >= 10) {
            // Find their tokens and mark as validator
            for (uint256 i = 0; i < balanceOf(contributor); i++) {
                uint256 ownedTokenId = tokenOfOwnerByIndex(contributor, i);
                voiceShares[ownedTokenId].isValidator = true;
            }
        }
        
        emit ValidationCompleted(tokenId, contributor, qualityScore);
    }
    
    /**
     * @notice Check and upgrade contributor tier
     * @param contributor Address to check
     */
    function _checkTierUpgrade(address contributor) internal {
        uint256 count = contributionCount[contributor];
        uint256 currentTier = contributorTier[contributor];
        uint256 newTier = currentTier;
        
        if (count >= 100 && currentTier < 3) {
            newTier = 3; // Guardian
        } else if (count >= 50 && currentTier < 2) {
            newTier = 2; // Master
        } else if (count >= 20 && currentTier < 1) {
            newTier = 1; // Expert
        }
        
        if (newTier > currentTier) {
            contributorTier[contributor] = newTier;
            emit TierUpgraded(contributor, newTier);
        }
    }
    
    /**
     * @notice Get all tokens owned by a specific address
     * @param owner Address to query
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokens;
    }
    
    /**
     * @notice Get tokens for a specific language
     * @param language Language code to query
     */
    function getTokensByLanguage(string memory language) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // First, count tokens for this language
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) != address(0) && keccak256(bytes(voiceShares[i].language)) == keccak256(bytes(language))) {
                count++;
            }
        }
        
        // Then collect them
        uint256[] memory tokens = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) != address(0) && keccak256(bytes(voiceShares[i].language)) == keccak256(bytes(language))) {
                tokens[index] = i;
                index++;
            }
        }
        
        return tokens;
    }
    
    // Required overrides for multiple inheritance
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}