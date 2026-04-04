import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GridBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        transparent
        side={THREE.DoubleSide}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#3b82f6') }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 uColor;
          void main() {
            vec2 grid = abs(fract(vUv * 50.0 - 0.5) - 0.5) / fwidth(vUv * 50.0);
            float line = min(grid.x, grid.y);
            float mask = 1.0 - min(line, 1.0);
            float distanceFade = 1.0 - smoothstep(0.0, 0.5, length(vUv - 0.5));
            gl_FragColor = vec4(uColor, mask * distanceFade * 0.5);
          }
        `}
      />
    </mesh>
  );
};