import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InjectedModelProps {
  url: string;
  animatedState: {
    x: number;
    y: number;
    z: number;
    scale: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
  };
}

export const InjectedModel = ({ url, animatedState }: InjectedModelProps) => {
  // 1. Load the model and cast to 'any' to bypass strict GLTF type checking during build
  const { scene } = useGLTF(url) as any;
  const modelRef = useRef<THREE.Group>(null!);

  // 2. Optimization: Ensure shadows are applied to all children of the injected model
  useEffect(() => {
    if (scene) {
      scene.traverse((obj: any) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  // 3. Apply timeline transformations in real-time
  useFrame(() => {
    if (!modelRef.current || !animatedState) return;

    // Use fallback values (|| 0) to prevent the frame from crashing if state is temporarily null
    modelRef.current.position.set(
      animatedState.x || 0, 
      animatedState.y || 0, 
      animatedState.z || 0
    );
    
    modelRef.current.scale.setScalar(animatedState.scale || 1);
    
    modelRef.current.rotation.set(
      THREE.MathUtils.degToRad(animatedState.rotationX || 0),
      THREE.MathUtils.degToRad(animatedState.rotationY || 0),
      THREE.MathUtils.degToRad(animatedState.rotationZ || 0)
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

// Pre-loading helper (Recommended for Vercel performance)
// useGLTF.preload('/path-to-your-default-model.glb');