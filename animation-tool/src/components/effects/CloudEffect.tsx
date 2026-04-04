import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CloudEffect: A volumetric fog/mist effect.
 * Uses overlapping planes with Additive Blending to create a glowing atmosphere.
 */
export const CloudEffect = ({ isLite = false }: { isLite?: boolean }) => {
  const count = isLite ? 15 : 40;
  const group = useRef<THREE.Group>(null!);

  // Pre-calculate randomized properties for performance
  const cloudParticles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ],
      rotation: Math.random() * Math.PI,
      scale: 5 + Math.random() * 5,
      speed: 0.001 + Math.random() * 0.002
    }));
  }, []);

  useFrame((state) => {
    if (!group.current) return;

    group.current.children.forEach((child, i) => {
      // Gentle floating and subtle rotation
      child.rotation.z += cloudParticles[i].speed;
      
      // Vertical bobbing to simulate drifting fog
      child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.002;
      
      // Subtle horizontal drift
      child.position.x += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.001;
    });
  });

  return (
    <group ref={group}>
      {cloudParticles.map((p, i) => (
        <mesh 
          key={i} 
          position={p.position as [number, number, number]} 
          rotation={[0, 0, p.rotation]} 
          scale={p.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#3b82f6"
            transparent
            opacity={0.12} // Kept low for a soft layering effect
            depthWrite={false} // Prevents "boxy" edges where planes overlap
            blending={THREE.AdditiveBlending} // Enhances the glow with Bloom
            side={THREE.DoubleSide} // Ensures visibility from all angles
          />
        </mesh>
      ))}
    </group>
  );
};