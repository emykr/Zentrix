import React from 'react';
import { t } from '@utils/LangLoader';

interface LoadingScreenProps {
  error?: Error;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ error }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
      {error ? (
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">{t('error.initialization')}</p>
          <p className="text-sm opacity-75">{error.message}</p>
        </div>
      ) : (
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4" />
          <p className="text-xl">{t('common.loading')}</p>
        </div>
      )}
    </div>
  );
};