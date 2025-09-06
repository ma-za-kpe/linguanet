'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMic, FiMicOff, FiDollarSign, FiCheck, FiX,
  FiUser, FiAward, FiSmartphone,
  FiPlay, FiPause, FiCheckCircle, FiShield,
  FiZap, FiGlobe, FiArrowRight
} from 'react-icons/fi';
import { WalletButton } from '@/components/WalletButton';
import { Web3StorageSetup } from '@/components/Web3StorageSetup';
import { useBlockchain } from '@/lib/hooks/useBlockchain';
import { useVoiceMining, useClaimRewards } from '@/lib/hooks/useMining';
import { uploadToIPFS } from '@/lib/ipfs';
import { formatENSDisplay, generateENSName } from '@/lib/ens';
import { CONTRACT_ADDRESSES } from '@/lib/contracts-config';
import { initializeW3Storage } from '@/lib/w3storage-client';
import './contribute-linguadao.css';

type RecordingState = 'idle' | 'recording' | 'review' | 'success' | 'error';

// Languages with rarity multipliers
const languages = [
  { code: 'twi', name: 'Twi', flag: '🇬🇭', multiplier: 2, status: 'vulnerable' },
  { code: 'yoruba', name: 'Yoruba', flag: '🇳🇬', multiplier: 2, status: 'vulnerable' },
  { code: 'swahili', name: 'Swahili', flag: '🇰🇪', multiplier: 1.5, status: 'stable' },
  { code: 'wolof', name: 'Wolof', flag: '🇸🇳', multiplier: 3, status: 'endangered' },
  { code: 'fon', name: 'Fon', flag: '🇧🇯', multiplier: 4, status: 'critical' },
  { code: 'ewe', name: 'Ewe', flag: '🇹🇬', multiplier: 3, status: 'endangered' },
  { code: 'ga', name: 'Ga', flag: '🇬🇭', multiplier: 4, status: 'critical' },
  { code: 'hausa', name: 'Hausa', flag: '🇳🇬', multiplier: 1.5, status: 'stable' },
  { code: 'zulu', name: 'Zulu', flag: '🇿🇦', multiplier: 2, status: 'vulnerable' },
  { code: 'amharic', name: 'Amharic', flag: '🇪🇹', multiplier: 2, status: 'vulnerable' },
  { code: 'tigrinya', name: 'Tigrinya', flag: '🇪🇷', multiplier: 3, status: 'endangered' },
  { code: 'oromo', name: 'Oromo', flag: '🇪🇹', multiplier: 2, status: 'vulnerable' },
];

