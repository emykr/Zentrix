import React from 'react';
import { getIconsByCategory } from '@utils/IconLoader';

interface ComponentPanelProps {
  onSelectComponent: (componentId: string) => void;
}

export const ComponentPanel: React.FC<ComponentPanelProps> = ({ onSelectComponent }) => {
  const shapes = getIconsByCategory('shape');
  const components = getIconsByCategory('component');
  const layouts = getIconsByCategory('layout');

  return (
    <div className="component-panel">
      <div className="panel-section">
        <h3 className="panel-title">도형</h3>
        <div className="panel-grid">
          {shapes.map(shape => (
            <button
              key={shape.id}
              className="component-button"
              onClick={() => onSelectComponent(shape.id)}
              title={`${shape.title} ${shape.shortcut ? `(${shape.shortcut})` : ''}`}
            >
              <div dangerouslySetInnerHTML={{ __html: shape.svg }} />
              <span className="component-label">{shape.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">레이아웃</h3>
        <div className="panel-grid">
          {layouts.map(layout => (
            <button
              key={layout.id}
              className="component-button"
              onClick={() => onSelectComponent(layout.id)}
              title={`${layout.title} ${layout.shortcut ? `(${layout.shortcut})` : ''}`}
            >
              <div dangerouslySetInnerHTML={{ __html: layout.svg }} />
              <span className="component-label">{layout.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3 className="panel-title">컴포넌트</h3>
        <div className="panel-grid">
          {components.map(component => (
            <button
              key={component.id}
              className="component-button"
              onClick={() => onSelectComponent(component.id)}
              title={`${component.title} ${component.shortcut ? `(${component.shortcut})` : ''}`}
            >
              <div dangerouslySetInnerHTML={{ __html: component.svg }} />
              <span className="component-label">{component.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};