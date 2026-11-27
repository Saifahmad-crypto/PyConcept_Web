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
  role: string;
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

// Custom PyVerse student roster requested by user: Saif, Aayan, Imran, Sumaira
const STUDENTS: StudentData[] = [
  {
    id: 's1',
    name: 'Saif',
    role: 'AI & Core Systems',
    avatar: '⚡',
    branch: 'CSE',
    rollNo: '#101',
    semester: '5th',
    session: '2025-26',
    heapAddr: '0x7ffd181',
    baseMarks: 94,
    bannerColor: '#E10906', // PyVerse Red
    glowColor: '#FF4D4D',
  },
  {
    id: 's2',
    name: 'Aayan',
    role: 'Software Architecture',
    avatar: '🚀',
    branch: 'CSE',
    rollNo: '#102',
    semester: '3rd',
    session: '2025-26',
    heapAddr: '0x7ffd184',
    baseMarks: 84,
    bannerColor: '#0284c7', // Cyber Sky
    glowColor: '#38bdf8',
  },
  {
    id: 's3',
    name: 'Imran',
    role: 'Robotics & IoT',
    avatar: '🛠️',
    branch: 'ECE',
    rollNo: '#103',
    semester: '3rd',
    session: '2025-26',
    heapAddr: '0x7ffd189',
    baseMarks: 74,
    bannerColor: '#9333ea', // Cyber Purple
    glowColor: '#c084fc',
  },
  {
    id: 's4',
    name: 'Sumaira',
    role: 'Cyber Security',
    avatar: '🌸',
    branch: 'CSE',
    rollNo: '#104',
    semester: '5th',
    session: '2024-25',
    heapAddr: '0x7ffd192',
    baseMarks: 88,
    bannerColor: '#d946ef', // Neon Magenta
    glowColor: '#f472b6',
  },
];

const CARD_X_POSITIONS = [-1.3, 0.5, 2.3, 4.1];

function calcGrade(m: number): { grade: string; color: string; status: string } {
  if (m >= 90) return { grade: 'A+', color: '#10b981', status: 'Honors / Outstanding' };
  if (m >= 80) return { grade: 'A', color: '#22c55e', status: 'Excellent Consistency' };
  if (m >= 70) return { grade: 'B', color: '#3b82f6', status: 'Good Performance' };
  if (m >= 60) return { grade: 'C', color: '#f59e0b', status: 'Above Average' };
  if (m >= 40) return { grade: 'D', color: '#fb923c', status: 'Passing Threshold' };
  return { grade: 'F', color: '#ef4444', status: 'Review Required' };
}

