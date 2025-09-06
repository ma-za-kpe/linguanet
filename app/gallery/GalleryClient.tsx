'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useReadContract, useContractRead, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESSES, getContractConfig } from '@/lib/contracts-config';
import { WalletButton } from '@/components/WalletButton';
import { motion } from 'framer-motion';
import { FiMusic, FiClock, FiAward, FiUser, FiGlobe, FiHash, FiPlay, FiPause, FiDownload } from 'react-icons/fi';
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
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

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
          voices.forEach((voice: { ipfsHash: string; metadata?: any; timestamp?: number; email?: string }, index: number) => {
            localNFTs.push({
              tokenId: `VS-${index + 1}`, // Voice Share prefix
              owner: address || voice.email || '0x0000000000000000000000000000000000000000',
              languageCode: voice.metadata?.language || 'unknown',
              quality: Math.round((voice.metadata?.quality || 0.9) * 100),
              duration: voice.metadata?.duration || 30,
              timestamp: voice.timestamp || Date.now(),
              ipfsHash: voice.ipfsHash,
              rewards: String(Math.floor(100 * (voice.metadata?.quality || 0.9) * (voice.metadata?.rarity || 1) * 1.5)),
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

  // Get audio URL from IPFS using proper gateway format
  const getAudioUrl = (ipfsHash: string) => {
    // Handle real IPFS hashes from Web3.Storage
    if (ipfsHash.startsWith('bafy') || ipfsHash.startsWith('Qm')) {
      // Use the correct subdomain format: https://${cid}.ipfs.${gatewayHost}
      // The uploaded directory contains audio.webm and metadata.json
      return `https://${ipfsHash}.ipfs.w3s.link/audio.webm`;
    }
    // For local/mock hashes, use a demo audio
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn9rPuzAAhY2RjWxXSpRxzvNqFQeGkeaLdRQ='; // Small silent audio for demo
  };

  const handlePlayPause = async (tokenId: string, ipfsHash: string) => {
    try {
      if (playingId === tokenId) {
        // Pause current audio
        if (audioRefs.current[tokenId]) {
          audioRefs.current[tokenId].pause();
        }
        setPlayingId(null);
      } else {
        // Stop any currently playing audio
        if (playingId && audioRefs.current[playingId]) {
          audioRefs.current[playingId].pause();
        }
        
        // Create or play the audio
        if (!audioRefs.current[tokenId]) {
          const audioUrl = getAudioUrl(ipfsHash);
          const audio = new Audio();
          
          // Set up error handling
          audio.onerror = (e) => {
            console.error('Audio playback error:', e);
            // Create a simple beep sound as fallback
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.frequency.value = 440; // A4 note
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            setTimeout(() => {
              oscillator.stop();
              setPlayingId(null);
            }, 500); // Play for 0.5 seconds
          };
          
          audio.onended = () => setPlayingId(null);
          
          // Try to load the audio
          audio.src = audioUrl;
          audioRefs.current[tokenId] = audio;
        }
        
        // Try to play
        const playPromise = audioRefs.current[tokenId].play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setPlayingId(tokenId);
          }).catch((error) => {
            console.log('Playback failed, using fallback beep');
            // Use Web Audio API as fallback
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            
            oscillator.frequency.value = 440; // A4 note
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            setPlayingId(tokenId);
            
            setTimeout(() => {
              oscillator.stop();
              setPlayingId(null);
            }, 1000); // Play for 1 second
          });
        }
      }
    } catch (error) {
      console.error('Audio handling error:', error);
    }
  };

  const displayNfts = view === 'mine' ? myNfts : nfts;

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <h1>🎨 Voice Shares Gallery</h1>
        <p>Own a piece of the AI models you help train • Proof of Voice NFTs</p>
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
                <div className="audio-player-section">
                  <button 
                    className="play-button"
                    onClick={() => handlePlayPause(nft.tokenId, nft.ipfsHash)}
                    aria-label={playingId === nft.tokenId ? 'Pause' : 'Play'}
                  >
                    {playingId === nft.tokenId ? <FiPause size={24} /> : <FiPlay size={24} />}
                  </button>
                  <div className="audio-wave">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`wave-bar ${playingId === nft.tokenId ? 'playing' : ''}`}
                        style={{ 
                          height: `${Math.random() * 60 + 20}%`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="nft-details">
                <div className="detail-item">
                  <FiAward />
                  <span>Quality Score: {nft.quality}%</span>
                </div>
                <div className="detail-item">
                  <FiClock />
                  <span>Duration: {nft.duration}s</span>
                </div>
                <div className="detail-item highlight">
                  <span className="rewards">💰 {nft.rewards} $LINGUA earned</span>
                </div>
                <div className="detail-item">
                  <span className="revenue-share">📊 Revenue Share: 0.001%</span>
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
                <button 
                  className="download-button"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = getAudioUrl(nft.ipfsHash);
                    link.download = `voice-share-${nft.tokenId}.webm`;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  title="Download Audio"
                >
                  <FiDownload /> Download
                </button>
                <a 
                  href={`https://${nft.ipfsHash}.ipfs.w3s.link/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ipfs-button"
                  title="View on IPFS"
                >
                  🌐 IPFS
                </a>
                <a 
                  href={`https://sepolia.basescan.org/token/${CONTRACT_ADDRESSES.voiceSharesNFT}?a=${nft.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-button"
                  title="View on BaseScan"
                >
                  ⛓️ Chain
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}