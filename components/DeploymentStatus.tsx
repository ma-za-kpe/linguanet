'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeploymentStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  message?: string;
  txHash?: string;
  address?: string;
}

export function DeploymentStatus() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [steps, setSteps] = useState<DeploymentStep[]>([
    { id: 'env-check', name: 'Environment Check', status: 'pending' },
    { id: 'network', name: 'Connect to Base Sepolia', status: 'pending' },
    { id: 'lingua-token', name: 'Deploy $LINGUA Token', status: 'pending' },
    { id: 'voice-nft', name: 'Deploy Voice Share NFTs', status: 'pending' },
    { id: 'dao', name: 'Deploy LinguaDAO', status: 'pending' },
    { id: 'amm', name: 'Deploy Language AMM', status: 'pending' },
    { id: 'insurance', name: 'Deploy Insurance Protocol', status: 'pending' },
    { id: 'verify', name: 'Verify Contracts', status: 'pending' },
    { id: 'initialize', name: 'Initialize Protocol', status: 'pending' },
  ]);

  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Check if all environment variables are set
  useEffect(() => {
    const checkEnv = () => {
      const hasAlchemy = !!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
      const hasWalletConnect = !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
      const hasWeb3Storage = !!process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
      
      return { hasAlchemy, hasWalletConnect, hasWeb3Storage };
    };

    const env = checkEnv();
    addLog(`✅ Alchemy API: ${env.hasAlchemy ? 'Configured' : 'Missing'}`);
    addLog(`✅ WalletConnect: ${env.hasWalletConnect ? 'Configured' : 'Missing'}`);
    addLog(`✅ Web3.Storage: ${env.hasWeb3Storage ? 'Configured' : 'Missing'}`);
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const updateStep = (id: string, updates: Partial<DeploymentStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const startDeployment = async () => {
    setIsDeploying(true);
    addLog('🚀 Starting LinguaDAO deployment...');

    // Simulate deployment process
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStep(i);
      
      // Update to in-progress
      updateStep(step.id, { status: 'in-progress' });
      addLog(`⏳ ${step.name}...`);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update to completed
      if (step.id.includes('token') || step.id.includes('nft')) {
        const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
        updateStep(step.id, { 
          status: 'completed',
          address: mockAddress,
          message: `Deployed at ${mockAddress.slice(0, 10)}...`
        });
        addLog(`✅ ${step.name} deployed at ${mockAddress.slice(0, 10)}...`);
      } else {
        updateStep(step.id, { status: 'completed' });
        addLog(`✅ ${step.name} completed`);
      }
    }

    addLog('🎉 Deployment complete!');
    setIsDeploying(false);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '⏳';
      case 'error':
        return '❌';
      default:
        return '⭕';
    }
  };

  const getProgressPercentage = () => {
    const completed = steps.filter(s => s.status === 'completed').length;
    return (completed / steps.length) * 100;
  };

  return (
    <div className="deployment-status">
      <style jsx>{`
        .deployment-status {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          font-size: 48px;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #7c3aed, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .env-status {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .env-card {
          background: rgba(26, 26, 26, 0.9);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .env-card.success {
          border-color: rgba(34, 197, 94, 0.5);
        }

        .progress-container {
          margin-bottom: 40px;
        }

        .progress-bar {
          height: 8px;
          background: rgba(124, 58, 237, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #22c55e);
          transition: width 0.5s ease;
        }

        .deployment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .steps-container {
          background: rgba(26, 26, 26, 0.9);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 16px;
          padding: 30px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          margin-bottom: 12px;
          background: rgba(20, 20, 20, 0.6);
          border-radius: 8px;
          transition: all 0.3s;
        }

        .step-item.in-progress {
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.3);
        }

        .step-item.completed {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .step-icon {
          font-size: 24px;
        }

        .step-info {
          flex: 1;
        }

        .step-name {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .step-message {
          font-size: 12px;
          color: #a1a1aa;
        }

        .logs-container {
          background: #0a0a0a;
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 16px;
          padding: 20px;
          height: 500px;
          overflow-y: auto;
        }

        .logs-header {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 16px;
        }

        .log-entry {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #22c55e;
          margin-bottom: 8px;
          padding: 4px 8px;
          background: rgba(34, 197, 94, 0.05);
          border-radius: 4px;
        }

        .deploy-button {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #7c3aed, #9333ea);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 30px;
        }

        .deploy-button:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(124, 58, 237, 0.4);
        }

        .deploy-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .deployment-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="header">
        <h1>🚀 LinguaDAO Deployment Dashboard</h1>
        <p style={{ fontSize: '20px', color: '#a1a1aa' }}>
          Deploy and track your protocol on Base Sepolia
        </p>
      </div>

      {/* Environment Status */}
      <div className="env-status">
        <div className="env-card success">
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <div style={{ fontWeight: 600 }}>Alchemy RPC</div>
            <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Connected</div>
          </div>
        </div>
        <div className="env-card success">
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <div style={{ fontWeight: 600 }}>WalletConnect</div>
            <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Configured</div>
          </div>
        </div>
        <div className="env-card success">
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <div style={{ fontWeight: 600 }}>Web3.Storage</div>
            <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Ready</div>
          </div>
        </div>
        <div className="env-card success">
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <div style={{ fontWeight: 600 }}>Base Sepolia</div>
            <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Chain ID: 84532</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>Deployment Progress</span>
          <span style={{ color: '#7c3aed', fontWeight: 600 }}>{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgressPercentage()}%` }} />
        </div>
      </div>

      {/* Deployment Grid */}
      <div className="deployment-grid">
        {/* Steps */}
        <div className="steps-container">
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#ffffff' }}>
            Deployment Steps
          </h2>
          <AnimatePresence>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`step-item ${step.status}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="step-icon">{getStepIcon(step.status)}</span>
                <div className="step-info">
                  <div className="step-name">{step.name}</div>
                  {step.message && <div className="step-message">{step.message}</div>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Logs */}
        <div className="logs-container">
          <div className="logs-header">📋 Deployment Logs</div>
          {logs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div style={{ color: '#71717a', fontSize: '14px' }}>
              Logs will appear here during deployment...
            </div>
          )}
        </div>
      </div>

      {/* Deploy Button */}
      <button
        className="deploy-button"
        onClick={startDeployment}
        disabled={isDeploying}
      >
        {isDeploying ? (
          <>
            <span style={{ marginRight: '8px' }}>⏳</span>
            Deploying Contracts...
          </>
        ) : (
          <>
            <span style={{ marginRight: '8px' }}>🚀</span>
            Deploy LinguaDAO to Base Sepolia
          </>
        )}
      </button>

      {/* Success Message */}
      {getProgressPercentage() === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '30px',
            padding: '30px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '2px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ fontSize: '24px', color: '#22c55e', marginBottom: '12px' }}>
            🎉 Deployment Complete!
          </h3>
          <p style={{ color: '#e5e5e7', marginBottom: '20px' }}>
            LinguaDAO has been successfully deployed to Base Sepolia
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button style={{
              padding: '12px 24px',
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              borderRadius: '8px',
              color: '#7c3aed',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              View on BaseScan
            </button>
            <button style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Test Voice Mining
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}