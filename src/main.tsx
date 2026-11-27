import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

// PWA auto-update service worker registration
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

if (typeof window !== 'undefined') {
  const isExtensionOrigin = (text: string) =>
    text.includes('chrome-extension://') || text.includes('moz-extension://');

  window.addEventListener(
    'error',
    (event) => {
      const source = event.filename || '';
      const stack =
        event.error && typeof event.error === 'object' && 'stack' in event.error
          ? String((event.error as {stack?: unknown}).stack || '')
          : '';
      if (isExtensionOrigin(source) || isExtensionOrigin(stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event.reason;
      const stack =
        reason && typeof reason === 'object' && 'stack' in reason
          ? String((reason as {stack?: unknown}).stack || '')
          : String(reason || '');
      if (isExtensionOrigin(stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
