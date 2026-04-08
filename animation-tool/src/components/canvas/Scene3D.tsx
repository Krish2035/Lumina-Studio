import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { useCanvasStore } from '../../store/useCanvasStore';
import { EffectManager } from './EffectManager';
import { AnimatedMesh } from './AnimatedMesh';
import { PresetManager } from './PresetManager';
import { MouseField } from '../effects/MouseField';

/**
 * Invisible mesh to track mouse movements in 3D space.
 * Updated to use standard e.pointer for better accuracy.
 */
const MouseTracker = () => {
  const setMousePos = useCanvasStore((state) => state.setMousePos);
  
  return (
    <mesh 
      onPointerMove={(e) => {
        // e.uv gives us normalized coordinates [0, 1] relative to the plane
        // translating that to the expected [-1, 1] range for shaders/effects
        const x = e.uv ? e.uv.x * 2 - 1 : 0;
        const y = e.uv ? e.uv.y * 2 - 1 : 0;
        setMousePos(x, y);
      }}
    >
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
};

export const Scene3D = () => {
  const { project, selectedId, setSelectedId, currentEffect, performanceMode, theme } = useCanvasStore();
  
  // Responsive FOV logic
  const [fov, setFov] = useState(45);
  useEffect(() => {
    const handleResize = () => {
      // Keep models visible in the center even on mobile/split screens
      setFov(window.innerHeight > window.innerWidth ? 60 : 45);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const themeColors = useMemo(() => {
    switch (theme) {
      case 'cyberpunk': return { bg: '#080008', light: '#ff00ff', intensity: 2.5 };
      case 'vaporwave': return { bg: '#000b1a', light: '#00f2ff', intensity: 2.0 };
      case 'emerald': return { bg: '#000804', light: '#10b981', intensity: 2.2 };
      default: return { bg: '#050505', light: '#3b82f6', intensity: 1.5 };
    }
  }, [theme]);

  return (
    // Fixed: Ensure the container has absolute positioning and full dimensions 
    // to fill the parent 'main' area in App.tsx
    <div className="absolute inset-0 w-full h-full bg-black">
      <Canvas 
        key={currentEffect} // Force re-render of the entire engine context
        shadows 
        camera={{ position: [0, 0, 20], fov: fov }} 
        gl={{ 
          antialias: performanceMode === 'high', 
          powerPreference: "high-performance",
          alpha: true,
          preserveDrawingBuffer: true // Helps with visibility during layout shifts
        }}
        className="w-full h-full touch-none"
      >
        <color attach="background" args={[themeColors.bg]} />
        
        {/* Helper for interaction */}
        <MouseTracker />

        <Suspense fallback={null}>
          {/* Global background effects */}
          <MouseField count={performanceMode === 'high' ? 120 : 40} />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight 
            position={[10, 10, 10]} 
            intensity={themeColors.intensity} 
            color={themeColors.light} 
            castShadow 
          />
          <Environment preset={theme === 'minimal' ? 'city' : 'night'} />

          {/* 3D Content and Physics */}
          <Physics 
            gravity={[0, -9.81, 0]} 
            allowSleep 
            iterations={performanceMode === 'high' ? 15 : 5}
          >
            <EffectManager key={currentEffect} isLite={performanceMode === 'lite'} />
            
            {project?.shapes?.map((shape) => (
              <AnimatedMesh 
                key={shape.id} 
                shape={shape} 
                isSelected={selectedId === shape.id}
                onSelect={() => setSelectedId(shape.id)}
              />
            ))}

            {/* Ground Plane for Shadow Catching */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <shadowMaterial opacity={0.3} />
            </mesh>
          </Physics>

          <PresetManager />
        </Suspense>

        {/* Visual Polish */}
        <ContactShadows 
          position={[0, -7.9, 0]} 
          opacity={0.4} 
          scale={30} 
          blur={2.5} 
        />

        <OrbitControls 
          makeDefault 
          enableDamping 
          dampingFactor={0.05}
          enableRotate={!selectedId} 
          minDistance={5}
          maxDistance={40}
        />
      </Canvas>
    </div>
  );
};