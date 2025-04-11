import React from 'react';
import { keyboardManager, type KeyCommand } from '@utils/KeyboardManager';

interface ContextMenuItem {
  id: string;
  label?: string;
  icon?: string;
  shortcut?: string;
  onClick?: () => void;
  divider?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  x: number;
  y: number;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  x,
  y,
  onClose
}) => {
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.context-menu')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="context-menu fixed bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/10 py-1 min-w-[200px]"
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {item.divider && index > 0 && (
            <div className="border-t border-white/10 my-1" />
          )}
          <button
            className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 flex items-center justify-between group"
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            <span className="flex items-center gap-2">
              {item.icon && (
                <span
                  className="w-4 h-4 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                />
              )}
              {item.label}
            </span>
            {item.shortcut && (
              <span className="text-white/50 group-hover:text-white/70 text-sm">
                {item.shortcut}
              </span>
            )}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};