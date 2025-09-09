'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { WalletButton } from '@/components/WalletButton';
import { CONTRACT_ADDRESSES } from '@/lib/contracts-config';
import { motion } from 'framer-motion';
import { FiMusic, FiClock, FiAward, FiUser, FiGlobe, FiHash, FiPlay, FiPause, FiDownload } from 'react-icons/fi';
import './gallery.css';
import './gallery-mobile.css';

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
  const [nfts, setNfts] = useState<VoiceNFT[]>([]);
  const [myNfts, setMyNfts] = useState<VoiceNFT[]>([]);
  const [view, setView] = useState<'all' | 'mine'>('all');
  const [loading, setLoading] = useState(true);
  const [totalSupply, setTotalSupply] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});



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
          voices.forEach((voice: { 
            ipfsHash: string; 
            metadata?: { 
              language?: string; 
              quality?: number; 
              duration?: number; 
              rarity?: number; 
            }; 
            timestamp?: number; 
            email?: string;
            walletAddress?: string;
          }, index: number) => {
            localNFTs.push({
              tokenId: `VS-${index + 1}`, // Voice Share prefix
              // Use the stored wallet address or fallback to placeholder
              owner: voice.walletAddress || '0x0000000000000000000000000000000000000000',
              languageCode: voice.metadata?.language || 'unknown',
              quality: Math.round((voice.metadata?.quality || 0.9) * 100),
              duration: voice.metadata?.duration || 30,
              timestamp: voice.timestamp || Date.now(),
              ipfsHash: voice.ipfsHash,
              rewards: String(Math.floor(100 * (voice.metadata?.quality || 0.9) * (voice.metadata?.rarity || 1) * 1.5)),
            });
          });
        }

        // Use only real NFTs from localStorage and blockchain
        const allNFTs = [...localNFTs];
        
        // Sort by timestamp - newest first
        allNFTs.sort((a, b) => b.timestamp - a.timestamp);
        
        setNfts(allNFTs);
        
        if (address) {
          const userNfts = allNFTs.filter(nft => 
            nft.owner.toLowerCase() === address.toLowerCase()
          );
          // Also sort user's NFTs by newest first
          userNfts.sort((a, b) => b.timestamp - a.timestamp);
          setMyNfts(userNfts);
        }
        
        setTotalSupply(allNFTs.length);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, [address]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get audio URL from IPFS using proper gateway format
  const getAudioUrl = (ipfsHash: string) => {
    // Handle real IPFS hashes from Web3.Storage
    if (ipfsHash.startsWith('bafy') || ipfsHash.startsWith('Qm')) {
      // Use w3s.link which is currently working for audio files
      const audioUrl = `https://${ipfsHash}.ipfs.w3s.link/audio.webm`;
      console.log('[Gallery] Audio URL:', audioUrl);
      return audioUrl;
    }
    // For local/mock hashes, use a demo audio
    console.log('[Gallery] Using demo audio for mock hash:', ipfsHash);
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn9rPuzAAhY2RjWxXSpRxzvNqFQeGkeaLdRQ=';
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
        
        // Handle playback error  
        const handlePlaybackError = (err: Error | unknown) => {
          console.error('[Gallery] Audio playback failed:', err);
          setPlayingId(null);
          // In production, could show user-friendly error message
        };
        
        // Check if it's a real IPFS hash
        if (ipfsHash.startsWith('bafy') || ipfsHash.startsWith('Qm')) {
          console.log('[Gallery] Attempting to play IPFS audio for token:', tokenId);
          console.log('[Gallery] IPFS hash:', ipfsHash);
          
          // Try to play from IPFS first
          if (!audioRefs.current[tokenId]) {
            const audioUrl = `https://${ipfsHash}.ipfs.w3s.link/audio.webm`;
            console.log('[Gallery] Fetching audio from:', audioUrl);
            
            // Try to fetch as blob first for better compatibility
            fetch(audioUrl)
              .then(response => {
                console.log('[Gallery] Fetch response status:', response.status);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.blob();
              })
              .then(blob => {
                console.log('[Gallery] Audio blob received, size:', blob.size, 'type:', blob.type);
                const blobUrl = URL.createObjectURL(blob);
                const audio = new Audio(blobUrl);
                
                audio.onloadeddata = () => {
                  console.log('[Gallery] Audio loaded successfully');
                };
                
                audio.onplay = () => {
                  console.log('[Gallery] Audio playing');
                  setPlayingId(tokenId);
                };
                
                audio.onended = () => {
                  console.log('[Gallery] Audio ended');
                  setPlayingId(null);
                  URL.revokeObjectURL(blobUrl); // Clean up
                };
                
                audio.onerror = (e) => {
                  console.log('[Gallery] Audio playback error:', e);
                  console.log('[Gallery] Attempting direct play as fallback');
                  URL.revokeObjectURL(blobUrl);
                  
                  // Try direct audio element as fallback
                  const fallbackAudio = new Audio();
                  fallbackAudio.src = audioUrl;
                  fallbackAudio.play()
                    .then(() => {
                      setPlayingId(tokenId);
                      audioRefs.current[tokenId] = fallbackAudio;
                    })
                    .catch(err => handlePlaybackError(err));
                };
                
                audioRefs.current[tokenId] = audio;
                audio.play().catch((err) => {
                  console.log('[Gallery] Play failed:', err);
                  handlePlaybackError(err);
                });
              })
              .catch(error => {
                console.log('[Gallery] Fetch error:', error);
                handlePlaybackError(error);
              });
          } else {
            // Audio already exists, try to play
            console.log('[Gallery] Reusing existing audio element');
            audioRefs.current[tokenId].play()
              .then(() => {
                console.log('[Gallery] Resumed playback successfully');
                setPlayingId(tokenId);
              })
              .catch((err) => {
                console.log('[Gallery] Resume failed:', err);
                handlePlaybackError(err);
              });
          }
        } else {
          // Invalid IPFS hash
          console.log('[Gallery] Invalid IPFS hash');
          handlePlaybackError(new Error('Invalid IPFS hash'));
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
        <div className="quick-nav-buttons" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
          <Link 
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
          </Link>
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
          <span className="stat-value">{myNfts.length}</span>
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
                {/* Visual representation with LinguaDAO branding */}
                <div className="nft-image-wrapper">
                  <Image 
                    src="/linguadao-profile.png" 
                    alt="Voice Share NFT"
                    className="nft-logo"
                    width={60}
                    height={60}
                  />
                  <div className="language-overlay">
                    {languageNames[nft.languageCode]?.split(' ')[0]}
                  </div>
                </div>
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
                  href={`https://sepolia.basescan.org/token/${CONTRACT_ADDRESSES.voiceSharesNFT || '0xCC1D5C4e4b2B9aafADd31976051f52dF3d8f1308'}?a=${nft.tokenId}`}
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