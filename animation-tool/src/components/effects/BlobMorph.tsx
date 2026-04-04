import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';

export const BlobMorph = () => {
  return (
    <Sphere args={[4, 64, 64]}>
      <MeshDistortMaterial
        color="#3b82f6"
        speed={3}
        distort={0.5}
        radius={1}
        emissive="#000"
      />
    </Sphere>
  );
};