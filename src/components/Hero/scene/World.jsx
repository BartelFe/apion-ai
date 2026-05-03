import { forwardRef, useRef, useImperativeHandle } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { STATIONS } from '../constants/stations.config';
import Station from './Station';
import Connections from './Connections';
import Particles from './Particles';

// World = alle 7 Stationen + visible & shadow connections + alle Partikel.
// Exponiert ein einheitliches imperatives API für die Choreografie.
const World = forwardRef(function World(_, ref) {
  const groupRef       = useRef();
  const connectionsRef = useRef();
  const particlesRef   = useRef();
  const cameraTargetRef= useRef(new THREE.Vector3(0, 0.5, 0));

  const stateRef = useRef({
    stationsDimmed: false,
    cameraOrbit: 0, // automatische Drehung
  });

  const { camera } = useThree();

  useImperativeHandle(ref, () => ({
    // Visible layer
    setVisibleLayerOpacity(o) {
      connectionsRef.current?.setVisibleOpacity(o);
      particlesRef.current?.setVisibleDensity(o);
    },
    // Shadow layer
    setShadowProgress(p) {
      connectionsRef.current?.setShadowProgress(p);
      particlesRef.current?.setShadowDensity(p);
    },
    setShadowIntensity(v) {
      particlesRef.current?.setShadowIntensity(v);
    },
    setShadowOpacity(v) {
      connectionsRef.current?.setShadowOpacity(v);
    },
    setShadowDash(d, g) {
      connectionsRef.current?.setShadowDash(d, g);
    },
    setShadowBurnout(v) {
      particlesRef.current?.setShadowBurnout(v);
    },
    // Named Auftrag
    setNamedProgress(v) {
      particlesRef.current?.setNamedProgress(v);
    },
    setNamedStuck(v, idx) {
      particlesRef.current?.setNamedStuck(v, idx);
    },
    getNamedWorldPos() {
      return particlesRef.current?.getNamedWorldPos() ?? null;
    },
    // Camera
    setCameraOrbit(speed) {
      stateRef.current.cameraOrbit = speed;
    },
    panCamera({ x, y, z }) {
      camera.position.set(x, y, z);
      camera.lookAt(cameraTargetRef.current);
    },
  }));

  // Sanfte Auto-Rotation der Welt auf Y-Achse, abhängig vom orbit-Speed.
  useFrame((state, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * stateRef.current.cameraOrbit * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Stationen */}
      {STATIONS.map((s) => (
        <Station key={s.id} data={s} />
      ))}

      {/* Verbindungen + Partikel */}
      <Connections ref={connectionsRef} />
      <Particles ref={particlesRef} />

      {/* Boden-Grid (subtil, skizzenhaft) — material via onUpdate */}
      <gridHelper
        args={[40, 40, 0x6E6E70, 0x6E6E70]}
        position={[0, 0, 0]}
        onUpdate={(self) => {
          if (self.material && !Array.isArray(self.material)) {
            self.material.transparent = true;
            self.material.opacity = 0.08;
          }
        }}
      />
    </group>
  );
});

export default World;