export default function ContributeClient() {
  // Web3 hooks
  const { 
    address, 
    isConnected, 
    ensName, 
    usdcBalance, 
    linguaBalance,
    voiceSharesBalance,
    registerUserENS,
    isRegistering 
  } = useBlockchain();
  
  const { submitVoiceData, isSubmitting, isConfirmed } = useVoiceMining();
  const { claimRewards, isClaiming } = useClaimRewards();

  // State Management
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [qualityScore, setQualityScore] = useState(0);
  const [miningReward, setMiningReward] = useState(0);

  // Stats from blockchain or mock for demo
  const [guardianTier] = useState('Expert');
  const [stakingBoost] = useState(1.5);
  const [totalEarned] = useState('1,284');
  const [contributionsCount] = useState(voiceSharesBalance || 0);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const mediaRecorderRef = useRef<MediaRecorder | undefined>(undefined);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize Web3.Storage on mount
  useEffect(() => {
    initializeW3Storage().catch(console.error);
  }, []);

  // Calculate mining rewards
  const calculateReward = () => {
    const language = languages.find(l => l.code === selectedLanguage);
    if (!language) return 0;
    
    const baseReward = 100; // Base $LINGUA tokens
    const quality = qualityScore || 0.9; // Default high quality
    const rarity = language.multiplier;
    const staking = stakingBoost;
    
    return Math.floor(baseReward * quality * rarity * staking);
  };

  // Recording Functions
  const startRecording = async () => {
    if (!selectedLanguage) {
      alert('Please select a language first');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        
        // Calculate mock quality score
        const mockQuality = 0.85 + Math.random() * 0.15;
        setQualityScore(mockQuality);
        
        // Calculate reward
        const reward = calculateReward();
        setMiningReward(reward);
        
        setRecordingState('review');
      };

      mediaRecorder.start();
      setRecordingState('recording');
      setRecordingTime(0);

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const submitRecording = async () => {
    if (!audioBlob || !selectedLanguage) return;
    
    try {
      // Upload to IPFS
      const language = languages.find(l => l.code === selectedLanguage);
      const metadata = {
        language: selectedLanguage,
        languageName: language?.name,
        duration: recordingTime,
        timestamp: Date.now(),
        quality: qualityScore || 0.9,
        rarity: language?.multiplier || 1,
      };
      
      const ipfsHash = await uploadToIPFS(audioBlob, metadata, address);
      
      // Submit to blockchain
      const result = await submitVoiceData(
        selectedLanguage,
        ipfsHash,
        {
          duration: recordingTime,
          quality: qualityScore || 0.9,
          rarity: language?.multiplier || 1,
        }
      );
      
      if (result.success || isConfirmed) {
        setRecordingState('success');
        // Show success message with transaction details
        console.log('Voice Share NFT minted successfully!');
        console.log('IPFS Hash:', ipfsHash);
        console.log('View on IPFS:', `https://w3s.link/ipfs/${ipfsHash}`);
        
        setTimeout(() => {
          setRecordingState('idle');
          setRecordingTime(0);
          setAudioBlob(null);
          setSelectedLanguage('');
        }, 5000);
      } else {
        setRecordingState('error');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setRecordingState('error');
    }
  };

  const discardRecording = () => {
    setRecordingState('idle');
    setRecordingTime(0);
    setAudioBlob(null);
    setQualityScore(0);
    setMiningReward(0);
  };


  return (
    <div className="contribute-container">
      {/* Header Section */}
      <div className="contribute-header">
        <h1>🎙️ Voice Mining Protocol</h1>
        <p>Preserve languages, earn $LINGUA tokens</p>
        <div className="wallet-section">
          <WalletButton />
        </div>
        
        {/* Quick Navigation to Gallery */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a 
            href="/gallery" 
            className="gallery-button"
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #22c55e, #10b981)',
              color: 'white',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
              transition: 'transform 0.3s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎨 View NFT Gallery
            {voiceSharesBalance > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.3)',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.85rem'
              }}>
                {voiceSharesBalance} NFTs
              </span>
            )}
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
            📊 Dashboard
          </a>
        </div>
      </div>

      {/* Stats Dashboard */}
      {isConnected && (
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{linguaBalance ? Number(linguaBalance).toLocaleString() : '0'}</div>
              <div className="stat-label">$LINGUA Balance</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-content">
              <div className="stat-value">{voiceSharesBalance || 0}</div>
              <div className="stat-label">Voice Share NFTs</div>
            </div>
          </div>
          
          <div className="stat-card highlight">
            <div className="stat-icon">⚔️</div>
            <div className="stat-content">
              <div className="stat-value">{guardianTier}</div>
              <div className="stat-label">Guardian Tier</div>
              <div className="stat-bonus">+50% Mining Boost</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{totalEarned}</div>
              <div className="stat-label">Total Earned</div>
            </div>
          </div>
        </div>
      )}

      {/* Web3.Storage Setup (show only when connected) */}
      {isConnected && (
        <Web3StorageSetup />
      )}

      {/* Language Selection */}
      <div className="language-section">
        <h2>Select Language to Mine</h2>
        <div className="language-grid">
          {languages.map(lang => (
            <div
              key={lang.code}
              className={`language-card ${lang.status} ${selectedLanguage === lang.code ? 'selected' : ''}`}
              onClick={() => setSelectedLanguage(lang.code)}
            >
              <div className="language-flag">{lang.flag}</div>
              <div className="language-name">{lang.name}</div>
              <div className="language-multiplier">{lang.multiplier}x</div>
              <div className={`language-status ${lang.status}`}>
                {lang.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recording Section */}
      <div className="recording-section">
        <h2>Voice Mining Station</h2>
        <p className="recording-instructions">
          Record 30 seconds of natural speech in your selected language
        </p>

        {/* Mining Formula Display */}
        {selectedLanguage && (
          <div className="mining-formula">
            <div className="formula-display">
              <div className="formula-part">100 $LINGUA</div>
              <span className="operator">×</span>
              <div className="formula-part">Quality {qualityScore ? qualityScore.toFixed(2) : '0.90'}</div>
              <span className="operator">×</span>
              <div className="formula-part">
                {languages.find(l => l.code === selectedLanguage)?.multiplier}x Rarity
              </div>
              <span className="operator">×</span>
              <div className="formula-part">{stakingBoost}x Staking</div>
              <span className="equals">=</span>
              <div className="result">
                {calculateReward()} $LINGUA
              </div>
            </div>
          </div>
        )}

        <div className="recording-interface">
          <AnimatePresence mode="wait">
            {/* Idle State */}
            {recordingState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  className="record-button start"
                  onClick={startRecording}
                  disabled={!selectedLanguage || !isConnected}
                >
                  <FiMic /> Start Recording
                </button>
                {!selectedLanguage && (
                  <p style={{ marginTop: '20px', color: '#a1a1aa' }}>
                    Please select a language above to begin mining
                  </p>
                )}
              </motion.div>
            )}

            {/* Recording State */}
            {recordingState === 'recording' && (
              <motion.div
                key="recording"
                className="recording-active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="recording-indicator">
                  <div className="pulse-ring"></div>
                  <div className="pulse-ring delay-1"></div>
                  <div className="pulse-ring delay-2"></div>
                  <div className="mic-icon">🎤</div>
                </div>
                
                <div className="recording-timer">{recordingTime}s / 30s</div>
                
                <div className="recording-progress">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(recordingTime / 30) * 100}%` }}
                  />
                </div>
                
                <button
                  className="record-button stop"
                  onClick={stopRecording}
                >
                  <FiMicOff /> Stop Recording
                </button>
              </motion.div>
            )}

            {/* Review State */}
            {recordingState === 'review' && (
              <motion.div
                key="review"
                className="review-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3>🎯 Mining Results</h3>
                
                <div className="mining-results">
                  <div className="result-item">
                    <span className="result-label">Language</span>
                    <span className="result-value">
                      {languages.find(l => l.code === selectedLanguage)?.name}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Duration</span>
                    <span className="result-value">{recordingTime} seconds</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Quality Score</span>
                    <span className="result-value">{(qualityScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="result-item highlight">
                    <span className="result-label">Mining Reward</span>
                    <span className="result-value">{miningReward} $LINGUA</span>
                  </div>
                </div>
                
                <div className="review-actions">
                  {audioBlob && (
                    <audio 
                      controls 
                      src={URL.createObjectURL(audioBlob)}
                    />
                  )}
                  
                  <div className="action-buttons">
                    <button 
                      className="action-button discard"
                      onClick={discardRecording}
                    >
                      <FiX /> Discard
                    </button>
                    <button 
                      className="action-button submit"
                      onClick={submitRecording}
                    >
                      <FiCheck /> Submit to Blockchain
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {recordingState === 'success' && (
              <motion.div
                key="success"
                className="success-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="success-icon">✅</div>
                <h3>Voice Share NFT Minted!</h3>
                <p>{miningReward} $LINGUA tokens earned</p>
                <p className="nft-mint">Voice Share NFT #{voiceSharesBalance + 1} minted</p>
                <div className="success-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <a 
                    href="/gallery" 
                    className="success-button"
                    style={{ padding: '0.75rem 1.5rem', background: 'white', color: '#667eea', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    View in Gallery
                  </a>
                  <a 
                    href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESSES.voiceSharesNFT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="success-button secondary"
                    style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    View on BaseScan
                  </a>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {recordingState === 'error' && (
              <motion.div
                key="error"
                className="error-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '40px' }}
              >
                <FiX size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
                <p style={{ color: '#ef4444' }}>Recording failed. Please try again.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Features Section */}
      {!isConnected && (
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🎙️</div>
            <h3>Voice Mining</h3>
            <p>Record language data and earn $LINGUA tokens instantly</p>
            <button className="feature-button">Learn More</button>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Voice Share NFTs</h3>
            <p>Own a piece of the AI models you help train</p>
            <button className="feature-button">View Collection</button>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚔️</div>
            <h3>Guardian Tiers</h3>
            <p>Progress through tiers and earn multipliers</p>
            <button className="feature-button">View Tiers</button>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Language Insurance</h3>
            <p>Protect endangered languages with DeFi insurance</p>
            <button className="feature-button">Get Coverage</button>
          </div>
        </div>
      )}

      {/* Connect Prompt for non-connected users */}
      {!isConnected && (
        <div className="connect-prompt">
          <div className="connect-card">
            <div className="connect-icon">🌍</div>
            <h2>Join LinguaDAO</h2>
            <p>Connect your wallet to start mining voices and preserving languages</p>
            
            <div className="benefits-list">
              <div className="benefit">
                <FiCheck style={{ color: '#22c55e' }} />
                Earn up to 1,200 $LINGUA per recording
              </div>
              <div className="benefit">
                <FiCheck style={{ color: '#22c55e' }} />
                Get Voice Share NFTs with revenue rights
              </div>
              <div className="benefit">
                <FiCheck style={{ color: '#22c55e' }} />
                Join DAO governance and shape the future
              </div>
              <div className="benefit">
                <FiCheck style={{ color: '#22c55e' }} />
                Help preserve endangered languages
              </div>
            </div>
            
            <button className="connect-button-large">
              Connect Wallet to Start Mining
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
