declare global {
  interface Window {
    __APP_INITIALIZED__: boolean;
  }

  type InitializationStatus = {
    isInitialized: boolean;
    error?: Error;
  };

  interface AppConfig {
    version: string;
    environment: 'development' | 'production';
    features: {
      enableAnimations: boolean;
      debugMode: boolean;
    };
  }

  interface Point {
    x: number;
    y: number;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface Transform {
    rotate?: number;
    scale?: Point;
    skew?: Point;
  }

  interface ShapeStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    shadow?: {
      color: string;
      blur: number;
      offsetX: number;
      offsetY: number;
    };
    gradient?: Gradient;
    fontSize?: number;  // 텍스트용 폰트 크기
    fontFamily?: string;  // 텍스트용 폰트
  }

  interface GradientStop {
    offset: number;
    color: string;
  }

  interface Gradient {
    type: 'linear' | 'radial';
    stops: GradientStop[];
    angle?: number; // linear gradient only
    center?: Point; // radial gradient only
  }

  type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'text' | 'group';

  interface ZentrixShape {
    id: string;
    type: ShapeType;
    position: Point;
    size: Size;
    style: ShapeStyle; // style을 optional(?)에서 required로 변경
    transform?: Transform;
    text?: string;
    children?: ZentrixShape[]; // 그룹 도형을 위한 자식 도형 배열
  }

  interface ZentrixCanvas {
    width: number;
    height: number;
    background: string;
  }

  interface ZentrixDesign {
    id: string;
    name: string;
    canvas: ZentrixCanvas;
    shapes: ZentrixShape[];
  }
}

export {};