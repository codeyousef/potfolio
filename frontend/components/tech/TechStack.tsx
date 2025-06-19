import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface Tech {
  name: string;
  level: number;
  experience: string;
  projects: number | string;
}

interface TechStackProps {
  category: string;
  techs: Tech[];
  color: string;
  rotationSpeed: number;
}

export default function TechStack({ category, techs, color, rotationSpeed }: TechStackProps) {
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create dodecahedron geometry
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(2.5, 0), []);

  // Create particle system around the dodecahedron
  const particles = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    const colors = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 3 + Math.random() * 2;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Set color based on category
      const rgb = new THREE.Color(color);
      colors[i * 3] = rgb.r;
      colors[i * 3 + 1] = rgb.g;
      colors[i * 3 + 2] = rgb.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, [color]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001 * rotationSpeed;
      meshRef.current.rotation.y += 0.002 * rotationSpeed;
      
      // Pulse effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= 0.0005;
      particlesRef.current.rotation.x -= 0.0003;
    }
  });

  return (
    <group>
      {/* Main dodecahedron */}
      <group ref={meshRef}>
        {/* Wireframe */}
        <mesh geometry={geometry}>
          <meshBasicMaterial 
            color={color} 
            wireframe 
            transparent 
            opacity={0.3}
          />
        </mesh>
        
        {/* Solid with gradient */}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Inner glow */}
        <mesh geometry={geometry} scale={0.98}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Category text in center */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Orbitron-Bold.ttf"
        >
          {category.toUpperCase()}
        </Text>
      </group>
      
      {/* Particle system */}
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Energy field lines */}
      {[...Array(8)].map((_, i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
          <mesh>
            <torusGeometry args={[3.5, 0.01, 8, 100]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}