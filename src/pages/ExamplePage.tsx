import React, { useState, useCallback, useEffect } from 'react';
import { ZentrixCanvas } from '@components/ZentrixCanvas';
import { ComponentPanel } from '@components/ComponentPanel';
import { Toolbar } from '@components/Toolbar';
import { KeyboardShortcuts } from '@components/KeyboardShortcuts';
import { createShape, moveShape, rotateShape, updateShape } from '@utils/DesignUtils';
import { getIconById } from '@utils/IconLoader';
import { keyboardManager } from '@utils/KeyboardManager';

export const ExamplePage: React.FC = () => {
  const [design, setDesign] = useState<ZentrixDesign>({
    id: 'demo-1',
    name: 'Zentrix Demo',
    canvas: {
      width: 800,
      height: 600,
      background: '#f8fafc'
    },
    shapes: []
  });

  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');

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
        break;
      case 'ArrowRight':
        setDesign(prev => moveShape(prev, selectedShapeId, 10, 0));
        break;
      case 'ArrowUp':
        setDesign(prev => moveShape(prev, selectedShapeId, 0, -10));
        break;
      case 'ArrowDown':
        setDesign(prev => moveShape(prev, selectedShapeId, 0, 10));
        break;
      case 'r':
        setDesign(prev => rotateShape(prev, selectedShapeId, 45));
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

    return () => {
      keyboardManager.unregisterCommand('d', { ctrl: true });
      keyboardManager.unregisterCommand('Delete');
      keyboardManager.unregisterCommand('r');
    };
  }, [selectedShapeId, handleShapeDuplicate, handleShapeDelete, handleShapeRotate]);

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      <ComponentPanel onSelectComponent={handleComponentSelect} />
      <Toolbar onToolSelect={handleToolSelect} selectedTool={selectedTool} />
      
      <main className="ml-64 p-4 flex items-center justify-center min-h-screen">
        <div className="relative">
          <ZentrixCanvas
            design={design}
            onShapeClick={handleShapeClick}
            onShapeDelete={handleShapeDelete}
            onShapeRotate={handleShapeRotate}
            onShapeDuplicate={handleShapeDuplicate}
          />
        </div>
      </main>
      
      {selectedShapeId && (
        <div className="fixed bottom-4 left-72 ui-panel">
          <p className="text-white mb-2">선택된 도형: {selectedShapeId}</p>
          <p className="text-white/70 text-sm">
            방향키: 이동 / R: 회전 / Delete: 삭제 / Ctrl+D: 복제
          </p>
        </div>
      )}

      <KeyboardShortcuts />
    </div>
  );
};