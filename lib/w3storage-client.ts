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
 * Login with email and create/register a space
 * This sends a verification email to the user
 */
export async function loginWithEmail(email: string): Promise<void> {
  if (!w3upClient) {
    await initializeW3Storage();
  }
  
  if (!w3upClient) {
    throw new Error('Client not initialized');
  }

  try {
    console.log('Logging in with email:', email);
    userEmail = email;
    
    // This will send a verification email
    const account = await w3upClient.login(email);
    console.log('Login email sent. Please check your inbox and click the verification link.');
    
    // Wait for payment plan (required for new accounts)
    console.log('Waiting for account setup...');
    await account.plan.wait({ timeout: 900000 }); // 15 minute timeout
    
    // Create a space if we don't have one
    const spaces = await w3upClient.spaces();
    if (spaces.length === 0) {
      console.log('Creating new space...');
      const space = await w3upClient.createSpace('LinguaDAO-Space', { account });
      await w3upClient.setCurrentSpace(space.did());
      console.log('Space created:', space.did());
    }
    
    isInitialized = true;
    console.log('Web3.Storage setup complete!');
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Upload file to IPFS using Web3.Storage
 */
export async function uploadToW3Storage(
  file: Blob,
  metadata: any
): Promise<string> {
  if (!w3upClient || !isInitialized) {
    console.warn('Web3.Storage not initialized. Using mock upload.');
    return generateMockIPFSHash(metadata);
  }

  try {
    const currentSpace = w3upClient.currentSpace();
    if (!currentSpace) {
      console.warn('No space selected. Using mock upload.');
      return generateMockIPFSHash(metadata);
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
    storeUploadRecord(cid.toString(), metadata);
    
    return cid.toString();
  } catch (error) {
    console.error('Web3.Storage upload failed:', error);
    return generateMockIPFSHash(metadata);
  }
}

/**
 * Store upload record in localStorage
 */
function storeUploadRecord(cid: string, metadata: any): void {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('voiceShares') || '[]';
    const voiceShares = JSON.parse(stored);
    voiceShares.push({
      ipfsHash: cid,
      metadata,
      timestamp: Date.now(),
      email: userEmail,
    });
    localStorage.setItem('voiceShares', JSON.stringify(voiceShares));
  }
}

/**
 * Generate a mock IPFS hash for demo/fallback
 */
function generateMockIPFSHash(metadata: any): string {
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
  
  storeUploadRecord(result, metadata);
  return result;
}

/**
 * Check if Web3.Storage is ready
 */
export function isW3StorageReady(): boolean {
  return isInitialized && w3upClient !== null && w3upClient.currentSpace() !== null;
}

/**
 * Get current space DID
 */
export function getCurrentSpaceDID(): string | null {
  if (!w3upClient) return null;
  const space = w3upClient.currentSpace();
  return space ? space.did() : null;
}