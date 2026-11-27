import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

export interface AtmDecision3DProps {
  phase: string;
  enteredPin: string;
  balance: number;
  amount: number;
  isApproved: boolean;
  isWrongPin: boolean;
}

function AtmMachine({
  phase,
  enteredPin,
  balance,
  amount,
  isApproved,
  isWrongPin,
}: AtmDecision3DProps) {
  const cashDispenserRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cashDispenserRef.current) {
      // Animate cash notes sliding out if approved
      const targetZ = isApproved ? 0.45 : 0;
      cashDispenserRef.current.position.z = THREE.MathUtils.damp(
        cashDispenserRef.current.position.z,
        targetZ,
        6,
        delta
      );
    }
  });

  return (
    <group position={[0, -1.2, 0]}>
      {/* ATM Main Body Cabinet */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[2.2, 2.8, 1.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Top Banner with Brand Glow */}
      <mesh position={[0, 2.65, 0.81]}>
        <boxGeometry args={[1.9, 0.25, 0.05]} />
        <meshStandardMaterial color="#E10906" emissive="#E10906" emissiveIntensity={0.6} />
      </mesh>
      <Text
        position={[0, 2.65, 0.85]}
        fontSize={0.16}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        PYVERSE BANK ATM
      </Text>

      {/* ATM Screen Bezel */}
      <mesh position={[0, 1.8, 0.81]}>
        <boxGeometry args={[1.7, 1.1, 0.05]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>

      {/* ATM Screen Display */}
      <mesh position={[0, 1.8, 0.84]}>
        <boxGeometry args={[1.5, 0.9, 0.02]} />
        <meshStandardMaterial
          color={isWrongPin ? '#450a0a' : isApproved ? '#064e3b' : '#0369a1'}
          emissive={isWrongPin ? '#ef4444' : isApproved ? '#10b981' : '#0284c7'}
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Screen Text Info */}
      <Text
        position={[0, 2.05, 0.87]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {isWrongPin
          ? '❌ WRONG PIN! CARD REJECTED'
          : isApproved
          ? `✅ APPROVED! DISPENSING $${amount}`
          : `PIN: ${enteredPin} · BAL: $${balance}`}
      </Text>
      <Text
        position={[0, 1.65, 0.87]}
        fontSize={0.09}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
      >
        {`Phase: ${phase.toUpperCase()}`}
      </Text>

      {/* Keypad */}
      <mesh position={[0, 1.05, 0.88]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.8, 0.45, 0.05]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cash Dispenser Slot */}
      <mesh position={[0, 0.55, 0.81]}>
        <boxGeometry args={[1.1, 0.12, 0.05]} />
        <meshStandardMaterial color="#090d16" />
      </mesh>

      {/* Animated Cash Note Ejecting */}
      <group ref={cashDispenserRef} position={[0, 0.55, 0.82]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.9, 0.02, 0.5]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#16a34a"
            emissiveIntensity={isApproved ? 0.5 : 0}
            roughness={0.5}
          />
        </mesh>
      </group>

      {/* Status Light Beacon */}
      <mesh position={[0, 2.9, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={isWrongPin ? '#ef4444' : isApproved ? '#10b981' : '#38bdf8'}
          emissive={isWrongPin ? '#ef4444' : isApproved ? '#10b981' : '#38bdf8'}
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

const AtmDecision3D: React.FC<AtmDecision3DProps> = (props) => {
  return (
    <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#090101] via-[#100303] to-[#1a0808]">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D ATM Machine · Dynamic Screen &amp; Cash Slot</span>
      </div>

      <Canvas
        camera={{ position: [2.5, 1.8, 3.8], fov: 46 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} />
        <pointLight position={[0, 1.5, 2]} intensity={0.5} color="#38bdf8" />

        <AtmMachine {...props} />

        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={7}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0.3, 0]}
        />
      </Canvas>
    </div>
  );
};

export default AtmDecision3D;
