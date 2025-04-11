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

  interface ZentrixShape {
    id: string;
    type: 'rectangle' | 'circle' | 'triangle' | 'path';
    position: Point;
    size: Size;
    style: ShapeStyle;
    transform?: Transform;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface ShapeStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    shadow?: Shadow;
    gradient?: Gradient;
  }

  interface Shadow {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  }

  interface Gradient {
    type: 'linear' | 'radial';
    stops: Array<{
      offset: number;
      color: string;
    }>;
    angle?: number; // linear gradient only
    center?: Point; // radial gradient only
  }

  interface Transform {
    rotate?: number;
    scale?: Point;
    skew?: Point;
  }

  interface ZentrixDesign {
    id: string;
    name: string;
    shapes: ZentrixShape[];
    canvas: {
      width: number;
      height: number;
      background: string;
    };
  }
}

export {};