import { useMemo } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';

export const usePerformance = (highResCount: number, lowResCount: number) => {
  const performanceMode = useCanvasStore((state) => state.performanceMode);

  // Automatically returns the correct density/count based on the UI toggle
  return useMemo(() => {
    return performanceMode === 'high' ? highResCount : lowResCount;
  }, [performanceMode, highResCount, lowResCount]);
};