// ----------------------------------------------------------------------------------
// 1. PyVerse Holographic Laser Evaluator Core (Original Sleek Cyber Design)
// ----------------------------------------------------------------------------------
function HolographicEvaluatorTower({ isScanning }: { isScanning: boolean }) {
  const ringRef = useRef<THREE.Group>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      // Smooth vertical scanning oscillation + rotation
      const targetY = isScanning ? 0.45 : 1.65 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      ringRef.current.position.y = THREE.MathUtils.damp(
        ringRef.current.position.y,
        targetY,
        isScanning ? 12 : 5,
        delta
      );
      ringRef.current.rotation.y += delta * 1.5;
    }

    if (laserBeamRef.current) {
      const beamMat = laserBeamRef.current.material as THREE.MeshBasicMaterial;
      if (isScanning) {
        beamMat.opacity = THREE.MathUtils.damp(beamMat.opacity, 0.75, 12, delta);
        laserBeamRef.current.scale.set(1.4, 1, 1.4);
      } else {
        beamMat.opacity = THREE.MathUtils.damp(beamMat.opacity, 0.12, 6, delta);
        laserBeamRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={[-3.1, 0, 0]}>
      {/* Heavy Hexagonal Cyber Pedestal */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.9, 1.05, 0.28, 6]} />
        <meshStandardMaterial color="#140505" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Glowing Pedestal Rim */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.04, 6]} />
        <meshBasicMaterial color="#E10906" wireframe />
      </mesh>

      {/* Central Quantum Conduits (Twin Carbon Pillars) */}
      <mesh position={[-0.32, 1.35, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 16]} />
        <meshStandardMaterial color="#2a0d0d" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.32, 1.35, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 16]} />
        <meshStandardMaterial color="#2a0d0d" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Top Holographic Projector Crown */}
      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.7, 0.82, 0.26, 6]} />
        <meshStandardMaterial color="#1a0606" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
        <meshBasicMaterial color="#FF4D4D" />
      </mesh>

      {/* Floating Scanning Ring that moves down over cards */}
      <group ref={ringRef} position={[0, 1.65, 0]}>
        {/* Outer Torus Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.04, 16, 32]} />
          <meshStandardMaterial color="#E10906" emissive="#E10906" emissiveIntensity={0.6} />
        </mesh>
        {/* Inner Laser Aperture */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.52, 24]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
        {/* Orbital Emitter Beacons */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
          <mesh key={idx} position={[Math.cos(angle) * 0.72, 0, Math.sin(angle) * 0.72]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#FF6B6B" />
          </mesh>
        ))}
      </group>

      {/* Downward Holographic Scanning Cone / Laser Grid */}
      <mesh ref={laserBeamRef} position={[0, 0.95, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.88, 1.7, 16, 1, true]} />
        <meshBasicMaterial color="#E10906" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <Text position={[0, 2.68, 0]} fontSize={0.11} color="#FF6B6B" anchorX="center" anchorY="middle">
        PYVERSE EVALUATOR
      </Text>
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 2. PyVerse Memory Execution Stack ("stack: main()")
// ----------------------------------------------------------------------------------
function StackPedestal({
  marks,
  grade,
  showMemory,
}: {
  marks: number;
  grade: string;
  showMemory: boolean;
}) {
  return (
    <group position={[-3.1, 0, 1.95]}>
      {/* Angled Dark Carbon Base */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.5, 0.32, 1.1]} />
        <meshStandardMaterial color="#140606" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Angled Glass HUD Screen */}
      <group position={[0, 0.34, 0]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.85]} />
          <meshStandardMaterial color="#080202" emissive="#2d0b0b" emissiveIntensity={0.3} roughness={0.2} />
        </mesh>

        <Text position={[-0.55, 0.03, -0.24]} fontSize={0.085} color="#FF4D4D" anchorX="left" anchorY="middle">
          stack: main()
        </Text>
        <Text position={[-0.55, 0.03, -0.08]} fontSize={0.075} color="#94a3b8" anchorX="left" anchorY="middle">
          {`marks: int = ${marks}`}
        </Text>
        <Text position={[-0.55, 0.03, 0.08]} fontSize={0.075} color="#38bdf8" anchorX="left" anchorY="middle">
          {`grade: str = "${grade}"`}
        </Text>

        {showMemory && (
          <Text position={[-0.55, 0.03, 0.24]} fontSize={0.065} color="#facc15" anchorX="left" anchorY="middle">
            eval_ptr: 0x7ffd181
          </Text>
        )}
      </group>

      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[1.56, 0.02, 1.16]} />
        <meshBasicMaterial color="#E10906" wireframe />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 3. Cyber Student Data Card (Custom Dark Glassmorphic Design)
