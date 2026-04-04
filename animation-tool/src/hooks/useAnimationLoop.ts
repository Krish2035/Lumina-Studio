/** src/hooks/useAnimationLoop.ts **/
import { useEffect, useRef } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export function useAnimationLoop() {
  const { isPlaying, duration, setCurrentTime, isEditorOpen } = useCanvasStore();
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const timeAccumulator = useRef<number>(0);

  const animate = (time: number) => {
    if (lastTimeRef.current !== 0) {
      const deltaTime = (time - lastTimeRef.current) / 1000;

      if (isPlaying) {
        timeAccumulator.current += deltaTime;

        if (timeAccumulator.current >= duration) {
          timeAccumulator.current = 0;
        }
        
        // CRITICAL FIX: Only update global state if the Editor is open.
        // Updating state 60fps in the Gallery kills performance.
        if (isEditorOpen) {
          setCurrentTime(timeAccumulator.current);
        }
      }
    }
    
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, duration, isEditorOpen]); // Added isEditorOpen safety

  return null;
}