import { useEffect } from 'react';
import { Play, Pause, Clock, ChevronRight } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const Timeline = () => {
  const { 
    project, 
    selectedId, 
    currentTime, 
    setCurrentTime, 
    isPlaying, 
    togglePlay, 
    duration 
  } = useCanvasStore();

  // Safely grab keyframes for the selected 3D object
  const activeKeyframes = selectedId ? project.keyframes[selectedId] || [] : [];

  // Keyboard Shortcut: Spacebar for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // Helper to calculate percentage position
  const getPos = (time: number) => (time / duration) * 100;

  return (
    <div className="flex flex-col w-full bg-[#0a0a0a]/90 backdrop-blur-xl h-full border-t border-white/5 select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between h-10 border-b border-white/5 px-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay} 
            className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400 hover:scale-110'}`}
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
          </button>
          
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-white/40 uppercase">
            <Clock size={12} className="text-blue-500/50" />
            <span className="text-white/80">{currentTime.toFixed(2)}s</span>
            <span className="opacity-30">/</span>
            <span>{duration.toFixed(1)}s</span>
          </div>
        </div>

        {selectedId && (
          <div className="text-[10px] text-blue-400/60 flex items-center gap-1 font-medium bg-blue-400/5 px-2 py-1 rounded-md">
            <ChevronRight size={10} /> Editing: {selectedId.split('_')[0]}...
          </div>
        )}
      </div>

      {/* Main Track Area */}
      <div className="relative flex-1 px-12 flex items-center group">
        <div className="relative w-full h-1.5 bg-white/5 rounded-full ring-1 ring-white/5 overflow-visible">
          
          {/* Active Progress Gradient */}
          <div 
            className="absolute h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            style={{ width: `${getPos(currentTime)}%` }} 
          />
          
          {/* Timeline Markers (Sub-seconds) */}
          <div className="absolute inset-0 flex justify-between px-0.5 opacity-10">
            {[...Array(duration + 1)].map((_, i) => (
              <div key={i} className="w-px h-2 bg-white -translate-y-0.5" />
            ))}
          </div>

          {/* Keyframe Diamonds */}
          {activeKeyframes.map((kf, i) => (
            <button
              key={i}
              onClick={() => setCurrentTime(kf.time)}
              className="absolute w-2.5 h-2.5 bg-white rotate-45 border-2 border-blue-600 -translate-x-1/2 -top-0.5 z-20 hover:scale-150 hover:bg-yellow-400 transition-all cursor-pointer"
              style={{ left: `${getPos(kf.time)}%` }}
              title={`Keyframe at ${kf.time}s`}
            />
          ))}

          {/* The Playhead Marker */}
          <div 
            className="absolute w-0.5 h-12 bg-blue-500 -top-[22px] -translate-x-1/2 z-10 pointer-events-none"
            style={{ left: `${getPos(currentTime)}%` }}
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full -translate-x-[5.5px] -mt-0.5 shadow-lg border-2 border-[#0a0a0a]" />
          </div>

          {/* Invisible Range Input for Interaction */}
          <input 
            type="range" 
            min="0" 
            max={duration} 
            step="0.01" 
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-8 -top-3 opacity-0 cursor-ew-resize z-30"
          />
        </div>
      </div>
    </div>
  );
};