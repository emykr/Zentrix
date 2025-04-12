import React from 'react';
import { getIconById } from '@utils/IconLoader';

interface LayerPanelProps {
  shapes: ZentrixShape[];
  selectedShapeId: string | null;
  onSelectShape: (id: string) => void;
  onLayerOrderChange: (id: string, direction: 'up' | 'down') => void;
  onShapeVisibilityToggle: (id: string) => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  shapes,
  selectedShapeId,
  onSelectShape,
  onLayerOrderChange,
  onShapeVisibilityToggle
}) => {
  return (
    <div className="layer-panel">
      <div className="panel-header">
        <h3 className="panel-title">레이어</h3>
      </div>
      <div className="layer-panel-content">
        <div className="layer-list">
          {shapes.map((shape, index) => (
            <div
              key={shape.id}
              className={`layer-item ${selectedShapeId === shape.id ? 'selected' : ''}`}
              onClick={() => onSelectShape(shape.id)}
            >
              <button
                className="visibility-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  onShapeVisibilityToggle(shape.id);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <div className="layer-info">
                <span className="shape-icon" dangerouslySetInnerHTML={{ 
                  __html: getIconById(shape.type)?.svg || '' 
                }} />
                <span className="shape-name">
                  {shape.type} {index + 1}
                </span>
              </div>

              <div className="layer-controls">
                <button
                  className="layer-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerOrderChange(shape.id, 'up');
                  }}
                  disabled={index === shapes.length - 1}
                >
                  ↑
                </button>
                <button
                  className="layer-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerOrderChange(shape.id, 'down');
                  }}
                  disabled={index === 0}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayerPanel;