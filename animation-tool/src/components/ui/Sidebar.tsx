import { Trash2, Key, Box, Layers, Wind, Activity, Disc, Cloud, Code, Zap, Monitor } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const Sidebar = () => {
  const { 
    project, selectedId, updateShape, deleteShape, currentTime, 
    addKeyframe, currentEffect, setEffect, performanceMode, setPerformanceMode 
  } = useCanvasStore();

  const selectedShape = project.shapes.find((s) => s.id === selectedId);

  const copyCode = () => {
    const snippet = `// Lumina Studio Export: ${currentEffect}\n<EffectManager currentEffect="${currentEffect}" isLite={${performanceMode === 'lite'}} />`;
    navigator.clipboard.writeText(snippet);
    alert("React component code copied!");
  };

  return (
    <aside className="w-72 h-full bg-[#0a0a0a] border-l border-white/5 flex flex-col text-slate-300">
      <div className="flex border-b border-white/5 bg-black/20">
        <div className="flex-1 py-4 text-center border-b-2 border-blue-500 text-[10px] uppercase font-bold text-white tracking-widest">Inspector</div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        {/* Performance & Stress Test Section */}
        <section>
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mb-4 flex items-center gap-2">
            <Monitor size={12} /> Performance
          </h4>
          <div className="flex bg-white/5 p-1 rounded-xl gap-1">
            {(['high', 'lite'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPerformanceMode(mode)}
                className={`flex-1 py-2 text-[9px] uppercase font-bold rounded-lg transition-all ${
                  performanceMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {selectedShape ? (
          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Layers size={12} className="text-blue-500" />
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">Transform</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['x', 'y', 'z'].map((axis) => (
                  <div key={axis} className="bg-white/5 rounded-lg p-2 border border-white/5">
                    <label className="text-[9px] uppercase text-white/30 block mb-1">{axis}</label>
                    <input 
                      type="number" step="0.1"
                      value={(selectedShape as any)[axis] || 0}
                      onChange={(e) => updateShape(selectedShape.id, { [axis]: parseFloat(e.target.value) })}
                      className="w-full bg-transparent text-xs font-mono text-blue-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </section>

            <button 
              onClick={() => addKeyframe(selectedShape.id, currentTime, selectedShape)}
              className="w-full py-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] uppercase tracking-widest text-blue-400 flex items-center justify-center gap-2"
            >
              <Key size={14} /> Add Keyframe
            </button>
          </div>
        ) : null}

        {/* Developer Export Section */}
        <section className="pt-6 border-t border-white/5">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mb-4">Dev Tools</h4>
          <div className="space-y-2">
            <button onClick={copyCode} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase tracking-widest text-white/60 hover:bg-white/10 flex items-center justify-center gap-2">
              <Code size={14} /> Copy JSX Snippet
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
};