import React from 'react';

export interface UIComponentProps {
  position: { x: number; y: number };
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const UIComponent: React.FC<UIComponentProps> = ({
  position,
  className = '',
  children,
  style = {},
  onClick
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};