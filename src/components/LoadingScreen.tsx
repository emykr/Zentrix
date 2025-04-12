import React, { useState, useEffect } from 'react';
import { t } from '@utils/LangLoader';
import LoadingManager from '@handler/LoadingManager';

interface LoadingScreenProps {
  error?: Error;
  onContinue?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ error, onContinue }) => {
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    progress: 0,
    message: ''
  });

  useEffect(() => {
    const unsubscribe = LoadingManager.getInstance().subscribe(setLoadingState);
    return () => unsubscribe();
  }, []);

  const handleContinue = () => {
    onContinue?.();
    setShowContinueDialog(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
      {error ? (
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">{t('error.initialization')}</p>
          <p className="text-sm opacity-75">{error.message}</p>
          <button
            onClick={() => setShowContinueDialog(true)}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
          >
            {t('button.continue')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white" />
          <div className="w-64 text-center">
            <div className="h-2 bg-slate-700 rounded-full mb-4">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${loadingState.progress}%` }}
              />
            </div>
            <p className="text-white text-xl font-medium mb-2">{loadingState.message}</p>
            <p className="text-white/70 text-sm">{Math.round(loadingState.progress)}%</p>
          </div>
        </div>
      )}

      {showContinueDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <p className="text-white mb-4">{t('common.continuePrompt')}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowContinueDialog(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                {t('button.close')}
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                {t('button.continue')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};