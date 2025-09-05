'use client';

import { DeploymentStatus } from '@/components/DeploymentStatus';

export default function DeployPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0f2e 100%)',
      color: '#ffffff'
    }}>
      <DeploymentStatus />
    </div>
  );
}