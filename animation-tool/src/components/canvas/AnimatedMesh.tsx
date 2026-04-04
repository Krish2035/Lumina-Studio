import { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useBox, useSphere } from '@react-three/cannon';
import { useCanvasStore, type Trigger } from '../../store/useCanvasStore';
import { getInterpolatedValue } from '../../utils/interpolate';

/**
 * Handles external 3D assets (GLB/GLTF).
 * Clones the scene to prevent shared state between multiple instances.
 */
const InjectedModel = ({ url }: { url: string }) => {
  // Cast to 'any' to bypass the "Property scene does not exist" error during build
  const { scene } = useGLTF(url) as any;
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} />;
};

export const AnimatedMesh = ({ shape, isSelected, onSelect }: any) => {
  const { 
    currentTime, 
    project, 
    performanceMode, 
    updateShape, 
    setTheme,
    setEffect 
  } = useCanvasStore();

  const [hovered, setHovered] = useState(false);

  // 1. Calculate animated properties
  const animatedState = useMemo(() => {
    const keyframes = project.keyframes[shape.id] || [];
    return getInterpolatedValue(currentTime, keyframes, shape);
  }, [currentTime, project.keyframes, shape]);

  // 2. PHYSICS SETUP
  // Position and Rotation logic
  const position = [animatedState.x || 0, animatedState.y || 0, animatedState.z || 0] as [number, number, number];
  const rotation = [
    THREE.MathUtils.degToRad(animatedState.rotationX || 0),
    THREE.MathUtils.degToRad(animatedState.rotationY || 0),
    THREE.MathUtils.degToRad(animatedState.rotationZ || 0)
  ] as [number, number, number];

  // We split the hooks and use 'any' to satisfy the strict Cannon.js Tuple requirements
  const [physicsRef, api] = shape.type === 'sphere' 
    ? useSphere(() => ({
        mass: shape.isPhysicsEnabled ? 1 : 0,
        position,
        rotation,
        args: [1] as [number], // Explicitly typed for Sphere
      })) 
    : useBox(() => ({
        mass: shape.isPhysicsEnabled ? 1 : 0,
        position,
        rotation,
        args: [1, 1, 1] as [number, number, number], // Explicitly typed for Box
      }));

  // 3. TELEPORTATION & SYNC LOGIC
  useEffect(() => {
    if (!shape.isPhysicsEnabled) {
      api.position.set(animatedState.x || 0, animatedState.y || 0, animatedState.z || 0);
      api.rotation.set(
        THREE.MathUtils.degToRad(animatedState.rotationX || 0),
        THREE.MathUtils.degToRad(animatedState.rotationY || 0),
        THREE.MathUtils.degToRad(animatedState.rotationZ || 0)
      );
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    }
  }, [animatedState, shape.isPhysicsEnabled, api]);

  // 4. INTERACTION ENGINE
  const handleInteraction = (eventType: 'onClick' | 'onHover') => {
    if (!shape.triggers) return;

    shape.triggers.forEach((trigger: Trigger) => {
      if (trigger.event === eventType) {
        switch (trigger.action) {
          case 'togglePhysics':
            updateShape(shape.id, { isPhysicsEnabled: !shape.isPhysicsEnabled });
            break;
          case 'changeTheme':
            setTheme(trigger.value);
            break;
          case 'changeEffect':
            setEffect(trigger.value);
            break;
          case 'changeColor':
            updateShape(shape.id, { fill: trigger.value });
            break;
        }
      }
    });
  };

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  const materialProps = {
    color: animatedState.fill || "#3b82f6",
    emissive: animatedState.fill || "#3b82f6",
    emissiveIntensity: performanceMode === 'lite' ? 0.2 : (animatedState.blur / 10 || 0.5),
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: animatedState.opacity ?? 1,
  };

  return (
    <group 
      ref={physicsRef as any} 
      onClick={(e: any) => { 
        e.stopPropagation(); 
        onSelect(); 
        handleInteraction('onClick');
      }}
      onPointerOver={() => {
        setHovered(true);
        handleInteraction('onHover');
      }}
      onPointerOut={() => setHovered(false)}
    >
      <Suspense fallback={null}>
        {shape.type === 'model' ? (
          <InjectedModel url={shape.modelUrl} />
        ) : (
          <mesh castShadow receiveShadow>
            {shape.type === 'box' ? (
              <boxGeometry />
            ) : (
              <sphereGeometry args={[1, performanceMode === 'lite' ? 16 : 64, performanceMode === 'lite' ? 16 : 64]} />
            )}
            <meshStandardMaterial {...materialProps} />
          </mesh>
        )}
      </Suspense>

      {isSelected && (
        <mesh scale={[1.1, 1.1, 1.1]}>
          {shape.type === 'box' ? <boxGeometry /> : <sphereGeometry args={[1, 16, 16]} />}
          <meshBasicMaterial color="#3b82f6" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};