'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getPerformanceSettings } from '@/utils/performance';

export default function ContactBackground() {
  const pointsRef = useRef<THREE.Points>(null);
  const settings = getPerformanceSettings();
  
  // Generate random particles based on performance tier
  const particles = useMemo(() => {
    const count = settings.particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Color palette
    const color1 = new THREE.Color('#A47864'); // Mocha Mousse
    const color2 = new THREE.Color('#00D9FF'); // Electric Blue
    const color3 = new THREE.Color('#FFDD44'); // Canary Yellow
    
    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      // Color
      const mixRatio = Math.random();
      const selectedColor = mixRatio < 0.33 ? color1 : mixRatio < 0.66 ? color2 : color3;
      colors[i * 3] = selectedColor.r;
      colors[i * 3 + 1] = selectedColor.g;
      colors[i * 3 + 2] = selectedColor.b;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Rotate the entire particle system
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    
    // Animate individual particles
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < positions.length; i += 3) {
      // Wave animation
      positions[i + 1] += Math.sin(time + positions[i] * 0.5) * 0.002;
      
      // Reset particles that drift too far
      if (Math.abs(positions[i + 1]) > 5) {
        positions[i + 1] = -positions[i + 1] * 0.9;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {/* Ambient particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating geometric shapes */}
      <group>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 3 + Math.random() * 2;
          
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 3,
                Math.sin(angle) * radius
              ]}
            >
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? '#A47864' : i % 3 === 1 ? '#00D9FF' : '#FFDD44'}
                emissive={i % 3 === 0 ? '#A47864' : i % 3 === 1 ? '#00D9FF' : '#FFDD44'}
                emissiveIntensity={0.2}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}