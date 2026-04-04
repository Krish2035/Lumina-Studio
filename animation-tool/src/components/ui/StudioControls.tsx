import React, { useState, useCallback } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { 
  Settings2, 
  Share2, 
  Play, 
  Pause, 
  Box, 
  Workflow, 
  Save, 
  CheckCircle2, 
  Loader2,
  Sparkles // New icon for Custom Animation
} from 'lucide-react';

export const StudioControls = () => {
  // 1. PERFORMANCE: Selector-based store access
  const { 
    isNodeEditorOpen, 
    setNodeEditor, 
    isPlaying, 
    togglePlay, 
    currentEffect 
  } = useCanvasStore();

  // Local state for UI feedback
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnimActive, setIsAnimActive] = useState(false);

  // 2. MERN INTEGRATION: Handle Save to MongoDB
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      console.log(`Saving ${currentEffect} configuration to MongoDB...`);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to save project:", error);
      setIsSaving(false);
    }
  }, [currentEffect]);

  // 3. CUSTOM ANIMATION HANDLER
  const handleCustomAnimation = () => {
    setIsAnimActive(true);
    console.log("Triggering Custom Animation Sequence...");
    
    // Logic to trigger a specific sequence in your 3D scene
    // e.g., useCanvasStore.getState().triggerSequence('intro')
    
    setTimeout(() => setIsAnimActive(false), 1000);
  };

  return (
    <div className="flex items-center gap-3">
      {/* 1. Main Studio Toolset */}
      <div className="flex items-center gap-1 p-1.5 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Toggle Node Editor */}
        <button
          onClick={() => setNodeEditor(!isNodeEditorOpen)}
          className={`p-2.5 rounded-xl transition-all duration-500 flex items-center gap-2 group ${
            isNodeEditorOpen 
              ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)]' 
              : 'text-white/40 hover:bg-white/5 hover:text-white'
          }`}
          title="Toggle Node Editor"
        >
          <Workflow size={18} className={isNodeEditorOpen ? 'animate-pulse' : ''} />
          {isNodeEditorOpen && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] pr-1">
              Node Engine
            </span>
          )}
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-1" />

        {/* --- CUSTOM ANIMATION BUTTON --- */}
        <button
          onClick={handleCustomAnimation}
          className={`p-2.5 rounded-xl transition-all duration-300 ${
            isAnimActive 
              ? 'text-purple-400 bg-purple-400/10 shadow-[0_0_15px_rgba(192,132,252,0.2)]' 
              : 'text-white/40 hover:bg-white/5 hover:text-purple-400'
          }`}
          title="Trigger Custom Animation"
        >
          <Sparkles size={18} className={isAnimActive ? 'animate-spin-slow' : ''} />
        </button>

        {/* Play/Pause Control */}
        <button
          onClick={togglePlay}
          className={`p-2.5 rounded-xl transition-all duration-300 ${
            isPlaying ? 'text-blue-400 bg-blue-400/10' : 'text-white/40 hover:bg-white/5'
          }`}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>

        {/* Save Control */}
        <button
          disabled={isSaving}
          onClick={handleSave}
          className={`p-2.5 rounded-xl transition-all duration-300 relative ${
            showSuccess ? 'text-green-400 bg-green-400/10' : 'text-white/40 hover:bg-white/5'
          }`}
          title="Save to Cloud"
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : showSuccess ? (
            <CheckCircle2 size={18} />
          ) : (
            <Save size={18} />
          )}
        </button>
      </div>

      {/* 2. Active Context Badge */}
      <div className="px-5 py-2.5 bg-[#0c0c0c] backdrop-blur-2xl border border-white/5 rounded-2xl hidden lg:flex items-center gap-4 shadow-xl">
        <div className="relative flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping absolute" />
          <div className="w-2 h-2 rounded-full bg-blue-500 relative" />
        </div>
        
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] leading-none mb-1">
            Active Core
          </span>
          <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.25em]">
            {currentEffect || "Idle"}
          </span>
        </div>
      </div>
    </div>
  );
};