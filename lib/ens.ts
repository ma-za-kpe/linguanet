import { normalize } from '@ensdomains/eth-ens-namehash';

/**
 * ENS Integration for LinguaNet
 * Creates .linguanet.eth subnames for users based on phone numbers
 */

const LINGUANET_ENS_DOMAIN = 'linguanet.eth';

/**
 * Generate ENS subdomain from phone number
 */
export function generateENSName(phoneNumber: string): string {
  // Remove non-numeric characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Take last 6 digits for privacy
  const phoneHash = cleanPhone.slice(-6);
  
  // Generate readable name
  const timestamp = Date.now().toString(36).slice(-4);
  const ensName = `user${phoneHash}-${timestamp}.${LINGUANET_ENS_DOMAIN}`;
  
  return ensName;
}

/**
 * Generate ENS name for contributors with custom names
 */
export function generateCustomENSName(name: string): string {
  // Normalize and clean the name
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15); // Limit length
  
  if (cleanName.length < 3) {
    return generateENSName('0000000000');
  }
  
  return `${cleanName}.${LINGUANET_ENS_DOMAIN}`;
}

/**
 * Check if ENS name is available (mock for now)
 */
export async function isENSAvailable(ensName: string): Promise<boolean> {
  // In production, this would check against the ENS registry on Base
  // For MVP, we'll simulate availability
  try {
    const normalized = normalize(ensName);
    // Simulate some names being taken
    const takenNames = ['kofi', 'ama', 'kwame', 'admin', 'test'];
    const baseName = normalized.split('.')[0];
    return !takenNames.includes(baseName);
  } catch {
    return false;
  }
}

/**
 * Register ENS name on-chain (mock for now)
 */
export async function registerENSName(
  ensName: string,
  address: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // In production, this would interact with ENS contracts on Base
    // For MVP, we'll simulate the registration
    
    const isAvailable = await isENSAvailable(ensName);
    if (!isAvailable) {
      return { success: false, error: 'Name not available' };
    }
    
    // Simulate transaction hash
    const mockTxHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    
    // Store in localStorage for demo
    if (typeof window !== 'undefined') {
      const ensRegistry = JSON.parse(
        localStorage.getItem('linguanet_ens_registry') || '{}'
      );
      ensRegistry[address] = ensName;
      localStorage.setItem('linguanet_ens_registry', JSON.stringify(ensRegistry));
    }
    
    return { success: true, txHash: mockTxHash };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    };
  }
}

/**
 * Resolve ENS name to address (mock for now)
 */
export async function resolveENSName(ensName: string): Promise<string | null> {
  try {
    // In production, this would resolve through ENS contracts
    // For MVP, check localStorage
    if (typeof window !== 'undefined') {
      const ensRegistry = JSON.parse(
        localStorage.getItem('linguanet_ens_registry') || '{}'
      );
      
      const address = Object.keys(ensRegistry).find(
        addr => ensRegistry[addr] === ensName
      );
      
      return address || null;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Get ENS name for address (mock for now)
 */
export async function getENSName(address: string): Promise<string | null> {
  try {
    // In production, this would do reverse resolution
    // For MVP, check localStorage
    if (typeof window !== 'undefined') {
      const ensRegistry = JSON.parse(
        localStorage.getItem('linguanet_ens_registry') || '{}'
      );
      
      return ensRegistry[address] || null;
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Format ENS name for display
 */
export function formatENSDisplay(ensName: string): string {
  // Remove .linguanet.eth for cleaner display
  return ensName.replace(`.${LINGUANET_ENS_DOMAIN}`, '');
}

/**
 * Validate ENS name format
 */
export function validateENSName(name: string): { valid: boolean; error?: string } {
  if (!name || name.length < 3) {
    return { valid: false, error: 'Name must be at least 3 characters' };
  }
  
  if (name.length > 15) {
    return { valid: false, error: 'Name must be 15 characters or less' };
  }
  
  if (!/^[a-z0-9-]+$/.test(name)) {
    return { valid: false, error: 'Name can only contain lowercase letters, numbers, and hyphens' };
  }
  
  if (name.startsWith('-') || name.endsWith('-')) {
    return { valid: false, error: 'Name cannot start or end with a hyphen' };
  }
  
  return { valid: true };
}