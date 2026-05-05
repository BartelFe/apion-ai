import { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import * as THREE from 'three';
import { c3 } from '../../../lib/tokens';
import { stationById } from '../constants/stations.config';
import { VISIBLE_FLOWS, SHADOW_FLOWS, NAMED_AUFTRAG } from '../constants/flows.config';
import { buildPath } from './Connections';

// Anzahl Partikel pro Pfad — Total = #paths * perPath.
const FLOW_PER_PATH   = 3;
const SHADOW_PER_PATH = 4;

// Hilfsfunktion: gleiche Bezier-Kurven-Logik wie in Connections,
// damit Partikel exakt auf den Linien laufen.
function flowCurves() {
  return VISIBLE_FLOWS.map((f) => {
    const a = stationById(f.from), b = stationById(f.to);
    return buildPath(a.pos, b.pos, { lift: 0.45 });
  });
}

function shadowCurves() {
  return SHADOW_FLOWS.map((f, i) => {
    const a = stationById(f.from), b = stationById(f.to);
    const sag = ((i % 3) - 1) * 0.7;
    const lift = 0.7 + (i % 4) * 0.15;
    return { curve: buildPath(a.pos, b.pos, { lift, sag, kind: f.kind }), kind: f.kind };
  });
}

const Particles = forwardRef(function Particles(_, ref) {
  // ── Sichtbare Flow-Partikel (graue Punkte fließen elegant) ──
  const flowMeshRef = useRef();
  const flowDataRef = useRef([]);
  const flowsCount  = VISIBLE_FLOWS.length * FLOW_PER_PATH;

  // ── Shadow-Partikel (orange Chaos, Splits, Burnout) ──
  const shadowMeshRef = useRef();
  const shadowDataRef = useRef([]);
  const shadowCount   = SHADOW_FLOWS.length * SHADOW_PER_PATH;

  // ── Named Auftrag BV-2419 ──
  const namedRef    = useRef();
  const haloRef     = useRef();

  const flowCurvesMemo   = useMemo(() => flowCurves(), []);
  const shadowCurvesMemo = useMemo(() => shadowCurves(), []);

  // Pre-compute Named-Auftrag-Curves einmal — ohne wären es Vector3-
  // Allokationen pro Frame und damit GC-Druck auf langen Sessions.
  const namedCurves = useMemo(() => {
    const route = NAMED_AUFTRAG.route;
    const curves = [];
    for (let i = 0; i < route.length - 1; i++) {
      const fromPos = stationById(route[i]).pos;
      const toPos   = stationById(route[i + 1]).pos;
      curves.push(buildPath(fromPos, toPos, { lift: 0.6 }));
    }
    return curves;
  }, []);

  // Initialisierung der Partikel-States.
  useMemo(() => {
    flowDataRef.current = [];
    for (let i = 0; i < flowsCount; i++) {
      const pathIdx = i % VISIBLE_FLOWS.length;
      const offset  = Math.random();
      flowDataRef.current.push({
        pathIdx,
        t: offset,
        speed: 0.12 + Math.random() * 0.06,
      });
    }
    shadowDataRef.current = [];
    for (let i = 0; i < shadowCount; i++) {
      const pathIdx = i % SHADOW_FLOWS.length;
      shadowDataRef.current.push({
        pathIdx,
        t: Math.random(),
        speed: 0.10 + Math.random() * 0.08,
        burnAt: 0.85 + Math.random() * 0.1,
        split: Math.random() < 0.35, // Doppelpflege-Markierung
      });
    }
  }, [flowsCount, shadowCount]);

  // Imperative API für Choreografie.
  const stateRef = useRef({
    visibleDensity:   1.0,
    shadowDensity:    0.0,
    shadowIntensity:  1.0,
    shadowBurnoutRate:0.0,
    namedProgress:    0.0,
    namedStuck:       0.0,    // 0..1 = wie lange am Wartepunkt
    namedWaitIndex:   0,      // welcher waits[]-Eintrag aktiv ist
  });

  useImperativeHandle(ref, () => ({
    setVisibleDensity(v)   { stateRef.current.visibleDensity = v; },
    setShadowDensity(v)    { stateRef.current.shadowDensity = v; },
    setShadowIntensity(v)  { stateRef.current.shadowIntensity = v; },
    setShadowBurnout(v)    { stateRef.current.shadowBurnoutRate = v; },
    setNamedProgress(v)    { stateRef.current.namedProgress = v; },
    setNamedStuck(v, idx)  { stateRef.current.namedStuck = v; stateRef.current.namedWaitIndex = idx ?? 0; },
    getNamedWorldPos() {
      if (!namedRef.current) return null;
      return namedRef.current.position.clone();
    },
  }));

  // Frame-Update.
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const S = stateRef.current;

    // ── Flow-Partikel ──
    if (flowMeshRef.current) {
      const mesh = flowMeshRef.current;
      flowDataRef.current.forEach((p, i) => {
        p.t += dt * p.speed * S.visibleDensity;
        if (p.t > 1) p.t -= 1;
        const curve = flowCurvesMemo[p.pathIdx];
        if (!curve) return;
        curve.getPointAt(p.t, tmp);
        dummy.position.copy(tmp);
        // Leichte Y-Schwebebewegung
        dummy.position.y += 0.05 + Math.sin(t * 2 + i) * 0.02;
        const scale = 0.045 + 0.015 * Math.sin(t * 3 + i);
        dummy.scale.setScalar(scale * S.visibleDensity);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    // ── Shadow-Partikel ──
    if (shadowMeshRef.current) {
      const mesh = shadowMeshRef.current;
      shadowDataRef.current.forEach((p, i) => {
        p.t += dt * p.speed * (1 + S.shadowIntensity * 0.5);
        if (p.t > 1) {
          // Burnout: Partikel verglüht und respawnt mit etwas Verzögerung
          if (Math.random() < S.shadowBurnoutRate) {
            p.t = -Math.random() * 0.2; // negative t = unsichtbar
          } else {
            p.t -= 1;
          }
        }
        const data = shadowCurvesMemo[p.pathIdx];
        if (!data) return;
        const visible = p.t >= 0 && p.t <= 1;
        const curve = data.curve;

        if (visible) {
          curve.getPointAt(Math.max(0, Math.min(1, p.t)), tmp);
          dummy.position.copy(tmp);
          dummy.position.y += 0.04 + Math.sin(t * 4 + i) * 0.03;

          // Split-Effekt: Doppelpflege-Partikel teilen sich sichtbar
          if (p.split && p.t > 0.45 && p.t < 0.55) {
            dummy.position.x += Math.sin(t * 8 + i) * 0.15;
          }

          const scale = (0.06 + Math.sin(t * 5 + i) * 0.02) * S.shadowDensity * S.shadowIntensity;
          dummy.scale.setScalar(scale);
        } else {
          dummy.scale.setScalar(0);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }

    // ── Named Auftrag BV-2419 ──
    if (namedRef.current) {
      const segs = namedCurves.length;
      // namedProgress 0..1 → segmente verteilen
      const p = THREE.MathUtils.clamp(S.namedProgress, 0, 1);
      const idx = Math.min(segs - 1, Math.floor(p * segs));
      const localT = (p * segs) - idx;

      const curve = namedCurves[idx];

      // Stuck-State: Partikel verharrt am Endpunkt + zittert leicht
      const eff = S.namedStuck > 0 ? 0.95 : localT;
      curve.getPointAt(eff, tmp);
      namedRef.current.position.copy(tmp);
      namedRef.current.position.y += 0.18 + (S.namedStuck > 0 ? Math.sin(t * 12) * 0.03 : 0);

      // Pulsing scale — größer wenn stuck
      const baseScale = 0.13 + Math.sin(t * 3) * 0.015;
      namedRef.current.scale.setScalar(baseScale * (1 + S.namedStuck * 0.5));

      // Halo um den Auftrag
      if (haloRef.current) {
        haloRef.current.position.copy(namedRef.current.position);
        const haloS = 1 + Math.sin(t * 2) * 0.08 + S.namedStuck * 0.4;
        haloRef.current.scale.setScalar(haloS);
        haloRef.current.material.opacity = 0.3 + S.namedStuck * 0.4;
      }
    }
  });

  return (
    <>
      {/* Sichtbare Flow-Partikel */}
      <instancedMesh ref={flowMeshRef} args={[null, null, flowsCount]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={c3.ink} transparent opacity={0.85} />
      </instancedMesh>

      {/* Shadow-Partikel + Named Auftrag — Select enabled markiert sie für
          den SelectiveBloom-Pass in HeroScene. */}
      <Select enabled>
        <instancedMesh
          ref={shadowMeshRef}
          args={[null, null, shadowCount]}
          onUpdate={(self) => self.layers.enable(1)}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={c3.trace} transparent opacity={0.95} />
        </instancedMesh>

        {/* Named Auftrag BV-2419 — Halo + Core */}
        <mesh
          ref={haloRef}
          onUpdate={(self) => self.layers.enable(1)}
        >
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshBasicMaterial color={c3.trace} transparent opacity={0.3} />
        </mesh>
        <mesh
          ref={namedRef}
          onUpdate={(self) => self.layers.enable(1)}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color={c3.trace} transparent opacity={1} />
        </mesh>
      </Select>
    </>
  );
});

export default Particles;
