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

// 1. NODE CONFIGURATION
const nodeTypes: NodeTypes = { 
  speedControl: SpeedNode 
};

const initialNodes: Node[] = [
  { 
    id: 'node-1', 
    type: 'speedControl', 
    position: { x: 100, y: 100 }, 
    data: { label: 'Global Speed Engine' },
  }
];

export const NodeEditor = () => {
  const setNodeEditor = useCanvasStore((state) => state.setNodeEditor);

  const handleExit = useCallback(() => {
    setNodeEditor(false);
  }, [setNodeEditor]);

  return (
    <div className="absolute inset-0 z-[100] bg-[#050505]/90 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-500">
      <ReactFlow 
        nodeTypes={nodeTypes} 
        defaultNodes={initialNodes}
        fitView
        colorMode="dark"
        snapToGrid={true}
        snapGrid={[20, 20]}
        className="selection:bg-blue-500/20"
      >
        <Background 
          color="#333" 
          gap={25} 
          size={1} 
          variant="dots" 
          className="opacity-40" 
        />
        
        {/* Exit Panel */}
        <Panel position="top-left" className="m-6">
          <button 
            onClick={handleExit}
            className="group flex items-center gap-3 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl border border-red-500/20 backdrop-blur-md transition-all active:scale-95 shadow-lg shadow-red-500/5"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate Pro Mode</span>
          </button>
        </Panel>

        {/* Specs Panel */}
        <Panel position="top-right" className="m-6 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md border-b-blue-500/50">
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 text-right">Logic Engine</p>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            <p className="text-[10px] font-mono text-blue-400">v0.4.0-Alpha.prod</p>
          </div>
        </Panel>

        <Controls 
          showInteractive={false}
          className="bg-[#0c0c0c] border-white/10 fill-white rounded-xl overflow-hidden shadow-2xl" 
        />
      </ReactFlow>

      {/* Atmospheric Styling */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 border-4 border-blue-500/5 pointer-events-none z-20" />
    </div>
  );
};

export default NodeEditor;