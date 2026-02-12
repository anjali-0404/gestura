// src/components/Header.tsx
import { useEffect, useState } from 'react';
import apiClient from '../services/api';
import '../styles/Header.css';

export const Header = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiClient.checkHealth();
        setIsHealthy(true);
      } catch {
        setIsHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">🤝 URable</h1>
          <p className="app-subtitle">Sign Language Detection with AI</p>
        </div>

        <div className="status-indicator">
          {isHealthy === null && <span className="status-dot" data-status="checking">Connecting...</span>}
          {isHealthy === true && <span className="status-dot" data-status="healthy">✓ Backend Connected</span>}
          {isHealthy === false && <span className="status-dot" data-status="error">✕ Backend Offline</span>}
        </div>
      </div>
    </header>
  );
};
