import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

export interface TrafficSignal3DProps {
  signal: 'red' | 'yellow' | 'green';
  action: string;
}

function Intersection({ signal, action }: TrafficSignal3DProps) {
  const carRef1 = useRef<THREE.Group>(null);
  const carRef2 = useRef<THREE.Group>(null);

  const isGreen = signal === 'green';
  const isYellow = signal === 'yellow';

  useFrame((_, delta) => {
    const speed = isGreen ? 5.5 : isYellow ? 1.8 : 0;
    if (carRef1.current) {
      if (speed > 0) {
        carRef1.current.position.z += speed * delta;
        if (carRef1.current.position.z > 6) {
          carRef1.current.position.z = -6;
        }
      }
    }
    if (carRef2.current) {
      if (speed > 0) {
        carRef2.current.position.x += speed * delta;
        if (carRef2.current.position.x > 6) {
          carRef2.current.position.x = -6;
        }
      }
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Crossroads Ground */}
      {/* North-South Road */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.08, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* East-West Road */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[14, 0.08, 3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Stop Line */}
      <mesh position={[0, 0.06, -2]}>
        <boxGeometry args={[2.8, 0.02, 0.2]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Traffic Signal Post */}
      <group position={[2.2, 0, -2]}>
        {/* Pole */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.6, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Signal Housing Box */}
        <mesh position={[0, 2.7, 0]}>
          <boxGeometry args={[0.55, 1.4, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>

        {/* Red Light */}
        <mesh position={[0, 3.1, 0.22]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={signal === 'red' ? '#ef4444' : '#450a0a'}
            emissive={signal === 'red' ? '#ef4444' : '#000000'}
            emissiveIntensity={signal === 'red' ? 1.5 : 0.1}
          />
        </mesh>

        {/* Yellow Light */}
        <mesh position={[0, 2.7, 0.22]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={signal === 'yellow' ? '#f59e0b' : '#451a03'}
            emissive={signal === 'yellow' ? '#f59e0b' : '#000000'}
            emissiveIntensity={signal === 'yellow' ? 1.5 : 0.1}
          />
        </mesh>

        {/* Green Light */}
        <mesh position={[0, 2.3, 0.22]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={signal === 'green' ? '#10b981' : '#022c22'}
            emissive={signal === 'green' ? '#10b981' : '#000000'}
            emissiveIntensity={signal === 'green' ? 1.5 : 0.1}
          />
        </mesh>
      </group>

      {/* Car 1 (Approaching traffic light from North) */}
      <group ref={carRef1} position={[0.7, 0.4, -3.5]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 0.45, 1.8]} />
          <meshStandardMaterial color="#E10906" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.35, -0.1]}>
          <boxGeometry args={[0.9, 0.3, 1]} />
          <meshStandardMaterial color="#991b1b" roughness={0.2} />
        </mesh>
      </group>

      {/* Car 2 (Crossroad traffic) */}
      <group ref={carRef2} position={[-4, 0.4, -0.7]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 0.45, 1.1]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[-0.1, 0.35, 0]}>
          <boxGeometry args={[1, 0.3, 0.9]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} />
        </mesh>
      </group>

      {/* Current State Billboard */}
      <Text
        position={[0, 3.8, -2]}
        fontSize={0.36}
        color={signal === 'red' ? '#ef4444' : signal === 'yellow' ? '#f59e0b' : '#10b981'}
        anchorX="center"
        anchorY="middle"
      >
        {`STATUS: ${signal.toUpperCase()} -> ${action}`}
      </Text>
    </group>
  );
}

const TrafficSignal3D: React.FC<TrafficSignal3DProps> = ({ signal, action }) => {
  return (
    <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#090101] via-[#100303] to-[#1a0808]">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D Intersection · Drag to Orbit · Real-time Cars</span>
      </div>

      <Canvas
        camera={{ position: [7, 7, 7], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 12, 6]} intensity={1.2} />
        <directionalLight position={[-6, 6, -6]} intensity={0.3} color="#a855f7" />

        <Intersection signal={signal} action={action} />

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={16}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 1.2, 0]}
        />
      </Canvas>
    </div>
  );
};

export default TrafficSignal3D;
