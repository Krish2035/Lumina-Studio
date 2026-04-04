import type { AnimationKeyframe, Shape } from '../types/canvas';

/**
 * LERP (Linear Interpolation) Helper
 * Calculates a value between start and end based on decimal progress (0 to 1)
 */
const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress;
};

export const getInterpolatedValue = (
  currentTime: number,
  keyframes: AnimationKeyframe[],
  baseShape: Shape
): Shape => {
  // 1. Safety Check: If no keyframes exist, return the static base shape
  if (!keyframes || keyframes.length === 0) return baseShape;

  // 2. Boundary Check: Find the "Next" keyframe in the timeline
  const nextIndex = keyframes.findIndex((k) => k.time > currentTime);
  
  // If we are BEFORE the very first keyframe, snap to the first keyframe state
  if (nextIndex === 0) {
    return { ...baseShape, ...keyframes[0].properties } as Shape;
  }
  
  // If we are AFTER the very last keyframe, stay at the last keyframe state
  if (nextIndex === -1) {
    const lastKey = keyframes[keyframes.length - 1];
    return { ...baseShape, ...lastKey.properties } as Shape;
  }

  // 3. Define the interpolation window (Between Prev and Next)
  const prev = keyframes[nextIndex - 1];
  const next = keyframes[nextIndex];

  // Calculate progress as a percentage (0.0 to 1.0)
  const range = next.time - prev.time;
  const progress = range === 0 ? 0 : (currentTime - prev.time) / range;

  // Start with a clone of the base shape to maintain static properties (like ID/Type)
  const interpolated: any = { ...baseShape };

  // 4. Numeric 3D Property Interpolation
  // These properties change smoothly over time (Movement/Rotation)
  const numericProps = [
    'x', 'y', 'z', 
    'rotationX', 'rotationY', 'rotationZ', 
    'scale', 'blur', 'opacity'
  ];

  numericProps.forEach((prop) => {
    // Priority: Keyframe Prop > Base Shape Prop > Default (0)
    const startVal = (prev.properties as any)[prop] ?? (baseShape as any)[prop] ?? 0;
    const endVal = (next.properties as any)[prop] ?? (baseShape as any)[prop] ?? 0;
    
    interpolated[prop] = lerp(startVal, endVal, progress);
  });

  // 5. Advanced Material Interpolation (PBR Materials)
  if (baseShape.material || (prev.properties as any).material) {
    const baseMat = baseShape.material || {};
    const prevMat = (prev.properties as any).material || {};
    const nextMat = (next.properties as any).material || {};

    interpolated.material = { ...baseMat };
    const materialNumericProps = ['emissiveIntensity', 'roughness', 'metalness', 'opacity'];
    
    materialNumericProps.forEach((prop) => {
      const mPrev = prevMat[prop] ?? baseMat[prop] ?? 0;
      const mNext = nextMat[prop] ?? baseMat[prop] ?? 0;
      
      (interpolated.material as any)[prop] = lerp(mPrev, mNext, progress);
    });
  }

  // 6. Discrete Snapping (Colors/Visibility)
  // These don't "slide"—they "pop" at the 50% mark of the transition
  const stepProps = ['fill', 'visible'];
  stepProps.forEach((prop) => {
    const startVal = (prev.properties as any)[prop] ?? (baseShape as any)[prop];
    const endVal = (next.properties as any)[prop] ?? (baseShape as any)[prop];
    
    interpolated[prop] = progress < 0.5 ? startVal : endVal;
  });

  return interpolated as Shape;
};