'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Web3 components
const ContributeClient = dynamic(() => import('./ContributeClient'), {
  ssr: false,
  loading: () => <div style={{ padding: '50px', textAlign: 'center' }}>Loading Web3...</div>
});

export default function Contribute() {
  return <ContributeClient />;
}