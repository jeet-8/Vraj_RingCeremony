import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Service Worker Registration for PWA caching & instant updates
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        // Check for worker updates on load
        registration.update().catch(() => {});
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });

    // Auto-reload smoothly when a newly activated worker claims control
    let isRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!isRefreshing) {
        isRefreshing = true;
        window.location.reload();
      }
    });
  });
}

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement._reactRoot) {
    const root = ReactDOM.createRoot(rootElement);
    rootElement._reactRoot = root;
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

// Ensure Devanagari & Latin web fonts are loaded before first paint to prevent font flash
if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
  Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]).then(renderApp);
} else {
  renderApp();
}
