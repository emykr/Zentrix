import React from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage } from '@pages/ExamplePage';
import { InitProvider } from '@core/InitializationContext';
import '@styles/ui.css';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <InitProvider>
        <ExamplePage />
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