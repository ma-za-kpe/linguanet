'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, getContractConfig } from '../contracts-config';

/**
 * Hook for submitting voice mining data
 */
export function useVoiceMining() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({
      hash,
    });

  const submitVoiceData = async (
    languageCode: string,
    audioHash: string,
    metadata: {
      duration: number;
      quality: number;
      rarity: number;
    }
  ) => {
    try {
      // For now, mint a Voice Share NFT to represent the contribution
      await writeContract({
        ...getContractConfig('voiceSharesNFT'),
        functionName: 'mintVoiceShare',
        args: [
          audioHash, // IPFS hash
          languageCode,
          BigInt(Math.floor(metadata.quality * 100)), // Quality score as percentage
          BigInt(metadata.duration), // Duration in seconds
        ],
      });

      return { success: true };
    } catch (err) {
      console.error('Mining submission failed:', err);
      return { success: false, error: err };
    }
  };

  return {
    submitVoiceData,
    isSubmitting: isPending || isConfirming,
    isConfirmed,
    error,
  };
}

/**
 * Hook for claiming mining rewards
 */
export function useClaimRewards() {
  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({
      hash,
    });

  const claimRewards = async (tokenIds: bigint[]) => {
    try {
      await writeContract({
        ...getContractConfig('voiceSharesNFT'),
        functionName: 'claimRewards',
        args: [tokenIds],
      });

      return { success: true };
    } catch (err) {
      console.error('Claim failed:', err);
      return { success: false, error: err };
    }
  };

  return {
    claimRewards,
    isClaiming: isPending || isConfirming,
    isConfirmed,
  };
}

/**
 * Hook for staking LINGUA tokens
 */
export function useStaking() {
  const { writeContract: approve, data: approveHash } = useWriteContract();
  const { writeContract: stake, data: stakeHash } = useWriteContract();

  const stakeTokens = async (amount: string) => {
    try {
      // First approve the staking contract
      const amountWei = parseUnits(amount, 18);
      
      await approve({
        ...getContractConfig('linguaToken'),
        functionName: 'approve',
        args: [CONTRACT_ADDRESSES.linguaDAO, amountWei],
      });

      // Wait for approval
      // Then stake
      await stake({
        ...getContractConfig('linguaDAO'),
        functionName: 'stake',
        args: [amountWei],
      });

      return { success: true };
    } catch (err) {
      console.error('Staking failed:', err);
      return { success: false, error: err };
    }
  };

  return {
    stakeTokens,
    approveHash,
    stakeHash,
  };
}