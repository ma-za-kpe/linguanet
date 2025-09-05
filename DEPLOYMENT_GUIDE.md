# 🚀 LinguaNet Deployment Guide for ETHAccra 2025

## Quick Deploy Checklist (Do This NOW!)

### 1. Frontend Deployment (Vercel) - 5 minutes
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Deploy to Vercel
vercel --prod

# You'll get: https://linguanet.vercel.app
```

**Environment Variables to Add in Vercel Dashboard:**
```
NEXT_PUBLIC_BASE_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_DEMO_MODE=true
```

### 2. Smart Contract Deployment (Base Sepolia) - 10 minutes

**Option A: Use Remix (Fastest for Demo)**
1. Go to https://remix.ethereum.org
2. Copy `contracts/LinguaNet.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Base Sepolia
5. Get contract address

**Option B: Use Hardhat**
```bash
# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Deploy
npx hardhat run scripts/deploy.js --network base-sepolia
```

### 3. Get Free Testnet Tokens
- **Base Sepolia ETH**: https://www.alchemy.com/faucets/base-sepolia
- **USDC Test Tokens**: Use Base Bridge

### 4. Essential API Keys (Get These NOW!)

**WalletConnect (Required for Wallet Connections)**
1. Go to https://cloud.walletconnect.com
2. Create project
3. Copy Project ID

**Alchemy (For Base RPC)**
1. Go to https://alchemy.com
2. Create app for Base Sepolia
3. Copy API key

**Web3.Storage (For Filecoin)**
1. Go to https://web3.storage
2. Create account
3. Generate API token

### 5. Update Environment Variables

Create `.env.production` file:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_FILECOIN_API_KEY=your_web3storage_token
NEXT_PUBLIC_LINGUANET_CONTRACT_ADDRESS=0x... # After deployment
NEXT_PUBLIC_BASE_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
```

## 📱 Demo URLs Structure

After deployment, you'll have:
- **Main App**: https://linguanet.vercel.app
- **Pitch Deck**: https://linguanet.vercel.app/pitch
- **Contributor App**: https://linguanet.vercel.app/contribute
- **AI Dashboard**: https://linguanet.vercel.app/dashboard

## 🎯 Hackathon Presentation Setup

### Live Demo Devices
1. **Phone 1** (Contributor): Open /contribute on mobile
2. **Phone 2** (Validator): Open /contribute in validator mode
3. **Laptop** (AI Company): Open /dashboard
4. **Presentation Screen**: Open /pitch

### Demo Flow Script
```
1. Start with pitch deck slide 1
2. Switch to Phone 1 - Show recording flow
3. Switch to Phone 2 - Show validation
4. Switch to Laptop - Purchase dataset
5. Show Base Sepolia explorer with transactions
6. Back to pitch deck for closing
```

## 🏆 Bounty Verification Links

Prepare these for judges:

### ENS Bounty ($4,800)
- Show ENS subdomain: `kofi.linguanet.eth`
- Link to ENS app showing your domain

### Base Bounty ($3,000)
- Contract on Base Sepolia: `https://sepolia.basescan.org/address/YOUR_CONTRACT`
- Transaction history showing payments

### Filecoin Bounty ($500)
- Show IPFS CID in contract
- Link to stored audio: `https://w3s.link/ipfs/YOUR_CID`

### EFP Bounty ($1,000)
- Show reputation scores in UI
- Display EFP badges on profiles

### Buidl Guidl Bounty ($1,000)
- GitHub repo with Scaffold-ETH 2 usage
- Show clean component structure

## 🔥 Last Minute Optimizations

### Performance
```bash
# Build and analyze bundle
npm run build
npm run analyze

# Optimize images
npm install --save-dev @next/optimized-images
```

### SEO & Meta Tags
Add to `app/layout.tsx`:
```tsx
export const metadata = {
  title: 'LinguaNet - Turn Your Voice into Value',
  description: 'Preserve African languages, Power Global AI',
  openGraph: {
    images: ['/linguanet-og.png'],
  },
}
```

### Error Monitoring (Optional but Impressive)
```bash
# Add Sentry for error tracking
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 📊 Metrics to Show Judges

During demo, have these ready:
1. **Live Transaction Hash**: Show on Base Sepolia explorer
2. **Gas Cost**: Show it's < $0.01
3. **Response Time**: Show instant payments
4. **Audio Storage**: Show Filecoin CID
5. **ENS Resolution**: Show name resolving

## 🎬 Recording Demo Video

```bash
# Use OBS Studio for recording
# Settings:
- Resolution: 1920x1080
- FPS: 30
- Include system audio
- Record in MP4

# Structure:
0:00-0:30 - Problem (AI can't speak Twi)
0:30-2:00 - Live demo of all 3 flows
2:00-2:30 - Show real transactions
2:30-3:00 - Impact and scale
```

## 🚨 Emergency Fixes

If something breaks during demo:

### Frontend Crash
- Have backup deployment: `vercel --prod --force`
- Local backup: `npm run dev` on laptop

### Contract Issues
- Have backup contract deployed
- Use demo mode (already built in)

### Network Issues
- Have mobile hotspot ready
- Pre-record video backup
- Cache demo data locally

## ✅ Final Checklist

Before presenting:
- [ ] Frontend deployed to Vercel
- [ ] Contract deployed to Base Sepolia
- [ ] Test transaction completed
- [ ] Audio uploaded to Filecoin
- [ ] ENS subdomain created
- [ ] All environment variables set
- [ ] Demo accounts funded with testnet tokens
- [ ] Backup demo video ready
- [ ] All devices charged to 100%
- [ ] Stable internet connection confirmed

## 🎯 Judge Questions - Be Ready!

**Q: "How do you prevent spam?"**
A: AI quality checks + validator consensus + EFP reputation

**Q: "What about other languages?"**
A: Starting with Twi, expanding to 100+ African languages in 6 months

**Q: "How do you ensure quality?"**
A: 3-layer validation: AI, human validators, community attestations

**Q: "Revenue model?"**
A: 10% platform fee on dataset sales, sustainable at scale

**Q: "Why blockchain?"**
A: Instant payments, no bank account needed, transparent, censorship-resistant

## 🏁 GO WIN THIS!

Remember:
- **Show, don't tell** - Live demo > slides
- **Focus on impact** - Real people earning real money
- **Technical excellence** - All bounties integrated
- **African first** - Solve local problems, scale globally

You've built something amazing. Now deploy it and show the world! 🚀