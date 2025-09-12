import { uploadToW3Storage, isW3StorageReady } from './w3storage-client';

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://w3s.link/ipfs/';

/**
 * Upload audio file to IPFS via Web3.Storage
 */
interface AudioMetadata {
  language: string;
  languageName?: string;
  duration: number;
  timestamp: number;
  quality: number;
  rarity: number;
}

export async function uploadToIPFS(file: Blob, metadata: AudioMetadata, walletAddress?: string): Promise<string> {
  try {
    // Use Web3.Storage for upload
    if (!isW3StorageReady()) {
      throw new Error('Web3.Storage is not configured. Please set up your Web3.Storage token.');
    }
    
    console.log('Using Web3.Storage for upload...');
    return await uploadToW3Storage(file, metadata, walletAddress);
    
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
    throw error; // Propagate error instead of returning mock hash
  }
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
export async function fetchFromIPFS(cid: string): Promise<AudioMetadata | null> {
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