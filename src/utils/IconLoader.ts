interface IconData {
  id: string;
  title: string;
  svg: string;
  category: 'shape' | 'component' | 'layout' | 'tool';
  shortcut?: string;
}

export const icons: IconData[] = [
  // 도형 카테고리
  {
    id: 'rectangle',
    title: '사각형',
    category: 'shape',
    shortcut: 'R',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2"/>
    </svg>`
  },
  {
    id: 'circle',
    title: '원',
    category: 'shape',
    shortcut: 'C',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    </svg>`
  },
  {
    id: 'triangle',
    title: '삼각형',
    category: 'shape',
    shortcut: 'T',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L22 21H2L12 3Z" stroke="currentColor" strokeWidth="2"/>
    </svg>`
  },

  // 도구 카테고리 - key를 unique하게 설정
  {
    id: 'select-tool',  // unique id로 변경
    title: '선택',
    category: 'tool',
    shortcut: 'V',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 3L10 21L12 14L19 12L3 3Z" stroke="currentColor" strokeWidth="2"/>
    </svg>`
  },
  {
    id: 'move-tool',  // unique id로 변경
    title: '이동',
    category: 'tool',
    shortcut: 'M',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3V21M3 12H21M7 7L12 2L17 7M17 17L12 22L7 17" stroke="currentColor" strokeWidth="2"/>
    </svg>`
  },
  {
    id: 'rotate-tool',  // unique id로 변경
    title: '회전',
    category: 'tool',
    shortcut: 'R',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 4C7.58172 4 4 7.58172 4 12H2L5 15L8 12H6C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18V20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" fill="currentColor"/>
    </svg>`
  },

  // 레이아웃 카테고리
  {
    id: 'grid-layout',
    title: '그리드 레이아웃',
    category: 'layout',
    shortcut: 'G',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zm-12 6h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm-12 6h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" stroke="currentColor" strokeWidth="2"/>
    </svg>`
  },
  {
    id: 'flex-layout',
    title: '플렉스 레이아웃',
    category: 'layout',
    shortcut: 'F',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 5h18M3 12h18M3 19h18" stroke="currentColor" strokeWidth="2"/>
    </svg>`
  }
];

export const getIconsByCategory = (category: IconData['category']): IconData[] => {
  return icons.filter(icon => icon.category === category);
};

export const getIconById = (id: string): IconData | undefined => {
  return icons.find(icon => icon.id === id);
};