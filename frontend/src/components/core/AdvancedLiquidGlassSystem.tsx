import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated, config } from 'react-spring';
import { useGesture } from '@use-gesture/react';
import { useInView } from 'react-intersection-observer';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AdvancedLiquidGlassProps {
  children: React.ReactNode;
  size?: [number, number];
  depth?: number;
  color?: string;
  portalProximity?: number;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  transmissionIntensity?: number;
  roughness?: number;
  ior?: number;
  chromaticAberration?: number;
  performanceMode?: 'high' | 'medium' | 'low';
}

// Advanced DOM Liquid Glass Component
export const AdvancedLiquidGlassDOM: React.FC<AdvancedLiquidGlassProps> = ({
  children,
  size = [300, 200],
  depth = 20,
  color = '#38B2AC',
  portalProximity = 0.5,
  interactive = true,
  className = '',
  style = {},
  transmissionIntensity = 0.95,
  roughness = 0.1,
  ior = 1.4,
  chromaticAberration = 0.8,
  performanceMode = 'high',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Performance optimization
  const { ref: intersectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);  
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  const rgbColor = hexToRgb(color);
  
  // Advanced asymmetric shape generation
  const generateComplexAsymmetricShape = () => {
    const points = [];
    const numPoints = 10 + Math.floor(Math.random() * 6); // 10-15 points for ultra-complex shapes
    const centerX = 50;
    const centerY = 50;
    
    // Create primary shape with golden ratio spiral influence
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const goldenAngle = angle * 1.618034; // Golden ratio
      
      // Multiple radius variations for organic complexity
      const baseRadius = 30;
      const spiralRadius = Math.sin(goldenAngle * 2) * 15;
      const noiseRadius = (Math.random() - 0.5) * 20;
      const pulseRadius = Math.sin(i * 0.7) * 10;
      
      const totalRadius = baseRadius + spiralRadius + noiseRadius + pulseRadius;
      const angleOffset = (Math.random() - 0.5) * 1.2; // Extreme asymmetry
      
      const x = centerX + Math.cos(angle + angleOffset) * totalRadius;
      const y = centerY + Math.sin(angle + angleOffset) * totalRadius;
      
      points.push(`${Math.max(2, Math.min(98, x))}% ${Math.max(2, Math.min(98, y))}%`);
    }
    
    return `polygon(${points.join(', ')})`;
  };
  
  const clipPath = useMemo(() => generateComplexAsymmetricShape(), []);
  
  // Advanced Spring Physics
  const [{ 
    scale, 
    rotation, 
    glowIntensity, 
    blur, 
    brightness, 
    hue,
    x,
    y 
  }, api] = useSpring(() => ({
    scale: 1,
    rotation: 0,
    glowIntensity: 1,
    blur: 3,
    brightness: 1.05,
    hue: 0,
    x: 0,
    y: 0,
    config: config.gentle,
  }));
  
  // Advanced Gesture System
  const bind = useGesture({
    onHover: ({ hovering }) => {
      if (!interactive) return;
      setIsHovered(hovering);
      api.start({
        scale: hovering ? 1.05 : 1,
        glowIntensity: hovering ? 1.4 : 1,
        blur: hovering ? 1 : 3,
        brightness: hovering ? 1.15 : 1.05,
        hue: hovering ? 5 : 0,
      });
    },
    onMove: ({ xy: [clientX, clientY] }) => {
      if (!containerRef.current || !interactive) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    },
    onDrag: ({ delta: [dx, dy], dragging }) => {
      if (!interactive) return;
      setIsDragging(dragging);
      
      if (dragging) {
        api.start({
          x: x.get() + dx,
          y: y.get() + dy,
          scale: 1.1,
          rotation: rotation.get() + dx * 0.1,
        });
      }
    },
    onPinch: ({ offset: [scale] }) => {
      if (!interactive) return;
      api.start({ scale: Math.max(0.5, Math.min(2, scale)) });
    },
    onWheel: ({ delta: [, dy] }) => {
      if (!interactive) return;
      const newGlow = Math.max(0.5, Math.min(3, glowIntensity.get() + dy * 0.001));
      api.start({ glowIntensity: newGlow });
    },
  });
  
  // Advanced Glass Effects Calculation
  const getAdvancedGlassStyles = (): React.CSSProperties => {
    const proximityIntensity = 0.2 + portalProximity * 0.8;
    const performanceMultiplier = performanceMode === 'high' ? 1 : performanceMode === 'medium' ? 0.7 : 0.4;
    
    return {
      width: size[0],
      height: size[1],
      position: 'relative',
      clipPath,
      transformStyle: 'preserve-3d',
      willChange: 'transform, filter',
      contain: 'layout style paint',
      ...style,
    };
  };
  
  // Floating animation with performance optimization
  useEffect(() => {
    if (!inView && performanceMode !== 'high') return;
    
    let animationFrame: number;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      // Liquid floating motion with multiple harmonics
      const float1 = Math.sin(elapsed * 0.7) * 8;
      const float2 = Math.sin(elapsed * 1.1) * 4;
      const float3 = Math.sin(elapsed * 0.4) * 12;
      
      const rotate1 = Math.sin(elapsed * 0.3) * 1;
      const rotate2 = Math.sin(elapsed * 0.8) * 0.5;
      
      if (!isDragging) {
        api.start({
          y: float1 + float2 + float3,
          rotation: rotate1 + rotate2,
          immediate: false,
        });
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [api, isDragging, inView, performanceMode]);
  
  return (
    <div ref={intersectionRef}>
      <animated.div
        ref={containerRef}
        className={`advanced-liquid-glass ${className}`}
        style={{
          ...getAdvancedGlassStyles(),
          transform: x.to(xVal => `translate3d(${xVal}px, ${y.get()}px, ${depth}px) scale(${scale.get()}) rotateZ(${rotation.get()}deg)`),
          filter: performanceMode !== 'low' ? 
            `blur(${blur.get()}px) brightness(${brightness.get()}) contrast(1.05) saturate(1.1) hue-rotate(${hue.get()}deg)` :
            'brightness(1.05)',
        }}
        {...bind()}
      >
        {/* Outer Shell: Enhanced 5% opacity with advanced chromatic aberration */}
        <animated.div 
          className="absolute inset-0 z-10"
          style={{
            background: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.05)`,
            backdropFilter: performanceMode === 'high' ? 
              `blur(${blur.get()}px) brightness(${brightness.get()}) contrast(1.08) saturate(1.15)` :
              'blur(2px) brightness(1.05)',
            WebkitBackdropFilter: performanceMode === 'high' ? 
              `blur(${blur.get()}px) brightness(${brightness.get()}) contrast(1.08) saturate(1.15)` :
              'blur(2px) brightness(1.05)',
            border: `2px solid rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: `
              inset 0 0 60px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1),
              inset 0 0 120px rgba(255, 255, 255, 0.03),
              0 0 ${60 + portalProximity * 40}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.2 + portalProximity * 0.3}),
              0 30px 60px rgba(0, 0, 0, 0.1)
            `,
          }}
        >
          {/* Advanced Chromatic Aberration */}
          {performanceMode !== 'low' && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                    rgba(255, 0, 0, 0.04) 0%, transparent 70%),
                  radial-gradient(circle at ${(mousePosition.x + 15) % 100}% ${(mousePosition.y + 15) % 100}%, 
                    rgba(0, 255, 255, 0.04) 0%, transparent 70%),
                  radial-gradient(circle at ${(mousePosition.x - 15) % 100}% ${(mousePosition.y - 15) % 100}%, 
                    rgba(0, 255, 0, 0.03) 0%, transparent 70%),
                  radial-gradient(circle at ${mousePosition.x * 0.8}% ${mousePosition.y * 0.8}%, 
                    rgba(255, 255, 0, 0.02) 0%, transparent 80%)
                `,
                mixBlendMode: 'overlay',
                opacity: isHovered ? 1 : 0.6,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}
          
          {/* Enhanced Beveled Edges */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 35%),
                linear-gradient(225deg, rgba(255, 255, 255, 0.2) 0%, transparent 30%),
                linear-gradient(315deg, rgba(255, 255, 255, 0.15) 0%, transparent 25%),
                linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 20%)
              `,
              borderRadius: '16px',
              opacity: 0.8,
            }}
          />
          
          {/* Prismatic Light Refraction */}
          {performanceMode === 'high' && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  conic-gradient(from ${mousePosition.x}deg at ${mousePosition.x}% ${mousePosition.y}%, 
                    rgba(255, 0, 0, 0.02) 0deg,
                    rgba(255, 255, 0, 0.02) 60deg,
                    rgba(0, 255, 0, 0.02) 120deg,
                    rgba(0, 255, 255, 0.02) 180deg,
                    rgba(0, 0, 255, 0.02) 240deg,
                    rgba(255, 0, 255, 0.02) 300deg,
                    rgba(255, 0, 0, 0.02) 360deg)
                `,
                mixBlendMode: 'overlay',
                opacity: 0.4,
                borderRadius: '16px',
              }}
            />
          )}
        </animated.div>
        
        {/* Inner Core: Advanced Dynamic Gradient */}
        <animated.div 
          className="absolute inset-4 z-15"
          style={{
            background: `
              radial-gradient(ellipse at ${mousePosition.x * 0.9}% ${mousePosition.y * 0.9}%, 
                rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.18 + portalProximity * 0.1}) 0%,
                rgba(240, 249, 255, ${0.12 + portalProximity * 0.05}) 20%,
                rgba(56, 178, 172, ${0.1 + portalProximity * 0.05}) 40%,
                rgba(44, 82, 130, ${0.08 + portalProximity * 0.03}) 60%,
                rgba(155, 44, 44, ${0.06 + portalProximity * 0.02}) 80%,
                transparent 100%)
            `,
            borderRadius: '12px',
            mixBlendMode: 'overlay',
            opacity: glowIntensity.to(val => 0.6 + val * 0.4),
            filter: `blur(${performanceMode === 'high' ? 1 : 2}px)`,
          }}
        />
        
        {/* Edge Lighting: Enhanced Rim Light System */}
        <animated.div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            borderRadius: '16px',
            background: `
              linear-gradient(90deg, 
                rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.15 + portalProximity * 0.25}) 0%,
                transparent 50%,
                rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.15 + portalProximity * 0.25}) 100%),
              linear-gradient(0deg, 
                rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.15 + portalProximity * 0.25}) 0%,
                transparent 50%,
                rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.15 + portalProximity * 0.25}) 100%)
            `,
            boxShadow: `
              inset 0 0 0 2px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.5 + portalProximity * 0.4}),
              inset 0 0 30px rgba(255, 255, 255, ${0.15 + portalProximity * 0.25}),
              0 0 ${30 + portalProximity * 60}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${0.4 + portalProximity * 0.6})
            `,
            opacity: glowIntensity.to(val => val),
          }}
        />
        
        {/* Interactive Light Response */}
        {isHovered && performanceMode !== 'low' && (
          <motion.div
            className="absolute z-25 rounded-full pointer-events-none"
            style={{
              top: `${mousePosition.y}%`,
              left: `${mousePosition.x}%`,
              width: '120px',
              height: '120px',
              background: `radial-gradient(circle, 
                rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.5) 0%, 
                rgba(255, 255, 255, 0.3) 25%, 
                rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2) 50%,
                transparent 75%)`,
              transform: 'translate(-50%, -50%)',
              mixBlendMode: 'overlay',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
        
        {/* Liquid Distortion Effect */}
        {performanceMode === 'high' && (
          <div 
            className="absolute inset-0 z-5 pointer-events-none"
            style={{
              background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='liquid-distort'%3E%3CfeTurbulence baseFrequency='0.03' numOctaves='4' result='turbulence'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='turbulence' scale='1.5'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23liquid-distort)' opacity='0.05' fill='white'/%3E%3C/svg%3E")`,
              opacity: 0.3,
              mixBlendMode: 'overlay',
              borderRadius: '16px',
            }}
          />
        )}
        
        {/* Content Container */}
        <div className="relative z-30 h-full p-8">
          <div 
            style={{
              color: '#ffffff',
              textShadow: `
                0 0 20px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.9),
                0 0 40px rgba(255, 255, 255, 0.4),
                0 2px 4px rgba(0, 0, 0, 0.6)
              `,
            }}
          >
            {children}
          </div>
        </div>
      </animated.div>
    </div>
  );
};

