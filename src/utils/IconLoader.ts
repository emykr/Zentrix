interface IconData {
  id: string;
  title: string;
  svg: string;
  category: 'basic' | 'shape' | 'text' | 'cursor';
}

export const icons: IconData[] = [
  // 기본 도구 (cursor)
  {
    id: 'select',
    title: '선택',
    category: 'cursor',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 3L10 21L12 14L19 12L3 3Z"/>
    </svg>`
  },
  {
    id: 'hand',
    title: '손',
    category: 'cursor',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3v8m0 0l-4-4m4 4l4-4m-4 4v8"/>
    </svg>`
  },

  // 도형
  {
    id: 'shape',
    title: '도형',
    category: 'basic',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"/>
      <circle cx="17.5" cy="6.5" r="3.5"/>
      <path d="M12 21L17 14H7L12 21Z"/>
    </svg>`
  },

  // 텍스트
  {
    id: 'text',
    title: '텍스트',
    category: 'basic',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 7h16M12 7v10M7 20h10"/>
    </svg>`
  },

  // 도형 종류
  {
    id: 'rectangle',
    title: '사각형',
    category: 'shape',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18"/>
    </svg>`
  },
  {
    id: 'circle',
    title: '원',
    category: 'shape',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="9"/>
    </svg>`
  },
  {
    id: 'triangle',
    title: '삼각형',
    category: 'shape',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 3L22 21H2L12 3Z"/>
    </svg>`
  }
];

export const getIconsByCategory = (category: IconData['category']): IconData[] => {
  return icons.filter(icon => icon.category === category);
};

export const getIconById = (id: string): IconData | undefined => {
  return icons.find(icon => icon.id === id);
};