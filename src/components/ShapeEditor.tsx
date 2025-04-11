import React, { useState } from 'react';

interface ShapeEditorProps {
  shape: ZentrixShape;
  onUpdate: (updates: Partial<ZentrixShape>) => void;
}

export const ShapeEditor: React.FC<ShapeEditorProps> = ({ shape, onUpdate }) => {
  const [showGradientEditor, setShowGradientEditor] = useState(false);

  const updateStyle = (updates: Partial<ShapeStyle>) => {
    onUpdate({ style: { ...shape.style, ...updates } });
  };

  const updateTransform = (updates: Partial<Transform>) => {
    onUpdate({ transform: { ...shape.transform, ...updates } });
  };

  return (
    <div className="shape-editor">
      <div className="editor-section">
        <h3 className="section-title">스타일</h3>
        <div className="control-grid">
          <div className="control-item">
            <label>색상</label>
            <input
              type="color"
              value={shape.style.fill || '#000000'}
              onChange={(e) => updateStyle({ fill: e.target.value })}
            />
          </div>

          <div className="control-item">
            <label>테두리 색상</label>
            <input
              type="color"
              value={shape.style.stroke || '#000000'}
              onChange={(e) => updateStyle({ stroke: e.target.value })}
            />
          </div>

          <div className="control-item">
            <label>테두리 두께</label>
            <input
              type="number"
              value={shape.style.strokeWidth || 0}
              onChange={(e) => updateStyle({ strokeWidth: Number(e.target.value) })}
              min={0}
              max={20}
            />
          </div>

          <div className="control-item">
            <label>투명도</label>
            <input
              type="range"
              value={(shape.style.opacity ?? 1) * 100}
              onChange={(e) => updateStyle({ opacity: Number(e.target.value) / 100 })}
              min={0}
              max={100}
            />
          </div>
        </div>
      </div>

      <div className="editor-section">
        <h3 className="section-title">변형</h3>
        <div className="control-grid">
          <div className="control-item">
            <label>회전 (도)</label>
            <input
              type="number"
              value={shape.transform?.rotate || 0}
              onChange={(e) => updateTransform({ rotate: Number(e.target.value) })}
              step={15}
            />
          </div>

          <div className="control-item">
            <label>크기 X</label>
            <input
              type="number"
              value={shape.transform?.scale?.x || 1}
              onChange={(e) => updateTransform({ 
                scale: { 
                  x: Number(e.target.value), 
                  y: shape.transform?.scale?.y || 1 
                } 
              })}
              step={0.1}
              min={0.1}
            />
          </div>

          <div className="control-item">
            <label>크기 Y</label>
            <input
              type="number"
              value={shape.transform?.scale?.y || 1}
              onChange={(e) => updateTransform({ 
                scale: { 
                  x: shape.transform?.scale?.x || 1, 
                  y: Number(e.target.value) 
                } 
              })}
              step={0.1}
              min={0.1}
            />
          </div>
        </div>
      </div>

      <div className="editor-section">
        <h3 className="section-title">그림자</h3>
        <div className="control-grid">
          <div className="control-item">
            <label>색상</label>
            <input
              type="color"
              value={shape.style.shadow?.color || '#000000'}
              onChange={(e) => updateStyle({ 
                shadow: { 
                  color: e.target.value,
                  blur: shape.style.shadow?.blur || 0,
                  offsetX: shape.style.shadow?.offsetX || 0,
                  offsetY: shape.style.shadow?.offsetY || 0
                } 
              })}
            />
          </div>

          <div className="control-item">
            <label>흐림</label>
            <input
              type="number"
              value={shape.style.shadow?.blur || 0}
              onChange={(e) => updateStyle({ 
                shadow: { 
                  color: shape.style.shadow?.color || '#000000',
                  blur: Number(e.target.value),
                  offsetX: shape.style.shadow?.offsetX || 0,
                  offsetY: shape.style.shadow?.offsetY || 0
                } 
              })}
              min={0}
              max={50}
            />
          </div>

          <div className="control-item">
            <label>X 오프셋</label>
            <input
              type="number"
              value={shape.style.shadow?.offsetX || 0}
              onChange={(e) => updateStyle({ 
                shadow: { 
                  color: shape.style.shadow?.color || '#000000',
                  blur: shape.style.shadow?.blur || 0,
                  offsetX: Number(e.target.value),
                  offsetY: shape.style.shadow?.offsetY || 0
                } 
              })}
              min={-50}
              max={50}
            />
          </div>

          <div className="control-item">
            <label>Y 오프셋</label>
            <input
              type="number"
              value={shape.style.shadow?.offsetY || 0}
              onChange={(e) => updateStyle({ 
                shadow: { 
                  color: shape.style.shadow?.color || '#000000',
                  blur: shape.style.shadow?.blur || 0,
                  offsetX: shape.style.shadow?.offsetX || 0,
                  offsetY: Number(e.target.value)
                } 
              })}
              min={-50}
              max={50}
            />
          </div>
        </div>
      </div>

      <div className="editor-section">
        <h3 className="section-title">위치 및 크기</h3>
        <div className="control-grid">
          <div className="control-item">
            <label>X</label>
            <input
              type="number"
              value={shape.position.x}
              onChange={(e) => onUpdate({ 
                position: { 
                  ...shape.position,
                  x: Number(e.target.value) 
                } 
              })}
            />
          </div>

          <div className="control-item">
            <label>Y</label>
            <input
              type="number"
              value={shape.position.y}
              onChange={(e) => onUpdate({ 
                position: { 
                  ...shape.position,
                  y: Number(e.target.value) 
                } 
              })}
            />
          </div>

          <div className="control-item">
            <label>너비</label>
            <input
              type="number"
              value={shape.size.width}
              onChange={(e) => onUpdate({ 
                size: { 
                  ...shape.size,
                  width: Number(e.target.value) 
                } 
              })}
              min={1}
            />
          </div>

          <div className="control-item">
            <label>높이</label>
            <input
              type="number"
              value={shape.size.height}
              onChange={(e) => onUpdate({ 
                size: { 
                  ...shape.size,
                  height: Number(e.target.value) 
                } 
              })}
              min={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};