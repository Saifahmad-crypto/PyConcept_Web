import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

export interface SmartAc3DProps {
  temperature: number;
  threshold: number;
  acStatus: string; // 'ON' | 'OFF'
}

function RoomAndAc({ temperature, threshold, acStatus }: SmartAc3DProps) {
  const coolAirRef = useRef<THREE.Group>(null);
  const isAcOn = acStatus === 'ON';

  useFrame((state, delta) => {
    if (coolAirRef.current) {
      if (isAcOn) {
        // Animate particles / waves blowing downward
        coolAirRef.current.position.y -= delta * 1.5;
        if (coolAirRef.current.position.y < -0.8) {
          coolAirRef.current.position.y = 0.8;
        }
      }
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* Room Floor */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 1.8, -2.4]}>
        <boxGeometry args={[5, 3.6, 0.2]} />
        <meshStandardMaterial
          color={isAcOn ? '#0f2744' : '#2d1818'}
          roughness={0.7}
        />
      </mesh>

      {/* AC Unit Mounted on Back Wall */}
      <group position={[0, 2.6, -2.1]}>
        {/* AC Outer Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.2, 0.6, 0.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* AC Vent */}
        <mesh position={[0, -0.22, 0.15]}>
          <boxGeometry args={[1.9, 0.08, 0.25]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* LED Display on AC */}
        <mesh position={[0.7, 0.08, 0.26]}>
          <boxGeometry args={[0.4, 0.2, 0.02]} />
          <meshStandardMaterial
            color={isAcOn ? '#0284c7' : '#1e293b'}
            emissive={isAcOn ? '#38bdf8' : '#000000'}
            emissiveIntensity={isAcOn ? 1 : 0}
          />
        </mesh>
        <Text
          position={[0.7, 0.08, 0.28]}
          fontSize={0.11}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`${temperature}°C`}
        </Text>

        {/* Power Status LED */}
        <mesh position={[-0.8, -0.12, 0.26]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color={isAcOn ? '#10b981' : '#ef4444'}
            emissive={isAcOn ? '#10b981' : '#ef4444'}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* Cool Air Stream Cones/Waves (Visible when AC is ON) */}
      {isAcOn && (
        <group ref={coolAirRef} position={[0, 1.6, -1.5]}>
          {[-0.6, 0, 0.6].map((xOffset, i) => (
            <mesh key={i} position={[xOffset, 0, (i % 2) * 0.2]} rotation={[Math.PI / 4, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.25, 1.2, 12]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={0.8}
                transparent
                opacity={0.38}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Room Thermometer Pillar */}
      <group position={[1.8, 1, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial
            color={temperature > threshold ? '#ef4444' : '#38bdf8'}
            emissive={temperature > threshold ? '#ef4444' : '#38bdf8'}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Status Billboard */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.24}
        color={isAcOn ? '#38bdf8' : '#f59e0b'}
        anchorX="center"
        anchorY="middle"
      >
        {isAcOn
          ? `❄️ AC ACTIVE · Cooling Room (${temperature}°C > ${threshold}°C)`
          : `⏸️ AC OFF · Temp (${temperature}°C <= ${threshold}°C threshold)`}
      </Text>
    </group>
  );
}

const SmartAc3D: React.FC<SmartAc3DProps> = (props) => {
  return (
    <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#090101] via-[#100303] to-[#1a0808]">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D Smart Room · Thermostat &amp; Cold Air Stream</span>
      </div>

      <Canvas
        camera={{ position: [0, 3, 5], fov: 46 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />
        <pointLight
          position={[0, 2.5, -1.8]}
          intensity={props.acStatus === 'ON' ? 1.2 : 0.2}
          color="#38bdf8"
        />

        <RoomAndAc {...props} />

        <OrbitControls
          enablePan={false}
          minDistance={2.5}
          maxDistance={9}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 1.2, -0.8]}
        />
      </Canvas>
    </div>
  );
};

export default SmartAc3D;
