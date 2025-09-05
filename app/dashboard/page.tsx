'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './dashboard-linguadao.css';

// Mock data for LinguaDAO Protocol
const mockProtocolData = {
  tvl: 15847293,
  linguaPrice: 0.42,
  linguaChange: 12.5,
  totalStaked: 8924156,
  stakingAPY: 28.5,
  voiceNFTs: 4287,
  activeGuardians: 892,
  languagesCovered: 47,
  dailyVolume: 287456,
  volumeChange: 8.3
};

// Language Pools Data
const languagePools = [
  { 
    code: 'TWI', name: 'Twi', flag: '🇬🇭', 
    tvl: 2847000, apy: 42.5, volume24h: 45780,
    status: 'vulnerable', multiplier: 2
  },
  { 
    code: 'YOR', name: 'Yoruba', flag: '🇳🇬', 
    tvl: 3124000, apy: 38.2, volume24h: 52340,
    status: 'vulnerable', multiplier: 2
  },
  { 
    code: 'FON', name: 'Fon', flag: '🇧🇯', 
    tvl: 892000, apy: 85.3, volume24h: 12450,
    status: 'critical', multiplier: 4
  },
  { 
    code: 'EWE', name: 'Ewe', flag: '🇹🇬', 
    tvl: 1234000, apy: 62.7, volume24h: 23400,
    status: 'endangered', multiplier: 3
  },
  { 
    code: 'GA', name: 'Ga', flag: '🇬🇭', 
    tvl: 567000, apy: 92.1, volume24h: 8900,
    status: 'critical', multiplier: 4
  },
  { 
    code: 'WOL', name: 'Wolof', flag: '🇸🇳', 
    tvl: 1456000, apy: 55.8, volume24h: 28700,
    status: 'endangered', multiplier: 3
  }
];

// Governance Proposals
const proposals = [
  {
    id: 'LIP-042',
    title: 'Increase Critical Language Multiplier to 5x',
    status: 'active',
    description: 'Proposal to increase mining rewards for critical languages from 4x to 5x to incentivize preservation',
    forVotes: 892451,
    againstVotes: 234122,
    endsIn: '2 days'
  },
  {
    id: 'LIP-041',
    title: 'Add Tigre Language Support',
    status: 'active',
    description: 'Add Tigre (Eritrea) to supported languages with 3.5x endangered multiplier',
    forVotes: 567234,
    againstVotes: 123456,
    endsIn: '4 days'
  },
  {
    id: 'LIP-040',
    title: 'Treasury Allocation for Marketing',
    status: 'passed',
    description: 'Allocate 500,000 $LINGUA from treasury for African university partnerships',
    forVotes: 1234567,
    againstVotes: 234567,
    endsIn: 'Executed'
  }
];

// Guardian Leaderboard
const topGuardians = [
  { rank: 1, name: 'kofi.dao', tier: 'Master Guardian', contributions: 1847, lingua: 247800 },
  { rank: 2, name: 'amara.eth', tier: 'Master Guardian', contributions: 1523, lingua: 198400 },
  { rank: 3, name: 'fatima.dao', tier: 'Expert Guardian', contributions: 1289, lingua: 156700 },
  { rank: 4, name: 'kwame.eth', tier: 'Expert Guardian', contributions: 987, lingua: 134200 },
  { rank: 5, name: 'aisha.dao', tier: 'Guardian', contributions: 756, lingua: 98500 }
];

// Insurance Pools
const insurancePools = [
  {
    language: 'Fon', flag: '🇧🇯', status: 'critical',
    coverage: 2500000, premium: 0.8, payout: 10,
    speakers: 2100000, trend: -15
  },
  {
    language: 'Ga', flag: '🇬🇭', status: 'critical',
    coverage: 1800000, premium: 0.75, payout: 10,
    speakers: 580000, trend: -12
  },
  {
    language: 'Ewe', flag: '🇹🇬', status: 'endangered',
    coverage: 3200000, premium: 0.5, payout: 8,
    speakers: 3700000, trend: -8
  }
];

