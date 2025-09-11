import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  baseSepolia,
} from 'wagmi/chains';

// Base chain configuration for production
export const config = getDefaultConfig({
  appName: 'LinguaNet',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [
    process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia
  ],
  ssr: true, // Enable SSR for Next.js
});

// Contract addresses (update these with deployed addresses)
export const CONTRACTS = {
  // Base Sepolia (Testnet)
  baseSepolia: {
    linguanetCore: '0xf94CC32C9cD25d565C54fE54DC5AeEe159FB910a', // LinguaDAO contract
    usdcToken: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
    ensRegistry: '0x9aB86b04D321b5dB9a2E6F2CFbE2B028Cc6df21D', // LinguaToken contract (temporary)
    dataRegistry: '0xCC1D5C4e4b2B9aafADd31976051f52dF3d8f1308', // VoiceSharesNFT contract
    linguaToken: '0x9aB86b04D321b5dB9a2E6F2CFbE2B028Cc6df21D', // LINGUA token
    voiceSharesNFT: '0xCC1D5C4e4b2B9aafADd31976051f52dF3d8f1308', // Voice NFTs
    languagePoolsAMM: '0x9744Ed27A3353B3B73243A0A656188854188f2DD', // AMM pools
    extinctionInsurance: '0xa3dc5A67cB29cD07705Fe9282FAE870CA1017929', // Insurance contract
  },
  // Base Mainnet
  base: {
    linguanetCore: '0x0000000000000000000000000000000000000000', // Deploy and update
    usdcToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base Mainnet USDC
    ensRegistry: '0x0000000000000000000000000000000000000000', // Deploy ENS resolver
    dataRegistry: '0x0000000000000000000000000000000000000000', // Deploy data registry
  }
};

// Get current contract addresses based on network
export const getContractAddress = (contractName: keyof typeof CONTRACTS.baseSepolia) => {
  const chainId = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base.id : baseSepolia.id;
  return chainId === base.id ? CONTRACTS.base[contractName as keyof typeof CONTRACTS.base] : CONTRACTS.baseSepolia[contractName];
};

// Chain explorer URLs
export const EXPLORER_URLS = {
  [baseSepolia.id]: 'https://sepolia.basescan.org',
  [base.id]: 'https://basescan.org',
};

// Mobile Money Integration Config
export const MOBILE_MONEY_CONFIG = {
  providers: {
    mtn: {
      name: 'MTN Mobile Money',
      countries: ['GH', 'UG', 'RW', 'ZM'],
      apiUrl: process.env.NEXT_PUBLIC_MTN_MOMO_API_URL,
    },
    mpesa: {
      name: 'M-Pesa',
      countries: ['KE', 'TZ', 'ZA', 'MZ'],
      apiUrl: process.env.NEXT_PUBLIC_MPESA_API_URL,
    },
    airteltigo: {
      name: 'AirtelTigo',
      countries: ['GH', 'NG', 'UG', 'MW'],
      apiUrl: process.env.NEXT_PUBLIC_AIRTELTIGO_API_URL,
    }
  }
};