import React, { useState, useCallback, useEffect, Suspense } from 'react';
const ZentrixCanvas = React.lazy(() => import('@components/ZentrixCanvas'));
const ComponentPanel = React.lazy(() => import('@components/ComponentPanel'));
const Toolbar = React.lazy(() => import('@components/Toolbar'));
const KeyboardShortcuts = React.lazy(() => import('@components/KeyboardShortcuts'));
const LayerPanel = React.lazy(() => import('@components/LayerPanel'));
const MenuBar = React.lazy(() => import('@components/MenuBar'));

import { createShape, moveShape, rotateShape, updateShape } from '@utils/DesignUtils';
import { getIconById } from '@utils/IconLoader';
import { keyboardManager } from '@utils/KeyboardManager';

const LoadingComponent = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
  </div>
);

const Zentrix: React.FC = () => {
  const [design, setDesign] = useState<ZentrixDesign>({
    id: 'demo-1',
    name: 'Zentrix Demo',
    canvas: {
      width: 1200,  // 캔버스 크기 증가
      height: 800,  // 캔버스 크기 증가
      background: '#f8fafc'
    },
    shapes: []
  });

  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [lastAction, setLastAction] = useState<{
    type: 'move' | 'rotate' | 'duplicate' | null;
    payload?: any;
  }>({ type: null });

  const handleComponentSelect = useCallback((componentId: string) => {
    const icon = getIconById(componentId);
    if (!icon) return;

    const center = {
      x: design.canvas.width / 2,
      y: design.canvas.height / 2
    };

    const newShape = createShape(
      icon.category === 'shape' ? componentId as ZentrixShape['type'] : 'rectangle',
      { x: center.x - 50, y: center.y - 50 },
      { width: 100, height: 100 }
    );

    setDesign(prev => ({
      ...prev,
      shapes: [...prev.shapes, newShape]
    }));
  }, [design.canvas.width, design.canvas.height]);

  const handleShapeClick = useCallback((shapeId: string) => {
    setSelectedShapeId(shapeId);
  }, []);

  const handleToolSelect = useCallback((toolId: string) => {
    setSelectedTool(toolId);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedShapeId) return;

    switch (e.key) {
      case 'ArrowLeft':
        setDesign(prev => moveShape(prev, selectedShapeId, -10, 0));
        setLastAction({ type: 'move', payload: { dx: -10, dy: 0 } });
        break;
      case 'ArrowRight':
        setDesign(prev => moveShape(prev, selectedShapeId, 10, 0));
        setLastAction({ type: 'move', payload: { dx: 10, dy: 0 } });
        break;
      case 'ArrowUp':
        setDesign(prev => moveShape(prev, selectedShapeId, 0, -10));
        setLastAction({ type: 'move', payload: { dx: 0, dy: -10 } });
        break;
      case 'ArrowDown':
        setDesign(prev => moveShape(prev, selectedShapeId, 0, 10));
        setLastAction({ type: 'move', payload: { dx: 0, dy: 10 } });
        break;
      case 'r':
        setDesign(prev => rotateShape(prev, selectedShapeId, 45));
        setLastAction({ type: 'rotate', payload: { angle: 45 } });
        break;
      case 'Delete':
      case 'Backspace':
        setDesign(prev => ({
          ...prev,
          shapes: prev.shapes.filter(s => s.id !== selectedShapeId)
        }));
        setSelectedShapeId(null);
        break;
    }
  }, [selectedShapeId]);

  const handleShapeDuplicate = useCallback((shapeId: string) => {
    const originalShape = design.shapes.find(s => s.id === shapeId);
    if (!originalShape) return;

    const newShape = {
      ...originalShape,
      id: crypto.randomUUID(),
      position: {
        x: originalShape.position.x + 20,
        y: originalShape.position.y + 20
      }
    };

    setDesign(prev => ({
      ...prev,
      shapes: [...prev.shapes, newShape]
    }));
    setLastAction({ type: 'duplicate' });
  }, [design.shapes]);

  const handleShapeRotate = useCallback((shapeId: string, angle: number) => {
    setDesign(prev => rotateShape(prev, shapeId, angle));
  }, []);

  const handleShapeDelete = useCallback((shapeId: string) => {
    setDesign(prev => ({
      ...prev,
      shapes: prev.shapes.filter(s => s.id !== shapeId)
    }));
    setSelectedShapeId(null);
  }, []);

  const handleLayerOrderChange = useCallback((shapeId: string, direction: 'up' | 'down') => {
    setDesign(prev => {
      const shapes = [...prev.shapes];
      const index = shapes.findIndex(s => s.id === shapeId);
      if (index === -1) return prev;

      if (direction === 'up' && index < shapes.length - 1) {
        [shapes[index], shapes[index + 1]] = [shapes[index + 1], shapes[index]];
      } else if (direction === 'down' && index > 0) {
        [shapes[index], shapes[index - 1]] = [shapes[index - 1], shapes[index]];
      }

      return { ...prev, shapes };
    });
  }, []);

  const handleGroupShapes = useCallback(() => {
    // 추후 구현: 선택된 여러 도형을 그룹화
    console.log('그룹화 기능 준비 중...');
  }, []);

  const handleUngroupShapes = useCallback(() => {
    // 추후 구현: 선택된 그룹 해제
    console.log('그룹 해제 기능 준비 중...');
  }, []);

  const handleShapeVisibilityToggle = useCallback((shapeId: string) => {
    setDesign(prev => ({
      ...prev,
      shapes: prev.shapes.map(shape =>
        shape.id === shapeId
          ? { ...shape, style: { ...shape.style, opacity: shape.style.opacity === 0 ? 1 : 0 } }
          : shape
      )
    }));
  }, []);

  const handleShapeUpdate = useCallback((shapeId: string, updates: Partial<ZentrixShape>) => {
    setDesign(prev => updateShape(prev, shapeId, updates));
  }, []);

  const handleNewDesign = useCallback(() => {
    setDesign({
      id: crypto.randomUUID(),
      name: '새 디자인',
      canvas: {
        width: 1200,
        height: 800,
        background: '#f8fafc'
      },
      shapes: []
    });
    setSelectedShapeId(null);
  }, []);

  const handleSaveDesign = useCallback(() => {
    const designString = JSON.stringify(design);
    const blob = new Blob([designString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.name}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }, [design]);

  const handleOpenDesign = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const design = JSON.parse(e.target?.result as string) as ZentrixDesign;
          setDesign(design);
          setSelectedShapeId(null);
        } catch (err) {
          console.error('디자인 파일을 불러오는데 실패했습니다:', err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleExportDesign = useCallback(() => {
    // SVG 내보내기 기능은 추후 구현
    console.log('SVG 내보내기 기능 준비 중...');
  }, []);

  const handleRepeatLastAction = useCallback(() => {
    if (!selectedShapeId || !lastAction.type) return;

    switch (lastAction.type) {
      case 'move':
        const { dx, dy } = lastAction.payload;
        setDesign(prev => moveShape(prev, selectedShapeId, dx, dy));
        break;
      case 'rotate':
        const { angle } = lastAction.payload;
        setDesign(prev => rotateShape(prev, selectedShapeId, angle));
        break;
      case 'duplicate':
        handleShapeDuplicate(selectedShapeId);
        break;
    }
  }, [selectedShapeId, lastAction, handleShapeDuplicate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 단축키 등록
  useEffect(() => {
    if (!selectedShapeId) return;

    keyboardManager.registerCommand(
      'd',
      () => handleShapeDuplicate(selectedShapeId),
      '선택된 도형 복제',
      { ctrl: true }
    );

    keyboardManager.registerCommand(
      'Delete',
      () => handleShapeDelete(selectedShapeId),
      '선택된 도형 삭제'
    );

    keyboardManager.registerCommand(
      'r',
      () => handleShapeRotate(selectedShapeId, 90),
      '선택된 도형 90도 회전'
    );

    keyboardManager.registerCommand(
      ']',
      () => handleLayerOrderChange(selectedShapeId, 'up'),
      '레이어 위로',
      { shift: true }
    );

    keyboardManager.registerCommand(
      '[',
      () => handleLayerOrderChange(selectedShapeId, 'down'),
      '레이어 아래로',
      { shift: true }
    );

    keyboardManager.registerCommand(
      'g',
      handleGroupShapes,
      '선택한 도형 그룹화',
      { ctrl: true }
    );

    keyboardManager.registerCommand(
      'g',
      handleUngroupShapes,
      '그룹 해제',
      { ctrl: true, shift: true }
    );

    keyboardManager.registerCommand(
      'y',
      handleRepeatLastAction,
      '마지막 작업 반복',
      { ctrl: true }
    );

    return () => {
      keyboardManager.unregisterCommand('d', { ctrl: true });
      keyboardManager.unregisterCommand('Delete');
      keyboardManager.unregisterCommand('r');
      keyboardManager.unregisterCommand(']', { shift: true });
      keyboardManager.unregisterCommand('[', { shift: true });
      keyboardManager.unregisterCommand('g', { ctrl: true });
      keyboardManager.unregisterCommand('g', { ctrl: true, shift: true });
      keyboardManager.unregisterCommand('y', { ctrl: true });
    };
  }, [selectedShapeId, handleShapeDuplicate, handleShapeDelete, handleShapeRotate, handleLayerOrderChange, handleGroupShapes, handleUngroupShapes, handleRepeatLastAction]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col">
      <Suspense fallback={<LoadingComponent />}>
        <MenuBar 
          onNew={handleNewDesign}
          onOpen={handleOpenDesign}
          onSave={handleSaveDesign}
          onExport={handleExportDesign}
        />
      </Suspense>
      <div className="flex flex-1 overflow-hidden">
        <Suspense fallback={<LoadingComponent />}>
          <ComponentPanel onSelectComponent={handleComponentSelect} />
        </Suspense>
        <div className="flex-1 flex flex-col">
          <Suspense fallback={<LoadingComponent />}>
            <Toolbar
              onToolSelect={handleToolSelect}
              selectedTool={selectedTool}
              onLayerOrderChange={handleLayerOrderChange}
              onGroupShapes={handleGroupShapes}
              onUngroupShapes={handleUngroupShapes}
              selectedShapeId={selectedShapeId}
            />
          </Suspense>
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="relative transform scale-90">
              <Suspense fallback={<LoadingComponent />}>
                <ZentrixCanvas
                  design={design}
                  onShapeClick={handleShapeClick}
                  onShapeDelete={handleShapeDelete}
                  onShapeRotate={handleShapeRotate}
                  onShapeDuplicate={handleShapeDuplicate}
                  onShapeUpdate={handleShapeUpdate}
                  selectedShapeId={selectedShapeId}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <Suspense fallback={<LoadingComponent />}>
          <LayerPanel
            shapes={design.shapes}
            selectedShapeId={selectedShapeId}
            onSelectShape={handleShapeClick}
            onLayerOrderChange={handleLayerOrderChange}
            onShapeVisibilityToggle={handleShapeVisibilityToggle}
          />
        </Suspense>
      </div>
      {selectedShapeId && (
        <div className="fixed bottom-4 left-72 ui-panel max-w-md">
          <p className="text-white mb-2">선택된 도형: {selectedShapeId}</p>
          <p className="text-white/70 text-sm">
            방향키: 이동 / R: 회전 / Delete: 삭제 / Ctrl+D: 복제<br />
            Shift+[/]: 레이어 순서 변경 / Space: 보이기/숨기기
          </p>
        </div>
      )}
      <Suspense fallback={<LoadingComponent />}>
        <KeyboardShortcuts shortcuts={[]} />
      </Suspense>
    </div>
  );
};

export default Zentrix;