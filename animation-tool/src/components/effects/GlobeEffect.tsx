import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const GlobeEffect = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6, 0.02, 16, 100]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>
      <pointLight color="#3b82f6" intensity={2} distance={20} />
    </group>
  );
};