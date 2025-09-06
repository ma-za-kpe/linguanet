import fs from "fs";
import path from "path";

// Color codes for console logging
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function displayContracts() {
  console.log(`\n${colors.bright}${colors.cyan}${"=".repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}          LINGUADAO DEPLOYED CONTRACT ADDRESSES${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);

  // Read from .env.local
  const envPath = path.join(process.cwd(), ".env.local");
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const lines = envContent.split("\n");
    
    const contracts = {
      "🪙  LinguaToken (LINGUA)": "",
      "🎨  VoiceShares NFT": "",
      "🗳️  LinguaDAO": "",
      "💱  Language Pools AMM": "",
      "🛡️  Extinction Insurance": "",
      "💵  USDC (Base Sepolia)": ""
    };
    
    lines.forEach(line => {
      if (line.includes("NEXT_PUBLIC_LINGUA_TOKEN_ADDRESS=")) {
        contracts["🪙  LinguaToken (LINGUA)"] = line.split("=")[1];
      } else if (line.includes("NEXT_PUBLIC_VOICE_SHARES_NFT_ADDRESS=")) {
        contracts["🎨  VoiceShares NFT"] = line.split("=")[1];
      } else if (line.includes("NEXT_PUBLIC_LINGUA_DAO_ADDRESS=")) {
        contracts["🗳️  LinguaDAO"] = line.split("=")[1];
      } else if (line.includes("NEXT_PUBLIC_LANGUAGE_POOLS_AMM_ADDRESS=")) {
        contracts["💱  Language Pools AMM"] = line.split("=")[1];
      } else if (line.includes("NEXT_PUBLIC_EXTINCTION_INSURANCE_ADDRESS=")) {
        contracts["🛡️  Extinction Insurance"] = line.split("=")[1];
      } else if (line.includes("NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=")) {
        contracts["💵  USDC (Base Sepolia)"] = line.split("=")[1];
      }
    });
    
    // Display contracts
    Object.entries(contracts).forEach(([name, address]) => {
      if (address) {
        console.log(`${colors.bright}${name}${colors.reset}`);
        console.log(`${colors.green}  ${address}${colors.reset}`);
        console.log(`${colors.blue}  View on BaseScan: https://sepolia.basescan.org/address/${address}${colors.reset}\n`);
      }
    });
  }
  
  // Also read latest deployment file
  const deploymentsDir = path.join(process.cwd(), "deployments");
  if (fs.existsSync(deploymentsDir)) {
    const files = fs.readdirSync(deploymentsDir);
    if (files.length > 0) {
      // Get the most recent deployment file
      const latestFile = files.sort().reverse()[0];
      const deploymentPath = path.join(deploymentsDir, latestFile);
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
      
      console.log(`${colors.bright}${colors.yellow}📋 Deployment Info:${colors.reset}`);
      console.log(`${colors.yellow}  Network: ${deployment.network}${colors.reset}`);
      console.log(`${colors.yellow}  Chain ID: ${deployment.chainId}${colors.reset}`);
      console.log(`${colors.yellow}  Deployer: ${deployment.deployer}${colors.reset}`);
      console.log(`${colors.yellow}  Block: ${deployment.blockNumber}${colors.reset}`);
      console.log(`${colors.yellow}  Timestamp: ${deployment.timestamp}${colors.reset}\n`);
    }
  }
  
  // Display useful commands
  console.log(`${colors.bright}${colors.magenta}📝 Useful Commands:${colors.reset}`);
  console.log(`${colors.magenta}  npm run compile          - Compile contracts${colors.reset}`);
  console.log(`${colors.magenta}  npm run deploy           - Deploy to testnet${colors.reset}`);
  console.log(`${colors.magenta}  npm run verify           - Verify on BaseScan${colors.reset}`);
  console.log(`${colors.magenta}  npm run test             - Run tests${colors.reset}\n`);
  
  // Display next steps
  console.log(`${colors.bright}${colors.cyan}🚀 Next Steps:${colors.reset}`);
  console.log(`${colors.cyan}  1. Get Base Sepolia ETH from: https://www.alchemy.com/faucets/base-sepolia${colors.reset}`);
  console.log(`${colors.cyan}  2. Deploy to actual Base Sepolia network${colors.reset}`);
  console.log(`${colors.cyan}  3. Verify contracts on BaseScan${colors.reset}`);
  console.log(`${colors.cyan}  4. Initialize language pools${colors.reset}`);
  console.log(`${colors.cyan}  5. Test voice mining flow${colors.reset}\n`);
  
  console.log(`${colors.bright}${colors.cyan}${"=".repeat(70)}${colors.reset}\n`);
}

// Run the display
displayContracts();