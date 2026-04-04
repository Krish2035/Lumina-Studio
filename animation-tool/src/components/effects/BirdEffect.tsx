import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const BirdEffect = ({ count = 80, isLite = false }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const birdsCount = isLite ? 25 : count;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const birds = useMemo(() => Array.from({ length: birdsCount }, () => ({
    t: Math.random() * 100, speed: 0.01 + Math.random() / 50, pos: new THREE.Vector3((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10)
  })), [birdsCount]);

  useFrame(() => {
    if (!meshRef.current) return;
    birds.forEach((bird, i) => {
      bird.t += bird.speed;
      dummy.position.set(bird.pos.x + Math.cos(bird.t) * 5, bird.pos.y + Math.sin(bird.t) * 5, bird.pos.z + Math.cos(bird.t * 0.5) * 5);
      dummy.rotation.set(Math.sin(bird.t), Math.sin(bird.t), Math.sin(bird.t));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, birdsCount]}>
      <coneGeometry args={[0.2, 0.6, 3]} />
      <meshStandardMaterial color="#3b82f6" emissive="#1e3a8a" />
    </instancedMesh>
  );
};