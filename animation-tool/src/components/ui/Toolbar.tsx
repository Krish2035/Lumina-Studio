import { useState } from 'react';
import { Square, Circle, Save, MousePointer2, Loader2 } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { projectService } from '../../services/projectService';

export const Toolbar = () => {
  // Pulling actions and state from your updated Zustand store
  const { 
    project, 
    theme, 
    updateShape, 
    selectedId, 
    setSelectedId 
  } = useCanvasStore();

  const [isSaving, setIsSaving] = useState(false);

  /**
   * ADDS A NEW SHAPE
   * Generates a unique ID and sets up default properties for 3D space.
   */
  const addNewShape = (type: 'box' | 'sphere' | 'model') => {
    const id = crypto.randomUUID();
    
    // We use updateShape with a new object to push to the shapes array
    // Note: In your store, this is handled by a specific 'addShape' or 'addModel' logic.
    // Here we'll follow the pattern of your addModel logic from the store.
    const newShape = {
      id,
      type,
      x: 0,
      y: 2, // Start slightly above the floor
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      fill: '#3b82f6',
      opacity: 1,
      blur: 0,
      isPhysicsEnabled: false,
      triggers: []
    };

    // Assuming you have an 'addShape' action in your store as seen in your previous snippet
    // If not, you can use the 'updateShape' logic to append to the shapes array.
    useCanvasStore.setState((state) => ({
      project: {
        ...state.project,
        shapes: [...state.project.shapes, newShape]
      }
    }));
    
    setSelectedId(id);
  };

  /**
   * MERN SAVE HANDLER
   * Sends the entire scene (shapes, keyframes, theme) to the Node.js server.
   */
  const handleDatabaseSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const payload = {
        _id: project._id, // MongoDB ID if it already exists
        name: project.name,
        theme: theme,
        shapes: project.shapes,
        keyframes: project.keyframes
      };

      const response = await projectService.saveProject(payload);
      
      // If this was a new project, MongoDB generated an _id. 
      // We save it back to our local state so next save updates the same record.
      useCanvasStore.setState((state) => ({
        project: { ...state.project, _id: response._id }
      }));

      console.log("✅ Project synchronized with MongoDB");
    } catch (error) {
      console.error("❌ Save failed:", error);
      alert("Database connection failed. Is your server running on port 5000?");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-2xl">
      {/* Selection Tool */}
      <button 
        onClick={() => setSelectedId(null)}
        className={`p-2 rounded-lg transition-all ${!selectedId ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
      >
        <MousePointer2 size={18} />
      </button>
      
      <div className="w-px h-5 bg-white/10 mx-1" />

      {/* Geometry Adders */}
      <button 
        onClick={() => addNewShape('box')} 
        className="p-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all active:scale-95"
        title="Add Box"
      >
        <Square size={18} />
      </button>

      <button 
        onClick={() => addNewShape('sphere')} 
        className="p-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white transition-all active:scale-95"
        title="Add Sphere"
      >
        <Circle size={18} />
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      {/* MERN Save Action */}
      <button 
        onClick={handleDatabaseSave} 
        disabled={isSaving}
        className={`p-2 rounded-lg transition-all flex items-center justify-center ${
          isSaving 
          ? 'text-white/20 cursor-not-allowed' 
          : 'text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-400/10'
        }`}
        title="Save to Cloud"
      >
        {isSaving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Save size={18} />
        )}
      </button>
    </div>
  );
};