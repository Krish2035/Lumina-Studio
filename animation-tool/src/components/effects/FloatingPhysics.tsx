import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Box, Sphere, Octahedron } from '@react-three/drei';

export const FloatingPhysics = ({ isLite = false }) => {
  const count = isLite ? 8 : 20;

  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      ],
      speed: Math.random() + 0.5,
      type: Math.floor(Math.random() * 3)
    }));
  }, [count]);

  return (
    <group>
      {items.map((item) => (
        <Float 
          key={item.id} 
          position={item.position as any} 
          speed={item.speed} 
          rotationIntensity={2}
        >
          {item.type === 0 && <Box args={[1, 1, 1]}><meshStandardMaterial color="#3b82f6" wireframe /></Box>}
          {item.type === 1 && <Sphere args={[0.7, 16, 16]}><meshStandardMaterial color="#60a5fa" wireframe /></Sphere>}
          {item.type === 2 && <Octahedron args={[1]}><meshStandardMaterial color="#2563eb" wireframe /></Octahedron>}
        </Float>
      ))}
    </group>
  );
};