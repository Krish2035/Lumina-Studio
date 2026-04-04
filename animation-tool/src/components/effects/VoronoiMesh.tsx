import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const VoronoiMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time);
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]}>
      <planeGeometry args={[30, 30, 20, 20]} />
      <meshStandardMaterial color="#111" wireframe emissive="#3b82f6" emissiveIntensity={0.5} />
    </mesh>
  );
};