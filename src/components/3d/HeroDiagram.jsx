import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { c3 } from '../../lib/tokens';

const NODE_COUNT = 34;
const MAX_DIST = 2.0;
const TRACE_RATIO = 0.10;
const PACKET_COUNT = 5;

function generateLayout() {
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const t = i / NODE_COUNT;
    const angle = t * Math.PI * 6 + (Math.random() - 0.5) * 1.2;
    const radius = 1.5 + Math.random() * 2.4;
    nodes.push(
      new THREE.Vector3(
        Math.cos(angle) * radius * 0.9 + (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 4.2,
        Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * 1.0
      )
    );
  }

  const lineSegs = [];
  const traceSegs = [];
  const traceConnections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < MAX_DIST) {
        if (Math.random() < TRACE_RATIO) {
          traceSegs.push(nodes[i].x, nodes[i].y, nodes[i].z);
          traceSegs.push(nodes[j].x, nodes[j].y, nodes[j].z);
          traceConnections.push([nodes[i].clone(), nodes[j].clone()]);
        } else {
          lineSegs.push(nodes[i].x, nodes[i].y, nodes[i].z);
          lineSegs.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
  }

  return { nodes, lineSegs, traceSegs, traceConnections };
}

function Network({ active }) {
  const groupRef = useRef();
  const lineRef = useRef();
  const traceRef = useRef();
  const nodesRef = useRef([]);
  const packetsRef = useRef([]);

  const layout = useMemo(() => generateLayout(), []);
  const { nodes, lineSegs, traceSegs, traceConnections } = layout;

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(lineSegs, 3));
    return g;
  }, [lineSegs]);

  const traceGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(traceSegs, 3));
    return g;
  }, [traceSegs]);

  // Intro Animation
  useEffect(() => {
    if (!active) return;
    const tl = gsap.timeline();

    nodesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      tl.to(
        mesh.material,
        { opacity: 0.95, duration: 1.0, ease: 'power2.out' },
        0.3 + i * 0.015
      );
    });

    if (lineRef.current?.material) {
      tl.to(lineRef.current.material, { opacity: 0.32, duration: 1.4 }, 0.8);
    }
    if (traceRef.current?.material) {
      tl.to(
        traceRef.current.material,
        {
          opacity: 0.85,
          duration: 1.0,
          onComplete: () => {
            traceRef.current.material.userData.pulseActive = true;
          },
        },
        1.6
      );
    }

    packetsRef.current.forEach((p, i) => {
      if (!p) return;
      tl.to(p.material, { opacity: 1, duration: 0.5 }, 1.9 + i * 0.08);
    });

    return () => tl.kill();
  }, [active]);

  // Init packets
  const packets = useMemo(() => {
    const arr = [];
    for (let i = 0; i < Math.min(PACKET_COUNT, traceConnections.length); i++) {
      const conn = traceConnections[Math.floor(Math.random() * traceConnections.length)];
      arr.push({
        start: conn[0],
        end: conn[1],
        progress: Math.random(),
        speed: 0.0015 + Math.random() * 0.0015,
      });
    }
    return arr;
  }, [traceConnections]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05 + state.pointer.x * 0.15;
      groupRef.current.rotation.x = state.pointer.y * 0.08;
    }

    // Trace pulse
    if (traceRef.current?.material?.userData?.pulseActive) {
      traceRef.current.material.opacity = 0.72 + Math.sin(t * 1.6) * 0.22;
    }

    // Packets
    packets.forEach((p, idx) => {
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
        const conn = traceConnections[Math.floor(Math.random() * traceConnections.length)];
        p.start = conn[0];
        p.end = conn[1];
      }
      const mesh = packetsRef.current[idx];
      if (mesh) {
        mesh.position.lerpVectors(p.start, p.end, p.progress);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, p.y, p.z]}
          ref={(el) => (nodesRef.current[i] = el)}
        >
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color={c3.ink} transparent opacity={0} />
        </mesh>
      ))}

      <lineSegments ref={lineRef} geometry={lineGeo}>
        <lineBasicMaterial color={c3.ink} transparent opacity={0} />
      </lineSegments>

      <lineSegments ref={traceRef} geometry={traceGeo}>
        <lineBasicMaterial color={c3.trace} transparent opacity={0} />
      </lineSegments>

      {packets.map((_, i) => (
        <mesh key={`p${i}`} ref={(el) => (packetsRef.current[i] = el)}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={c3.trace} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroDiagram({ active = true }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <Network active={active} />
    </Canvas>
  );
}
