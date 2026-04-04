import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FractalShader = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[40, 25]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          void main() {
            vec2 uv = vUv * 2.0 - 1.0;
            vec2 c = uv * (sin(uTime * 0.1) * 0.5 + 1.0);
            vec2 z = vec2(0.0);
            float iter = 0.0;
            for(float i=0.0; i<40.0; i++) {
              z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
              if(length(z) > 2.0) break;
              iter++;
            }
            vec3 color = vec3(0.1, 0.3, 0.8) * (iter / 40.0);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
};