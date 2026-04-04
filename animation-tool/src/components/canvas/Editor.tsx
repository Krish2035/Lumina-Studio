import { Stage, Layer, Rect, Circle } from 'react-konva';
import { useCanvasStore } from '../../store/useCanvasStore';
import { getInterpolatedValue } from '../../utils/interpolate';
import { useEffect, useState } from 'react';
import { Settings2, Zap, Sliders, Palette } from 'lucide-react';

/**
 * CUSTOMIZATION PANEL: The UI for tweaking animation settings
 */
const CustomizationHub = () => {
  const { customSettings, updateSetting, currentEffect } = useCanvasStore();

  const controlGroups = [
    { label: 'Motion', icon: <Zap size={12} />, key: 'speed', min: 0.1, max: 5, step: 0.1 },
    { label: 'Energy', icon: <Sliders size={12} />, key: 'intensity', min: 0.1, max: 3, step: 0.1 },
    { label: 'Density', icon: <Settings2 size={12} />, key: 'particleCount', min: 50, max: 5000, step: 50 },
  ];

  return (
    <div className="absolute top-6 right-6 w-64 z-50 pointer-events-auto flex flex-col gap-3">
      <div className="p-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <Settings2 size={14} className="text-blue-500" />
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
            {currentEffect} Lab
          </h4>
        </div>

        <div className="space-y-5">
          {controlGroups.map((group) => (
            <div key={group.key} className="space-y-2">
              <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-white/40">
                <span className="flex items-center gap-2">{group.icon} {group.label}</span>
                <span className="text-blue-400">{(customSettings as any)[group.key]}</span>
              </div>
              <input 
                type="range"
                min={group.min}
                max={group.max}
                step={group.step}
                value={(customSettings as any)[group.key]}
                onChange={(e) => updateSetting(group.key as any, parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
              />
            </div>
          ))}

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest text-white/40">
               <span className="flex items-center gap-2"><Palette size={12}/> Color</span>
            </div>
            <div className="flex gap-2">
              {['#3b82f6', '#10b981', '#f43f5e', '#a855f7', '#f59e0b'].map((color) => (
                <button
                  key={color}
                  onClick={() => updateSetting('color', color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${customSettings.color === color ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Editor = () => {
  const { project, updateShape, selectedId, setSelectedId, currentTime } = useCanvasStore();
  
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight - 112 
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 112
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      {/* 1. THE CUSTOMIZATION UI (Always accessible) */}
      <CustomizationHub />

      {/* 2. THE KONVA INTERACTION LAYER */}
      <Stage 
        width={dimensions.width} 
        height={dimensions.height}
        className="absolute inset-0 z-20 pointer-events-none" // Initial pass-through
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) setSelectedId(null);
        }}
      >
        <Layer>
          {project.shapes.sort((a,b) => a.zIndex - b.zIndex).map((shape) => {
            const shapeKeyframes = project.keyframes[shape.id] || [];
            const animatedProps = getInterpolatedValue(currentTime, shapeKeyframes, shape);

            const commonProps = {
              key: shape.id,
              ...animatedProps,
              draggable: true,
              listening: true, 
              // Enable pointer events only for the shapes
              style: { pointerEvents: 'auto' },
              
              onClick: (e: any) => { 
                e.cancelBubble = true; 
                setSelectedId(shape.id); 
              },
              onDragEnd: (e: any) => {
                updateShape(shape.id, { x: e.target.x(), y: e.target.y() });
              },
              
              shadowBlur: animatedProps.blur,
              shadowColor: typeof animatedProps.fill === 'string' ? animatedProps.fill : '#fff',
              shadowOpacity: 0.8,
              stroke: selectedId === shape.id ? '#60a5fa' : 'transparent',
              strokeWidth: selectedId === shape.id ? 2 : 0,
              dash: [10, 5],
            };

            const { scale, ...restProps } = commonProps as any;

            return shape.type === 'rect' ? (
              <Rect {...restProps} scaleX={scale} scaleY={scale} />
            ) : (
              <Circle {...restProps} scaleX={scale} scaleY={scale} radius={(animatedProps.width || 150) / 2} />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};