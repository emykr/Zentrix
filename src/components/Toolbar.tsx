import React from 'react';
import { getIconsByCategory } from '@utils/IconLoader';

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onToolSelect,
}) => {
  const shapes = getIconsByCategory('shape');

  // 도형 또는 텍스트 도구가 선택되었을 때만 툴바 표시
  if (!['shape-tool', 'text-tool'].includes(selectedTool)) {
    return null;
  }

  const shownTools = selectedTool === 'shape-tool' ? shapes : [];

  return (
    <div className="shapes-panel">
      <div className="shapes-grid">
        {shownTools.map(shape => (
          <button
            key={shape.id}
            className="shape-button"
            onClick={() => {
              onToolSelect(shape.id);
            }}
            title={shape.title}
          >
            <span dangerouslySetInnerHTML={{ __html: shape.svg }} />
            <span className="text-xs">{shape.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;