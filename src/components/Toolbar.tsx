import React from 'react';
import { getIconsByCategory } from '@utils/IconLoader';

interface ToolbarProps {
  onToolSelect: (toolId: string) => void;
  selectedTool?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onToolSelect, selectedTool }) => {
  const tools = getIconsByCategory('tool');
  
  return (
    <div className="toolbar-container">
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
    </div>
  );
};