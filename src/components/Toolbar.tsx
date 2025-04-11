import React from 'react';
import { getIconsByCategory } from '@utils/IconLoader';

interface ToolbarProps {
  onToolSelect: (toolId: string) => void;
  selectedTool?: string;
  onLayerOrderChange?: (shapeId: string, direction: 'up' | 'down') => void;
  onGroupShapes?: () => void;
  onUngroupShapes?: () => void;
  selectedShapeId?: string | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onToolSelect,
  selectedTool,
  onLayerOrderChange,
  onGroupShapes,
  onUngroupShapes,
  selectedShapeId
}) => {
  const tools = getIconsByCategory('tool');
  
  return (
    <div className="toolbar-container">
      <div className="flex gap-4">
        {/* 기본 도구 */}
        <div className="flex space-x-1 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`toolbar-button ${selectedTool === tool.id ? 'active' : ''}`}
              onClick={() => onToolSelect(tool.id)}
              title={`${tool.title} ${tool.shortcut ? `(${tool.shortcut})` : ''}`}
              dangerouslySetInnerHTML={{ __html: tool.svg }}
            />
          ))}
        </div>

        {/* 레이어 컨트롤 */}
        {selectedShapeId && (
          <div className="flex space-x-1 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2">
            <button
              className="toolbar-button"
              onClick={() => onLayerOrderChange?.(selectedShapeId, 'up')}
              title="레이어 위로 (Shift+])"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 15L12 10L17 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button
              className="toolbar-button"
              onClick={() => onLayerOrderChange?.(selectedShapeId, 'down')}
              title="레이어 아래로 (Shift+[)"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        )}

        {/* 그룹 컨트롤 */}
        <div className="flex space-x-1 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2">
          <button
            className="toolbar-button"
            onClick={onGroupShapes}
            title="그룹화 (Ctrl+G)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button
            className="toolbar-button"
            onClick={onUngroupShapes}
            title="그룹 해제 (Ctrl+Shift+G)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3L21 21M3 21L21 3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};