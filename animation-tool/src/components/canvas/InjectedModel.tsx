import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const InjectedModel = ({ url, animatedState }: any) => {
  // Load the model dynamically from the provided URL
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null!);

  // Apply timeline transformations in real-time
  useFrame(() => {
    if (!modelRef.current) return;
    modelRef.current.position.set(animatedState.x, animatedState.y, animatedState.z);
    modelRef.current.scale.setScalar(animatedState.scale);
    modelRef.current.rotation.set(
      THREE.MathUtils.degToRad(animatedState.rotationX),
      THREE.MathUtils.degToRad(animatedState.rotationY),
      THREE.MathUtils.degToRad(animatedState.rotationZ)
    );
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      dispose={null} 
    />
  );
};