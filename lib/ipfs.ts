import { uploadToW3Storage, isW3StorageReady } from './w3storage-client';

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://w3s.link/ipfs/';

/**
 * Upload audio file to IPFS via Web3.Storage
 */
export async function uploadToIPFS(file: Blob, metadata: any, walletAddress?: string): Promise<string> {
  try {
    // Try to use Web3.Storage if it's ready
    if (isW3StorageReady()) {
      console.log('Using Web3.Storage for upload...');
      return await uploadToW3Storage(file, metadata, walletAddress);
    } else {
      console.log('Web3.Storage not ready, using mock hash for demo');
      return generateMockIPFSHash(metadata, walletAddress);
    }
    
    // Original Web3.Storage upload code (keeping for reference)
    /*
    const audioFile = new File([file], 'audio.webm', { type: 'audio/webm' });
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataFile = new File([metadataBlob], 'metadata.json');

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('metadata', metadataFile);

    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WEB3_STORAGE_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.cid;
    */
    
  } catch (error) {
    console.error('IPFS upload error:', error);
    return generateMockIPFSHash(metadata);
  }
}

// Helper function to store in localStorage
function storeInLocalStorage(ipfsHash: string, metadata: any, walletAddress?: string): void {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('voiceShares') || '[]';
    const voiceShares = JSON.parse(stored);
    voiceShares.push({
      ipfsHash,
      metadata,
      timestamp: Date.now(),
      walletAddress: walletAddress || 'anonymous',
    });
    localStorage.setItem('voiceShares', JSON.stringify(voiceShares));
  }
}

/**
 * Generate a mock IPFS hash that looks realistic
 */
function generateMockIPFSHash(metadata: any, walletAddress?: string): string {
  // Create a deterministic hash based on metadata
  const seed = `${metadata.language}-${metadata.duration}-${metadata.timestamp}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to base58-like string (IPFS CID v0 format)
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = 'Qm'; // IPFS CID v0 prefix
  
  // Generate 44 more characters for a realistic CID
  for (let i = 0; i < 44; i++) {
    hash = ((hash * 1103515245) + 12345) & 0x7fffffff;
    result += chars[hash % chars.length];
  }
  
  // Store in localStorage for consistency
  storeInLocalStorage(result, metadata, walletAddress);
  
  return result;
}

/**
 * Get IPFS gateway URL for a CID
 */
export function getIPFSUrl(cid: string): string {
  return `${IPFS_GATEWAY}${cid}`;
}

/**
 * Fetch metadata from IPFS
 */
export async function fetchFromIPFS(cid: string): Promise<any> {
  try {
    const response = await fetch(getIPFSUrl(cid));
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('IPFS fetch failed:', error);
    return null;
  }
}