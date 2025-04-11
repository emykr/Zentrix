import React, { useState } from 'react';
import { t } from '@utils/LangLoader';

interface LoadingScreenProps {
  error?: Error;
  onContinue?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ error, onContinue }) => {
  const [showContinueDialog, setShowContinueDialog] = useState(false);

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
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4" />
          <p className="text-xl">{t('common.loading')}</p>
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