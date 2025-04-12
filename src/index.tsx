import React from 'react';
import { createRoot } from 'react-dom/client';
import { InitProvider } from '@core/InitializationContext';
import Zentrix from '@pages/Zentrix';
import '@styles/ui.css';

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <InitProvider>
        <div className="zentrix-scrollbar w-full h-full">
          <Zentrix />
        </div>
      </InitProvider>
    </React.StrictMode>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

// root element에 기본 스타일 적용
container.classList.add('w-full', 'h-full', 'zentrix-scrollbar');

const root = createRoot(container);
root.render(<App />);