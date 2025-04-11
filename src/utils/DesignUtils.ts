import { v4 as uuidv4 } from 'uuid';

export const createShape = (
  type: ZentrixShape['type'],
  position: Point,
  size: Size,
  style: Partial<ShapeStyle> = {}
): ZentrixShape => {
  return {
    id: uuidv4(),
    type,
    position,
    size,
    style: {
      fill: '#3b82f6',
      stroke: '#1d4ed8',
      strokeWidth: 2,
      ...style
    }
  };
};

export const updateShape = (
  design: ZentrixDesign,
  shapeId: string,
  updates: Partial<ZentrixShape>
): ZentrixDesign => {
  return {
    ...design,
    shapes: design.shapes.map(shape =>
      shape.id === shapeId
        ? { ...shape, ...updates }
        : shape
    )
  };
};

export const deleteShape = (
  design: ZentrixDesign,
  shapeId: string
): ZentrixDesign => {
  return {
    ...design,
    shapes: design.shapes.filter(shape => shape.id !== shapeId)
  };
};

export const moveShape = (
  design: ZentrixDesign,
  shapeId: string,
  deltaX: number,
  deltaY: number
): ZentrixDesign => {
  return updateShape(design, shapeId, {
    position: {
      x: design.shapes.find(s => s.id === shapeId)!.position.x + deltaX,
      y: design.shapes.find(s => s.id === shapeId)!.position.y + deltaY
    }
  });
};

export const resizeShape = (
  design: ZentrixDesign,
  shapeId: string,
  width: number,
  height: number
): ZentrixDesign => {
  return updateShape(design, shapeId, {
    size: { width, height }
  });
};

export const rotateShape = (
  design: ZentrixDesign,
  shapeId: string,
  angle: number
): ZentrixDesign => {
  const shape = design.shapes.find(s => s.id === shapeId)!;
  return updateShape(design, shapeId, {
    transform: {
      ...shape.transform,
      rotate: angle
    }
  });
};