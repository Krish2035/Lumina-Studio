import { Suspense } from 'react';
import { useCanvasStore, type EffectType } from '../../store/useCanvasStore';

/**
 * 1. PARTICLE & NETWORK EFFECTS
 */
import { ParticleSwirl } from './ParticleSwirl';
import { NetEffect } from '../effects/NetEffect';
import { BirdEffect } from '../effects/BirdEffect'; 
import { Snowfall } from '../effects/Snowfall';

/**
 * 2. FLUID & ORGANIC SHAPES
 */
import { WaveEffect } from '../effects/WaveEffect';
import { CellEffect } from '../effects/CellEffect';
import { BlobMorph } from '../effects/BlobMorph';
import { Metaballs } from '../effects/Metaballs';
import { FluidInk } from '../effects/FluidInk';

/**
 * 3. MATHEMATICAL & GEOMETRIC
 */
import { GlobeEffect } from '../effects/GlobeEffect';
import { DNAHelix } from '../effects/DNAHelix';
import { RetroGrid } from '../effects/RetroGrid';
import { GridBackground } from '../effects/GridBackground';
import { VoronoiMesh } from '../effects/VoronoiMesh';
import { FractalShader } from '../effects/FractalShader';
import { FloatingPhysics } from '../effects/FloatingPhysics';

/**
 * 4. ATMOSPHERIC & ENVIRONMENTAL
 */
import { CloudEffect } from '../effects/CloudEffect';
import { FogEffect } from '../effects/FogEffect';
import { StarWarp } from '../effects/StarWarp';
import { Aurora } from '../effects/Aurora';
import { Bokeh } from '../effects/Bokeh';

interface EffectManagerProps {
  forceEffect?: EffectType;
  isLite?: boolean; 
}

export const EffectManager = ({ forceEffect, isLite: manualLite }: EffectManagerProps) => {
  // Pulling active effect, mouse position, and the NEW custom user settings
  const { 
    currentEffect, 
    performanceMode, 
    mousePos, 
    customSettings 
  } = useCanvasStore();
  
  const effectToRender = forceEffect || currentEffect;
  const isLite = manualLite ?? (performanceMode === 'lite');

  // Helper to merge performance logic with user customization
  const getParticleCount = (baseCount: number) => 
    isLite ? Math.floor(baseCount * 0.3) : customSettings.particleCount;

  return (
    <Suspense fallback={null}>
      {(() => {
        switch (effectToRender) {
          // --- Category 1: Particle & Network ---
          case 'swirl':
            return (
              <ParticleSwirl 
                count={getParticleCount(4000)} 
                color={customSettings.color} 
                speed={customSettings.speed * 0.4} 
                mousePos={mousePos} 
              />
            );
          
          case 'net': 
            return (
              <NetEffect 
                isLite={isLite} 
                mousePos={mousePos} 
                speed={customSettings.speed}
                color={customSettings.color}
              />
            );
          
          case 'birds':
            return (
              <BirdEffect 
                isLite={isLite} 
                count={getParticleCount(150)} 
                mousePos={mousePos} 
                speed={customSettings.speed}
              />
            );
          
          case 'snow':
            return (
              <Snowfall 
                count={getParticleCount(800)} 
                mousePos={mousePos} 
                speed={customSettings.speed}
                color={customSettings.color}
              />
            );

          // --- Category 2: Fluid & Organic ---
          case 'waves':
            return (
              <WaveEffect 
                isLite={isLite} 
                mousePos={mousePos} 
                speed={customSettings.speed}
                color={customSettings.color}
              />
            );
          
          case 'cells':
            return <CellEffect mousePos={mousePos} speed={customSettings.speed} />;
          
          case 'blob':
            return <BlobMorph mousePos={mousePos} intensity={customSettings.intensity} />;
          
          case 'metaballs':
            return <Metaballs mousePos={mousePos} intensity={customSettings.intensity} color={customSettings.color} />;
          
          case 'ink':
            return <FluidInk mousePos={mousePos} speed={customSettings.speed} color={customSettings.color} />;

          // --- Category 3: Mathematical & Geometric ---
          case 'globe':
            return <GlobeEffect mousePos={mousePos} color={customSettings.color} />;
          
          case 'dna':
            return <DNAHelix isLite={isLite} speed={customSettings.speed} color={customSettings.color} />;
          
          case 'grid':
            return <RetroGrid mousePos={mousePos} speed={customSettings.speed} color={customSettings.color} />;
          
          case 'bg-grid':
            return <GridBackground mousePos={mousePos} color={customSettings.color} />;
          
          case 'voronoi':
            return <VoronoiMesh mousePos={mousePos} intensity={customSettings.intensity} />;
          
          case 'fractal':
            return <FractalShader mousePos={mousePos} speed={customSettings.speed} intensity={customSettings.intensity} />;
          
          case 'physics':
            return <FloatingPhysics isLite={isLite} mousePos={mousePos} gravity={1.0 - customSettings.intensity} />;

          // --- Category 4: Environmental ---
          case 'clouds':
            return <CloudEffect isLite={isLite} mousePos={mousePos} opacity={customSettings.intensity} />;
          
          case 'fog':
            return <FogEffect isLite={isLite} mousePos={mousePos} color={customSettings.color} />;
          
          case 'warp':
            return <StarWarp isLite={isLite} mousePos={mousePos} speed={customSettings.speed * 2} />;
          
          case 'aurora':
            return <Aurora mousePos={mousePos} intensity={customSettings.intensity} />;
          
          case 'bokeh':
            return <Bokeh count={getParticleCount(40)} mousePos={mousePos} color={customSettings.color} />;

          // Safety Fallback
          default:
            return (
              <ParticleSwirl 
                count={getParticleCount(2000)} 
                color={customSettings.color} 
                mousePos={mousePos} 
              />
            );
        }
      })()}
    </Suspense>
  );
};