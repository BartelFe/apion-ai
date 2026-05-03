import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { c3 } from '../../../lib/tokens';
import { stationById } from '../constants/stations.config';
import { VISIBLE_FLOWS, SHADOW_FLOWS } from '../constants/flows.config';

// Sample-Auflösung pro Pfad (höher = glatter, mehr Verts).
const PATH_SAMPLES = 64;

// Baut eine sanfte Bezier-Kurve zwischen zwei Stationen, leicht gewölbt
// nach oben (so dass Pfade über die Bodenplatte schweben — weniger
// "Linien-Spaghetti", mehr "Strömung").
function buildPath(fromPos, toPos, opts = {}) {
  const { lift = 0.4, sag = 0, kind = 'flow' } = opts;
  const start = new THREE.Vector3(...fromPos).setY(0.05);
  const end   = new THREE.Vector3(...toPos).setY(0.05);

  // Self-loop: Pfad bildet eine kleine Schleife daneben.
  if (start.distanceTo(end) < 0.01) {
    const c1 = start.clone().add(new THREE.Vector3(1.5, 0.6, 0));
    const c2 = start.clone().add(new THREE.Vector3(-1.5, 0.6, 0));
    return new THREE.CubicBezierCurve3(start, c1, c2, end);
  }

  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  // Side-bias für split/wait-Pfade — sie weichen vom direkten Weg ab.
  const sideBias = sag * 0.8;
  const c1 = start.clone().lerp(mid, 0.4).add(new THREE.Vector3(0, lift, sideBias));
  const c2 = end.clone().lerp(mid, 0.4).add(new THREE.Vector3(0, lift, -sideBias));
  return new THREE.CubicBezierCurve3(start, c1, c2, end);
}

// Buildt LineGeometry aus einer Curve.
function curveToBufferGeometry(curve, samples = PATH_SAMPLES) {
  const points = curve.getPoints(samples);
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  // arcLength pro Vertex als Attribut für Shader-Dashes
  const arcLengths = new Float32Array(points.length);
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    acc += points[i].distanceTo(points[i - 1]);
    arcLengths[i] = acc;
  }
  geo.setAttribute('aArc', new THREE.BufferAttribute(arcLengths, 1));
  geo.userData.totalLength = acc;
  return geo;
}

// Shader-Material für die orange Schatten-Linien.
// Animiert Dash-Offset (fließendes "gestricheltes" Gefühl) und
// Reveal über uProgress (0..1) — bis wo die Linie schon "gewachsen" ist.
function createShadowMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime:     { value: 0 },
      uProgress: { value: 0 },     // Akt 2 reveal
      uDashSize: { value: 0.35 },  // Länge eines Dash
      uGapSize:  { value: 0.30 },  // Länge der Lücke
      uOpacity:  { value: 0.92 },
      uColor:    { value: new THREE.Color(c3.trace) },
      uTotal:    { value: 1 },
    },
    vertexShader: /* glsl */`
      attribute float aArc;
      varying float vArc;
      void main() {
        vArc = aArc;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform float uProgress;
      uniform float uDashSize;
      uniform float uGapSize;
      uniform float uOpacity;
      uniform float uTotal;
      uniform vec3  uColor;
      varying float vArc;

      void main() {
        // Reveal-Maske: nur Linien-Teile zeigen, deren arc <= progress*total
        float reveal = step(vArc, uProgress * uTotal);

        // Animated dashes — Dash-Offset wandert über die Zeit.
        float cycle = uDashSize + uGapSize;
        float pos = mod(vArc - uTime * 0.6, cycle);
        float dash = step(pos, uDashSize);

        // Soft-Edge auf den Dashes
        float edge = smoothstep(0.0, 0.05, pos) * (1.0 - smoothstep(uDashSize - 0.05, uDashSize, pos));

        float a = reveal * dash * uOpacity * mix(0.6, 1.0, edge);
        if (a < 0.01) discard;
        gl_FragColor = vec4(uColor, a);
      }
    `,
  });
}

const Connections = forwardRef(function Connections(_, ref) {
  const visibleGroupRef = useRef();
  const shadowGroupRef  = useRef();
  const visibleMatRefs  = useRef([]);
  const shadowMatRefs   = useRef([]);

  // Pre-build geometries
  const visiblePaths = useMemo(() => {
    return VISIBLE_FLOWS.map((f) => {
      const a = stationById(f.from), b = stationById(f.to);
      const curve = buildPath(a.pos, b.pos, { lift: 0.45 });
      return { geo: curveToBufferGeometry(curve), curve };
    });
  }, []);

  const shadowPaths = useMemo(() => {
    return SHADOW_FLOWS.map((f, i) => {
      const a = stationById(f.from), b = stationById(f.to);
      // Side-bias variiert pro Pfad → Spinnennetz-Look statt Stapel
      const sag = ((i % 3) - 1) * 0.7;
      const lift = 0.7 + (i % 4) * 0.15;
      const curve = buildPath(a.pos, b.pos, { lift, sag, kind: f.kind });
      return { geo: curveToBufferGeometry(curve), curve, kind: f.kind, label: f.label };
    });
  }, []);

  // Materials separat behalten, damit GSAP an uniforms ran kann.
  const shadowMaterials = useMemo(
    () => shadowPaths.map((p) => {
      const m = createShadowMaterial();
      m.uniforms.uTotal.value = p.geo.userData.totalLength || 1;
      return m;
    }),
    [shadowPaths]
  );

  useImperativeHandle(ref, () => ({
    visibleGroup: visibleGroupRef.current,
    shadowGroup: shadowGroupRef.current,
    setVisibleOpacity(v) {
      visibleMatRefs.current.forEach((m) => { if (m) m.opacity = v; });
    },
    setShadowProgress(p) {
      shadowMaterials.forEach((m) => { m.uniforms.uProgress.value = p; });
    },
    setShadowOpacity(o) {
      shadowMaterials.forEach((m) => { m.uniforms.uOpacity.value = o; });
    },
    setShadowDash(dash, gap) {
      shadowMaterials.forEach((m) => {
        m.uniforms.uDashSize.value = dash;
        m.uniforms.uGapSize.value  = gap;
      });
    },
    getCurves() {
      return {
        visible: visiblePaths.map((p) => p.curve),
        shadow:  shadowPaths.map((p) => p.curve),
      };
    },
  }));

  // Animate dash-offset
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    shadowMaterials.forEach((m) => { m.uniforms.uTime.value = t; });
  });

  return (
    <>
      {/* Visible layer: dünne, ruhige Linien */}
      <group ref={visibleGroupRef}>
        {visiblePaths.map((p, i) => (
          <line key={`v${i}`} geometry={p.geo}>
            <lineBasicMaterial
              ref={(el) => (visibleMatRefs.current[i] = el)}
              color={c3.ink}
              transparent
              opacity={0.35}
            />
          </line>
        ))}
      </group>

      {/* Shadow layer: orange gestrichelt, animiert */}
      <group ref={shadowGroupRef} layers={1}>
        {shadowPaths.map((p, i) => (
          <line
            key={`s${i}`}
            geometry={p.geo}
            material={shadowMaterials[i]}
            // Layer 1 — wird vom Bloom-Pass selektiert
            ref={(el) => { if (el) el.layers.enable(1); }}
          />
        ))}
      </group>
    </>
  );
});

export default Connections;
export { buildPath, curveToBufferGeometry };
