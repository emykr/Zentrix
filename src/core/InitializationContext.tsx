import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from './init';

interface InitContextType {
  status: InitializationStatus;
  reinitialize: () => Promise<void>;
}

const InitContext = createContext<InitContextType | null>(null);

export const useInit = () => {
  const context = useContext(InitContext);
  if (!context) {
    throw new Error('useInit must be used within an InitProvider');
  }
  return context;
};

export const InitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<InitializationStatus>({
    isInitialized: false
  });

  const initialize = async () => {
    const result = await initializeApp();
    setStatus(result);
  };

  const reinitialize = async () => {
    setStatus({ isInitialized: false });
    await initialize();
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <InitContext.Provider value={{ status, reinitialize }}>
      {children}
    </InitContext.Provider>
  );
};