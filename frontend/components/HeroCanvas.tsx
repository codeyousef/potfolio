'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows, Float, OrbitControls, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import FloatingMesh from '@/components/3d/FloatingMesh';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { getPerformanceSettings, AdaptiveQuality } from '@/utils/performance';

export default function HeroCanvas() {
  const [settings, setSettings] = useState(getPerformanceSettings());
  const [adaptiveQuality] = useState(() => new AdaptiveQuality((tier) => {
    setSettings(getPerformanceSettings());
  }));

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, settings.pixelRatio]}
        gl={{ 
          antialias: settings.antialias,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
        shadows={settings.shadows}
        camera={{ fov: 75, near: 0.1, far: 100 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {/* Adaptive quality components */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          
          {/* Camera */}
          <PerspectiveCamera 
            makeDefault 
            position={[0, 0, 8]} 
            fov={60}
          />
          
          {/* Controls - Limited to prevent breaking the composition */}
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            rotateSpeed={0.5}
          />
          
          {/* Lighting - Reduced for subtlety */}
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.3} 
            castShadow={settings.shadows}
            shadow-mapSize={[512, 512]}
          />
          <pointLight position={[-10, -10, -5]} intensity={0.2} color="#00D9FF" />
          <pointLight position={[10, -10, 5]} intensity={0.1} color="#A47864" />
          
          {/* Main 3D Object */}
          <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <FloatingMesh />
          </Float>
          
          {/* Environment */}
          <Environment preset="studio" background={false} />
          
          {/* Conditional Shadows based on performance */}
          {settings.shadows && (
            <ContactShadows 
              position={[0, -2, 0]} 
              opacity={0.3} 
              scale={10} 
              blur={2} 
              far={4} 
            />
          )}
          
          {/* Conditional Post-processing based on performance */}
          {settings.postprocessing && (
            <EffectComposer>
              <Bloom 
                intensity={0.5}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.9}
                blendFunction={BlendFunction.ADD}
                mipmapBlur
              />
              <ChromaticAberration
                offset={[0.002, 0.002]}
                blendFunction={BlendFunction.NORMAL}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}