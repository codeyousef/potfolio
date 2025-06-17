import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DimensionalTransitionProps {
  children: React.ReactNode;
  isTransitioning?: boolean;
  transitionType?: 'portal-in' | 'portal-out' | 'fragment' | 'lightning';
  onTransitionComplete?: () => void;
  portalPosition?: [number, number, number];
  fragmentCount?: number;
  duration?: number;
}

// 3D Portal Vortex Effect Component
const PortalVortex: React.FC<{
  isActive: boolean;
  type: 'in' | 'out';
  position: [number, number, number];
}> = ({ isActive, type, position }) => {
  const vortexRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (!isActive || !vortexRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Rotate the vortex
    vortexRef.current.rotation.z += delta * (type === 'in' ? 2 : -2);
    
    // Scale effect based on transition type
    const scaleMultiplier = type === 'in' ? 
      Math.min(2, 0.1 + time * 0.5) : 
      Math.max(0.1, 2 - time * 0.5);
    
    vortexRef.current.scale.setScalar(scaleMultiplier);

    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const i3 = i / 3;
        const angle = time * 0.5 + i3 * 0.01;
        const radius = 5 + Math.sin(time + i3) * 2;
        
        positions[i] = Math.cos(angle) * radius;
        positions[i + 1] = Math.sin(angle) * radius;
        positions[i + 2] = Math.sin(time * 0.3 + i3) * 3;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Generate swirling particles
  const generateVortexParticles = () => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const brandColors = [
      new THREE.Color('#38B2AC'), // Teal
      new THREE.Color('#2C5282'), // Navy
      new THREE.Color('#9B2C2C'), // Maroon
      new THREE.Color('#f0f9ff'), // White-blue
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 4;
      const radius = Math.random() * 10;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = brandColors[i % brandColors.length];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return { positions, colors };
  };

  const { positions, colors } = generateVortexParticles();

  if (!isActive) return null;

  return (
    <group ref={vortexRef} position={position}>
      {/* Vortex rings */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[0, 0, i * 2 - 8]}>
          <torusGeometry args={[8 - i * 0.5, 0.2, 8, 32]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#38B2AC' : '#2C5282'}
            transparent
            opacity={0.6 - i * 0.05}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      
      {/* Swirling particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

// Lightning Strike Effect
const LightningStrike: React.FC<{
  isActive: boolean;
  startPos: [number, number];
  endPos: [number, number];
}> = ({ isActive, startPos, endPos }) => {
  const [lightningPaths, setLightningPaths] = useState<string[]>([]);

  useEffect(() => {
    if (!isActive) return;

    // Generate random lightning path
    const generateLightning = () => {
      const paths = [];
      const segments = 10;
      
      for (let branch = 0; branch < 3; branch++) {
        let path = `M ${startPos[0]} ${startPos[1]}`;
        let currentX = startPos[0];
        let currentY = startPos[1];
        
        for (let i = 1; i <= segments; i++) {
          const progress = i / segments;
          const targetX = startPos[0] + (endPos[0] - startPos[0]) * progress;
          const targetY = startPos[1] + (endPos[1] - startPos[1]) * progress;
          
          // Add random jitter
          const jitterX = (Math.random() - 0.5) * 20 * (1 - progress);
          const jitterY = (Math.random() - 0.5) * 20 * (1 - progress);
          
          currentX = targetX + jitterX;
          currentY = targetY + jitterY;
          
          path += ` L ${currentX} ${currentY}`;
        }
        
        paths.push(path);
      }
      
      setLightningPaths(paths);
    };

    generateLightning();
    const interval = setInterval(generateLightning, 100);
    
    return () => clearInterval(interval);
  }, [isActive, startPos, endPos]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <filter id="lightningGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {lightningPaths.map((path, i) => (
          <motion.path
            key={i}
            d={path}
            stroke="#9B2C2C"
            strokeWidth={2 - i * 0.3}
            fill="none"
            filter="url(#lightningGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.2,
              delay: i * 0.05,
              repeat: 3,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Fragmentation Effect
const FragmentationEffect: React.FC<{
  isActive: boolean;
  fragmentCount: number;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ isActive, fragmentCount, containerRef }) => {
  const [fragments, setFragments] = useState<Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    velocityX: number;
    velocityY: number;
  }>>([]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Create fragments
    const newFragments = Array.from({ length: fragmentCount }, (_, i) => ({
      id: `fragment-${i}`,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      width: 20 + Math.random() * 40,
      height: 20 + Math.random() * 40,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 500,
      velocityY: (Math.random() - 0.5) * 500,
    }));
    
    setFragments(newFragments);
  }, [isActive, fragmentCount, containerRef]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {fragments.map(fragment => (
        <motion.div
          key={fragment.id}
          className="absolute bg-gradient-to-br from-teal-400/20 to-navy-600/20 backdrop-blur-sm border border-white/10"
          style={{
            width: fragment.width,
            height: fragment.height,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          }}
          initial={{
            x: fragment.x,
            y: fragment.y,
            rotate: fragment.rotation,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: fragment.x + fragment.velocityX,
            y: fragment.y + fragment.velocityY,
            rotate: fragment.rotation + 360,
            opacity: 0,
            scale: 0.1,
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

const DimensionalTransition: React.FC<DimensionalTransitionProps> = ({
  children,
  isTransitioning = false,
  transitionType = 'portal-in',
  onTransitionComplete,
  portalPosition = [0, 0, 0],
  fragmentCount = 20,
  duration = 1.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(!isTransitioning);
  const [effectStage, setEffectStage] = useState<'exit' | 'enter' | 'complete'>('exit');

  useEffect(() => {
    if (!isTransitioning) {
      setShowContent(true);
      setEffectStage('complete');
      return;
    }

    // Transition sequence
    setShowContent(false);
    setEffectStage('exit');

    const timer1 = setTimeout(() => {
      setEffectStage('enter');
    }, duration * 500);

    const timer2 = setTimeout(() => {
      setShowContent(true);
      setEffectStage('complete');
      onTransitionComplete?.();
    }, duration * 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isTransitioning, duration, onTransitionComplete]);

  const getTransitionVariants = () => {
    switch (transitionType) {
      case 'portal-out':
        return {
          initial: { opacity: 1, scale: 1 },
          exit: { 
            opacity: 0, 
            scale: 0.1,
            filter: 'blur(10px)',
            transition: { duration: duration * 0.5 }
          },
          enter: { 
            opacity: 1, 
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: duration * 0.5, delay: duration * 0.5 }
          },
        };
      
      case 'portal-in':
        return {
          initial: { opacity: 0, scale: 2, filter: 'blur(20px)' },
          enter: { 
            opacity: 1, 
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: duration }
          },
        };
      
      case 'fragment':
        return {
          initial: { opacity: 1 },
          exit: { 
            opacity: 0,
            transition: { duration: duration * 0.3 }
          },
          enter: { 
            opacity: 1,
            transition: { duration: duration * 0.7, delay: duration * 0.3 }
          },
        };
      
      default:
        return {
          initial: { opacity: 1 },
          exit: { opacity: 0 },
          enter: { opacity: 1 },
        };
    }
  };

  const variants = getTransitionVariants();

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            key="content"
            variants={variants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fragmentation effect */}
      <FragmentationEffect
        isActive={isTransitioning && transitionType === 'fragment' && effectStage === 'exit'}
        fragmentCount={fragmentCount}
        containerRef={containerRef}
      />

      {/* Lightning effect */}
      <LightningStrike
        isActive={isTransitioning && transitionType === 'lightning'}
        startPos={[portalPosition[0], portalPosition[1]]}
        endPos={[window.innerWidth / 2, window.innerHeight / 2]}
      />

      {/* Loading vortex */}
      {isTransitioning && (transitionType === 'portal-in' || transitionType === 'portal-out') && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <motion.div
            className="w-32 h-32 rounded-full border-2 border-teal-400/30"
            style={{
              background: 'radial-gradient(circle, rgba(56, 178, 172, 0.1) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DimensionalTransition;
export { PortalVortex };