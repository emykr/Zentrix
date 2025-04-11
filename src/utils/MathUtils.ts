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