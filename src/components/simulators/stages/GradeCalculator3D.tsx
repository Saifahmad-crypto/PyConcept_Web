import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Layers, RefreshCw, Eye } from 'lucide-react';

export interface GradeCalculator3DProps {
  marks: number;
  grade: string;
  statusText?: string;
  onSelectMarks?: (marks: number) => void;
}

interface StudentData {
  id: string;
  name: string;
  avatar: string;
  branch: string;
  rollNo: string;
  semester: string;
  session: string;
  heapAddr: string;
  baseMarks: number;
  bannerColor: string;
  glowColor: string;
}

const STUDENTS: StudentData[] = [
  {
    id: 's1',
    name: 'Aarav',
    avatar: '⚡',
    branch: 'CSE',
    rollNo: '#101',
    semester: '3rd',
    session: '2025-26',
    heapAddr: '0x7ffd181',
    baseMarks: 92,
    bannerColor: '#0284c7', // Sky Blue
    glowColor: '#38bdf8',
  },
  {
    id: 's2',
    name: 'Diya',
    avatar: '🎨',
    branch: 'ECE',
    rollNo: '#104',
    semester: '3rd',
    session: '2025-26',
    heapAddr: '0x7ffd184',
    baseMarks: 82,
    bannerColor: '#9333ea', // Purple
    glowColor: '#c084fc',
  },
  {
    id: 's3',
    name: 'Kabir',
    avatar: '🎧',
    branch: 'CSE',
    rollNo: '#109',
    semester: '5th',
    session: '2024-25',
    heapAddr: '0x7ffd189',
    baseMarks: 68,
    bannerColor: '#0d9488', // Teal
    glowColor: '#2dd4bf',
  },
];

const CARD_X_POSITIONS = [-0.6, 1.4, 3.4];

// Helper: Calculate grade for marks
function calcGrade(m: number): { grade: string; color: string } {
  if (m >= 90) return { grade: 'A+', color: '#10b981' };
  if (m >= 80) return { grade: 'A', color: '#22c55e' };
  if (m >= 70) return { grade: 'B', color: '#3b82f6' };
  if (m >= 60) return { grade: 'C', color: '#f59e0b' };
  if (m >= 40) return { grade: 'D', color: '#fb923c' };
  return { grade: 'F', color: '#ef4444' };
}

