import React, { useEffect, useRef } from 'react';

interface GridProps {
  width: number;
  height: number;
  gridSize?: number;
  color?: string;
}

export const Grid: React.FC<GridProps> = ({
  width,
  height,
  gridSize = 20,
  color = 'rgba(255, 255, 255, 0.1)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 수직선 그리기
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    // 수평선 그리기
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }, [width, height, gridSize, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none"
    />
  );
};