'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useContractRead, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESSES, getContractConfig } from '@/lib/contracts-config';
import { WalletButton } from '@/components/WalletButton';
import { motion } from 'framer-motion';
import { FiMusic, FiClock, FiAward, FiUser, FiGlobe, FiHash } from 'react-icons/fi';
import './gallery.css';

interface VoiceNFT {
  tokenId: string;
  owner: string;
  languageCode: string;
  quality: number;
  duration: number;
  timestamp: number;
  ipfsHash: string;
  rewards: string;
}

// Language mapping
const languageNames: Record<string, string> = {
  twi: '🇬🇭 Twi',
  yoruba: '🇳🇬 Yoruba',
  swahili: '🇰🇪 Swahili',
  wolof: '🇸🇳 Wolof',
  fon: '🇧🇯 Fon',
  ewe: '🇹🇬 Ewe',
  ga: '🇬🇭 Ga',
  hausa: '🇳🇬 Hausa',
  zulu: '🇿🇦 Zulu',
  amharic: '🇪🇹 Amharic',
  tigrinya: '🇪🇷 Tigrinya',
  oromo: '🇪🇹 Oromo',
};

export default function GalleryClient() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [nfts, setNfts] = useState<VoiceNFT[]>([]);
  const [myNfts, setMyNfts] = useState<VoiceNFT[]>([]);
  const [view, setView] = useState<'all' | 'mine'>('all');
  const [loading, setLoading] = useState(true);
  const [totalSupply, setTotalSupply] = useState(0);

  // Get total supply of NFTs
  const { data: supply } = useReadContract({
    ...getContractConfig('voiceSharesNFT'),
    functionName: 'totalSupply',
  });

  // Get user's NFT balance
  const { data: userBalance } = useReadContract({
    ...getContractConfig('voiceSharesNFT'),
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Fetch NFT metadata from localStorage and blockchain
  useEffect(() => {
    async function fetchNFTs() {
      setLoading(true);
      try {
        // Get from localStorage for demo
        const storedVoices = localStorage.getItem('voiceShares');
        const localNFTs: VoiceNFT[] = [];
        
        if (storedVoices) {
          const voices = JSON.parse(storedVoices);
          voices.forEach((voice: any, index: number) => {
            localNFTs.push({
              tokenId: String(index + 1),
              owner: address || '0x0000000000000000000000000000000000000000',
              languageCode: voice.metadata.language,
              quality: Math.round(voice.metadata.quality * 100),
              duration: voice.metadata.duration,
              timestamp: voice.timestamp,
              ipfsHash: voice.ipfsHash,
              rewards: String(Math.floor(100 * voice.metadata.quality * voice.metadata.rarity * 1.5)),
            });
          });
        }

        // Add some mock NFTs for demo
        const mockNFTs: VoiceNFT[] = [
          {
            tokenId: '1',
            owner: '0xF00b53AF46FAd844b6A6cB6ea466e562D27fDE11',
            languageCode: 'twi',
            quality: 95,
            duration: 28,
            timestamp: Date.now() - 3600000,
            ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
            rewards: '450',
          },
          {
            tokenId: '2',
            owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            languageCode: 'yoruba',
            quality: 92,
            duration: 30,
            timestamp: Date.now() - 7200000,
            ipfsHash: 'QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewuL8Eb8j7cDDP',
            rewards: '480',
          },
          {
            tokenId: '3',
            owner: address || '0x0000000000000000000000000000000000000000',
            languageCode: 'wolof',
            quality: 88,
            duration: 25,
            timestamp: Date.now() - 10800000,
            ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
            rewards: '660',
          },
        ];

        // Combine local and mock NFTs
        const allNFTs = [...localNFTs, ...mockNFTs];
        setNfts(allNFTs);
        
        if (address) {
          setMyNfts(allNFTs.filter(nft => 
            nft.owner.toLowerCase() === address.toLowerCase()
          ));
        }
        
        setTotalSupply(allNFTs.length);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, [publicClient, address]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const displayNfts = view === 'mine' ? myNfts : nfts;

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <h1>🎨 Voice Share Gallery</h1>
        <p>Explore the preserved voices of Africa</p>
        <div className="wallet-section">
          <WalletButton />
        </div>
        
        {/* Quick Navigation */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a 
            href="/contribute" 
            className="cta-button"
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎙️ Record Voice
          </a>
          <a 
            href="/" 
            style={{
              padding: '0.75rem 2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🏠 Home
          </a>
          <a 
            href="/pitch" 
            style={{
              padding: '0.75rem 2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            📊 Pitch Deck
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="gallery-stats">
        <div className="stat-item">
          <FiHash className="stat-icon" />
          <span className="stat-value">{totalSupply}</span>
          <span className="stat-label">Total Voices</span>
        </div>
        <div className="stat-item">
          <FiUser className="stat-icon" />
          <span className="stat-value">{userBalance ? Number(userBalance) : 0}</span>
          <span className="stat-label">My Voices</span>
        </div>
        <div className="stat-item">
          <FiGlobe className="stat-icon" />
          <span className="stat-value">{Object.keys(languageNames).length}</span>
          <span className="stat-label">Languages</span>
        </div>
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button 
          className={view === 'all' ? 'active' : ''}
          onClick={() => setView('all')}
        >
          All Voices
        </button>
        <button 
          className={view === 'mine' ? 'active' : ''}
          onClick={() => setView('mine')}
          disabled={!isConnected}
        >
          My Collection
        </button>
      </div>

      {/* NFT Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading Voice Shares...</p>
        </div>
      ) : displayNfts.length === 0 ? (
        <div className="empty-state">
          <FiMusic size={48} />
          <h3>{view === 'mine' ? 'No Voice Shares yet' : 'No Voice Shares minted'}</h3>
          <p>{view === 'mine' ? 'Start recording to mint your first NFT!' : 'Be the first to preserve a voice!'}</p>
          <a href="/contribute" className="cta-button">Start Recording</a>
        </div>
      ) : (
        <div className="nft-grid">
          {displayNfts.map((nft, index) => (
            <motion.div
              key={nft.tokenId}
              className="nft-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="nft-header">
                <span className="token-id">#{nft.tokenId}</span>
                <span className="language-badge">{languageNames[nft.languageCode]}</span>
              </div>
              
              <div className="nft-visual">
                <div className="audio-wave">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="wave-bar" 
                      style={{ 
                        height: `${Math.random() * 60 + 20}%`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="nft-details">
                <div className="detail-item">
                  <FiAward />
                  <span>Quality: {nft.quality}%</span>
                </div>
                <div className="detail-item">
                  <FiClock />
                  <span>Duration: {nft.duration}s</span>
                </div>
                <div className="detail-item">
                  <span className="rewards">{nft.rewards} $LINGUA earned</span>
                </div>
              </div>

              <div className="nft-footer">
                <div className="owner-address">
                  {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                </div>
                <div className="timestamp">
                  {formatTime(nft.timestamp)}
                </div>
              </div>

              <div className="nft-actions">
                <a 
                  href={`https://sepolia.basescan.org/token/${CONTRACT_ADDRESSES.voiceSharesNFT}?a=${nft.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  View on BaseScan
                </a>
                <a 
                  href={`https://w3s.link/ipfs/${nft.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ipfs-button"
                >
                  View on IPFS
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}