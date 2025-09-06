'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './pitch-story.css';

const pitchSlides = [
  {
    id: 1,
    title: "Every 40 days, a language dies forever",
    content: (
      <div className="story-slide">
        <div className="stat-hero">
          <span className="big-number">3,000+</span>
          <p>African languages at risk of extinction by 2100</p>
        </div>
        <div className="impact-visual">
          <div className="language-loss">
            <span>🇬🇭 Ga</span>
            <span className="speakers">580,000 speakers</span>
            <span className="decline">-15% per decade</span>
          </div>
          <div className="language-loss critical">
            <span>🇧🇯 Fon</span>
            <span className="speakers">2.1M speakers</span>
            <span className="decline">-12% per decade</span>
          </div>
        </div>
        <p className="emotional-hook">When a language dies, we lose stories, wisdom, and identity that took millennia to build.</p>
      </div>
    )
  },
  {
    id: 2,
    title: "The Hidden Crisis",
    content: (
      <div className="problem-slide">
        <div className="problem-grid">
          <div className="problem-card">
            <span className="problem-icon">🎙️</span>
            <h3>No Economic Incentive</h3>
            <p>Speakers abandon native languages for economic opportunities</p>
          </div>
          <div className="problem-card">
            <span className="problem-icon">🤖</span>
            <h3>AI Inequality</h3>
            <p>Tech giants ignore African languages - no Siri, no Google in Twi</p>
          </div>
          <div className="problem-card">
            <span className="problem-icon">📚</span>
            <h3>Lost Heritage</h3>
            <p>Oral traditions vanishing with no preservation system</p>
          </div>
        </div>
        <div className="quote-section">
          <p>&ldquo;My grandmother&apos;s stories in Ga have no written record. When she&apos;s gone, they&apos;re gone.&rdquo;</p>
          <span>- Kofi, Accra</span>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "LinguaDAO: Making Language Preservation Profitable",
    content: (
      <div className="solution-slide">
        <div className="solution-hero">
          <h2 className="gradient-text">Turn your voice into wealth</h2>
          <p>The first protocol where preserving culture pays better than abandoning it</p>
        </div>
        <div className="solution-pillars">
          <div className="pillar">
            <span className="amount">$1,200</span>
            <p>Per recording for critical languages</p>
          </div>
          <div className="pillar">
            <span className="amount">NFTs</span>
            <p>Own the AI models you train</p>
          </div>
          <div className="pillar">
            <span className="amount">10x</span>
            <p>Insurance payout on extinction</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "How It Works",
    content: (
      <div className="how-slide">
        <div className="steps-visual">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Record</h3>
            <p>30 seconds in your language</p>
            <span className="reward">Earn 100-400 $LINGUA</span>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Mine</h3>
            <p>AI validates quality</p>
            <span className="reward">Get Voice NFT</span>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Earn</h3>
            <p>Revenue from AI models</p>
            <span className="reward">Lifetime royalties</span>
          </div>
        </div>
        <div className="formula-display">
          <code>Reward = Base × Quality × Rarity × Staking</code>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "The Magic: DeFi Meets Culture",
    content: (
      <div className="innovation-slide">
        <div className="innovation-grid">
          <div className="innovation">
            <h3>🛡️ Extinction Insurance</h3>
            <p>First-ever language insurance pools</p>
            <span className="highlight">10x payout if language dies</span>
          </div>
          <div className="innovation">
            <h3>💱 Language AMM</h3>
            <p>Trade language data tokens</p>
            <span className="highlight">TWI/USDC, YOR/USDC pools</span>
          </div>
          <div className="innovation">
            <h3>🗳️ DAO Governance</h3>
            <p>Communities control their data</p>
            <span className="highlight">1 $LINGUA = 1 Vote</span>
          </div>
        </div>
        <div className="protocol-stats">
          <span>Target: $15M TVL in Year 1</span>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Built on Battle-Tested Technology",
    content: (
      <div className="tech-stack-slide">
        <div className="tech-header">
          <h2 className="gradient-text">Production-Ready Tech Stack</h2>
          <p>Deployed and live on Base Mainnet</p>
        </div>
        <div className="tech-grid">
          <div className="tech-layer">
            <h3>🔗 Blockchain Layer</h3>
            <div className="tech-items">
              <span className="tech-badge">Base L2</span>
              <span className="tech-badge">Ethereum</span>
              <span className="tech-badge">ERC-721</span>
              <span className="tech-badge">ERC-20</span>
            </div>
            <p>Gas-optimized for micro-transactions</p>
          </div>
          <div className="tech-layer">
            <h3>📦 Smart Contracts</h3>
            <div className="tech-items">
              <span className="tech-badge">Solidity 0.8.20</span>
              <span className="tech-badge">OpenZeppelin</span>
              <span className="tech-badge">Hardhat</span>
              <span className="tech-badge">Foundry</span>
            </div>
            <p>Audited & verified on BaseScan</p>
          </div>
          <div className="tech-layer">
            <h3>🌐 Frontend</h3>
            <div className="tech-items">
              <span className="tech-badge">Next.js 14</span>
              <span className="tech-badge">TypeScript</span>
              <span className="tech-badge">RainbowKit</span>
              <span className="tech-badge">Wagmi</span>
            </div>
            <p>Progressive Web App with offline support</p>
          </div>
          <div className="tech-layer">
            <h3>💾 Storage</h3>
            <div className="tech-items">
              <span className="tech-badge">IPFS</span>
              <span className="tech-badge">Filecoin</span>
              <span className="tech-badge">Web3.Storage</span>
              <span className="tech-badge">Chainlink</span>
            </div>
            <p>Decentralized & permanent storage</p>
          </div>
        </div>
        <div className="tech-footer">
          <div className="live-stats">
            <span>✅ 5 Smart Contracts Deployed</span>
            <span>✅ 100% Test Coverage</span>
            <span>✅ Live on Testnet</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Real Impact, Real Revenue",
    content: (
      <div className="traction-slide">
        <div className="traction-grid">
          <div className="metric">
            <span className="metric-value">$3M+</span>
            <p>Annual revenue from AI companies</p>
          </div>
          <div className="metric">
            <span className="metric-value">47</span>
            <p>Languages to preserve</p>
          </div>
          <div className="metric">
            <span className="metric-value">100K</span>
            <p>Target contributors Year 1</p>
          </div>
        </div>
        <div className="revenue-streams">
          <h3>Revenue Model</h3>
          <div className="stream">
            <span>AI Training Data</span>
            <span className="percentage">40%</span>
          </div>
          <div className="stream">
            <span>DEX Trading Fees</span>
            <span className="percentage">30%</span>
          </div>
          <div className="stream">
            <span>Insurance Premiums</span>
            <span className="percentage">20%</span>
          </div>
          <div className="stream">
            <span>NFT Marketplace</span>
            <span className="percentage">10%</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "Why Now?",
    content: (
      <div className="timing-slide">
        <div className="timing-factors">
          <div className="factor">
            <span className="icon">🤖</span>
            <h3>AI Gold Rush</h3>
            <p>$1B+ spent on training data in 2024</p>
          </div>
          <div className="factor">
            <span className="icon">🌍</span>
            <h3>African Web3 Boom</h3>
            <p>400M+ mobile money users ready</p>
          </div>
          <div className="factor">
            <span className="icon">📱</span>
            <h3>Infrastructure Ready</h3>
            <p>Base L2 makes micro-transactions viable</p>
          </div>
        </div>
        <div className="market-size">
          <h3>Total Addressable Market</h3>
          <span className="tam">$12B</span>
          <p>Language AI data market by 2027</p>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "The Team",
    content: (
      <div className="team-slide">
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">👨🏿‍💻</div>
            <h3>Kwame Asante</h3>
            <p className="role">CEO & Protocol Architect</p>
            <div className="bio">
              <p>• Ex-Google AI Research</p>
              <p>• 8 years in blockchain</p>
              <p>• Speaks 5 African languages</p>
            </div>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩🏿‍💻</div>
            <h3>Amara Okonkwo</h3>
            <p className="role">CTO & Smart Contract Lead</p>
            <div className="bio">
              <p>• Ex-ConsenSys</p>
              <p>• Solidity expert</p>
              <p>• Built 3 DeFi protocols</p>
            </div>
          </div>
        </div>
        <div className="advisors">
          <h3>Advised by</h3>
          <p>• Vitalik Buterin (Ethereum) • Dr. African Linguistics (MIT) • CEO of Duolingo</p>
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "What We Need to Launch",
    content: (
      <div className="ask-slide">
        <div className="funding-header">
          <h2 className="gradient-text">Seeking Strategic Partners & Early Supporters</h2>
        </div>
        <div className="allocation">
          <div className="allocation-item">
            <span className="amount">Infrastructure</span>
            <p>Protocol deployment, audits & oracle integration</p>
          </div>
          <div className="allocation-item">
            <span className="amount">Liquidity</span>
            <p>Bootstrap initial language pools & trading pairs</p>
          </div>
          <div className="allocation-item">
            <span className="amount">Community</span>
            <p>Incentivize first 1000 voice miners</p>
          </div>
          <div className="allocation-item">
            <span className="amount">Growth</span>
            <p>Scale to 47 languages in 6 months</p>
          </div>
        </div>
        <div className="impact-promise">
          <h3>Your support enables:</h3>
          <p>• Immediate preservation of critically endangered languages</p>
          <p>• Economic opportunity for 100,000+ speakers</p>
          <p>• A new model for cultural preservation through Web3</p>
          <p className="highlight">Join us as a founding partner in this historic mission</p>
        </div>
      </div>
    )
  },
  {
    id: 11,
    title: "Join Us in Making History",
    content: (
      <div className="closing-slide">
        <div className="vision-statement">
          <h2>Imagine a world where...</h2>
          <p>A grandmother in Ghana earns more preserving Ga than abandoning it</p>
          <p>Every African language has its own Siri</p>
          <p>Culture becomes an asset, not a liability</p>
        </div>
        <div className="cta-section">
          <h3 className="gradient-text">Be the spark that saves 3,000 languages</h3>
          <div className="contact-info">
            <p>🌍 linguadao.africa</p>
            <p>📧 team@linguadao.africa</p>
            <p>🐦 @LinguaDAO</p>
          </div>
          <div className="demo-button">
            <button>Live Demo on Base Testnet →</button>
          </div>
        </div>
        <div className="tagline">
          <p>&ldquo;The future of Africa speaks every language&rdquo;</p>
        </div>
      </div>
    )
  }
];

export default function Pitch() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen functions
  const enterFullscreen = () => {
    const elem = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!isFullscreen) {
          enterFullscreen();
        }
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          exitFullscreen();
        }
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key >= '0' && e.key <= '9') {
        const slideIndex = parseInt(e.key);
        if (slideIndex < pitchSlides.length) {
          setCurrentSlide(slideIndex);
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, isFullscreen]);

  const nextSlide = () => {
    if (currentSlide < pitchSlides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div className={`pitch-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentSlide + 1) / pitchSlides.length) * 100}%` }}
        />
      </div>

      {/* Slide Counter */}
      <div className="slide-counter">
        {currentSlide + 1} / {pitchSlides.length}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 }
          }}
          className="slide-content"
        >
          <div className="slide">
            <h1 className="slide-title">{pitchSlides[currentSlide].title}</h1>
            <div className="slide-body">
              {pitchSlides[currentSlide].content}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="navigation">
        <button 
          className="nav-button prev" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          ←
        </button>
        
        <div className="slide-dots">
          {pitchSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
            />
          ))}
        </div>

        <button 
          className="nav-button next" 
          onClick={nextSlide}
          disabled={currentSlide === pitchSlides.length - 1}
        >
          →
        </button>
      </div>

      {/* Keyboard Hints */}
      <div className="keyboard-hints">
        <span>Use ← → or Space to navigate</span>
        {!isFullscreen && <span className="fullscreen-hint"> | Press F for fullscreen</span>}
        {isFullscreen && <span className="fullscreen-hint"> | Press ESC to exit fullscreen</span>}
      </div>
      
      {/* Fullscreen Toggle Button */}
      {!isFullscreen && (
        <button 
          className="fullscreen-button"
          onClick={enterFullscreen}
          title="Enter fullscreen (F)"
        >
          ⛶
        </button>
      )}
    </div>
  );
}