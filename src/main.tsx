import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

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
