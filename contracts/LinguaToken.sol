// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title LINGUA Token
 * @notice Governance token for LinguaDAO - The Decentralized Language Preservation Protocol
 * @dev ERC20 token with voting capabilities for DAO governance
 */
contract LinguaToken is ERC20, ERC20Burnable, ERC20Votes, ERC20Permit, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Token distribution
    uint256 public constant COMMUNITY_MINING = 400_000_000 * 10**18; // 40% - Voice mining rewards
    uint256 public constant PRESERVATION_TREASURY = 200_000_000 * 10**18; // 20% - Language preservation fund
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10**18; // 15% - Team & advisors (vested)
    uint256 public constant ECOSYSTEM_GRANTS = 150_000_000 * 10**18; // 15% - Ecosystem development
    uint256 public constant INITIAL_LIQUIDITY = 100_000_000 * 10**18; // 10% - DEX liquidity
    
    // Addresses
    address public immutable miningRewardsContract;
    address public immutable treasuryAddress;
    address public immutable teamVestingContract;
    address public immutable ecosystemFund;
    address public immutable liquidityPool;
    
    // Mining parameters
    mapping(address => uint256) public voiceMiningPower;
    mapping(string => uint256) public languageMultipliers; // Language rarity multipliers
    
    event LanguageMultiplierSet(string language, uint256 multiplier);
    event MiningPowerUpdated(address indexed user, uint256 power);
    
    constructor(
        address _miningRewards,
        address _treasury,
        address _teamVesting,
        address _ecosystem,
        address _liquidity
    ) ERC20("LinguaDAO", "LINGUA") ERC20Permit("LinguaDAO") {
        miningRewardsContract = _miningRewards;
        treasuryAddress = _treasury;
        teamVestingContract = _teamVesting;
        ecosystemFund = _ecosystem;
        liquidityPool = _liquidity;
        
        // Initial minting according to tokenomics
        _mint(_miningRewards, COMMUNITY_MINING);
        _mint(_treasury, PRESERVATION_TREASURY);
        _mint(_teamVesting, TEAM_ALLOCATION);
        _mint(_ecosystem, ECOSYSTEM_GRANTS);
        _mint(_liquidity, INITIAL_LIQUIDITY);
        
        // Set initial language multipliers (endangered languages get higher rewards)
        languageMultipliers["twi"] = 3; // 3x multiplier
        languageMultipliers["yoruba"] = 3;
        languageMultipliers["igbo"] = 3;
        languageMultipliers["xhosa"] = 4; // 4x for critically endangered
        languageMultipliers["swahili"] = 2; // 2x for widely spoken
        languageMultipliers["hausa"] = 2;
        languageMultipliers["amharic"] = 3;
        languageMultipliers["wolof"] = 4;
        languageMultipliers["zulu"] = 2;
        languageMultipliers["shona"] = 3;
    }
    
    /**
     * @notice Calculate mining rewards based on quality, language rarity, and staking
     * @param contributor Address of the contributor
     * @param language Language code of the recording
     * @param qualityScore Quality score from AI validation (0-100)
     * @param stakedAmount Amount of LINGUA staked by contributor
     */
    function calculateMiningReward(
        address contributor,
        string memory language,
        uint256 qualityScore,
        uint256 stakedAmount
    ) public view returns (uint256) {
        require(qualityScore <= 100, "Invalid quality score");
        
        uint256 baseReward = 100 * 10**18; // Base reward: 100 LINGUA
        uint256 languageBonus = languageMultipliers[language];
        if (languageBonus == 0) languageBonus = 1; // Default multiplier
        
        // Staking boost: up to 1.5x with 10,000 LINGUA staked
        uint256 stakingBoost = 100 + (stakedAmount * 50 / (10_000 * 10**18));
        if (stakingBoost > 150) stakingBoost = 150; // Cap at 1.5x
        
        uint256 reward = baseReward * qualityScore * languageBonus * stakingBoost / 10000;
        return reward;
    }
    
    /**
     * @notice Update language multipliers (governance function)
     * @param language Language code
     * @param multiplier New multiplier value (1-10)
     */
    function setLanguageMultiplier(string memory language, uint256 multiplier) external onlyOwner {
        require(multiplier > 0 && multiplier <= 10, "Invalid multiplier");
        languageMultipliers[language] = multiplier;
        emit LanguageMultiplierSet(language, multiplier);
    }
    
    /**
     * @notice Update voice mining power for a user
     * @param user User address
     * @param power New mining power value
     */
    function updateMiningPower(address user, uint256 power) external {
        require(msg.sender == miningRewardsContract, "Only mining contract");
        voiceMiningPower[user] = power;
        emit MiningPowerUpdated(user, power);
    }
    
    // Required overrides for multiple inheritance
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }
    
    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }
    
    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}