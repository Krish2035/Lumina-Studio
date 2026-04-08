import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { useCanvasStore } from '../../store/useCanvasStore';
import { getInterpolatedValue } from '../../utils/interpolate';
import { Settings2, ChevronDown } from 'lucide-react';

/**
 * Floating UI for adjusting global effect parameters.
 */
const CustomizationHub = () => {
  const { customSettings, updateSetting, currentEffect } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`
      absolute top-4 right-4 z-[60] transition-all duration-300
      ${isOpen ? 'w-72' : 'w-12 h-12'}
    `}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-600/40 hover:scale-110 transition-transform"
        >
          <Settings2 size={20} />
        </button>
      ) : (
        <div className="p-5 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">{currentEffect} Lab</h4>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <ChevronDown size={16}/>
            </button>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Motion Speed', key: 'speed', min: 0.1, max: 5 },
              { label: 'Effect Energy', key: 'intensity', min: 0.1, max: 3 },
            ].map((group) => (
              <div key={group.key} className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                  <span>{group.label}</span>
                  <span className="text-blue-400">{(customSettings as any)[group.key]}</span>
                </div>
                <input 
                  type="range" min={group.min} max={group.max} step="0.1"
                  value={(customSettings as any)[group.key]}
                  onChange={(e) => updateSetting(group.key as any, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-blue-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Editor = () => {
  const { project, updateShape, selectedId, setSelectedId, currentTime } = useCanvasStore();
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight - 180 
  });

  useEffect(() => {
    const updateSize = () => {
      const offset = window.innerWidth < 768 ? 250 : 144; // Sync with footer height
      setDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight - offset 
      });
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <CustomizationHub />
      
      <Stage 
        width={dimensions.width} 
        height={dimensions.height} 
        onMouseDown={(e) => e.target === e.target.getStage() && setSelectedId(null)}
      >
        <Layer>
          {project.shapes.map((shape) => {
            const animatedProps = getInterpolatedValue(currentTime, project.keyframes[shape.id] || [], shape);
            
            const commonProps = {
              ...animatedProps,
              id: shape.id,
              draggable: true,
              onClick: () => setSelectedId(shape.id),
              onDragEnd: (e: any) => updateShape(shape.id, { x: e.target.x(), y: e.target.y() }),
              stroke: selectedId === shape.id ? '#3b82f6' : 'transparent',
              strokeWidth: 3,
              cornerRadius: shape.type === 'rect' ? 8 : 0,
            };

            return shape.type === 'rect' ? (
              <Rect key={shape.id} {...commonProps} />
            ) : (
              <Circle 
                key={shape.id} 
                {...commonProps} 
                radius={(animatedProps.width || 100) / 2} 
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};