import React from 'react';
import { getIconsByCategory } from '@utils/IconLoader';

interface ComponentPanelProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({ selectedTool, onToolSelect }) => {
  const cursorTools = getIconsByCategory('cursor');
  const basicTools = getIconsByCategory('basic');

  return (
    <div className="component-panel">
      <div className="component-panel-content">
        <div className="panel-section">
          {/* 커서 도구들 (선택, 손) */}
          <div className="tool-group">
            {cursorTools.map(tool => (
              <button
                key={tool.id}
                className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
                onClick={() => onToolSelect(tool.id)}
                title={tool.title}
              >
                <span className="tool-icon" dangerouslySetInnerHTML={{ __html: tool.svg }} />
                <span className="tool-label">{tool.title}</span>
              </button>
            ))}
          </div>

          {/* 구분선 */}
          <div className="tool-divider" />

          {/* 도형과 텍스트 도구 */}
          <div className="tool-group">
            {basicTools.map(tool => (
              <button
                key={tool.id}
                className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
                onClick={() => onToolSelect(tool.id)}
                title={tool.title}
              >
                <span className="tool-icon" dangerouslySetInnerHTML={{ __html: tool.svg }} />
                <span className="tool-label">{tool.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPanel;