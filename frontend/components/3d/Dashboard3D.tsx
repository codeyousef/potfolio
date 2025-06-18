'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Box } from '@react-three/drei';
import * as THREE from 'three';

interface DashboardCardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  emissive: string;
  delay?: number;
  children?: React.ReactNode;
}

function DashboardCard({ position, rotation = [0, 0, 0], color, emissive, delay = 0 }: DashboardCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.1;
    meshRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <RoundedBox args={[2, 1.5, 0.1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.2}
          metalness={0.2}
          roughness={0.8}
          transparent
          opacity={0.9}
        />
      </RoundedBox>
    </mesh>
  );
}

function ChartBar({ height, position, color }: { height: number; position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Pulsing animation
    const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 0.05;
    meshRef.current.scale.y = scale;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.15, height, 0.15]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

export default function Dashboard3D() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Slow rotation of entire dashboard
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Main Dashboard Panel */}
      <DashboardCard
        position={[0, 0, 0]}
        color="#242424"
        emissive="#00D9FF"
        delay={0}
      />
      
      {/* Analytics Card - Top Left */}
      <DashboardCard
        position={[-2.5, 1.2, 0.5]}
        rotation={[0, 0.3, 0]}
        color="#1A1A1A"
        emissive="#A47864"
        delay={1}
      />
      
      {/* Performance Card - Top Right */}
      <DashboardCard
        position={[2.5, 1, 0.3]}
        rotation={[0, -0.3, 0]}
        color="#1A1A1A"
        emissive="#FFDD44"
        delay={2}
      />
      
      {/* Code Stats Card - Bottom Left */}
      <DashboardCard
        position={[-2.2, -1.2, 0.4]}
        rotation={[0, 0.2, 0]}
        color="#1A1A1A"
        emissive="#00D9FF"
        delay={3}
      />
      
      {/* Chart Bars on Main Dashboard */}
      <group position={[0, -0.2, 0.1]}>
        <ChartBar height={0.8} position={[-0.6, 0, 0]} color="#00D9FF" />
        <ChartBar height={1.2} position={[-0.3, 0, 0]} color="#A47864" />
        <ChartBar height={0.9} position={[0, 0, 0]} color="#FFDD44" />
        <ChartBar height={1.4} position={[0.3, 0, 0]} color="#00D9FF" />
        <ChartBar height={1.0} position={[0.6, 0, 0]} color="#A47864" />
      </group>
      
      {/* Floating Data Points */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 3.5;
        const height = Math.random() * 2 - 1;
        
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#00D9FF' : i % 3 === 1 ? '#A47864' : '#FFDD44'}
              emissive={i % 3 === 0 ? '#00D9FF' : i % 3 === 1 ? '#A47864' : '#FFDD44'}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Connection Lines */}
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6}
            array={new Float32Array([
              -2.5, 1.2, 0.5,  // From analytics card
              0, 0, 0,         // To main dashboard
              2.5, 1, 0.3,     // From performance card
              0, 0, 0,         // To main dashboard
              -2.2, -1.2, 0.4, // From code stats
              0, 0, 0,         // To main dashboard
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00D9FF" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}