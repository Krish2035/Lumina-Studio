import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export const FogEffect = ({ isLite = false }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Add a slight rotation animation for the "Foggy" sphere
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={2}>
        <Sphere ref={meshRef} args={[8, 64, 64]}>
          <meshStandardMaterial 
            color="#222" 
            emissive="#111"
            transparent 
            opacity={0.3} 
            roughness={0.1}
            metalness={0.8}
            wireframe={!isLite}
          />
        </Sphere>
      </Float>

      {/* FIX: Increased 'near' to 1 and 'far' to 50. 
        This ensures the fog starts further away so your objects are visible.
      */}
      <fog attach="fog" args={['#050505', 1, 50]} />
    </group>
  );
};