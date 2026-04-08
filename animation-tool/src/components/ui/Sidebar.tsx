import { Trash2, Layers, Monitor, X } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const Sidebar = () => {
  const { 
    project, selectedId, updateShape, deleteShape, currentTime, 
    addKeyframe, performanceMode, setPerformanceMode, setSelectedId 
  } = useCanvasStore();

  const selectedShape = project.shapes.find((s) => s.id === selectedId);

  return (
    <aside className="w-full h-full bg-[#0a0a0a] flex flex-col text-slate-300 overflow-hidden">
      <div className="flex border-b border-white/5 bg-black/20 items-center justify-between px-4 shrink-0">
        <div className="py-4 text-[10px] uppercase font-bold text-white tracking-widest border-b-2 border-blue-500">
          Inspector
        </div>
        <button onClick={() => setSelectedId(null)} className="md:hidden p-2 text-white/40"><X size={18}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        <section>
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/50 mb-4 flex items-center gap-2">
            <Monitor size={12} /> Performance
          </h4>
          <div className="flex bg-white/5 p-1 rounded-xl gap-1">
            {(['high', 'lite'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setPerformanceMode(mode)}
                className={`flex-1 py-2 text-[10px] uppercase font-bold rounded-lg transition-all ${
                  performanceMode === mode ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30'
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={12} className="text-blue-500" />
                  <h4 className="text-[10px] uppercase font-bold text-white/50">Transform</h4>
                </div>
                <button onClick={() => deleteShape(selectedShape.id)} className="text-red-500/50 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['x', 'y', 'z'].map((axis) => (
                  <div key={axis} className="bg-white/5 rounded-lg p-2 border border-white/5">
                    <label className="text-[9px] uppercase text-white/30 block mb-1">{axis}</label>
                    <input 
                      type="number" step="0.1"
                      value={(selectedShape as any)[axis] || 0}
                      onChange={(e) => updateShape(selectedShape.id, { [axis]: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-transparent text-[10px] font-mono text-blue-400 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </section>
            <button 
              onClick={() => addKeyframe(selectedShape.id, currentTime, selectedShape)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] uppercase font-bold tracking-widest"
            >
              Add Keyframe
            </button>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-white/10">
            <span className="text-[9px] uppercase tracking-widest text-center px-4">Select an object to inspect</span>
          </div>
        )}
      </div>
    </aside>
  );
};