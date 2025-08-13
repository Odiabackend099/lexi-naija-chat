import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Box, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  size: number;
  type: 'sphere' | 'box';
}

const FloatingShape = ({ position, color, size, type }: FloatingShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
      floatingRange={[-0.1, 0.1]}
    >
      <group position={position}>
        {type === 'sphere' ? (
          <Sphere ref={meshRef} args={[size]}>
            <MeshDistortMaterial
              color={color}
              transparent
              opacity={0.8}
              distort={0.3}
              speed={2}
            />
          </Sphere>
        ) : (
          <Box ref={meshRef} args={[size, size, size]}>
            <MeshDistortMaterial
              color={color}
              transparent
              opacity={0.6}
              distort={0.2}
              speed={1.5}
            />
          </Box>
        )}
      </group>
    </Float>
  );
};

export const FloatingElements3D = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        {/* Nigerian flag inspired floating elements */}
        <FloatingShape position={[-3, 2, 0]} color="#22c55e" size={0.5} type="sphere" />
        <FloatingShape position={[3, -1, -1]} color="#f97316" size={0.4} type="box" />
        <FloatingShape position={[-2, -2, 1]} color="#3b82f6" size={0.3} type="sphere" />
        <FloatingShape position={[2, 3, -2]} color="#eab308" size={0.35} type="box" />
        <FloatingShape position={[0, -3, 0]} color="#22c55e" size={0.25} type="sphere" />
        <FloatingShape position={[-4, 0, 2]} color="#f97316" size={0.45} type="box" />
      </Canvas>
    </div>
  );
};