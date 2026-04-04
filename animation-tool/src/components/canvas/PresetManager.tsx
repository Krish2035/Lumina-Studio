import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration, Scanline, HueSaturation } from '@react-three/postprocessing';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Vector2 } from 'three';
import { useMemo } from 'react';

export const PresetManager = () => {
  const { theme, performanceMode } = useCanvasStore();
  const isHigh = performanceMode === 'high';

  /**
   * THEME CONFIGURATION LEDGER
   * We use useMemo here to prevent the EffectComposer from 
   * re-calculating these values on every single frame.
   */
  const current = useMemo(() => {
    const configs = {
      default: {
        bloom: { intensity: 1.2, luminanceThreshold: 0.2 },
        vignette: { darkness: 0.5, offset: 0.5 },
        chroma: 0,
        scanlines: false,
        saturation: 0
      },
      cyberpunk: {
        bloom: { intensity: 2.8, luminanceThreshold: 0.05 },
        vignette: { darkness: 0.7, offset: 0.3 },
        chroma: 0.006,
        scanlines: true,
        saturation: 0.5
      },
      vaporwave: {
        bloom: { intensity: 2.2, luminanceThreshold: 0.1 },
        vignette: { darkness: 0.4, offset: 0.6 },
        chroma: 0.012,
        scanlines: false,
        saturation: 0.8
      },
      minimal: {
        bloom: { intensity: 0.4, luminanceThreshold: 0.8 },
        vignette: { darkness: 0.2, offset: 0.8 },
        chroma: 0,
        scanlines: false,
        saturation: -0.2
      },
      emerald: {
        bloom: { intensity: 1.8, luminanceThreshold: 0.15 },
        vignette: { darkness: 0.6, offset: 0.4 },
        chroma: 0.002,
        scanlines: true,
        saturation: 0.2
      }
    };
    return configs[theme] || configs.default;
  }, [theme]);

  // Chromatic Aberration needs a stable Vector2 object
  const chromaOffset = useMemo(() => 
    new Vector2(current.chroma, current.chroma), 
  [current.chroma]);

  return (
    <EffectComposer disableNormalPass multisampling={isHigh ? 8 : 0}>
      {/* 1. Glow & Bloom */}
      <Bloom 
        intensity={current.bloom.intensity} 
        luminanceThreshold={current.bloom.luminanceThreshold} 
        mipmapBlur={isHigh} 
        radius={0.5}
      />
      
      {/* 2. Retro scanlines (Only for specific themes) */}
      {current.scanlines && (
        <Scanline 
          opacity={isHigh ? 0.15 : 0.05} 
          density={1.2} 
        />
      )}

      {/* 3. Color Grading */}
      <HueSaturation saturation={current.saturation} />

      {/* 4. Lens Distortion (Glitch) */}
      {current.chroma > 0 && (
        <ChromaticAberration 
          offset={chromaOffset} 
          radialModulation={false}
        />
      )}

      {/* 5. Film Grain (Always on but subtle) */}
      <Noise opacity={isHigh ? 0.04 : 0.01} />
      
      {/* 6. Focus Framing */}
      <Vignette 
        darkness={current.vignette.darkness} 
        offset={current.vignette.offset} 
      />
    </EffectComposer>
  );
};