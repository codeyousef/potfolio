// Performance optimization utilities for 3D content

interface PerformanceConfig {
  high: {
    shadows: boolean;
    antialias: boolean;
    pixelRatio: number;
    postprocessing: boolean;
    particleCount: number;
    geometryDetail: number;
  };
  medium: {
    shadows: boolean;
    antialias: boolean;
    pixelRatio: number;
    postprocessing: boolean;
    particleCount: number;
    geometryDetail: number;
  };
  low: {
    shadows: boolean;
    antialias: boolean;
    pixelRatio: number;
    postprocessing: boolean;
    particleCount: number;
    geometryDetail: number;
  };
}

export const performanceConfig: PerformanceConfig = {
  high: {
    shadows: true,
    antialias: true,
    pixelRatio: 2,
    postprocessing: true,
    particleCount: 5000,
    geometryDetail: 4
  },
  medium: {
    shadows: false,
    antialias: true,
    pixelRatio: 1.5,
    postprocessing: true,
    particleCount: 2500,
    geometryDetail: 3
  },
  low: {
    shadows: false,
    antialias: false,
    pixelRatio: 1,
    postprocessing: false,
    particleCount: 1000,
    geometryDetail: 2
  }
};

// Detect device performance tier
export function detectPerformanceTier(): keyof PerformanceConfig {
  if (typeof window === 'undefined') return 'medium';

  // Check for GPU info
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return 'low';

  const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
  const gpu = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
  
  // Check device memory (Chrome only)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check connection speed
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g';
  
  // Simple heuristic for performance tier
  if (memory >= 8 && cores >= 8 && effectiveType === '4g') {
    return 'high';
  } else if (memory >= 4 && cores >= 4) {
    return 'medium';
  } else {
    return 'low';
  }
}

// Get current performance settings
export function getPerformanceSettings() {
  const tier = detectPerformanceTier();
  return performanceConfig[tier];
}

// Adaptive quality manager
export class AdaptiveQuality {
  private fps: number[] = [];
  private targetFPS = 60;
  private sampleSize = 60;
  private tier: keyof PerformanceConfig;
  private onQualityChange?: (tier: keyof PerformanceConfig) => void;

  constructor(onQualityChange?: (tier: keyof PerformanceConfig) => void) {
    this.tier = detectPerformanceTier();
    this.onQualityChange = onQualityChange;
  }

  recordFrame(deltaTime: number) {
    const fps = 1000 / deltaTime;
    this.fps.push(fps);

    if (this.fps.length > this.sampleSize) {
      this.fps.shift();
    }

    if (this.fps.length === this.sampleSize) {
      this.evaluatePerformance();
    }
  }

  private evaluatePerformance() {
    const avgFPS = this.fps.reduce((a, b) => a + b, 0) / this.fps.length;

    if (avgFPS < 30 && this.tier !== 'low') {
      this.tier = this.tier === 'high' ? 'medium' : 'low';
      this.onQualityChange?.(this.tier);
    } else if (avgFPS > 55 && this.tier !== 'high') {
      this.tier = this.tier === 'low' ? 'medium' : 'high';
      this.onQualityChange?.(this.tier);
    }
  }

  getCurrentTier() {
    return this.tier;
  }

  getCurrentSettings() {
    return performanceConfig[this.tier];
  }
}

// LOD (Level of Detail) manager for 3D objects
export class LODManager {
  private objects: Map<string, { near: any; medium: any; far: any }> = new Map();

  register(id: string, lodObjects: { near: any; medium: any; far: any }) {
    this.objects.set(id, lodObjects);
  }

  updateLOD(id: string, distance: number) {
    const lodObjects = this.objects.get(id);
    if (!lodObjects) return;

    // Hide all LODs
    lodObjects.near.visible = false;
    lodObjects.medium.visible = false;
    lodObjects.far.visible = false;

    // Show appropriate LOD
    if (distance < 10) {
      lodObjects.near.visible = true;
    } else if (distance < 30) {
      lodObjects.medium.visible = true;
    } else {
      lodObjects.far.visible = true;
    }
  }
}

// Visibility culling for off-screen objects
export function isInViewport(object: any, camera: any): boolean {
  // Simple frustum culling
  const frustum = new (window as any).THREE.Frustum();
  const matrix = new (window as any).THREE.Matrix4().multiplyMatrices(
    camera.projectionMatrix,
    camera.matrixWorldInverse
  );
  frustum.setFromProjectionMatrix(matrix);

  return frustum.intersectsObject(object);
}

// Texture optimization
export function optimizeTexture(texture: any, tier: keyof PerformanceConfig) {
  if (!texture) return;

  const maxSize = {
    high: 2048,
    medium: 1024,
    low: 512
  };

  const size = maxSize[tier];
  
  if (texture.image && (texture.image.width > size || texture.image.height > size)) {
    // Resize texture logic would go here
    console.log(`Texture should be resized to ${size}x${size} for ${tier} tier`);
  }

  // Set texture filtering based on tier
  if (tier === 'low') {
    texture.minFilter = (window as any).THREE.NearestFilter;
    texture.magFilter = (window as any).THREE.NearestFilter;
  }
}

// Progressive loading manager
export class ProgressiveLoader {
  private queue: Array<{ url: string; priority: number; callback: (data: any) => void }> = [];
  private loading = false;

  add(url: string, priority: number, callback: (data: any) => void) {
    this.queue.push({ url, priority, callback });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }

  private async processQueue() {
    if (this.loading || this.queue.length === 0) return;

    this.loading = true;
    const item = this.queue.shift()!;

    try {
      const response = await fetch(item.url);
      const data = await response.blob();
      item.callback(data);
    } catch (error) {
      console.error('Failed to load:', item.url, error);
    }

    this.loading = false;
    this.processQueue();
  }
}

// Memory management utilities
export function disposeObject(object: any) {
  if (!object) return;

  // Dispose geometry
  if (object.geometry) {
    object.geometry.dispose();
  }

  // Dispose material
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach((material: any) => disposeMaterial(material));
    } else {
      disposeMaterial(object.material);
    }
  }

  // Dispose children
  if (object.children) {
    object.children.forEach((child: any) => disposeObject(child));
  }
}

function disposeMaterial(material: any) {
  if (!material) return;

  // Dispose textures
  Object.keys(material).forEach(key => {
    const value = material[key];
    if (value && typeof value.dispose === 'function') {
      value.dispose();
    }
  });

  // Dispose material
  if (material.dispose) {
    material.dispose();
  }
}

// Request idle callback polyfill
export const requestIdleCallback = 
  (window as any).requestIdleCallback ||
  function(cb: any) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      });
    }, 1);
  };

// Performance monitoring hook
export function usePerformanceMonitor(callback?: (fps: number) => void) {
  if (typeof window === 'undefined') return;

  let lastTime = performance.now();
  let frames = 0;
  let fps = 0;

  const measure = () => {
    frames++;
    const currentTime = performance.now();
    
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frames * 1000) / (currentTime - lastTime));
      frames = 0;
      lastTime = currentTime;
      callback?.(fps);
    }

    requestAnimationFrame(measure);
  };

  requestAnimationFrame(measure);
}