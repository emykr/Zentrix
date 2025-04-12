import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { InitProvider } from '@core/InitializationContext';
import '@styles/ui.css';

const Zentrix = React.lazy(() => import('@pages/Zentrix'));

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <InitProvider>
        <Suspense fallback={<div className="loading">로딩 중...</div>}>
          <Zentrix />
        </Suspense>
      </InitProvider>
    </React.StrictMode>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container);
root.render(<App />);