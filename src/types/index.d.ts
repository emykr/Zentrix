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

  interface ZentrixShape {
    id: string;
    type: 'rectangle' | 'circle' | 'triangle';
    position: Point;
    size: Size;
    style: ShapeStyle;
    transform?: Transform;
    isVisible?: boolean;
    groupId?: string;
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