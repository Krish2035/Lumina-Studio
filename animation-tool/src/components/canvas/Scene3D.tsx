import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { useCanvasStore } from '../../store/useCanvasStore';
import { EffectManager } from './EffectManager';
import { AnimatedMesh } from './AnimatedMesh';
import { PresetManager } from './PresetManager';
import { MouseField } from '../effects/MouseField'; // The new interactive trail

/**
 * Invisible plane to capture mouse movement globally for shaders.
 * We normalize coordinates to -1 and +1 for Three.js.
 */
const MouseTracker = () => {
  const setMousePos = useCanvasStore((state) => state.setMousePos);

  return (
    <mesh
      onPointerMove={(e) => {
        // Prevent event from bubbling if you have other interactive UI
        e.stopPropagation();
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        setMousePos(x, y);
      }}
    >
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
};

/**
 * Invisible physics floor for collisions.
 */
const PhysicsFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  );
};

export const Scene3D = () => {
  const { 
    project, 
    selectedId, 
    setSelectedId, 
    currentEffect, 
    performanceMode,
    theme 
  } = useCanvasStore();

  // Dynamic environment and light colors based on the selected theme
  const themeColors = useMemo(() => {
    switch (theme) {
      case 'cyberpunk': return { bg: '#080008', light: '#ff00ff', intensity: 2.5 };
      case 'vaporwave': return { bg: '#000b1a', light: '#00f2ff', intensity: 2.0 };
      case 'minimal': return { bg: '#0a0a0a', light: '#ffffff', intensity: 1.0 };
      case 'emerald': return { bg: '#000804', light: '#10b981', intensity: 2.2 };
      default: return { bg: '#050505', light: '#3b82f6', intensity: 1.5 };
    }
  }, [theme]);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-black">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 18], fov: 45 }} 
        gl={{ 
          antialias: performanceMode === 'high', 
          stencil: false, 
          depth: true,
          powerPreference: "high-performance",
          // Helps with smooth movement in fullscreen
          alpha: false 
        }}
        className="w-full h-full"
      >
        <color attach="background" args={[themeColors.bg]} />
        
        {/* The MouseTracker must stay at the top of the scene graph */}
        <MouseTracker />

        <Suspense fallback={null}>
          {/* 1. Global Interactive Mouse Trail */}
          <MouseField count={performanceMode === 'high' ? 150 : 50} />

          {/* 2. Environmental Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight 
            position={[10, 10, 10]} 
            intensity={themeColors.intensity} 
            color={themeColors.light} 
            castShadow 
          />
          <Environment preset={theme === 'minimal' ? 'city' : 'night'} />

          {/* 3. Physics & Dynamic Entities */}
          <Physics 
            gravity={[0, -9.81, 0]} 
            allowSleep 
            iterations={performanceMode === 'high' ? 20 : 5}
          >
            {/* Background Procedural Effects */}
            <EffectManager 
              key={currentEffect} 
              isLite={performanceMode === 'lite'} 
            />

            {/* MERN User Objects */}
            {project?.shapes?.map((shape) => (
              <AnimatedMesh 
                key={shape.id} 
                shape={shape} 
                isSelected={selectedId === shape.id}
                onSelect={() => setSelectedId(shape.id)}
              />
            ))}

            <PhysicsFloor />
          </Physics>

          {/* 4. Post-Processing & Themes */}
          <PresetManager />
        </Suspense>

        {/* 5. Visual Polish */}
        <ContactShadows 
          position={[0, -7.9, 0]} 
          opacity={theme === 'minimal' ? 0.2 : 0.5} 
          scale={30} 
          blur={2.5} 
        />
        
        <OrbitControls 
          makeDefault 
          enableDamping 
          dampingFactor={0.05}
          maxDistance={50}
          // Disable rotation if user is trying to "draw" with mouse in fullscreen
          enableRotate={!selectedId} 
        />
      </Canvas>
    </div>
  );
};