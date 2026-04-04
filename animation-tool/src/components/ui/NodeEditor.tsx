import React, { useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Panel, 
  type Node, 
  type NodeTypes 
} from 'reactflow';
import { useCanvasStore } from '../../store/useCanvasStore';
import { SpeedNode } from '../nodes/SpeedNode';
import 'reactflow/dist/style.css';

/**
 * 1. NODE CONFIGURATION
 * Defined outside the component to prevent expensive re-renders 
 * of the React Flow canvas.
 */
const nodeTypes: NodeTypes = { 
  speedControl: SpeedNode 
};

const initialNodes: Node[] = [
  { 
    id: 'node-1', 
    type: 'speedControl', 
    position: { x: 250, y: 150 }, 
    data: { label: 'Global Speed Engine' },
    dragHandle: '.drag-handle', // Optional: if you add a specific drag handle later
  }
];

export const NodeEditor = () => {
  /**
   * 2. STORE CONNECTION
   * Using a selector prevents this entire editor from re-rendering 
   * when unrelated canvas settings change.
   */
  const setNodeEditor = useCanvasStore((state) => state.setNodeEditor);

  // Memoized close handler for performance
  const handleExit = useCallback(() => {
    setNodeEditor(false);
  }, [setNodeEditor]);

  return (
    <div className="absolute inset-0 z-[100] bg-[#050505]/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
      <ReactFlow 
        nodeTypes={nodeTypes} 
        defaultNodes={initialNodes}
        fitView
        colorMode="dark"
        // Snap to grid makes the "Pro" mode feel more precise
        snapToGrid={true}
        snapGrid={[20, 20]}
        className="selection:bg-blue-500/20"
      >
        {/* Visual Grid System */}
        <Background 
          color="#222" 
          gap={25} 
          size={1} 
          variant="dots" 
          className="opacity-50" 
        />
        
        {/* UI Overlay: Terminate Button */}
        <Panel position="top-left" className="m-6">
          <button 
            onClick={handleExit}
            className="group flex items-center gap-3 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl border border-red-500/20 backdrop-blur-md transition-all shadow-[0_0_30px_rgba(239,68,68,0.15)] active:scale-95"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate Pro Mode</span>
          </button>
        </Panel>

        {/* UI Overlay: Version Specs */}
        <Panel position="top-right" className="m-6 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md border-b-blue-500/50">
           <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 text-right">Logic Engine</p>
           <div className="flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-blue-500" />
             <p className="text-[10px] font-mono text-blue-400">v0.4.0-Alpha.prod</p>
           </div>
        </Panel>

        {/* Engine Controls */}
        <Controls 
          showInteractive={false}
          className="bg-black/80 border-white/10 fill-white rounded-xl overflow-hidden backdrop-blur-md" 
        />
      </ReactFlow>

      {/* 3. ATMOSPHERIC SHADOW
          Creates a depth effect making the nodes look like they are floating in a 3D space */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-10" />
      
      {/* 4. EDGE GLOW
          Subtle blue border around the entire screen to signify "Active Logic Mode" */}
      <div className="absolute inset-0 border-2 border-blue-500/5 pointer-events-none z-20" />
    </div>
  );
};