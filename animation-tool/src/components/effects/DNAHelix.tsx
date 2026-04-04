import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DNAHelix = ({ isLite = false }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const count = isLite ? 40 : 100;

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const y = (i - count / 2) * 0.4;
        const angle = i * 0.2;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[Math.sin(angle) * 2, 0, Math.cos(angle) * 2]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" />
            </mesh>
            <mesh position={[-Math.sin(angle) * 2, 0, -Math.cos(angle) * 2]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, Math.sin(angle) * 4]} />
              <meshStandardMaterial color="#ffffff" opacity={0.2} transparent />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};