import React from 'react';
import { keyboardManager } from '@utils/KeyboardManager';

interface KeyboardShortcutsProps {
  shortcuts: Array<{
    key: string;
    description: string;
    category?: string;
  }>;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ shortcuts }) => {
  const commands = keyboardManager.getRegisteredCommands();

  return (
    <div className="keyboard-shortcuts-panel">
      <h3 className="panel-title">단축키 목록</h3>
      <div className="shortcuts-grid">
        {commands.map(command => (
          <div key={command.key} className="shortcut-item">
            <span className="shortcut-key">
              {[
                command.ctrl && 'Ctrl',
                command.shift && 'Shift',
                command.alt && 'Alt',
                command.key.toUpperCase()
              ]
                .filter(Boolean)
                .join('+')}
            </span>
            <span className="shortcut-description">{command.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyboardShortcuts;