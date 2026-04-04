export type ShapeType = 'box' | 'sphere' | 'torus' | 'particles' | 'blob';

export interface MaterialProps {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
  opacity: number;
  transparent: boolean;
}

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  rotation?: number; // Legacy support for 2D rotation inputs
  scale: number;
  fill: string;
  material?: MaterialProps;
  blur: number;
  zIndex: number;
  visible: boolean;
  opacity: number;
}

export interface AnimationKeyframe {
  time: number;
  properties: Partial<Omit<Shape, 'id' | 'type'>>;
}

export interface Project {
  id: string;
  name: string;
  canvasBackground: string;
  shapes: Shape[];
  keyframes: Record<string, AnimationKeyframe[]>;
  isBackgroundEnabled: boolean;
  lastSaved: Date | string;
}