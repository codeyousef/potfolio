'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Sphere, Box, Torus, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Abstract 3D avatar representation
export default function Avatar3D() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;

    // Individual element animations
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      sphereRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * -0.2;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central sphere - represents core/head */}
      <Sphere ref={sphereRef} args={[0.8, 32, 32]} position={[0, 0.5, 0]}>
        <MeshDistortMaterial
          color="#A47864"
          roughness={0.1}
          metalness={0.8}
          distort={0.2}
          speed={2}
        />
      </Sphere>

      {/* Orbiting torus - represents creativity/energy */}
      <Torus ref={torusRef} args={[1.2, 0.2, 16, 32]} position={[0, 0.5, 0]}>
        <meshStandardMaterial
          color="#00D9FF"
          emissive="#00D9FF"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </Torus>

      {/* Floating cubes - represents skills/knowledge */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2;
        return (
          <Box
            key={i}
            args={[0.3, 0.3, 0.3]}
            position={[
              Math.cos(angle) * radius,
              0.5 + Math.sin(i) * 0.3,
              Math.sin(angle) * radius
            ]}
          >
            <MeshDistortMaterial
              color={i % 2 === 0 ? "#FFDD44" : "#C39B87"}
              roughness={0.2}
              metalness={0.6}
              distort={0.1}
              speed={3 + i}
            />
          </Box>
        );
      })}

      {/* Ground shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  );
}

// Alternative: Load a GLTF model if available
export function Avatar3DModel({ modelPath }: { modelPath?: string }) {
  const { scene } = useGLTF(modelPath || '/models/avatar.glb');
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!modelRef.current) return;
    
    modelRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={[2, 2, 2]}
      position={[0, -0.5, 0]}
    />
  );
}