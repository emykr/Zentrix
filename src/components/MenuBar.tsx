import React, { useState } from 'react';

interface MenuItem {
  label: string;
  onClick?: () => void;
  items?: MenuItem[];
}

interface MenuBarProps {
  onNew?: () => void;
  onOpen?: () => void;
  onSave?: () => void;
  onExport?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  onNew,
  onOpen,
  onSave,
  onExport
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus: Record<string, MenuItem[]> = {
    '파일': [
      { label: '새로 만들기', onClick: onNew },
      { label: '열기...', onClick: onOpen },
      { label: '저장', onClick: onSave },
      { label: '내보내기...', onClick: onExport }
    ],
    '편집': [
      { label: '실행 취소' },
      { label: '다시 실행' },
      { label: '잘라내기' },
      { label: '복사' },
      { label: '붙여넣기' }
    ],
    '보기': [
      { label: '확대' },
      { label: '축소' },
      { label: '화면에 맞추기' },
      { label: '실제 크기' }
    ],
    '도움말': [
      { label: '단축키 안내' },
      { label: '버전 정보' }
    ]
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    item.onClick?.();
    setActiveMenu(null);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white z-50">
      <div className="flex items-center h-8">
        {Object.entries(menus).map(([menuName, items]) => (
          <div 
            key={menuName} 
            className="relative"
            onMouseEnter={() => setActiveMenu(menuName)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button
              className={`px-4 h-full text-sm hover:bg-gray-700 focus:outline-none whitespace-nowrap ${
                activeMenu === menuName ? 'bg-gray-700' : ''
              }`}
              onClick={() => handleMenuClick(menuName)}
            >
              {menuName}
            </button>
            {activeMenu === menuName && (
              <div className="absolute left-0 top-full bg-gray-800 min-w-[200px] shadow-lg border border-gray-700 rounded-b overflow-hidden">
                {items.map((item, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleMenuItemClick(item)}
                    disabled={!item.onClick}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;