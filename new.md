# Creating a plasma-like liquid light waterfall effect for the web

Achieving a continuous plasma waterfall effect that flows into a glass hero section with realistic light interactions while maintaining 60fps on mobile devices requires careful orchestration of WebGL shaders, performance optimizations, and progressive enhancement strategies.

## Shader implementation for plasma effects

The foundation of this effect lies in combining **fluid dynamics simulation** with **glass material rendering**. For the plasma waterfall, there are three primary approaches: grid-based Eulerian methods using Navier-Stokes equations, particle-based Lagrangian methods using SPH (Smoothed Particle Hydrodynamics), or hybrid approaches like MLS-MPM that achieve 100,000+ particles in real-time.

The most practical implementation uses a combination of mathematical plasma functions with particle systems. Here's a core plasma shader:

```glsl
// Vertex shader for waterfall flow
attribute vec3 position;
attribute vec2 uv;
uniform float time;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    vec3 pos = position;
    // Add waterfall flow distortion
    pos.x += sin(pos.y * 10.0 + time * 5.0) * 0.02;
    pos.z += cos(pos.y * 8.0 + time * 3.0) * 0.01;
    
    vec4 worldPosition = modelViewMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * worldPosition;
}

// Fragment shader for plasma effect
precision mediump float;
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

float plasma(vec2 pos, float t) {
    float value = 0.0;
    value += sin(distance(pos * 0.4 + t, vec2(0.5, 0.9)) * 0.01);
    value += sin(distance(pos, vec2(0.2, 0.7)) * 0.01);
    value += sin(distance(pos * 0.3 + t, vec2(0.8, 0.2)) * 0.01);
    return sin(value);
}

vec3 plasmaColor(float plasma_value) {
    float r = 0.5 + 0.5 * sin(plasma_value + 0.0);
    float g = 0.5 + 0.5 * sin(plasma_value + 2.094);
    float b = 0.5 + 0.5 * sin(plasma_value + 4.188);
    return vec3(r, g, b);
}

void main() {
    vec2 uv = vUv;
    // Add vertical flow bias
    uv.y += time * 0.2;
    
    float plasmaValue = plasma(uv, time);
    vec3 color = plasmaColor(plasmaValue);
    
    // Add glow effect
    float glow = 1.0 / (1.0 + distance(uv, vec2(0.5, 0.5)) * 0.1);
    color *= glow;
    
    gl_FragColor = vec4(color, 1.0);
}
```

## Glass material with dynamic light interactions

For the glass hero section container, implementing realistic refraction, reflection, and caustics requires careful consideration of Fresnel equations and physically-based rendering principles. The key is using **Schlick's approximation** for Fresnel calculations combined with environment mapping:

```glsl
// Glass fragment shader with Fresnel
uniform samplerCube envMap;
uniform float ior; // Index of refraction (1.5 for glass)
varying vec3 vNormal;
varying vec3 vEyeVector;

float schlickFresnel(vec3 eyeVector, vec3 normal, float ior) {
    float R0 = pow((1.0 - ior) / (1.0 + ior), 2.0);
    float cosTheta = max(0.0, dot(-eyeVector, normal));
    return R0 + (1.0 - R0) * pow(1.0 - cosTheta, 5.0);
}

void main() {
    vec3 normal = normalize(vNormal);
    
    // Calculate Fresnel factor
    float fresnel = schlickFresnel(vEyeVector, normal, ior);
    
    // Reflection
    vec3 reflected = reflect(vEyeVector, normal);
    vec3 reflectedColor = textureCube(envMap, reflected).rgb;
    
    // Refraction
    vec3 refracted = refract(vEyeVector, normal, 1.0/ior);
    vec3 refractedColor = textureCube(envMap, refracted).rgb;
    
    // Combine with Fresnel
    vec3 finalColor = mix(refractedColor, reflectedColor, fresnel);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
```

For **real-time caustics**, the most efficient method is backward ray tracing from the floor surface:

```glsl
// Caustics calculation (Evan Wallace method)
vec3 oldPos = position;
vec3 newPos = position + refract(lightDir, normal, 1.0/1.33);

vec2 oldArea = vec2(dFdx(oldPos.xy), dFdy(oldPos.xy));
vec2 newArea = vec2(dFdx(newPos.xy), dFdy(newPos.xy));
float intensity = length(oldArea) / length(newArea);
intensity = clamp(intensity, 0.0, 1.0);
```

## Mobile-first performance optimization

Achieving 60fps on mobile devices requires a multi-faceted optimization approach. Research shows that **draw calls are the primary bottleneck** on mobile WebGL, with each state change causing significant CPU-GPU synchronization overhead.

### Critical optimization strategies

**1. Reduce draw calls to under 20 per frame**
- Use geometry instancing with `ANGLE_instanced_arrays` extension
- Batch multiple plasma elements into single VBOs
- Implement texture atlasing to minimize texture binding state changes

**2. Mobile-specific shader optimizations**
```glsl
// Use appropriate precision for mobile
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// Minimize texture lookups (keep under 21 calls)
// Move calculations to vertex shader when possible
```

