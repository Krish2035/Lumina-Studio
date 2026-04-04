import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSwirlProps {
  count?: number;
  color?: string;
  speed?: number;
  mousePos?: { x: number; y: number };
}

export const ParticleSwirl = ({ 
  count = 1500, 
  color = "#3b82f6", 
  speed = 0.5, 
  mousePos = { x: 0, y: 0 } 
}: ParticleSwirlProps) => {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const posAttr = pointsRef.current.geometry.attributes.position;
    const t = state.clock.getElapsedTime() * speed;
    const pos = posAttr.array as Float32Array;

    // Multiplier to map normalized mouse to 3D space
    const targetX = mousePos.x * 12;
    const targetY = mousePos.y * 12;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const angle = (i / count) * Math.PI * 18; 
      const radius = 4 + Math.sin(t + i * 0.004) * 2.5;
      
      const destX = Math.cos(angle + t) * radius;
      const destY = Math.sin(t * 0.5 + i * 0.01) * 4;
      const destZ = Math.sin(angle + t) * radius;

      /**
       * AGGRESSIVE INTERACTION LOGIC
       * 1. Calculate distance from particle to mouse
       * 2. If close, increase pull strength exponentially
       */
      const dx = targetX - pos[i3];
      const dy = targetY - pos[i3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Proximity power: higher when closer
      const proximityScale = Math.max(0, 1.5 - dist / 5); 
      const activePull = 0.15 + (proximityScale * 0.4); // Increases pull based on distance

      const influence = 0.04;
      
      pos[i3] += (destX - pos[i3]) * influence + (dx * activePull * 0.1);
      pos[i3 + 1] += (destY - pos[i3 + 1]) * influence + (dy * activePull * 0.1);
      pos[i3 + 2] += (destZ - pos[i3 + 2]) * influence;
    }
    
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={particles} 
          itemSize={3} 
          usage={THREE.DynamicDrawUsage} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.07} 
        color={color} 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
        sizeAttenuation={true}
      />
    </points>
  );
};