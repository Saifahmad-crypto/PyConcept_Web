import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

export interface ElevatorFloor3DProps {
  currentFloor: number;
  startFloor: number;
  targetFloor: number;
  activePass?: number;
  isMoving?: boolean;
}

const TOTAL_FLOORS = 8; // 0 to 7
const FLOOR_HEIGHT = 1.4;

function ElevatorShaft({
  currentFloor,
  startFloor,
  targetFloor,
}: {
  currentFloor: number;
  startFloor: number;
  targetFloor: number;
}) {
  const cabinRef = useRef<THREE.Group>(null);
  const targetY = currentFloor * FLOOR_HEIGHT;

  useFrame((_, delta) => {
    if (cabinRef.current) {
      // Smooth interpolation towards currentFloor height
      cabinRef.current.position.y = THREE.MathUtils.damp(
        cabinRef.current.position.y,
        targetY,
        8,
        delta
      );
    }
  });

  return (
    <group position={[0, -4.5, 0]}>
      {/* Shaft frame pillars */}
      <mesh position={[-1.1, (TOTAL_FLOORS * FLOOR_HEIGHT) / 2 - 0.7, -1.1]}>
        <boxGeometry args={[0.08, TOTAL_FLOORS * FLOOR_HEIGHT, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[1.1, (TOTAL_FLOORS * FLOOR_HEIGHT) / 2 - 0.7, -1.1]}>
        <boxGeometry args={[0.08, TOTAL_FLOORS * FLOOR_HEIGHT, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[-1.1, (TOTAL_FLOORS * FLOOR_HEIGHT) / 2 - 0.7, 1.1]}>
        <boxGeometry args={[0.08, TOTAL_FLOORS * FLOOR_HEIGHT, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[1.1, (TOTAL_FLOORS * FLOOR_HEIGHT) / 2 - 0.7, 1.1]}>
        <boxGeometry args={[0.08, TOTAL_FLOORS * FLOOR_HEIGHT, 0.08]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Floors Platforms & Labels */}
      {Array.from({ length: TOTAL_FLOORS }).map((_, floor) => {
        const y = floor * FLOOR_HEIGHT;
        const isTarget = floor === targetFloor;
        const isStart = floor === startFloor;
        const isCurrent = floor === currentFloor;

        return (
          <group key={floor} position={[0, y, 0]}>
            {/* Floor Slab */}
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[2.5, 0.1, 2.5]} />
              <meshStandardMaterial
                color={isCurrent ? '#475569' : '#1e293b'}
                roughness={0.7}
              />
            </mesh>

            {/* Floor Number Indicator */}
            <Text
              position={[1.5, 0.4, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.32}
              color={
                isCurrent
                  ? '#38bdf8'
                  : isTarget
                  ? '#a855f7'
                  : isStart
                  ? '#f59e0b'
                  : '#94a3b8'
              }
              anchorX="center"
              anchorY="middle"
            >
              {`F${floor}${isTarget ? ' (Dest)' : isStart ? ' (Start)' : ''}`}
            </Text>
          </group>
        );
      })}

      {/* Moving Elevator Cabin */}
      <group ref={cabinRef} position={[0, targetY, 0]}>
        {/* Outer Cabin Glass/Metallic Shell */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.6, 1.2, 1.6]} />
          <meshStandardMaterial
            color="#E10906"
            emissive="#E10906"
            emissiveIntensity={0.25}
            transparent
            opacity={0.88}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* Interior Accent Ceiling Light */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[1.2, 0.05, 1.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>

        {/* Floor Indicator on Cabin Front */}
        <Text
          position={[0, 0.6, 0.82]}
          fontSize={0.38}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {String(currentFloor)}
        </Text>
      </group>
    </group>
  );
}

const ElevatorFloor3D: React.FC<ElevatorFloor3DProps> = ({
  currentFloor,
  startFloor,
  targetFloor,
}) => {
  return (
    <div className="relative h-[380px] sm:h-[430px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#090101] via-[#100303] to-[#1a0808]">
      {/* 3D Scene Controls Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Interactive 3D · Drag to Orbit · Scroll to Zoom</span>
      </div>

      <Canvas
        camera={{ position: [5, 2, 6], fov: 48 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[6, 8, 5]} intensity={1.2} />
        <directionalLight position={[-5, 4, -4]} intensity={0.4} color="#8b5cf6" />
        <pointLight position={[0, 0, 3]} intensity={0.6} color="#E10906" />

        <ElevatorShaft
          currentFloor={currentFloor}
          startFloor={startFloor}
          targetFloor={targetFloor}
        />

        <OrbitControls
          enablePan={false}
          minDistance={3.5}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.2, 0]}
        />
      </Canvas>
    </div>
  );
};

export default ElevatorFloor3D;
