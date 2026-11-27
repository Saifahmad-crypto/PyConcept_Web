import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Layers, RefreshCw, Eye } from 'lucide-react';

export interface FizzBuzz3DProps {
  maxN: number;
  currentI: number;
  currentVal: string;
  onSelectN?: (n: number) => void;
}

interface NumberToken {
  num: number;
  tag: string;
  type: 'fizzbuzz' | 'fizz' | 'buzz' | 'num';
  color: string;
  glowColor: string;
  heapAddr: string;
}

function getTokenProps(i: number): NumberToken {
  const is3 = i % 3 === 0;
  const is5 = i % 5 === 0;
  const heapAddr = `0x7f00${(100 + i).toString(16)}`;

  if (is3 && is5) {
    return { num: i, tag: 'FizzBuzz', type: 'fizzbuzz', color: '#9333ea', glowColor: '#c084fc', heapAddr };
  }
  if (is3) {
    return { num: i, tag: 'Fizz', type: 'fizz', color: '#0284c7', glowColor: '#38bdf8', heapAddr };
  }
  if (is5) {
    return { num: i, tag: 'Buzz', type: 'buzz', color: '#d97706', glowColor: '#fbbf24', heapAddr };
  }
  return { num: i, tag: String(i), type: 'num', color: '#059669', glowColor: '#34d399', heapAddr };
}

// 1. Hydraulic Stamping Press for FizzBuzz
function FizzBuzzPress({ isStamping }: { isStamping: boolean }) {
  const pistonRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!pistonRef.current) return;
    const targetY = isStamping ? 0.38 : 1.75;
    pistonRef.current.position.y = THREE.MathUtils.damp(
      pistonRef.current.position.y,
      targetY,
      isStamping ? 14 : 7,
      delta
    );
  });

  return (
    <group position={[-2.8, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.8, 0.24, 1.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Guide Pillars */}
      {[
        [-0.65, -0.65],
        [0.65, -0.65],
        [-0.65, 0.65],
        [0.65, 0.65],
      ].map(([px, pz], idx) => (
        <mesh key={idx} position={[px, 1.25, pz]}>
          <cylinderGeometry args={[0.045, 0.045, 2.3, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* Top Crossbeam */}
      <mesh position={[0, 2.45, 0]}>
        <boxGeometry args={[1.9, 0.32, 1.9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Center Cylinder */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.7, 24]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Moving Head */}
      <group ref={pistonRef} position={[0, 1.75, 0]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.75, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.95} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.18, 1.5]} />
          <meshStandardMaterial
            color="#E10906"
            emissive="#E10906"
            emissiveIntensity={isStamping ? 0.45 : 0.15}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        <Text position={[0, 0, 0.76]} fontSize={0.13} color="#ffffff" anchorX="center" anchorY="middle">
          FIZZBUZZ STAMP
        </Text>
      </group>
    </group>
  );
}

// 2. Stack Frame Podium ("stack: main()")
function StackPodium({ currentI, currentVal }: { currentI: number; currentVal: string }) {
  return (
    <group position={[-2.8, 0, 1.95]}>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.5, 0.32, 1.1]} />
        <meshStandardMaterial color="#1e1136" roughness={0.4} metalness={0.6} />
      </mesh>

      <group position={[0, 0.34, 0]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.85]} />
          <meshStandardMaterial color="#0b0617" emissive="#581c87" emissiveIntensity={0.2} roughness={0.2} />
        </mesh>

        <Text position={[-0.55, 0.03, -0.22]} fontSize={0.085} color="#c084fc" anchorX="left">
          stack: main()
        </Text>
        <Text position={[-0.55, 0.03, -0.06]} fontSize={0.075} color="#94a3b8" anchorX="left">
          {`i: int = ${currentI}`}
        </Text>
        <Text position={[-0.55, 0.03, 0.1]} fontSize={0.075} color="#38bdf8" anchorX="left">
          {`val: str = "${currentVal || '...'}"`}
        </Text>
      </group>

      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[1.56, 0.02, 1.16]} />
        <meshBasicMaterial color="#a855f7" wireframe />
      </mesh>
    </group>
  );
}

