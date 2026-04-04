// src/utils/math.ts
export const getSwirlPosition = (t: number, index: number, total: number) => {
  const angle = (index / total) * Math.PI * 2;
  const radius = 2 + Math.sin(t + index * 0.1) * 0.5;
  
  // High-end swirl physics
  const x = Math.cos(angle + t) * radius;
  const y = Math.sin(t * 0.5 + index) * 1.5;
  const z = Math.sin(angle + t) * radius;
  
  return [x, y, z];
};