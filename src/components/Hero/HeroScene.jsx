import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, SelectiveBloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import World from './scene/World';

// Innerer Wrapper damit wir useThree() für Camera/Scene haben.
function SceneInner({ worldRef, cameraSetterRef }) {
  const { camera } = useThree();

  useEffect(() => {
    // Iso-mäßige Startposition.
    camera.position.set(14, 12, 18);
    camera.lookAt(0, 0.5, 0);
    if (cameraSetterRef) cameraSetterRef.current = camera;
  }, [camera, cameraSetterRef]);

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

  useImperativeHandle(ref, () => ({
    world: () => worldRef.current,
    camera: () => cameraRef.current,
  }));

  return (
    <Canvas
      orthographic={false}
      camera={{ position: [14, 12, 18], fov: 30, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneInner worldRef={worldRef} cameraSetterRef={cameraRef} />

      {/*
        Selektives Bloom: nur Objekte auf Layer 1 (Shadow-Pfade,
        Shadow-Partikel, Named Auftrag) glühen.
        Das ist der "Awwwards-Move" — nicht der ganze Frame leuchtet,
        nur die unsichtbare Wahrheit pulst orange.
      */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.4}
          radius={0.75}
          mipmapBlur
          blendFunction={BlendFunction.SCREEN}
        />
      </EffectComposer>
    </Canvas>
  );
});

export default HeroScene;
