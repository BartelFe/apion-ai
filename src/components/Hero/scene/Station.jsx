import { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { c3 } from '../../../lib/tokens';

// Eine Station = Bodenplatte + leicht extrudiertes Gebäude + Label + Tool-Sticker.
// Architektonisch-skizzenhaft: dünne Linien (EdgesGeometry), helle Flächen.
// Disposition (isHub) bekommt eine eigene, höhere Geometrie.
export default function Station({ data, dimmed = false }) {
  const { label, sub, pos, size, tools, isHub } = data;
  const [w, h, d] = size;

  // Edges-Helper: skizzenhafter Look.
  const buildingGeo = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  const edgesGeo    = useMemo(() => new THREE.EdgesGeometry(buildingGeo), [buildingGeo]);

  // Bodenplatte (etwas größer als Building)
  const padW = w * 1.6;
  const padD = d * 1.6;

  return (
    <group position={pos}>
      {/* Bodenplatte — sehr subtil, damit kein Bloom-Trigger */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[padW, padD]} />
        <meshBasicMaterial
          color={isHub ? c3.mist : c3.paper}
          transparent
          opacity={dimmed ? 0.05 : 0.18}
        />
      </mesh>
      {/* Bodenplatte-Outline */}
      <lineSegments
        position={[0, 0.006, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <edgesGeometry args={[new THREE.PlaneGeometry(padW, padD)]} />
        <lineBasicMaterial color={c3.steel} transparent opacity={dimmed ? 0.2 : 0.45} />
      </lineSegments>

      {/* Building — fast unsichtbarer Fill, der Look entsteht durch Edges */}
      <mesh geometry={buildingGeo} position={[0, h / 2, 0]}>
        <meshBasicMaterial
          color={c3.paper}
          transparent
          opacity={dimmed ? 0.04 : 0.10}
        />
      </mesh>
      {/* Edges-Outline */}
      <lineSegments geometry={edgesGeo} position={[0, h / 2, 0]}>
        <lineBasicMaterial
          color={isHub ? c3.trace : c3.ink}
          transparent
          opacity={dimmed ? 0.25 : (isHub ? 0.85 : 0.7)}
        />
      </lineSegments>

      {/* Hub-Indicator: oranger Ring um die Disposition */}
      {isHub && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[padW * 0.55, padW * 0.58, 64]} />
          <meshBasicMaterial color={c3.trace} transparent opacity={dimmed ? 0.15 : 0.4} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Station-Label über dem Gebäude */}
      <Text
        position={[0, h + 0.55, 0]}
        fontSize={0.30}
        color={c3.ink}
        anchorX="center"
        anchorY="middle"
        font={undefined}
        fillOpacity={dimmed ? 0.3 : 0.95}
        outlineWidth={0}
        letterSpacing={-0.02}
      >
        {label}
      </Text>
      <Text
        position={[0, h + 0.28, 0]}
        fontSize={0.16}
        color={c3.steel}
        anchorX="center"
        anchorY="middle"
        fillOpacity={dimmed ? 0.2 : 0.7}
      >
        {sub}
      </Text>

      {/* Tool-Sticker — gestapelt rechts vom Gebäude */}
      <group position={[w / 2 + 0.6, 0.4, 0]}>
        {tools.map((t, i) => (
          <ToolSticker key={t} text={t} index={i} dimmed={dimmed} />
        ))}
      </group>
    </group>
  );
}

function ToolSticker({ text, index, dimmed }) {
  const ref = useRef();
  const yOffset = index * 0.32;
  return (
    <group ref={ref} position={[0, yOffset, 0]}>
      {/* Hintergrund-Plane für den Sticker */}
      <mesh>
        <planeGeometry args={[Math.max(0.9, text.length * 0.13), 0.24]} />
        <meshBasicMaterial color={c3.ink} transparent opacity={dimmed ? 0.15 : 0.78} />
      </mesh>
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.13}
        color={c3.paper}
        anchorX="center"
        anchorY="middle"
        fillOpacity={dimmed ? 0.4 : 1}
      >
        {text}
      </Text>
    </group>
  );
}