// ----------------------------------------------------------------------------------
// 1. Hydraulic 3D Stamping Press Component (Left side of stage)
// ----------------------------------------------------------------------------------
function HydraulicPress({ isStamping }: { isStamping: boolean }) {
  const pistonRef = useRef<THREE.Group>(null);
  const shockwaveRef = useRef<THREE.Mesh>(null);
  const [impact, setImpact] = useState(false);

  useFrame((_, delta) => {
    if (!pistonRef.current) return;

    // Hydraulic piston moves smoothly down when stamping, otherwise stays up at Y=1.75
    const targetY = isStamping ? 0.38 : 1.75;
    pistonRef.current.position.y = THREE.MathUtils.damp(
      pistonRef.current.position.y,
      targetY,
      isStamping ? 14 : 7,
      delta
    );

    if (isStamping && pistonRef.current.position.y <= 0.45 && !impact) {
      setImpact(true);
    } else if (!isStamping && impact) {
      setImpact(false);
    }

    if (shockwaveRef.current) {
      if (impact) {
        shockwaveRef.current.scale.x = THREE.MathUtils.damp(shockwaveRef.current.scale.x, 2.2, 8, delta);
        shockwaveRef.current.scale.z = THREE.MathUtils.damp(shockwaveRef.current.scale.z, 2.2, 8, delta);
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.damp(
          (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity,
          0.8,
          10,
          delta
        );
      } else {
        shockwaveRef.current.scale.x = 0.5;
        shockwaveRef.current.scale.z = 0.5;
        (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
  });

  return (
    <group position={[-2.7, 0, 0]}>
      {/* Heavy Machinery Base Foundation */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.8, 0.24, 1.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 4 Vertical Steel Guide Columns */}
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

      {/* Top Crossbeam / Engine Housing */}
      <mesh position={[0, 2.45, 0]}>
        <boxGeometry args={[1.9, 0.32, 1.9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Hydraulic Center Main Cylinder */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.7, 24]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Moving Stamping Piston & Head Plate */}
      <group ref={pistonRef} position={[0, 1.75, 0]}>
        {/* Chrome Ram Shaft */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.75, 24]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.95} />
        </mesh>

        {/* Heavy Stamping Press Plate */}
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

        {/* Bottom Laser Engraving Grid */}
        <mesh position={[0, -0.095, 0]}>
          <boxGeometry args={[1.3, 0.01, 1.3]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>

        {/* Label on Press Plate */}
        <Text
          position={[0, 0, 0.76]}
          fontSize={0.13}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          PYVERSE GRADE STAMP
        </Text>
      </group>

      {/* Ground Stamping Anvil Bed */}
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[1.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Shockwave Energy Ring */}
      <mesh ref={shockwaveRef} position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.82, 32]} />
        <meshBasicMaterial color="#E10906" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 2. Stack Frame Podium ("stack: main()")
// ----------------------------------------------------------------------------------
function StackPodium({
  marks,
  grade,
  showMemory,
}: {
  marks: number;
  grade: string;
  showMemory: boolean;
}) {
  return (
    <group position={[-2.7, 0, 1.95]}>
      {/* Slanted Cyber Base */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.5, 0.32, 1.1]} />
        <meshStandardMaterial color="#1e1136" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Angled Terminal Face */}
      <group position={[0, 0.34, 0]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.85]} />
          <meshStandardMaterial
            color="#0b0617"
            emissive="#581c87"
            emissiveIntensity={0.2}
            roughness={0.2}
          />
        </mesh>

        <Text
          position={[-0.55, 0.03, -0.24]}
          fontSize={0.085}
          color="#c084fc"
          anchorX="left"
          anchorY="middle"
        >
          stack: main()
        </Text>

        <Text
          position={[-0.55, 0.03, -0.08]}
          fontSize={0.075}
          color="#94a3b8"
          anchorX="left"
          anchorY="middle"
        >
          {`marks: int = ${marks}`}
        </Text>

        <Text
          position={[-0.55, 0.03, 0.08]}
          fontSize={0.075}
          color="#38bdf8"
          anchorX="left"
          anchorY="middle"
        >
          {`grade: str = "${grade}"`}
        </Text>

        {showMemory && (
          <Text
            position={[-0.55, 0.03, 0.24]}
            fontSize={0.065}
            color="#fbbf24"
            anchorX="left"
            anchorY="middle"
          >
            active_ptr: 0x7ffd181
          </Text>
        )}
      </group>

      {/* Glow Footing Accent */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[1.56, 0.02, 1.16]} />
        <meshBasicMaterial color="#a855f7" wireframe />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 3. 3D Flip Card Component (Student Object Card)
// ----------------------------------------------------------------------------------
function StudentCard3D({
  student,
  positionX,
  isSelected,
  isFlipped,
  gradeInfo,
  onCardClick,
}: {
  student: StudentData;
  positionX: number;
  isSelected: boolean;
  isFlipped: boolean;
  gradeInfo: { grade: string; color: string };
  onCardClick: () => void;
}) {
  const cardGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Target rotation: 0 = Front Face; Math.PI (180 deg) = Back Face (__dict__)
  const targetRotY = isFlipped ? Math.PI : 0;
  const targetElevation = isSelected ? 0.12 : 0;

  useFrame((state, delta) => {
    if (cardGroupRef.current) {
      cardGroupRef.current.rotation.y = THREE.MathUtils.damp(
        cardGroupRef.current.rotation.y,
        targetRotY,
        8,
        delta
      );
      cardGroupRef.current.position.y = THREE.MathUtils.damp(
        cardGroupRef.current.position.y,
        targetElevation,
        6,
        delta
      );
    }

    if (ringRef.current && isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group position={[positionX, 0, 0]}>
      {/* Ground Circular Neon Glow Ring */}
      <mesh
        ref={ringRef}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.78, 0.88, 36]} />
        <meshBasicMaterial
          color={student.glowColor}
          transparent
          opacity={isSelected ? 0.95 : hovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interactive 3D Card Group */}
      <group
        ref={cardGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          onCardClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Main Card Slab Body (White/Metallic clean slab) */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[1.5, 2.15, 0.08]} />
          <meshStandardMaterial
            color={isSelected ? '#ffffff' : '#f8fafc'}
            roughness={0.25}
            metalness={0.15}
          />
        </mesh>

        {/* Card Top Color Accent Bar */}
        <mesh position={[0, 2.24, 0]}>
          <boxGeometry args={[1.56, 0.18, 0.1]} />
          <meshStandardMaterial
            color={student.bannerColor}
            emissive={student.bannerColor}
            emissiveIntensity={isSelected ? 0.4 : 0.1}
            roughness={0.3}
          />
        </mesh>

        {/* ==========================================================
            FRONT FACE (rotation = 0)
            ========================================================== */}
        <group position={[0, 1.25, 0.045]}>
          {/* Header Tag */}
          <Text
            position={[0, 0.88, 0]}
            fontSize={0.09}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            STUDENT OBJECT
          </Text>

          {/* Avatar Icon + Student Name */}
          <Text
            position={[0, 0.58, 0]}
            fontSize={0.18}
            color="#0f172a"
            anchorX="center"
            anchorY="middle"
          >
            {`${student.avatar} ${student.name}`}
          </Text>

          {/* Horizontal Divider Line */}
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[1.2, 0.015, 0.002]} />
            <meshBasicMaterial color="#e2e8f0" />
          </mesh>

          {/* Student Attributes Table */}
          <Text position={[-0.55, 0.26, 0]} fontSize={0.085} color="#64748b" anchorX="left">
            BRANCH
          </Text>
          <Text position={[0.55, 0.26, 0]} fontSize={0.09} color="#1e293b" anchorX="right">
            {student.branch}
          </Text>

          <Text position={[-0.55, 0.08, 0]} fontSize={0.085} color="#64748b" anchorX="left">
            ROLL NO
          </Text>
          <Text position={[0.55, 0.08, 0]} fontSize={0.09} color="#1e293b" anchorX="right">
            {student.rollNo}
          </Text>

          <Text position={[-0.55, -0.1, 0]} fontSize={0.085} color="#64748b" anchorX="left">
            SEMESTER
          </Text>
          <Text position={[0.55, -0.1, 0]} fontSize={0.09} color="#1e293b" anchorX="right">
            {student.semester}
          </Text>

          <Text position={[-0.55, -0.28, 0]} fontSize={0.085} color="#64748b" anchorX="left">
            SESSION
          </Text>
          <Text position={[0.55, -0.28, 0]} fontSize={0.09} color="#1e293b" anchorX="right">
            {student.session}
          </Text>

          {/* Stamped Grade Badge on Front */}
          <group position={[0, -0.62, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.2, 0.32, 0.02]} />
              <meshStandardMaterial
                color={gradeInfo.color}
                emissive={gradeInfo.color}
                emissiveIntensity={0.25}
                roughness={0.3}
              />
            </mesh>
            <Text position={[0, 0, 0.02]} fontSize={0.14} color="#ffffff" anchorX="center" anchorY="middle">
              {`GRADE: ${gradeInfo.grade}`}
            </Text>
          </group>

          {/* Flip Hint */}
          <Text position={[0, -0.92, 0]} fontSize={0.065} color="#94a3b8" anchorX="center" anchorY="middle">
            Click card to flip
          </Text>
        </group>

        {/* ==========================================================
            BACK FACE (rotation = Math.PI, z = -0.045)
            ========================================================== */}
        <group position={[0, 1.25, -0.045]} rotation={[0, Math.PI, 0]}>
          {/* Dark Cyber Code Background for Back */}
          <mesh position={[0, 0, -0.005]}>
            <boxGeometry args={[1.44, 2.05, 0.01]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>

          {/* Header Banner: s.__dict__ */}
          <mesh position={[0, 0.88, 0]}>
            <boxGeometry args={[1.44, 0.18, 0.02]} />
            <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.2} />
          </mesh>
          <Text position={[0, 0.88, 0.02]} fontSize={0.09} color="#000000" anchorX="center" anchorY="middle">
            {`${student.id}.__dict__`}
          </Text>

          {/* Heap Memory Address Badge */}
          <Text position={[0, 0.65, 0.01]} fontSize={0.075} color="#94a3b8" anchorX="center" anchorY="middle">
            HEAP ADDRESS
          </Text>
          <Text position={[0, 0.5, 0.01]} fontSize={0.11} color="#38bdf8" anchorX="center" anchorY="middle">
            {student.heapAddr}
          </Text>

          {/* Method Result: s.introduce() */}
          <Text position={[0, 0.22, 0.01]} fontSize={0.075} color="#a855f7" anchorX="center" anchorY="middle">
            {`${student.id}.introduce()`}
          </Text>
          <Text position={[0, 0.06, 0.01]} fontSize={0.095} color="#f8fafc" anchorX="center" anchorY="middle">
            {`"Hi, I'm ${student.avatar} ${student.name}!"`}
          </Text>

          {/* Dynamic Evaluation State */}
          <Text position={[0, -0.22, 0.01]} fontSize={0.075} color="#64748b" anchorX="center" anchorY="middle">
            EVALUATION STATUS
          </Text>
          <Text position={[0, -0.38, 0.01]} fontSize={0.1} color={gradeInfo.color} anchorX="center" anchorY="middle">
            {gradeInfo.grade !== 'F' ? 'Status: PASS' : 'Status: REPEAT'}
          </Text>

          {/* Click to flip back */}
          <Text position={[0, -0.75, 0.01]} fontSize={0.07} color="#cbd5e1" anchorX="center" anchorY="middle">
            Click card to flip
          </Text>
        </group>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 4. Glowing 3D Curved Pointer Arcs with Traveling Particles
// ----------------------------------------------------------------------------------
function PointerArc({
  startX,
  startY,
  startZ,
  endX,
  endY,
  endZ,
  color,
  speed = 0.5,
  offset = 0,
}: {
  startX: number;
  startY: number;
  startZ: number;
  endX: number;
  endY: number;
  endZ: number;
  color: string;
  speed?: number;
  offset?: number;
}) {
  const particleRef = useRef<THREE.Mesh>(null);

  // Smooth quadratic bezier curve in 3D space
  const curve = useMemo(() => {
    const p0 = new THREE.Vector3(startX, startY, startZ);
    // Control point lifts high into air
    const midX = (startX + endX) / 2;
    const midZ = (startZ + endZ) / 2 - 0.2;
    const p1 = new THREE.Vector3(midX, Math.max(startY, endY) + 1.25, midZ);
    const p2 = new THREE.Vector3(endX, endY, endZ);
    return new THREE.QuadraticBezierCurve3(p0, p1, p2);
  }, [startX, startY, startZ, endX, endY, endZ]);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 40, 0.024, 8, false);
  }, [curve]);

  useFrame((state) => {
    if (particleRef.current) {
      // Continuous smooth loop 0..1 along curve
      const t = (state.clock.elapsedTime * speed + offset) % 1;
      const pt = curve.getPointAt(t);
      particleRef.current.position.copy(pt);
    }
  });

  return (
    <group>
      {/* 3D Glowing Neon Cable */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Traveling Glowing Yellow/Gold Particle Bead */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 5. Main 3D World Scene
// ----------------------------------------------------------------------------------
function Grade3DScene({
  marks,
  grade,
  isStamping,
  showMemory,
  allFlipped,
  individualFlips,
  selectedStudentIdx,
  onSelectStudent,
  onToggleIndividualFlip,
}: {
  marks: number;
  grade: string;
  isStamping: boolean;
  showMemory: boolean;
  allFlipped: boolean;
  individualFlips: boolean[];
  selectedStudentIdx: number;
  onSelectStudent: (idx: number) => void;
  onToggleIndividualFlip: (idx: number) => void;
}) {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Dark Futuristic Cyber Grid Floor */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#0b0612" roughness={0.7} />
      </mesh>
      <gridHelper args={[18, 28, '#4c1d95', '#1e1435']} position={[0, 0.005, 0]} />

      {/* 1. Hydraulic Stamping Press */}
      <HydraulicPress isStamping={isStamping} />

      {/* 2. Stack Frame Podium ("stack: main()") */}
      <StackPodium marks={marks} grade={grade} showMemory={showMemory} />

      {/* 3. Three Interactive Student Object Cards */}
      {STUDENTS.map((student, idx) => {
        const isSelected = selectedStudentIdx === idx;
        const isFlipped = allFlipped || individualFlips[idx];
        const gradeInfo = isSelected ? { grade, color: calcGrade(marks).color } : calcGrade(student.baseMarks);

        return (
          <StudentCard3D
            key={student.id}
            student={student}
            positionX={CARD_X_POSITIONS[idx]}
            isSelected={isSelected}
            isFlipped={isFlipped}
            gradeInfo={gradeInfo}
            onCardClick={() => {
              onSelectStudent(idx);
              onToggleIndividualFlip(idx);
            }}
          />
        );
      })}

      {/* 4. Glowing Curved Pointer Arcs with Traveling Particles */}
      {showMemory && (
        <group>
          {/* Arc 1: stack -> Aarav */}
          <PointerArc
            startX={-2.7}
            startY={0.45}
            startZ={1.95}
            endX={CARD_X_POSITIONS[0]}
            endY={1.35}
            endZ={0}
            color="#00f0ff"
            speed={0.4}
            offset={0}
          />
          {/* Arc 2: stack -> Diya */}
          <PointerArc
            startX={-2.7}
            startY={0.45}
            startZ={1.95}
            endX={CARD_X_POSITIONS[1]}
            endY={1.35}
            endZ={0}
            color="#c084fc"
            speed={0.45}
            offset={0.33}
          />
          {/* Arc 3: stack -> Kabir */}
          <PointerArc
            startX={-2.7}
            startY={0.45}
            startZ={1.95}
            endX={CARD_X_POSITIONS[2]}
            endY={1.35}
            endZ={0}
            color="#2dd4bf"
            speed={0.35}
            offset={0.66}
          />
        </group>
      )}
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 6. Root GradeCalculator3D Component with HUD Controls
// ----------------------------------------------------------------------------------
const GradeCalculator3D: React.FC<GradeCalculator3DProps> = ({
  marks,
  grade,
  statusText,
  onSelectMarks,
}) => {
  const [isStamping, setIsStamping] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);
  const [individualFlips, setIndividualFlips] = useState([false, false, false]);
  const [showMemory, setShowMemory] = useState(true);
  const [selectedStudentIdx, setSelectedStudentIdx] = useState(0);
  const controlsRef = useRef<any>(null);

  // Trigger hydraulic press animation
  const handleTriggerStamp = () => {
    setIsStamping(true);
    setTimeout(() => {
      setIsStamping(false);
    }, 700);
  };

  // Flip all cards toggle
  const handleToggleFlipCards = () => {
    setAllFlipped((prev) => !prev);
  };

  // Individual card flip
  const handleToggleIndividualFlip = (idx: number) => {
    setIndividualFlips((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  // Reset OrbitControls camera
  const handleResetOrbit = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Automatically trigger a quick stamp when marks change!
  useEffect(() => {
    handleTriggerStamp();
  }, [marks]);

  return (
    <div className="relative h-[430px] sm:h-[480px] w-full overflow-hidden rounded-2xl border border-[#2C1616] bg-[#0c040e]">
      {/* =========================================================================
          TOP INTERACTIVE 3D HUD CONTROL STRIP (Matches reference image)
          ========================================================================= */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* 1. Stamp 3D Press Button */}
          <button
            onClick={handleTriggerStamp}
            className="flex items-center gap-1.5 rounded-lg bg-[#E10906] hover:bg-[#b90705] text-white px-3 py-1.5 text-xs font-bold shadow-md shadow-red-950/50 transition-all active:scale-95 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Stamp 3D Press</span>
          </button>

          {/* 2. Flip Cards Button */}
          <button
            onClick={handleToggleFlipCards}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              allFlipped
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-950/50'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{allFlipped ? 'Show Front' : 'Flip Cards'}</span>
          </button>

          {/* 3. Heap & Stack Toggle Button */}
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

        {/* 4. Reset Orbit Camera Button */}
        <button
          onClick={handleResetOrbit}
          className="flex items-center gap-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-slate-300 border border-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Orbit</span>
        </button>
      </div>

      {/* =========================================================================
          THREE.JS 3D CANVAS
          ========================================================================= */}
      <Canvas
        camera={{ position: [0.5, 3.2, 7.2], fov: 42 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 9, 6]} intensity={1.4} castShadow />
        <directionalLight position={[-6, 6, -3]} intensity={0.6} color="#a855f7" />
        <pointLight position={[-2.7, 2.5, 0]} intensity={1.2} color="#E10906" distance={6} />
        <pointLight position={[1.4, 2, 2]} intensity={0.8} color="#38bdf8" distance={5} />

        <Grade3DScene
          marks={marks}
          grade={grade}
          isStamping={isStamping}
          showMemory={showMemory}
          allFlipped={allFlipped}
          individualFlips={individualFlips}
          selectedStudentIdx={selectedStudentIdx}
          onSelectStudent={(idx) => {
            setSelectedStudentIdx(idx);
            if (onSelectMarks) {
              onSelectMarks(STUDENTS[idx].baseMarks);
            }
          }}
          onToggleIndividualFlip={handleToggleIndividualFlip}
        />

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

      {/* =========================================================================
          BOTTOM HUD STATUS & INSTRUCTION BAR
          ========================================================================= */}
      <div className="absolute bottom-2.5 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-[11px] text-slate-300 border border-white/10 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>🖱️ Drag to orbit · Scroll to zoom · Click any 3D Student Card to flip &amp; inspect attributes</span>
        </div>
        <div className="text-right">
          <span className="text-[#8A8585]">Active: </span>
          <strong className="text-white">{STUDENTS[selectedStudentIdx].name}</strong> ({marks} marks ➔ {grade})
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator3D;
