import { create } from '@web3-storage/w3up-client';
import type { Client } from '@web3-storage/w3up-client';

let w3upClient: Client | null = null;
let isInitialized = false;
let userEmail: string | null = null;

/**
 * Initialize Web3.Storage client
 * This needs to be called once when the app starts
 */
export async function initializeW3Storage(): Promise<Client> {
  if (w3upClient && isInitialized) {
    return w3upClient;
  }

  try {
    // Create client - it will use persistent local storage
    w3upClient = await create();
    console.log('Web3.Storage client created with DID:', w3upClient.did());
    
    // List all spaces available to this agent
    const spaces = await w3upClient.spaces();
    console.log('Available spaces:', spaces.length);
    
    if (spaces.length > 0) {
      // Use the first space or find "linguadao" space
      const linguaSpace = spaces.find(s => s.name === 'linguadao') || spaces[0];
      await w3upClient.setCurrentSpace(linguaSpace.did());
      console.log('Using space:', linguaSpace.name || linguaSpace.did());
      isInitialized = true;
    } else {
      console.log('No spaces found. You may need to login with your email to access your spaces.');
      // For now, mark as initialized anyway to use mock uploads
      isInitialized = false;
    }
    
    return w3upClient;
  } catch (error) {
    console.error('Failed to initialize Web3.Storage client:', error);
    // Don't throw - allow app to work with mock uploads
    return w3upClient as Client;
  }
}

/**
 * Send verification email without waiting
 * Returns immediately after email is sent
 */
export async function loginWithEmail(email: string): Promise<void> {
  console.log('[W3Storage] Starting login process for:', email);
  
  if (!w3upClient) {
    console.log('[W3Storage] Client not initialized, initializing...');
    await initializeW3Storage();
  }
  
  if (!w3upClient) {
    console.error('[W3Storage] Client initialization failed');
    throw new Error('Client not initialized');
  }

  try {
    console.log('[W3Storage] Checking if already logged in...');
    const accounts = w3upClient.accounts();
    
    if (Object.keys(accounts).length > 0) {
      console.log('[W3Storage] Already logged in with an account');
      await completeSetup();
      return;
    }
    
    console.log('[W3Storage] Sending verification email to:', email);
    userEmail = email;
    
    // Start the login process in the background
    // This sends the email and waits for verification
    w3upClient.login(email).then(async (account) => {
      console.log('[W3Storage] Email verified! Account created:', account.did());
      // Complete setup after verification
      await completeSetup();
    }).catch((error) => {
      console.error('[W3Storage] Login verification error:', error);
    });
    
    // Return immediately - email has been sent
    console.log('[W3Storage] Verification email sent to:', email);
    console.log('[W3Storage] User should check email and click the link');
    return;
    
  } catch (error: any) {
    console.error('[W3Storage] Login error:', error);
    throw error;
  }
}

/**
 * Complete setup after email verification
 * Creates a space and provisions it to the account
 */
async function completeSetup(): Promise<void> {
  if (!w3upClient) return;
  
  try {
    // Check if we already have spaces
    const spaces = await w3upClient.spaces();
    
    if (spaces.length === 0) {
      console.log('[W3Storage] No spaces found, creating new space...');
      
      // Create a new space for LinguaDAO
      const space = await w3upClient.createSpace('linguadao');
      console.log('[W3Storage] Space created:', space.did());
      
      // Save the space and set it as current
      await space.save();
      console.log('[W3Storage] Space saved');
      
      // Get the account to provision the space
      const accounts = w3upClient.accounts();
      const account = Object.values(accounts)[0];
      
      if (account) {
        await account.provision(space.did());
        console.log('[W3Storage] Space provisioned to account');
      }
    } else {
      console.log('[W3Storage] Found existing spaces:', spaces.length);
      const linguaSpace = spaces.find(s => s.name === 'linguadao') || spaces[0];
      await w3upClient.setCurrentSpace(linguaSpace.did());
      console.log('[W3Storage] Using space:', linguaSpace.name || linguaSpace.did());
    }
    
    isInitialized = true;
    console.log('[W3Storage] Setup complete!');
    
  } catch (error) {
    console.error('[W3Storage] Setup error:', error);
    throw error;
  }
}

/**
 * Upload file to IPFS using Web3.Storage
 */
export async function uploadToW3Storage(
  file: Blob,
  metadata: any,
  walletAddress?: string
): Promise<string> {
  if (!w3upClient || !isInitialized) {
    console.warn('Web3.Storage not initialized. Using mock upload.');
    return generateMockIPFSHash(metadata, walletAddress);
  }

  try {
    const currentSpace = w3upClient.currentSpace();
    if (!currentSpace) {
      console.warn('No space selected. Using mock upload.');
      return generateMockIPFSHash(metadata, walletAddress);
    }

    console.log('Uploading to Web3.Storage...');
    
    // Create File objects
    const audioFile = new File([file], 'audio.webm', { type: 'audio/webm' });
    const metadataFile = new File(
      [JSON.stringify(metadata)], 
      'metadata.json',
      { type: 'application/json' }
    );
    
    // Upload files together
    const cid = await w3upClient.uploadDirectory([audioFile, metadataFile]);
    
    console.log('Upload successful! CID:', cid.toString());
    
    // Store in localStorage for reference
    storeUploadRecord(cid.toString(), metadata, walletAddress);
    
    return cid.toString();
  } catch (error) {
    console.error('Web3.Storage upload failed:', error);
    return generateMockIPFSHash(metadata, walletAddress);
  }
}

/**
 * Store upload record in localStorage
 */
function storeUploadRecord(cid: string, metadata: any, walletAddress?: string): void {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('voiceShares') || '[]';
    const voiceShares = JSON.parse(stored);
    voiceShares.push({
      ipfsHash: cid,
      metadata,
      timestamp: Date.now(),
      email: userEmail,
      walletAddress: walletAddress || 'anonymous',
    });
    localStorage.setItem('voiceShares', JSON.stringify(voiceShares));
  }
}

/**
 * Generate a mock IPFS hash for demo/fallback
 */
function generateMockIPFSHash(metadata: any, walletAddress?: string): string {
  const seed = `${metadata.language}-${metadata.duration}-${metadata.timestamp}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = 'Qm';
  
  for (let i = 0; i < 44; i++) {
    hash = ((hash * 1103515245) + 12345) & 0x7fffffff;
    result += chars[hash % chars.length];
  }
  
  storeUploadRecord(result, metadata, walletAddress);
  return result;
}

/**
 * Check if Web3.Storage is ready
 */
export function isW3StorageReady(): boolean {
  return isInitialized && w3upClient !== null && w3upClient.currentSpace() !== null;
}

/**
 * Check if user has verified email and setup is complete
 */
export async function checkVerificationStatus(): Promise<boolean> {
  if (!w3upClient) {
    await initializeW3Storage();
  }
  
  if (!w3upClient) return false;
  
  try {
    const accounts = w3upClient.accounts();
    const spaces = await w3upClient.spaces();
    
    // If we have accounts and spaces, verification is complete
    if (Object.keys(accounts).length > 0 && spaces.length > 0) {
      console.log('[W3Storage] Verification complete - found accounts and spaces');
      await completeSetup();
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[W3Storage] Error checking verification:', error);
    return false;
  }
}

/**
 * Get current space DID
 */
export function getCurrentSpaceDID(): string | null {
  if (!w3upClient) return null;
  const space = w3upClient.currentSpace();
  return space ? space.did() : null;
}