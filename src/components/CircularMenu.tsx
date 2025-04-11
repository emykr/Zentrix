import React, { useState, useEffect } from 'react';
import { UIComponent } from './UIComponent';
import { distributePointsInCircle } from '@utils/MathUtils';
import { t } from '@utils/LangLoader';

interface CircularMenuProps {
  centerX: number;
  centerY: number;
  radius: number;
  itemCount: number;
  onItemClick?: (index: number) => void;
}

export const CircularMenu: React.FC<CircularMenuProps> = ({
  centerX,
  centerY,
  radius,
  itemCount,
  onItemClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [points, setPoints] = useState(() => 
    distributePointsInCircle(centerX, centerY, 0, itemCount) // 시작 시 중앙에 모두 위치
  );

  useEffect(() => {
    if (isExpanded) {
      setPoints(distributePointsInCircle(centerX, centerY, radius, itemCount));
    } else {
      setPoints(distributePointsInCircle(centerX, centerY, 0, itemCount));
    }
  }, [centerX, centerY, radius, itemCount, isExpanded]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleItemClick = (index: number) => {
    onItemClick?.(index);
  };
  
  return (
    <>
      {points.map((point, index) => (
        <UIComponent
          key={index}
          position={point}
          className={`ui-box ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
          }}
          onClick={() => handleItemClick(index)}
        >
          {t('button.start')}
        </UIComponent>
      ))}
    </>
  );
};