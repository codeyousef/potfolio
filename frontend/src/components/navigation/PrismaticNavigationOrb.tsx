import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAethelframeStore } from '@store/useAethelframeStore';
import * as THREE from 'three';
import { Text, Icosahedron } from '@react-three/drei';

interface PrismaticNavigationOrbProps {
  size?: number;
  position?: [number, number, number];
  navItems?: Array<{ id: string; label: string; path: string }>;
}

const PrismaticNavigationOrb: React.FC<PrismaticNavigationOrbProps> = ({
  size = 5,
  position = [0, 10, 0],
  navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'portfolio', label: 'Projects', path: '/projects' },
    { id: 'services', label: 'Services', path: '/services' },
    { id: 'journal', label: 'Journal', path: '/journal' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ],
}) => {
  const { activeCanvasId, setActiveCanvas } = useAethelframeStore();
  const orbRef = useRef<THREE.Mesh>(null);
  const orbGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Handle hover state
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);
  
  // Animation for the orb
  useFrame((state, delta) => {
    if (orbRef.current) {
      // Slow rotation when not expanded
      if (!expanded) {
        orbRef.current.rotation.y += delta * 0.2;
        orbRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      }
      
      // Breathing effect
      const breathScale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03;
      orbRef.current.scale.set(breathScale, breathScale, breathScale);
    }
    
    // Animate the entire group
    if (orbGroupRef.current) {
      // Gentle floating motion
      orbGroupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5;
      
      // Expansion animation
      if (expanded) {
        orbGroupRef.current.rotation.y += delta * 0.1;
      }
    }
  });
  
  // Handle click to expand/collapse
  const handleOrbClick = () => {
    setExpanded(!expanded);
  };
  
  // Handle navigation item click
  const handleNavItemClick = (id: string) => {
    setActiveCanvas(id as any);
    setExpanded(false);
  };
  
  // Create smaller orbs for navigation
  const renderNavOrbs = () => {
    if (!expanded) return null;
    
    return navItems.map((item, index) => {
      const angle = (index / navItems.length) * Math.PI * 2;
      const radius = size * 3;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const isActive = activeCanvasId === item.id;
      const isHovered = hoveredItem === item.id;
      
      return (
        <group 
          key={item.id}
          position={[x, 0, z]}
          onClick={() => handleNavItemClick(item.id)}
          onPointerOver={() => { setHovered(true); setHoveredItem(item.id); }}
          onPointerOut={() => { setHovered(false); setHoveredItem(null); }}
        >
          {/* Smaller navigation orb */}
          <mesh>
            <sphereGeometry args={[size * 0.4, 32, 32]} />
            <meshPhysicalMaterial 
              color={isActive ? '#38B2AC' : isHovered ? '#f0f9ff' : '#2C5282'}
              transparent
              opacity={0.7}
              roughness={0.2}
              metalness={0.8}
              clearcoat={1}
              clearcoatRoughness={0.2}
              envMapIntensity={1.5}
            />
          </mesh>
          
          {/* Text label */}
          <Text
            position={[0, size * 0.7, 0]}
            fontSize={size * 0.3}
            color={isActive ? '#38B2AC' : isHovered ? '#f0f9ff' : '#94a3b8'}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {item.label}
          </Text>
          
          {/* Connection line to main orb */}
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, radius, 8]} />
            <meshBasicMaterial 
              color={isActive ? '#38B2AC' : '#1e293b'} 
              transparent 
              opacity={0.3} 
            />
          </mesh>
        </group>
      );
    });
  };
  
  return (
    <group ref={orbGroupRef} position={position}>
      {/* Main navigation orb */}
      <mesh 
        ref={orbRef}
        onClick={handleOrbClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Icosahedron args={[size, 2]}>
          <meshPhysicalMaterial 
            color="#f0f9ff"
            transparent
            opacity={0.8}
            roughness={0.1}
            metalness={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
            transmission={0.5}
            thickness={size * 0.5}
          />
        </Icosahedron>
      </mesh>
      
      {/* Inner light source */}
      <pointLight 
        color="#38B2AC" 
        intensity={expanded ? 2 : 1} 
        distance={size * 10}
        decay={2}
      />
      
      {/* Rainbow refraction effect */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Navigation orbs */}
      {renderNavOrbs()}
      
      {/* Hint text when not expanded */}
      {!expanded && (
        <Text
          position={[0, -size * 1.2, 0]}
          fontSize={size * 0.2}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Click to navigate
        </Text>
      )}
    </group>
  );
};

export default PrismaticNavigationOrb;