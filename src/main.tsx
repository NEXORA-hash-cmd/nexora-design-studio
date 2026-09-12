// Ensure fetch property on window and prototypes is writable and safe across all environments
(function ensureWritableFetch() {
  try {
    if (typeof window === 'undefined') return;
    const rawFetch = window.fetch;
    if (typeof rawFetch !== 'function') return;
    const boundFetch = function(...args: unknown[]) {
      return (rawFetch as (...a: unknown[]) => unknown).apply(window, args);
    };

    const targets: unknown[] = [];
    let p: unknown = window;
    while (p) {
      targets.push(p);
      p = Object.getPrototypeOf(p);
    }
    if (typeof Window !== 'undefined' && Window.prototype && !targets.includes(Window.prototype)) {
      targets.push(Window.prototype);
    }
    if (typeof globalThis !== 'undefined' && !targets.includes(globalThis)) {
      targets.push(globalThis);
    }

    for (const target of targets) {
      if (!target || typeof target !== 'object') continue;
      try {
        const desc = Object.getOwnPropertyDescriptor(target, 'fetch');
        if (desc && (!desc.writable || !desc.set)) {
          try {
            Object.defineProperty(target, 'fetch', {
              value: boundFetch,
              writable: true,
              configurable: true,
              enumerable: true,
            });
          } catch {
            let cur = boundFetch;
            Object.defineProperty(target, 'fetch', {
              get() { return cur; },
              set(fn) { cur = fn; },
              configurable: true,
              enumerable: true,
            });
          }
        }
      } catch {
        // Continue to next target
      }
    }

    try {
      const winDesc = Object.getOwnPropertyDescriptor(window, 'fetch');
      if (!winDesc || !winDesc.writable) {
        Object.defineProperty(window, 'fetch', {
          value: boundFetch,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
    } catch {
      // Non-blocking fallback
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
