'use client';

import { useState, useEffect, useRef } from 'react';
import { initializeW3Storage, loginWithEmail, isW3StorageReady, getCurrentSpaceDID, checkVerificationStatus } from '@/lib/w3storage-client';
import { FiMail, FiCheck, FiAlertCircle, FiLoader, FiCloud } from 'react-icons/fi';

export function Web3StorageSetup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [spaceDID, setSpaceDID] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const verificationCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Check if already initialized on component mount
  useEffect(() => {
    checkInitialization();
    
    // Cleanup interval on unmount
    return () => {
      if (verificationCheckInterval.current) {
        clearInterval(verificationCheckInterval.current);
      }
    };
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

  // Start checking for verification completion
  const startVerificationCheck = () => {
    // Check every 2 seconds if user has completed verification
    verificationCheckInterval.current = setInterval(async () => {
      const isVerified = await checkVerificationStatus();
      if (isVerified) {
        console.log('[UI] Verification complete!');
        setStatus('ready');
        setIsInitialized(true);
        const did = getCurrentSpaceDID();
        if (did) setSpaceDID(did);
        
        // Stop checking
        if (verificationCheckInterval.current) {
          clearInterval(verificationCheckInterval.current);
          verificationCheckInterval.current = null;
        }
      }
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    console.log('[UI] Starting Web3.Storage setup with email:', email);
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // Initialize client if not already done
      if (!isInitialized) {
        console.log('[UI] Initializing W3Storage client...');
        await initializeW3Storage();
      }

      // Start login process
      console.log('[UI] Calling loginWithEmail...');
      
      // Call login - it will send the email and return immediately
      await loginWithEmail(email);
      
      // Immediately show the email sent message and stop loading
      console.log('[UI] Email sent successfully');
      setIsLoading(false);  // Stop loading immediately
      setStatus('sent');     // Show check email message
      
      // Start checking for verification completion
      startVerificationCheck();
      
    } catch (error: any) {
      console.error('[UI] Setup error:', error);
      setIsLoading(false);
      setErrorMessage(error.message || 'Failed to send verification email');
      setStatus('error');
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
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#3b82f6' }}>
              ✅ Check Your Email!
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              We've sent a verification email to: <strong>{email}</strong>
            </p>
            <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              Please click the link in your email to complete Web3.Storage setup.
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginTop: '0.75rem',
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px'
            }}>
              <FiLoader className="animate-spin" size={16} color="#3b82f6" />
              <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0 }}>
                Checking verification status... (this will update automatically)
              </p>
            </div>
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