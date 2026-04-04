/** src/components/effects/WaveEffect.tsx **/
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const WaveEffect = ({ isLite = false }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Reduced segments significantly for the Gallery view
  const segments = isLite ? 25 : 45;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime() * 1.0;
    const pos = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      // Optimized math to avoid excessive Cosine calls
      const z = Math.sin(x * 0.3 + time) * Math.cos(y * 0.3 + time) * 0.7;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    
    // Only compute normals if not in Lite mode to save GPU cycles
    if (!isLite) {
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20, segments, segments]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        emissive="#1d4ed8" 
        emissiveIntensity={1.5} 
        wireframe 
        transparent 
        opacity={0.4} 
        blending={THREE.AdditiveBlending} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
};