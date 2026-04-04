import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const NetEffect = ({ isLite = false }) => {
  const count = isLite ? 25 : 60;
  const meshRef = useRef<THREE.Points>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);

  const [particles, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 15;
      vel[i] = (Math.random() - 0.5) * 0.02;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!meshRef.current || !lineRef.current) return;
    const points = meshRef.current.geometry.attributes.position.array as Float32Array;
    const linePositions: number[] = [];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      for (let j = 0; j < 3; j++) {
        points[i3 + j] += velocities[i3 + j];
        if (Math.abs(points[i3 + j]) > 8) velocities[i3 + j] *= -1;
      }

      for (let j = i + 1; j < count; j++) {
        const dist = Math.sqrt(Math.pow(points[i3]-points[j*3], 2) + Math.pow(points[i3+1]-points[j*3+1], 2));
        if (dist < 4) linePositions.push(points[i3], points[i3+1], points[i3+2], points[j*3], points[j*3+1], points[j*3+2]);
      }
    }

    lineRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <points ref={meshRef}>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} usage={THREE.DynamicDrawUsage} /></bufferGeometry>
        <pointsMaterial size={0.15} color="#3b82f6" transparent opacity={0.8} />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
};