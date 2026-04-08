import { Play, Pause, Clock } from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const Timeline = () => {
  const { project, selectedId, currentTime, setCurrentTime, isPlaying, togglePlay, duration } = useCanvasStore();
  const activeKeyframes = selectedId ? project.keyframes[selectedId] || [] : [];
  const getPos = (time: number) => (time / duration) * 100;

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0a] select-none">
      <div className="flex items-center justify-between h-10 border-b border-white/5 px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="p-1.5 bg-blue-600 rounded-full text-white">
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>
          <div className="flex items-center gap-2 text-[9px] font-mono text-white/40 uppercase">
            <Clock size={10} className="text-blue-500" />
            <span className="text-white/80">{currentTime.toFixed(2)}s</span>
            <span>/ {duration.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative px-8 flex items-center">
        <div className="relative w-full h-1.5 bg-white/5 rounded-full ring-1 ring-white/10">
          <div className="absolute h-full bg-blue-600 rounded-full" style={{ width: `${getPos(currentTime)}%` }} />
          
          {activeKeyframes.map((kf, i) => (
            <button
              key={i}
              onClick={() => setCurrentTime(kf.time)}
              className="absolute w-2.5 h-2.5 bg-yellow-400 rotate-45 border border-black -translate-x-1/2 -top-0.5 z-20"
              style={{ left: `${getPos(kf.time)}%` }}
            />
          ))}

          <div 
            className="absolute w-0.5 h-8 bg-blue-500 -top-3.5 -translate-x-1/2 z-10 pointer-events-none"
            style={{ left: `${getPos(currentTime)}%` }}
          >
            <div className="w-3 h-3 bg-white rounded-full -translate-x-[5px] -mt-0.5 shadow-lg border-2 border-blue-600" />
          </div>

          <input 
            type="range" min="0" max={duration} step="0.01" value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-8 -top-3 opacity-0 cursor-pointer z-30"
          />
        </div>
      </div>
    </div>
  );
};