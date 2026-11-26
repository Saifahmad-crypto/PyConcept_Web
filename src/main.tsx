import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    (event) => {
      const source = event.filename || '';
      const stack =
        event.error && typeof event.error === 'object' && 'stack' in event.error
          ? String((event.error as {stack?: unknown}).stack || '')
          : '';
      if (
        source.startsWith('chrome-extension://') ||
        source.startsWith('moz-extension://') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://')
      ) {
        event.preventDefault();
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