// Recent Activity
const recentActivity = [
  { type: 'mining', time: 'Just now', description: '247 $LINGUA mined for Fon recording', value: '247 $LINGUA' },
  { type: 'governance', time: '2 min ago', description: 'New vote on LIP-042', value: '+1 vote' },
  { type: 'trade', time: '5 min ago', description: 'Swap 1000 TWI for 420 USDC', value: '420 USDC' },
  { type: 'insurance', time: '8 min ago', description: 'Coverage purchased for Ga language', value: '0.75% premium' },
  { type: 'mining', time: '12 min ago', description: 'Voice NFT #4288 minted', value: 'NFT #4288' },
  { type: 'governance', time: '15 min ago', description: 'LIP-040 executed', value: '500K $LINGUA' }
];

export default function Dashboard() {
  const [selectedView, setSelectedView] = useState('overview');
  const [animatedTVL, setAnimatedTVL] = useState(0);

  useEffect(() => {
    // Animate TVL counter
    const duration = 2000;
    const steps = 60;
    const increment = mockProtocolData.tvl / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= mockProtocolData.tvl) {
        setAnimatedTVL(mockProtocolData.tvl);
        clearInterval(timer);
      } else {
        setAnimatedTVL(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="dashboard-container">
      {/* Protocol Header */}
      <motion.div 
        className="protocol-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="protocol-title">🌍 LinguaDAO Protocol</h1>
        <p className="protocol-subtitle">Decentralized Language Preservation & DeFi</p>
      </motion.div>

      {/* Main Metrics Grid */}
      <motion.div 
        className="metrics-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="metric-card highlight">
          <div className="metric-header">
            <span className="metric-label">Total Value Locked</span>
            <span className="metric-change positive">+{mockProtocolData.volumeChange}%</span>
          </div>
          <div className="metric-value">{formatCurrency(animatedTVL)}</div>
          <div className="metric-detail">Across {languagePools.length} language pools</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">$LINGUA Price</span>
            <span className="metric-change positive">+{mockProtocolData.linguaChange}%</span>
          </div>
          <div className="metric-value">${mockProtocolData.linguaPrice}</div>
          <div className="metric-detail">24h Volume: {formatCurrency(mockProtocolData.dailyVolume)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Staked</span>
          </div>
          <div className="metric-value">{formatNumber(mockProtocolData.totalStaked)}</div>
          <div className="metric-detail">APY: {mockProtocolData.stakingAPY}%</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Voice NFTs</span>
          </div>
          <div className="metric-value">{formatNumber(mockProtocolData.voiceNFTs)}</div>
          <div className="metric-detail">{mockProtocolData.activeGuardians} Active Guardians</div>
        </div>
      </motion.div>

      {/* Language Pools Section */}
      <motion.div 
        className="pools-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="section-header">
          <h2 className="section-title">💧 Language Liquidity Pools</h2>
          <div className="view-toggle">
            <button className="toggle-button active">All Pools</button>
            <button className="toggle-button">My Positions</button>
          </div>
        </div>

        <div className="pools-grid">
          {languagePools.map((pool, index) => (
            <motion.div 
              key={pool.code}
              className="pool-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="pool-info">
                <div className="pool-icon">{pool.flag}</div>
                <div className="pool-details">
                  <h3>{pool.name}</h3>
                  <span className="pool-pair">{pool.code}/USDC</span>
                </div>
              </div>

              <div className="pool-tvl">
                <span className="value">{formatCurrency(pool.tvl)}</span>
                <span className="label">TVL</span>
              </div>

              <div className="pool-apy">
                <span className="value">{pool.apy}%</span>
                <span className="label">APY</span>
              </div>

              <div className="pool-volume">
                <span className="value">{formatCurrency(pool.volume24h)}</span>
                <span className="label">24h Volume</span>
              </div>

              <div className="pool-actions">
                <button className="pool-button">Add</button>
                <button className="pool-button">Swap</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Governance and Leaderboard */}
      <div className="governance-section">
        {/* Proposals */}
        <motion.div 
          className="proposals-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="proposals-header">
            <h2>🗳️ Governance Proposals</h2>
            <button className="new-proposal-button">Create Proposal</button>
          </div>

          <div className="proposal-list">
            {proposals.map((proposal, index) => (
              <motion.div 
                key={proposal.id}
                className="proposal-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="proposal-header-info">
                  <div>
                    <div className="proposal-id">{proposal.id}</div>
                    <div className="proposal-title">{proposal.title}</div>
                  </div>
                  <span className={`proposal-status ${proposal.status}`}>
                    {proposal.status}
                  </span>
                </div>

                <p className="proposal-description">{proposal.description}</p>

                <div className="proposal-voting">
                  <div className="vote-option for">
                    <div className="vote-label">For</div>
                    <div className="vote-count">{formatNumber(proposal.forVotes)}</div>
                    <div className="vote-percentage">
                      {Math.round(proposal.forVotes / (proposal.forVotes + proposal.againstVotes) * 100)}%
                    </div>
                  </div>
                  <div className="vote-option against">
                    <div className="vote-label">Against</div>
                    <div className="vote-count">{formatNumber(proposal.againstVotes)}</div>
                    <div className="vote-percentage">
                      {Math.round(proposal.againstVotes / (proposal.forVotes + proposal.againstVotes) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="proposal-progress">
                  <div 
                    className="progress-for" 
                    style={{ 
                      width: `${proposal.forVotes / (proposal.forVotes + proposal.againstVotes) * 100}%` 
                    }}
                  />
                  <div 
                    className="progress-against" 
                    style={{ 
                      width: `${proposal.againstVotes / (proposal.forVotes + proposal.againstVotes) * 100}%` 
                    }}
                  />
                </div>

                <div className="proposal-footer">
                  <span>Ends: {proposal.endsIn}</span>
                  <span>Quorum: ✅ Met</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guardian Leaderboard */}
        <motion.div 
          className="leaderboard-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="leaderboard-header">
            <h2>⚔️ Top Guardians</h2>
            <p className="leaderboard-subtitle">Language preservation leaders</p>
          </div>

          <div className="guardian-list">
            {topGuardians.map((guardian, index) => (
              <motion.div 
                key={guardian.rank}
                className="guardian-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`guardian-rank ${guardian.rank <= 3 ? `top-${guardian.rank}` : ''}`}>
                  {guardian.rank}
                </div>
                <div className="guardian-info">
                  <div className="guardian-name">{guardian.name}</div>
                  <div className="guardian-tier">{guardian.tier}</div>
                </div>
                <div className="guardian-stats">
                  <div className="guardian-contributions">
                    {formatNumber(guardian.lingua)} $LINGUA
                  </div>
                  <div className="guardian-label">{guardian.contributions} contributions</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insurance Pools */}
      <motion.div 
        className="insurance-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="section-header">
          <h2 className="section-title">🛡️ Language Extinction Insurance</h2>
        </div>

        <div className="insurance-grid">
          {insurancePools.map((pool, index) => (
            <motion.div 
              key={pool.language}
              className={`insurance-card ${pool.status}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="insurance-header">
                <div className="insurance-language">
                  <span className="insurance-flag">{pool.flag}</span>
                  <span className="insurance-name">{pool.language}</span>
                </div>
                <span className={`risk-level ${pool.status}`}>{pool.status}</span>
              </div>

              <div className="insurance-metrics">
                <div className="insurance-metric">
                  <div className="insurance-metric-label">Coverage Pool</div>
                  <div className="insurance-metric-value">{formatCurrency(pool.coverage)}</div>
                </div>
                <div className="insurance-metric">
                  <div className="insurance-metric-label">Speakers</div>
                  <div className="insurance-metric-value">
                    {formatNumber(pool.speakers)}
                    <span style={{ fontSize: '12px', color: '#ef4444', marginLeft: '8px' }}>
                      {pool.trend}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="insurance-payout">
                <div className="payout-label">Max Payout (on trigger)</div>
                <div className="payout-amount">{pool.payout}x Premium</div>
              </div>

              <div className="insurance-actions">
                <button className="insurance-button">
                  Buy Coverage ({pool.premium}%)
                </button>
                <button className="insurance-button claim">
                  Provide Liquidity
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div 
        className="activity-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="activity-header">
          <h2>
            <span className="live-indicator" />
            Live Protocol Activity
          </h2>
        </div>

        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <motion.div 
              key={index}
              className="activity-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <span className="activity-time">{activity.time}</span>
              <div className={`activity-type ${activity.type}`}>
                {activity.type === 'mining' && '⛏️'}
                {activity.type === 'governance' && '🗳️'}
                {activity.type === 'trade' && '💱'}
                {activity.type === 'insurance' && '🛡️'}
              </div>
              <span className="activity-description">{activity.description}</span>
              <span className="activity-value">{activity.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}