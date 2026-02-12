// src/components/Footer.tsx
import '../styles/Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>🤝 URable - Sign Language Detection using AI</p>
        <p className="footer-subtitle">Powered by TensorFlow & React</p>
        <p className="footer-link">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </p>
      </div>
    </footer>
  );
};
