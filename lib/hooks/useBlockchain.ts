'use client';

import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useState, useEffect, useCallback } from 'react';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, getContractConfig, CONTRACT_ABIS } from '../contracts-config';
import { getENSName, registerENSName, generateENSName } from '../ens';

/**
 * Custom hook for blockchain interactions
 */
export function useBlockchain() {
  const { address, isConnected, isConnecting } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // Get USDC balance
  const { data: balance } = useBalance({
    address: address,
    token: CONTRACT_ADDRESSES.usdcToken,
  });

  // Get LINGUA token balance
  const { data: linguaBalance } = useReadContract({
    ...getContractConfig('linguaToken'),
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Get Voice Shares NFT balance
  const { data: voiceSharesBalance } = useReadContract({
    ...getContractConfig('voiceSharesNFT'),
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Load ENS name
  useEffect(() => {
    if (address) {
      getENSName(address).then(name => setEnsName(name));
    }
  }, [address]);

  // Register ENS for new users
  const registerUserENS = useCallback(async (phoneNumber: string) => {
    if (!address) return { success: false, error: 'No wallet connected' };

    setIsRegistering(true);
    try {
      const newENSName = generateENSName(phoneNumber);
      const result = await registerENSName(newENSName, address);
      
      if (result.success) {
        setEnsName(newENSName);
      }
      
      return result;
    } finally {
      setIsRegistering(false);
    }
  }, [address]);

  return {
    // Wallet state
    address,
    isConnected,
    isConnecting,
    openConnectModal,
    
    // ENS
    ensName,
    isRegistering,
    registerUserENS,
    
    // Balances
    usdcBalance: balance ? formatUnits(balance.value, balance.decimals) : '0',
    
    // Token Balances
    linguaBalance: linguaBalance ? formatUnits(linguaBalance as bigint, 18) : '0',
    voiceSharesBalance: voiceSharesBalance ? Number(voiceSharesBalance) : 0,
  };
}

/**
 * Hook for submitting audio recordings
 */
export function useSubmitAudio() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { writeContractAsync } = useWriteContract();
  const contractAddress = CONTRACT_ADDRESSES.linguaToken || '0x0000000000000000000000000000000000000000' as `0x${string}`;

  const submitAudio = useCallback(async (
    language: string,
    cid: string,
    duration: number
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // In production, this would upload to Filecoin first
      // For now, we'll use a mock CID
      const mockCid = `Qm${Math.random().toString(36).substring(2, 15)}`;

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: LinguaNetCoreABI.abi,
        functionName: 'submitAudio',
        args: [language, mockCid, BigInt(duration)],
      });

      // Wait for confirmation
      return { success: true, txHash: hash, cid: mockCid };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  }, [writeContractAsync, contractAddress]);

  return {
    submitAudio,
    isSubmitting,
    error,
  };
}

/**
 * Hook for validating audio
 */
export function useValidateAudio() {
  const [isValidating, setIsValidating] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const contractAddress = getContractAddress('linguanetCore') as `0x${string}`;

  const validateAudio = useCallback(async (cid: string, isValid: boolean) => {
    setIsValidating(true);

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: LinguaNetCoreABI.abi,
        functionName: 'validateAudio',
        args: [cid, isValid],
      });

      return { success: true, txHash: hash };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Validation failed' 
      };
    } finally {
      setIsValidating(false);
    }
  }, [writeContractAsync, contractAddress]);

  return {
    validateAudio,
    isValidating,
  };
}

/**
 * Hook for withdrawing earnings
 */
export function useWithdraw() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const contractAddress = getContractAddress('linguanetCore') as `0x${string}`;

  const withdraw = useCallback(async () => {
    setIsWithdrawing(true);
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: LinguaNetCoreABI.abi,
        functionName: 'withdrawEarnings',
        args: [],
      });
      return { success: true, txHash: hash };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Withdrawal failed' 
      };
    } finally {
      setIsWithdrawing(false);
    }
  }, [writeContractAsync, contractAddress]);

  const withdrawToMobileMoney = useCallback(async (
    phoneNumber: string,
    provider: string
  ) => {
    setIsWithdrawing(true);
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: LinguaNetCoreABI.abi,
        functionName: 'withdrawToMobileMoney',
        args: [phoneNumber, provider],
      });
      return { success: true, txHash: hash };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Mobile money withdrawal failed' 
      };
    } finally {
      setIsWithdrawing(false);
    }
  }, [writeContractAsync, contractAddress]);

  return {
    withdraw,
    withdrawToMobileMoney,
    isWithdrawing,
  };
}