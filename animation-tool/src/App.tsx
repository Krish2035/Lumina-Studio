import React, { useState, useEffect, useRef } from 'react';
import { useCanvasStore, type EffectType } from './store/useCanvasStore';
import { Scene3D } from './components/canvas/Scene3D';
import { Editor } from './components/canvas/Editor';
import { Sidebar } from './components/ui/Sidebar'; 
import { Timeline } from './components/ui/Timeline';
import { StudioControls } from './components/ui/StudioControls';
import { NodeEditor } from './components/ui/NodeEditor';
import { EffectManager } from './components/canvas/EffectManager';
import { Canvas } from '@react-three/fiber';
import { ChevronLeft, Loader2, Zap, Menu, X } from 'lucide-react';

/**
 * Preview helper for the selection screen grid.
 * Optimized with IntersectionObserver to save GPU memory.
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
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }} gl={{ antialias: false }}>
          <ambientLight intensity={0.5} />
          {/* Lite version of the effect for grid previews */}
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
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global mouse tracking for interactive effects
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
    { id: 'swirl', label: 'Swirl' }, { id: 'net', label: 'Net' }, { id: 'birds', label: 'Birds' }, 
    { id: 'snow', label: 'Snowfall' }, { id: 'waves', label: 'Waves' }, { id: 'cells', label: 'Cells' },
    { id: 'blob', label: 'Blob' }, { id: 'metaballs', label: 'Metaballs' }, { id: 'ink', label: 'Fluid Ink' }, 
    { id: 'globe', label: 'Globe' }, { id: 'dna', label: 'DNA Helix' }, { id: 'grid', label: 'Retro Grid' },
    { id: 'voronoi', label: 'Voronoi' }, { id: 'physics', label: 'Floating' }, { id: 'clouds', label: 'Clouds' }, 
    { id: 'warp', label: 'Star Warp' }, { id: 'bokeh', label: 'Bokeh' },
  ];

  // 1. SELECTION SCREEN (GRID VIEW)
  if (!isEditorOpen) {
    return (
      <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
            Lumina <span className="text-blue-500">Studio</span>
          </h1>
          <p className="text-white/30 font-medium max-w-xl text-sm md:text-base">
            Procedural Animation Engine • Build v0.4.0
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {effects.map((eff) => (
            <div key={eff.id} className="group relative aspect-video rounded-2xl border border-white/5 bg-[#0c0c0c] overflow-hidden">
              <EffectPreview type={eff.id} />
              <div className="absolute inset-x-0 bottom-0 p-4 z-20 bg-gradient-to-t from-black flex flex-col gap-3">
                <h3 className="text-[10px] font-bold uppercase text-white/40">{eff.label}</h3>
                <button 
                  onClick={() => openEditor(eff.id)} 
                  className="w-full py-3 bg-white/5 md:hover:bg-blue-600 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Zap size={14} fill="currentColor" />
                  <span className="text-[10px] font-bold uppercase">Open Studio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // 2. STUDIO VIEW (EDITOR)
  return (
    <div className="h-screen w-full flex flex-col bg-black text-white overflow-hidden relative">
      {/* HEADER SECTION */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 shrink-0 bg-[#050505] z-50">
        <div className="flex items-center gap-2">
          <button onClick={closeEditor} className="p-2 hover:bg-white/5 rounded-full pointer-events-auto">
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[8px] text-white/20 uppercase tracking-widest">Project:</span>
            <span className="text-xs font-bold text-blue-500 uppercase truncate max-w-[80px] md:max-w-none">
              {currentEffect}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden md:block"><StudioControls /></div>
          <button 
            className="md:hidden p-2 bg-white/5 rounded-lg" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* VIEWPORT SECTION */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDEBAR OVERLAY: Uses backdrop-blur to show animation underneath */}
        <aside className={`
          fixed md:relative inset-y-0 left-0 z-40 w-72 bg-[#080808]/90 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isNodeEditorOpen ? 'md:hidden' : 'md:block'}
        `}>
          <Sidebar />
        </aside>

        {/* MAIN CANVAS AREA */}
        <main className="flex-1 relative bg-black overflow-hidden h-full">
          {/* Layer 0: The 3D Scene (Background) 
              The 'key' ensures Three.js reloads the WebGL context when switching effects */}
          <div className="absolute inset-0 z-0">
            <Scene3D key={currentEffect} />
          </div>
          
          {/* Layer 1: Interactive UI Overlay
              pointer-events-none allows clicks to pass through to Layer 0 (the Canvas) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="w-full h-full pointer-events-auto overflow-hidden">
              {isNodeEditorOpen ? <NodeEditor /> : <Editor />}
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER SECTION */}
      <footer className="h-28 md:h-36 border-t border-white/5 bg-[#0a0a0a] shrink-0 z-50">
        <Timeline />
      </footer>
    </div>
  );
}

export default App;