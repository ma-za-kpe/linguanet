// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LinguaNet
 * @dev Simple MVP contract for ETHAccra 2025 Hackathon
 * @notice Manages audio submissions, validations, and payments
 */
contract LinguaNet {
    // State variables
    address public owner;
    uint256 public submissionCount;
    uint256 public constant CONTRIBUTOR_REWARD = 3 * 10**6; // $3 USDC (6 decimals)
    uint256 public constant VALIDATOR_REWARD = 5 * 10**5; // $0.50 USDC
    
    // Structs
    struct AudioSubmission {
        address contributor;
        string language;
        string filecoinCID;
        uint256 timestamp;
        bool validated;
        uint256 qualityScore;
    }
    
    struct Validator {
        bool isActive;
        uint256 validationCount;
        uint256 reputation;
    }
    
    // Mappings
    mapping(uint256 => AudioSubmission) public submissions;
    mapping(address => Validator) public validators;
    mapping(address => uint256) public balances;
    mapping(string => uint256) public languageStats;
    
    // Events
    event AudioSubmitted(
        uint256 indexed submissionId,
        address indexed contributor,
        string language,
        string cid
    );
    
    event AudioValidated(
        uint256 indexed submissionId,
        address indexed validator,
        uint256 qualityScore
    );
    
    event RewardPaid(
        address indexed recipient,
        uint256 amount,
        string rewardType
    );
    
    event DatasetPurchased(
        address indexed buyer,
        string language,
        uint256 clipCount,
        uint256 price
    );
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyValidator() {
        require(validators[msg.sender].isActive, "Not a validator");
        _;
    }
    
    /**
     * @dev Submit audio recording
     * @param _language Language code (e.g., "twi", "swahili")
     * @param _filecoinCID IPFS/Filecoin content identifier
     */
    function submitAudio(string memory _language, string memory _filecoinCID) external {
        submissionCount++;
        
        submissions[submissionCount] = AudioSubmission({
            contributor: msg.sender,
            language: _language,
            filecoinCID: _filecoinCID,
            timestamp: block.timestamp,
            validated: false,
            qualityScore: 0
        });
        
        // Update language statistics
        languageStats[_language]++;
        
        // Pay contributor reward (in production, this would transfer USDC)
        balances[msg.sender] += CONTRIBUTOR_REWARD;
        
        emit AudioSubmitted(submissionCount, msg.sender, _language, _filecoinCID);
        emit RewardPaid(msg.sender, CONTRIBUTOR_REWARD, "contribution");
    }
    
    /**
     * @dev Validate an audio submission
     * @param _submissionId ID of the submission to validate
     * @param _qualityScore Quality score (0-100)
     */
    function validateAudio(uint256 _submissionId, uint256 _qualityScore) external onlyValidator {
        require(_submissionId <= submissionCount, "Invalid submission");
        require(!submissions[_submissionId].validated, "Already validated");
        require(_qualityScore <= 100, "Invalid quality score");
        
        submissions[_submissionId].validated = true;
        submissions[_submissionId].qualityScore = _qualityScore;
        
        // Update validator stats
        validators[msg.sender].validationCount++;
        validators[msg.sender].reputation += _qualityScore > 80 ? 1 : 0;
        
        // Pay validator reward
        balances[msg.sender] += VALIDATOR_REWARD;
        
        emit AudioValidated(_submissionId, msg.sender, _qualityScore);
        emit RewardPaid(msg.sender, VALIDATOR_REWARD, "validation");
    }
    
    /**
     * @dev Register as a validator
     */
    function becomeValidator() external {
        require(!validators[msg.sender].isActive, "Already a validator");
        
        validators[msg.sender] = Validator({
            isActive: true,
            validationCount: 0,
            reputation: 0
        });
    }
    
    /**
     * @dev Purchase dataset (simplified for MVP)
     * @param _language Language to purchase
     */
    function purchaseDataset(string memory _language) external payable {
        uint256 clipCount = languageStats[_language];
        require(clipCount > 0, "No data available");
        
        uint256 price = clipCount * 10**6; // $1 per clip
        require(msg.value >= price, "Insufficient payment");
        
        emit DatasetPurchased(msg.sender, _language, clipCount, price);
    }
    
    /**
     * @dev Get submission details
     */
    function getSubmission(uint256 _id) external view returns (
        address contributor,
        string memory language,
        string memory cid,
        uint256 timestamp,
        bool validated,
        uint256 qualityScore
    ) {
        AudioSubmission memory sub = submissions[_id];
        return (
            sub.contributor,
            sub.language,
            sub.filecoinCID,
            sub.timestamp,
            sub.validated,
            sub.qualityScore
        );
    }
    
    /**
     * @dev Get user balance
     */
    function getBalance(address _user) external view returns (uint256) {
        return balances[_user];
    }
    
    /**
     * @dev Withdraw balance (simplified for MVP)
     */
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");
        
        balances[msg.sender] = 0;
        // In production: Transfer USDC to user
        
        emit RewardPaid(msg.sender, amount, "withdrawal");
    }
}