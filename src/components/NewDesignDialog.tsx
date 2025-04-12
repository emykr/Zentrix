import React, { useState } from 'react';
import { t } from '@utils/LangLoader';

interface NewDesignDialogProps {
  onConfirm: (title: string) => void;
  onCancel: () => void;
}

export const NewDesignDialog: React.FC<NewDesignDialogProps> = ({ onConfirm, onCancel }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onConfirm(title.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t('dialog.newDesign.title')}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 mb-4"
            placeholder={t('dialog.newDesign.enterTitle')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-white/70 hover:text-white"
            >
              {t('dialog.newDesign.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              disabled={!title.trim()}
            >
              {t('dialog.newDesign.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};