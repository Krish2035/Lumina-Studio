import { Box, MousePointer2, Workflow, Layout, Database } from 'lucide-react';

export const EngineSpecs = () => {
  const layers = [
    { 
      id: 4, 
      name: "State Management", 
      tech: "Zustand", 
      desc: "The single source of truth connecting all layers.",
      icon: <Database size={16} />,
      color: "text-purple-400",
      border: "border-purple-500/30"
    },
    { 
      id: 3, 
      name: "Interface Overlay", 
      tech: "Tailwind CSS", 
      desc: "Studio glassmorphism UI, sliders, and navigation.",
      icon: <Layout size={16} />,
      color: "text-pink-400",
      border: "border-pink-500/30"
    },
    { 
      id: 2, 
      name: "Logic Engine", 
      tech: "React Flow", 
      desc: "The 'Pro Mode' Node Editor for visual programming.",
      icon: <Workflow size={16} />,
      color: "text-blue-400",
      border: "border-blue-500/30"
    },
    { 
      id: 1, 
      name: "Interaction Layer", 
      tech: "React-Konva", 
      desc: "2D Canvas overlay for selecting and dragging objects.",
      icon: <MousePointer2 size={16} />,
      color: "text-emerald-400",
      border: "border-emerald-500/30"
    },
    { 
      id: 0, 
      name: "3D Core", 
      tech: "Three.js / R3F", 
      desc: "Mathematical particle systems and custom GLSL shaders.",
      icon: <Box size={16} />,
      color: "text-orange-400",
      border: "border-orange-500/30"
    },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-md p-6 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10">
      <div className="mb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">System Architecture</h3>
        <p className="text-xl font-black italic uppercase tracking-tighter">Lumina <span className="text-blue-500">Stack</span></p>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => (
          <div 
            key={layer.id}
            className={`group p-4 bg-white/[0.02] border ${layer.border} rounded-2xl transition-all hover:bg-white/[0.05] hover:-translate-y-1 cursor-default`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <span className={layer.color}>{layer.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                  Layer {layer.id}: {layer.name}
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/20">{layer.tech}</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed group-hover:text-white/70 transition-colors">
              {layer.desc}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] font-bold uppercase text-white/20">Build Status: Stable</span>
        <span className="text-[8px] font-mono text-blue-500/50">v0.4.2-STABLE</span>
      </div>
    </div>
  );
};