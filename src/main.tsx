import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration: any): any => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((e: any): any => {
        console.warn('Service Worker registration failed:', e);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
