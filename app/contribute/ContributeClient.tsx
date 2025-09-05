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
import { useBlockchain, useSubmitAudio, useValidateAudio, useWithdraw } from '@/lib/hooks/useBlockchain';
import { formatENSDisplay, generateENSName } from '@/lib/ens';
import './contribute.css';
import './contribute-enhanced.css';

type Mode = 'contributor' | 'validator';
type RecordingState = 'idle' | 'recording' | 'processing' | 'success' | 'error';

export default function ContributeClient() {
  // Web3 hooks
  const { 
    address, 
    isConnected, 
    ensName, 
    usdcBalance, 
    contributorStats,
    registerUserENS,
    isRegistering 
  } = useBlockchain();
  
  const { submitAudio, isSubmitting } = useSubmitAudio();
  const { validateAudio, isValidating } = useValidateAudio();
  const { withdrawToMobileMoney, isWithdrawing } = useWithdraw();

  // State Management
  const [mode, setMode] = useState<Mode>('contributor');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('twi');
  
  // Validator State
  const [validationQueue, setValidationQueue] = useState([
    { id: 1, contributor: 'kofi.linguanet.eth', duration: 32, status: 'pending', cid: 'QmXyz123' },
    { id: 2, contributor: 'ama.linguanet.eth', duration: 28, status: 'pending', cid: 'QmAbc456' },
    { id: 3, contributor: 'kwame.linguanet.eth', duration: 30, status: 'pending', cid: 'QmDef789' }
  ]);
  const [currentValidation, setCurrentValidation] = useState(0);
  const [validationStreak, setValidationStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const waveformRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Check wallet connection on mount
  useEffect(() => {
    if (isConnected && address) {
      setIsOnboarding(false);
    }
  }, [isConnected, address]);

  // Handle Phone Login with ENS
  const handleLogin = async () => {
    if (phoneNumber.length >= 10) {
      if (!isConnected) {
        // Show wallet connect modal
        alert('Please connect your wallet first');
        return;
      }

      // Register ENS name
      const result = await registerUserENS(phoneNumber);
      if (result.success) {
        setIsOnboarding(false);
      } else {
        alert(`Failed to register ENS: ${result.error}`);
      }
    }
  };

  // Recording Functions with blockchain integration
  const startRecording = () => {
    setRecordingState('recording');
    setRecordingTime(0);
    
    // Timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // Simulate waveform
    waveformRef.current = setInterval(() => {
      const waves = Array.from({ length: 30 }, () => 
        Math.random() * 50 + 25
      );
      setAudioWaveform(waves);
    }, 100);
  };

  const stopRecording = async () => {
    clearInterval(timerRef.current);
    clearInterval(waveformRef.current);
    
    if (recordingTime < 30) {
      setRecordingState('error');
      setTimeout(() => setRecordingState('idle'), 2000);
      return;
    }

    setRecordingState('processing');
    
    // Submit to blockchain
    const result = await submitAudio(selectedLanguage, '', recordingTime);
    
    if (result.success) {
      setRecordingState('success');
      setTimeout(() => {
        setRecordingState('idle');
        setRecordingTime(0);
        setAudioWaveform([]);
      }, 3000);
    } else {
      setRecordingState('error');
      alert(`Submission failed: ${result.error}`);
      setTimeout(() => setRecordingState('idle'), 2000);
    }
  };

  // Validator Functions with blockchain
  const handleValidation = async (isValid: boolean) => {
    const current = validationQueue[currentValidation];
    if (current) {
      // Submit validation to blockchain
      const result = await validateAudio(current.cid, isValid);
      
      if (result.success) {
        // Update status
        const updated = [...validationQueue];
        updated[currentValidation].status = isValid ? 'approved' : 'rejected';
        setValidationQueue(updated);
        
        if (isValid) {
          setValidationStreak(prev => prev + 1);
        }
        
        // Move to next
        setTimeout(() => {
          if (currentValidation < validationQueue.length - 1) {
            setCurrentValidation(prev => prev + 1);
          }
        }, 1000);
      } else {
        alert(`Validation failed: ${result.error}`);
      }
    }
  };

  const playAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  // Withdrawal with mobile money
  const handleWithdraw = async () => {
    if (!phoneNumber) {
      alert('Please enter your phone number');
      return;
    }

    const provider = 'MTN'; // Detect based on phone number in production
    const result = await withdrawToMobileMoney(phoneNumber, provider);
    
    if (result.success) {
      alert(`Withdrawal initiated! Transaction: ${result.txHash}`);
    } else {
      alert(`Withdrawal failed: ${result.error}`);
    }
  };

  return (
    <div className="contribute-container">
      {/* Wallet Connection Header */}
      <div className="wallet-header" style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
      }}>
        <WalletButton />
      </div>

      <AnimatePresence mode="wait">
        {/* Onboarding Screen */}
        {isOnboarding ? (
          <motion.div
            key="onboarding"
            className="onboarding-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div 
              className="onboarding-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Logo Section */}
              <div className="app-logo">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  🌍
                </motion.div>
              </div>
              
              <h1>LinguaNet</h1>
              <p>Decentralized African Language Marketplace</p>
              
              {/* Progress Bar */}
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: isConnected ? '50%' : '0%' }}
                />
              </div>
              
              <div className="login-form">
                {/* Step Indicators */}
                <div className={`step-indicator ${!isConnected ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <span className="step-text">Connect Wallet</span>
                </div>
                
                {!isConnected ? (
                  <>
                    <div className="wallet-connection-area">
                      <div className="wallet-status not-connected">
                        <div className="status-icon"></div>
                        <span className="status-text">No wallet connected</span>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <WalletButton />
                      </motion.div>
                      
                      <div style={{ 
                        textAlign: 'center', 
                        marginTop: '20px',
                        color: '#a1a1aa',
                        fontSize: '13px'
                      }}>
                        Don&apos;t have a wallet? 
                        <a 
                          href="https://metamask.io" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#7c3aed', textDecoration: 'underline' }}
                        >
                          Get MetaMask
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`step-indicator active`}>
                      <div className="step-number">2</div>
                      <span className="step-text">Register Account</span>
                    </div>
                    
                    <div className="wallet-status">
                      <div className="status-icon"></div>
                      <span className="status-text">
                        Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                    </div>
                    
                    <div className="phone-input-group">
                      <FiSmartphone className="phone-icon" />
                      <input
                        type="tel"
                        placeholder="Enter phone number (e.g., 0241234567)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="phone-input"
                        maxLength={15}
                      />
                    </div>
                    
                    {phoneNumber.length >= 10 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          padding: '12px',
                          background: 'rgba(124, 58, 237, 0.1)',
                          borderRadius: '8px',
                          marginBottom: '20px',
                          fontSize: '13px',
                          color: '#a1a1aa'
                        }}
                      >
                        Your ENS name will be: <strong style={{ color: '#7c3aed' }}>
                          {generateENSName(phoneNumber).split('.')[0]}
                        </strong>.linguanet.eth
                      </motion.div>
                    )}
                    
                    <motion.button
                      className="login-button"
                      onClick={handleLogin}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={phoneNumber.length < 10 || isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <div className="spinner" />
                          Creating your account...
                        </>
                      ) : (
                        <>
                          Continue to App
                          <FiArrowRight />
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </div>

              {/* Enhanced Features Grid */}
              <div className="onboarding-features">
                <motion.div 
                  className="feature"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FiMic />
                  <div className="feature-title">Record</div>
                  <div className="feature-description">30 seconds of audio</div>
                </motion.div>
                
                <motion.div 
                  className="feature"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <FiZap />
                  <div className="feature-title">Earn</div>
                  <div className="feature-description">$3 USDC instantly</div>
                </motion.div>
                
                <motion.div 
                  className="feature"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <FiSmartphone />
                  <div className="feature-title">Withdraw</div>
                  <div className="feature-description">To Mobile Money</div>
                </motion.div>
              </div>
              
              {/* Trust Badges */}
              <motion.div 
                className="trust-badges"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="trust-badge">
                  <FiShield />
                  <span>Secured by Base L2</span>
                </div>
                <div className="trust-badge">
                  <FiGlobe />
                  <span>12 African Languages</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* Main App */
          <motion.div
            key="main-app"
            className="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Header */}
            <header className="app-header">
              <div className="user-info">
                <div className="user-avatar">
                  <FiUser />
                </div>
                <div>
                  <div className="user-address">
                    {ensName ? formatENSDisplay(ensName) : address?.slice(0, 6) + '...' + address?.slice(-4)}
                  </div>
                  <div className="user-phone">{phoneNumber}</div>
                </div>
              </div>
              
              <div className="balance-info">
                <div className="balance-amount">
                  <FiDollarSign />
                  <span>{usdcBalance}</span>
                  <span className="currency">USDC</span>
                </div>
                {parseFloat(usdcBalance) > 0 && (
                  <motion.button
                    className="withdraw-button"
                    onClick={handleWithdraw}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? 'Processing...' : 'Withdraw to MTN'}
                  </motion.button>
                )}
              </div>
            </header>

            {/* Language Selector */}
            <div className="language-selector" style={{ margin: '20px 0' }}>
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #333',
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                }}
              >
                <option value="twi">🇬🇭 Twi</option>
                <option value="swahili">🇰🇪 Swahili</option>
                <option value="yoruba">🇳🇬 Yoruba</option>
                <option value="hausa">🇳🇬 Hausa</option>
                <option value="amharic">🇪🇹 Amharic</option>
                <option value="zulu">🇿🇦 Zulu</option>
              </select>
            </div>

            {/* Mode Switcher */}
            <div className="mode-switcher">
              <motion.button
                className={`mode-button ${mode === 'contributor' ? 'active' : ''}`}
                onClick={() => setMode('contributor')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiMic /> Contributor
              </motion.button>
              <motion.button
                className={`mode-button ${mode === 'validator' ? 'active' : ''}`}
                onClick={() => setMode('validator')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiAward /> Validator
              </motion.button>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              {mode === 'contributor' ? (
                /* Contributor Mode */
                <motion.div
                  key="contributor"
                  className="contributor-mode"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="record-section">
                    <h2>Earn $3 in 30 Seconds</h2>
                    <p>Record yourself speaking {selectedLanguage}</p>

                    {/* Stats from blockchain */}
                    {contributorStats && (
                      <div className="contributor-stats">
                        <div className="stat">
                          <span>Submissions:</span>
                          <strong>{contributorStats.submissions}</strong>
                        </div>
                        <div className="stat">
                          <span>Total Earned:</span>
                          <strong>${contributorStats.earnings}</strong>
                        </div>
                        <div className="stat">
                          <span>Reputation:</span>
                          <strong>{contributorStats.reputation}</strong>
                        </div>
                      </div>
                    )}

                    {/* Recording Interface */}
                    <div className="recording-interface">
                      {recordingState === 'recording' && (
                        <div className="waveform">
                          {audioWaveform.map((height, i) => (
                            <motion.div
                              key={i}
                              className="wave-bar"
                              animate={{ height: `${height}%` }}
                              transition={{ duration: 0.1 }}
                            />
                          ))}
                        </div>
                      )}

                      <div className="recording-timer">
                        {recordingState === 'recording' && (
                          <motion.div
                            className="timer-display"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            {recordingTime}s / 30s
                          </motion.div>
                        )}
                      </div>

                      {/* Status Messages */}
                      <AnimatePresence mode="wait">
                        {(recordingState === 'processing' || isSubmitting) && (
                          <motion.div
                            className="status-message processing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            <div className="spinner" />
                            Submitting to blockchain...
                          </motion.div>
                        )}

                        {recordingState === 'success' && (
                          <motion.div
                            className="status-message success"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                          >
                            <FiCheckCircle size={48} />
                            <h3>Success!</h3>
                            <p>$3 USDC added to your balance</p>
                          </motion.div>
                        )}

                        {recordingState === 'error' && (
                          <motion.div
                            className="status-message error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <FiX size={48} />
                            <p>Recording too short. Minimum 30 seconds required.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Record Button */}
                      <motion.button
                        className={`record-button ${recordingState === 'recording' ? 'recording' : ''}`}
                        onClick={recordingState === 'recording' ? stopRecording : startRecording}
                        disabled={recordingState === 'processing' || recordingState === 'success' || isSubmitting}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {recordingState === 'recording' ? (
                          <>
                            <FiMicOff /> Stop Recording
                          </>
                        ) : (
                          <>
                            <FiMic /> Start Recording
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Instructions */}
                    <div className="instructions">
                      <h3>Recording Tips:</h3>
                      <ul>
                        <li>Speak clearly in {selectedLanguage}</li>
                        <li>Record for at least 30 seconds</li>
                        <li>Find a quiet environment</li>
                        <li>Use natural speech patterns</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Validator Mode */
                <motion.div
                  key="validator"
                  className="validator-mode"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="validation-section">
                    <div className="validator-header">
                      <h2>Validate & Earn</h2>
                      <div className="validator-stats">
                        <div className="stat">
                          <FiAward />
                          <span>Streak: {validationStreak}</span>
                        </div>
                        <div className="stat">
                          <FiDollarSign />
                          <span>$0.50 per validation</span>
                        </div>
                      </div>
                    </div>

                    {/* Current Validation */}
                    {validationQueue[currentValidation] && (
                      <motion.div
                        className="validation-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={currentValidation}
                      >
                        <div className="validation-info">
                          <h3>Audio #{currentValidation + 1}</h3>
                          <p>Contributor: {validationQueue[currentValidation].contributor}</p>
                          <p>Duration: {validationQueue[currentValidation].duration}s</p>
                          <p>CID: {validationQueue[currentValidation].cid}</p>
                        </div>

                        <motion.button
                          className="play-audio-button"
                          onClick={playAudio}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isPlaying ? (
                            <>
                              <FiPause /> Playing...
                            </>
                          ) : (
                            <>
                              <FiPlay /> Play Audio
                            </>
                          )}
                        </motion.button>

                        <div className="validation-actions">
                          <motion.button
                            className="validate-button approve"
                            onClick={() => handleValidation(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={validationQueue[currentValidation].status !== 'pending' || isValidating}
                          >
                            <FiCheck /> Valid {selectedLanguage}
                          </motion.button>
                          <motion.button
                            className="validate-button reject"
                            onClick={() => handleValidation(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={validationQueue[currentValidation].status !== 'pending' || isValidating}
                          >
                            <FiX /> Not {selectedLanguage}
                          </motion.button>
                        </div>

                        {validationQueue[currentValidation].status !== 'pending' && (
                          <motion.div
                            className={`validation-result ${validationQueue[currentValidation].status}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            {validationQueue[currentValidation].status === 'approved' ? (
                              <>
                                <FiCheckCircle /> Approved! +$0.50
                              </>
                            ) : (
                              <>
                                <FiX /> Rejected
                              </>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* Queue Status */}
                    <div className="queue-status">
                      <h3>Validation Queue</h3>
                      <div className="queue-items">
                        {validationQueue.map((item, index) => (
                          <div
                            key={item.id}
                            className={`queue-item ${
                              index === currentValidation ? 'current' : ''
                            } ${item.status}`}
                          >
                            <span>#{index + 1}</span>
                            <span>{item.contributor}</span>
                            <span>{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Particles Effect */}
      {recordingState === 'success' && (
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ 
                x: 0, 
                y: 0,
                opacity: 1
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0
              }}
              transition={{ duration: 1 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}