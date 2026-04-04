import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCanvasStore } from '../../store/useCanvasStore';

export const MouseField = ({ count = 100 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { mousePos, isPlaying } = useCanvasStore();

  // Pre-calculate random velocities for each particle
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100, // random offset
        speed: 0.01 + Math.random() * 0.02,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05
        ),
      });
    }
    return temp;
  }, [count]);

  const dummy = new THREE.Object3D();

  useFrame((state) => {
    if (!meshRef.current || !isPlaying) return;

    particles.forEach((particle, i) => {
      let { velocity, t } = particle;
      
      // 1. Get current instance matrix
      meshRef.current!.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      // 2. Follow Logic: Move toward mouse with "Lag"
      const targetX = mousePos.x * 10;
      const targetY = mousePos.y * 10;

      // Particles "swarm" the mouse rather than just sticking to it
      dummy.position.x = THREE.MathUtils.lerp(dummy.position.x, targetX + velocity.x * 50, 0.02);
      dummy.position.y = THREE.MathUtils.lerp(dummy.position.y, targetY + velocity.y * 50, 0.02);
      dummy.position.z = THREE.MathUtils.lerp(dummy.position.z, velocity.z * 10, 0.01);

      // 3. Subtle Pulsing Scale
      const s = Math.sin(state.clock.elapsedTime + t) * 0.5 + 1;
      dummy.scale.set(s, s, s);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        emissive="#60a5fa" 
        emissiveIntensity={2} 
        transparent 
        opacity={0.6} 
      />
    </instancedMesh>
  );
};