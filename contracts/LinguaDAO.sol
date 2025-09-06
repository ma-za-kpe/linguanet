// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "./LinguaToken.sol";
import "./VoiceSharesNFT.sol";

/**
 * @title LinguaDAO
 * @notice Decentralized governance for language preservation protocol
 * @dev Governor contract managing protocol parameters and treasury
 */
contract LinguaDAO is 
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    LinguaToken public immutable linguaToken;
    VoiceSharesNFT public immutable voiceSharesNFT;
    
    // Treasury tracking
    uint256 public treasuryBalance;
    
    // Proposal types
    enum ProposalType {
        ADD_LANGUAGE,
        ADJUST_REWARDS,
        ALLOCATE_FUNDS,
        EMERGENCY_ACTION,
        PROTOCOL_UPGRADE
    }
    
    // Language preservation proposals
    struct PreservationProposal {
        string language;
        uint256 fundingAmount;
        address recipient;
        string description;
        bool executed;
    }
    
    mapping(uint256 => PreservationProposal) public preservationProposals;
    mapping(string => bool) public approvedLanguages;
    mapping(string => uint256) public languageFunding;
    
    // Events
    event LanguageAdded(string language);
    event FundsAllocated(string language, uint256 amount, address recipient);
    event RewardsAdjusted(string language, uint256 newMultiplier);
    event EmergencyActionTaken(string action, address executor);
    
    constructor(
        address _token,
        address _nft
    )
        Governor("LinguaDAO")
        GovernorSettings(
            1, // 1 block voting delay
            50400, // 1 week voting period (blocks)
            100000e18 // 100k LINGUA proposal threshold
        )
        GovernorVotes(IVotes(_token))
        GovernorVotesQuorumFraction(4) // 4% quorum
    {
        linguaToken = LinguaToken(_token);
        voiceSharesNFT = VoiceSharesNFT(_nft);
        
        // Initialize approved languages
        approvedLanguages["TWI"] = true;
        approvedLanguages["YOR"] = true;
        approvedLanguages["SWA"] = true;
        approvedLanguages["HAU"] = true;
        approvedLanguages["AMH"] = true;
        approvedLanguages["ZUL"] = true;
        approvedLanguages["IGB"] = true;
    }
    
    /**
     * @notice Create proposal to add new language
     * @param language Language code to add
     * @param initialFunding Initial funding amount
     */
    function proposeAddLanguage(
        string memory language,
        uint256 initialFunding,
        string memory description
    ) external returns (uint256) {
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);
        
        targets[0] = address(this);
        values[0] = 0;
        calldatas[0] = abi.encodeWithSignature(
            "addLanguage(string,uint256)",
            language,
            initialFunding
        );
        
        return propose(targets, values, calldatas, description);
    }
    
    /**
     * @notice Execute language addition
     * @param language Language code to add
     * @param fundingAmount Initial funding
     */
    function addLanguage(string memory language, uint256 fundingAmount) external onlyGovernance {
        require(!approvedLanguages[language], "Language already approved");
        
        approvedLanguages[language] = true;
        languageFunding[language] = fundingAmount;
        
        emit LanguageAdded(language);
        emit FundsAllocated(language, fundingAmount, address(this));
    }
    
    /**
     * @notice Allocate funds for language preservation
     * @param language Target language
     * @param amount Funding amount
     * @param recipient Recipient address
     */
    function allocateFunds(
        string memory language,
        uint256 amount,
        address recipient
    ) external onlyGovernance {
        require(approvedLanguages[language], "Language not approved");
        require(amount <= languageFunding[language], "Insufficient language funds");
        
        languageFunding[language] -= amount;
        // In production, would transfer actual funds
        
        emit FundsAllocated(language, amount, recipient);
    }
    
    /**
     * @notice Check if account can propose
     * @param account Address to check
     */
    function canPropose(address account) external view returns (bool) {
        uint256 votes = getVotes(account, block.timestamp - 1);
        return votes >= proposalThreshold();
    }
    
    /**
     * @notice Get proposal details
     * @param proposalId Proposal ID
     */
    function getProposalDetails(uint256 proposalId) external view returns (
        uint256 id,
        uint256 startBlock,
        uint256 endBlock,
        string memory description
    ) {
        return (
            proposalId,
            proposalSnapshot(proposalId),
            proposalDeadline(proposalId),
            "Proposal description" // Simplified for now
        );
    }
    
    // Required overrides
    function votingDelay()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }
}