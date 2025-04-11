interface IconData {
  id: string;
  title: string;
  svg: string;
  category: 'shape' | 'component' | 'layout' | 'tool';
  shortcut?: string;
}

export const icons: IconData[] = [
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
    id: 'layout-grid',
    title: '그리드 레이아웃',
    category: 'layout',
    shortcut: 'G',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zm-12 6h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm-12 6h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" stroke="currentColor" stroke-width="2"/>
    </svg>`
  }
];

export const getIconsByCategory = (category: IconData['category']): IconData[] => {
  return icons.filter(icon => icon.category === category);
};

export const getIconById = (id: string): IconData | undefined => {
  return icons.find(icon => icon.id === id);
};