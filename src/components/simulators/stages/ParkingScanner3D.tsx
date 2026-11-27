import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

export interface ParkingScanner3DProps {
  slots: Array<'Occupied' | 'Available'>;
  activeScanIndex: number; // 0-based index or -1
  foundSlot: number; // 1-based or -1
}

function ParkingLot({ slots, activeScanIndex, foundSlot }: ParkingScanner3DProps) {
  const scannerRef = useRef<THREE.Group>(null);
  const targetX =
    activeScanIndex >= 0
      ? (activeScanIndex % 3) * 2.2 - 2.2
      : foundSlot > 0
      ? ((foundSlot - 1) % 3) * 2.2 - 2.2
      : 0;
  const targetZ =
    activeScanIndex >= 0
      ? Math.floor(activeScanIndex / 3) * 2.6 - 2.6
      : foundSlot > 0
      ? Math.floor((foundSlot - 1) / 3) * 2.6 - 2.6
      : 0;

  useFrame((_, delta) => {
    if (scannerRef.current) {
      scannerRef.current.position.x = THREE.MathUtils.damp(
        scannerRef.current.position.x,
        targetX,
        10,
        delta
      );
      scannerRef.current.position.z = THREE.MathUtils.damp(
        scannerRef.current.position.z,
        targetZ,
        10,
        delta
      );
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Ground Tarmac */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8, 0.1, 9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Slots Layout (3x3 grid) */}
      {slots.map((status, idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const x = col * 2.2 - 2.2;
        const z = row * 2.6 - 2.6;
        const isScanning = activeScanIndex === idx;
        const isFound = foundSlot === idx + 1;
        const isOccupied = status === 'Occupied';

        return (
          <group key={idx} position={[x, 0, z]}>
            {/* Slot Boundary Marking */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[1.8, 0.02, 2.2]} />
              <meshStandardMaterial
                color={
                  isFound
                    ? '#10b981'
                    : isScanning
                    ? '#f59e0b'
                    : isOccupied
                    ? '#ef4444'
                    : '#38bdf8'
                }
                emissive={isFound ? '#10b981' : isScanning ? '#f59e0b' : '#000000'}
                emissiveIntensity={isFound || isScanning ? 0.35 : 0}
                roughness={0.4}
              />
            </mesh>

            {/* Car Mesh if Occupied */}
            {isOccupied && (
              <group position={[0, 0.35, 0]}>
                {/* Body */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[1.2, 0.45, 1.7]} />
                  <meshStandardMaterial color="#b91c1c" roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Roof */}
                <mesh position={[0, 0.32, -0.1]}>
                  <boxGeometry args={[0.9, 0.3, 0.9]} />
                  <meshStandardMaterial color="#7f1d1d" roughness={0.3} />
                </mesh>
              </group>
            )}

            {/* Slot Number Text */}
            <Text
              position={[0, 0.05, 1.25]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.25}
              color={isFound ? '#10b981' : isScanning ? '#f59e0b' : '#94a3b8'}
              anchorX="center"
              anchorY="middle"
            >
              {`Slot ${idx + 1}`}
            </Text>
          </group>
        );
      })}

      {/* Floating Laser Scanner Drone */}
      {(activeScanIndex >= 0 || foundSlot > 0) && (
        <group ref={scannerRef} position={[targetX, 1.6, targetZ]}>
          {/* Drone Body */}
          <mesh>
            <cylinderGeometry args={[0.3, 0.35, 0.2, 16]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#38bdf8"
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Scanning Beam Cone */}
          <mesh position={[0, -0.75, 0]}>
            <coneGeometry args={[0.9, 1.5, 16]} />
            <meshStandardMaterial
              color={foundSlot > 0 ? '#10b981' : '#f59e0b'}
              transparent
              opacity={0.35}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

const ParkingScanner3D: React.FC<ParkingScanner3DProps> = ({
  slots,
  activeScanIndex,
  foundSlot,
}) => {
  return (
    <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#090101] via-[#100303] to-[#1a0808]">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Top-down 3D Parking Lot · Orbit / Pan / Zoom</span>
      </div>

      <Canvas
        camera={{ position: [0, 9, 8], fov: 42 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={1.1} />
        <directionalLight position={[-5, 8, -5]} intensity={0.4} color="#60a5fa" />

        <ParkingLot
          slots={slots}
          activeScanIndex={activeScanIndex}
          foundSlot={foundSlot}
        />

        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.3}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default ParkingScanner3D;
