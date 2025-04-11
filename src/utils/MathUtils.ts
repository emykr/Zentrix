export interface Point {
  x: number;
  y: number;
}

export const polarToXY = (cx: number, cy: number, radius: number, angle: number): Point => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + Math.cos(rad) * radius,
    y: cy + Math.sin(rad) * radius,
  };
};

export const distributePointsInCircle = (
  cx: number,
  cy: number,
  radius: number,
  count: number,
  startAngle = 0
): Point[] => {
  const points: Point[] = [];
  const angleStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;
    points.push(polarToXY(cx, cy, radius, angle));
  }
  
  return points;
};

export const getDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const getAngle = (center: Point, point: Point): number => {
  return Math.atan2(point.y - center.y, point.x - center.x) * (180 / Math.PI);
};

export const getTransformHandleType = (
  x: number,
  y: number,
  shape: ZentrixShape,
  handleSize: number = 8
): 'rotate' | 'resize' | 'none' => {
  const { position, size } = shape;
  const center = {
    x: position.x + size.width / 2,
    y: position.y + size.height / 2
  };

  // 회전 핸들 검사
  const rotationHandleY = position.y - 20;
  const rotationHandle = { x: center.x, y: rotationHandleY };
  if (getDistance({ x, y }, rotationHandle) <= handleSize) {
    return 'rotate';
  }

  // 크기 조절 핸들 검사
  const handles = [
    { x: position.x, y: position.y }, // 좌상단
    { x: position.x + size.width, y: position.y }, // 우상단
    { x: position.x + size.width, y: position.y + size.height }, // 우하단
    { x: position.x, y: position.y + size.height }, // 좌하단
    { x: position.x + size.width / 2, y: position.y }, // 상단 중앙
    { x: position.x + size.width, y: position.y + size.height / 2 }, // 우측 중앙
    { x: position.x + size.width / 2, y: position.y + size.height }, // 하단 중앙
    { x: position.x, y: position.y + size.height / 2 }, // 좌측 중앙
  ];

  for (const handle of handles) {
    if (getDistance({ x, y }, handle) <= handleSize) {
      return 'resize';
    }
  }

  return 'none';
};