'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  FiMic, FiUsers, FiDatabase, 
  FiAward, FiShield,
  FiPlay, FiCheckCircle,
  FiTrendingUp, FiLock, FiBarChart2, FiPieChart
} from 'react-icons/fi';
import './home.css';
import './home-enhanced.css';
import './linguadao.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'voice-mining' | 'liquidity' | 'governance' | 'insurance'>('voice-mining');
  const [stats, setStats] = useState({
    totalValueLocked: 2847650,
    linguaPrice: 0.42,
    languages: 27,
    voiceShares: 12847,
    insurancePools: 8,
    dailyVolume: 127450
  });

  // Animate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalValueLocked: prev.totalValueLocked + Math.floor(Math.random() * 10000),
        linguaPrice: prev.linguaPrice + (Math.random() * 0.02 - 0.01),
        languages: prev.languages,
        voiceShares: prev.voiceShares + Math.floor(Math.random() * 10),
        insurancePools: prev.insurancePools,
        dailyVolume: prev.dailyVolume + Math.floor(Math.random() * 1000)
      }));
    }, 5000);
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

      {/* Quick Access Navigation Bar */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        gap: '1rem',
      }}>
        <Link href="/gallery">
          <button style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #22c55e, #10b981)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'transform 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎨 View NFT Gallery
            <span style={{
              background: 'rgba(255,255,255,0.3)',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.75rem'
            }}>
              DEMO READY
            </span>
          </button>
        </Link>
        <Link href="/contribute">
          <button style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎙️ Start Mining
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Protocol Badge */}
          <motion.div 
            className="protocol-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <FiShield /> Decentralized Protocol
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="gradient-text">LinguaDAO</span>
          </motion.h1>
          
          <p className="hero-subtitle">
            The First Decentralized Language Preservation Protocol
          </p>
          
          <p className="hero-description">
            Save endangered languages while earning rewards. Join the first protocol where 
            preserving culture pays better than abandoning it.
          </p>

          {/* Token Stats Grid */}
          <div className="token-stats">
            <motion.div 
              className="stat-card highlight"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="stat-label">TVL</div>
              <div className="stat-value">${(stats.totalValueLocked / 1000000).toFixed(2)}M</div>
              <div className="stat-change">+12.5%</div>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-label">$LINGUA Price</div>
              <div className="stat-value">${stats.linguaPrice.toFixed(3)}</div>
              <div className="stat-change positive">+5.2%</div>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-label">Voice NFTs</div>
              <div className="stat-value">{stats.voiceShares.toLocaleString()}</div>
              <div className="stat-change">+127 today</div>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="stat-label">24h Volume</div>
              <div className="stat-value">${(stats.dailyVolume / 1000).toFixed(0)}K</div>
              <div className="stat-change">+18.7%</div>
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
                <FiMic /> Start Voice Mining
                <span className="button-badge">Earn $LINGUA</span>
              </motion.button>
            </Link>
            <Link href="/governance">
              <motion.button 
                className="cta-button secondary"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FiLock /> Join DAO
              </motion.button>
            </Link>
          </motion.div>

          <div className="hackathon-badge">
            🏆 ETHAccra 2025 | Built with Scaffold-ETH 2
          </div>
        </motion.div>
      </section>

      {/* Tokenomics Section */}
      <section className="tokenomics-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>Revolutionary Token Economics</h2>
          <p>Dual token system creating sustainable value for language preservation</p>
        </motion.div>

        <div className="tokenomics-grid">
          <motion.div 
            className="token-card lingua"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="token-header">
              <div className="token-icon">🎯</div>
              <h3>$LINGUA Token</h3>
              <div className="token-type">Governance & Utility</div>
            </div>
            <div className="token-stats">
              <div className="token-stat">
                <span>Total Supply</span>
                <strong>1B</strong>
              </div>
              <div className="token-stat">
                <span>Circulating</span>
                <strong>127M</strong>
              </div>
              <div className="token-stat">
                <span>Market Cap</span>
                <strong>$53.3M</strong>
              </div>
            </div>
            <div className="token-distribution">
              <h4>Distribution</h4>
              <div className="distribution-item">
                <div className="distribution-bar" style={{width: '40%', background: 'linear-gradient(90deg, #7c3aed, #9333ea)'}}>
                  <span>40%</span>
                </div>
                <label>Voice Mining Rewards</label>
              </div>
              <div className="distribution-item">
                <div className="distribution-bar" style={{width: '20%', background: 'linear-gradient(90deg, #22c55e, #10b981)'}}>
                  <span>20%</span>
                </div>
                <label>Preservation Treasury</label>
              </div>
              <div className="distribution-item">
                <div className="distribution-bar" style={{width: '15%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)'}}>
                  <span>15%</span>
                </div>
                <label>Team & Advisors</label>
              </div>
              <div className="distribution-item">
                <div className="distribution-bar" style={{width: '15%', background: 'linear-gradient(90deg, #f59e0b, #f97316)'}}>
                  <span>15%</span>
                </div>
                <label>Ecosystem Grants</label>
              </div>
              <div className="distribution-item">
                <div className="distribution-bar" style={{width: '10%', background: 'linear-gradient(90deg, #ec4899, #db2777)'}}>
                  <span>10%</span>
                </div>
                <label>Initial Liquidity</label>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="token-card voice"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="token-header">
              <div className="token-icon">🎤</div>
              <h3>Voice Share NFTs</h3>
              <div className="token-type">Ownership & Revenue Rights</div>
            </div>
            <div className="nft-features">
              <div className="nft-feature">
                <FiPieChart />
                <div>
                  <strong>Revenue Sharing</strong>
                  <p>70% of AI model sales distributed to NFT holders</p>
                </div>
              </div>
              <div className="nft-feature">
                <FiTrendingUp />
                <div>
                  <strong>Rarity Tiers</strong>
                  <p>1-5 based on language endangerment level</p>
                </div>
              </div>
              <div className="nft-feature">
                <FiAward />
                <div>
                  <strong>Guardian Status</strong>
                  <p>Unlock multipliers: Novice → Expert → Master → Guardian</p>
                </div>
              </div>
              <div className="nft-feature">
                <FiBarChart2 />
                <div>
                  <strong>Tradeable Assets</strong>
                  <p>Buy, sell, or stake NFTs in liquidity pools</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Protocol Features */}
      <section className="protocol-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>Protocol Mechanics</h2>
          <p>Four pillars of sustainable language preservation</p>
        </motion.div>

        <div className="protocol-tabs">
          <button 
            className={activeTab === 'voice-mining' ? 'active' : ''}
            onClick={() => setActiveTab('voice-mining')}
          >
            <FiMic /> Voice Mining
          </button>
          <button 
            className={activeTab === 'liquidity' ? 'active' : ''}
            onClick={() => setActiveTab('liquidity')}
          >
            <FiBarChart2 /> Language Pools
          </button>
          <button 
            className={activeTab === 'governance' ? 'active' : ''}
            onClick={() => setActiveTab('governance')}
          >
            <FiUsers /> Governance
          </button>
          <button 
            className={activeTab === 'insurance' ? 'active' : ''}
            onClick={() => setActiveTab('insurance')}
          >
            <FiShield /> Insurance
          </button>
        </div>

        <motion.div 
          className="tab-content"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'voice-mining' && (
            <div className="mining-content">
              <div className="mining-formula">
                <h3>Mining Rewards Formula</h3>
                <div className="formula-display">
                  <span className="formula-part">Quality Score</span>
                  <span className="operator">×</span>
                  <span className="formula-part">Language Multiplier</span>
                  <span className="operator">×</span>
                  <span className="formula-part">Staking Boost</span>
                  <span className="operator">=</span>
                  <span className="formula-result">$LINGUA Earned</span>
                </div>
              </div>
              
              <div className="language-multipliers">
                <h4>Language Rarity Multipliers</h4>
                <div className="multiplier-grid">
                  <div className="multiplier-item critical">
                    <span className="multiplier">4x</span>
                    <span className="language">Xhosa, Wolof</span>
                    <span className="status">Critically Endangered</span>
                  </div>
                  <div className="multiplier-item endangered">
                    <span className="multiplier">3x</span>
                    <span className="language">Twi, Yoruba, Igbo</span>
                    <span className="status">Endangered</span>
                  </div>
                  <div className="multiplier-item vulnerable">
                    <span className="multiplier">2x</span>
                    <span className="language">Swahili, Hausa</span>
                    <span className="status">Vulnerable</span>
                  </div>
                </div>
              </div>

              <div className="mining-steps">
                <div className="step">
                  <div className="step-icon">🎙️</div>
                  <h4>Record</h4>
                  <p>30 seconds in your native language</p>
                </div>
                <div className="step">
                  <div className="step-icon">🤖</div>
                  <h4>AI Validation</h4>
                  <p>Quality score 0-100</p>
                </div>
                <div className="step">
                  <div className="step-icon">🎯</div>
                  <h4>Mint NFT</h4>
                  <p>Voice Share with revenue rights</p>
                </div>
                <div className="step">
                  <div className="step-icon">💰</div>
                  <h4>Earn</h4>
                  <p>$LINGUA + future revenue share</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'liquidity' && (
            <div className="liquidity-content">
              <h3>Automated Market Maker for Language Data</h3>
              <p>Trade access rights to language datasets through dedicated liquidity pools</p>
              
              <div className="pool-grid">
                <div className="pool-card">
                  <div className="pool-header">
                    <span className="pool-pair">TWI/USDC</span>
                    <span className="pool-apy">127% APY</span>
                  </div>
                  <div className="pool-stats">
                    <div>
                      <label>Liquidity</label>
                      <strong>$847K</strong>
                    </div>
                    <div>
                      <label>Volume 24h</label>
                      <strong>$42K</strong>
                    </div>
                    <div>
                      <label>Price</label>
                      <strong>$0.73</strong>
                    </div>
                  </div>
                </div>
                
                <div className="pool-card">
                  <div className="pool-header">
                    <span className="pool-pair">YORUBA/USDC</span>
                    <span className="pool-apy">95% APY</span>
                  </div>
                  <div className="pool-stats">
                    <div>
                      <label>Liquidity</label>
                      <strong>$623K</strong>
                    </div>
                    <div>
                      <label>Volume 24h</label>
                      <strong>$31K</strong>
                    </div>
                    <div>
                      <label>Price</label>
                      <strong>$0.61</strong>
                    </div>
                  </div>
                </div>
                
                <div className="pool-card">
                  <div className="pool-header">
                    <span className="pool-pair">SWAHILI/USDC</span>
                    <span className="pool-apy">72% APY</span>
                  </div>
                  <div className="pool-stats">
                    <div>
                      <label>Liquidity</label>
                      <strong>$1.2M</strong>
                    </div>
                    <div>
                      <label>Volume 24h</label>
                      <strong>$78K</strong>
                    </div>
                    <div>
                      <label>Price</label>
                      <strong>$0.42</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="governance-content">
              <h3>Community-Driven Protocol Evolution</h3>
              
              <div className="governance-stats">
                <div className="gov-stat">
                  <FiUsers />
                  <div>
                    <strong>2,847</strong>
                    <span>DAO Members</span>
                  </div>
                </div>
                <div className="gov-stat">
                  <FiCheckCircle />
                  <div>
                    <strong>127</strong>
                    <span>Proposals Passed</span>
                  </div>
                </div>
                <div className="gov-stat">
                  <FiLock />
                  <div>
                    <strong>42M</strong>
                    <span>$LINGUA Staked</span>
                  </div>
                </div>
              </div>
              
              <div className="active-proposals">
                <h4>Active Proposals</h4>
                <div className="proposal">
                  <div className="proposal-header">
                    <span className="proposal-id">#128</span>
                    <span className="proposal-status voting">Voting</span>
                  </div>
                  <h5>Add Amharic to Critical Endangerment List</h5>
                  <div className="proposal-votes">
                    <div className="vote-bar">
                      <div className="vote-yes" style={{width: '73%'}}>73% Yes</div>
                      <div className="vote-no" style={{width: '27%'}}>27% No</div>
                    </div>
                  </div>
                </div>
                
                <div className="proposal">
                  <div className="proposal-header">
                    <span className="proposal-id">#129</span>
                    <span className="proposal-status pending">Pending</span>
                  </div>
                  <h5>Increase Voice Mining Rewards by 15%</h5>
                  <div className="proposal-time">Voting starts in 2 days</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insurance' && (
            <div className="insurance-content">
              <h3>Language Extinction Insurance</h3>
              <p>World&apos;s first DeFi protocol protecting against language loss</p>
              
              <div className="insurance-mechanism">
                <div className="insurance-flow">
                  <div className="flow-step">
                    <FiLock />
                    <h4>Stake $LINGUA</h4>
                    <p>Communities stake to insure their language</p>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">
                    <FiBarChart2 />
                    <h4>Monitor Speakers</h4>
                    <p>Oracle tracks active speaker count</p>
                  </div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">
                    <FiShield />
                    <h4>Trigger Payout</h4>
                    <p>10x coverage if speakers drop below threshold</p>
                  </div>
                </div>
              </div>
              
              <div className="insurance-pools">
                <h4>Active Insurance Pools</h4>
                <div className="insurance-grid">
                  <div className="insurance-card">
                    <div className="insurance-header">
                      <span className="language">Xhosa</span>
                      <span className="risk high">High Risk</span>
                    </div>
                    <div className="insurance-stats">
                      <div>
                        <label>Coverage</label>
                        <strong>$2.4M</strong>
                      </div>
                      <div>
                        <label>Premium</label>
                        <strong>8.5% APR</strong>
                      </div>
                      <div>
                        <label>Threshold</label>
                        <strong>100 speakers</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="insurance-card">
                    <div className="insurance-header">
                      <span className="language">Wolof</span>
                      <span className="risk medium">Medium Risk</span>
                    </div>
                    <div className="insurance-stats">
                      <div>
                        <label>Coverage</label>
                        <strong>$1.8M</strong>
                      </div>
                      <div>
                        <label>Premium</label>
                        <strong>5.2% APR</strong>
                      </div>
                      <div>
                        <label>Threshold</label>
                        <strong>150 speakers</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Revenue Model Section */}
      <section className="revenue-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2>Sustainable Revenue Model</h2>
          <p>Multiple revenue streams creating value for all stakeholders</p>
        </motion.div>

        <div className="revenue-flow">
          <div className="revenue-source">
            <h3>Revenue Sources</h3>
            <div className="source-item">
              <FiDatabase />
              <div>
                <strong>AI Companies</strong>
                <p>Pay for diverse language datasets</p>
              </div>
            </div>
            <div className="source-item">
              <FiBarChart2 />
              <div>
                <strong>Trading Fees</strong>
                <p>0.3% on all AMM transactions</p>
              </div>
            </div>
            <div className="source-item">
              <FiShield />
              <div>
                <strong>Insurance Premiums</strong>
                <p>Risk-based pricing for coverage</p>
              </div>
            </div>
          </div>
          
          <div className="revenue-distribution">
            <h3>Distribution</h3>
            <div className="distribution-chart">
              <div className="chart-segment contributors" style={{height: '70%'}}>
                <span>70%</span>
                <label>Voice Contributors</label>
              </div>
              <div className="chart-segment stakers" style={{height: '20%'}}>
                <span>20%</span>
                <label>$LINGUA Stakers</label>
              </div>
              <div className="chart-segment treasury" style={{height: '10%'}}>
                <span>10%</span>
                <label>DAO Treasury</label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Join the Language Revolution</h2>
          <p>Be part of the first decentralized language preservation movement</p>
          <div className="final-cta">
            <Link href="/contribute">
              <button className="cta-button primary large">
                <FiMic /> Start Mining $LINGUA
              </button>
            </Link>
            <Link href="/pitch">
              <button className="cta-button secondary large">
                <FiPlay /> View Pitch Deck
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}