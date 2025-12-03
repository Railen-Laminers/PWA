// src/main.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent automatic install prompt
  e.preventDefault();
  // Save event for later use
  deferredPrompt = e;
  // Show install button (we'll control this via context or global state)
  window.dispatchEvent(new Event('pwa-installable'));
});

const InstallPrompt = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (deferredPrompt) setShow(true);
    };
    window.addEventListener('pwa-installable', handler);
    return () => window.removeEventListener('pwa-installable', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    setShow(false);
    deferredPrompt = null;
  };

  if (!show) return null;

  return (
    <div className="pwa-install-banner fixed-bottom bg-success text-white py-2 text-center">
      <span className="me-2">Want to install SportsTask?</span>
      <button
        className="btn btn-light btn-sm me-2"
        onClick={handleInstall}
      >
        Install
      </button>
      <button
        className="btn btn-outline-light btn-sm"
        onClick={() => setShow(false)}
      >
        Cancel
      </button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <InstallPrompt />
    </AuthProvider>
  </React.StrictMode>
);