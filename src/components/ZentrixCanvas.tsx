import React, { useRef, useEffect, useState } from 'react';
import { ContextMenu } from './ContextMenu';
import { getAngle, getTransformHandleType } from '@utils/MathUtils';
import { Grid } from './Grid';
import { t } from '@utils/LangLoader';

interface ZentrixCanvasProps {
  design: ZentrixDesign;
  onShapeClick?: (shapeId: string | null, e?: React.MouseEvent) => void;
  onShapeDelete?: (shapeId: string) => void;
  onShapeRotate?: (shapeId: string, angle: number) => void;
  onShapeDuplicate?: (shapeId: string) => void;
  onShapeUpdate?: (shapeId: string, updates: Partial<ZentrixShape>) => void;
  selectedShapeId?: string | null;
}

const ZentrixCanvas: React.FC<ZentrixCanvasProps> = ({
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

    // Z-index 순서대로 도형 체크 (위에 있는 도형부터)
    for (let i = design.shapes.length - 1; i >= 0; i--) {
      const shape = design.shapes[i];
      if (isPointInShape(x, y, shape)) {
        e.stopPropagation(); // 이벤트 전파 중지
        onShapeClick(shape.id, e);
        return;
      }
    }

    // 빈 공간 클릭시 선택 해제
    onShapeClick(null);
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 클릭 이벤트 전파 중지
    e.stopPropagation();
    
    // 선택된 도형이 있는 경우 변형 핸들 체크
    if (selectedShapeId) {
      const selectedShape = design.shapes.find(s => s.id === selectedShapeId);
      if (selectedShape) {
        const handleType = getTransformHandleType(x, y, selectedShape);
        if (handleType !== 'none') {
          setTransformType(handleType);
          setTransformStart({ x, y });
          setOriginalShape({ ...selectedShape });
          return;
        }
      }
    }

    // Z-index 순서대로 도형 체크 (위에 있는 도형부터)
    for (let i = design.shapes.length - 1; i >= 0; i--) {
      const shape = design.shapes[i];
      if (isPointInShape(x, y, shape)) {
        if (shape.id !== selectedShapeId) {
          onShapeClick?.(shape.id);
        }
        setIsDragging(true);
        setDragStart({ x, y });
        setOriginalShape({ ...shape });
        return;
      }
    }

    // 빈 공간 클릭시 선택 해제
    onShapeClick?.(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedShapeId || !originalShape) return;  // originalShape null 체크 추가

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = x - (dragStart?.x || 0);
      const deltaY = y - (dragStart?.y || 0);
      
      onShapeUpdate?.(selectedShapeId, {
        position: {
          x: originalShape.position.x + deltaX,
          y: originalShape.position.y + deltaY
        }
      });
    } else if (transformType === 'rotate' && transformStart) {
      const center = {
        x: originalShape.position.x + originalShape.size.width / 2,
        y: originalShape.position.y + originalShape.size.height / 2
      };

      const startAngle = getAngle(center, transformStart);
      const currentAngle = getAngle(center, { x, y });
      let deltaAngle = currentAngle - startAngle;

      // Shift 키를 누른 경우 15도 단위로 회전
      if (e.shiftKey) {
        deltaAngle = Math.round(deltaAngle / 15) * 15;
      }

      onShapeUpdate?.(selectedShapeId, {
        transform: {
          ...originalShape.transform,
          rotate: ((originalShape.transform?.rotate || 0) + deltaAngle) % 360
        }
      });
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

    // Transform 적용
    if (shape.transform) {
      const centerX = shape.position.x + shape.size.width / 2;
      const centerY = shape.position.y + shape.size.height / 2;

      ctx.translate(centerX, centerY);
      if (shape.transform.rotate) {
        ctx.rotate((shape.transform.rotate * Math.PI) / 180);
      }
      ctx.translate(-centerX, -centerY);
    }

    // Style 적용
    applyStyle(ctx, shape.style);

    // 도형 타입별 렌더링
    switch (shape.type) {
      case 'group':
        // 그룹의 경계 상자 렌더링
        ctx.strokeStyle = shape.style.stroke || '#2196f3';
        ctx.lineWidth = shape.style.strokeWidth || 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          shape.position.x,
          shape.position.y,
          shape.size.width,
          shape.size.height
        );
        ctx.setLineDash([]);

        // 자식 도형들 렌더링
        if (shape.children) {
          shape.children.forEach(child => {
            const childInGroup = {
              ...child,
              position: {
                x: shape.position.x + child.position.x,
                y: shape.position.y + child.position.y
              }
            };
            renderShape(ctx, childInGroup);
          });
        }
        break;
      case 'text':
        const fontSize = shape.style.fontSize || 16;
        ctx.font = `${fontSize}px ${shape.style.fontFamily || 'sans-serif'}`;
        ctx.fillStyle = shape.style.fill || '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          shape.text || t('common.enterText'),
          shape.position.x + shape.size.width / 2,
          shape.position.y + shape.size.height / 2
        );
        break;
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
    const handleSize = 8;
    
    // 회전 중심점 적용
    if (shape.transform?.rotate) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate((shape.transform.rotate * Math.PI) / 180);
      ctx.translate(-(x + width / 2), -(y + height / 2));
    }
    
    // 이동 핸들 (중앙)
    const moveHandle = {
      x: x + width / 2,
      y: y + height / 2
    };
    
    ctx.beginPath();
    ctx.arc(moveHandle.x, moveHandle.y, handleSize, 0, Math.PI * 2);
    ctx.fillStyle = '#2196f3';
    ctx.fill();
    ctx.stroke();

    // 회전 핸들 (상단 중앙)
    const rotateHandle = {
      x: x + width / 2,
      y: y - 30
    };

    // 회전 핸들로의 선
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(rotateHandle.x, rotateHandle.y);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(rotateHandle.x, rotateHandle.y, handleSize, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
  };

  const applyStyle = (ctx: CanvasRenderingContext2D, style: ShapeStyle) => {
    ctx.fillStyle = style.fill || '#ffffff';
    ctx.strokeStyle = style.stroke || '#000000';
    ctx.lineWidth = style.strokeWidth || 1;
    ctx.globalAlpha = style.opacity ?? 1;

    if (style.shadow) {
      ctx.shadowColor = style.shadow.color;
      ctx.shadowBlur = style.shadow.blur;
      ctx.shadowOffsetX = style.shadow.offsetX;
      ctx.shadowOffsetY = style.shadow.offsetY;
    } else {
      // 그림자 효과 초기화
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    if (style.gradient) {
      const gradient = createGradient(ctx, style.gradient);
      ctx.fillStyle = gradient;
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
    <div className="relative zentrix-scrollbar w-full h-full overflow-auto">
      <div className="relative min-w-fit min-h-fit">
        <Grid 
          width={design.canvas.width} 
          height={design.canvas.height} 
        />
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
          className="zentrix-canvas relative z-10"
        />
        {contextMenu && (
          <ContextMenu
            items={getContextMenuItems(contextMenu.shapeId)}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ZentrixCanvas;