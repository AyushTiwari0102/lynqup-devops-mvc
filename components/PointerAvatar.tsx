
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface LynqSwiftProps {
  isThinking: boolean;
}

const LynqSwift: React.FC<LynqSwiftProps> = ({ isThinking }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const leftWingRef = useRef<THREE.Mesh>(null!);
  const rightWingRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();
  const [blink, setBlink] = useState(false);

  const birdMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0.1,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    sheen: 1,
    sheenColor: "#0071e3",
    sheenRoughness: 0.5
  }), []);

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0071e3",
    emissive: "#0071e3",
    emissiveIntensity: 2
  }), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    groupRef.current.position.y = Math.sin(t * 2) * 0.1 + (isThinking ? Math.sin(t * 10) * 0.05 : 0);
    
    const targetRotX = -mouse.y * 0.5;
    const targetRotY = mouse.x * 0.8;
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.15);
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.15);

    const baseFlap = 2 + (Math.abs(mouse.x) + Math.abs(mouse.y)) * 5;
    const flapSpeed = isThinking ? 15 : baseFlap;
    const flapAngle = Math.sin(t * flapSpeed) * 0.4;
    
    if (leftWingRef.current && rightWingRef.current) {
      leftWingRef.current.rotation.z = 0.5 + flapAngle;
      rightWingRef.current.rotation.z = -0.5 - flapAngle;
    }

    if (Math.random() < 0.01 && !blink) {
      setBlink(true);
      setTimeout(() => setBlink(false), 100);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 6, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <primitive object={birdMaterial} attach="material" />
      </mesh>
      <mesh position={[0, -0.4, -0.6]} rotation={[Math.PI / 4, 0, 0]}>
        <coneGeometry args={[0.3, 0.8, 4]} />
        <primitive object={birdMaterial} attach="material" />
      </mesh>
      <mesh ref={leftWingRef} position={[-0.6, 0.2, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[1.2, 0.05, 0.5]} />
        <primitive object={birdMaterial} attach="material" />
      </mesh>
      <mesh ref={rightWingRef} position={[0.6, 0.2, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[1.2, 0.05, 0.5]} />
        <primitive object={birdMaterial} attach="material" />
      </mesh>
      <group ref={headRef} position={[0, 0.5, 0.4]}>
        <mesh>
          <sphereGeometry args={[0.45, 32, 32]} />
          <primitive object={birdMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.1, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.3, 4]} />
          <primitive object={accentMaterial} attach="material" />
        </mesh>
        <group position={[0, 0.1, 0.38]}>
          <mesh position={[-0.18, 0, 0]} scale={[1, blink ? 0.1 : 1, 1]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.18, 0, 0]} scale={[1, blink ? 0.1 : 1, 1]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      </group>
      <pointLight intensity={1} color="#0071e3" distance={3} />
    </group>
  );
};

interface PointerAvatarProps {
  onToggleChat: () => void;
  isChatOpen: boolean;
  isThinking: boolean;
}

const PointerAvatar: React.FC<PointerAvatarProps> = ({ onToggleChat, isChatOpen, isThinking }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-4 right-4 w-[180px] h-[180px] z-[250] cursor-pointer group"
      onClick={onToggleChat}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {hovered && !isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: -40 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="relative z-[300] bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl border border-gray-100 whitespace-nowrap"
            >
              Need help? Click me.
              {/* Tooltip arrow */}
              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-gray-100" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 30 }} gl={{ alpha: true }}>
        <ambientLight intensity={1} />
        <pointLight position={[5, 5, 5]} intensity={2} />
        <spotLight position={[0, 10, 0]} angle={0.15} penumbra={1} intensity={2} />
        <LynqSwift isThinking={isThinking} />
      </Canvas>
      
      {/* Glow Effect */}
      <div className={`absolute inset-10 rounded-full blur-[40px] transition-all duration-500 opacity-20 -z-10 ${isThinking ? 'bg-orange-500' : 'bg-blue-600'}`} />
    </div>
  );
};

export default PointerAvatar;
