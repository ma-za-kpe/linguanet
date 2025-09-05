'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, FiPlay, FiPause, FiShoppingCart, 
  FiCheck, FiDatabase, FiGlobe, FiTrendingUp,
  FiMic, FiUsers, FiDollarSign, FiCode
} from 'react-icons/fi';
import './dashboard.css';

// Realistic mock data for African languages
const mockDatasets = {
  twi: {
    language: 'Twi',
    country: 'Ghana',
    flag: '🇬🇭',
    clips: 2847,
    duration: '23.7 hours',
    contributors: 156,
    quality: 94,
    price: 2847,
    growth: '+18%',
    samples: [
      { id: 1, contributor: 'kofi.linguanet.eth', duration: '32s', quality: 96, text: 'Ɛte sɛn? Mepɛ sɛ mekyerɛ wo Twi kasa' },
      { id: 2, contributor: 'ama.linguanet.eth', duration: '28s', quality: 92, text: 'Akwaaba! Yɛfrɛ me Ama' },
      { id: 3, contributor: 'kwame.linguanet.eth', duration: '30s', quality: 95, text: 'Me papa wɔ Kumasi' },
      { id: 4, contributor: 'abena.linguanet.eth', duration: '35s', quality: 98, text: 'Medaase paa, nana' }
    ]
  },
  swahili: {
    language: 'Swahili',
    country: 'Kenya/Tanzania',
    flag: '🇰🇪',
    clips: 4592,
    duration: '38.3 hours',
    contributors: 287,
    quality: 91,
    price: 4592,
    growth: '+25%',
    samples: [
      { id: 1, contributor: 'juma.linguanet.eth', duration: '30s', quality: 93, text: 'Habari yako? Naitwa Juma' },
      { id: 2, contributor: 'fatuma.linguanet.eth', duration: '27s', quality: 90, text: 'Karibu Tanzania, nchi yetu' },
      { id: 3, contributor: 'hassan.linguanet.eth', duration: '33s', quality: 94, text: 'Ninatoka Dar es Salaam' }
    ]
  },
  yoruba: {
    language: 'Yoruba',
    country: 'Nigeria',
    flag: '🇳🇬',
    clips: 3764,
    duration: '31.4 hours',
    contributors: 412,
    quality: 93,
    price: 3764,
    growth: '+32%',
    samples: [
      { id: 1, contributor: 'tunde.linguanet.eth', duration: '29s', quality: 95, text: 'Ẹ káàárọ̀, ẹ ṣé dáadáa?' },
      { id: 2, contributor: 'folake.linguanet.eth', duration: '31s', quality: 92, text: 'Orúkọ mi ni Folake' },
      { id: 3, contributor: 'segun.linguanet.eth', duration: '34s', quality: 96, text: 'Mo wá láti ìlú Lagos' }
    ]
  },
  hausa: {
    language: 'Hausa',
    country: 'Nigeria/Niger',
    flag: '🇳🇬',
    clips: 2156,
    duration: '18.0 hours',
    contributors: 178,
    quality: 89,
    price: 2156,
    growth: '+22%',
    samples: [
      { id: 1, contributor: 'musa.linguanet.eth', duration: '28s', quality: 88, text: 'Sannu, ina kwana?' },
      { id: 2, contributor: 'amina.linguanet.eth', duration: '30s', quality: 90, text: 'Sunana Amina, daga Kano' }
    ]
  },
  amharic: {
    language: 'Amharic',
    country: 'Ethiopia',
    flag: '🇪🇹',
    clips: 1823,
    duration: '15.2 hours',
    contributors: 134,
    quality: 92,
    price: 1823,
    growth: '+15%',
    samples: [
      { id: 1, contributor: 'tadesse.linguanet.eth', duration: '32s', quality: 93, text: 'ሰላም እንደምን አለህ?' },
      { id: 2, contributor: 'marta.linguanet.eth', duration: '29s', quality: 91, text: 'ከአዲስ አበባ ነኝ' }
    ]
  },
  zulu: {
    language: 'Zulu',
    country: 'South Africa',
    flag: '🇿🇦',
    clips: 2938,
    duration: '24.5 hours',
    contributors: 198,
    quality: 95,
    price: 2938,
    growth: '+28%',
    samples: [
      { id: 1, contributor: 'sipho.linguanet.eth', duration: '31s', quality: 96, text: 'Sawubona, unjani?' },
      { id: 2, contributor: 'nomsa.linguanet.eth', duration: '28s', quality: 94, text: 'Ngiphuma eThekwini' }
    ]
  },
  igbo: {
    language: 'Igbo',
    country: 'Nigeria',
    flag: '🇳🇬',
    clips: 1642,
    duration: '13.7 hours',
    contributors: 89,
    quality: 90,
    price: 1642,
    growth: '+19%',
    samples: [
      { id: 1, contributor: 'chidi.linguanet.eth', duration: '33s', quality: 91, text: 'Nnọọ, kedu ka ị mere?' },
      { id: 2, contributor: 'ngozi.linguanet.eth', duration: '30s', quality: 89, text: 'Aha m bụ Ngozi' }
    ]
  },
  wolof: {
    language: 'Wolof',
    country: 'Senegal',
    flag: '🇸🇳',
    clips: 1287,
    duration: '10.7 hours',
    contributors: 76,
    quality: 88,
    price: 1287,
    growth: '+12%',
    samples: [
      { id: 1, contributor: 'amadou.linguanet.eth', duration: '29s', quality: 87, text: 'Asalaam aleekum, nanga def?' },
      { id: 2, contributor: 'fatou.linguanet.eth', duration: '31s', quality: 89, text: 'Maa ngi fi, jërëjëf' }
    ]
  },
  lingala: {
    language: 'Lingala',
    country: 'DRC/Congo',
    flag: '🇨🇩',
    clips: 976,
    duration: '8.1 hours',
    contributors: 54,
    quality: 86,
    price: 976,
    growth: '+10%',
    samples: [
      { id: 1, contributor: 'jean.linguanet.eth', duration: '30s', quality: 85, text: 'Mbote, sango nini?' },
      { id: 2, contributor: 'marie.linguanet.eth', duration: '28s', quality: 87, text: 'Nkombo na ngai Marie' }
    ]
  },
  luganda: {
    language: 'Luganda',
    country: 'Uganda',
    flag: '🇺🇬',
    clips: 1456,
    duration: '12.1 hours',
    contributors: 92,
    quality: 91,
    price: 1456,
    growth: '+16%',
    samples: [
      { id: 1, contributor: 'kato.linguanet.eth', duration: '32s', quality: 92, text: 'Oli otya? Nze Kato' },
      { id: 2, contributor: 'nakato.linguanet.eth', duration: '29s', quality: 90, text: 'Nva mu Kampala' }
    ]
  },
  shona: {
    language: 'Shona',
    country: 'Zimbabwe',
    flag: '🇿🇼',
    clips: 823,
    duration: '6.9 hours',
    contributors: 43,
    quality: 87,
    price: 823,
    growth: '+14%',
    samples: [
      { id: 1, contributor: 'tendai.linguanet.eth', duration: '30s', quality: 88, text: 'Makadii? Ndiri bho' }
    ]
  },
  tigrinya: {
    language: 'Tigrinya',
    country: 'Eritrea',
    flag: '🇪🇷',
    clips: 658,
    duration: '5.5 hours',
    contributors: 31,
    quality: 85,
    price: 658,
    growth: '+8%',
    samples: []
  }
};

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState('twi');
  const [playingSample, setPlayingSample] = useState<number | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [stats, setStats] = useState({
    totalClips: 0,
    totalContributors: 0,
    totalValue: 0,
    growthRate: 0
  });

  const dataset = mockDatasets[selectedLanguage as keyof typeof mockDatasets];

  useEffect(() => {
    // Calculate stats with animation
    const total = Object.values(mockDatasets).reduce((acc, d) => ({
      clips: acc.clips + d.clips,
      contributors: acc.contributors + d.contributors,
      value: acc.value + d.price
    }), { clips: 0, contributors: 0, value: 0 });

    setStats({
      totalClips: total.clips,
      totalContributors: total.contributors,
      totalValue: total.value,
      growthRate: 127
    });
  }, []);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // Simulate purchase process
    setTimeout(() => {
      setIsPurchasing(false);
      setPurchaseComplete(true);
      setTimeout(() => setPurchaseComplete(false), 3000);
    }, 2000);
  };

  const handlePlaySample = (sampleId: number) => {
    if (playingSample === sampleId) {
      setPlayingSample(null);
    } else {
      setPlayingSample(sampleId);
      // Auto-stop after 3 seconds (demo)
      setTimeout(() => setPlayingSample(null), 3000);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="header-content">
          <div className="logo-section">
            <motion.div 
              className="logo"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🌍
            </motion.div>
            <div>
              <h1>LinguaNet</h1>
              <p>AI Company Dashboard</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <FiDatabase />
              <div>
                <span className="stat-value">{stats.totalClips}</span>
                <span className="stat-label">Total Clips</span>
              </div>
            </div>
            <div className="stat-card">
              <FiUsers />
              <div>
                <span className="stat-value">{stats.totalContributors}</span>
                <span className="stat-label">Contributors</span>
              </div>
            </div>
            <div className="stat-card">
              <FiDollarSign />
              <div>
                <span className="stat-value">${stats.totalValue}</span>
                <span className="stat-label">Dataset Value</span>
              </div>
            </div>
            <div className="stat-card growth">
              <FiTrendingUp />
              <div>
                <span className="stat-value">+{stats.growthRate}%</span>
                <span className="stat-label">This Week</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="dashboard-content">
        {/* Language Selector */}
        <motion.div 
          className="language-selector"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Available Languages</h2>
          <div className="language-grid">
            {Object.entries(mockDatasets).map(([key, data]) => (
              <motion.div
                key={key}
                className={`language-card ${selectedLanguage === key ? 'active' : ''}`}
                onClick={() => setSelectedLanguage(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="language-flag">{data.flag}</div>
                <h3>{data.language}</h3>
                <div className="language-info">
                  <span><FiMic /> {data.clips} clips</span>
                  <span><FiUsers /> {data.contributors}</span>
                </div>
                <div className="quality-bar">
                  <div className="quality-fill" style={{ width: `${data.quality}%` }} />
                </div>
                <div className="language-footer">
                  <span className="language-price">${data.price} USDC</span>
                  <span className="growth-rate">{data.growth}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dataset Details */}
        <motion.div 
          className="dataset-details"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="details-header">
            <h2>{dataset.flag} {dataset.language} Dataset</h2>
            <div className="dataset-badges">
              <span className="badge verified"><FiCheck /> Verified</span>
              <span className="badge native">Native Speakers</span>
              <span className="badge quality">Quality: {dataset.quality}%</span>
            </div>
          </div>

          {/* Dataset Stats */}
          <div className="dataset-stats">
            <div className="stat">
              <FiMic />
              <div>
                <strong>{dataset.clips}</strong>
                <span>Audio Clips</span>
              </div>
            </div>
            <div className="stat">
              <FiGlobe />
              <div>
                <strong>{dataset.duration}</strong>
                <span>Total Duration</span>
              </div>
            </div>
            <div className="stat">
              <FiUsers />
              <div>
                <strong>{dataset.contributors}</strong>
                <span>Contributors</span>
              </div>
            </div>
            <div className="stat">
              <FiDollarSign />
              <div>
                <strong>${dataset.price}</strong>
                <span>USDC Price</span>
              </div>
            </div>
          </div>

          {/* Sample Clips */}
          {dataset.samples.length > 0 && (
            <div className="samples-section">
              <h3>Sample Clips</h3>
              <div className="samples-list">
                {dataset.samples.map((sample) => (
                  <motion.div
                    key={sample.id}
                    className="sample-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sample.id * 0.1 }}
                  >
                    <div className="sample-info">
                      <span className="contributor">{sample.contributor}</span>
                      <span className="duration">{sample.duration}</span>
                      <span className="quality">Quality: {sample.quality}%</span>
                    </div>
                    {sample.text && (
                      <div className="sample-text">"{sample.text}"</div>
                    )}
                    <motion.button
                      className="play-button"
                      onClick={() => handlePlaySample(sample.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {playingSample === sample.id ? (
                        <><FiPause /> Playing...</>
                      ) : (
                        <><FiPlay /> Play</>
                      )}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Section */}
          <div className="purchase-section">
            <div className="purchase-info">
              <h3>Ready to Train Your AI?</h3>
              <p>Get instant access to verified {dataset.language} audio data</p>
              <div className="purchase-features">
                <span><FiCheck /> Filecoin Storage</span>
                <span><FiCheck /> JSON with CIDs</span>
                <span><FiCheck /> API Access</span>
                <span><FiCheck /> Commercial License</span>
              </div>
            </div>
            
            <div className="purchase-action">
              <AnimatePresence mode="wait">
                {!purchaseComplete ? (
                  <motion.button
                    key="purchase"
                    className="purchase-button"
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPurchasing ? (
                      <div className="loading-spinner" />
                    ) : (
                      <>
                        <FiShoppingCart />
                        Purchase Dataset - ${dataset.price} USDC
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.div
                    key="success"
                    className="success-message"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <FiCheck /> Purchase Complete!
                    <button className="download-button">
                      <FiDownload /> Download Dataset
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* API Section */}
          <motion.div 
            className="api-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3><FiCode /> API Access</h3>
            <div className="api-endpoint">
              <code>GET https://api.linguanet.ai/v1/dataset/{selectedLanguage}</code>
              <button className="copy-button">Copy</button>
            </div>
            <div className="api-example">
              <pre>{`{
  "language": "${dataset.language}",
  "clips": ${dataset.clips},
  "files": [
    {
      "cid": "QmX7h3qF4...",
      "contributor": "kofi.linguanet.eth",
      "duration": 32,
      "quality": 96
    }
    ...
  ]
}`}</pre>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Live Activity Feed */}
      <motion.div 
        className="activity-feed"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3>🔴 Live Activity</h3>
        <div className="activity-items">
          <div className="activity-item new">
            <span className="activity-time">Just now</span>
            <span>🇳🇬 New Yoruba clip added by tunde.linguanet.eth</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">2 min ago</span>
            <span>🇬🇭 New Twi clip added by ama.linguanet.eth</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">5 min ago</span>
            <span>✅ Validation completed: 15 Swahili clips approved</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">8 min ago</span>
            <span>🇿🇦 Zulu dataset purchased by Google AI Africa</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">12 min ago</span>
            <span>🇪🇹 25 new Amharic clips from Addis Ababa</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">18 min ago</span>
            <span>💰 $4,592 USDC paid to Swahili contributors</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">25 min ago</span>
            <span>🇸🇳 Wolof validation queue: 45 clips pending</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}