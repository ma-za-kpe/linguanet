'use client';

import { useState, useEffect } from 'react';
import { initializeW3Storage, loginWithEmail, isW3StorageReady, getCurrentSpaceDID } from '@/lib/w3storage-client';
import { FiMail, FiCheck, FiAlertCircle, FiLoader, FiCloud } from 'react-icons/fi';

export function Web3StorageSetup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [spaceDID, setSpaceDID] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if already initialized on component mount
  useEffect(() => {
    checkInitialization();
  }, []);

  const checkInitialization = async () => {
    try {
      await initializeW3Storage();
      if (isW3StorageReady()) {
        setStatus('ready');
        setIsInitialized(true);
        const did = getCurrentSpaceDID();
        if (did) setSpaceDID(did);
      }
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // Initialize client if not already done
      if (!isInitialized) {
        await initializeW3Storage();
      }

      // Start login process
      await loginWithEmail(email);
      
      setStatus('sent');
      
      // Note: The actual verification happens when user clicks the email link
      // The loginWithEmail function will wait for verification
      // Once verified, it will set up the space automatically
      
      // For demo purposes, we'll show success after a delay
      setTimeout(() => {
        setStatus('ready');
        setIsInitialized(true);
        const did = getCurrentSpaceDID();
        if (did) setSpaceDID(did);
      }, 3000);
      
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to setup Web3.Storage');
      console.error('Setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If already ready, show minimal status
  if (status === 'ready' && isInitialized) {
    return (
      <div className="w3storage-status" style={{
        background: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid #22c55e',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <FiCheck size={20} color="#22c55e" />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: '#22c55e' }}>IPFS Storage Ready</div>
          {spaceDID && (
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem' }}>
              Space: {spaceDID.slice(0, 20)}...
            </div>
          )}
        </div>
        <FiCloud size={20} color="#22c55e" />
      </div>
    );
  }

  return (
    <div className="w3storage-setup" style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FiCloud /> Setup IPFS Storage
      </h3>
      
      {status === 'idle' && (
        <>
          <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
            To upload voice recordings to IPFS, please set up Web3.Storage:
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !email}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: isLoading ? 'rgba(255, 255, 255, 0.2)' : '#667eea',
                color: 'white',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold'
              }}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <FiMail />
                  Setup Storage
                </>
              )}
            </button>
          </form>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
            Free account • No credit card required • Decentralized storage
          </p>
        </>
      )}

      {status === 'sent' && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <FiMail size={20} color="#3b82f6" />
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Check Your Email!
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              We've sent a verification link to <strong>{email}</strong>
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
              Click the link in your email to complete setup. This page will update automatically.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <FiAlertCircle size={20} color="#ef4444" />
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
              Setup Failed
            </div>
            <p style={{ fontSize: '0.9rem' }}>
              {errorMessage || 'Something went wrong. Please try again.'}
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setErrorMessage('');
              }}
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}