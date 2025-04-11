import React from 'react';
import { ChromePicker } from 'react-color';

interface GradientEditorProps {
  gradient?: Gradient;
  onChange: (gradient: Gradient) => void;
}

export const GradientEditor: React.FC<GradientEditorProps> = ({
  gradient,
  onChange
}) => {
  const defaultGradient: Gradient = {
    type: 'linear',
    stops: [
      { offset: 0, color: '#4f46e5' },
      { offset: 1, color: '#7c3aed' }
    ],
    angle: 45
  };

  const currentGradient = gradient || defaultGradient;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...currentGradient,
      type: e.target.value as 'linear' | 'radial'
    });
  };

  const handleStopColorChange = (index: number, color: { hex: string }) => {
    const newStops = [...currentGradient.stops];
    newStops[index] = { ...newStops[index], color: color.hex };
    onChange({
      ...currentGradient,
      stops: newStops
    });
  };

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentGradient.type === 'linear') {
      onChange({
        ...currentGradient,
        angle: parseInt(e.target.value)
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-white text-sm">그래디언트 타입</label>
        <select
          value={currentGradient.type}
          onChange={handleTypeChange}
          className="w-full bg-slate-800 text-white p-2 rounded"
        >
          <option value="linear">선형</option>
          <option value="radial">방사형</option>
        </select>
      </div>

      {currentGradient.type === 'linear' && (
        <div className="space-y-2">
          <label className="text-white text-sm">각도</label>
          <input
            type="range"
            min="0"
            max="360"
            value={currentGradient.angle || 0}
            onChange={handleAngleChange}
            className="w-full"
          />
          <span className="text-white text-sm">
            {currentGradient.angle || 0}°
          </span>
        </div>
      )}

      <div className="space-y-4">
        <label className="text-white text-sm">색상 정지점</label>
        {currentGradient.stops.map((stop, index) => (
          <div key={index} className="space-y-2">
            <label className="text-white text-sm">
              색상 {index + 1} ({(stop.offset * 100).toFixed(0)}%)
            </label>
            <ChromePicker
              color={stop.color}
              onChange={(color) => handleStopColorChange(index, color)}
              disableAlpha
            />
          </div>
        ))}
      </div>
    </div>
  );
};