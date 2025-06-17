import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { useSpring, animated, config } from '@react-spring/three';
import { useGesture } from '@use-gesture/react';
import { useInView } from 'react-intersection-observer';
import { 
  Float, 
  MeshTransmissionMaterial, 
  shaderMaterial,
  Environment,
  Lightformer,
  Points,
  PointMaterial
} from '@react-three/drei';
import { useAethelframeStore } from '@store/useAethelframeStore';
import * as THREE from 'three';

// Advanced Portal Beam Shader with enhanced effects
const AdvancedPortalBeamMaterial = shaderMaterial(
  {
    time: 0,
    intensity: 1.0,
    coreColor: new THREE.Color('#f0f9ff'),
    outerColor: new THREE.Color('#38B2AC'),
    height: 400.0,
    noiseScale: 0.5,
    flowSpeed: 2.0,
    pulseFrequency: 1.5,
    chromaticAberration: 0.02,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vDistanceFromCenter;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vDistanceFromCenter = length(position.xz);
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - Creates intense portal beam with advanced effects
  `
    uniform float time;
    uniform float intensity;
    uniform vec3 coreColor;
    uniform vec3 outerColor;
    uniform float height;
    uniform float noiseScale;
    uniform float flowSpeed;
    uniform float pulseFrequency;
    uniform float chromaticAberration;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying float vDistanceFromCenter;
    varying vec3 vNormal;
    
    // Noise function for organic energy flow
    float noise(vec3 p) {
      return sin(p.x) * sin(p.y) * sin(p.z);
    }
    
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      float centerDistance = vDistanceFromCenter;
      float heightFactor = abs(vPosition.y) / (height * 0.5);
      
      // Enhanced core beam with noise
      float coreIntensity = 1.0 - smoothstep(0.0, 3.0, centerDistance);
      
      // Add organic noise for energy turbulence
      vec3 noisePos = vPosition * noiseScale + vec3(0.0, time * flowSpeed, 0.0);
      float energyNoise = fbm(noisePos) * 0.3 + 0.7;
      
      // Vertical energy flow with multiple frequencies
      float energyFlow1 = sin(vPosition.y * 0.02 + time * flowSpeed) * 0.5 + 0.5;
      float energyFlow2 = sin(vPosition.y * 0.05 - time * flowSpeed * 0.7) * 0.3 + 0.7;
      float combinedFlow = energyFlow1 * energyFlow2 * energyNoise;
      
      // Portal pulse with multiple harmonics
      float pulse1 = sin(time * pulseFrequency) * 0.3 + 0.7;
      float pulse2 = sin(time * pulseFrequency * 1.618) * 0.2 + 0.8; // Golden ratio
      float combinedPulse = pulse1 * pulse2;
      
      // Enhanced core intensity
      coreIntensity *= (1.0 - heightFactor * 0.2);
      coreIntensity *= combinedFlow * combinedPulse;
      
      // Chromatic aberration effect
      float r = coreIntensity;
      float g = coreIntensity * (1.0 + chromaticAberration);
      float b = coreIntensity * (1.0 + chromaticAberration * 2.0);
      
      // Color mixing with chromatic separation
      vec3 coreWithAberration = vec3(r, g, b) * coreColor;
      vec3 finalColor = mix(outerColor, coreWithAberration, coreIntensity);
      
      // Apply intensity and energy effects
      finalColor *= intensity * combinedFlow * combinedPulse;
      
      // Enhanced alpha with energy flow
      float alpha = coreIntensity * 0.95 * combinedFlow;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// Energy Ring Material with advanced pulse patterns
const AdvancedEnergyRingMaterial = shaderMaterial(
  {
    time: 0,
    pulseSpeed: 1.5,
    color: new THREE.Color('#38B2AC'),
    ringIndex: 0,
    waveAmplitude: 2.0,
    interferencePattern: true,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying float vRingDistance;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vRingDistance = length(position.xz);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader with interference patterns
  `
    uniform float time;
    uniform float pulseSpeed;
    uniform vec3 color;
    uniform float ringIndex;
    uniform float waveAmplitude;
    uniform bool interferencePattern;
    
    varying vec2 vUv;
    varying float vRingDistance;
    varying vec3 vPosition;
    
    void main() {
      // Multiple pulse waves with phase offset
      float pulseTime1 = time * pulseSpeed + ringIndex * 0.3;
      float pulseTime2 = time * pulseSpeed * 1.3 + ringIndex * 0.5;
      
      float pulse1 = mod(pulseTime1, 2.0) / 2.0;
      float pulse2 = mod(pulseTime2, 3.0) / 3.0;
      
      // Wave interference
      float wave1 = sin(pulse1 * 3.14159) * waveAmplitude;
      float wave2 = sin(pulse2 * 3.14159 * 0.7) * (waveAmplitude * 0.6);
      
      float combinedWave = interferencePattern ? 
        (wave1 + wave2) * 0.5 : 
        wave1;
      
      // Ring expansion with interference
      float ringIntensity = (1.0 - pulse1) * combinedWave;
      ringIntensity = max(0.0, ringIntensity);
      
      // Dynamic ring thickness based on pulse
      float ringThickness = 0.8 + sin(time * 2.0 + ringIndex) * 0.3;
      float ringEdge = smoothstep(ringThickness - 0.3, ringThickness, vRingDistance) * 
                       (1.0 - smoothstep(ringThickness, ringThickness + 0.3, vRingDistance));
      
      // Color intensity with harmonic variations
      vec3 finalColor = color * ringIntensity * 2.5;
      
      // Add spectral shifts
      finalColor.r *= 1.0 + sin(time + ringIndex) * 0.2;
      finalColor.g *= 1.0 + sin(time * 1.2 + ringIndex) * 0.15;
      finalColor.b *= 1.0 + sin(time * 0.8 + ringIndex) * 0.25;
      
      float alpha = ringEdge * ringIntensity * 0.9;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// Chromatic Beam Material with enhanced refraction
const AdvancedChromaticBeamMaterial = shaderMaterial(
  {
    time: 0,
    chromaticColor: new THREE.Color('#38B2AC'),
    refractionIntensity: 0.6,
    beamIndex: 0,
    dispersion: 0.1,
    turbulence: 0.5,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader with advanced chromatic effects
  `
    uniform float time;
    uniform vec3 chromaticColor;
    uniform float refractionIntensity;
    uniform float beamIndex;
    uniform float dispersion;
    uniform float turbulence;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      // Enhanced chromatic dispersion
      float angleOffset = beamIndex * 2.0944; // 120 degrees
      float refractionWave = sin(time * 0.8 + angleOffset) * refractionIntensity;
      
      // Turbulence for organic refraction
      float turbulenceWave = sin(vPosition.y * 0.01 + time * 1.2) * 
                           sin(vPosition.x * 0.015 + time * 0.9) * turbulence;
      
      float beamDistance = length(vPosition.xz);
      float beamIntensity = 1.0 - smoothstep(0.0, 4.0, beamDistance);
      
      // Chromatic separation
      float rIntensity = beamIntensity * (1.0 + dispersion);
      float gIntensity = beamIntensity;
      float bIntensity = beamIntensity * (1.0 - dispersion);
      
      // Vertical energy flow with color separation
      float energyFlow = sin(vPosition.y * 0.015 + time * 1.5 + beamIndex) * 0.4 + 0.6;
      energyFlow += turbulenceWave;
      
      // Apply chromatic effects
      vec3 finalColor;
      finalColor.r = chromaticColor.r * rIntensity * energyFlow * refractionIntensity;
      finalColor.g = chromaticColor.g * gIntensity * energyFlow * refractionIntensity;
      finalColor.b = chromaticColor.b * bIntensity * energyFlow * refractionIntensity;
      
      float alpha = beamIntensity * 0.7 * energyFlow;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

// Extend materials
extend({ 
  AdvancedPortalBeamMaterial, 
  AdvancedEnergyRingMaterial, 
  AdvancedChromaticBeamMaterial 
});

// TypeScript declarations
declare module '@react-three/fiber' {
  interface ThreeElements {
    advancedPortalBeamMaterial: any;
    advancedEnergyRingMaterial: any;
    advancedChromaticBeamMaterial: any;
  }
}

interface AdvancedAuroraPortalProps {
  intensity?: number;
  size?: number;
  count?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  interactive?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
}

const AdvancedAuroraPortal: React.FC<AdvancedAuroraPortalProps> = ({
  intensity = 1,
  size = 100,
  count = 15000,
  timeOfDay = 'afternoon',
  interactive = true,
  performanceMode = 'high',
}) => {
  const { activeCanvasId } = useAethelframeStore();
  const coreBeamRef = useRef<THREE.Mesh>(null);
  const energyRingsRef = useRef<THREE.Group>(null);
  const chromaticBeamsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Performance optimization based on mode
  const particleCount = useMemo(() => {
    switch(performanceMode) {
      case 'low': return Math.floor(count * 0.3);
      case 'medium': return Math.floor(count * 0.6);
      case 'high': return count;
      default: return count;
    }
  }, [count, performanceMode]);
  
  // Performance optimization - assume always in view for now
  const inView = true;
  
  // Spring animation for portal activation
  const [{ scale, rotation, glowIntensity }, api] = useSpring(() => ({
    scale: 1,
    rotation: 0,
    glowIntensity: intensity,
    config: config.gentle,
  }));
  
  // Enhanced portal state
  const portalState = useMemo(() => {
    const baseState = {
      coreBeam: '#f0f9ff',
      coreBeamIntense: '#ffffff',
      chromaticTeal: '#38B2AC',
      chromaticMaroon: '#9B2C2C', 
      chromaticNavy: '#2C5282',
      ringColors: ['#f0f9ff', '#38B2AC', '#2C5282', '#9B2C2C'],
    };
    
    const timeStates = {
      morning: { intensity: 0.8, pulseSpeed: 0.6, warmth: 0.9 },
      afternoon: { intensity: 1.0, pulseSpeed: 0.8, warmth: 1.0 },
      evening: { intensity: 0.7, pulseSpeed: 0.5, warmth: 1.1 },
      night: { intensity: 0.4, pulseSpeed: 0.3, warmth: 0.8 },
    };
    
    return { ...baseState, ...timeStates[timeOfDay] };
  }, [timeOfDay]);
  
  // Gesture controls for interactive portal
  const bind = useGesture({
    onHover: ({ hovering }) => {
      if (!interactive) return;
      api.start({
        scale: hovering ? 1.1 : 1,
        glowIntensity: hovering ? intensity * 1.3 : intensity,
      });
    },
    onWheel: ({ delta: [, dy] }) => {
      if (!interactive) return;
      const newIntensity = Math.max(0.3, Math.min(2.0, intensity + dy * 0.001));
      api.start({ glowIntensity: newIntensity });
    },
  });
  
  // Advanced particle system with physics
  const particleSystem = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    
    const colorOptions = [
      new THREE.Color(portalState.chromaticTeal),
      new THREE.Color(portalState.chromaticMaroon),
      new THREE.Color(portalState.chromaticNavy),
      new THREE.Color(portalState.coreBeam)
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Cylindrical distribution with varying density
      const radius = Math.pow(Math.random(), 1.5) * 30;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 400;
      
      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(theta) * radius;
      
      // Initial velocities for organic motion
      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = Math.random() * 2 + 1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
      
      // Varying particle scales
      scales[i] = Math.random() * 0.5 + 0.5;
      
      // Color assignment
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return { positions, colors, velocities, scales };
  }, [particleCount, portalState]);
  
  // Advanced animation system
  useFrame((state, delta) => {
    if (!inView && performanceMode !== 'high') return;
    
    const time = state.clock.getElapsedTime();
    
    // Animate core beam with enhanced effects
    if (coreBeamRef.current?.material && 'time' in coreBeamRef.current.material) {
      const material = coreBeamRef.current.material as any;
      material.time = time;
      material.intensity = portalState.intensity * glowIntensity.get();
      material.noiseScale = 0.5 + Math.sin(time * 0.3) * 0.2;
      material.flowSpeed = 2.0 + activeCanvasId === 'home' ? 0.5 : 0;
      material.chromaticAberration = 0.02 + Math.sin(time * 0.7) * 0.01;
    }
    
    // Animate energy rings with interference patterns
    if (energyRingsRef.current) {
      energyRingsRef.current.children.forEach((ring, i) => {
        if (ring.material && 'time' in ring.material) {
          const material = ring.material as any;
          material.time = time;
          material.ringIndex = i;
          material.pulseSpeed = portalState.pulseSpeed;
          material.waveAmplitude = 2.0 + Math.sin(time * 0.5 + i) * 0.5;
          material.interferencePattern = performanceMode === 'high';
        }
      });
    }
    
    // Animate chromatic beams with enhanced dispersion
    if (chromaticBeamsRef.current) {
      chromaticBeamsRef.current.children.forEach((beam, i) => {
        if (beam.material && 'time' in beam.material) {
          const material = beam.material as any;
          material.time = time;
          material.beamIndex = i;
          material.refractionIntensity = 0.6 + Math.sin(time * 0.5 + i) * 0.3;
          material.dispersion = 0.1 + Math.sin(time * 0.3) * 0.05;
          material.turbulence = 0.5 + Math.sin(time * 0.8) * 0.2;
        }
      });
    }
    
    // Advanced particle animation with physics
    if (particlesRef.current && performanceMode !== 'low') {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const { velocities } = particleSystem;
      
      for (let i = 0; i < positions.length; i += 3) {
        const i3 = i / 3;
        
        // Apply velocities
        positions[i] += velocities[i] * delta;
        positions[i + 1] += velocities[i + 1] * delta * 5;
        positions[i + 2] += velocities[i + 2] * delta;
        
        // Portal attraction
        const centerDistance = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
        if (centerDistance > 5) {
          velocities[i] += (-positions[i] / centerDistance) * delta * 0.1;
          velocities[i + 2] += (-positions[i + 2] / centerDistance) * delta * 0.1;
        }
        
        // Reset particles
        if (positions[i + 1] > 200) {
          positions[i + 1] = -200;
          positions[i] = (Math.random() - 0.5) * 60;
          positions[i + 2] = (Math.random() - 0.5) * 60;
        }
        
        // Add spiral motion
        const spiral = time * 0.3 + i3 * 0.001;
        const radius = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
        positions[i] += Math.cos(spiral) * radius * 0.001;
        positions[i + 2] += Math.sin(spiral) * radius * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <animated.group
      ref={groupRef}
      scale={scale}
      rotation-y={rotation}
      {...bind()}
    >
      
      {/* Enhanced Lighting Environment */}
      <Environment resolution={256}>
        <Lightformer
          position={[0, 5, 0]}
          scale={[10, 1, 10]}
          color={portalState.coreBeam}
          intensity={0.5}
        />
        <Lightformer
          position={[0, -5, 0]}
          scale={[10, 1, 10]}
          color={portalState.chromaticTeal}
          intensity={0.3}
        />
      </Environment>
      
      {/* Core Beam: Enhanced Portal Spine */}
      <mesh ref={coreBeamRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[3.5, 4.5, 400, 64, 1, true]} />
        <advancedPortalBeamMaterial
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Energy Rings: Advanced Pulse System */}
      <group ref={energyRingsRef}>
        {Array.from({ length: performanceMode === 'low' ? 8 : 15 }).map((_, i) => (
          <mesh key={i} position={[0, i * 25 - 175, 0]}>
            <torusGeometry args={[12 + i * 2, 0.8, 16, 64]} />
            <advancedEnergyRingMaterial
              transparent
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              color={new THREE.Color(portalState.ringColors[i % portalState.ringColors.length])}
            />
          </mesh>
        ))}
      </group>
      
      {/* Chromatic Split: Enhanced Light Refraction */}
      <group ref={chromaticBeamsRef}>
        {[portalState.chromaticTeal, portalState.chromaticMaroon, portalState.chromaticNavy].map((color, i) => {
          const angle = (i * Math.PI * 2) / 3;
          const offset = 15;
          
          return (
            <Float key={i} speed={1 + i * 0.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <mesh 
                position={[
                  Math.cos(angle) * offset, 
                  0, 
                  Math.sin(angle) * offset
                ]}
                rotation={[0, angle, Math.PI / 24]}
              >
                <cylinderGeometry args={[2.5, 3.5, 400, 32, 1, true]} />
                <advancedChromaticBeamMaterial
                  transparent
                  side={THREE.DoubleSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  chromaticColor={new THREE.Color(color)}
                />
              </mesh>
            </Float>
          );
        })}
      </group>
      
      {/* Advanced Particle Field */}
      <Points ref={particlesRef} positions={particleSystem.positions} colors={particleSystem.colors}>
        <PointMaterial 
          size={2} 
          vertexColors 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </animated.group>
  );
};

export default AdvancedAuroraPortal;