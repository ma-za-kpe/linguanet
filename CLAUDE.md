# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LinguaDAO is the first decentralized language preservation protocol, transforming language preservation from charity into a profitable ecosystem. Built on the "Proof of Voice" consensus mechanism, it incentivizes communities to preserve endangered African languages through blockchain rewards. Contributors mint Voice Share NFTs representing ownership stakes in AI models, governance rights, and revenue sharing from language data sales.

**Mission**: Save 3,000+ endangered African languages by making preservation more profitable than abandonment.
**Vision**: "The future of Africa speaks every language"

## Key Commands

### Development
```bash
npm run dev          # Start Next.js development server (port 3000/3001)
npm run build        # Build for production
npm run lint         # Run ESLint checks
```

### Smart Contracts
```bash
npm run compile      # Compile Solidity contracts with Hardhat
npm run test         # Run contract tests
npm run deploy       # Deploy contracts to Base Sepolia
npm run deploy:local # Deploy to local Hardhat network
npm run verify       # Verify contracts on BaseScan
npm run contracts    # Show deployed contract addresses
```

## Architecture

### Core Smart Contracts (Base L2)
- **LinguaDAO.sol**: DAO governance and proposal system
- **LinguaToken.sol**: $LINGUA ERC20 token for rewards and governance
- **VoiceSharesNFT.sol**: ERC721 NFTs representing voice contributions and ownership
- **LanguagePoolsAMM.sol**: AMM for trading language data access (Twi/USDC pools)
- **ExtinctionInsurance.sol**: DeFi insurance for endangered languages
- **LinguaNetCore.sol**: Core protocol logic and reward calculations

### Frontend Architecture
- **Next.js App Router**: Pages in `/app` directory
- **Key Pages**:
  - `/` - Landing page with LinguaDAO vision
  - `/contribute` - Voice mining interface for recording and earning $LINGUA
  - `/gallery` - Voice Shares NFT gallery with audio playback
  - `/dashboard` - AI company dashboard for purchasing datasets
  - `/pitch` - Interactive pitch deck

### Data Flow
1. User records audio on `/contribute`
2. Audio uploaded to IPFS via Web3.Storage (creates CID like `bafy...`)
3. Voice Share NFT minted with metadata
4. NFT appears in `/gallery` with playback capability
5. User earns $LINGUA based on: Quality × Language Rarity × Staking Boost

## Web3.Storage Integration

### Upload Format
Files are uploaded as directories containing:
- `audio.webm` - The recorded audio file
- `metadata.json` - Language, quality score, duration, etc.

### IPFS Access
- Gateway URL: `https://${cid}.ipfs.w3s.link/`
- Audio file: `https://${cid}.ipfs.w3s.link/audio.webm`
- Metadata: `https://${cid}.ipfs.w3s.link/metadata.json`

## Token Economics

### $LINGUA Token Distribution
- 40% Community Mining (voice contributions)
- 20% Language Preservation Treasury
- 15% Team & Advisors (4-year vest)
- 15% Ecosystem Grants
- 10% Initial Liquidity

### Revenue Sharing Model
When AI companies purchase data:
- 70% to Voice Share NFT holders
- 20% to $LINGUA stakers
- 10% to DAO Treasury

## Key Features

### Voice Mining Formula
```
Rewards = Base Rate × Quality Score × Language Rarity × Staking Boost
```

### Language Rarity Multipliers
- Critical (4x): Ga, Fon
- Endangered (3x): Wolof, Ewe, Tigrinya
- Vulnerable (2x): Twi, Yoruba, Zulu, Amharic, Oromo
- Stable (1.5x): Swahili, Hausa

### Guardian Tiers
- Novice → Expert → Master → Guardian
- Higher tiers unlock multipliers and governance rights

## Development Guidelines

### When Adding Features
1. Follow the dark theme aesthetic (background: #0a0a0a)
2. Use glassmorphism effects for cards
3. Maintain mobile-first responsive design
4. Use existing contract interfaces in `/lib/contracts-config.ts`

### Testing Audio Uploads
1. Record on `/contribute` page
2. Check console for IPFS CID
3. Verify upload at `https://${cid}.ipfs.w3s.link/`
4. View NFT in `/gallery` with playback

### Common Issues
- Audio playback may fail due to CORS - fallback beep sound will play
- Web3.Storage requires email verification for uploads
- Use Base Sepolia testnet for contract interactions

## Contract Deployment

Current deployment on Base Sepolia:
- Check `/deployments/base-sepolia-*.json` for addresses
- Verify on: https://sepolia.basescan.org

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
NEXT_PUBLIC_NETWORK=testnet
DEPLOYER_PRIVATE_KEY=
BASESCAN_API_KEY=
```

## Git Workflow

Current branch: `feature/linguadao-protocol`
- Contains full LinguaDAO implementation
- Voice Shares NFT system
- Language pools and insurance contracts