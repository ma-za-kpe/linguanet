// Contract addresses from deployment
export const CONTRACT_ADDRESSES = {
  // Base Sepolia deployed contracts
  linguaToken: process.env.NEXT_PUBLIC_LINGUA_TOKEN_ADDRESS as `0x${string}`,
  voiceSharesNFT: process.env.NEXT_PUBLIC_VOICE_SHARES_NFT_ADDRESS as `0x${string}`,
  linguaDAO: process.env.NEXT_PUBLIC_LINGUA_DAO_ADDRESS as `0x${string}`,
  languagePoolsAMM: process.env.NEXT_PUBLIC_LANGUAGE_POOLS_AMM_ADDRESS as `0x${string}`,
  extinctionInsurance: process.env.NEXT_PUBLIC_EXTINCTION_INSURANCE_ADDRESS as `0x${string}`,
  usdcToken: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`,
};

// Contract ABIs - Import from compiled artifacts
import LinguaTokenABI from '../artifacts/contracts/LinguaToken.sol/LinguaToken.json';
import VoiceSharesNFTABI from '../artifacts/contracts/VoiceSharesNFT.sol/VoiceSharesNFT.json';
import LinguaDAOABI from '../artifacts/contracts/LinguaDAO.sol/LinguaDAO.json';
import LanguagePoolsAMMABI from '../artifacts/contracts/LanguagePoolsAMM.sol/LanguagePoolsAMM.json';
import ExtinctionInsuranceABI from '../artifacts/contracts/ExtinctionInsurance.sol/ExtinctionInsurance.json';

// Standard ERC20 ABI for USDC
export const USDC_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
] as const;

export const CONTRACT_ABIS = {
  linguaToken: LinguaTokenABI.abi,
  voiceSharesNFT: VoiceSharesNFTABI.abi,
  linguaDAO: LinguaDAOABI.abi,
  languagePoolsAMM: LanguagePoolsAMMABI.abi,
  extinctionInsurance: ExtinctionInsuranceABI.abi,
  usdcToken: USDC_ABI,
};

// Helper to get contract config
export function getContractConfig(contractName: keyof typeof CONTRACT_ADDRESSES) {
  return {
    address: CONTRACT_ADDRESSES[contractName],
    abi: CONTRACT_ABIS[contractName],
  };
}