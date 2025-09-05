'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMic, FiMicOff, FiDollarSign, FiCheck, FiX,
  FiUser, FiAward, FiTrendingUp, FiSmartphone,
  FiPlay, FiPause, FiCheckCircle
} from 'react-icons/fi';
import './contribute.css';

type Mode = 'contributor' | 'validator';
type RecordingState = 'idle' | 'recording' | 'processing' | 'success' | 'error';

export default function Contribute() {
  // State Management
  const [mode, setMode] = useState<Mode>('contributor');
  const [userAddress, setUserAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [balance, setBalance] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioWaveform, setAudioWaveform] = useState<number[]>([]);
  
  // Validator State
  const [validationQueue, setValidationQueue] = useState([
    { id: 1, contributor: 'kofi.linguanet.eth', duration: 32, status: 'pending' },
    { id: 2, contributor: 'ama.linguanet.eth', duration: 28, status: 'pending' },
    { id: 3, contributor: 'kwame.linguanet.eth', duration: 30, status: 'pending' }
  ]);
  const [currentValidation, setCurrentValidation] = useState(0);
  const [validationStreak, setValidationStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs
  const timerRef = useRef<NodeJS.Timeout>();
  const waveformRef = useRef<NodeJS.Timeout>();

  // Simulate ENS address generation
  const generateENS = (phone: string) => {
    const name = phone.slice(-4);
    return `user${name}.linguanet.eth`;
  };

  // Handle Phone Login
  const handleLogin = () => {
    if (phoneNumber.length >= 10) {
      const ens = generateENS(phoneNumber);
      setUserAddress(ens);
      setIsOnboarding(false);
      // Simulate existing balance check
      setTimeout(() => {
        if (Math.random() > 0.5) {
          setBalance(12); // Returning user
        }
      }, 500);
    }
  };

  // Recording Functions
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

  const stopRecording = () => {
    clearInterval(timerRef.current);
    clearInterval(waveformRef.current);
    
    if (recordingTime < 30) {
      setRecordingState('error');
      setTimeout(() => setRecordingState('idle'), 2000);
      return;
    }

    setRecordingState('processing');
    
    // Simulate AI processing
    setTimeout(() => {
      setRecordingState('success');
      setBalance(prev => prev + 3);
      setTimeout(() => {
        setRecordingState('idle');
        setRecordingTime(0);
        setAudioWaveform([]);
      }, 3000);
    }, 2000);
  };

  // Validator Functions
  const handleValidation = (isValid: boolean) => {
    const current = validationQueue[currentValidation];
    if (current) {
      // Update status
      const updated = [...validationQueue];
      updated[currentValidation].status = isValid ? 'approved' : 'rejected';
      setValidationQueue(updated);
      
      // Award payment
      if (isValid) {
        setBalance(prev => prev + 0.5);
        setValidationStreak(prev => prev + 1);
      }
      
      // Move to next
      setTimeout(() => {
        if (currentValidation < validationQueue.length - 1) {
          setCurrentValidation(prev => prev + 1);
        }
      }, 1000);
    }
  };

  const playAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  // Withdrawal simulation
  const handleWithdraw = () => {
    alert(`Withdrawing $${balance} USDC to MTN Mobile Money...
    
Transaction Details:
- Amount: $${balance} USDC
- Phone: ${phoneNumber}
- Network: MTN Mobile Money
- Fee: $0.10
- You will receive: GHS ${(balance * 5.5).toFixed(2)}

Status: Processing... (Demo Mode)`);
    setBalance(0);
  };

  return (
    <div className="contribute-container">
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
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="app-logo">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  🌍
                </motion.div>
              </div>
              <h1>LinguaNet</h1>
              <p>Turn Your Voice into Value</p>
              
              <div className="login-form">
                <h2>Login with Phone Number</h2>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="phone-input"
                />
                <motion.button
                  className="login-button"
                  onClick={handleLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={phoneNumber.length < 10}
                >
                  <FiSmartphone /> Continue
                </motion.button>
              </div>

              <div className="onboarding-features">
                <div className="feature">
                  <FiMic /> Record 30 seconds
                </div>
                <div className="feature">
                  <FiDollarSign /> Earn $3 instantly
                </div>
                <div className="feature">
                  <FiSmartphone /> Withdraw to Mobile Money
                </div>
              </div>
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
                  <div className="user-address">{userAddress}</div>
                  <div className="user-phone">{phoneNumber}</div>
                </div>
              </div>
              
              <div className="balance-info">
                <div className="balance-amount">
                  <FiDollarSign />
                  <span>{balance.toFixed(2)}</span>
                  <span className="currency">USDC</span>
                </div>
                {balance > 0 && (
                  <motion.button
                    className="withdraw-button"
                    onClick={handleWithdraw}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Withdraw to MTN
                  </motion.button>
                )}
              </div>
            </header>

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
                    <p>Record yourself speaking Twi</p>

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
                        {recordingState === 'processing' && (
                          <motion.div
                            className="status-message processing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                          >
                            <div className="spinner" />
                            Checking quality...
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
                        disabled={recordingState === 'processing' || recordingState === 'success'}
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
                        <li>Speak clearly in Twi</li>
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
                          <FiTrendingUp />
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
                            disabled={validationQueue[currentValidation].status !== 'pending'}
                          >
                            <FiCheck /> Valid Twi
                          </motion.button>
                          <motion.button
                            className="validate-button reject"
                            onClick={() => handleValidation(false)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={validationQueue[currentValidation].status !== 'pending'}
                          >
                            <FiX /> Not Twi
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