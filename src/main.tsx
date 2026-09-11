// Ensure fetch property on window has both getter and setter across all environments
(function ensureWritableFetch() {
  try {
    if (typeof window !== 'undefined') {
      const targets = [window, typeof Window !== 'undefined' ? Window.prototype : null, typeof globalThis !== 'undefined' ? globalThis : null];
      for (const target of targets) {
        if (!target) continue;
        const desc = Object.getOwnPropertyDescriptor(target, 'fetch');
        if (!desc || (!desc.set && !desc.writable)) {
          let currentFetch = target.fetch;
          Object.defineProperty(target, 'fetch', {
            get() { return currentFetch; },
            set(fn) { currentFetch = fn; },
            configurable: true,
            enumerable: true,
          });
        }
      }
    }
  } catch {
    // Non-blocking fallback
  }
})();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
