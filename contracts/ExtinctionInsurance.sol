// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./VoiceSharesNFT.sol";
import "./LinguaToken.sol";

/**
 * @title Language Extinction Insurance
 * @notice DeFi insurance protocol that protects against language extinction
 * @dev Communities stake to insure their language; payouts trigger if speaker count drops
 */
contract ExtinctionInsurance is Ownable, ReentrancyGuard {
    
    struct InsurancePool {
        uint256 totalStaked; // Total LINGUA staked
        uint256 coverageAmount; // Total coverage in USDC
        uint256 premiumRate; // Annual premium rate (basis points)
        uint256 speakerThreshold; // Minimum speakers before payout
        uint256 lastSpeakerCount; // Last verified speaker count
        uint256 lastUpdateTime; // Last oracle update
        bool triggered; // Insurance triggered flag
        uint256 payoutPerStaker; // Payout amount per staked token
        mapping(address => uint256) stakes; // Individual stakes
        mapping(address => bool) hasClaimed; // Claim tracking
    }
    
    struct PolicyHolder {
        uint256 stakedAmount;
        uint256 premiumPaid;
        uint256 coverageStart;
        uint256 coverageEnd;
        bool active;
    }
    
    // Core mappings
    mapping(string => InsurancePool) public insurancePools;
    mapping(string => mapping(address => PolicyHolder)) public policies;
    mapping(string => address) public languageOracles; // Chainlink oracles for speaker counts
    mapping(string => uint256) public poolReserves; // Insurance reserves per language
    
    // Contracts
    IERC20 public immutable usdcToken;
    LinguaToken public immutable linguaToken;
    VoiceSharesNFT public immutable voiceShares;
    
    // Constants
    uint256 public constant MINIMUM_STAKE = 100 * 10**18; // 100 LINGUA minimum
    uint256 public constant COVERAGE_PERIOD = 365 days;
    uint256 public constant PAYOUT_MULTIPLIER = 10; // 10x coverage on trigger
    uint256 public constant RESERVE_RATIO = 20; // 20% of premiums go to reserves
    
    // Risk parameters
    mapping(string => uint256) public riskScores; // Language risk assessment (1-100)
    uint256 public globalRiskPool; // Cross-language risk pool
    
    // Events
    event InsurancePoolCreated(string language, uint256 threshold, uint256 premiumRate);
    event PolicyPurchased(string language, address holder, uint256 stake, uint256 coverage);
    event PremiumPaid(string language, address holder, uint256 amount);
    event InsuranceTriggered(string language, uint256 speakerCount, uint256 totalPayout);
    event ClaimProcessed(string language, address claimant, uint256 amount);
    event SpeakerCountUpdated(string language, uint256 oldCount, uint256 newCount);
    
    constructor(
        address _usdcToken,
        address _linguaToken,
        address _voiceShares
    ) {
        usdcToken = IERC20(_usdcToken);
        linguaToken = LinguaToken(_linguaToken);
        voiceShares = VoiceSharesNFT(_voiceShares);
    }
    
    /**
     * @notice Create insurance pool for a language
     * @param language Language identifier
     * @param speakerThreshold Minimum speakers before insurance triggers
     * @param initialSpeakerCount Current speaker count
     * @param premiumRate Annual premium rate in basis points
     * @param oracleAddress Chainlink oracle for speaker count
     */
    function createInsurancePool(
        string memory language,
        uint256 speakerThreshold,
        uint256 initialSpeakerCount,
        uint256 premiumRate,
        address oracleAddress
    ) external onlyOwner {
        require(insurancePools[language].speakerThreshold == 0, "Pool exists");
        require(speakerThreshold > 0 && speakerThreshold < initialSpeakerCount, "Invalid threshold");
        require(premiumRate > 0 && premiumRate <= 1000, "Invalid premium rate"); // Max 10% annual
        
        InsurancePool storage pool = insurancePools[language];
        pool.speakerThreshold = speakerThreshold;
        pool.lastSpeakerCount = initialSpeakerCount;
        pool.premiumRate = premiumRate;
        pool.lastUpdateTime = block.timestamp;
        
        languageOracles[language] = oracleAddress;
        
        // Set initial risk score based on speaker count
        if (initialSpeakerCount < 100) {
            riskScores[language] = 90; // Very high risk
        } else if (initialSpeakerCount < 500) {
            riskScores[language] = 70; // High risk
        } else if (initialSpeakerCount < 1000) {
            riskScores[language] = 50; // Medium risk
        } else {
            riskScores[language] = 30; // Lower risk
        }
        
        emit InsurancePoolCreated(language, speakerThreshold, premiumRate);
    }
    
    /**
     * @notice Purchase insurance policy by staking LINGUA
     * @param language Language to insure
     * @param stakeAmount Amount of LINGUA to stake
     */
    function purchasePolicy(
        string memory language,
        uint256 stakeAmount
    ) external nonReentrant {
        InsurancePool storage pool = insurancePools[language];
        require(pool.speakerThreshold > 0, "Pool doesn't exist");
        require(!pool.triggered, "Insurance already triggered");
        require(stakeAmount >= MINIMUM_STAKE, "Below minimum stake");
        
        PolicyHolder storage policy = policies[language][msg.sender];
        require(!policy.active || block.timestamp > policy.coverageEnd, "Policy still active");
        
        // Calculate coverage and premium
        uint256 riskMultiplier = riskScores[language];
        uint256 coverageAmount = (stakeAmount * PAYOUT_MULTIPLIER * riskMultiplier) / 100;
        uint256 annualPremium = (coverageAmount * pool.premiumRate) / 10000;
        
        // Transfer LINGUA stake
        require(linguaToken.transferFrom(msg.sender, address(this), stakeAmount), "Stake transfer failed");
        
        // Transfer USDC premium
        require(usdcToken.transferFrom(msg.sender, address(this), annualPremium), "Premium transfer failed");
        
        // Allocate premium
        uint256 reserveAmount = (annualPremium * RESERVE_RATIO) / 100;
        poolReserves[language] += reserveAmount;
        globalRiskPool += annualPremium - reserveAmount;
        
        // Update pool
        pool.totalStaked += stakeAmount;
        pool.coverageAmount += coverageAmount;
        pool.stakes[msg.sender] += stakeAmount;
        
        // Create/update policy
        policy.stakedAmount = stakeAmount;
        policy.premiumPaid = annualPremium;
        policy.coverageStart = block.timestamp;
        policy.coverageEnd = block.timestamp + COVERAGE_PERIOD;
        policy.active = true;
        
        emit PolicyPurchased(language, msg.sender, stakeAmount, coverageAmount);
    }
    
    /**
     * @notice Update speaker count from oracle
     * @param language Language to update
     */
    function updateSpeakerCount(string memory language) external {
        InsurancePool storage pool = insurancePools[language];
        require(pool.speakerThreshold > 0, "Pool doesn't exist");
        require(!pool.triggered, "Already triggered");
        
        // Get oracle data (simplified - would use Chainlink in production)
        uint256 newSpeakerCount = _getOracleSpeakerCount(language);
        
        uint256 oldCount = pool.lastSpeakerCount;
        pool.lastSpeakerCount = newSpeakerCount;
        pool.lastUpdateTime = block.timestamp;
        
        emit SpeakerCountUpdated(language, oldCount, newSpeakerCount);
        
        // Check if insurance should trigger
        if (newSpeakerCount < pool.speakerThreshold) {
            _triggerInsurance(language, newSpeakerCount);
        }
    }
    
    /**
     * @notice Trigger insurance payout
     * @param language Language with triggered insurance
     * @param currentSpeakers Current speaker count
     */
    function _triggerInsurance(string memory language, uint256 currentSpeakers) internal {
        InsurancePool storage pool = insurancePools[language];
        require(!pool.triggered, "Already triggered");
        
        pool.triggered = true;
        
        // Calculate total payout
        uint256 totalPayout = pool.coverageAmount;
        uint256 availableReserves = poolReserves[language] + (globalRiskPool / 10); // Use 10% of global pool
        
        if (availableReserves < totalPayout) {
            totalPayout = availableReserves; // Cap at available funds
        }
        
        // Calculate payout per staked token
        if (pool.totalStaked > 0) {
            pool.payoutPerStaker = totalPayout / pool.totalStaked;
        }
        
        emit InsuranceTriggered(language, currentSpeakers, totalPayout);
    }
    
    /**
     * @notice Claim insurance payout
     * @param language Language with triggered insurance
     */
    function claimInsurance(string memory language) external nonReentrant {
        InsurancePool storage pool = insurancePools[language];
        require(pool.triggered, "Insurance not triggered");
        require(!pool.hasClaimed[msg.sender], "Already claimed");
        
        uint256 stake = pool.stakes[msg.sender];
        require(stake > 0, "No stake found");
        
        PolicyHolder memory policy = policies[language][msg.sender];
        require(policy.active && block.timestamp <= policy.coverageEnd, "Policy not active");
        
        uint256 payoutAmount = stake * pool.payoutPerStaker;
        pool.hasClaimed[msg.sender] = true;
        
        // Return staked LINGUA
        require(linguaToken.transfer(msg.sender, stake), "LINGUA transfer failed");
        
        // Pay out USDC coverage
        if (payoutAmount > 0) {
            require(usdcToken.transfer(msg.sender, payoutAmount), "USDC payout failed");
        }
        
        emit ClaimProcessed(language, msg.sender, payoutAmount);
    }
    
    /**
     * @notice Renew insurance policy
     * @param language Language to renew policy for
     */
    function renewPolicy(string memory language) external nonReentrant {
        PolicyHolder storage policy = policies[language][msg.sender];
        require(policy.active, "No active policy");
        require(block.timestamp > policy.coverageEnd - 30 days, "Too early to renew");
        
        InsurancePool storage pool = insurancePools[language];
        require(!pool.triggered, "Insurance triggered");
        
        // Calculate new premium (may have changed based on risk)
        uint256 coverageAmount = (policy.stakedAmount * PAYOUT_MULTIPLIER * riskScores[language]) / 100;
        uint256 annualPremium = (coverageAmount * pool.premiumRate) / 10000;
        
        // Transfer premium
        require(usdcToken.transferFrom(msg.sender, address(this), annualPremium), "Premium transfer failed");
        
        // Update policy
        policy.premiumPaid = annualPremium;
        policy.coverageEnd = policy.coverageEnd + COVERAGE_PERIOD;
        
        emit PremiumPaid(language, msg.sender, annualPremium);
    }
    
    /**
     * @notice Cancel policy and unstake
     * @param language Language policy to cancel
     */
    function cancelPolicy(string memory language) external nonReentrant {
        PolicyHolder storage policy = policies[language][msg.sender];
        require(policy.active, "No active policy");
        
        InsurancePool storage pool = insurancePools[language];
        require(!pool.triggered, "Insurance triggered");
        
        uint256 stake = pool.stakes[msg.sender];
        require(stake > 0, "No stake found");
        
        // Calculate refund (prorated if cancelled early)
        uint256 timeRemaining = 0;
        if (block.timestamp < policy.coverageEnd) {
            timeRemaining = policy.coverageEnd - block.timestamp;
        }
        
        uint256 premiumRefund = (policy.premiumPaid * timeRemaining) / COVERAGE_PERIOD;
        
        // Update pool
        pool.totalStaked -= stake;
        pool.stakes[msg.sender] = 0;
        policy.active = false;
        
        // Return stake and refund
        require(linguaToken.transfer(msg.sender, stake), "LINGUA transfer failed");
        if (premiumRefund > 0) {
            require(usdcToken.transfer(msg.sender, premiumRefund), "Refund failed");
        }
    }
    
    /**
     * @notice Get oracle speaker count (simplified)
     * @param language Language to query
     */
    function _getOracleSpeakerCount(string memory language) internal view returns (uint256) {
        // In production, this would call Chainlink oracle
        // For now, return a simulated value
        address oracle = languageOracles[language];
        if (oracle == address(0)) {
            return insurancePools[language].lastSpeakerCount;
        }
        
        // Would implement actual Chainlink integration here
        return insurancePools[language].lastSpeakerCount - 1; // Simulate decline for testing
    }
    
    /**
     * @notice Calculate premium for a given coverage amount
     * @param language Language to insure
     * @param coverageAmount Desired coverage in USDC
     */
    function calculatePremium(
        string memory language,
        uint256 coverageAmount
    ) external view returns (uint256) {
        InsurancePool memory pool = insurancePools[language];
        require(pool.speakerThreshold > 0, "Pool doesn't exist");
        
        uint256 riskMultiplier = riskScores[language];
        uint256 adjustedRate = (pool.premiumRate * riskMultiplier) / 100;
        
        return (coverageAmount * adjustedRate) / 10000;
    }
}