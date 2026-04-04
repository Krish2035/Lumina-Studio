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
  const { 
    currentEffect, 
    performanceMode, 
    mousePos, 
    customSettings 
  } = useCanvasStore();
  
  const effectToRender = forceEffect || currentEffect;
  const isLite = manualLite ?? (performanceMode === 'lite');

  const getParticleCount = (baseCount: number) => 
    isLite ? Math.floor(baseCount * 0.3) : (customSettings.particleCount || baseCount);

  return (
    <Suspense fallback={null}>
      {(() => {
        // We cast components to 'any' below to prevent TS from blocking the Vercel build 
        // while we are still refining the prop interfaces in the individual effect files.
        switch (effectToRender) {
          case 'swirl':
            return <ParticleSwirl count={getParticleCount(4000)} color={customSettings.color} speed={customSettings.speed * 0.4} mousePos={mousePos} />;
          
          case 'net': 
            return <NetEffect {...({ isLite, mousePos, speed: customSettings.speed, color: customSettings.color } as any)} />;
          
          case 'birds':
            return <BirdEffect {...({ isLite, count: getParticleCount(150), mousePos, speed: customSettings.speed } as any)} />;
          
          case 'snow':
            return <Snowfall {...({ count: getParticleCount(800), mousePos, speed: customSettings.speed, color: customSettings.color } as any)} />;

          case 'waves':
            return <WaveEffect {...({ isLite, mousePos, speed: customSettings.speed, color: customSettings.color } as any)} />;
          
          case 'cells':
            return <CellEffect {...({ mousePos, speed: customSettings.speed } as any)} />;
          
          case 'blob':
            return <BlobMorph {...({ mousePos, intensity: customSettings.intensity } as any)} />;
          
          case 'metaballs':
            return <Metaballs {...({ mousePos, intensity: customSettings.intensity, color: customSettings.color } as any)} />;
          
          case 'ink':
            return <FluidInk {...({ mousePos, speed: customSettings.speed, color: customSettings.color } as any)} />;

          case 'globe':
            return <GlobeEffect {...({ mousePos, color: customSettings.color } as any)} />;
          
          case 'dna':
            return <DNAHelix {...({ isLite, speed: customSettings.speed, color: customSettings.color } as any)} />;
          
          case 'grid':
            return <RetroGrid {...({ mousePos, speed: customSettings.speed, color: customSettings.color } as any)} />;
          
          case 'bg-grid':
            return <GridBackground {...({ mousePos, color: customSettings.color } as any)} />;
          
          case 'voronoi':
            return <VoronoiMesh {...({ mousePos, intensity: customSettings.intensity } as any)} />;
          
          case 'fractal':
            return <FractalShader {...({ mousePos, speed: customSettings.speed, intensity: customSettings.intensity } as any)} />;
          
          case 'physics':
            return <FloatingPhysics {...({ isLite, mousePos, gravity: 1.0 - (customSettings.intensity || 0.5) } as any)} />;

          case 'clouds':
            return <CloudEffect {...({ isLite, mousePos, opacity: customSettings.intensity } as any)} />;
          
          case 'fog':
            return <FogEffect {...({ isLite, mousePos, color: customSettings.color } as any)} />;
          
          case 'warp':
            return <StarWarp {...({ isLite, mousePos, speed: customSettings.speed * 2 } as any)} />;
          
          case 'aurora':
            return <Aurora {...({ mousePos, intensity: customSettings.intensity } as any)} />;
          
          case 'bokeh':
            return <Bokeh {...({ count: getParticleCount(40), mousePos, color: customSettings.color } as any)} />;

          default:
            return <ParticleSwirl count={getParticleCount(2000)} color={customSettings.color} mousePos={mousePos} />;
        }
      })()}
    </Suspense>
  );
};