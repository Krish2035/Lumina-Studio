import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const RetroGrid = () => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((state) => {
    // Animate the texture offset to create the "scrolling" effect
    if (materialRef.current) {
      materialRef.current.map!.offset.y -= 0.01;
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <mesh>
        <planeGeometry args={[100, 100, 10, 10]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#000"
          emissive="#3b82f6"
          emissiveIntensity={2}
          wireframe
        >
          {/* We use a repeating texture or simple wireframe logic here */}
          <canvasTexture 
            attach="map" 
            image={document.createElement('canvas')} 
            onUpdate={(self) => {
              self.wrapS = self.wrapT = THREE.RepeatWrapping;
              self.repeat.set(20, 20);
            }}
          />
        </meshStandardMaterial>
      </mesh>
      {/* Background glow */}
      <pointLight position={[0, 2, -10]} intensity={5} color="#3b82f6" />
    </group>
  );
};