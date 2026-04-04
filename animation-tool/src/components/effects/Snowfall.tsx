import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Snowfall = ({ count = 300 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => Array.from({ length: count }).map(() => ({
    x: (Math.random()-0.5)*25, y: (Math.random()-0.5)*25, z: (Math.random()-0.5)*25, speed: 0.02 + Math.random() * 0.05
  })), [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.y -= p.speed;
      if (p.y < -12) p.y = 12;
      dummy.position.set(p.x + Math.sin(state.clock.elapsedTime + p.x) * 0.3, p.y, p.z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <circleGeometry args={[0.08, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </instancedMesh>
  );
};