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
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'circle',
    title: '원',
    category: 'shape',
    shortcut: 'C',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'triangle',
    title: '삼각형',
    category: 'shape',
    shortcut: 'T',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L22 21H2L12 3Z" stroke="currentColor" stroke-width="2"/>
    </svg>`
  },

  // 도구 카테고리
  {
    id: 'select',
    title: '선택',
    category: 'tool',
    shortcut: 'V',
};