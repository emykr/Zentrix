import React from 'react';
import { getIconById } from '@utils/IconLoader';

interface LayerPanelProps {
  shapes: ZentrixShape[];
  selectedShapeId: string | null;
  onSelectShape: (shapeId: string | null) => void;
  onLayerOrderChange: (shapeId: string, direction: 'up' | 'down') => void;
  onShapeVisibilityToggle: (shapeId: string) => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  shapes,
  selectedShapeId,
  onSelectShape,
  onLayerOrderChange,
  onShapeVisibilityToggle
}) => {
  const handleLayerClick = (shapeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 이벤트 객체와 함께 전달
    onSelectShape(shapeId);
  };

  return (
    <div className="ui-panel layer-panel">
      <h2 className="panel-title">레이어</h2>
      <div className="layer-list">
        {shapes.map(shape => (
          <div
            key={shape.id}
            className={`layer-item ${selectedShapeId === shape.id ? 'selected' : ''}`}
            onClick={(e) => handleLayerClick(shape.id, e)}
          >
            <div className="layer-content">
              <button
                className="visibility-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  onShapeVisibilityToggle(shape.id);
                }}
              >
                <i className={`icon ${shape.style?.opacity === 0 ? 'hidden' : 'visible'}`} />
              </button>
              <span className="layer-name">
                {shape.type === 'group' ? '그룹' : shape.type} {shape.id.slice(0, 4)}
              </span>
            </div>
            <div className="layer-controls">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerOrderChange(shape.id, 'up');
                }}
                disabled={shapes.indexOf(shape) === shapes.length - 1}
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerOrderChange(shape.id, 'down');
                }}
                disabled={shapes.indexOf(shape) === 0}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;