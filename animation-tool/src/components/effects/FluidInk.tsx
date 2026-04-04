import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FluidInk = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, -2]}>
      <sphereGeometry args={[10, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        side={THREE.BackSide}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`
          varying vec2 vUv;
          varying float vNoise;
          uniform float uTime;
          // Simple Noise Function
          float hash(float n) { return fract(sin(n) * 43758.5453123); }
          void main() {
            vUv = uv;
            vNoise = sin(position.x * 0.5 + uTime) * cos(position.y * 0.5 + uTime);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          varying float vNoise;
          uniform float uTime;
          void main() {
            vec3 colorA = vec3(0.02, 0.05, 0.2); // Deep Blue
            vec3 colorB = vec3(0.2, 0.5, 1.0);  // Bright Blue
            vec3 finalColor = mix(colorA, colorB, vNoise * 0.5 + 0.5);
            gl_FragColor = vec4(finalColor, 0.3);
          }
        `}
        transparent
      />
    </mesh>
  );
};