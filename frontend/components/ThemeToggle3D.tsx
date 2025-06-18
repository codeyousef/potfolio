'use client';

import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThemeOrbProps {
  isDark: boolean;
  onClick: () => void;
}

function ThemeOrb({ isDark, onClick }: ThemeOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle rotation
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
    
    // Hover effect
    const scale = hovered ? 1.2 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

  const darkColors = {
    emissive: '#00D9FF',
    color: '#121212'
  };

  const lightColors = {
    emissive: '#FFDD44',
    color: '#FFFFFF'
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={colors.color}
        emissive={colors.emissive}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

interface ThemeToggle3DProps {
  isDark: boolean;
  onChange: (isDark: boolean) => void;
}

export default function ThemeToggle3D({ isDark, onChange }: ThemeToggle3DProps) {
  return (
    <div className="w-12 h-12 cursor-pointer">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <ThemeOrb isDark={isDark} onClick={() => onChange(!isDark)} />
      </Canvas>
    </div>
  );
}