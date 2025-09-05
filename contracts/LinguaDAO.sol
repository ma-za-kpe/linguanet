// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "./LinguaToken.sol";
import "./VoiceSharesNFT.sol";

/**
 * @title LinguaDAO
 * @notice Main governance contract for the Decentralized Language Preservation Protocol
 * @dev Manages proposals, voting, and protocol parameters
 */
contract LinguaDAO is 
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    // Core contracts
    LinguaToken public immutable linguaToken;
    VoiceSharesNFT public immutable voiceShares;
    
    // Protocol parameters (governable)
    uint256 public baseRecordingReward = 3 * 10**6; // 3 USDC in wei
    uint256 public validationReward = 5 * 10**5; // 0.5 USDC in wei
    uint256 public minimumQualityScore = 70; // Minimum quality score for rewards
    uint256 public insurancePoolTarget = 1000000 * 10**6; // 1M USDC target
    
    // Language preservation insurance
    mapping(string => uint256) public languageInsurancePools;
    mapping(string => uint256) public languageSpeakerCounts;
    mapping(string => uint256) public extinctionThresholds;
    mapping(string => bool) public insuranceTriggered;
    
    // Revenue sharing parameters
    uint256 public constant CONTRIBUTOR_SHARE = 70; // 70% to contributors
    uint256 public constant STAKER_SHARE = 20; // 20% to LINGUA stakers
    uint256 public constant TREASURY_SHARE = 10; // 10% to DAO treasury
    
    // Treasury management
    address public treasuryAddress;
    uint256 public treasuryBalance;
    
    // Proposal types
    enum ProposalType {
        ParameterChange,
        LanguageAddition,
        InsurancePayout,
        GrantFunding,
        ProtocolUpgrade
    }
    
    mapping(uint256 => ProposalType) public proposalTypes;
    
    // Events
    event LanguageAdded(string language, uint256 extinctionThreshold);
    event InsurancePoolFunded(string language, uint256 amount);
    event InsuranceTriggered(string language, uint256 payout);
    event RevenueDistributed(uint256 contributorAmount, uint256 stakerAmount, uint256 treasuryAmount);
    event ParameterUpdated(string parameter, uint256 oldValue, uint256 newValue);
    
    constructor(
        IVotes _token,
        TimelockController _timelock,
        address _linguaToken,
        address _voiceShares,
        address _treasury
    )
        Governor("LinguaDAO")
        GovernorSettings(
            1, // 1 block voting delay
            45818, // ~1 week voting period (assuming 13.2s blocks on Base)
            100000 * 10**18 // 100k LINGUA proposal threshold
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4) // 4% quorum
        GovernorTimelockControl(_timelock)
    {
        linguaToken = LinguaToken(_linguaToken);
        voiceShares = VoiceSharesNFT(_voiceShares);
        treasuryAddress = _treasury;
        
        // Initialize extinction thresholds for languages
        extinctionThresholds["xhosa"] = 100; // If speakers drop below 100
        extinctionThresholds["wolof"] = 150;
        extinctionThresholds["shona"] = 200;
        // More conservative thresholds for larger languages
        extinctionThresholds["swahili"] = 1000;
        extinctionThresholds["yoruba"] = 500;
        extinctionThresholds["hausa"] = 800;
    }
    
    /**
     * @notice Submit a voice recording and mint Voice Share NFT
     * @param language Language of the recording
     * @param audioIPFSHash IPFS hash of the audio file
     * @param duration Duration in seconds
     * @param qualityScore AI-validated quality score
     */
    function submitRecording(
        string memory language,
        string memory audioIPFSHash,
        uint256 duration,
        uint256 qualityScore
    ) external returns (uint256) {
        require(qualityScore >= minimumQualityScore, "Quality too low");
        require(duration >= 10 && duration <= 300, "Invalid duration");
        
        // Calculate rarity tier based on extinction threshold
        uint256 rarityTier = _calculateRarityTier(language);
        
        // Mint Voice Share NFT
        uint256 tokenId = voiceShares.mintVoiceShare(
            msg.sender,
            language,
            duration,
            qualityScore,
            audioIPFSHash,
            rarityTier
        );
        
        // Calculate and distribute LINGUA rewards
        uint256 linguaReward = linguaToken.calculateMiningReward(
            msg.sender,
            language,
            qualityScore,
            linguaToken.balanceOf(msg.sender)
        );
        
        // Apply guardian multiplier
        uint256 guardianMultiplier = voiceShares.getGuardianMultiplier(msg.sender);
        linguaReward = (linguaReward * guardianMultiplier) / 100;
        
        // Transfer rewards (from mining pool)
        // Implementation would connect to mining rewards contract
        
        return tokenId;
    }
    
    /**
     * @notice Fund language extinction insurance pool
     * @param language Language to insure
     * @param amount Amount to contribute to insurance pool
     */
    function fundInsurancePool(string memory language, uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        require(extinctionThresholds[language] > 0, "Language not recognized");
        
        // Transfer LINGUA tokens to this contract
        require(
            linguaToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        languageInsurancePools[language] += amount;
        emit InsurancePoolFunded(language, amount);
    }
    
    /**
     * @notice Trigger insurance payout if language drops below threshold
     * @param language Language to check
     * @param currentSpeakerCount Current number of active speakers
     */
    function triggerInsurance(string memory language, uint256 currentSpeakerCount) external {
        require(extinctionThresholds[language] > 0, "Language not recognized");
        require(!insuranceTriggered[language], "Insurance already triggered");
        require(currentSpeakerCount < extinctionThresholds[language], "Threshold not met");
        
        // Verify speaker count through oracle or governance vote
        languageSpeakerCounts[language] = currentSpeakerCount;
        
        uint256 poolBalance = languageInsurancePools[language];
        require(poolBalance > 0, "No insurance funds available");
        
        insuranceTriggered[language] = true;
        
        // Distribute insurance funds to active contributors of that language
        // Implementation would query voice shares and distribute proportionally
        
        emit InsuranceTriggered(language, poolBalance);
    }
    
    /**
     * @notice Distribute revenue from AI model usage
     * @param totalRevenue Total revenue to distribute
     */
    function distributeRevenue(uint256 totalRevenue) external {
        require(msg.sender == treasuryAddress, "Only treasury");
        require(totalRevenue > 0, "No revenue to distribute");
        
        uint256 contributorAmount = (totalRevenue * CONTRIBUTOR_SHARE) / 100;
        uint256 stakerAmount = (totalRevenue * STAKER_SHARE) / 100;
        uint256 treasuryAmount = (totalRevenue * TREASURY_SHARE) / 100;
        
        treasuryBalance += treasuryAmount;
        
        // Distribute to voice share holders
        // Implementation would calculate proportional distribution
        
        // Distribute to LINGUA stakers
        // Implementation would connect to staking contract
        
        emit RevenueDistributed(contributorAmount, stakerAmount, treasuryAmount);
    }
    
    /**
     * @notice Update protocol parameters through governance
     * @param parameter Parameter name to update
     * @param newValue New value for the parameter
     */
    function updateParameter(string memory parameter, uint256 newValue) external onlyGovernance {
        uint256 oldValue;
        
        if (keccak256(bytes(parameter)) == keccak256(bytes("baseRecordingReward"))) {
            oldValue = baseRecordingReward;
            baseRecordingReward = newValue;
        } else if (keccak256(bytes(parameter)) == keccak256(bytes("validationReward"))) {
            oldValue = validationReward;
            validationReward = newValue;
        } else if (keccak256(bytes(parameter)) == keccak256(bytes("minimumQualityScore"))) {
            oldValue = minimumQualityScore;
            minimumQualityScore = newValue;
        } else {
            revert("Unknown parameter");
        }
        
        emit ParameterUpdated(parameter, oldValue, newValue);
    }
    
    /**
     * @notice Calculate rarity tier for a language
     * @param language Language to evaluate
     */
    function _calculateRarityTier(string memory language) internal view returns (uint256) {
        uint256 threshold = extinctionThresholds[language];
        
        if (threshold == 0) return 1; // Unknown language, lowest tier
        if (threshold <= 100) return 5; // Critically endangered
        if (threshold <= 200) return 4; // Severely endangered
        if (threshold <= 500) return 3; // Endangered
        if (threshold <= 1000) return 2; // Vulnerable
        return 1; // Stable
    }
    
    // Governance overrides
    function votingDelay()
        public view override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }
    
    function votingPeriod()
        public view override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }
    
    function quorum(uint256 blockNumber)
        public view override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }
    
    function state(uint256 proposalId)
        public view override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }
    
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }
    
    function proposalThreshold()
        public view override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
    
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }
    
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }
    
    function _executor()
        internal view override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }
    
    function supportsInterface(bytes4 interfaceId)
        public view override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}