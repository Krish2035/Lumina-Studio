import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Gauge, Zap } from 'lucide-react';

/**
 * SpeedNode: A custom logic gate for controlling global animation velocity.
 * Using React.memo to prevent unnecessary re-renders during drag operations.
 */
export const SpeedNode = memo(({ data }: NodeProps) => {
  // 1. Selector-based store access for better performance
  const customSettings = useCanvasStore((state) => state.customSettings);
  const updateSetting = useCanvasStore((state) => state.updateSetting);

  // Safety fallback for velocity value
  const currentSpeed = customSettings?.speed ?? 1.0;

  return (
    <div className="group relative px-5 py-4 min-w-[210px] bg-[#0c0c0c]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 hover:border-blue-500/40">
      
      {/* Visual Ambient Glow (Animated via CSS) */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Connection Points: Source (Output) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-blue-500 !border-[3px] !border-[#0c0c0c] !-right-1.5 shadow-lg transition-transform hover:scale-125" 
      />

      {/* Connection Points: Target (Input Chain) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2 !h-2 !bg-white/20 !border-0 !-left-1 opacity-50 group-hover:opacity-100 transition-opacity" 
      />

      {/* Header Section */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
            <Gauge size={14} className="text-blue-400" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-none">
              {data?.label || "Speed Engine"}
            </span>
            <span className="text-[8px] font-bold text-blue-500/50 uppercase tracking-tighter">
              Velocity Scalar
            </span>
          </div>
        </div>
        <Zap size={12} className="text-white/10 group-hover:text-blue-500/40 transition-colors" />
      </div>

      {/* Interaction UI */}
      <div className="relative z-10 space-y-4">
        <div className="space-y-2">
          <input 
            type="range" 
            min="0.1" 
            max="5" 
            step="0.1"
            value={currentSpeed}
            onChange={(e) => updateSetting('speed', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all drag-handle"
          />
          
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-mono font-medium text-white/20 uppercase tracking-widest">Magnitude</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/5 rounded-md border border-blue-500/10 shadow-inner">
               <span className="text-[10px] font-mono font-bold text-blue-400">
                 {currentSpeed.toFixed(1)}
               </span>
               <span className="text-[8px] font-mono text-blue-400/40">x</span>
            </div>
          </div>
        </div>

        {/* Dynamic Status Bar (Visual Only) */}
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500/40 transition-all duration-300 ease-out"
            style={{ width: `${(currentSpeed / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
});

// Setting the display name for better debugging in React DevTools
SpeedNode.displayName = 'SpeedNode';