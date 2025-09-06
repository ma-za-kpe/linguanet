import hre from "hardhat";
import fs from "fs";
import path from "path";

// Set network to base-sepolia
process.env.HARDHAT_NETWORK = "base-sepolia";

// Color codes for console logging
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message: string, type: "info" | "success" | "error" | "warning" = "info") {
  const prefix = {
    info: `${colors.blue}[INFO]${colors.reset}`,
    success: `${colors.green}✓ [SUCCESS]${colors.reset}`,
    error: `${colors.red}✗ [ERROR]${colors.reset}`,
    warning: `${colors.yellow}⚠ [WARNING]${colors.reset}`,
  };
  console.log(`${prefix[type]} ${message}`);
}

async function main() {
  console.log(`\n${colors.bright}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}LINGUADAO DEPLOYMENT TO BASE SEPOLIA${colors.reset}`);
  console.log(`${colors.bright}${"=".repeat(60)}${colors.reset}\n`);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  log(`Deploying with account: ${deployer.address}`, "info");

  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  log(`Account balance: ${hre.ethers.formatEther(balance)} ETH`, "info");

  if (balance === 0n) {
    log("Insufficient balance! Please fund your wallet with Base Sepolia ETH", "error");
    log("Get testnet ETH from: https://www.alchemy.com/faucets/base-sepolia", "warning");
    process.exit(1);
  }

  const contracts: any = {};

  try {
    // 1. Deploy LinguaToken
    log("\n📜 Deploying LinguaToken...", "info");
    const LinguaToken = await hre.ethers.getContractFactory("LinguaToken");
    
    // For now, use the deployer address for all addresses
    // In production, these would be separate addresses
    const linguaToken = await LinguaToken.deploy(
      deployer.address, // miningRewards
      deployer.address, // treasury
      deployer.address, // teamVesting
      deployer.address, // ecosystem
      deployer.address  // liquidity
    );
    await linguaToken.waitForDeployment();
    contracts.linguaToken = await linguaToken.getAddress();
    log(`LinguaToken deployed to: ${contracts.linguaToken}`, "success");

    // 2. Deploy VoiceSharesNFT
    log("\n🎨 Deploying VoiceSharesNFT...", "info");
    const VoiceSharesNFT = await hre.ethers.getContractFactory("VoiceSharesNFT");
    const voiceSharesNFT = await VoiceSharesNFT.deploy(deployer.address);
    await voiceSharesNFT.waitForDeployment();
    contracts.voiceSharesNFT = await voiceSharesNFT.getAddress();
    log(`VoiceSharesNFT deployed to: ${contracts.voiceSharesNFT}`, "success");

    // 3. Deploy LinguaDAO
    log("\n🗳️ Deploying LinguaDAO...", "info");
    const LinguaDAO = await hre.ethers.getContractFactory("LinguaDAO");
    const linguaDAO = await LinguaDAO.deploy(
      contracts.linguaToken,
      contracts.voiceSharesNFT
    );
    await linguaDAO.waitForDeployment();
    contracts.linguaDAO = await linguaDAO.getAddress();
    log(`LinguaDAO deployed to: ${contracts.linguaDAO}`, "success");

    // 4. Deploy LanguagePoolsAMM
    log("\n💱 Deploying LanguagePoolsAMM...", "info");
    const LanguagePoolsAMM = await hre.ethers.getContractFactory("LanguagePoolsAMM");
    const languagePoolsAMM = await LanguagePoolsAMM.deploy(
      "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
      contracts.voiceSharesNFT
    );
    await languagePoolsAMM.waitForDeployment();
    contracts.languagePoolsAMM = await languagePoolsAMM.getAddress();
    log(`LanguagePoolsAMM deployed to: ${contracts.languagePoolsAMM}`, "success");

    // 5. Deploy ExtinctionInsurance
    log("\n🛡️ Deploying ExtinctionInsurance...", "info");
    const ExtinctionInsurance = await hre.ethers.getContractFactory("ExtinctionInsurance");
    const extinctionInsurance = await ExtinctionInsurance.deploy(
      "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
      contracts.linguaToken,
      contracts.voiceSharesNFT
    );
    await extinctionInsurance.waitForDeployment();
    contracts.extinctionInsurance = await extinctionInsurance.getAddress();
    log(`ExtinctionInsurance deployed to: ${contracts.extinctionInsurance}`, "success");

    // Update .env.local file
    log("\n📝 Updating .env.local with contract addresses...", "info");
    updateEnvFile(contracts);
    log("Environment file updated!", "success");

    // Save deployment info
    const deploymentInfo = {
      network: "Base Sepolia",
      chainId: 84532,
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: contracts,
      blockNumber: await deployer.provider.getBlockNumber(),
    };

    const deploymentsDir = path.join(process.cwd(), "deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir);
    }

    const filename = `deployment-${Date.now()}.json`;
    fs.writeFileSync(
      path.join(deploymentsDir, filename),
      JSON.stringify(deploymentInfo, null, 2)
    );
    log(`Deployment info saved to deployments/${filename}`, "success");

    // Summary
    console.log(`\n${colors.bright}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.bright}DEPLOYMENT SUMMARY${colors.reset}`);
    console.log(`${colors.bright}${"=".repeat(60)}${colors.reset}\n`);

    console.table({
      "LinguaToken": contracts.linguaToken,
      "VoiceSharesNFT": contracts.voiceSharesNFT,
      "LinguaDAO": contracts.linguaDAO,
      "LanguagePoolsAMM": contracts.languagePoolsAMM,
      "ExtinctionInsurance": contracts.extinctionInsurance,
    });

    console.log(`\n${colors.green}✅ All contracts deployed successfully!${colors.reset}`);
    console.log(`\n${colors.cyan}Next Steps:${colors.reset}`);
    console.log("1. Verify contracts on BaseScan");
    console.log("2. Initialize language pools in AMM");
    console.log("3. Set up insurance pools");
    console.log("4. Configure DAO parameters");
    console.log("5. Test voice mining flow");

  } catch (error: any) {
    log(`Deployment failed: ${error.message}`, "error");
    console.error(error);
    process.exit(1);
  }
}

function updateEnvFile(contracts: any) {
  const envPath = path.join(process.cwd(), ".env.local");
  let envContent = fs.readFileSync(envPath, "utf8");

  // Update contract addresses
  envContent = envContent.replace(
    /NEXT_PUBLIC_LINGUA_TOKEN_ADDRESS=.*/,
    `NEXT_PUBLIC_LINGUA_TOKEN_ADDRESS=${contracts.linguaToken}`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_VOICE_SHARES_NFT_ADDRESS=.*/,
    `NEXT_PUBLIC_VOICE_SHARES_NFT_ADDRESS=${contracts.voiceSharesNFT}`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_LINGUA_DAO_ADDRESS=.*/,
    `NEXT_PUBLIC_LINGUA_DAO_ADDRESS=${contracts.linguaDAO}`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_LANGUAGE_POOLS_AMM_ADDRESS=.*/,
    `NEXT_PUBLIC_LANGUAGE_POOLS_AMM_ADDRESS=${contracts.languagePoolsAMM}`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_EXTINCTION_INSURANCE_ADDRESS=.*/,
    `NEXT_PUBLIC_EXTINCTION_INSURANCE_ADDRESS=${contracts.extinctionInsurance}`
  );

  fs.writeFileSync(envPath, envContent);
}

// Run deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });