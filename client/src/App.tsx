import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { CameraDetection } from './components/CameraDetection';
import './App.css';

type TabType = 'upload' | 'camera';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  return (
    <div className="app-wrapper">
      <Header />

      <main className="main-content">
        <div className="container">
          <div className="tabs-navigation">
            <button
              className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <span className="tab-icon">📁</span>
              Upload File
            </button>
            <button
              className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
              onClick={() => setActiveTab('camera')}
            >
              <span className="tab-icon">📹</span>
              Live Camera
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'upload' && <FileUpload />}
            {activeTab === 'camera' && <CameraDetection />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

