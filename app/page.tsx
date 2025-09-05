'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  FiMic, FiDollarSign, FiUsers, FiDatabase, 
  FiGlobe, FiAward, FiCode,
  FiArrowRight, FiPlay, FiCheckCircle
} from 'react-icons/fi';
import './home.css';
import './home-enhanced.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'contributor' | 'validator' | 'company'>('contributor');
  const [stats, setStats] = useState({
    languages: 12,
    contributors: 127,
    audioClips: 419,
    earned: 1257
  });

  // Animate stats on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        languages: prev.languages,
        contributors: Math.min(prev.contributors + Math.floor(Math.random() * 3), 500),
        audioClips: Math.min(prev.audioClips + Math.floor(Math.random() * 7), 2000),
        earned: Math.min(prev.earned + Math.floor(Math.random() * 15), 10000)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Animated Background Elements */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      {/* Particle Effects */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Logo */}
          <motion.div 
            className="hero-logo"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1.5 
            }}
          >
            <motion.div 
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="logo-inner"
            >
              🌍
            </motion.div>
            <div className="logo-glow"></div>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="gradient-text">LinguaNet</span>
            <motion.span 
              className="title-sparkle"
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: 1
              }}
            >
              ✨
            </motion.span>
          </motion.h1>
          
          <p className="hero-subtitle">
            Decentralized African Language Data Marketplace on Base L2
          </p>

          {/* Live Stats Grid */}
          <div className="hero-stats">
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FiGlobe className="stat-icon" />
              <div className="stat-value">{stats.languages}</div>
              <div className="stat-label">Languages</div>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FiUsers className="stat-icon" />
              <div className="stat-value">{stats.contributors.toLocaleString()}</div>
              <div className="stat-label">Contributors</div>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FiMic className="stat-icon" />
              <div className="stat-value">{stats.audioClips.toLocaleString()}</div>
              <div className="stat-label">Audio Clips</div>
            </motion.div>
            
            <motion.div 
              className="stat-card highlight"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FiDollarSign className="stat-icon" />
              <div className="stat-value">${stats.earned.toLocaleString()}</div>
              <div className="stat-label">Earned by Contributors</div>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link href="/contribute">
              <motion.button 
                className="cta-button primary"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <FiMic />
                </motion.span>
                Start Recording
                <motion.span 
                  className="button-arrow"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button 
                className="cta-button secondary"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDatabase /> Browse Datasets
              </motion.button>
            </Link>
          </motion.div>

          <div className="hackathon-badge">
            🏆 ETHAccra 2025 Hackathon Project
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>How LinguaNet Works</h2>
          <p>Three roles, one mission: Preserve languages, power AI</p>
        </motion.div>

        <div className="role-tabs">
          <button 
            className={`role-tab ${activeTab === 'contributor' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributor')}
          >
            <FiMic /> Contributor
          </button>
          <button 
            className={`role-tab ${activeTab === 'validator' ? 'active' : ''}`}
            onClick={() => setActiveTab('validator')}
          >
            <FiAward /> Validator
          </button>
          <button 
            className={`role-tab ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
          >
            <FiCode /> AI Company
          </button>
        </div>

        <motion.div 
          className="tab-content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {activeTab === 'contributor' && (
            <div className="role-content">
              <div className="role-steps">
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="step-number">1</div>
                  <div>
                    <h3>Connect Wallet & Register</h3>
                    <p>Connect any Web3 wallet and register with your phone number to get a .linguanet.eth ENS name</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="step-number">2</div>
                  <div>
                    <h3>Record 30 Seconds</h3>
                    <p>Speak naturally in Twi, Swahili, Yoruba, or any of our supported African languages</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="step-number">3</div>
                  <div>
                    <h3>Earn $3 USDC Instantly</h3>
                    <p>Get paid immediately in USDC on Base L2 after AI quality verification</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="step-number">4</div>
                  <div>
                    <h3>Withdraw to Mobile Money</h3>
                    <p>Cash out to MTN Mobile Money, M-Pesa, or AirtelTigo instantly</p>
                  </div>
                </motion.div>
              </div>
              
              <div className="role-demo">
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div className="demo-header">kofi.linguanet.eth</div>
                    <div className="demo-balance">$12.50 USDC</div>
                    <div className="demo-record-button">🎤 Record Twi</div>
                    <div className="demo-status">
                      <FiCheckCircle style={{ color: '#22c55e' }} />
                      <span> Quality: 94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validator' && (
            <div className="role-content">
              <div className="role-steps">
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="step-number">1</div>
                  <div>
                    <h3>Become a Validator</h3>
                    <p>Submit 10 quality recordings to unlock validator status and earn from verification</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="step-number">2</div>
                  <div>
                    <h3>Review Audio Clips</h3>
                    <p>Listen to submissions and verify they match the claimed language with good quality</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="step-number">3</div>
                  <div>
                    <h3>Earn $0.50 per Validation</h3>
                    <p>Get paid for each accurate validation, with bonuses for streak performance</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="step-number">4</div>
                  <div>
                    <h3>Build EFP Reputation</h3>
                    <p>Gain on-chain attestations and unlock premium validation opportunities</p>
                  </div>
                </motion.div>
              </div>
              
              <div className="role-demo">
                <div className="validation-interface">
                  <div className="validation-header">Validation Queue: 23 clips</div>
                  <div className="validation-item">
                    <span>ama.linguanet.eth - 32s</span>
                    <button className="play-btn"><FiPlay /></button>
                  </div>
                  <div className="validation-buttons">
                    <button className="approve">✓ Valid Twi</button>
                    <button className="reject">✗ Not Twi</button>
                  </div>
                  <div className="validation-streak">🔥 Streak: 47</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="role-content">
              <div className="role-steps">
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="step-number">1</div>
                  <div>
                    <h3>Browse Datasets</h3>
                    <p>Filter by language, quality score, duration, and number of unique speakers</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="step-number">2</div>
                  <div>
                    <h3>Preview Samples</h3>
                    <p>Listen to verified audio clips and view transcriptions before purchase</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="step-number">3</div>
                  <div>
                    <h3>Purchase with USDC</h3>
                    <p>Pay securely on Base L2 with instant settlement and transparent pricing</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="step-number">4</div>
                  <div>
                    <h3>Access via API</h3>
                    <p>Stream data from Filecoin storage or download complete datasets with metadata</p>
                  </div>
                </motion.div>
              </div>
              
              <div className="role-demo">
                <div className="dashboard-mockup">
                  <div className="dataset-card">
                    <div className="dataset-header">🇬🇭 Twi Dataset</div>
                    <div className="dataset-stats">
                      <span>2,847 clips</span>
                      <span>94% quality</span>
                    </div>
                    <div className="dataset-price">$2,847 USDC</div>
                    <button className="purchase-btn">Purchase Dataset</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>Built for Africa, Powered by Ethereum</h2>
          <p>Leveraging cutting-edge blockchain technology for real-world impact</p>
        </motion.div>

        <div className="tech-grid">
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="tech-icon">⚡</div>
            <h3>Base L2</h3>
            <p>Fast, cheap transactions at $0.01 per submission with instant finality</p>
          </motion.div>
          
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="tech-icon">🔐</div>
            <h3>ENS Identity</h3>
            <p>Human-readable names like kofi.linguanet.eth for every contributor</p>
          </motion.div>
          
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="tech-icon">💾</div>
            <h3>Filecoin Storage</h3>
            <p>Permanent, decentralized storage ensuring data preservation forever</p>
          </motion.div>
          
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="tech-icon">🤖</div>
            <h3>AI Quality Check</h3>
            <p>TensorFlow.js validates audio quality in real-time on-device</p>
          </motion.div>
          
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="tech-icon">📱</div>
            <h3>Mobile Money</h3>
            <p>Direct withdrawal to MTN, M-Pesa, and AirtelTigo accounts</p>
          </motion.div>
          
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="tech-icon">🏅</div>
            <h3>EFP Reputation</h3>
            <p>On-chain attestations for quality contributors and validators</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Make an Impact?</h2>
          <p>Join the movement to preserve languages and democratize AI</p>
          
          <div className="cta-buttons">
            <Link href="/contribute">
              <motion.button 
                className="cta-button primary large"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Earning Now <FiArrowRight />
              </motion.button>
            </Link>
          </div>

          <div className="cta-links">
            <Link href="/pitch" className="cta-link">
              <FiPlay /> View Pitch Deck
            </Link>
            <Link href="/dashboard" className="cta-link">
              <FiDatabase /> AI Company Dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            🌍 LinguaNet
          </div>
          <div className="footer-tagline">
            ETHAccra 2025 | Preserving Languages, Powering AI
          </div>
          <div className="footer-bounties">
            <span className="bounty-badge">ENS</span>
            <span className="bounty-badge">Base</span>
            <span className="bounty-badge">Filecoin</span>
            <span className="bounty-badge">EFP</span>
            <span className="bounty-badge">Buidl Guidl</span>
          </div>
        </div>
      </footer>
    </div>
  );
}