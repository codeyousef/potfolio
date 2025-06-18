'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function BigHead() {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  const { viewport, mouse } = useThree();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Create uncanny valley skin material
  const skinMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePosition: { value: new THREE.Vector2() },
        distortion: { value: 0 },
        scrollProgress: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform float distortion;
        uniform float scrollProgress;
        
        void main() {
          vUv = uv;
          vNormal = normal;
          vPosition = position;
          
          vec3 pos = position;
          
          // Breathing effect
          pos *= 1.0 + sin(time * 0.5) * 0.02;
          
          // Glitch distortion on scroll
          if (distortion > 0.0) {
            pos.x += sin(pos.y * 10.0 + time * 20.0) * distortion * 0.1;
            pos.z += cos(pos.x * 10.0 + time * 20.0) * distortion * 0.1;
          }
          
          // Break apart on scroll
          if (scrollProgress > 0.5) {
            float breakAmount = (scrollProgress - 0.5) * 2.0;
            pos += normal * sin(position.y * 5.0) * breakAmount * 0.5;
          }
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform vec2 mousePosition;
        uniform float scrollProgress;
        
        void main() {
          // Uncanny valley skin color
          vec3 skinColor = vec3(0.95, 0.8, 0.75);
          
          // Subsurface scattering approximation
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 1.5);
          
          // Animated veins
          float veins = sin(vUv.x * 30.0 + time) * sin(vUv.y * 30.0 + time) * 0.05;
          
          vec3 color = skinColor + vec3(0.1, 0.0, 0.0) * veins;
          color += vec3(0.3, 0.1, 0.1) * fresnel;
          
          // Eye follow glow effect
          vec2 eyeDirection = normalize(mousePosition - vUv);
          float eyeGlow = smoothstep(0.98, 1.0, dot(eyeDirection, vNormal.xy));
          color += vec3(1.0, 0.0, 0.3) * eyeGlow * 2.0;
          
          // Glitch on scroll
          if (scrollProgress > 0.3) {
            float glitchAmount = sin(time * 50.0 + vPosition.y * 10.0);
            color = mix(color, vec3(1.0, 0.0, 1.0), glitchAmount * scrollProgress * 0.3);
          }
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
  }, []);
  
  // Eye material
  const eyeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#111111',
      emissive: '#FF006E',
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.8
    });
  }, []);

  useFrame((state) => {
    if (!headRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Update shader uniforms
    skinMaterial.uniforms.time.value = time;
    skinMaterial.uniforms.mousePosition.value.x = (mouse.x + 1) / 2;
    skinMaterial.uniforms.mousePosition.value.y = (mouse.y + 1) / 2;
    skinMaterial.uniforms.scrollProgress.value = scrollProgress;
    
    // Creepy delayed eye tracking
    const targetX = mouse.x * 0.3;
    const targetY = mouse.y * 0.3;
    
    if (leftEyeRef.current && rightEyeRef.current) {
      // Left eye follows with delay
      leftEyeRef.current.rotation.y = THREE.MathUtils.lerp(
        leftEyeRef.current.rotation.y,
        targetX,
        0.02
      );
      leftEyeRef.current.rotation.x = THREE.MathUtils.lerp(
        leftEyeRef.current.rotation.x,
        targetY,
        0.02
      );
      
      // Right eye follows with different delay (uncanny)
      rightEyeRef.current.rotation.y = THREE.MathUtils.lerp(
        rightEyeRef.current.rotation.y,
        targetX,
        0.015
      );
      rightEyeRef.current.rotation.x = THREE.MathUtils.lerp(
        rightEyeRef.current.rotation.x,
        targetY,
        0.015
      );
      
      // Random eye twitches
      if (Math.random() > 0.995) {
        leftEyeRef.current.rotation.x += (Math.random() - 0.5) * 0.2;
        rightEyeRef.current.rotation.y += (Math.random() - 0.5) * 0.2;
      }
    }
    
    // Mouth movement (syncs to "music" - actually just sine waves)
    if (mouthRef.current) {
      const mouthOpen = (Math.sin(time * 2) + 1) * 0.5;
      mouthRef.current.scale.y = 0.1 + mouthOpen * 0.3;
    }
    
    // Head subtle movement
    headRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
    
    // Glitch distortion
    if (scrollProgress > 0.3) {
      skinMaterial.uniforms.distortion.value = Math.random() * scrollProgress;
    } else {
      skinMaterial.uniforms.distortion.value *= 0.95;
    }
  });

  return (
    <group ref={headRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
      {/* Main head */}
      <mesh material={skinMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      
      {/* Left eye socket */}
      <mesh position={[-0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Left eye */}
      <mesh ref={leftEyeRef} position={[-0.3, 0.2, 0.9]} material={eyeMaterial}>
        <sphereGeometry args={[0.1, 32, 32]} />
      </mesh>
      
      {/* Right eye socket */}
      <mesh position={[0.3, 0.2, 0.8]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Right eye */}
      <mesh ref={rightEyeRef} position={[0.3, 0.2, 0.9]} material={eyeMaterial}>
        <sphereGeometry args={[0.1, 32, 32]} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color="#E6B8A8" roughness={0.7} />
      </mesh>
      
      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.3, 0.9]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-1.1, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <torusGeometry args={[0.2, 0.1, 8, 16]} />
        <meshStandardMaterial color="#E6B8A8" roughness={0.7} />
      </mesh>
      <mesh position={[1.1, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[0.2, 0.1, 8, 16]} />
        <meshStandardMaterial color="#E6B8A8" roughness={0.7} />
      </mesh>
    </group>
  );
}