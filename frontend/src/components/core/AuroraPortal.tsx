import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { useAethelframeStore } from '@store/useAethelframeStore';
import * as THREE from 'three';
import { Points, shaderMaterial, MeshTransmissionMaterial } from '@react-three/drei';

// Advanced Portal Beam Shader
const PortalBeamMaterial = shaderMaterial(
  {
    time: 0,
    intensity: 1.0,
    coreColor: new THREE.Color('#f0f9ff'),
    outerColor: new THREE.Color('#38B2AC'),
    height: 400.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vDistanceFromCenter;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vDistanceFromCenter = length(position.xz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - Creates intense white-blue column with energy flow
  `
    uniform float time;
    uniform float intensity;
    uniform vec3 coreColor;
    uniform vec3 outerColor;
    uniform float height;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vDistanceFromCenter;
    
    void main() {
      // Create cylindrical portal beam
      float centerDistance = vDistanceFromCenter;
      float heightFactor = abs(vPosition.y) / (height * 0.5);
      
      // Core beam intensity (intense white-blue center)
      float coreIntensity = 1.0 - smoothstep(0.0, 2.0, centerDistance);
      coreIntensity *= (1.0 - heightFactor * 0.3); // Slight fade at edges
      
      // Energy flow animation
      float energyFlow = sin(vPosition.y * 0.02 + time * 2.0) * 0.5 + 0.5;
      float pulseWave = sin(time * 1.5) * 0.3 + 0.7;
      
      // Color mixing: white-blue core to brand color outer
      vec3 finalColor = mix(outerColor, coreColor, coreIntensity);
      
      // Apply energy flow and pulse
      finalColor *= energyFlow * pulseWave * intensity;
      
      // Final alpha based on distance from center
      float alpha = coreIntensity * 0.95;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// Energy Ring Shader for pulsing outward rings
const EnergyRingMaterial = shaderMaterial(
  {
    time: 0,
    pulseSpeed: 1.5,
    color: new THREE.Color('#38B2AC'),
    ringIndex: 0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying float vRingDistance;
    
    void main() {
      vUv = uv;
      vRingDistance = length(position.xz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - Creates expanding pulse rings
  `
    uniform float time;
    uniform float pulseSpeed;
    uniform vec3 color;
    uniform float ringIndex;
    
    varying vec2 vUv;
    varying float vRingDistance;
    
    void main() {
      // Create pulsing ring effect
      float pulseTime = time * pulseSpeed + ringIndex * 0.3;
      float pulse = mod(pulseTime, 2.0) / 2.0; // 0 to 1 cycle
      
      // Ring expansion
      float ringIntensity = 1.0 - pulse;
      ringIntensity *= sin(pulse * 3.14159); // Smooth pulse shape
      
      // Ring thickness
      float ringThickness = 0.8;
      float ringEdge = smoothstep(ringThickness - 0.2, ringThickness, vRingDistance) * 
                       (1.0 - smoothstep(ringThickness, ringThickness + 0.2, vRingDistance));
      
      vec3 finalColor = color * ringIntensity * 2.0;
      float alpha = ringEdge * ringIntensity * 0.8;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// Chromatic Beam Shader for light refraction effect
const ChromaticBeamMaterial = shaderMaterial(
  {
    time: 0,
    chromaticColor: new THREE.Color('#38B2AC'),
    refractionIntensity: 0.6,
    beamIndex: 0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - Creates refracted light beams
  `
    uniform float time;
    uniform vec3 chromaticColor;
    uniform float refractionIntensity;
    uniform float beamIndex;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Chromatic refraction effect
      float refractionOffset = sin(time * 0.8 + beamIndex * 2.0944) * refractionIntensity; // 120 degrees
      
      // Distance from beam center with refraction
      float beamDistance = length(vPosition.xz);
      float beamIntensity = 1.0 - smoothstep(0.0, 3.0, beamDistance);
      
      // Vertical energy flow
      float energyFlow = sin(vPosition.y * 0.015 + time * 1.5 + beamIndex) * 0.4 + 0.6;
      
      vec3 finalColor = chromaticColor * beamIntensity * energyFlow * refractionIntensity;
      float alpha = beamIntensity * 0.6;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// Extend materials for use in JSX
extend({ PortalBeamMaterial, EnergyRingMaterial, ChromaticBeamMaterial });

// Declare module extensions for TypeScript
declare module '@react-three/fiber' {
  interface ThreeElements {
    portalBeamMaterial: any;
    energyRingMaterial: any;
    chromaticBeamMaterial: any;
  }
}

interface AuroraPortalProps {
  intensity?: number;
  size?: number;
  count?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

const AuroraPortal: React.FC<AuroraPortalProps> = ({
  intensity = 1,
  size = 100,
  count = 12000,
  timeOfDay = 'afternoon',
}) => {
  const { activeCanvasId } = useAethelframeStore();
  const coreBeamRef = useRef<THREE.Mesh>(null);
  const energyRingsRef = useRef<THREE.Group>(null);
  const chromaticBeamsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Portal state based on time and activity
  const portalState = useMemo(() => {
    const baseColors = {
      coreBeam: '#f0f9ff',
      coreBeamIntense: '#ffffff',
      chromaticTeal: '#38B2AC',
      chromaticMaroon: '#9B2C2C', 
      chromaticNavy: '#2C5282',
      ringColors: ['#f0f9ff', '#38B2AC', '#2C5282', '#9B2C2C'],
    };
    
    switch(timeOfDay) {
      case 'morning':
        return { ...baseColors, intensity: 0.8, pulseSpeed: 0.6 };
      case 'afternoon':
        return { ...baseColors, intensity: 1.0, pulseSpeed: 0.8 };
      case 'evening':
        return { ...baseColors, intensity: 0.7, pulseSpeed: 0.5 };
      case 'night':
        return { ...baseColors, intensity: 0.4, pulseSpeed: 0.3 };
      default:
        return { ...baseColors, intensity: 1.0, pulseSpeed: 0.8 };
    }
  }, [timeOfDay]);

  // Generate particle field for floating light motes
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorOptions = [
      new THREE.Color(portalState.chromaticTeal),
      new THREE.Color(portalState.chromaticMaroon),
      new THREE.Color(portalState.chromaticNavy),
      new THREE.Color(portalState.coreBeam)
    ];
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create cylindrical particle distribution around portal beam
      const radius = Math.pow(Math.random(), 0.7) * 25; // Bias toward center
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 400; // Full height
      
      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(theta) * radius;
      
      // Color particles
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [count, portalState]);

  // Portal animation system
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Animate core beam material
    if (coreBeamRef.current?.material && 'time' in coreBeamRef.current.material) {
      coreBeamRef.current.material.time = time;
      coreBeamRef.current.material.intensity = portalState.intensity;
    }
    
    // Animate energy rings
    if (energyRingsRef.current) {
      energyRingsRef.current.children.forEach((ring, i) => {
        if (ring.material && 'time' in ring.material) {
          ring.material.time = time;
          ring.material.ringIndex = i;
          ring.material.pulseSpeed = portalState.pulseSpeed;
        }
      });
    }
    
    // Animate chromatic beams
    if (chromaticBeamsRef.current) {
      chromaticBeamsRef.current.children.forEach((beam, i) => {
        if (beam.material && 'time' in beam.material) {
          beam.material.time = time;
          beam.material.beamIndex = i;
          beam.material.refractionIntensity = 0.6 + Math.sin(time * 0.5 + i) * 0.2;
        }
      });
    }
    
    // Animate particles - upward flow with spiral motion
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const i3 = i / 3;
        
        // Upward flow
        positions[i + 1] += delta * (5 + Math.random() * 3);
        
        // Reset particles that flow too high
        if (positions[i + 1] > 200) {
          positions[i + 1] = -200;
        }
        
        // Add spiral motion
        const spiral = time * 0.3 + i3 * 0.001;
        const radius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
        positions[i] = Math.cos(spiral) * radius;
        positions[i + 2] = Math.sin(spiral) * radius;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Core Beam: Intense white-blue column - The UI Spine */}
      <mesh ref={coreBeamRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[3.5, 4.5, 400, 32, 1, true]} />
        <portalBeamMaterial
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Energy Rings: Horizontal rings that pulse outward at regular intervals */}
      <group ref={energyRingsRef}>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh key={i} position={[0, i * 25 - 175, 0]}>
            <torusGeometry args={[12 + i * 2, 0.6, 8, 64]} />
            <energyRingMaterial
              transparent
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              color={new THREE.Color(portalState.ringColors[i % portalState.ringColors.length])}
            />
          </mesh>
        ))}
      </group>
      
      {/* Chromatic Split: Portal light refracts into teal/maroon/navy */}
      <group ref={chromaticBeamsRef}>
        {[portalState.chromaticTeal, portalState.chromaticMaroon, portalState.chromaticNavy].map((color, i) => {
          const angle = (i * Math.PI * 2) / 3;
          const offset = 15;
          
          return (
            <mesh 
              key={i}
              position={[
                Math.cos(angle) * offset, 
                0, 
                Math.sin(angle) * offset
              ]}
              rotation={[0, angle, Math.PI / 24]}
            >
              <cylinderGeometry args={[2.5, 3.5, 400, 16, 1, true]} />
              <chromaticBeamMaterial
                transparent
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                chromaticColor={new THREE.Color(color)}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Particle Field: Floating light motes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particlePositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={particlePositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={1.5} 
          vertexColors 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export default AuroraPortal;