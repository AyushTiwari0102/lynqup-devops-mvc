
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface VisualizerProps {
  category: string;
}

const CategoryGeometry: React.FC<{ category: string }> = ({ category }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.rotation.x = t * 0.1;
    }
  });

  const materialProps = {
    color: "#0071e3",
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.4,
  };

  switch (category) {
    case 'Creators':
      return (
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshPhysicalMaterial {...materialProps} transmission={0.5} thickness={1} />
        </mesh>
      );
    case 'Production':
      return (
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial {...materialProps} wireframe />
        </mesh>
      );
    case 'Speakers':
      return (
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial {...materialProps} />
        </mesh>
      );
    case 'DJs':
      return (
        <group ref={meshRef as any}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.05, 16, 100]} />
            <meshStandardMaterial color="#0071e3" emissive="#0071e3" emissiveIntensity={2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]} scale={0.8}>
            <torusGeometry args={[1, 0.02, 16, 100]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
};

const ShelfVisualizer: React.FC<VisualizerProps> = ({ category }) => {
  return (
    <div className="absolute top-0 right-0 w-64 h-64 -z-10 opacity-40 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <CategoryGeometry category={category} />
      </Canvas>
    </div>
  );
};

export default ShelfVisualizer;
