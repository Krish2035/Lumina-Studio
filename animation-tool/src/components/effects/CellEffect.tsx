import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CellEffect = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
      meshRef.current.rotation.x = t * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[4, 15]} />
      <meshStandardMaterial 
        color="#22c55e" 
        wireframe 
        emissive="#166534" 
        emissiveIntensity={2} 
      />
    </mesh>
  );
};