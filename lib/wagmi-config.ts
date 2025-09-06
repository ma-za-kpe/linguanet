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
    linguanetCore: '0x0000000000000000000000000000000000000000', // Deploy and update
    usdcToken: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
    ensRegistry: '0x0000000000000000000000000000000000000000', // Deploy ENS resolver
    dataRegistry: '0x0000000000000000000000000000000000000000', // Deploy data registry
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
  return chainId === base.id ? CONTRACTS.base[contractName] : CONTRACTS.baseSepolia[contractName];
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