// Advanced 3D Liquid Glass Component
interface AdvancedLiquidGlass3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number, number];
  color?: string;
  portalProximity?: number;
  interactive?: boolean;
  transmissionIntensity?: number;
  roughness?: number;
  ior?: number;
  chromaticAberration?: number;
}

export const AdvancedLiquidGlass3D: React.FC<AdvancedLiquidGlass3DProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [3, 2, 0.3],
  color = '#38B2AC',
  portalProximity = 0.5,
  interactive = true,
  transmissionIntensity = 0.98,
  roughness = 0.1,
  ior = 1.4,
  chromaticAberration = 0.8,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Advanced asymmetric geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const numPoints = 12 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const goldenAngle = angle * 1.618034;
      
      const baseRadius = size[0] * 0.35;
      const spiralRadius = Math.sin(goldenAngle * 2) * (size[0] * 0.15);
      const noiseRadius = (Math.random() - 0.5) * (size[0] * 0.2);
      const harmonic = Math.sin(i * 0.8) * (size[0] * 0.1);
      
      const totalRadius = baseRadius + spiralRadius + noiseRadius + harmonic;
      const angleOffset = (Math.random() - 0.5) * 0.4;
      
      const x = Math.cos(angle + angleOffset) * totalRadius;
      const y = Math.sin(angle + angleOffset) * totalRadius;
      
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    
    shape.closePath();
    
    const extrudeSettings = {
      depth: size[2],
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.08,
      bevelSegments: 12,
      curveSegments: 24,
    };
    
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.computeVertexNormals();
    
    // Only compute tangents if the geometry has UV coordinates
    if (geo.attributes.uv) {
      geo.computeTangents();
    }
    
    return geo;
  }, [size]);
  
  // Advanced animation with multiple harmonics
  useFrame((state, delta) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Complex floating motion
      const float1 = Math.sin(time * 0.7) * 0.3;
      const float2 = Math.sin(time * 1.1) * 0.15;
      const float3 = Math.sin(time * 0.4) * 0.4;
      
      meshRef.current.position.y = position[1] + float1 + float2 + float3;
      
      // Multi-axis rotation
      meshRef.current.rotation.x = rotation[0] + Math.sin(time * 0.5) * 0.08;
      meshRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * 0.05;
      meshRef.current.rotation.z = rotation[2] + Math.sin(time * 0.8) * 0.03;
      
      // Scale animation on hover
      const targetScale = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
      
      // Portal proximity effects
      const proximityScale = 1 + portalProximity * 0.1;
      meshRef.current.scale.multiplyScalar(proximityScale);
    }
  });
  
  return (
    <Float 
      speed={1.5 + portalProximity} 
      rotationIntensity={0.3 + portalProximity * 0.5} 
      floatIntensity={0.4 + portalProximity * 0.6}
    >
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        geometry={geometry}
        onPointerOver={() => interactive && setHovered(true)}
        onPointerOut={() => interactive && setHovered(false)}
      >
        <MeshTransmissionMaterial
          backside
          backsideThickness={3 + portalProximity * 2}
          thickness={0.8 + portalProximity * 0.4}
          roughness={roughness}
          transmission={transmissionIntensity}
          ior={ior}
          chromaticAberration={chromaticAberration + portalProximity * 0.3}
          anisotropy={1.5}
          distortion={0.4 + portalProximity * 0.3}
          distortionScale={0.3}
          temporalDistortion={0.15 + portalProximity * 0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color={color}
          attenuationDistance={8}
          attenuationColor={color}
          emissive={color}
          emissiveIntensity={portalProximity * 0.2}
        />
      </mesh>
    </Float>
  );
};

export default AdvancedLiquidGlassDOM;