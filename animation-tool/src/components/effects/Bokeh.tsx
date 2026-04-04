import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Bokeh = ({ count = 30 }) => {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = new THREE.Object3D();
  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: THREE.MathUtils.randFloatSpread(40),
      y: THREE.MathUtils.randFloatSpread(40),
      z: THREE.MathUtils.randFloatSpread(20),
      scale: 1 + Math.random() * 3
    }));
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y + Math.sin(time + p.x) * 2, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 32]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
};