**3. Adaptive quality system**
```javascript
class AdaptiveQualityManager {
    constructor() {
        this.frameTimeBuffer = new Array(3).fill(16.67);
        this.qualityLevel = this.detectDeviceCapabilities();
    }
    
    update(deltaTime) {
        this.frameTimeBuffer.shift();
        this.frameTimeBuffer.push(deltaTime);
        const avgFrameTime = this.frameTimeBuffer.reduce((a,b) => a+b) / 3;
        
        if (avgFrameTime > 20) { // Below 50fps
            this.reduceQuality();
        } else if (avgFrameTime < 14 && this.qualityLevel < 3) {
            this.increaseQuality();
        }
    }
    
    reduceQuality() {
        switch(this.qualityLevel) {
            case 3: // Ultra -> High
                this.particleCount *= 0.7;
                this.shaderComplexity = 'high';
                break;
            case 2: // High -> Medium
                this.particleCount *= 0.5;
                this.shaderComplexity = 'medium';
                this.textureResolution /= 2;
                break;
            case 1: // Medium -> Low
                this.enableFallback = true;
                break;
        }
        this.qualityLevel--;
    }
}
```

**4. Memory management**
- Implement per-pixel VRAM budget: `(max_VRAM / screen_pixels) = per_pixel_budget`
- Typical mobile budget: 1-2MB per screen
- Use compressed texture formats: `WEBGL_compressed_texture_etc` (Android) or `WEBGL_compressed_texture_pvrtc` (iOS)

### Performance benchmarks

Modern mobile devices (2020+) can handle:
- **1000-5000 particles** at 60fps with proper optimization
- **512x512 plasma textures** for optimal performance
- **10-15 texture lookups** maximum in fragment shaders

## Implementation with Three.js

Three.js provides excellent abstractions for this effect. Use `MeshPhysicalMaterial` for the glass container:

```javascript
const glassMaterial = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0.1,
    transmission: 0.95,
    thickness: 0.5,
    ior: 1.5,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.1
});

// For the plasma waterfall, combine particle system with custom shaders
const plasmaGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

plasmaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
plasmaGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

const plasmaMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() }
    },
    vertexShader: plasmaVertexShader,
    fragmentShader: plasmaFragmentShader,
    blending: THREE.AdditiveBlending,
    transparent: true
});
```

## Specialized libraries and production examples

**WebGL-Fluid-Simulation** by PavelDoGreat provides a battle-tested foundation for fluid dynamics, implementing GPU-accelerated Navier-Stokes equations with mobile compatibility. For enhanced features, **webgl-fluid-enhanced** offers easy integration with customizable color palettes and bloom effects.

Production examples like **Lumalabs.ai** demonstrate sophisticated fluid dynamics behind SVG masks, while **Toyota Crown's WebGL experience** showcases cross-platform compatibility. The **Make Me Pulse 2018 Wishes** site exemplifies advanced transmission effects with custom shaders.

## Hero section integration architecture

Implement a component-based architecture with progressive enhancement:

```javascript
class PlasmaWaterfallHero {
    constructor(container, options = {}) {
        this.container = container;
        this.options = { 
            particleCount: this.detectParticleCount(),
            quality: 'auto',
            fallbackMode: 'video',
            ...options 
        };
        this.initialize();
    }
    
    async initialize() {
        if (this.detectWebGL()) {
            const quality = this.detectQualityTier();
            if (quality >= 2) {
                await this.loadWebGLVersion();
            } else {
                this.loadSimplifiedWebGL();
            }
        } else {
            this.loadFallback();
        }
    }
    
    detectQualityTier() {
        const gpu = this.detectGPU();
        const memory = performance.memory?.jsHeapSizeLimit || 0;
        const cores = navigator.hardwareConcurrency || 2;
        
        if (gpu.tier >= 3 && memory > 4e9 && cores >= 8) return 3; // Ultra
        if (gpu.tier >= 2 && memory > 2e9 && cores >= 4) return 2; // High
        if (gpu.tier >= 1) return 1; // Medium
        return 0; // Low - use fallback
    }
}
```

## Fallback strategies

Implement a tiered fallback system:

**Tier 1 - CSS Animation Fallback**
```css
.plasma-fallback {
    background: linear-gradient(180deg, 
        #0066ff 0%, 
        #00ffff 50%, 
        #ff00ff 100%);
    animation: plasma-flow 10s ease-in-out infinite;
    filter: blur(20px) contrast(1.5);
}

@keyframes plasma-flow {
    0%, 100% { transform: translateY(0) scale(1.1); }
    50% { transform: translateY(-20px) scale(1.2); }
}
```

**Tier 2 - Video Fallback**
Pre-render the plasma effect as an MP4/WebM video loop with transparent background support for modern browsers.

**Tier 3 - SVG Animation**
Use SVG filters for intermediate quality:
```svg
<filter id="plasma">
    <feTurbulence baseFrequency="0.02" numOctaves="3" seed="5"/>
    <feColorMatrix values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 1 0"/>
</filter>
```

## Best practices for production

1. **Profile first**: Establish baseline metrics before optimization
2. **Implement intersection observers**: Pause animations when out of viewport
3. **Use WebGL2 when available**: Better performance with compute shaders
4. **Handle context loss gracefully**: Implement robust recovery mechanisms
5. **Monitor thermal throttling**: Reduce quality on device overheating
6. **Test across devices**: Maintain device lab with low-end to high-end phones

By following these implementation strategies and optimization techniques, you can create a stunning plasma waterfall effect that maintains 60fps across devices while gracefully degrading on lower-end hardware. The key is balancing visual fidelity with performance through adaptive quality systems and careful resource management.