// ----------------------------------------------------------------------------------
function CyberStudentCard3D({
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
  gradeInfo: { grade: string; color: string; status: string };
  onCardClick: () => void;
}) {
  const cardGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

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
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.04;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group position={[positionX, 0, 0]}>
      {/* Ground Neon Hexagon/Ring */}
      <mesh ref={ringRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.82, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#E10906' : student.glowColor}
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
        {/* Main Card Chassis (Dark Smoked Cyber Glass) */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[1.42, 2.15, 0.07]} />
          <meshStandardMaterial
            color={isSelected ? '#1c0808' : '#120505'}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>

        {/* Card Border Frame */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[1.44, 2.17, 0.065]} />
          <meshBasicMaterial color={isSelected ? '#E10906' : '#2D1414'} wireframe />
        </mesh>

        {/* Top Header Cyber Accent */}
        <mesh position={[0, 2.24, 0]}>
          <boxGeometry args={[1.46, 0.16, 0.09]} />
          <meshStandardMaterial
            color={student.bannerColor}
            emissive={student.bannerColor}
            emissiveIntensity={isSelected ? 0.45 : 0.15}
          />
        </mesh>

        {/* ==========================================================
            FRONT FACE (rotation = 0)
            ========================================================== */}
        <group position={[0, 1.25, 0.04]}>
          {/* Header Subtitle */}
          <Text position={[0, 0.88, 0]} fontSize={0.08} color="#ffffff" anchorX="center" anchorY="middle">
            PYVERSE OBJECT
          </Text>

          {/* Avatar Icon + Student Name */}
          <Text position={[0, 0.6, 0]} fontSize={0.17} color="#ffffff" anchorX="center" anchorY="middle">
            {`${student.avatar} ${student.name}`}
          </Text>

          {/* Role Subtitle */}
          <Text position={[0, 0.43, 0]} fontSize={0.075} color="#FF6B6B" anchorX="center" anchorY="middle">
            {student.role}
          </Text>

          {/* Divider */}
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[1.15, 0.015, 0.002]} />
            <meshBasicMaterial color="#3A1A1A" />
          </mesh>

          {/* Student Info */}
          <Text position={[-0.52, 0.18, 0]} fontSize={0.08} color="#8A8585" anchorX="left">
            BRANCH
          </Text>
          <Text position={[0.52, 0.18, 0]} fontSize={0.085} color="#FBF5F9" anchorX="right">
            {student.branch}
          </Text>

          <Text position={[-0.52, 0.02, 0]} fontSize={0.08} color="#8A8585" anchorX="left">
            ROLL NO
          </Text>
          <Text position={[0.52, 0.02, 0]} fontSize={0.085} color="#FBF5F9" anchorX="right">
            {student.rollNo}
          </Text>

          <Text position={[-0.52, -0.14, 0]} fontSize={0.08} color="#8A8585" anchorX="left">
            SEMESTER
          </Text>
          <Text position={[0.52, -0.14, 0]} fontSize={0.085} color="#FBF5F9" anchorX="right">
            {student.semester}
          </Text>

          <Text position={[-0.52, -0.3, 0]} fontSize={0.08} color="#8A8585" anchorX="left">
            SESSION
          </Text>
          <Text position={[0.52, -0.3, 0]} fontSize={0.085} color="#FBF5F9" anchorX="right">
            {student.session}
          </Text>

          {/* Dynamic Laser Stamped Grade Badge */}
          <group position={[0, -0.62, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.15, 0.3, 0.02]} />
              <meshStandardMaterial
                color={gradeInfo.color}
                emissive={gradeInfo.color}
                emissiveIntensity={0.3}
                roughness={0.2}
              />
            </mesh>
            <Text position={[0, 0, 0.02]} fontSize={0.13} color="#ffffff" anchorX="center" anchorY="middle">
              {`GRADE: ${gradeInfo.grade}`}
            </Text>
          </group>

          <Text position={[0, -0.92, 0]} fontSize={0.06} color="#8A8585" anchorX="center">
            Click card to flip
          </Text>
        </group>

        {/* ==========================================================
            BACK FACE (rotation = Math.PI, z = -0.04)
            ========================================================== */}
        <group position={[0, 1.25, -0.04]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0, -0.005]}>
            <boxGeometry args={[1.36, 2.05, 0.01]} />
            <meshStandardMaterial color="#080203" roughness={0.4} />
          </mesh>

          {/* Header Banner */}
          <mesh position={[0, 0.88, 0]}>
            <boxGeometry args={[1.36, 0.16, 0.02]} />
            <meshStandardMaterial color="#b45309" emissive="#78350f" emissiveIntensity={0.2} />
          </mesh>
          <Text position={[0, 0.88, 0.02]} fontSize={0.085} color="#ffffff" anchorX="center" anchorY="middle">
            {`${student.id}.__dict__`}
          </Text>

          <Text position={[0, 0.66, 0.01]} fontSize={0.07} color="#8A8585" anchorX="center">
            HEAP MEMORY ADDRESS
          </Text>
          <Text position={[0, 0.52, 0.01]} fontSize={0.1} color="#38bdf8" anchorX="center">
            {student.heapAddr}
          </Text>

          {/* Dunder Method Call */}
          <Text position={[0, 0.25, 0.01]} fontSize={0.07} color="#FF6B6B" anchorX="center">
            {`${student.id}.get_profile()`}
          </Text>
          <Text position={[0, 0.1, 0.01]} fontSize={0.08} color="#ffffff" anchorX="center">
            {`"${student.name} | ${student.branch}"`}
          </Text>

          {/* Status Evaluation */}
          <Text position={[0, -0.18, 0.01]} fontSize={0.07} color="#8A8585" anchorX="center">
            EVALUATION STATUS
          </Text>
          <Text position={[0, -0.34, 0.01]} fontSize={0.085} color={gradeInfo.color} anchorX="center">
            {gradeInfo.status}
          </Text>

          <Text position={[0, -0.76, 0.01]} fontSize={0.06} color="#cbd5e1" anchorX="center">
            Click card to flip
          </Text>
        </group>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 4. Crimson Neon Pointer Arcs with Traveling Particles
