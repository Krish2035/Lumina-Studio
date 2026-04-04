import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const StarWarp = ({ isLite = false }) => {
  const count = isLite ? 500 : 1500;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: THREE.MathUtils.randFloatSpread(100),
        y: THREE.MathUtils.randFloatSpread(100),
        z: THREE.MathUtils.randFloatSpread(100),
        speed: Math.random() * 0.8 + 0.2
      });
    }
    return temp;
  }, [count]);

  const dummy = new THREE.Object3D();

  useFrame(() => {
    particles.forEach((p, i) => {
      p.z += p.speed;
      if (p.z > 20) p.z = -80; // Reset to distance when passing camera

      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#fff" transparent opacity={0.6} />
    </instancedMesh>
  );
};