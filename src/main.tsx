import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration: any): any => {
        console.info('Service Worker registered with scope:', registration.scope);
      })
      .catch((error: any): any => {
        console.warn('Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore error TS2345
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
