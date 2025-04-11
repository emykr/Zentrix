import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { GradientEditor } from './GradientEditor';

interface ShapeEditorProps {
  shape: ZentrixShape;
  onUpdate: (updates: Partial<ZentrixShape>) => void;
}

export const ShapeEditor: React.FC<ShapeEditorProps> = ({ shape, onUpdate }) => {
  const [useGradient, setUseGradient] = useState(!!shape.style.gradient);

  const handleColorChange = (color: { hex: string }) => {
    onUpdate({
      style: {
        ...shape.style,
        fill: color.hex,
        gradient: undefined
      }
    });
  };

  const handleGradientChange = (gradient: Gradient) => {
    onUpdate({
      style: {
        ...shape.style,
        gradient,
        fill: undefined
      }
    });
  };

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      style: {
        ...shape.style,
        strokeWidth: parseInt(e.target.value)
      }
    });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      style: {
        ...shape.style,
        opacity: parseFloat(e.target.value)
      }
    });
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      transform: {
        ...shape.transform,
        rotate: parseInt(e.target.value)
      }
    });
  };

  return (
    <div className="ui-panel space-y-4 min-w-[240px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-white text-sm">색상 타입</label>
          <button
            className="text-white/70 text-sm hover:text-white"
            onClick={() => setUseGradient(!useGradient)}
          >
            {useGradient ? '단색으로 전환' : '그래디언트로 전환'}
          </button>
        </div>

        {useGradient ? (
          <GradientEditor
            gradient={shape.style.gradient}
            onChange={handleGradientChange}
          />
        ) : (
          <ChromePicker
            color={shape.style.fill}
            onChange={handleColorChange}
            disableAlpha
          />
        )}
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm">테두리 두께</label>
        <input
          type="range"
          min="0"
          max="10"
          value={shape.style.strokeWidth || 0}
          onChange={handleStrokeWidthChange}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm">투명도</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={shape.style.opacity || 1}
          onChange={handleOpacityChange}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white text-sm">회전</label>
        <input
          type="range"
          min="0"
          max="360"
          value={shape.transform?.rotate || 0}
          onChange={handleRotationChange}
          className="w-full"
        />
      </div>
    </div>
  );
};