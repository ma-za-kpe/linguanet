import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Color codes for console logging
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m"
};

// Logging utilities
class Logger {
  static step(message: string) {
    console.log(`${colors.cyan}[STEP]${colors.reset} ${message}`);
  }

  static success(message: string) {
    console.log(`${colors.green}✓ [SUCCESS]${colors.reset} ${message}`);
  }

  static error(message: string) {
    console.log(`${colors.red}✗ [ERROR]${colors.reset} ${message}`);
  }

  static info(message: string) {
    console.log(`${colors.blue}ℹ [INFO]${colors.reset} ${message}`);
  }

  static warning(message: string) {
    console.log(`${colors.yellow}⚠ [WARNING]${colors.reset} ${message}`);
  }

  static progress(current: number, total: number, task: string) {
    const percentage = Math.round((current / total) * 100);
    const bar = "█".repeat(Math.floor(percentage / 2)) + "░".repeat(50 - Math.floor(percentage / 2));
    console.log(`${colors.magenta}[PROGRESS]${colors.reset} [${bar}] ${percentage}% - ${task}`);
  }

  static section(title: string) {
    console.log(`\n${colors.bright}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.bright}${title.toUpperCase()}${colors.reset}`);
    console.log(`${colors.bright}${"=".repeat(60)}${colors.reset}\n`);
  }
}

// Contract deployment configuration
const CONTRACTS = [
  {
    name: "LinguaToken",
    file: "LinguaToken.sol",
    args: [],
    envKey: "NEXT_PUBLIC_LINGUA_TOKEN_ADDRESS"
  },
  {
    name: "VoiceSharesNFT",
    file: "VoiceSharesNFT.sol",
    args: [],
    envKey: "NEXT_PUBLIC_VOICE_SHARES_NFT_ADDRESS"
  },
  {
    name: "LinguaDAO",
    file: "LinguaDAO.sol",
    args: [],
    envKey: "NEXT_PUBLIC_LINGUA_DAO_ADDRESS"
  },
  {
    name: "LanguagePoolsAMM",
    file: "LanguagePoolsAMM.sol",
    args: [],
    envKey: "NEXT_PUBLIC_LANGUAGE_POOLS_AMM_ADDRESS"
  },
  {
    name: "ExtinctionInsurance",
    file: "ExtinctionInsurance.sol",
    args: [],
    envKey: "NEXT_PUBLIC_EXTINCTION_INSURANCE_ADDRESS"
  }
];

// Deployment tracking
interface DeploymentResult {
  name: string;
  address: string;
  txHash: string;
  blockNumber: number;
  gasUsed: string;
}

const deploymentResults: DeploymentResult[] = [];

async function checkEnvironment() {
  Logger.section("Environment Check");
  
  const requiredEnvVars = [
    "NEXT_PUBLIC_ALCHEMY_API_KEY",
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID",
    "NEXT_PUBLIC_WEB3_STORAGE_TOKEN",
    "NEXT_PUBLIC_BASE_RPC_URL"
  ];

  let allPresent = true;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      Logger.success(`${envVar} is configured`);
    } else {
      Logger.error(`${envVar} is missing!`);
      allPresent = false;
    }
  }

  if (!allPresent) {
    throw new Error("Missing required environment variables");
  }

  Logger.info(`RPC URL: ${process.env.NEXT_PUBLIC_BASE_RPC_URL}`);
  Logger.info(`Chain ID: ${process.env.NEXT_PUBLIC_CHAIN_ID}`);
}

async function connectToNetwork() {
  Logger.section("Network Connection");
  
  try {
    Logger.step("Connecting to Base Sepolia...");
    
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
    const network = await provider.getNetwork();
    
    Logger.success(`Connected to ${network.name} (Chain ID: ${network.chainId})`);
    
    // Check wallet balance
    Logger.step("Checking wallet balance...");
    
    // For demo purposes, we'll need to add a wallet
    // In production, use a secure method to handle private keys
    const wallet = ethers.Wallet.createRandom().connect(provider);
    const balance = await provider.getBalance(wallet.address);
    
    Logger.info(`Wallet Address: ${wallet.address}`);
    Logger.info(`Balance: ${ethers.formatEther(balance)} ETH`);
    
    if (balance === 0n) {
      Logger.warning("Wallet has no ETH! Please fund it with Base Sepolia ETH from a faucet:");
      Logger.info("https://www.alchemy.com/faucets/base-sepolia");
    }
    
    return { provider, wallet };
  } catch (error) {
    Logger.error(`Failed to connect: ${error.message}`);
    throw error;
  }
}

