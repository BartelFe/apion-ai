import { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { c3 } from '../../lib/tokens';

const NODE_COUNT = 28;
const TRACE_NODE_INDICES = [4, 11, 18, 24]; // die "Übeltäter"-Stationen

function generateLayout() {
  // Halb-strukturiertes Layout mit zwei sanften Clustern
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / NODE_COUNT;
    const cluster = i % 2;
    const baseAngle = cluster === 0 ? -Math.PI * 0.3 : Math.PI * 0.3;
    const angle = baseAngle + t * Math.PI * 4 + (Math.random() - 0.5) * 0.8;
    const radius = 1.2 + Math.random() * 2.2;
    nodes.push(
      new THREE.Vector3(
        Math.cos(angle) * radius * 0.9 + (cluster === 0 ? -1 : 1) * 0.6,
        (Math.random() - 0.5) * 3.6,
        Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * 1.0
      )
    );
  }

  // Verbindungen: nähste Nachbarn
  const segments = [];
  const traceSegments = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < 1.9) {
        const isTrace =
          TRACE_NODE_INDICES.includes(i) || TRACE_NODE_INDICES.includes(j)
            ? Math.random() < 0.55
            : false;
        const seg = [nodes[i].clone(), nodes[j].clone()];
        if (isTrace) traceSegments.push(seg);
        else segments.push(seg);
      }
    }
  }

  return { nodes, segments, traceSegments };
}

const DiagnoseScene = forwardRef(function DiagnoseScene(_, ref) {
  const groupRef = useRef();
  const nodeRefs = useRef([]);
  const lineRefs = useRef([]);
  const traceRefs = useRef([]);
  const haloRefs = useRef([]);
  const layout = useMemo(() => generateLayout(), []);
  const { nodes, segments, traceSegments } = layout;

  // Progress-State (0..1) wird vom Parent über die ref gesetzt.
  const progressRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setProgress: (p) => {
      progressRef.current = Math.max(0, Math.min(1, p));
    },
  }));

  // Pre-build line geometries per segment (für "drawing" Effekt)
  const lineGeos = useMemo(
    () => segments.map(([a, b]) => {
      const g = new THREE.BufferGeometry();
      g.setFromPoints([a, b]);
      return g;
    }),
    [segments]
  );

  const traceGeos = useMemo(
    () => traceSegments.map(([a, b]) => {
      const g = new THREE.BufferGeometry();
      g.setFromPoints([a, b]);
      return g;
    }),
    [traceSegments]
  );

  useFrame((state) => {
    const p = progressRef.current;
    const t = state.clock.elapsedTime;

    // Sanfte Eigenbewegung
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04 + state.pointer.x * 0.06;
      groupRef.current.rotation.x = state.pointer.y * 0.04;
    }

    // Knoten: erscheinen zwischen p=0 und p=0.35
    nodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const localStart = (i / nodes.length) * 0.30;
      const localEnd = localStart + 0.10;
      const localP = THREE.MathUtils.smoothstep(p, localStart, localEnd);
      mesh.material.opacity = localP * 0.95;
      mesh.scale.setScalar(0.4 + localP * 0.6);
    });

    // Normale Linien: erscheinen zwischen p=0.30 und p=0.55
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const localStart = 0.30 + (i / lineRefs.current.length) * 0.20;
      const localEnd = localStart + 0.06;
      const localP = THREE.MathUtils.smoothstep(p, localStart, localEnd);
      line.material.opacity = localP * 0.30;
    });

    // Trace-Linien: erscheinen zwischen p=0.55 und p=0.85, dann pulsieren
    traceRefs.current.forEach((line, i) => {
      if (!line) return;
      const localStart = 0.55 + (i / traceRefs.current.length) * 0.20;
      const localEnd = localStart + 0.08;
      const localP = THREE.MathUtils.smoothstep(p, localStart, localEnd);
      const pulseFactor = p > 0.85 ? 0.75 + Math.sin(t * 1.6) * 0.20 : 1.0;
      line.material.opacity = localP * 0.92 * pulseFactor;
    });

    // Halos (um die Übeltäter-Knoten): erscheinen ab p=0.75
    haloRefs.current.forEach((halo, i) => {
      if (!halo) return;
      const localStart = 0.75 + i * 0.04;
      const localEnd = localStart + 0.10;
      const localP = THREE.MathUtils.smoothstep(p, localStart, localEnd);
      halo.material.opacity = localP * 0.5;
      halo.scale.setScalar(1 + Math.sin(t * 2 + i) * 0.06);
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((p, i) => (
        <mesh key={`n${i}`} position={[p.x, p.y, p.z]} ref={(el) => (nodeRefs.current[i] = el)}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial
            color={TRACE_NODE_INDICES.includes(i) ? c3.trace : c3.paper}
            transparent
            opacity={0}
          />
        </mesh>
      ))}

      {segments.map((_, i) => (
        <lineSegments
          key={`l${i}`}
          geometry={lineGeos[i]}
          ref={(el) => (lineRefs.current[i] = el)}
        >
          <lineBasicMaterial color={c3.paper} transparent opacity={0} />
        </lineSegments>
      ))}

      {traceSegments.map((_, i) => (
        <lineSegments
          key={`t${i}`}
          geometry={traceGeos[i]}
          ref={(el) => (traceRefs.current[i] = el)}
        >
          <lineBasicMaterial color={c3.trace} transparent opacity={0} />
        </lineSegments>
      ))}

      {TRACE_NODE_INDICES.map((idx, i) => (
        <mesh
          key={`h${i}`}
          position={nodes[idx].toArray()}
          ref={(el) => (haloRefs.current[i] = el)}
        >
          <ringGeometry args={[0.10, 0.12, 32]} />
          <meshBasicMaterial color={c3.trace} transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
});

const DiagnoseDiagram = forwardRef(function DiagnoseDiagram(_, ref) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <DiagnoseScene ref={ref} />
    </Canvas>
  );
});

export default DiagnoseDiagram;
