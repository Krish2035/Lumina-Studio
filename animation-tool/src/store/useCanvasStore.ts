import { create } from 'zustand';

/**
 * 3D ENVIRONMENT & LOGIC TYPES
 */
export type EffectType = 
  | 'swirl' | 'net' | 'birds' | 'snow' | 'waves' | 'cells' | 'blob' 
  | 'metaballs' | 'ink' | 'globe' | 'dna' | 'grid' | 'bg-grid' 
  | 'voronoi' | 'fractal' | 'physics' | 'clouds' | 'fog' | 'warp' | 'aurora' | 'bokeh';

export type ThemeType = 'default' | 'cyberpunk' | 'vaporwave' | 'minimal' | 'emerald';

export type TriggerAction = 'togglePhysics' | 'changeTheme' | 'changeColor' | 'changeEffect';

export interface Trigger {
  event: 'onClick' | 'onHover';
  action: TriggerAction;
  value?: any;
}

export interface EffectSettings {
  speed: number;
  intensity: number;
  particleCount: number;
  color: string;
  radius: number;
  interactivity: number;
}

interface CanvasState {
  // Global Scene State
  currentEffect: EffectType;
  theme: ThemeType;
  isEditorOpen: boolean;
  isNodeEditorOpen: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  selectedId: string | null;
  
  // Performance & UX
  performanceMode: 'high' | 'lite';
  mousePos: { x: number; y: number };

  // Customization & Node Logic
  customSettings: EffectSettings;
  nodeGraph: {
    nodes: any[];
    edges: any[];
  };
  
  // MERN Project Data structure
  project: {
    _id?: string; 
    name: string;
    shapes: any[];
    keyframes: Record<string, any[]>;
  };

  // --- Core Setters ---
  setEffect: (effect: EffectType) => void;
  setTheme: (theme: ThemeType) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setMousePos: (x: number, y: number) => void;
  setPerformanceMode: (mode: 'high' | 'lite') => void;
  togglePlay: () => void;
  setSelectedId: (id: string | null) => void;
  
  // --- Customization Actions ---
  updateSetting: (key: keyof EffectSettings, value: any) => void;
  setNodeEditor: (isOpen: boolean) => void;
  updateNodeGraph: (nodes: any[], edges: any[]) => void;
  triggerSequence: (sequenceName: string) => void; // New: For Custom Animation Button
  
  // --- Object & Logic Management ---
  updateShape: (id: string, updates: any) => void;
  deleteShape: (id: string) => void;
  addTrigger: (id: string, trigger: Trigger) => void;
  addModel: (url: string) => void;
  
  // --- Animation Engine ---
  addKeyframe: (id: string, time: number, data?: any) => void;
  
  // --- Data & Navigation ---
  setProject: (projectData: any) => void;
  openEditor: (effect: EffectType) => void;
  closeEditor: () => void;
  resetProject: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  // --- Initial State ---
  currentEffect: 'swirl',
  theme: 'default',
  isEditorOpen: false,
  isNodeEditorOpen: false, 
  isPlaying: true,
  currentTime: 0,
  duration: 10,
  selectedId: null,
  performanceMode: 'high',
  mousePos: { x: 0, y: 0 },

  customSettings: {
    speed: 1.0,
    intensity: 1.0,
    particleCount: 500,
    color: '#3b82f6',
    radius: 5,
    interactivity: 0.5
  },

  nodeGraph: {
    nodes: [
      { 
        id: 'node-1', 
        type: 'speedControl', 
        position: { x: 250, y: 150 }, 
        data: { label: 'Global Speed Engine' } 
      }
    ],
    edges: []
  },

  project: { 
    name: "New Lumina Project",
    shapes: [], 
    keyframes: {} 
  },

  // --- Core Actions ---
  setEffect: (effect) => set({ currentEffect: effect }),
  setTheme: (theme) => set({ theme }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setMousePos: (x, y) => set({ mousePos: { x, y } }),
  setPerformanceMode: (mode) => set({ performanceMode: mode }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSelectedId: (id) => set({ selectedId: id }),
  
  // --- Customization Setters ---
  updateSetting: (key, value) => set((state) => ({
    customSettings: { ...state.customSettings, [key]: value }
  })),

  setNodeEditor: (isOpen) => set({ isNodeEditorOpen: isOpen }),

  updateNodeGraph: (nodes, edges) => set({ 
    nodeGraph: { nodes, edges } 
  }),

  triggerSequence: (name) => {
    console.log(`Zustand: Launching sequence ${name}`);
    // This is a hook for your Scene3D to listen to
  },

  // --- Model Management ---
  addModel: (url) => set((state) => ({
    project: {
      ...state.project,
      shapes: [
        ...state.project.shapes,
        {
          id: `model_${Math.random().toString(36).substring(2, 9)}`,
          type: 'model',
          modelUrl: url,
          x: 0, y: 0, z: 0,
          rotationX: 0, rotationY: 0, rotationZ: 0,
          scale: 1,
          opacity: 1,
          isPhysicsEnabled: false,
          triggers: [] 
        }
      ]
    }
  })),

  // --- Shape Transformations ---
  updateShape: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      shapes: state.project.shapes.map((s) => 
        s.id === id ? { ...s, ...updates } : s
      )
    }
  })),

  deleteShape: (id) => set((state) => ({
    selectedId: null,
    project: {
      ...state.project,
      shapes: state.project.shapes.filter((s) => s.id !== id),
      keyframes: { 
        ...state.project.keyframes, 
        [id]: [] 
      }
    }
  })),

  // --- Interaction Logic ---
  addTrigger: (id, trigger) => set((state) => ({
    project: {
      ...state.project,
      shapes: state.project.shapes.map((s) => 
        s.id === id 
          ? { ...s, triggers: [...(s.triggers || []), trigger] } 
          : s
      )
    }
  })),

  // --- Animation Engine ---
  addKeyframe: (id, time, data) => set((state) => {
    const shape = state.project.shapes.find(s => s.id === id);
    if (!shape) return state;

    const properties = data || {
      x: shape.x, y: shape.y, z: shape.z,
      scale: shape.scale, opacity: shape.opacity
    };

    const existingKeyframes = state.project.keyframes[id] || [];
    const filtered = existingKeyframes.filter(kf => kf.time !== time);
    
    return {
      project: {
        ...state.project,
        keyframes: { 
          ...state.project.keyframes, 
          [id]: [...filtered, { time, properties }].sort((a, b) => a.time - b.time)
        }
      }
    };
  }),

  // --- Navigation ---
  setProject: (projectData) => set({ project: projectData }),

  openEditor: (effect) => set({ 
    currentEffect: effect, 
    isEditorOpen: true, 
    isPlaying: true 
  }),
  
  closeEditor: () => set({ 
    isEditorOpen: false,
    isNodeEditorOpen: false,
    selectedId: null 
  }),

  resetProject: () => set({
    project: { name: "New Lumina Project", shapes: [], keyframes: {} },
    nodeGraph: { nodes: [], edges: [] },
    selectedId: null,
    currentTime: 0
  })
}));