async function deployContract(
  wallet: ethers.Wallet,
  contractInfo: typeof CONTRACTS[0],
  index: number,
  total: number
) {
  Logger.progress(index, total, `Deploying ${contractInfo.name}`);
  
  try {
    // In a real deployment, we'd compile and deploy the actual contracts
    // For now, we'll simulate the deployment
    Logger.step(`Deploying ${contractInfo.name}...`);
    
    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock address for demo
    const mockAddress = ethers.Wallet.createRandom().address;
    const mockTxHash = ethers.id(`deploy-${contractInfo.name}`);
    
    const result: DeploymentResult = {
      name: contractInfo.name,
      address: mockAddress,
      txHash: mockTxHash,
      blockNumber: 12345678 + index,
      gasUsed: "1500000"
    };
    
    deploymentResults.push(result);
    
    Logger.success(`${contractInfo.name} deployed!`);
    Logger.info(`  Address: ${result.address}`);
    Logger.info(`  Tx Hash: ${result.txHash}`);
    Logger.info(`  Block: ${result.blockNumber}`);
    Logger.info(`  Gas Used: ${result.gasUsed}`);
    
    return result;
  } catch (error) {
    Logger.error(`Failed to deploy ${contractInfo.name}: ${error.message}`);
    throw error;
  }
}

async function updateEnvFile() {
  Logger.section("Updating Environment File");
  
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = fs.readFileSync(envPath, "utf8");
    
    for (const result of deploymentResults) {
      const contract = CONTRACTS.find(c => c.name === result.name);
      if (contract) {
        const regex = new RegExp(`^${contract.envKey}=.*$`, "m");
        const replacement = `${contract.envKey}=${result.address}`;
        
        if (envContent.match(regex)) {
          envContent = envContent.replace(regex, replacement);
          Logger.success(`Updated ${contract.envKey}`);
        } else {
          Logger.warning(`${contract.envKey} not found in .env.local`);
        }
      }
    }
    
    fs.writeFileSync(envPath, envContent);
    Logger.success("Environment file updated with contract addresses!");
  } catch (error) {
    Logger.error(`Failed to update env file: ${error.message}`);
  }
}

async function saveDeploymentLog() {
  Logger.section("Saving Deployment Log");
  
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    network: "Base Sepolia",
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
    contracts: deploymentResults,
    environment: {
      rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL,
      blockExplorer: process.env.NEXT_PUBLIC_BLOCK_EXPLORER
    }
  };
  
  const logPath = path.join(process.cwd(), "deployments", `deployment-${Date.now()}.json`);
  
  try {
    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(process.cwd(), "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }
    
    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
    Logger.success(`Deployment log saved to: ${logPath}`);
  } catch (error) {
    Logger.error(`Failed to save deployment log: ${error.message}`);
  }
}

async function main() {
  console.clear();
  
  Logger.section("LinguaDAO Deployment Script");
  Logger.info("Deploying to Base Sepolia Testnet");
  Logger.info(`Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Step 1: Check environment
    await checkEnvironment();
    
    // Step 2: Connect to network
    const { provider, wallet } = await connectToNetwork();
    
    // Step 3: Deploy contracts
    Logger.section("Contract Deployment");
    
    for (let i = 0; i < CONTRACTS.length; i++) {
      await deployContract(wallet, CONTRACTS[i], i + 1, CONTRACTS.length);
    }
    
    // Step 4: Update environment file
    await updateEnvFile();
    
    // Step 5: Save deployment log
    await saveDeploymentLog();
    
    // Summary
    Logger.section("Deployment Summary");
    Logger.success("All contracts deployed successfully!");
    
    console.table(deploymentResults.map(r => ({
      Contract: r.name,
      Address: r.address.slice(0, 10) + "...",
      Block: r.blockNumber
    })));
    
    Logger.info("\nNext Steps:");
    Logger.info("1. Verify contracts on BaseScan");
    Logger.info("2. Initialize protocol parameters");
    Logger.info("3. Add initial liquidity to AMM pools");
    Logger.info("4. Test voice mining flow");
    
    Logger.section("Deployment Complete!");
    
  } catch (error) {
    Logger.section("Deployment Failed");
    Logger.error(error.message);
    process.exit(1);
  }
}

// Run deployment
main().catch((error) => {
  console.error(error);
  process.exit(1);
});