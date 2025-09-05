'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  FiMic, FiDollarSign, FiUsers, FiDatabase, 
  FiTrendingUp, FiGlobe, FiAward, FiCode,
  FiArrowRight, FiCheck, FiPlay
} from 'react-icons/fi';
import './home.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'contributor' | 'validator' | 'company'>('contributor');
  const [stats, setStats] = useState({
    languages: 3,
    contributors: 127,
    audioClips: 419,
    earned: 1257
  });

  // Animate stats on mount
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        languages: prev.languages,
        contributors: Math.min(prev.contributors + Math.floor(Math.random() * 3), 200),
        audioClips: Math.min(prev.audioClips + Math.floor(Math.random() * 5), 1000),
        earned: Math.min(prev.earned + Math.floor(Math.random() * 10), 5000)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="hero-logo"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            🌍
          </motion.div>
          
          <h1 className="hero-title">
            <span className="gradient-text">LinguaNet</span>
          </h1>
          
          <p className="hero-subtitle">
            Turn Your Voice into Value. Preserve Languages. Power AI.
          </p>

          <div className="hero-stats">
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <FiGlobe className="stat-icon" />
              <div className="stat-value">{stats.languages}</div>
              <div className="stat-label">Languages</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <FiUsers className="stat-icon" />
              <div className="stat-value">{stats.contributors}</div>
              <div className="stat-label">Contributors</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
            >
              <FiMic className="stat-icon" />
              <div className="stat-value">{stats.audioClips}</div>
              <div className="stat-label">Audio Clips</div>
            </motion.div>
            <motion.div 
              className="stat-card highlight"
              whileHover={{ scale: 1.05 }}
            >
              <FiDollarSign className="stat-icon" />
              <div className="stat-value">${stats.earned}</div>
              <div className="stat-label">Earned</div>
            </motion.div>
          </div>

          <div className="hero-cta">
            <Link href="/contribute">
              <motion.button 
                className="cta-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMic /> Start Recording
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button 
                className="cta-button secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDatabase /> Browse Datasets
              </motion.button>
            </Link>
          </div>

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
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Login with Phone</h3>
                  <p>No crypto knowledge needed. Get ENS name automatically.</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Record 30 Seconds</h3>
                  <p>Speak naturally in Twi, Swahili, or your native language.</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Earn $3 USDC</h3>
                  <p>Instant payment after AI quality check.</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h3>Withdraw to Mobile Money</h3>
                  <p>Cash out to MTN, M-Pesa, or AirtelTigo instantly.</p>
                </div>
              </div>
              <div className="role-demo">
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div className="demo-header">kofi.linguanet.eth</div>
                    <div className="demo-balance">$12.50 USDC</div>
                    <div className="demo-record-button">🎤 Record Twi</div>
                    <div className="demo-status">✅ Quality: 94%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'validator' && (
            <div className="role-content">
              <div className="role-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Become a Validator</h3>
                  <p>Pass a quick language test to prove expertise.</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Review Audio Clips</h3>
                  <p>Listen to submissions and verify language accuracy.</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Earn $0.50 per Validation</h3>
                  <p>Get paid for each clip you verify.</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h3>Build Reputation</h3>
                  <p>Gain EFP attestations and unlock premium tasks.</p>
                </div>
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
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Browse Datasets</h3>
                  <p>Filter by language, quality, and size.</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Preview Samples</h3>
                  <p>Listen to verified audio clips before purchase.</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Purchase with USDC</h3>
                  <p>Pay securely via Base network or credit card.</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <h3>Access via API</h3>
                  <p>Download or stream data for AI training.</p>
                </div>
              </div>
              <div className="role-demo">
                <div className="dashboard-mockup">
                  <div className="dataset-card">
                    <div className="dataset-header">🇬🇭 Twi Dataset</div>
                    <div className="dataset-stats">
                      <span>127 clips</span>
                      <span>94% quality</span>
                    </div>
                    <div className="dataset-price">$127 USDC</div>
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
          >
            <div className="tech-icon">⚡</div>
            <h3>Base L2</h3>
            <p>Fast, cheap transactions at $0.01 per submission</p>
          </motion.div>
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="tech-icon">🔐</div>
            <h3>ENS Identity</h3>
            <p>Human-readable names like kofi.linguanet.eth</p>
          </motion.div>
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="tech-icon">💾</div>
            <h3>Filecoin Storage</h3>
            <p>Permanent, decentralized audio storage</p>
          </motion.div>
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="tech-icon">🤖</div>
            <h3>AI Quality Check</h3>
            <p>TensorFlow.js for instant validation</p>
          </motion.div>
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="tech-icon">📱</div>
            <h3>Mobile Money</h3>
            <p>Direct withdrawal to MTN, M-Pesa</p>
          </motion.div>
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="tech-icon">🏅</div>
            <h3>EFP Reputation</h3>
            <p>On-chain trust and quality scores</p>
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