import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

interface PlasmaWaterfallDemoProps {
  language?: 'en' | 'ar'
}

// Adaptive Quality Manager
class AdaptiveQualityManager {
  frameTimeBuffer: number[]
  qualityLevel: number
  particleCount: number
  shaderComplexity: string
  textureResolution: number
  enableFallback: boolean

  constructor() {
    this.frameTimeBuffer = new Array(3).fill(16.67)
    this.qualityLevel = this.detectDeviceCapabilities()
    this.particleCount = this.detectParticleCount()
    this.shaderComplexity = 'high'
    this.textureResolution = 512
    this.enableFallback = false
  }

  detectDeviceCapabilities(): number {
    const memory = (performance as any).memory?.jsHeapSizeLimit || 0
    const cores = navigator.hardwareConcurrency || 2
    
    if (memory > 4e9 && cores >= 8) return 3 // Ultra
    if (memory > 2e9 && cores >= 4) return 2 // High
    if (memory > 1e9) return 1 // Medium
    return 0 // Low
  }

  detectParticleCount(): number {
    switch(this.qualityLevel) {
      case 3: return 5000
      case 2: return 3000
      case 1: return 1500
      default: return 500
    }
  }

  update(deltaTime: number) {
    this.frameTimeBuffer.shift()
    this.frameTimeBuffer.push(deltaTime)
    const avgFrameTime = this.frameTimeBuffer.reduce((a,b) => a+b) / 3

    if (avgFrameTime > 20) { // Below 50fps
      this.reduceQuality()
    } else if (avgFrameTime < 14 && this.qualityLevel < 3) {
      this.increaseQuality()
    }
  }

  reduceQuality() {
    switch(this.qualityLevel) {
      case 3: // Ultra -> High
        this.particleCount *= 0.7
        this.shaderComplexity = 'high'
        break
      case 2: // High -> Medium
        this.particleCount *= 0.5
        this.shaderComplexity = 'medium'
        this.textureResolution /= 2
        break
      case 1: // Medium -> Low
        this.enableFallback = true
        break
    }
    this.qualityLevel = Math.max(0, this.qualityLevel - 1)
  }

  increaseQuality() {
    if (this.qualityLevel < 3) {
      this.qualityLevel += 1
      switch(this.qualityLevel) {
        case 1:
          this.enableFallback = false
          break
        case 2:
          this.particleCount *= 2
          this.textureResolution *= 2
          break
        case 3:
          this.particleCount /= 0.7
          this.shaderComplexity = 'ultra'
          break
      }
    }
  }
}

