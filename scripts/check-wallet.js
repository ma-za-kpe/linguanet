const { ethers } = require("ethers");
require("dotenv").config({ path: ".env.local" });

async function main() {
  console.log("\n🔍 Checking Wallet Configuration...\n");
  
  // Get private key from environment
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  
  if (!privateKey) {
    console.error("❌ DEPLOYER_PRIVATE_KEY not found in .env.local");
    process.exit(1);
  }
  
  if (!alchemyKey) {
    console.error("❌ NEXT_PUBLIC_ALCHEMY_API_KEY not found in .env.local");
    process.exit(1);
  }
  
  try {
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);
    console.log("✅ Wallet Address:", wallet.address);
    
    // Connect to Base Sepolia
    const provider = new ethers.JsonRpcProvider(
      `https://base-sepolia.g.alchemy.com/v2/${alchemyKey}`
    );
    
    // Connect wallet to provider
    const connectedWallet = wallet.connect(provider);
    
    // Get balance
    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Balance:", ethers.formatEther(balance), "ETH");
    
    // Get network info
    const network = await provider.getNetwork();
    console.log("🌐 Network:", network.name);
    console.log("🔗 Chain ID:", network.chainId.toString());
    
    if (balance === 0n) {
      console.log("\n⚠️  Your wallet has no Base Sepolia ETH!");
      console.log("Get testnet ETH from: https://www.alchemy.com/faucets/base-sepolia");
      console.log("Your address:", wallet.address);
    } else {
      console.log("\n✅ Wallet is ready for deployment!");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();