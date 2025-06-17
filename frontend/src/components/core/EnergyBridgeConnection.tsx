import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnergyBridgeConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  thickness?: number;
  particleCount?: number;
  particleSize?: number;
  particleSpeed?: number;
  dataFlow?: 'none' | 'forward' | 'backward' | 'bidirectional';
  intensity?: number;
}

// Three.js component for 3D energy bridges
const EnergyBridgeConnection: React.FC<EnergyBridgeConnectionProps> = ({
  start,
  end,
  color = '#38B2AC',
  thickness = 0.1,
  particleCount = 20,
  particleSize = 0.05,
  particleSpeed = 1,
  dataFlow = 'forward',
  intensity = 1,
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  
  // Convert hex color to THREE.Color
  const threeColor = new THREE.Color(color);
  
  // Create a curved path between start and end points
  const createCurvePath = () => {
    // Calculate a control point that's offset from the midpoint
    const midPoint = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 0.5, // Lift it up a bit
      (start[2] + end[2]) / 2,
    ];
    
    // Create a quadratic bezier curve
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(start[0], start[1], start[2]),
      new THREE.Vector3(midPoint[0], midPoint[1], midPoint[2]),
      new THREE.Vector3(end[0], end[1], end[2])
    );
    
    // Sample points along the curve
    const points = curve.getPoints(50);
    return { curve, points };
  };
  
  const { curve, points } = createCurvePath();
  
  // Generate particles along the curve
  const generateParticles = () => {
    const particles = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const offsets = new Float32Array(particleCount);
    
    // Generate particles with random positions along the curve
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random position along the curve (0-1)
      const t = Math.random();
      const pos = curve.getPoint(t);
      
      particles[i3] = pos.x;
      particles[i3 + 1] = pos.y;
      particles[i3 + 2] = pos.z;
      
      // Assign color (with slight variation)
      const colorVariation = 0.1;
      colors[i3] = threeColor.r * (1 - colorVariation + Math.random() * colorVariation * 2);
      colors[i3 + 1] = threeColor.g * (1 - colorVariation + Math.random() * colorVariation * 2);
      colors[i3 + 2] = threeColor.b * (1 - colorVariation + Math.random() * colorVariation * 2);
      
      // Random size variation
      sizes[i] = particleSize * (0.5 + Math.random() * 0.5);
      
      // Random speed variation
      speeds[i] = particleSpeed * (0.8 + Math.random() * 0.4);
      
      // Random offset for animation
      offsets[i] = Math.random();
    }
    
    return { positions: particles, colors, sizes, speeds, offsets };
  };
  
  const { positions, colors, sizes, speeds, offsets } = generateParticles();
  
  // Animation for particles flowing along the bridge
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const speedsArray = particlesRef.current.geometry.attributes.speed.array as Float32Array;
      const offsetsArray = particlesRef.current.geometry.attributes.offset.array as Float32Array;
      
      // Update each particle position
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const speed = speedsArray[i];
        const offset = offsetsArray[i];
        
        // Calculate progress along the curve (0-1)
        let t;
        
        switch (dataFlow) {
          case 'forward':
            t = ((time * speed * 0.2) + offset) % 1;
            break;
          case 'backward':
            t = (1 - ((time * speed * 0.2) + offset) % 1);
            break;
          case 'bidirectional':
            // Half particles go forward, half go backward
            t = i % 2 === 0 
              ? ((time * speed * 0.2) + offset) % 1
              : (1 - ((time * speed * 0.2) + offset) % 1);
            break;
          case 'none':
          default:
            // Particles stay in place but still pulse
            t = offset;
            break;
        }
        
        // Get position along the curve
        const pos = curve.getPoint(t);
        
        positions[i3] = pos.x;
        positions[i3 + 1] = pos.y;
        positions[i3 + 2] = pos.z;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Pulse the line when hovered
      if (lineRef.current) {
        const material = lineRef.current.material as THREE.LineBasicMaterial;
        const pulseIntensity = hovered 
          ? 0.8 + Math.sin(time * 5) * 0.2 
          : 0.4 + Math.sin(time * 2) * 0.1;
        
        material.opacity = pulseIntensity * intensity;
      }
    }
  });
  
  return (
    <group>
      {/* Main energy stream */}
      <line 
        ref={lineRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.4 * intensity}
          linewidth={thickness}
          linecap="round"
          linejoin="round"
        />
      </line>
      
      {/* Particles flowing along the bridge */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-speed"
            count={particleCount}
            array={speeds}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-offset"
            count={particleCount}
            array={offsets}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={particleSize}
          vertexColors
          transparent
          opacity={0.8 * intensity}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      
      {/* Glow effect */}
      <mesh>
        <tubeGeometry 
          args={[
            new THREE.CatmullRomCurve3(points),
            64,
            thickness * 2,
            8,
            false
          ]} 
        />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1 * intensity}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// DOM version for use outside Canvas (CSS-based)
export const EnergyBridgeConnectionDOM: React.FC<{
  startId: string;
  endId: string;
  color?: string;
  thickness?: number;
  particleCount?: number;
  dataFlow?: 'none' | 'forward' | 'backward' | 'bidirectional';
  intensity?: number;
  className?: string;
}> = ({
  startId,
  endId,
  color = '#38B2AC',
  thickness = 2,
  particleCount = 5,
  dataFlow = 'forward',
  intensity = 1,
  className = '',
}) => {
  const [startRect, setStartRect] = useState<DOMRect | null>(null);
  const [endRect, setEndRect] = useState<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Update element positions on resize and scroll
  useEffect(() => {
    const updatePositions = () => {
      const startElement = document.getElementById(startId);
      const endElement = document.getElementById(endId);
      
      if (startElement && endElement) {
        setStartRect(startElement.getBoundingClientRect());
        setEndRect(endElement.getBoundingClientRect());
      }
    };
    
    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);
    
    // Update positions periodically to handle dynamic layouts
    const interval = setInterval(updatePositions, 1000);
    
    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
      clearInterval(interval);
    };
  }, [startId, endId]);
  
  // If we don't have positions yet, don't render
  if (!startRect || !endRect) return null;
  
  // Calculate the center points of each element
  const startPoint = {
    x: startRect.left + startRect.width / 2,
    y: startRect.top + startRect.height / 2,
  };
  
  const endPoint = {
    x: endRect.left + endRect.width / 2,
    y: endRect.top + endRect.height / 2,
  };
  
  // Calculate the angle between the points
  const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
  
  // Calculate the distance between the points
  const distance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) + 
    Math.pow(endPoint.y - startPoint.y, 2)
  );
  
  // Generate particles
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    // Calculate a position along the line
    const progress = dataFlow === 'none' 
      ? i / particleCount 
      : ((Date.now() / 1000 * (dataFlow === 'backward' ? -1 : 1)) + i / particleCount) % 1;
    
    // For bidirectional, alternate directions
    const actualProgress = dataFlow === 'bidirectional' && i % 2 === 0 
      ? 1 - progress 
      : progress;
    
    const x = startPoint.x + (endPoint.x - startPoint.x) * actualProgress;
    const y = startPoint.y + (endPoint.y - startPoint.y) * actualProgress;
    
    return { x, y, id: i };
  });
  
  return (
    <>
      {/* Main energy stream */}
      <div 
        className={`energy-bridge ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 40,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          style={{
            position: 'absolute',
            top: startPoint.y,
            left: startPoint.x,
            width: distance,
            height: thickness,
            background: `linear-gradient(90deg, 
              rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.1 * intensity}) 0%, 
              rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.3 * intensity}) 50%,
              rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.1 * intensity}) 100%)`,
            transformOrigin: '0 50%',
            transform: `rotate(${angle}rad)`,
            opacity: isHovered ? 0.8 : 0.5,
            transition: 'opacity 0.3s ease',
            boxShadow: `0 0 ${thickness * 2}px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${0.3 * intensity})`,
            borderRadius: thickness / 2,
          }}
        />
        
        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              top: particle.y - thickness,
              left: particle.x - thickness,
              width: thickness * 2,
              height: thickness * 2,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 ${thickness * 2}px ${color}`,
              opacity: 0.8 * intensity,
              zIndex: 41,
              animation: `pulse-${dataFlow !== 'none' ? 'flow' : 'static'} 2s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes pulse-flow {
          0%, 100% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes pulse-static {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
};

export default EnergyBridgeConnection;