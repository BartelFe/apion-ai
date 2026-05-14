import { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { EffectComposer, SelectiveBloom, Selection } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import World from './scene/World';

// Innerer Wrapper damit wir useThree() für Camera/Scene haben.
// Kamera-Distanz skaliert mit Aspect-Ratio, damit alle 7 Stationen
// inklusive Tool-Sticker auf jedem Desktop-Aspect garantiert sichtbar
// bleiben (rechte Spalte ist 50vw → variiert von ~0.5 bis 1.2 aspect).
function SceneInner({ worldRef, cameraSetterRef }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    // Distance-Faktor: bei portrait (schmal) Kamera weiter weg, bei landscape näher.
    // Iso-Richtung bleibt: Komponenten x/y/z im konstanten Verhältnis.
    // Aspect-aware Pullback. Sehr portrait (Tablet 768–1023px mit der
    // schmalen 3D-Spalte) muss aggressiver zurückfahren, sonst clipped's.
    // Quasi-square Aspekte (0.70-0.85, typisch 2K-Monitore) bleiben nah dran
    // damit die Welt nicht im weiten Canvas verloren wirkt.
    const distFactor = aspect >= 1.0 ? 1.0
                     : aspect >= 0.85 ? 1.05
                     : aspect >= 0.70 ? 1.10
                     : aspect >= 0.55 ? 1.30
                     : aspect >= 0.42 ? 1.55
                     : aspect >= 0.32 ? 1.90
                     : 2.40;
    const baseX = 11, baseY = 13, baseZ = 19;
    camera.position.set(baseX * distFactor, baseY * distFactor, baseZ * distFactor);
    camera.fov = 34;
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
    if (cameraSetterRef) cameraSetterRef.current = camera;
  }, [camera, cameraSetterRef, size.width, size.height]);

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[10, 16, 8]} intensity={0.4} />
      <World ref={worldRef} />
    </>
  );
}

const HeroScene = forwardRef(function HeroScene(_, ref) {
  const worldRef = useRef();
  const cameraRef = useRef();
  const wrapperRef = useRef();
  const [active, setActive] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    world: () => worldRef.current,
    camera: () => cameraRef.current,
  }));

  // Frameloop pausieren wenn die Szene out-of-viewport ist — spart GPU
  // sobald der User unter den Hero scrollt.
  useEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '100px' }
    );
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
    <Canvas
      orthographic={false}
      camera={{ position: [14, 12, 18], fov: 30, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'demand'}
      onCreated={() => setLoaded(true)}
      style={{ width: '100%', height: '100%' }}
    >
      {/*
        Selektives Bloom: nur Objekte, die in <Select enabled> gewrappt
        sind (Shadow-Pfade, Shadow-Partikel, Named Auftrag), glühen.
        Das ist der "Awwwards-Move" — nicht der ganze Frame leuchtet,
        nur die unsichtbare Wahrheit pulst orange.
      */}
      <Selection>
        <SceneInner worldRef={worldRef} cameraSetterRef={cameraRef} />
        <EffectComposer multisampling={0} autoClear={false}>
          <SelectiveBloom
            intensity={0.85}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.4}
            radius={0.75}
            mipmapBlur
            blendFunction={BlendFunction.SCREEN}
          />
        </EffectComposer>
      </Selection>
    </Canvas>
      {/* Loading-Skeleton — fadet weg sobald Canvas mountet */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'JetBrains Mono, SF Mono, Menlo, monospace',
          fontSize: '10px',
          color: 'var(--fg-muted)',
          letterSpacing: '0.18em',
          pointerEvents: 'none',
          opacity: loaded ? 0 : 0.55,
          transition: 'opacity 0.5s ease',
          animation: loaded ? 'none' : 'apionSkeletonPulse 1.6s ease-in-out infinite',
        }}
      >
        // rendering scene
      </div>
      <style>{`
        @keyframes apionSkeletonPulse {
          0%, 100% { letter-spacing: 0.18em; }
          50%      { letter-spacing: 0.32em; }
        }
      `}</style>
    </div>
  );
});

export default HeroScene;
