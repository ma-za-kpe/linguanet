// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./VoiceSharesNFT.sol";

/**
 * @title Language Pools AMM
 * @notice Automated Market Maker for trading language data access rights
 * @dev Each language has its own liquidity pool for data access trading
 */
contract LanguagePoolsAMM is Ownable, ReentrancyGuard {
    
    struct LanguagePool {
        uint256 dataTokenSupply; // Total supply of data access tokens
        uint256 usdcReserve; // USDC liquidity in pool
        uint256 dataReserve; // Data tokens in pool
        uint256 totalLiquidity; // Total LP tokens issued
        uint256 feePercentage; // Trading fee (basis points)
        bool active; // Pool active status
        uint256 lastPriceUpdate; // Timestamp of last price update
        uint256 volume24h; // 24h trading volume
    }
    
    struct LiquidityPosition {
        uint256 liquidity; // LP tokens owned
        uint256 usdcDeposited; // USDC deposited
        uint256 dataDeposited; // Data tokens deposited
        uint256 rewardsClaimed; // Total rewards claimed
    }
    
    // Core mappings
    mapping(string => LanguagePool) public languagePools;
    mapping(string => mapping(address => LiquidityPosition)) public liquidityPositions;
    mapping(string => mapping(address => uint256)) public dataAccessBalance;
    
    // Contracts
    IERC20 public immutable usdcToken;
    VoiceSharesNFT public immutable voiceShares;
    
    // Constants
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public defaultFee = 30; // 0.3% default fee
    
    // Price oracle data
    mapping(string => uint256) public oraclePrices; // External price feeds
    mapping(string => uint256) public twapPrices; // Time-weighted average prices
    
    // Events
    event PoolCreated(string language, uint256 initialPrice);
    event LiquidityAdded(string language, address provider, uint256 usdcAmount, uint256 dataAmount);
    event LiquidityRemoved(string language, address provider, uint256 liquidity);
    event DataPurchased(string language, address buyer, uint256 usdcIn, uint256 dataOut);
    event DataSold(string language, address seller, uint256 dataIn, uint256 usdcOut);
    event PriceUpdated(string language, uint256 newPrice);
    
    constructor(address _usdcToken, address _voiceShares) {
        usdcToken = IERC20(_usdcToken);
        voiceShares = VoiceSharesNFT(_voiceShares);
    }
    
    /**
     * @notice Create a new language pool
     * @param language Language identifier
     * @param initialDataSupply Initial supply of data access tokens
     * @param initialPrice Initial price per data token in USDC
     */
    function createPool(
        string memory language,
        uint256 initialDataSupply,
        uint256 initialPrice
    ) external onlyOwner {
        require(!languagePools[language].active, "Pool exists");
        require(initialDataSupply > 0 && initialPrice > 0, "Invalid parameters");
        
        uint256 initialUSDC = initialDataSupply * initialPrice / 1e18;
        
        languagePools[language] = LanguagePool({
            dataTokenSupply: initialDataSupply,
            usdcReserve: initialUSDC,
            dataReserve: initialDataSupply,
            totalLiquidity: 0,
            feePercentage: defaultFee,
            active: true,
            lastPriceUpdate: block.timestamp,
            volume24h: 0
        });
        
        emit PoolCreated(language, initialPrice);
    }
    
    /**
     * @notice Add liquidity to a language pool
     * @param language Language pool to add liquidity to
     * @param usdcAmount Amount of USDC to add
     * @param maxDataAmount Maximum data tokens to add (slippage protection)
     */
    function addLiquidity(
        string memory language,
        uint256 usdcAmount,
        uint256 maxDataAmount
    ) external nonReentrant returns (uint256 liquidity) {
        LanguagePool storage pool = languagePools[language];
        require(pool.active, "Pool not active");
        
        uint256 dataAmount;
        
        if (pool.totalLiquidity == 0) {
            // First liquidity provider
            dataAmount = maxDataAmount;
            liquidity = sqrt(usdcAmount * dataAmount);
            pool.totalLiquidity = liquidity - MINIMUM_LIQUIDITY;
            // Lock minimum liquidity forever
        } else {
            // Calculate proportional data amount
            dataAmount = (usdcAmount * pool.dataReserve) / pool.usdcReserve;
            require(dataAmount <= maxDataAmount, "Slippage exceeded");
            
            // Calculate LP tokens to mint
            liquidity = (usdcAmount * pool.totalLiquidity) / pool.usdcReserve;
        }
        
        // Transfer tokens
        require(usdcToken.transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");
        
        // Update reserves
        pool.usdcReserve += usdcAmount;
        pool.dataReserve += dataAmount;
        pool.totalLiquidity += liquidity;
        
        // Update position
        LiquidityPosition storage position = liquidityPositions[language][msg.sender];
        position.liquidity += liquidity;
        position.usdcDeposited += usdcAmount;
        position.dataDeposited += dataAmount;
        
        emit LiquidityAdded(language, msg.sender, usdcAmount, dataAmount);
        
        return liquidity;
    }
    
    /**
     * @notice Remove liquidity from a pool
     * @param language Language pool
     * @param liquidity Amount of LP tokens to burn
     */
    function removeLiquidity(
        string memory language,
        uint256 liquidity
    ) external nonReentrant returns (uint256 usdcAmount, uint256 dataAmount) {
        LanguagePool storage pool = languagePools[language];
        LiquidityPosition storage position = liquidityPositions[language][msg.sender];
        
        require(position.liquidity >= liquidity, "Insufficient liquidity");
        
        // Calculate proportional amounts
        usdcAmount = (liquidity * pool.usdcReserve) / pool.totalLiquidity;
        dataAmount = (liquidity * pool.dataReserve) / pool.totalLiquidity;
        
        // Update reserves
        pool.usdcReserve -= usdcAmount;
        pool.dataReserve -= dataAmount;
        pool.totalLiquidity -= liquidity;
        
        // Update position
        position.liquidity -= liquidity;
        
        // Transfer tokens
        require(usdcToken.transfer(msg.sender, usdcAmount), "USDC transfer failed");
        dataAccessBalance[language][msg.sender] += dataAmount;
        
        emit LiquidityRemoved(language, msg.sender, liquidity);
        
        return (usdcAmount, dataAmount);
    }
    
    /**
     * @notice Buy data access tokens with USDC
     * @param language Language data to purchase
     * @param usdcIn Amount of USDC to spend
     * @param minDataOut Minimum data tokens expected (slippage protection)
     */
    function buyData(
        string memory language,
        uint256 usdcIn,
        uint256 minDataOut
    ) external nonReentrant returns (uint256 dataOut) {
        LanguagePool storage pool = languagePools[language];
        require(pool.active, "Pool not active");
        
        // Calculate output amount using constant product formula
        uint256 usdcInWithFee = usdcIn * (FEE_DENOMINATOR - pool.feePercentage) / FEE_DENOMINATOR;
        uint256 numerator = usdcInWithFee * pool.dataReserve;
        uint256 denominator = pool.usdcReserve + usdcInWithFee;
        dataOut = numerator / denominator;
        
        require(dataOut >= minDataOut, "Slippage exceeded");
        require(dataOut <= pool.dataReserve / 10, "Trade too large"); // Max 10% of reserves
        
        // Transfer USDC
        require(usdcToken.transferFrom(msg.sender, address(this), usdcIn), "USDC transfer failed");
        
        // Update reserves
        pool.usdcReserve += usdcIn;
        pool.dataReserve -= dataOut;
        pool.volume24h += usdcIn;
        
        // Give user data access
        dataAccessBalance[language][msg.sender] += dataOut;
        
        // Update TWAP
        _updateTWAP(language);
        
        emit DataPurchased(language, msg.sender, usdcIn, dataOut);
        
        return dataOut;
    }
    
    /**
     * @notice Sell data access tokens for USDC
     * @param language Language data to sell
     * @param dataIn Amount of data tokens to sell
     * @param minUsdcOut Minimum USDC expected (slippage protection)
     */
    function sellData(
        string memory language,
        uint256 dataIn,
        uint256 minUsdcOut
    ) external nonReentrant returns (uint256 usdcOut) {
        require(dataAccessBalance[language][msg.sender] >= dataIn, "Insufficient balance");
        
        LanguagePool storage pool = languagePools[language];
        require(pool.active, "Pool not active");
        
        // Calculate output amount
        uint256 dataInWithFee = dataIn * (FEE_DENOMINATOR - pool.feePercentage) / FEE_DENOMINATOR;
        uint256 numerator = dataInWithFee * pool.usdcReserve;
        uint256 denominator = pool.dataReserve + dataInWithFee;
        usdcOut = numerator / denominator;
        
        require(usdcOut >= minUsdcOut, "Slippage exceeded");
        
        // Update balances
        dataAccessBalance[language][msg.sender] -= dataIn;
        
        // Update reserves
        pool.dataReserve += dataIn;
        pool.usdcReserve -= usdcOut;
        pool.volume24h += usdcOut;
        
        // Transfer USDC
        require(usdcToken.transfer(msg.sender, usdcOut), "USDC transfer failed");
        
        // Update TWAP
        _updateTWAP(language);
        
        emit DataSold(language, msg.sender, dataIn, usdcOut);
        
        return usdcOut;
    }
    
    /**
     * @notice Get current price for a language's data
     * @param language Language to query
     */
    function getPrice(string memory language) public view returns (uint256) {
        LanguagePool memory pool = languagePools[language];
        if (pool.dataReserve == 0) return 0;
        
        // Price = USDC reserve / Data reserve
        return (pool.usdcReserve * 1e18) / pool.dataReserve;
    }
    
    /**
     * @notice Calculate output for a given input
     * @param usdcIn USDC input amount
     * @param reserveIn Input reserve
     * @param reserveOut Output reserve
     * @param fee Fee percentage
     */
    function getAmountOut(
        uint256 usdcIn,
        uint256 reserveIn,
        uint256 reserveOut,
        uint256 fee
    ) public pure returns (uint256) {
        uint256 amountInWithFee = usdcIn * (FEE_DENOMINATOR - fee) / FEE_DENOMINATOR;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = reserveIn + amountInWithFee;
        return numerator / denominator;
    }
    
    /**
     * @notice Update time-weighted average price
     * @param language Language pool to update
     */
    function _updateTWAP(string memory language) internal {
        LanguagePool storage pool = languagePools[language];
        
        uint256 timeElapsed = block.timestamp - pool.lastPriceUpdate;
        if (timeElapsed > 0) {
            uint256 currentPrice = getPrice(language);
            
            // Simple TWAP: weighted average of old and new price
            uint256 weight = timeElapsed > 3600 ? 3600 : timeElapsed; // Max 1 hour weight
            twapPrices[language] = (twapPrices[language] * (3600 - weight) + currentPrice * weight) / 3600;
            
            pool.lastPriceUpdate = block.timestamp;
            emit PriceUpdated(language, currentPrice);
        }
    }
    
    /**
     * @notice Square root helper function
     */
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}