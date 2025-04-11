import React, { useRef, useEffect, useState } from 'react';
import { ContextMenu } from './ContextMenu';
import { getDistance, getAngle, getTransformHandleType } from '@utils/MathUtils';

interface ZentrixCanvasProps {
  design: ZentrixDesign;
  onShapeClick?: (shapeId: string) => void;
  onShapeDelete?: (shapeId: string) => void;
  onShapeRotate?: (shapeId: string, angle: number) => void;
  onShapeDuplicate?: (shapeId: string) => void;
  onShapeUpdate?: (shapeId: string, updates: Partial<ZentrixShape>) => void;
  selectedShapeId?: string | null;
}

export const ZentrixCanvas: React.FC<ZentrixCanvasProps> = ({
  design,
  onShapeClick,
  onShapeDelete,
  onShapeRotate,
  onShapeDuplicate,
  onShapeUpdate,
  selectedShapeId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    shapeId: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [transformType, setTransformType] = useState<'rotate' | 'resize' | 'none'>('none');
  const [transformStart, setTransformStart] = useState<Point | null>(null);
  const [originalShape, setOriginalShape] = useState<ZentrixShape | null>(null);

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
    design.shapes.forEach(shape => {
      renderShape(ctx, shape);
      
      // 선택된 도형의 경계 상자와 핸들 렌더링
      if (selectedShapeId === shape.id) {
        renderBoundingBox(ctx, shape);
        renderTransformHandles(ctx, shape);
      }
    });
  }, [design, selectedShapeId]);

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 클릭된 도형 찾기
    for (let i = design.shapes.length - 1; i >= 0; i--) {
      const shape = design.shapes[i];
      if (isPointInShape(x, y, shape)) {
        setContextMenu({
          x: e.clientX,
          y: e.clientY,
          shapeId: shape.id
        });
        break;
      }
    }
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
        onShapeClick(shape.id);
        break;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedShapeId) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const selectedShape = design.shapes.find(s => s.id === selectedShapeId);
    if (!selectedShape) return;

    const handleType = getTransformHandleType(x, y, selectedShape);
    
    if (handleType !== 'none') {
      setTransformType(handleType);
      setTransformStart({ x, y });
      setOriginalShape(selectedShape);
      e.stopPropagation(); // 도형 드래그 방지
      return;
    }

    if (isPointInShape(x, y, selectedShape)) {
      setIsDragging(true);
      setDragStart({ x, y });
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedShapeId) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && dragStart) {
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;

      const shape = design.shapes.find(s => s.id === selectedShapeId);
      if (!shape) return;

      onShapeUpdate?.(selectedShapeId, {
        position: {
          x: shape.position.x + deltaX,
          y: shape.position.y + deltaY
        }
      });

      setDragStart({ x, y });
    } else if (transformType !== 'none' && transformStart && originalShape) {
      if (transformType === 'rotate') {
        const center = {
          x: originalShape.position.x + originalShape.size.width / 2,
          y: originalShape.position.y + originalShape.size.height / 2
        };

        const startAngle = getAngle(center, transformStart);
        const currentAngle = getAngle(center, { x, y });
        const deltaAngle = currentAngle - startAngle;
        const newRotation = ((originalShape.transform?.rotate || 0) + deltaAngle) % 360;

        onShapeUpdate?.(selectedShapeId, {
          transform: {
            ...originalShape.transform,
            rotate: newRotation
          }
        });
      } else if (transformType === 'resize') {
        const deltaX = x - transformStart.x;
        const deltaY = y - transformStart.y;
        const newWidth = Math.max(20, originalShape.size.width + deltaX);
        const newHeight = Math.max(20, originalShape.size.height + deltaY);

        onShapeUpdate?.(selectedShapeId, {
          size: {
            width: newWidth,
            height: newHeight
          }
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
    setTransformType('none');
    setTransformStart(null);
    setOriginalShape(null);
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

  const renderBoundingBox = (ctx: CanvasRenderingContext2D, shape: ZentrixShape) => {
    ctx.save();
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    const { x, y } = shape.position;
    const { width, height } = shape.size;
    
    // 회전 적용
    if (shape.transform?.rotate) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((shape.transform.rotate * Math.PI) / 180);
      ctx.translate(-(x + width / 2), -(y + height / 2));
    }
        
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  };

  const renderTransformHandles = (ctx: CanvasRenderingContext2D, shape: ZentrixShape) => {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 2;
    
    const { x, y } = shape.position;
    const { width, height } = shape.size;
    const handleSize = 10;
    
    // 회전 중심점 적용
    if (shape.transform?.rotate) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((shape.transform.rotate * Math.PI) / 180);
      ctx.translate(-(x + width / 2), -(y + height / 2));
    }
    
    // 모서리 핸들
    const handlePositions = [
      { x, y }, // 좌상단
      { x: x + width, y }, // 우상단
      { x: x + width, y: y + height }, // 우하단
      { x, y: y + height }, // 좌하단
      { x: x + width / 2, y }, // 상단 중앙
      { x: x + width, y: y + height / 2 }, // 우측 중앙
      { x: x + width / 2, y: y + height }, // 하단 중앙
      { x, y: y + height / 2 } // 좌측 중앙
    ];
    
    // 핸들 그리기
    handlePositions.forEach(pos => {
      ctx.beginPath();
      ctx.rect(pos.x - handleSize/2, pos.y - handleSize/2, handleSize, handleSize);
      ctx.fill();
      ctx.stroke();
    });

    // 회전 핸들
    const rotationHandleY = y - 30;
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width / 2, rotationHandleY);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(x + width / 2, rotationHandleY, handleSize/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
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

  return (
    <>
      <canvas
        ref={canvasRef}
        width={design.canvas.width}
        height={design.canvas.height}
        onClick={handleCanvasClick}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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