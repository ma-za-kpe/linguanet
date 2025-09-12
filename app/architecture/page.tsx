'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FiDatabase, 
  FiShield, 
  FiLayers, 
  FiGlobe,
  FiLock,
  FiActivity,
  FiServer,
  FiCheck,
  FiArrowRight,
  FiZap
} from 'react-icons/fi';

export default function SystemArchitecture() {
  const [activeLayer, setActiveLayer] = useState<'web2' | 'consensus' | 'web3' | null>(null);

  const layers = [
    {
      id: 'web2',
      name: 'Web2 Staging Layer',
      color: '#22c55e',
      icon: <FiGlobe />,
      description: 'Traditional infrastructure for onboarding and initial validation',
      components: [
        { name: 'Mobile Apps', desc: 'React Native recording interface' },
        { name: 'WhisperAI Validation', desc: 'Initial audio quality check' },
        { name: 'Temporary Storage', desc: 'AWS S3 / Cloud staging' },
        { name: 'Mobile Money API', desc: 'M-PESA, MTN integration' }
      ]
    },
    {
      id: 'consensus',
      name: 'Consensus Layer',
      color: '#7c3aed',
      icon: <FiShield />,
      description: 'Proof of Voice validation and community consensus',
      components: [
        { name: 'Proof of Voice', desc: 'Novel consensus mechanism' },
        { name: 'Community Validation', desc: '3-of-5 speaker verification' },
        { name: 'Quality Scoring', desc: 'AI + human hybrid validation' },
        { name: 'Reward Distribution', desc: 'Smart contract automation' }
      ]
    },
    {
      id: 'web3',
      name: 'Web3 Permanent Layer',
      color: '#3b82f6',
      icon: <FiDatabase />,
      description: 'Immutable blockchain storage and tokenization',
      components: [
        { name: 'IPFS Storage', desc: 'Permanent decentralized storage' },
        { name: 'Voice NFT Minting', desc: 'ERC-721 ownership tokens' },
        { name: 'Base L2 Contracts', desc: 'Low-cost Ethereum scaling' },
        { name: '$LINGUA Distribution', desc: 'ERC-20 reward tokens' }
      ]
    }
  ];

  const techStack = [
    { category: 'Blockchain', items: ['Base L2', 'Ethereum', 'Solidity', 'Hardhat'] },
    { category: 'Storage', items: ['IPFS', 'Web3.Storage', 'Filecoin', 'AWS S3'] },
    { category: 'Frontend', items: ['Next.js 14', 'React', 'TypeScript', 'TailwindCSS'] },
    { category: 'AI/ML', items: ['OpenAI Whisper', 'TensorFlow', 'Python', 'FastAPI'] },
    { category: 'Infrastructure', items: ['Vercel', 'Docker', 'GitHub Actions', 'Grafana'] },
    { category: 'Web3', items: ['Wagmi', 'Viem', 'RainbowKit', 'Ethers.js'] }
  ];

  const dataFlow = [
    { step: 1, title: 'Record', desc: 'User records voice in native language' },
    { step: 2, title: 'Validate', desc: 'AI checks quality, community verifies' },
    { step: 3, title: 'Consensus', desc: 'Proof of Voice reaches agreement' },
    { step: 4, title: 'Mint', desc: 'Voice NFT created with metadata' },
    { step: 5, title: 'Store', desc: 'Audio permanently stored on IPFS' },
    { step: 6, title: 'Reward', desc: '$LINGUA tokens distributed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a0f2e] to-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-500 rounded-full" />
              <span className="text-2xl font-bold text-white">LinguaDAO</span>
            </Link>
            <nav className="flex gap-8">
              <Link href="/contribute" className="text-gray-300 hover:text-white transition">
                Contribute
              </Link>
              <Link href="/gallery" className="text-gray-300 hover:text-white transition">
                Gallery
              </Link>
              <Link href="/pitch" className="text-gray-300 hover:text-white transition">
                Pitch Deck
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-white">System </span>
            <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Architecture
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            A revolutionary 3-tier architecture bridging Web2 accessibility with Web3 permanence,
            powered by our novel Proof of Voice consensus mechanism.
          </motion.p>
        </div>
      </div>

      {/* 3-Tier Architecture Visualization */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            3-Tier Validation Architecture
          </h2>
          
          <div className="relative">
            {/* Layer Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {layers.map((layer, index) => (
                <motion.div
                  key={layer.id}
                  className={`relative group cursor-pointer ${
                    activeLayer === layer.id ? 'z-10' : ''
                  }`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id as 'web2' | 'consensus' | 'web3')}
                >
                  <div className={`
                    bg-black/50 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300
                    ${activeLayer === layer.id 
                      ? `border-[${layer.color}] shadow-2xl scale-105` 
                      : 'border-white/10 hover:border-white/30'
                    }
                  `}>
                    {/* Layer Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
                      >
                        {layer.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{layer.name}</h3>
                        <p className="text-sm text-gray-400">Layer {index + 1}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-6">{layer.description}</p>

                    {/* Components */}
                    <AnimatePresence>
                      {(activeLayer === layer.id || !activeLayer) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3"
                        >
                          {layer.components.map((comp, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <FiCheck className="text-green-400 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-white font-medium">{comp.name}</p>
                                <p className="text-gray-400 text-sm">{comp.desc}</p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Connection Lines */}
                  {index < layers.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-white/20 to-white/10 z-0" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Flow Arrows */}
            <div className="hidden md:flex justify-center mt-8 gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <span>User Input</span>
                <FiArrowRight />
                <span className="text-green-400">Web2</span>
                <FiArrowRight />
                <span className="text-purple-400">Consensus</span>
                <FiArrowRight />
                <span className="text-blue-400">Web3</span>
                <FiArrowRight />
                <span>Permanent Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow Process */}
      <div className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Data Flow Process
          </h2>
          
          <div className="grid md:grid-cols-6 gap-4">
            {dataFlow.map((item, index) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-br from-purple-600/20 to-green-600/20 rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-500 rounded-full flex items-center justify-center text-white font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                {index < dataFlow.length - 1 && (
                  <FiArrowRight className="hidden md:block absolute top-1/2 -right-2 text-white/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Technology Stack
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {techStack.map((category, index) => (
              <motion.div
                key={category.category}
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FiLayers className="text-purple-400" />
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-green-600/20 rounded-full text-sm text-white border border-white/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-20 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Architectural Advantages
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <FiZap />, title: 'Lightning Fast', desc: 'Sub-second validation with AI pre-processing' },
              { icon: <FiLock />, title: 'Secure', desc: 'Multi-layer encryption and blockchain immutability' },
              { icon: <FiActivity />, title: 'Scalable', desc: 'Handles 100K+ concurrent recordings' },
              { icon: <FiServer />, title: 'Resilient', desc: '99.9% uptime with redundant infrastructure' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-gray-300 mb-8">
            Join us in creating the most advanced language preservation infrastructure ever built.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contribute"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-green-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Start Contributing
            </Link>
            <Link
              href="https://github.com/linguadao"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}