// 3. 3D Flip Token Card
function TokenCard3D({
  token,
  positionX,
  isSelected,
  isFlipped,
  onCardClick,
}: {
  token: NumberToken;
  positionX: number;
  isSelected: boolean;
  isFlipped: boolean;
  onCardClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotY = isFlipped ? Math.PI : 0;
  const targetElevation = isSelected ? 0.15 : 0;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 8, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetElevation, 6, delta);
    }
  });

  return (
    <group position={[positionX, 0, 0]}>
      {/* Ground Neon Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.65, 32]} />
        <meshBasicMaterial
          color={token.glowColor}
          transparent
          opacity={isSelected ? 0.95 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={groupRef} onClick={onCardClick}>
        {/* Card Body */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[1.15, 1.8, 0.07]} />
          <meshStandardMaterial color={isSelected ? '#ffffff' : '#f8fafc'} roughness={0.25} />
        </mesh>

        {/* Top Banner */}
        <mesh position={[0, 1.9, 0]}>
          <boxGeometry args={[1.2, 0.16, 0.09]} />
          <meshStandardMaterial color={token.color} emissive={token.color} emissiveIntensity={0.25} />
        </mesh>

        {/* FRONT FACE */}
        <group position={[0, 1.1, 0.04]}>
          <Text position={[0, 0.68, 0]} fontSize={0.08} color="#ffffff" anchorX="center" anchorY="middle">
            TOKEN OBJECT
          </Text>
          <Text position={[0, 0.32, 0]} fontSize={0.26} color="#0f172a" anchorX="center" anchorY="middle">
            {String(token.num)}
          </Text>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.9, 0.015, 0.002]} />
            <meshBasicMaterial color="#e2e8f0" />
          </mesh>

          {/* Stamped Tag */}
          <group position={[0, -0.22, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.95, 0.32, 0.02]} />
              <meshStandardMaterial color={token.color} emissive={token.color} emissiveIntensity={0.3} />
            </mesh>
            <Text position={[0, 0, 0.02]} fontSize={0.12} color="#ffffff" anchorX="center" anchorY="middle">
              {token.tag}
            </Text>
          </group>

          <Text position={[0, -0.68, 0]} fontSize={0.06} color="#94a3b8" anchorX="center">
            Click to flip
          </Text>
        </group>

        {/* BACK FACE (__dict__ & modulo logic) */}
        <group position={[0, 1.1, -0.04]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0, -0.005]}>
            <boxGeometry args={[1.1, 1.7, 0.01]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>

          <Text position={[0, 0.68, 0.01]} fontSize={0.08} color="#eab308" anchorX="center">
            {`token_${token.num}.__dict__`}
          </Text>
          <Text position={[0, 0.44, 0.01]} fontSize={0.065} color="#94a3b8" anchorX="center">
            HEAP ADDRESS
          </Text>
          <Text position={[0, 0.3, 0.01]} fontSize={0.09} color="#38bdf8" anchorX="center">
            {token.heapAddr}
          </Text>

          <Text position={[-0.45, 0.08, 0.01]} fontSize={0.065} color="#cbd5e1" anchorX="left">
            {`i % 3 == 0 : ${token.num % 3 === 0 ? 'True' : 'False'}`}
          </Text>
          <Text position={[-0.45, -0.08, 0.01]} fontSize={0.065} color="#cbd5e1" anchorX="left">
            {`i % 5 == 0 : ${token.num % 5 === 0 ? 'True' : 'False'}`}
          </Text>
          <Text position={[-0.45, -0.26, 0.01]} fontSize={0.07} color={token.glowColor} anchorX="left">
            {`result = "${token.tag}"`}
          </Text>
          <Text position={[0, -0.65, 0.01]} fontSize={0.06} color="#64748b" anchorX="center">
            Click to flip
          </Text>
        </group>
      </group>
    </group>
  );
}

// 4. Curved Pointer Arc with Traveling Particle
function PointerArc({
  startX,
  startY,
  startZ,
  endX,
  endY,
  endZ,
  color,
}: {
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
  color: string;
}) {
  const particleRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const p0 = new THREE.Vector3(startX, startY, startZ);
    const midX = (startX + endX) / 2;
    const midZ = (startZ + endZ) / 2 - 0.2;
    const p1 = new THREE.Vector3(midX, Math.max(startY, endY) + 1.2, midZ);
    const p2 = new THREE.Vector3(endX, endY, endZ);
    return new THREE.QuadraticBezierCurve3(p0, p1, p2);
  }, [startX, startY, startZ, endX, endY, endZ]);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 36, 0.022, 8, false), [curve]);

  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.elapsedTime * 0.5) % 1;
      particleRef.current.position.copy(curve.getPointAt(t));
    }
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.85} />
      </mesh>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

