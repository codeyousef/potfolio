'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  
  void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    
    vec3 pos = position;
    float wave = sin(time * 2.0 + position.y * 4.0) * 0.1;
    pos += normal * wave;
    
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  uniform vec2 mouse;
  uniform vec2 resolution;
  
  void main() {
    // Colors from the design system
    vec3 color1 = vec3(0.643, 0.471, 0.392); // Mocha Mousse (#A47864)
    vec3 color2 = vec3(0.0, 0.851, 1.0);     // Electric Blue (#00D9FF)
    vec3 color3 = vec3(1.0, 0.867, 0.267);   // Canary Yellow (#FFDD44)
    
    // Fresnel effect
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
    
    // Animated gradient
    float gradientFactor = sin(time * 0.5 + vPosition.y * 2.0) * 0.5 + 0.5;
    vec3 baseColor = mix(color1, color2, fresnel + gradientFactor * 0.3);
    
    // Add highlight accents
    float highlight = pow(fresnel, 3.0);
    baseColor = mix(baseColor, color3, highlight * 0.2);
    
    // Mouse interaction
    vec2 mouseNorm = (mouse - 0.5) * 2.0;
    float mouseInfluence = smoothstep(0.0, 1.0, 1.0 - length(mouseNorm - vUv * 2.0 + 1.0));
    baseColor = mix(baseColor, color2, mouseInfluence * 0.3);
    
    // Iridescent shimmer
    float shimmer = sin(time * 10.0 + vPosition.x * 20.0 + vPosition.y * 20.0) * 0.05 + 0.95;
    baseColor *= shimmer;
    
    // Reduce overall brightness to make it more subtle
    baseColor *= 0.15; // Further reduced from 0.3 to 0.15
    
    gl_FragColor = vec4(baseColor, 0.6); // Reduced opacity from 0.8 to 0.6
  }
`;

export default function FloatingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    // Floating animation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

    // Update shader uniforms
    materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    materialRef.current.uniforms.mouse.value.x = (mouse.x + 1) / 2;
    materialRef.current.uniforms.mouse.value.y = (mouse.y + 1) / 2;
  });

  return (
    <mesh ref={meshRef} scale={[1.2, 1.2, 1.2]} position={[4, 0, -3]}>
      <icosahedronGeometry args={[1, 4]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          mouse: { value: new THREE.Vector2(0.5, 0.5) },
          resolution: { value: new THREE.Vector2(viewport.width, viewport.height) }
        }}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}