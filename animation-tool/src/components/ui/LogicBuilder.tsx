import { useCanvasStore, type TriggerAction, type ThemeType } from '../../store/useCanvasStore';
import { Plus, Trash2, Zap } from 'lucide-react';

export const LogicBuilder = () => {
  const { selectedId, project, addTrigger, updateShape, setTheme } = useCanvasStore();
  
  // Find the currently selected shape data
  const selectedShape = project.shapes.find(s => s.id === selectedId);

  if (!selectedId || !selectedShape) {
    return <div className="p-4 text-white/40 italic">Select an object to add logic...</div>;
  }

  const addNewTrigger = () => {
    // Default: On Click -> Toggle Physics
    addTrigger(selectedId, { 
      event: 'onClick', 
      action: 'togglePhysics' 
    });
  };

  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
          <Zap size={14} /> Interaction Logic
        </h3>
        <button 
          onClick={addNewTrigger}
          className="p-1 hover:bg-blue-500/20 rounded text-blue-400 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-3">
        {selectedShape.triggers?.map((trigger: any, index: number) => (
          <div key={index} className="p-3 bg-black/40 rounded-lg border border-white/5 text-xs space-y-2">
            <div className="flex justify-between items-center text-white/60">
              <span>Trigger {index + 1}</span>
              <button className="text-red-400/50 hover:text-red-400"><Trash2 size={12} /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <select 
                className="bg-white/5 border border-white/10 rounded p-1 text-white"
                value={trigger.event}
              >
                <option value="onClick">On Click</option>
                <option value="onHover">On Hover</option>
              </select>

              <select 
                className="bg-white/5 border border-white/10 rounded p-1 text-white"
                value={trigger.action}
                onChange={(e) => {
                  // Logic to update the specific trigger action
                }}
              >
                <option value="togglePhysics">Gravity On/Off</option>
                <option value="changeTheme">Swap Theme</option>
                <option value="changeColor">Change Color</option>
              </select>
            </div>

            {trigger.action === 'changeTheme' && (
              <select 
                className="w-full bg-blue-600/20 border border-blue-500/30 rounded p-1 text-blue-200 mt-1"
                onChange={(e) => {
                  // Update trigger value to the selected theme
                }}
              >
                <option value="cyberpunk">Cyberpunk</option>
                <option value="vaporwave">Vaporwave</option>
                <option value="emerald">Emerald</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};