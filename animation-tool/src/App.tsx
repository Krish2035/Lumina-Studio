import React, { useState, useEffect, useRef } from 'react';
import { useCanvasStore, type EffectType } from './store/useCanvasStore';
import { EffectManager } from './components/canvas/EffectManager';
import { Scene3D } from './components/canvas/Scene3D';
import { Editor } from './components/canvas/Editor';
import { Sidebar } from './components/ui/Sidebar'; 
import { Timeline } from './components/ui/Timeline';
import { StudioControls } from './components/ui/StudioControls';
import { NodeEditor } from './components/ui/NodeEditor';
import { Canvas } from '@react-three/fiber';
import { ChevronLeft, Maximize, Loader2, MousePointer2, Zap } from 'lucide-react';

/**
 * Optimized Preview with Intersection Observer.
 * Prevents WebGL context overload by only rendering visible previews.
 */
const EffectPreview = ({ type }: { type: EffectType }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
      {isVisible ? (
        <Canvas 
          camera={{ position: [0, 0, 15], fov: 50 }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <EffectManager forceEffect={type} isLite={true} />
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black/20 text-white/5">
          <Loader2 className="animate-spin" size={20} />
        </div>
      )}
    </div>
  );
};

function App() {
  const { 
    isEditorOpen, 
    isNodeEditorOpen,
    currentEffect, 
    openEditor, 
    closeEditor, 
    setMousePos 
  } = useCanvasStore();

  /**
   * GLOBAL MOUSE TRACKER: Standardized coordinates for Three.js
   */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMousePos]);

  const effects: { id: EffectType; label: string }[] = [
    { id: 'swirl', label: 'Swirl' }, { id: 'net', label: 'Net' },
    { id: 'birds', label: 'Birds' }, { id: 'snow', label: 'Snowfall' },
    { id: 'waves', label: 'Waves' }, { id: 'cells', label: 'Cells' },
    { id: 'blob', label: 'Blob' }, { id: 'metaballs', label: 'Metaballs' },
    { id: 'ink', label: 'Fluid Ink' }, { id: 'globe', label: 'Globe' },
    { id: 'dna', label: 'DNA Helix' }, { id: 'grid', label: 'Retro Grid' },
    { id: 'bg-grid', label: 'Infinite Grid' }, { id: 'voronoi', label: 'Voronoi' },
    { id: 'fractal', label: 'Fractal' }, { id: 'physics', label: 'Floating' },
    { id: 'clouds', label: 'Clouds' }, { id: 'fog', label: 'Fog' },
    { id: 'warp', label: 'Star Warp' }, { id: 'aurora', label: 'Aurora' },
    { id: 'bokeh', label: 'Bokeh' },
  ];

  const handleFullScreen = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    const element = document.getElementById(`container-${id}`);
    if (element?.requestFullscreen) element.requestFullscreen();
  };

  /**
   * LANDING PAGE VIEW
   */
  if (!isEditorOpen) {
    return (
      <main className="min-h-screen bg-[#050505] text-white p-12 overflow-y-auto selection:bg-blue-500/30">
        <header className="mb-16">
          <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Lumina <span className="text-blue-500">Studio</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-white/30 font-medium max-w-xl">
              Procedural Animation Engine • Build v0.4.0 <br/>
              Engineered for high-performance creative coding.
            </p>
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">System Online</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {effects.map((eff) => (
            <div 
              key={eff.id} 
              id={`container-${eff.id}`} 
              className="group relative aspect-[4/3] rounded-3xl border border-white/5 bg-[#0c0c0c] overflow-hidden hover:border-blue-500/50 transition-all duration-500"
            >
              <button 
                onClick={(e) => handleFullScreen(e, eff.id)}
                className="absolute top-4 right-4 z-30 p-2 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-blue-600 transition-all"
              >
                <Maximize size={16} />
              </button>

              <EffectPreview type={eff.id} />
              
              <div className="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col gap-3">
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 group-hover:text-blue-400 transition-colors">
                  {eff.label}
                </h3>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditor(eff.id);
                  }}
                  className="w-full py-3 bg-white/5 hover:bg-blue-600 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center gap-2 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                >
                  <Zap size={14} fill="currentColor" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Open Studio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  /**
   * STUDIO INTERFACE (ACTIVE SESSION)
   */
  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] text-white overflow-hidden relative selection:bg-blue-500/30">
      
      {/* 1. STUDIO HEADER */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#050505] z-[70]">
        <div className="flex items-center gap-4">
          <button onClick={closeEditor} className="p-2 hover:bg-white/5 rounded-full flex items-center gap-2 group transition-colors">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Exit Studio</span>
          </button>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">Project:</span>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest truncate max-w-[150px]">{currentEffect}</span>
          </div>
        </div>
        
        {/* Context-aware Controls (Top Right) */}
        <StudioControls />
      </header>

      {/* 2. PRODUCTION WORKSPACE */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* Dynamic Sidebar: Slides away when Node Editor is open for maximum canvas space */}
        <aside className={`transition-all duration-700 ease-in-out bg-[#080808] border-r border-white/5 z-50 ${isNodeEditorOpen ? '-translate-x-full w-0 opacity-0' : 'translate-x-0 w-auto opacity-100'}`}>
           <Sidebar />
        </aside>

        <div className="flex-1 relative bg-black overflow-hidden">
          {/* LAYER 0: The 3D Engine */}
          <Scene3D />

          {/* LAYER 1: Interactive Overlays */}
          {/* Note: pointer-events-none allows mouse interaction to reach Scene3D, 
              but children like NodeEditor can re-enable it for their own UI */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <div className="w-full h-full pointer-events-auto">
              {isNodeEditorOpen ? (
                <NodeEditor /> 
              ) : (
                <Editor /> /* Includes Konva layer and Studio Sliders */
              )}
            </div>
          </div>
          
          {/* LAYER 2: HUD (Heads-Up Display) */}
          <div className="absolute bottom-6 left-6 z-30 pointer-events-none">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl">
                 <MousePointer2 size={12} className="text-blue-500" />
                 <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest">
                   Engine Tracking: Active
                 </span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 backdrop-blur-md rounded-md border border-blue-500/20 w-fit">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">
                   {isNodeEditorOpen ? "Pro Mode • Logic Engine" : "Studio Mode • Canvas"}
                 </span>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. STUDIO TIMELINE (Bottom Layer) */}
      <footer className="h-48 border-t border-white/5 bg-[#0a0a0a] z-[60] relative">
        <Timeline />
      </footer>
    </div>
  );
}

export default App;