const PlasmaWaterfallDemo: React.FC<PlasmaWaterfallDemoProps> = ({ language = 'en' }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState(true)
  const [qualityLevel, setQualityLevel] = useState(2)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    qualityManager: AdaptiveQualityManager
    plasmaSystem: THREE.Points
    glassHero: THREE.Mesh
    animationId: number
  } | null>(null)

  // Ultra high-quality vertex shader with realistic fluid dynamics
  const plasmaVertexShader = `
    precision mediump float;
    
    uniform float time;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    // High-quality noise function
    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = dot(i, vec3(1.0, 57.0, 113.0));
        return mix(
            mix(mix(fract(sin(n) * 43758.5), fract(sin(n + 1.0) * 43758.5), f.x),
                mix(fract(sin(n + 57.0) * 43758.5), fract(sin(n + 58.0) * 43758.5), f.x), f.y),
            mix(mix(fract(sin(n + 113.0) * 43758.5), fract(sin(n + 114.0) * 43758.5), f.x),
                mix(fract(sin(n + 170.0) * 43758.5), fract(sin(n + 171.0) * 43758.5), f.x), f.y), f.z);
    }
    
    // Optimized Fractal Brownian Motion for realistic turbulence
    float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 3; i++) {
            value += amplitude * noise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        return value;
    }
    
    void main() {
        vec3 pos = position;
        vec3 norm = normal;
        
        // Calculate flow parameters
        float fallDistance = 1.0 - (pos.y + 2.0) / 4.0; // 0 at top, 1 at bottom
        float flowSpeed = 1.0 + fallDistance * 2.0; // Acceleration due to gravity
        
        // High-frequency surface ripples
        float rippleTime = time * 8.0;
        float ripples = fbm(vec3(pos.x * 15.0, pos.y * 10.0 + rippleTime, pos.z * 12.0)) * 0.02;
        
        // Medium frequency waves
        float waveTime = time * 4.0;
        float waves = fbm(vec3(pos.x * 6.0, pos.y * 4.0 + waveTime, pos.z * 5.0)) * 0.05;
        
        // Large scale flow distortion
        float flowTime = time * 2.0;
        float flowDistortion = fbm(vec3(pos.x * 2.0, pos.y * 1.5 + flowTime, pos.z * 2.0)) * 0.1;
        
        // Combine all displacement effects
        float totalDisplacement = (ripples + waves * 0.7 + flowDistortion * 0.5) * fallDistance;
        
        // Apply displacement primarily in X and Z directions for surface movement
        pos.x += totalDisplacement * sin(time * 3.0 + pos.y * 5.0);
        pos.z += totalDisplacement * cos(time * 2.5 + pos.y * 4.0) * 0.5;
        
        // Gravity-based Y displacement for natural fall
        pos.y += sin(time * 6.0 + pos.x * 8.0) * 0.01 * fallDistance;
        
        // Calculate surface normal for lighting
        vec3 tangent1 = normalize(vec3(1.0, 0.0, totalDisplacement * 0.5));
        vec3 tangent2 = normalize(vec3(0.0, 1.0, totalDisplacement * 0.3));
        norm = normalize(cross(tangent1, tangent2));
        
        vUv = uv;
        vec4 worldPosition = modelViewMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormal = normalize(normalMatrix * norm);
        vViewPosition = -worldPosition.xyz;
        
        gl_Position = projectionMatrix * worldPosition;
    }
  `

  // High-quality but simplified water fragment shader
  const plasmaFragmentShader = `
    precision mediump float;
    
    uniform float time;
    uniform vec2 resolution;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    // Simple noise function
    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Simple fractal noise
    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 3; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }
    
    // Continuous plasma flow pattern
    float plasmaFlow(vec2 uv, float t) {
        // Create continuous vertical flow
        vec2 flowUv = uv;
        flowUv.y += t * 0.4; // Constant downward flow
        
        // Generate plasma using the new.md specification
        float plasma_value = 0.0;
        plasma_value += sin(distance(flowUv * 0.4 + t, vec2(0.5, 0.9)) * 0.01);
        plasma_value += sin(distance(flowUv, vec2(0.2, 0.7)) * 0.01);
        plasma_value += sin(distance(flowUv * 0.3 + t, vec2(0.8, 0.2)) * 0.01);
        
        return sin(plasma_value);
    }
    
    // Continuous waterfall shape - unbroken stream
    float continuousWaterfallShape(vec2 uv) {
        float centerX = 0.5;
        
        // Create narrow, continuous beam like in screenshot
        float baseWidth = 0.08; // Much narrower for continuous beam
        float widthVariation = sin(uv.y * 6.0 + time * 3.0) * 0.02; // Subtle variation
        float width = baseWidth + widthVariation;
        
        // Sharp, defined edges for continuous beam
        float leftEdge = smoothstep(centerX - width - 0.02, centerX - width + 0.02, uv.x);
        float rightEdge = smoothstep(centerX + width + 0.02, centerX + width - 0.02, uv.x);
        
        // Full vertical coverage - no breaks
        float verticalMask = smoothstep(0.0, 0.05, uv.y) * smoothstep(1.0, 0.95, uv.y);
        
        return leftEdge * rightEdge * verticalMask;
    }
    
    // Plasma color using new.md specification
    vec3 plasmaColor(float plasma_value) {
        float r = 0.5 + 0.5 * sin(plasma_value + 0.0);
        float g = 0.5 + 0.5 * sin(plasma_value + 2.094);
        float b = 0.5 + 0.5 * sin(plasma_value + 4.188);
        return vec3(r, g, b);
    }
    
    void main() {
        vec2 uv = vUv;
        
        // Generate continuous plasma flow
        float plasma_value = plasmaFlow(uv, time);
        
        // Apply continuous waterfall shape
        float shape = continuousWaterfallShape(uv);
        
        // Create continuous beam intensity
        float beamIntensity = plasma_value * shape;
        beamIntensity = smoothstep(-0.5, 1.0, beamIntensity); // Keep more of the plasma visible
        
        // Generate plasma color
        vec3 color = plasmaColor(plasma_value);
        
        // Enhance brightness for visibility
        color *= (1.0 + beamIntensity * 2.0);
        
        // Add vertical flow bias for downward movement
        float flowBias = smoothstep(0.0, 1.0, 1.0 - uv.y);
        uv.y += time * 0.2; // Add flowing effect
        
        // Add glow effect for plasma beam
        float centerGlow = 1.0 - abs(uv.x - 0.5) * 8.0; // Horizontal glow
        centerGlow = max(0.0, centerGlow);
        color += color * centerGlow * 0.5;
        
        // Final alpha for continuous beam
        float alpha = shape * (0.7 + beamIntensity * 0.3);
        alpha = smoothstep(0.0, 1.0, alpha);
        
        gl_FragColor = vec4(color, alpha);
    }
  `


  const detectWebGL = (): boolean => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!gl
    } catch (e) {
      return false
    }
  }

  const initThreeJS = () => {
    if (!mountRef.current) return

    const qualityManager = new AdaptiveQualityManager()
    
    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000510)

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance",
      precision: "highp"
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    mountRef.current.appendChild(renderer.domElement)

    // Create glass hero container first (positioning reference)
    const glassGeometry = new THREE.BoxGeometry(3, 2, 1.5)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.1,
      transmission: 0.95,
      thickness: 0.5,
      ior: 1.5,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.1
    })

    const glassHero = new THREE.Mesh(glassGeometry, glassMaterial)
    glassHero.position.set(0, -1, 0) // Glass container center
    scene.add(glassHero)
    
    // Calculate glass dimensions for proper waterfall positioning
    const glassTop = glassHero.position.y + 1 // Top of glass container
    const glassLeft = glassHero.position.x - 1.5 // Left edge
    const glassRight = glassHero.position.x + 1.5 // Right edge
    
    // Create single continuous plasma waterfall system
    const plasmaLayers = []
    
    // Single continuous plasma beam - like in screenshot
    const continuousWaterfallGeometry = new THREE.PlaneGeometry(0.5, 8, 64, 512) // Narrow and tall for continuous beam
    const continuousWaterfallMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: plasmaVertexShader,
      fragmentShader: plasmaFragmentShader,
      blending: THREE.AdditiveBlending, // Use additive blending for bright plasma effect
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    
    const continuousWaterfall = new THREE.Mesh(continuousWaterfallGeometry, continuousWaterfallMaterial)
    continuousWaterfall.position.set(0, 2, 0) // Position to flow from top through glass
    plasmaLayers.push({ mesh: continuousWaterfall, material: continuousWaterfallMaterial })
    scene.add(continuousWaterfall)
    
    // Removed particle system - focus on smooth liquid waterfall effect

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x001122, 0.2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)
    
    // Add colored lights for plasma effect
    const plasmaLight1 = new THREE.PointLight(0x00aaff, 2, 10)
    plasmaLight1.position.set(0, 4, 2)
    scene.add(plasmaLight1)
    
    const plasmaLight2 = new THREE.PointLight(0xff0088, 1.5, 8)
    plasmaLight2.position.set(-2, 2, 1)
    scene.add(plasmaLight2)
    
    const plasmaLight3 = new THREE.PointLight(0x88ffff, 1, 6)
    plasmaLight3.position.set(2, 1, 1)
    scene.add(plasmaLight3)

    // Animation loop
    const clock = new THREE.Clock()
    let lastTime = 0

    const animate = () => {
      const currentTime = clock.getElapsedTime()
      const deltaTime = (currentTime - lastTime) * 1000
      lastTime = currentTime

      // Update quality manager
      qualityManager.update(deltaTime)
      setQualityLevel(qualityManager.qualityLevel)

      // Update all plasma layer uniforms
      plasmaLayers.forEach((layer, index) => {
        layer.material.uniforms.time.value = currentTime + index * 0.3
        // Subtle rotation for organic movement
        layer.mesh.rotation.y = Math.sin(currentTime * 0.2 + index) * 0.01
      })
      
      // Animate colored lights
      plasmaLight1.position.x = Math.sin(currentTime * 2) * 2
      plasmaLight1.intensity = 2 + Math.sin(currentTime * 3) * 0.5
      
      plasmaLight2.position.y = 2 + Math.cos(currentTime * 1.5) * 1
      plasmaLight2.intensity = 1.5 + Math.cos(currentTime * 4) * 0.3
      
      plasmaLight3.position.z = 1 + Math.sin(currentTime * 2.5) * 0.5
      plasmaLight3.intensity = 1 + Math.sin(currentTime * 5) * 0.2
      
      // Rotate glass hero slightly
      glassHero.rotation.y = Math.sin(currentTime * 0.5) * 0.1
      glassHero.rotation.x = Math.cos(currentTime * 0.3) * 0.05

      renderer.render(scene, camera)
      
      // Continue animation loop (don't disable WebGL unless there's an actual error)
      sceneRef.current!.animationId = requestAnimationFrame(animate)
    }

    sceneRef.current = {
      scene,
      camera,
      renderer,
      qualityManager,
      plasmaSystem: plasmaLayers[0]?.mesh || null,
      glassHero,
      animationId: requestAnimationFrame(animate)
    }

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return
      
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      
      sceneRef.current.camera.aspect = width / height
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  useEffect(() => {
    if (!detectWebGL()) {
      setWebglSupported(false)
      return
    }

    const cleanup = initThreeJS()

    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        sceneRef.current.renderer.dispose()
        if (mountRef.current && sceneRef.current.renderer.domElement) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement)
        }
      }
      cleanup?.()
    }
  }, [])

  // CSS Fallback Component
  const CSSFallback = () => (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #000510 0%, #001122 100%)'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '20%',
        width: '60%',
        height: '140%',
        background: 'linear-gradient(180deg, #0066ff 0%, #00ffff 30%, #ff00ff 60%, #0066ff 100%)',
        animation: 'plasma-flow 10s ease-in-out infinite',
        filter: 'blur(20px) contrast(1.5)',
        opacity: 0.7
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Plasma Waterfall Effect</h2>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Your device doesn't support WebGL. Showing CSS fallback animation.</p>
      </div>
      
      <style>{`
        @keyframes plasma-flow {
          0%, 100% { 
            transform: translateY(0) scale(1.1) rotate(0deg); 
            filter: blur(20px) contrast(1.5) hue-rotate(0deg);
          }
          25% { 
            transform: translateY(-10px) scale(1.15) rotate(2deg); 
            filter: blur(25px) contrast(1.7) hue-rotate(90deg);
          }
          50% { 
            transform: translateY(-20px) scale(1.2) rotate(0deg); 
            filter: blur(30px) contrast(2.0) hue-rotate(180deg);
          }
          75% { 
            transform: translateY(-10px) scale(1.15) rotate(-2deg); 
            filter: blur(25px) contrast(1.7) hue-rotate(270deg);
          }
        }
      `}</style>
    </div>
  )

  const qualityNames = ['Low', 'Medium', 'High', 'Ultra']

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {webglSupported ? (
        <>
          <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
          
          {/* Quality Indicator */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '10px',
            fontSize: '14px'
          }}>
            Quality: {qualityNames[qualityLevel] || 'Unknown'}
          </div>
          
          {/* Info Panel */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            maxWidth: '400px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
              Plasma Waterfall Effect
            </h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
              Real-time WebGL plasma simulation with glass material rendering. 
              Features adaptive quality management for 60fps on mobile devices.
            </p>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              Technologies: WebGL, Three.js, GLSL Shaders, Fresnel Reflectance
            </div>
          </div>
        </>
      ) : (
        <CSSFallback />
      )}
      
      {/* Exit Button */}
      <button
        onClick={() => window.location.href = window.location.pathname}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          background: 'rgba(255, 107, 107, 0.2)',
          border: '1px solid rgba(255, 107, 107, 0.5)',
          borderRadius: '20px',
          color: '#FFFFFF',
          fontSize: '14px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
      >
        ← Exit Demo
      </button>
    </div>
  )
}

export default PlasmaWaterfallDemo