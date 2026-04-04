import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Aurora = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Warp the plane vertices slightly to simulate "waving" curtains of light
      const positions = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = Math.sin(x * 0.5 + time) * Math.cos(y * 0.3 + time) * 2;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} rotation={[0.5, 0, 0]}>
      <planeGeometry args={[40, 20, 32, 32]} />
      <meshStandardMaterial
        color="#00ffcc"
        emissive="#004433"
        emissiveIntensity={4}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  );
};