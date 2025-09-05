'use client';

import { useState, useEffect } from 'react';
import './pitch.css';

const slides = [
  // Slide 1: Title
  {
    id: 1,
    title: "LinguaNet",
    subtitle: "Turn Your Voice into Value",
    content: (
      <div className="title-slide">
        <div className="logo-container">
          <div className="logo">🌍</div>
          <h1 className="main-title">LinguaNet</h1>
        </div>
        <p className="tagline">Preserving African Languages. Powering Global AI.</p>
        <div className="hackathon-badge">ETHAccra 2025</div>
        <div className="stats-row">
          <div className="stat">
            <span className="stat-number">2,000+</span>
            <span className="stat-label">African Languages at Risk</span>
          </div>
          <div className="stat">
            <span className="stat-number">$20B</span>
            <span className="stat-label">AI Training Data Market</span>
          </div>
          <div className="stat">
            <span className="stat-number">90%</span>
            <span className="stat-label">AI Trained on English Only</span>
          </div>
        </div>
      </div>
    )
  },

  // Slide 2: Problem
  {
    id: 2,
    title: "The Problem",
    subtitle: "AI Speaks English. Africa Doesn't.",
    content: (
      <div className="problem-slide">
        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-icon">🤖</div>
            <h3>AI Language Gap</h3>
            <p>ChatGPT can't speak Twi, Swahili, or Yoruba. 500M+ Africans excluded from AI revolution.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">💸</div>
            <h3>Wasted Opportunity</h3>
            <p>Native speakers can't monetize their linguistic knowledge. Youth unemployment at 60%.</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">📉</div>
            <h3>Cultural Extinction</h3>
            <p>African languages dying without digital preservation. UNESCO: 2,000+ at risk.</p>
          </div>
        </div>
        <div className="impact-statement">
          "In Ghana, 80+ languages spoken daily. In AI training data? Zero."
        </div>
      </div>
    )
  },

  // Slide 3: Solution
  {
    id: 3,
    title: "The Solution",
    subtitle: "Every Phone Becomes an AI Data Factory",
    content: (
      <div className="solution-slide">
        <div className="solution-flow">
          <div className="flow-step">
            <div className="step-icon">📱</div>
            <h4>Record</h4>
            <p>30 seconds of Twi</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-icon">✨</div>
            <h4>Validate</h4>
            <p>AI + Native Speakers</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-icon">💵</div>
            <h4>Earn</h4>
            <p>$3 USDC Instantly</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-icon">📲</div>
            <h4>Withdraw</h4>
            <p>MTN Mobile Money</p>
          </div>
        </div>
        <div className="solution-highlight">
          <div className="highlight-box">
            <h3>For Contributors</h3>
            <p>Earn $50-200/month speaking your language</p>
          </div>
          <div className="highlight-box">
            <h3>For AI Companies</h3>
            <p>Access verified African language datasets via API</p>
          </div>
        </div>
      </div>
    )
  },

  // Slide 4: How It Works
  {
    id: 4,
    title: "How It Works",
    subtitle: "Blockchain Meets Mobile Money",
    content: (
      <div className="how-slide">
        <div className="tech-architecture">
          <div className="arch-layer">
            <h4>Frontend</h4>
            <div className="tech-items">
              <span className="tech-badge">React Native</span>
              <span className="tech-badge">Next.js</span>
            </div>
          </div>
          <div className="arch-layer">
            <h4>Identity & Trust</h4>
            <div className="tech-items">
              <span className="tech-badge">ENS (kofi.linguanet.eth)</span>
              <span className="tech-badge">EFP Reputation</span>
            </div>
          </div>
          <div className="arch-layer">
            <h4>Blockchain</h4>
            <div className="tech-items">
              <span className="tech-badge">Base L2</span>
              <span className="tech-badge">USDC Payments</span>
            </div>
          </div>
          <div className="arch-layer">
            <h4>Storage & AI</h4>
            <div className="tech-items">
              <span className="tech-badge">Filecoin</span>
              <span className="tech-badge">TensorFlow.js</span>
            </div>
          </div>
        </div>
        <div className="key-features">
          <div className="feature">✅ No crypto knowledge needed</div>
          <div className="feature">✅ Works on $50 Android phones</div>
          <div className="feature">✅ Instant mobile money withdrawal</div>
        </div>
      </div>
    )
  },

  // Slide 5: Live Demo
  {
    id: 5,
    title: "Live Demo",
    subtitle: "Watch Someone Earn $3 in 30 Seconds",
    content: (
      <div className="demo-slide">
        <div className="demo-main">
          <div className="demo-devices">
            {/* Phone Mockup */}
            <div className="device phone">
              <div className="device-frame">
                <div className="device-notch"></div>
                <div className="device-screen phone-screen">
                  <div className="app-header">
                    <div className="status-bar">
                      <span>9:41</span>
                      <div className="status-icons">
                        <span>📶</span>
                        <span>🔋</span>
                      </div>
                    </div>
                    <h5 className="app-title">LinguaNet</h5>
                  </div>
                  <div className="demo-content">
                    <div className="user-info">
                      <div className="user-avatar">KA</div>
                      <div className="user-details">
                        <p className="user-name">Kofi Asante</p>
                        <p className="user-id">kofi.linguanet.eth</p>
                      </div>
                    </div>
                    <div className="recording-interface">
                      <div className="waveform">
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar active"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar active"></div>
                        <div className="wave-bar"></div>
                      </div>
                      <div className="recording-timer">00:28</div>
                      <button className="record-btn recording">
                        <span className="record-icon">🎤</span>
                        <span className="record-text">Recording Twi...</span>
                      </button>
                    </div>
                    <div className="demo-steps">
                      <div className="step-item completed">
                        <div className="step-icon">✅</div>
                        <div className="step-info">
                          <span className="step-title">Phone Verified</span>
                          <span className="step-time">2 min ago</span>
                        </div>
                      </div>
                      <div className="step-item active">
                        <div className="step-icon">🎤</div>
                        <div className="step-info">
                          <span className="step-title">Recording Audio</span>
                          <span className="step-time">In progress...</span>
                        </div>
                      </div>
                      <div className="step-item pending">
                        <div className="step-icon">💰</div>
                        <div className="step-info">
                          <span className="step-title">Earn $3 USDC</span>
                          <span className="step-time">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Lines */}
            <div className="connection-flow">
              <div className="flow-line"></div>
              <div className="flow-node">
                <span>Base L2</span>
              </div>
              <div className="flow-line"></div>
            </div>

            {/* Laptop Mockup */}
            <div className="device laptop">
              <div className="device-frame">
                <div className="device-screen laptop-screen">
                  <div className="browser-bar">
                    <div className="browser-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-url">linguanet.base.eth/dashboard</div>
                  </div>
                  <div className="dashboard-content">
                    <h5 className="dashboard-title">AI Company Dashboard</h5>
                    <div className="real-time-feed">
                      <div className="feed-header">
                        <span className="live-indicator"></span>
                        <span>Live Data Stream</span>
                      </div>
                      <div className="data-cards">
                        <div className="data-card new">
                          <div className="card-badge">NEW</div>
                          <div className="card-content">
                            <p className="card-lang">Twi Audio</p>
                            <p className="card-meta">Just validated • 98% quality</p>
                            <div className="card-preview">
                              <div className="mini-waveform">
                                <span></span><span></span><span></span>
                                <span></span><span></span>
                              </div>
                              <span className="duration">0:30</span>
                            </div>
                          </div>
                        </div>
                        <div className="data-stats">
                          <div className="stat-item">
                            <span className="stat-label">Available</span>
                            <span className="stat-value">127</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Quality</span>
                            <span className="stat-value">✓ Verified</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Price</span>
                            <span className="stat-value">$127</span>
                          </div>
                        </div>
                      </div>
                      <button className="purchase-btn">
                        <span>Purchase Dataset</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="laptop-base"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="demo-highlights">
          <div className="highlight-card">
            <div className="highlight-icon">⚡</div>
            <h4>Instant Payments</h4>
            <p>USDC → Mobile Money in seconds</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🛡️</div>
            <h4>Verified Quality</h4>
            <p>AI + Human validation</p>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🌍</div>
            <h4>Real Impact</h4>
            <p>100+ contributors already earning</p>
          </div>
        </div>
      </div>
    )
  },

  // Slide 6: Market Opportunity
  {
    id: 6,
    title: "Market Opportunity",
    subtitle: "Billion-Dollar Problem, Blockchain Solution",
    content: (
      <div className="market-slide">
        <div className="market-stats">
          <div className="market-card">
            <h3>$20B+</h3>
            <p>Global AI training data market</p>
            <span className="growth">↑ 35% yearly</span>
          </div>
          <div className="market-card">
            <h3>500M+</h3>
            <p>African language speakers</p>
            <span className="growth">60% under 25</span>
          </div>
          <div className="market-card">
            <h3>2,000+</h3>
            <p>Languages to preserve</p>
            <span className="growth">First-mover advantage</span>
          </div>
        </div>
        <div className="competitor-analysis">
          <h4>Why We Win</h4>
          <div className="comparison">
            <div className="compare-item">
              <span className="compare-label">Appen/Scale AI:</span>
              <span className="compare-value">Centralized, expensive, slow payments</span>
            </div>
            <div className="compare-item">
              <span className="compare-label">LinguaNet:</span>
              <span className="compare-value highlight">Decentralized, instant USDC, mobile money</span>
            </div>
          </div>
        </div>
      </div>
    )
  },

  // Slide 7: Traction & Validation
  {
    id: 7,
    title: "Traction",
    subtitle: "Built & Validated in 48 Hours",
    content: (
      <div className="traction-slide">
        <div className="achievements">
          <div className="achievement">
            <div className="achievement-icon">🚀</div>
            <h4>MVP Live</h4>
            <p>Deployed on Base Sepolia</p>
            <p className="detail">Smart contracts verified</p>
          </div>
          <div className="achievement">
            <div className="achievement-icon">🎯</div>
            <h4>100+ Samples</h4>
            <p>Real Twi audio collected</p>
            <p className="detail">From Ghana hackathon attendees</p>
          </div>
          <div className="achievement">
            <div className="achievement-icon">🤝</div>
            <h4>Partner Interest</h4>
            <p>3 AI companies interviewed</p>
            <p className="detail">Lelapa AI, local startups</p>
          </div>
        </div>
        <div className="testimonial">
          <blockquote>
            "This solves our biggest challenge - getting authentic African language data for our healthcare AI"
          </blockquote>
          <cite>- AI Startup Founder, Accra</cite>
        </div>
      </div>
    )
  },

  // Slide 8: Business Model
  {
    id: 8,
    title: "Business Model",
    subtitle: "Sustainable Economics for All",
    content: (
      <div className="business-slide">
        <div className="revenue-flow">
          <h4>Revenue Model</h4>
          <div className="flow-diagram">
            <div className="revenue-box">
              <h5>AI Company</h5>
              <p>Pays $1,000 for dataset</p>
            </div>
            <div className="arrow-down">↓</div>
            <div className="split-boxes">
              <div className="revenue-box small">
                <h5>Platform (10%)</h5>
                <p>$100 sustainability</p>
              </div>
              <div className="revenue-box large">
                <h5>Treasury (90%)</h5>
                <p>$900 for contributors</p>
              </div>
            </div>
          </div>
        </div>
        <div className="projections">
          <h4>18-Month Projection</h4>
          <div className="projection-stats">
            <div>10,000 contributors</div>
            <div>5 languages</div>
            <div>$2M revenue</div>
          </div>
        </div>
      </div>
    )
  },

  // Slide 9: Roadmap & Impact
  {
    id: 9,
    title: "Roadmap",
    subtitle: "From Ghana to Global",
    content: (
      <div className="roadmap-slide">
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h4>Now - Hackathon</h4>
            <p>Twi MVP, 100+ samples</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h4>Q1 2025</h4>
            <p>5 languages, 1,000 users, Ghana launch</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h4>Q2 2025</h4>
            <p>West Africa expansion, 10,000 users</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h4>Q4 2025</h4>
            <p>100 languages, UNESCO partnership</p>
          </div>
        </div>
        <div className="impact-vision">
          <h4>Impact Vision</h4>
          <div className="impact-items">
            <div>🌍 Preserve 1,000+ languages</div>
            <div>💰 $100M to African communities</div>
            <div>🤖 Inclusive AI for all</div>
          </div>
        </div>
      </div>
    )
  },

  // Slide 10: The Ask
  {
    id: 10,
    title: "What We Need to Win",
    subtitle: "Your Support Makes This Real",
    content: (
      <div className="ask-slide">
        <div className="ask-grid">
          <div className="ask-section">
            <h3>🎯 Technical Validation</h3>
            <p>Help us demonstrate that blockchain can solve real-world problems in Africa</p>
            <ul className="ask-points">
              <li>Test our Twi recording feature</li>
              <li>Review our smart contract architecture</li>
              <li>Validate our mobile money integration</li>
            </ul>
          </div>
          <div className="ask-section">
            <h3>🤝 Community Support</h3>
            <p>Connect us with the ecosystem to scale impact</p>
            <ul className="ask-points">
              <li>Introductions to AI companies needing data</li>
              <li>Partners for other African markets</li>
              <li>Language preservation organizations</li>
            </ul>
          </div>
          <div className="ask-section">
            <h3>💡 Strategic Guidance</h3>
            <p>Your expertise can help us build better</p>
            <ul className="ask-points">
              <li>Scaling decentralized data marketplaces</li>
              <li>Token economics for sustainability</li>
              <li>Cross-border payment solutions</li>
            </ul>
          </div>
        </div>
        <div className="why-us">
          <h4>Why Back LinguaNet?</h4>
          <div className="reasons">
            <div className="reason">
              <span className="reason-icon">🌍</span>
              <span>First mover in $20B African language data market</span>
            </div>
            <div className="reason">
              <span className="reason-icon">💰</span>
              <span>Immediate revenue model, not just a concept</span>
            </div>
            <div className="reason">
              <span className="reason-icon">🚀</span>
              <span>Working MVP with real users and real data</span>
            </div>
          </div>
        </div>
        <div className="commitment">
          <p className="commitment-text">
            "We're not just building technology. We're preserving culture and creating opportunity."
          </p>
        </div>
      </div>
    )
  },

  // Slide 11: Join Us & Ask
  {
    id: 11,
    title: "Join Us",
    subtitle: "Building the Future of Inclusive AI",
    content: (
      <div className="ask-slide">
        <div className="bounties-targeted">
          <h4>ETHAccra Bounties Targeted</h4>
          <div className="bounty-grid">
            <div className="bounty">ENS - $4,800</div>
            <div className="bounty">Base - $3,000</div>
            <div className="bounty">EFP - $1,000</div>
            <div className="bounty">Buidl Guidl - $1,000</div>
            <div className="bounty">Filecoin - $500</div>
          </div>
        </div>
        <div className="call-to-action">
          <h3>Why LinguaNet Wins</h3>
          <div className="win-reasons">
            <div>✅ Solves real African problem</div>
            <div>✅ Working MVP with real data</div>
            <div>✅ Immediate economic impact</div>
            <div>✅ All bounties integrated</div>
            <div>✅ Scalable from Ghana to global</div>
          </div>
        </div>
        <div className="final-message">
          <h2>Every Voice Matters. Every Language Counts.</h2>
          <p className="contact">
            <span>🔗 GitHub: /linguanet</span>
            <span>🌐 Demo: linguanet.base.eth</span>
          </p>
        </div>
      </div>
    )
  }
];

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        setIsPresenting(false);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsPresenting(!isPresenting);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isPresenting]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={`pitch-container ${isPresenting ? 'presenting' : ''}`}>
      <div className="slide-wrapper">
        <div className="slide">
          <div className="slide-header">
            <h2>{slides[currentSlide].title}</h2>
            <p>{slides[currentSlide].subtitle}</p>
          </div>
          <div className="slide-content">
            {slides[currentSlide].content}
          </div>
        </div>
      </div>

      <div className="controls">
        <button onClick={prevSlide} className="nav-button" disabled={currentSlide === 0}>
          ←
        </button>
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button onClick={nextSlide} className="nav-button" disabled={currentSlide === slides.length - 1}>
          →
        </button>
      </div>

      <div className="presentation-controls">
        <button onClick={() => setIsPresenting(!isPresenting)} className="present-button">
          {isPresenting ? 'Exit Fullscreen (ESC)' : 'Present (F)'}
        </button>
        <span className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>

      <div className="keyboard-hints">
        <span>Use ← → arrows or spacebar to navigate</span>
      </div>
    </div>
  );
}