'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere({ position, color, size }: { position: [number, number, number], color: string, size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} position={position} args={[size]} scale={[1, 1, 1]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.6} 
          wireframe={false}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (particlesRef.current) {
      const geometry = new THREE.BufferGeometry();
      const count = 300;
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesRef.current.geometry = geometry;
    }
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <pointsMaterial size={0.02} color="#8b5cf6" transparent opacity={0.6} />
    </points>
  );
}

export function ThreeDBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#8b5cf6" />
        
        <ParticleField />
        
        <AnimatedSphere position={[-4, 2, -2]} color="#8b5cf6" size={0.8} />
        <AnimatedSphere position={[4, -1, -3]} color="#3b82f6" size={1.2} />
        <AnimatedSphere position={[2, 3, -1]} color="#06b6d4" size={0.6} />
        <AnimatedSphere position={[-3, -2, -4]} color="#8b5cf6" size={1.0} />
        <AnimatedSphere position={[5, 1, -2]} color="#3b82f6" size={0.7} />
        <AnimatedSphere position={[-1, -3, -3]} color="#06b6d4" size={0.9} />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