// 5. Main 3D Canvas Container
const FizzBuzz3D: React.FC<FizzBuzz3DProps> = ({ maxN, currentI, currentVal, onSelectN }) => {
  const [isStamping, setIsStamping] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);
  const [individualFlips, setIndividualFlips] = useState<Record<number, boolean>>({});
  const [showMemory, setShowMemory] = useState(true);
  const controlsRef = useRef<any>(null);

  // Visible tokens (window around currentI, showing up to 4 items)
  const displayTokens = useMemo(() => {
    const start = Math.max(1, Math.min(currentI - 1, maxN - 3));
    const end = Math.min(maxN, start + 3);
    const list: NumberToken[] = [];
    for (let i = start; i <= end; i++) {
      list.push(getTokenProps(i));
    }
    return list;
  }, [maxN, currentI]);

  const handleTriggerStamp = () => {
    setIsStamping(true);
    setTimeout(() => setIsStamping(false), 700);
  };

  useEffect(() => {
    handleTriggerStamp();
  }, [currentI]);

  const activeTokenIdx = displayTokens.findIndex((t) => t.num === currentI);
  const activeTokenX = activeTokenIdx >= 0 ? -0.8 + activeTokenIdx * 1.5 : 0.7;

  return (
    <div className="relative h-[430px] sm:h-[480px] w-full overflow-hidden rounded-2xl border border-[#2C1616] bg-[#0c040e]">
      {/* Top HUD */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerStamp}
            className="flex items-center gap-1.5 rounded-lg bg-[#E10906] hover:bg-[#b90705] text-white px-3 py-1.5 text-xs font-bold shadow-md shadow-red-950/50 transition-all cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Stamp 3D Press</span>
          </button>
          <button
            onClick={() => setAllFlipped((f) => !f)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              allFlipped
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-950/50'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{allFlipped ? 'Show Front' : 'Flip Cards'}</span>
          </button>
          <button
            onClick={() => setShowMemory((s) => !s)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              showMemory
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-950/50'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Heap &amp; Stack</span>
          </button>
        </div>
        <button
          onClick={() => controlsRef.current?.reset()}
          className="flex items-center gap-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-slate-300 border border-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Orbit</span>
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0.5, 3.2, 7.2], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 9, 6]} intensity={1.4} castShadow />
        <directionalLight position={[-6, 6, -3]} intensity={0.6} color="#a855f7" />
        <pointLight position={[-2.8, 2.5, 0]} intensity={1.2} color="#E10906" distance={6} />

        <group position={[0, -0.6, 0]}>
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[18, 14]} />
            <meshStandardMaterial color="#0b0612" roughness={0.7} />
          </mesh>
          <gridHelper args={[18, 28, '#4c1d95', '#1e1435']} position={[0, 0.005, 0]} />

          <FizzBuzzPress isStamping={isStamping} />
          <StackPodium currentI={currentI} currentVal={currentVal} />

          {displayTokens.map((t, idx) => {
            const posX = -0.8 + idx * 1.5;
            const isSel = t.num === currentI;
            const isFl = allFlipped || !!individualFlips[t.num];

            return (
              <TokenCard3D
                key={t.num}
                token={t}
                positionX={posX}
                isSelected={isSel}
                isFlipped={isFl}
                onCardClick={() => {
                  setIndividualFlips((prev) => ({ ...prev, [t.num]: !prev[t.num] }));
                  if (onSelectN) onSelectN(t.num);
                }}
              />
            );
          })}

          {showMemory && (
            <PointerArc
              startX={-2.8}
              startY={0.45}
              startZ={1.95}
              endX={activeTokenX}
              endY={1.25}
              endZ={0}
              color="#00f0ff"
            />
          )}
        </group>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={3.8}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          target={[0.2, 0.7, 0]}
        />
      </Canvas>

      {/* Bottom HUD */}
      <div className="absolute bottom-2.5 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-[11px] text-slate-300 border border-white/10 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>🖱️ Drag to orbit · Scroll to zoom · Click any 3D Number Card to flip &amp; inspect modulo arithmetic</span>
        </div>
        <div>
          <span className="text-[#8A8585]">Token: </span>
          <strong className="text-white">#{currentI}</strong> ➔ <span className="text-[#FF6B6B] font-bold">{currentVal || '...'}</span>
        </div>
      </div>
    </div>
  );
};

export default FizzBuzz3D;
