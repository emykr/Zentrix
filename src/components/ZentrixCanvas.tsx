import React, { useRef, useEffect, useState } from 'react';
import { ContextMenu } from './ContextMenu';

interface ZentrixCanvasProps {
  design: ZentrixDesign;
  onShapeClick?: (shapeId: string) => void;
  onShapeDelete?: (shapeId: string) => void;
  onShapeRotate?: (shapeId: string, angle: number) => void;
  onShapeDuplicate?: (shapeId: string) => void;
}

export const ZentrixCanvas: React.FC<ZentrixCanvasProps> = ({
  design,
  onShapeClick,
  onShapeDelete,
  onShapeRotate,
  onShapeDuplicate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    shapeId: string;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, design.canvas.width, design.canvas.height);
    ctx.fillStyle = design.canvas.background;
    ctx.fillRect(0, 0, design.canvas.width, design.canvas.height);

    // 모든 도형 렌더링
    design.shapes.forEach(shape => renderShape(ctx, shape));
  }, [design]);

  const renderShape = (ctx: CanvasRenderingContext2D, shape: ZentrixShape) => {
    ctx.save();

    // 변환 적용
    if (shape.transform) {
      const { x, y } = shape.position;
      ctx.translate(x, y);
      if (shape.transform.rotate) {
        ctx.rotate((shape.transform.rotate * Math.PI) / 180);
      }
      if (shape.transform.scale) {
        ctx.scale(shape.transform.scale.x, shape.transform.scale.y);
      }
      if (shape.transform.skew) {
        ctx.transform(1, shape.transform.skew.y, shape.transform.skew.x, 1, 0, 0);
      }
      ctx.translate(-x, -y);
    }

    // 스타일 적용
    applyStyle(ctx, shape.style);

    // 도형 타입에 따른 렌더링
    switch (shape.type) {
      case 'rectangle':
        ctx.fillRect(
          shape.position.x,
          shape.position.y,
          shape.size.width,
          shape.size.height
        );
        if (shape.style.stroke) {
          ctx.strokeRect(
            shape.position.x,
            shape.position.y,
            shape.size.width,
            shape.size.height
          );
        }
        break;

      case 'circle':
        ctx.beginPath();
        ctx.arc(
          shape.position.x + shape.size.width / 2,
          shape.position.y + shape.size.height / 2,
          Math.min(shape.size.width, shape.size.height) / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        if (shape.style.stroke) {
          ctx.stroke();
        }
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(shape.position.x + shape.size.width / 2, shape.position.y);
        ctx.lineTo(
          shape.position.x + shape.size.width,
          shape.position.y + shape.size.height
        );
        ctx.lineTo(shape.position.x, shape.position.y + shape.size.height);
        ctx.closePath();
        ctx.fill();
        if (shape.style.stroke) {
          ctx.stroke();
        }
        break;
    }

    ctx.restore();
  };

  const applyStyle = (ctx: CanvasRenderingContext2D, style: ShapeStyle) => {
    if (style.fill) {
      if (style.gradient) {
        const gradient = createGradient(ctx, style.gradient);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = style.fill;
      }
    }

    if (style.stroke) {
      ctx.strokeStyle = style.stroke;
      ctx.lineWidth = style.strokeWidth || 1;
    }

    if (style.shadow) {
      ctx.shadowColor = style.shadow.color;
      ctx.shadowBlur = style.shadow.blur;
      ctx.shadowOffsetX = style.shadow.offsetX;
      ctx.shadowOffsetY = style.shadow.offsetY;
    }

    if (style.opacity !== undefined) {
      ctx.globalAlpha = style.opacity;
    }
  };

  const createGradient = (
    ctx: CanvasRenderingContext2D,
    gradient: Gradient
  ): CanvasGradient => {
    let canvasGradient: CanvasGradient;

    if (gradient.type === 'linear') {
      const angle = gradient.angle || 0;
      const rad = (angle * Math.PI) / 180;
      const size = Math.max(design.canvas.width, design.canvas.height);
      
      canvasGradient = ctx.createLinearGradient(
        0,
        0,
        size * Math.cos(rad),
        size * Math.sin(rad)
      );
    } else {
      const center = gradient.center || {
        x: design.canvas.width / 2,
        y: design.canvas.height / 2
      };
      canvasGradient = ctx.createRadialGradient(
        center.x,
        center.y,
        0,
        center.x,
        center.y,
        Math.max(design.canvas.width, design.canvas.height) / 2
      );
    }

    gradient.stops.forEach(stop => {
      canvasGradient.addColorStop(stop.offset, stop.color);
    });

    return canvasGradient;
  };

  const handleContextMenu = (e: React.MouseEvent, shapeId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      shapeId
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onShapeClick) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 클릭된 도형 찾기 (가장 위에 있는 도형부터)
    for (let i = design.shapes.length - 1; i >= 0; i--) {
      const shape = design.shapes[i];
      if (isPointInShape(x, y, shape)) {
        if (e.type === 'contextmenu') {
          handleContextMenu(e, shape.id);
        } else {
          onShapeClick?.(shape.id);
        }
        break;
      }
    }
  };

  const isPointInShape = (x: number, y: number, shape: ZentrixShape): boolean => {
    const { position, size } = shape;

    switch (shape.type) {
      case 'rectangle':
        return (
          x >= position.x &&
          x <= position.x + size.width &&
          y >= position.y &&
          y <= position.y + size.height
        );

      case 'circle':
        const centerX = position.x + size.width / 2;
        const centerY = position.y + size.height / 2;
        const radius = Math.min(size.width, size.height) / 2;
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        return distance <= radius;

      case 'triangle':
        return isPointInTriangle(
          x,
          y,
          { x: position.x + size.width / 2, y: position.y },
          { x: position.x + size.width, y: position.y + size.height },
          { x: position.x, y: position.y + size.height }
        );

      default:
        return false;
    }
  };

  const isPointInTriangle = (
    px: number,
    py: number,
    p1: Point,
    p2: Point,
    p3: Point
  ): boolean => {
    const area = getTriangleArea(p1, p2, p3);
    const area1 = getTriangleArea({ x: px, y: py }, p2, p3);
    const area2 = getTriangleArea(p1, { x: px, y: py }, p3);
    const area3 = getTriangleArea(p1, p2, { x: px, y: py });

    return Math.abs(area - (area1 + area2 + area3)) < 0.1;
  };

  const getTriangleArea = (p1: Point, p2: Point, p3: Point): number => {
    return Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2
    );
  };

  const getContextMenuItems = (shapeId: string) => [
    {
      id: 'duplicate',
      label: '복제',
      shortcut: 'Ctrl+D',
      onClick: () => onShapeDuplicate?.(shapeId)
    },
    {
      id: 'rotate',
      label: '90도 회전',
      shortcut: 'R',
      onClick: () => onShapeRotate?.(shapeId, 90)
    },
    {
      id: 'divider1',
      divider: true
    },
    {
      id: 'delete',
      label: '삭제',
      shortcut: 'Delete',
      onClick: () => onShapeDelete?.(shapeId)
    }
  ];

  return (
    <>
      <canvas
        ref={canvasRef}
        width={design.canvas.width}
        height={design.canvas.height}
        onClick={handleCanvasClick}
        onContextMenu={handleCanvasClick}
        className="zentrix-canvas"
      />
      {contextMenu && (
        <ContextMenu
          items={getContextMenuItems(contextMenu.shapeId)}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
};