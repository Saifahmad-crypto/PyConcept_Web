import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

export interface CashCounter3DProps {
  denomination: 100 | 200 | 500;
  counted: number;
  totalNotes: number;
  totalAmount: number;
  targetAmount: number;
  isDone: boolean;
}

function CashStacks({
  denomination,
  counted,
  totalNotes,
  totalAmount,
  targetAmount,
  isDone,
}: CashCounter3DProps) {
  const noteGlowColor =
    denomination === 500 ? '#8b5cf6' : denomination === 200 ? '#f59e0b' : '#38bdf8';
  const notePaperColor =
    denomination === 500 ? '#6d28d9' : denomination === 200 ? '#b45309' : '#0369a1';

  return (
    <group position={[0, -0.8, 0]}>
      {/* Counting Table Surface */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[6, 0.2, 4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* LEFT: Uncounted Stack */}
      <group position={[-1.8, 0, 0]}>
        <Text position={[0, 1.8, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
          {`Remaining: ${Math.max(0, totalNotes - counted)}`}
        </Text>
        {Array.from({ length: Math.max(0, totalNotes - counted) }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.08, 0]} rotation={[0, (i % 3) * 0.04, 0]}>
            <boxGeometry args={[1.6, 0.06, 0.8]} />
            <meshStandardMaterial color={notePaperColor} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* CENTER: Counter Mechanism Sensor */}
      <group position={[0, 0.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.1, 1.2]} />
          <meshStandardMaterial color="#334155" metalness={0.6} />
        </mesh>
        {/* Sensor laser beam */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
        <Text position={[0, 0.4, 0]} fontSize={0.24} color="#f8fafc" anchorX="center">
          {`TOTAL: ₹${totalAmount}`}
        </Text>
      </group>

      {/* RIGHT: Counted Stack */}
      <group position={[1.8, 0, 0]}>
        <Text position={[0, 1.8, 0]} fontSize={0.2} color="#10b981" anchorX="center">
          {`Counted: ${counted}`}
        </Text>
        {Array.from({ length: counted }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.08, 0]} rotation={[0, -(i % 3) * 0.04, 0]}>
            <boxGeometry args={[1.6, 0.06, 0.8]} />
            <meshStandardMaterial
              color={notePaperColor}
              emissive={noteGlowColor}
              emissiveIntensity={i === counted - 1 ? 0.6 : 0.1}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Target Status Banner */}
      {targetAmount > 0 && (
        <Text position={[0, -0.4, 1.8]} fontSize={0.18} color="#f59e0b" anchorX="center">
          {totalAmount >= targetAmount
            ? '🎯 TARGET REACHED (break condition triggered)'
            : `🎯 Target Goal: ₹${targetAmount}`}
        </Text>
      )}
    </group>
  );
}

const CashCounter3D: React.FC<CashCounter3DProps> = (props) => {
  return (
    <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#090101] via-[#100303] to-[#1a0808]">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D Cash Stacks · Note-by-note Iterative Accumulation</span>
      </div>

      <Canvas
        camera={{ position: [0, 4.5, 5], fov: 46 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <pointLight position={[0, 2, 2]} intensity={0.6} color="#38bdf8" />

        <CashStacks {...props} />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0.2, 0]}
        />
      </Canvas>
    </div>
  );
};

export default CashCounter3D;
