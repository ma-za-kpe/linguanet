'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './pitch-story.css';
import './pitch-mobile.css';

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
    title: "The Hidden Crisis: Now Validated by MIT Research",
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
            <h3>20% AI Performance Gap</h3>
            <p>MIT research: African languages perform 20% worse in AI models</p>
          </div>
          <div className="problem-card">
            <span className="problem-icon">📚</span>
            <h3>160M People Affected</h3>
            <p>Digital divide impacts millions across 8+ major languages</p>
          </div>
        </div>
        <div className="research-validation">
          <p className="research-quote">&ldquo;The differences in LLM performance between languages result in a &apos;rich-get-richer&apos; effect&rdquo;</p>
          <span className="source">- MIT Research, December 2024</span>
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
    title: "LinguaDAO: The Research-Validated Solution",
    content: (
      <div className="solution-slide">
        <div className="solution-hero">
          <h2 className="gradient-text">Closing the 20% AI Performance Gap</h2>
          <p>MIT research proves quality data improves African language AI by 5.6% - we deliver it</p>
        </div>
        <div className="solution-pillars">
          <div className="pillar">
            <span className="amount">$1,200/mo</span>
            <p>Speakers earn from preserving culture</p>
          </div>
          <div className="pillar">
            <span className="amount">5.6%</span>
            <p>Proven AI improvement with our data</p>
          </div>
          <div className="pillar">
            <span className="amount">NFTs</span>
            <p>Ownership + lifetime royalties</p>
          </div>
        </div>
        <div className="validation-banner">
          <p className="validation-text">🔬 &ldquo;High-quality, culturally-appropriate data significantly improves model performance&rdquo; - MIT 2024</p>
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
    title: "System Architecture: Built to Scale",
    content: (
      <div className="architecture-slide">
        <div className="arch-header">
          <h2 className="gradient-text">Production-Ready Infrastructure</h2>
        </div>
        <div className="arch-diagram">
          <div className="arch-layer">
            <h3>🎤 Voice Layer</h3>
            <div className="arch-flow">
              <span>Record</span>
              <span>→</span>
              <span>IPFS</span>
              <span>→</span>
              <span>Validate</span>
            </div>
          </div>
          <div className="arch-layer">
            <h3>⛓️ Blockchain Layer</h3>
            <div className="arch-flow">
              <span>Smart Contracts</span>
              <span>→</span>
              <span>NFT Mint</span>
              <span>→</span>
              <span>Rewards</span>
            </div>
          </div>
          <div className="arch-layer">
            <h3>💰 DeFi Layer</h3>
            <div className="arch-flow">
              <span>AMM Pools</span>
              <span>→</span>
              <span>Insurance</span>
              <span>→</span>
              <span>DAO</span>
            </div>
          </div>
          <div className="arch-layer">
            <h3>🤖 AI Layer</h3>
            <div className="arch-flow">
              <span>Training</span>
              <span>→</span>
              <span>Models</span>
              <span>→</span>
              <span>Revenue</span>
            </div>
          </div>
        </div>
        <div className="arch-stats">
          <div className="stat">
            <span className="stat-number">&lt; 2s</span>
            <span className="stat-label">Transaction Speed</span>
          </div>
          <div className="stat">
            <span className="stat-number">$0.10</span>
            <span className="stat-label">Gas Cost</span>
          </div>
          <div className="stat">
            <span className="stat-number">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
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
    title: "Why Now? The Perfect Storm",
    content: (
      <div className="timing-slide">
        <div className="timing-factors">
          <div className="factor">
            <span className="icon">🔬</span>
            <h3>Academic Validation</h3>
            <p>MIT proves 20% AI gap for African languages</p>
          </div>
          <div className="factor">
            <span className="icon">💰</span>
            <h3>$50B AI Data Market</h3>
            <p>5.6% improvement = $2.8B opportunity</p>
          </div>
          <div className="factor">
            <span className="icon">🌍</span>
            <h3>400M Mobile Money Users</h3>
            <p>Africa leads global Web3 adoption</p>
          </div>
        </div>
        <div className="market-validation">
          <h3>Market Validation</h3>
          <div className="validation-grid">
            <div className="validation-item">
              <span className="metric">$12B</span>
              <p>TAM by 2027</p>
            </div>
            <div className="validation-item">
              <span className="metric">160M</span>
              <p>Underserved speakers</p>
            </div>
            <div className="validation-item">
              <span className="metric">20%</span>
              <p>Performance gap to close</p>
            </div>
          </div>
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
    title: "Research-Backed Partnership Opportunities",
    content: (
      <div className="partnership-slide">
        <div className="partnership-header">
          <h2 className="gradient-text">Join the Solution to a $2.8B Problem</h2>
          <p>MIT research validates the urgent need for quality African language data</p>
        </div>
        <div className="partnership-grid">
          <div className="partner-type">
            <span className="partner-icon">🏛️</span>
            <h3>Research Institutions</h3>
            <p>Access high-quality, culturally-appropriate datasets</p>
            <span className="value">5.6% model improvement proven</span>
          </div>
          <div className="partner-type">
            <span className="partner-icon">🤖</span>
            <h3>AI Companies</h3>
            <p>Close the 20% performance gap in African markets</p>
            <span className="value">160M new users unlocked</span>
          </div>
          <div className="partner-type">
            <span className="partner-icon">🏦</span>
            <h3>Impact Investors</h3>
            <p>Measurable social + financial returns</p>
            <span className="value">$12B TAM by 2027</span>
          </div>
          <div className="partner-type">
            <span className="partner-icon">🌍</span>
            <h3>Governments</h3>
            <p>Preserve national heritage profitably</p>
            <span className="value">3,000 languages saved</span>
          </div>
        </div>
        <div className="partnership-cta">
          <h3>Strategic Partnership Benefits:</h3>
          <p>✓ First access to validated language datasets</p>
          <p>✓ Co-branded research publications</p>
          <p>✓ Priority API access and custom models</p>
          <p>✓ Board advisory positions</p>
        </div>
      </div>
    )
  },
  {
    id: 11,
    title: "Investment Opportunity",
    content: (
      <div className="ask-slide">
        <div className="funding-header">
          <h2 className="gradient-text">$2M Seed Round - Closing Soon</h2>
          <p>Building the infrastructure for African AI equality</p>
        </div>
        <div className="allocation">
          <div className="allocation-item">
            <span className="amount">40%</span>
            <p>Technology: Scaling voice mining infrastructure</p>
          </div>
          <div className="allocation-item">
            <span className="amount">30%</span>
            <p>Liquidity: Bootstrap language token markets</p>
          </div>
          <div className="allocation-item">
            <span className="amount">20%</span>
            <p>Community: First 10,000 voice miners</p>
          </div>
          <div className="allocation-item">
            <span className="amount">10%</span>
            <p>Operations: Team expansion & partnerships</p>
          </div>
        </div>
        <div className="traction-proof">
          <h3>Traction & Validation:</h3>
          <div className="traction-grid">
            <div className="traction-item">
              <span className="number">5</span>
              <p>Live smart contracts</p>
            </div>
            <div className="traction-item">
              <span className="number">MIT</span>
              <p>Research validation</p>
            </div>
            <div className="traction-item">
              <span className="number">$12B</span>
              <p>Addressable market</p>
            </div>
            <div className="traction-item">
              <span className="number">20%</span>
              <p>Gap to close</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 12,
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
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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

  // Touch handlers for swipe gestures
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
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
    <div 
      className={`pitch-container ${isFullscreen ? 'fullscreen-mode' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Keyboard Hints - Desktop / Swipe Indicator - Mobile */}
      <div className="keyboard-hints">
        <span>Use ← → or Space to navigate</span>
        {!isFullscreen && <span className="fullscreen-hint"> | Press F for fullscreen</span>}
        {isFullscreen && <span className="fullscreen-hint"> | Press ESC to exit fullscreen</span>}
      </div>
      
      {/* Mobile Swipe Indicator */}
      {typeof window !== 'undefined' && window.innerWidth <= 768 && (
        <div className="swipe-indicator">
          ← Swipe to navigate →
        </div>
      )}
      
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