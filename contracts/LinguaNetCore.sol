// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title LinguaNet Core Contract
 * @dev Main contract for African language data marketplace on Base L2
 */
contract LinguaNetCore is Ownable, ReentrancyGuard {
    IERC20 public immutable usdcToken;
    
    // Constants
    uint256 public constant SUBMISSION_REWARD = 3 * 10**6; // $3 USDC (6 decimals)
    uint256 public constant VALIDATION_REWARD = 5 * 10**5; // $0.50 USDC
    uint256 public constant PLATFORM_FEE_PERCENT = 10; // 10% platform fee
    uint256 public constant MIN_AUDIO_DURATION = 30; // 30 seconds minimum
    
    // Structs
    struct AudioSubmission {
        address contributor;
        string language;
        string cid; // IPFS/Filecoin CID
        uint256 duration;
        uint256 timestamp;
        bool validated;
        uint256 quality;
    }
    
    struct Contributor {
        uint256 submissions;
        uint256 validations;
        uint256 earnings;
        uint256 reputation;
        string ensName;
        bool isValidator;
    }
    
    struct Language {
        uint256 totalClips;
        uint256 totalDuration;
        uint256 totalContributors;
        uint256 basePrice;
        mapping(address => bool) contributors;
    }
    
    // State variables
    mapping(string => AudioSubmission) public audioSubmissions;
    mapping(address => Contributor) public contributors;
    mapping(string => Language) public languages;
    mapping(address => uint256) public pendingWithdrawals;
    
    string[] public supportedLanguages;
    address[] public validators;
    
    // Events
    event AudioSubmitted(
        address indexed contributor,
        string language,
        string cid,
        uint256 reward
    );
    
    event AudioValidated(
        address indexed validator,
        string cid,
        bool isValid,
        uint256 reward
    );
    
    event DatasetPurchased(
        address indexed buyer,
        string language,
        uint256 amount
    );
    
    event WithdrawalToMobileMoney(
        address indexed user,
        uint256 amount,
        string phoneNumber,
        string provider
    );
    
    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        
        // Initialize supported languages
        supportedLanguages.push("twi");
        supportedLanguages.push("swahili");
        supportedLanguages.push("yoruba");
        supportedLanguages.push("hausa");
        supportedLanguages.push("amharic");
        supportedLanguages.push("zulu");
        supportedLanguages.push("igbo");
        supportedLanguages.push("wolof");
        supportedLanguages.push("lingala");
        supportedLanguages.push("luganda");
        supportedLanguages.push("shona");
        supportedLanguages.push("tigrinya");
    }
    
    /**
     * @dev Submit audio recording for a language
     */
    function submitAudio(
        string calldata _language,
        string calldata _cid,
        uint256 _duration
    ) external {
        require(_duration >= MIN_AUDIO_DURATION, "Audio too short");
        require(bytes(_cid).length > 0, "Invalid CID");
        require(isLanguageSupported(_language), "Language not supported");
        
        // Store submission
        audioSubmissions[_cid] = AudioSubmission({
            contributor: msg.sender,
            language: _language,
            cid: _cid,
            duration: _duration,
            timestamp: block.timestamp,
            validated: false,
            quality: 0
        });
        
        // Update contributor stats
        Contributor storage contributor = contributors[msg.sender];
        contributor.submissions++;
        
        // Update language stats
        Language storage lang = languages[_language];
        lang.totalClips++;
        lang.totalDuration += _duration;
        if (!lang.contributors[msg.sender]) {
            lang.contributors[msg.sender] = true;
            lang.totalContributors++;
        }
        
        // Add reward to pending withdrawals
        pendingWithdrawals[msg.sender] += SUBMISSION_REWARD;
        contributor.earnings += SUBMISSION_REWARD;
        
        emit AudioSubmitted(msg.sender, _language, _cid, SUBMISSION_REWARD);
    }
    
    /**
     * @dev Validate submitted audio
     */
    function validateAudio(string calldata _cid, bool _isValid) external {
        require(contributors[msg.sender].isValidator, "Not a validator");
        AudioSubmission storage submission = audioSubmissions[_cid];
        require(!submission.validated, "Already validated");
        require(submission.contributor != msg.sender, "Cannot self-validate");
        
        submission.validated = true;
        submission.quality = _isValid ? 95 : 0; // Simple quality score
        
        // Reward validator
        Contributor storage validator = contributors[msg.sender];
        validator.validations++;
        pendingWithdrawals[msg.sender] += VALIDATION_REWARD;
        validator.earnings += VALIDATION_REWARD;
        
        // Update contributor reputation
        if (_isValid) {
            contributors[submission.contributor].reputation += 10;
        }
        
        emit AudioValidated(msg.sender, _cid, _isValid, VALIDATION_REWARD);
    }
    
    /**
     * @dev Purchase dataset for a language
     */
    function purchaseDataset(string calldata _language) external payable nonReentrant {
        Language storage lang = languages[_language];
        require(lang.totalClips > 0, "No data available");
        
        uint256 price = calculateDatasetPrice(_language);
        require(
            usdcToken.transferFrom(msg.sender, address(this), price),
            "Payment failed"
        );
        
        // Distribute funds: 90% to treasury for contributors, 10% platform fee
        uint256 platformFee = (price * PLATFORM_FEE_PERCENT) / 100;
        uint256 contributorShare = price - platformFee;
        
        // In production, this would trigger dataset access via API
        emit DatasetPurchased(msg.sender, _language, price);
    }
    
    /**
     * @dev Withdraw earnings to wallet
     */
    function withdrawEarnings() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No pending earnings");
        
        pendingWithdrawals[msg.sender] = 0;
        require(usdcToken.transfer(msg.sender, amount), "Transfer failed");
    }
    
    /**
     * @dev Withdraw to mobile money (simulated)
     */
    function withdrawToMobileMoney(
        string calldata _phoneNumber,
        string calldata _provider
    ) external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No pending earnings");
        
        pendingWithdrawals[msg.sender] = 0;
        
        // In production, this would trigger mobile money API
        // For now, emit event for off-chain processing
        emit WithdrawalToMobileMoney(msg.sender, amount, _phoneNumber, _provider);
        
        // Transfer to treasury for manual processing
        require(usdcToken.transfer(owner(), amount), "Transfer failed");
    }
    
    /**
     * @dev Register as a validator
     */
    function registerValidator() external {
        require(!contributors[msg.sender].isValidator, "Already a validator");
        require(contributors[msg.sender].submissions >= 10, "Need 10 submissions first");
        
        contributors[msg.sender].isValidator = true;
        validators.push(msg.sender);
    }
    
    /**
     * @dev Calculate dataset price based on clips
     */
    function calculateDatasetPrice(string calldata _language) public view returns (uint256) {
        Language storage lang = languages[_language];
        // $1 per clip in USDC (6 decimals)
        return lang.totalClips * 10**6;
    }
    
    /**
     * @dev Check if language is supported
     */
    function isLanguageSupported(string calldata _language) public view returns (bool) {
        for (uint i = 0; i < supportedLanguages.length; i++) {
            if (keccak256(bytes(supportedLanguages[i])) == keccak256(bytes(_language))) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get contributor statistics
     */
    function getContributorStats(address _contributor) external view returns (
        uint256 submissions,
        uint256 earnings,
        uint256 reputation
    ) {
        Contributor memory contributor = contributors[_contributor];
        return (contributor.submissions, contributor.earnings, contributor.reputation);
    }
    
    /**
     * @dev Get language statistics
     */
    function getLanguageStats(string calldata _language) external view returns (
        uint256 clips,
        uint256 duration,
        uint256 contributorCount,
        uint256 price
    ) {
        Language storage lang = languages[_language];
        return (
            lang.totalClips,
            lang.totalDuration,
            lang.totalContributors,
            calculateDatasetPrice(_language)
        );
    }
}