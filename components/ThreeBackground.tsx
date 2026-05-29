
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { mouse } = useThree();
  const count = 2000;

  const [positions, step] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      s[i] = Math.random();
    }
    return [pos, s];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = time * 0.02;
      
      // Interactive movement towards mouse
      pointsRef.current.position.x += (mouse.x * 2 - pointsRef.current.position.x) * 0.02;
      pointsRef.current.position.y += (mouse.y * 2 - pointsRef.current.position.y) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#0071e3"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const CyberNexus = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.z = t * 0.1;
    meshRef.current.rotation.x = t * 0.05;
  });

  return (
    <mesh ref={meshRef} scale={[12, 12, 12]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial wireframe color="#1a1a1a" transparent opacity={0.15} />
    </mesh>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <ParticleField />
        <CyberNexus />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
