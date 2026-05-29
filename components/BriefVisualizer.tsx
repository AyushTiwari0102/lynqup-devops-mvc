
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

interface BriefVisualizerProps {
  talentCount: number;
}

const Constellation: React.FC<{ count: number }> = ({ count }) => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < Math.max(count, 3); i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ));
    }
    return p;
  }, [count]);

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.rotation.z = t * 0.05;
  });

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <group key={i} position={p}>
          <Float speed={2} rotationIntensity={2} floatIntensity={2}>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial 
                color={i < count ? "#0071e3" : "#1a1a1a"} 
                emissive={i < count ? "#0071e3" : "#000000"}
                emissiveIntensity={2}
              />
            </mesh>
          </Float>
          {points.map((p2, j) => {
            if (i === j) return null;
            const dist = p.distanceTo(p2);
            if (dist < 4) {
               return (
                 <Line 
                    key={`${i}-${j}`} 
                    points={[p, p2]} 
                    color="#0071e3" 
                    lineWidth={0.5} 
                    transparent 
                    opacity={0.15} 
                 />
               );
            }
            return null;
          })}
        </group>
      ))}
    </group>
  );
};

const BriefVisualizer: React.FC<BriefVisualizerProps> = ({ talentCount }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#0071e3" />
        <Constellation count={talentCount} />
      </Canvas>
    </div>
  );
};

export default BriefVisualizer;
