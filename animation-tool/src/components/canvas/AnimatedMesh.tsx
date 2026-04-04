import { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useBox, useSphere } from '@react-three/cannon';
import { useCanvasStore, type Trigger } from '../../store/useCanvasStore';
import { getInterpolatedValue } from '../../utils/interpolate';

/**
 * Handles external 3D assets (GLB/GLTF).
 * Clones the scene to prevent shared state between multiple instances of the same model.
 */
const InjectedModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
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

  // 1. Calculate the animated properties from the Timeline using Interpolation
  const animatedState = useMemo(() => {
    const keyframes = project.keyframes[shape.id] || [];
    return getInterpolatedValue(currentTime, keyframes, shape);
  }, [currentTime, project.keyframes, shape]);

  // 2. PHYSICS SETUP
  // Position and Rotation are derived from the animated state unless physics is active
  const physicsArgs = {
    mass: shape.isPhysicsEnabled ? 1 : 0,
    position: [animatedState.x || 0, animatedState.y || 0, animatedState.z || 0] as [number, number, number],
    rotation: [
      THREE.MathUtils.degToRad(animatedState.rotationX || 0),
      THREE.MathUtils.degToRad(animatedState.rotationY || 0),
      THREE.MathUtils.degToRad(animatedState.rotationZ || 0)
    ] as [number, number, number],
    args: shape.type === 'box' ? [1, 1, 1] : [1],
  };

  const [physicsRef, api] = shape.type === 'sphere' 
    ? useSphere(() => physicsArgs) 
    : useBox(() => physicsArgs);

  // 3. TELEPORTATION & SYNC LOGIC
  // When physics is OFF, we manually "teleport" the physics body to follow the timeline
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

  // 4. INTERACTION & TRIGGER ENGINE
  // Executes "No-Code" logic defined in the Sidebar
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
          default:
            break;
        }
      }
    });
  };

  // UX: Visual feedback by changing cursor on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  // Material Polish based on Performance Mode
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
      onClick={(e) => { 
        e.stopPropagation(); // Prevent "clicking through" multiple 3D objects
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

      {/* Selection Wireframe Highlight */}
      {isSelected && (
        <mesh scale={[1.1, 1.1, 1.1]}>
          {shape.type === 'box' ? <boxGeometry /> : <sphereGeometry args={[1, 16, 16]} />}
          <meshBasicMaterial color="#3b82f6" wireframe opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};