// ----------------------------------------------------------------------------------
function LaserPointerArc({
  startX,
  startY,
  startZ,
  endX,
  endY,
  endZ,
  color,
  speed = 0.45,
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

  const curve = useMemo(() => {
    const p0 = new THREE.Vector3(startX, startY, startZ);
    const midX = (startX + endX) / 2;
    const midZ = (startZ + endZ) / 2 - 0.2;
    const p1 = new THREE.Vector3(midX, Math.max(startY, endY) + 1.25, midZ);
    const p2 = new THREE.Vector3(endX, endY, endZ);
    return new THREE.QuadraticBezierCurve3(p0, p1, p2);
  }, [startX, startY, startZ, endX, endY, endZ]);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 36, 0.022, 8, false), [curve]);

  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.elapsedTime * speed + offset) % 1;
      particleRef.current.position.copy(curve.getPointAt(t));
    }
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------------
// 5. Root 3D Component with Unique PyVerse Layout
// ----------------------------------------------------------------------------------
const GradeCalculator3D: React.FC<GradeCalculator3DProps> = ({
  marks,
  grade,
  statusText,
  onSelectMarks,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [allFlipped, setAllFlipped] = useState(false);
  const [individualFlips, setIndividualFlips] = useState([false, false, false, false]);
  const [showMemory, setShowMemory] = useState(true);
  const [selectedStudentIdx, setSelectedStudentIdx] = useState(0);
  const controlsRef = useRef<any>(null);

  const handleTriggerScanner = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 800);
  };

  useEffect(() => {
    handleTriggerScanner();
  }, [marks]);

  return (
    <div className="relative h-[430px] sm:h-[480px] w-full overflow-hidden rounded-2xl border border-[#2C1616] bg-[#0c0303]">
      {/* =========================================================================
          TOP PYVERSE CONTROL BAR
          ========================================================================= */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Laser Scanner Button */}
          <button
            onClick={handleTriggerScanner}
            className="flex items-center gap-1.5 rounded-lg bg-[#E10906] hover:bg-[#b90705] text-white px-3 py-1.5 text-xs font-bold shadow-md shadow-red-950/50 transition-all active:scale-95 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Laser Grade Scanner</span>
          </button>

          {/* Flip Memory Button */}
          <button
            onClick={() => setAllFlipped((p) => !p)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              allFlipped
                ? 'bg-red-900/60 text-white border-[#E10906] shadow-md shadow-red-950/50'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{allFlipped ? 'Show Front' : 'Flip Cards (3D)'}</span>
          </button>

          {/* Heap & Pointers Button */}
          <button
            onClick={() => setShowMemory((s) => !s)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              showMemory
                ? 'bg-[#2A0E0E] text-[#FF6B6B] border-[#E10906]/60 shadow-md'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Heap Pointers</span>
          </button>
        </div>

        {/* Reset Camera Button */}
        <button
          onClick={() => controlsRef.current?.reset()}
          className="flex items-center gap-1.5 rounded-lg bg-black/50 hover:bg-black/75 text-slate-300 border border-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-md transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Camera</span>
        </button>
      </div>

      {/* =========================================================================
          THREE.JS 3D CANVAS
          ========================================================================= */}
      <Canvas camera={{ position: [1.2, 3.4, 7.6], fov: 42 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[6, 9, 6]} intensity={1.4} castShadow />
        <directionalLight position={[-6, 6, -3]} intensity={0.6} color="#E10906" />
        <pointLight position={[-3.1, 2.5, 0]} intensity={1.5} color="#FF4D4D" distance={7} />
        <pointLight position={[1.4, 2, 2]} intensity={0.7} color="#38bdf8" distance={6} />

        <group position={[0, -0.6, 0]}>
          {/* Dark PyVerse Laser Grid Floor */}
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 14]} />
            <meshStandardMaterial color="#080202" roughness={0.7} />
          </mesh>
          <gridHelper args={[20, 30, '#E10906', '#2a0a0a']} position={[0, 0.005, 0]} />

          {/* 1. PyVerse Laser Evaluator Tower */}
          <HolographicEvaluatorTower isScanning={isScanning} />

          {/* 2. Stack Frame Podium */}
          <StackPedestal marks={marks} grade={grade} showMemory={showMemory} />

          {/* 3. Four Custom Student Objects: Saif, Aayan, Imran, Sumaira */}
          {STUDENTS.map((student, idx) => {
            const isSelected = selectedStudentIdx === idx;
            const isFlipped = allFlipped || individualFlips[idx];
            const gradeInfo = isSelected
              ? { grade, color: calcGrade(marks).color, status: calcGrade(marks).status }
              : calcGrade(student.baseMarks);

            return (
              <CyberStudentCard3D
                key={student.id}
                student={student}
                positionX={CARD_X_POSITIONS[idx]}
                isSelected={isSelected}
                isFlipped={isFlipped}
                gradeInfo={gradeInfo}
                onCardClick={() => {
                  setSelectedStudentIdx(idx);
                  setIndividualFlips((prev) => {
                    const copy = [...prev];
                    copy[idx] = !copy[idx];
                    return copy;
                  });
                  if (onSelectMarks) {
                    onSelectMarks(student.baseMarks);
                  }
                }}
              />
            );
          })}

          {/* 4. Crimson & Cyan Pointer Arcs */}
          {showMemory && (
            <group>
              <LaserPointerArc
                startX={-3.1}
                startY={0.45}
                startZ={1.95}
                endX={CARD_X_POSITIONS[0]}
                endY={1.35}
                endZ={0}
                color="#E10906"
                speed={0.4}
                offset={0}
              />
              <LaserPointerArc
                startX={-3.1}
                startY={0.45}
                startZ={1.95}
                endX={CARD_X_POSITIONS[1]}
                endY={1.35}
                endZ={0}
                color="#0284c7"
                speed={0.45}
                offset={0.25}
              />
              <LaserPointerArc
                startX={-3.1}
                startY={0.45}
                startZ={1.95}
                endX={CARD_X_POSITIONS[2]}
                endY={1.35}
                endZ={0}
                color="#9333ea"
                speed={0.35}
                offset={0.5}
              />
              <LaserPointerArc
                startX={-3.1}
                startY={0.45}
                startZ={1.95}
                endX={CARD_X_POSITIONS[3]}
                endY={1.35}
                endZ={0}
                color="#d946ef"
                speed={0.5}
                offset={0.75}
              />
            </group>
          )}
        </group>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={3.8}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          target={[1.2, 0.7, 0]}
        />
      </Canvas>

      {/* Bottom Status Strip */}
      <div className="absolute bottom-2.5 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-[11px] text-slate-300 border border-white/10 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#E10906] animate-pulse" />
          <span>🖱️ Drag to orbit · Scroll to zoom · Click any card to flip &amp; inspect __dict__</span>
        </div>
        <div>
          <span className="text-[#8A8585]">Selected Student: </span>
          <strong className="text-white">{STUDENTS[selectedStudentIdx].name}</strong> ({marks} marks ➔{' '}
          <span className="text-[#FF6B6B] font-bold">{grade}</span>)
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator3D;
