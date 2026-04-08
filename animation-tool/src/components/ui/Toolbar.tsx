import { useState } from 'react';
import { Square, Circle, Save, MousePointer2, Loader2, Box } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { projectService } from '../../services/projectService';

export const Toolbar = () => {
  const { project, theme, setSelectedId, selectedId } = useCanvasStore();
  const [isSaving, setIsSaving] = useState(false);

  const addNewShape = (type: 'box' | 'sphere' | 'model') => {
    const id = crypto.randomUUID();
    const newShape = {
      id,
      type,
      x: 0, y: 2, z: 0,
      rotationX: 0, rotationY: 0, rotationZ: 0,
      scale: 1,
      fill: '#3b82f6',
      opacity: 1,
      blur: 0,
      isPhysicsEnabled: false,
      triggers: []
    };

    useCanvasStore.setState((state) => ({
      project: {
        ...state.project,
        shapes: [...state.project.shapes, newShape]
      }
    }));
    
    setSelectedId(id);
  };

  const handleDatabaseSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        _id: project._id,
        name: project.name,
        theme: theme,
        shapes: project.shapes,
        keyframes: project.keyframes
      };
      const response = await projectService.saveProject(payload);
      useCanvasStore.setState((state) => ({
        project: { ...state.project, _id: response._id }
      }));
    } catch (error) {
      console.error("Save failed:", error);
      alert("Database Error: Check connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    /* Increased gap and padding for better mobile touch accuracy */
    <div className="flex items-center gap-2 md:gap-1 bg-black/60 backdrop-blur-xl p-2 md:p-1.5 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto max-w-fit mx-auto md:mx-0">
      
      {/* Selection Tool */}
      <button 
        onClick={() => setSelectedId(null)}
        className={`p-2.5 md:p-2 rounded-lg transition-all ${!selectedId ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
        title="Select Mode"
      >
        <MousePointer2 size={18} />
      </button>
      
      <div className="w-px h-6 md:h-5 bg-white/10 mx-1" />

      {/* Geometry Adders */}
      <button 
        onClick={() => addNewShape('box')} 
        className="p-2.5 md:p-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all"
        title="Add Box"
      >
        <Square size={18} />
      </button>

      <button 
        onClick={() => addNewShape('sphere')} 
        className="p-2.5 md:p-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all"
        title="Add Sphere"
      >
        <Circle size={18} />
      </button>

      {/* Added Model Icon for clarity on mobile */}
      <button 
        onClick={() => addNewShape('model')} 
        className="p-2.5 md:p-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all hidden sm:block"
        title="Add Model"
      >
        <Box size={18} />
      </button>

      <div className="w-px h-6 md:h-5 bg-white/10 mx-1" />

      {/* Cloud Save */}
      <button 
        onClick={handleDatabaseSave} 
        disabled={isSaving}
        className={`p-2.5 md:p-2 rounded-lg transition-all ${
          isSaving 
          ? 'text-white/20' 
          : 'text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-400/10'
        }`}
        title="Save to Cloud"
      >
        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
      </button>
    </div>
  );
};