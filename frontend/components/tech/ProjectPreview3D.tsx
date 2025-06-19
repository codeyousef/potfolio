import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Box, Sphere, Torus, Cone } from '@react-three/drei';
import * as THREE from 'three';

interface Project {
  type: string;
  [key: string]: any;
}

interface ProjectPreview3DProps {
  project: Project;
  isActive: boolean;
}

export default function ProjectPreview3D({ project, isActive }: ProjectPreview3DProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const getProjectVisualization = () => {
    switch (project.type) {
      case 'ai':
        return <AIVisualization />;
      case 'web':
        return <WebVisualization />;
      case 'mobile':
        return <MobileVisualization />;
      case 'data':
        return <DataVisualization />;
      default:
        return <DataVisualization />;
    }
  };

  return (
    <group ref={meshRef}>
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        {getProjectVisualization()}
      </Float>
      
      {/* Ambient particles */}
      <Sparkles
        count={50}
        scale={3}
        size={1}
        speed={0.5}
        opacity={0.3}
        color="#0EA5E9"
      />
    </group>
  );
}

// AI Visualization - Neural Network
function AIVisualization() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial
          color="#0EA5E9"
          emissive="#0EA5E9"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      {/* Orbital rings */}
      {[1, 1.5, 2].map((radius, i) => (
        <Torus
          key={i}
          args={[radius, 0.02, 16, 100]}
          rotation={[i * 0.5, i * 0.3, 0]}
        >
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </Torus>
      ))}
      
      {/* Neural nodes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const z = Math.sin(angle) * 1.5;
        
        return (
          <group key={i} position={[x, 0, z]}>
            <Sphere args={[0.1, 16, 16]}>
              <meshStandardMaterial
                color="#10B981"
                emissive="#10B981"
                emissiveIntensity={0.5}
              />
            </Sphere>
          </group>
        );
      })}
    </group>
  );
}

// Web Visualization - Browser Window
function WebVisualization() {
  return (
    <group>
      {/* Browser frame */}
      <Box args={[2, 1.5, 0.1]}>
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Screen */}
      <Box args={[1.8, 1.3, 0.05]} position={[0, -0.05, 0.06]}>
        <meshStandardMaterial
          color="#0EA5E9"
          emissive="#0EA5E9"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </Box>
      
      {/* Browser dots */}
      {[-0.7, -0.5, -0.3].map((x, i) => (
        <Sphere key={i} args={[0.03, 16, 16]} position={[x, 0.65, 0.06]}>
          <meshStandardMaterial
            color={['#FF5F56', '#FFBD2E', '#27C93F'][i]}
            emissive={['#FF5F56', '#FFBD2E', '#27C93F'][i]}
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}
    </group>
  );
}

// Mobile Visualization - Phone
function MobileVisualization() {
  return (
    <group>
      {/* Phone body */}
      <Box args={[1, 2, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
      
      {/* Screen */}
      <Box args={[0.9, 1.8, 0.05]} position={[0, 0, 0.06]}>
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
        />
      </Box>
      
      {/* Home indicator */}
      <Box args={[0.3, 0.05, 0.02]} position={[0, -0.8, 0.07]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.2}
        />
      </Box>
    </group>
  );
}

// Data Visualization - 3D Chart
function DataVisualization() {
  const barsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (barsRef.current) {
      barsRef.current.children.forEach((child, i) => {
        child.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.3;
      });
    }
  });

  return (
    <group ref={barsRef}>
      {/* Data bars */}
      {Array.from({ length: 5 }).map((_, i) => {
        const height = 0.5 + Math.random() * 1;
        const x = (i - 2) * 0.4;
        
        return (
          <Box
            key={i}
            args={[0.3, height, 0.3]}
            position={[x, 0, 0]}
          >
            <meshStandardMaterial
              color="#0EA5E9"
              emissive="#0EA5E9"
              emissiveIntensity={0.3}
              metalness={0.7}
              roughness={0.3}
            />
          </Box>
        );
      })}
      
      {/* Base */}
      <Box args={[2.5, 0.05, 0.5]} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color="#8B5CF6"
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
    </group>
  );
}