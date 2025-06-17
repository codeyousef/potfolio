import React, { useCallback, useMemo } from 'react';
import Particles from 'react-particles';
import type { Engine } from '@tsparticles/engine';
import { useAethelframeStore } from '@store/useAethelframeStore';

interface ParticleSystemAdvancedProps {
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  intensity?: number;
  portalPosition?: { x: number; y: number };
  interactive?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
}

const ParticleSystemAdvanced: React.FC<ParticleSystemAdvancedProps> = ({
  timeOfDay = 'afternoon',
  intensity = 1,
  portalPosition = { x: 50, y: 50 },
  interactive = true,
  performanceMode = 'high',
}) => {
  const { currentPhase, activeCanvasId } = useAethelframeStore();
  
  // Initialize particle engine
  const particlesInit = useCallback(async (engine: Engine) => {
    // Simple initialization for TSParticles v3
    return Promise.resolve();
  }, []);
  
  // Advanced particle configuration
  const particleConfig = useMemo(() => {
    // Performance scaling
    const particleCount = {
      high: 150,
      medium: 100,
      low: 50,
    }[performanceMode];
    
    // Time-based color schemes
    const colorSchemes = {
      morning: {
        primary: ['#0e7490', '#0891b2', '#06b6d4', '#67e8f9'],
        secondary: ['#f0f9ff', '#e0f2fe'],
      },
      afternoon: {
        primary: ['#38B2AC', '#2C5282', '#9B2C2C', '#f0f9ff'],
        secondary: ['#ffffff', '#f8fafc'],
      },
      evening: {
        primary: ['#1e3a8a', '#1d4ed8', '#3b82f6', '#93c5fd'],
        secondary: ['#1e293b', '#334155'],
      },
      night: {
        primary: ['#1e293b', '#334155', '#475569', '#94a3b8'],
        secondary: ['#0f172a', '#1e293b'],
      },
    };
    
    const colors = colorSchemes[timeOfDay];
    
    return {
      fpsLimit: performanceMode === 'high' ? 120 : performanceMode === 'medium' ? 60 : 30,
      fullScreen: {
        enable: false,
        zIndex: 0,
      },
      particles: {
        number: {
          value: particleCount * intensity,
          density: {
            enable: true,
            height: 800,
            width: 800,
          },
        },
        color: {
          value: colors.primary,
          animation: {
            enable: true,
            speed: 20,
            sync: false,
          },
        },
        shape: {
          type: ['circle', 'triangle', 'star'],
          options: {
            star: {
              sides: 5,
            },
            triangle: {
              sides: 3,
            },
          },
        },
        opacity: {
          value: { min: 0.1, max: 0.8 },
          animation: {
            enable: true,
            speed: 3,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: 20,
            minimumValue: 0.1,
            sync: false,
          },
        },
        links: {
          enable: performanceMode === 'high',
          distance: 150,
          color: colors.primary[0],
          opacity: 0.2,
          width: 1,
          triangles: {
            enable: true,
            opacity: 0.05,
          },
        },
        move: {
          enable: true,
          speed: 1 + intensity * 0.5,
          direction: 'none',
          random: false,
          straight: false,
          outModes: {
            default: 'bounce',
          },
          attract: {
            enable: true,
            rotateX: portalPosition.x * 10,
            rotateY: portalPosition.y * 10,
          },
          trail: {
            enable: performanceMode === 'high',
            length: 10,
            fillColor: colors.primary[0],
          },
        },
        wobble: {
          distance: 5,
          enable: true,
          speed: 50,
        },
        orbit: {
          animation: {
            count: 0,
            enable: false,
            speed: 1,
            sync: false,
          },
          enable: false,
          opacity: 1,
          rotation: {
            random: {
              enable: false,
              minimumValue: 0,
            },
            value: 45,
          },
          width: 1,
        },
        roll: {
          darken: {
            enable: false,
            value: 0,
          },
          enable: false,
          speed: 25,
        },
        tilt: {
          random: {
            enable: false,
            minimumValue: 0,
          },
          value: 0,
          animation: {
            enable: false,
            speed: 0,
            sync: false,
          },
          direction: 'clockwise',
          enable: false,
        },
        twinkle: {
          lines: {
            enable: false,
            frequency: 0.05,
            opacity: 1,
          },
          particles: {
            enable: true,
            frequency: 0.05,
            opacity: 1,
          },
        },
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: interactive,
            mode: ['attract', 'bubble'],
            parallax: {
              enable: false,
              force: 60,
              smooth: 10,
            },
          },
          onClick: {
            enable: interactive,
            mode: ['push', 'repulse'],
          },
          resize: {
            enable: true,
            delay: 0.5,
          },
        },
        modes: {
          attract: {
            distance: 200,
            duration: 0.4,
            easing: 'ease-out-quad',
            factor: 1,
            maxSpeed: 50,
            speed: 1,
          },
          bubble: {
            distance: 250,
            duration: 2,
            mix: false,
            opacity: 0.8,
            size: 40,
            divs: {
              distance: 200,
              duration: 0.4,
              mix: false,
              selectors: [],
            },
          },
          connect: {
            distance: 80,
            links: {
              opacity: 0.5,
            },
            radius: 60,
          },
          grab: {
            distance: 100,
            links: {
              blink: false,
              consent: false,
              opacity: 1,
            },
          },
          push: {
            default: true,
            groups: [],
            quantity: 4,
          },
          remove: {
            quantity: 2,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: 'ease-out-quad',
            divs: {
              distance: 200,
              duration: 0.4,
              factor: 100,
              speed: 1,
              maxSpeed: 50,
              easing: 'ease-out-quad',
              selectors: [],
            },
          },
          slow: {
            factor: 3,
            radius: 200,
          },
          trail: {
            delay: 1,
            pauseOnStop: false,
            quantity: 1,
          },
          light: {
            area: {
              gradient: {
                start: {
                  value: colors.primary[0],
                },
                stop: {
                  value: colors.primary[1],
                },
              },
              radius: 1000,
            },
            shadow: {
              color: {
                value: colors.primary[0],
              },
              length: 2000,
            },
          },
        },
      },
      detectRetina: true,
      smooth: true,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: interactive ? 'auto' : 'none',
      },
      themes: [
        {
          name: 'light',
          default: {
            value: timeOfDay === 'morning' || timeOfDay === 'afternoon',
            mode: 'light',
          },
          options: {
            color: {
              value: colors.primary,
            },
            particles: {
              color: {
                value: colors.primary,
              },
            },
          },
        },
        {
          name: 'dark',
          default: {
            value: timeOfDay === 'evening' || timeOfDay === 'night',
            mode: 'dark',
          },
          options: {
            color: {
              value: colors.secondary,
            },
            particles: {
              color: {
                value: colors.secondary,
              },
            },
          },
        },
      ],
      // Aurora-specific configurations
      emitters: performanceMode === 'high' ? [
        {
          autoPlay: true,
          fill: true,
          life: {
            wait: false,
          },
          rate: {
            quantity: 1,
            delay: 0.25,
          },
          shape: 'square',
          startCount: 0,
          size: {
            mode: 'percent',
            height: 0,
            width: 0,
          },
          position: {
            x: portalPosition.x,
            y: portalPosition.y,
          },
          particles: {
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 2, max: 6 },
            },
            move: {
              speed: 10,
              outModes: {
                default: 'destroy',
                top: 'none',
              },
            },
            color: {
              value: colors.primary[0],
            },
            opacity: {
              value: 0.8,
            },
            life: {
              duration: {
                sync: false,
                value: 3,
              },
              count: 1,
            },
          },
        },
      ] : [],
      // Advanced motion effects
      motion: {
        disable: performanceMode === 'low',
        reduce: {
          factor: 4,
          value: true,
        },
      },
      // Background styling
      background: {
        color: 'transparent',
        image: '',
        position: '',
        repeat: '',
        size: '',
        opacity: 0,
      },
      // Responsive behavior
      responsive: [
        {
          maxWidth: 768,
          options: {
            particles: {
              number: {
                value: Math.floor(particleCount * 0.6),
              },
              move: {
                speed: 0.5,
              },
            },
            interactivity: {
              events: {
                onHover: {
                  enable: false,
                },
              },
            },
          },
        },
        {
          maxWidth: 480,
          options: {
            particles: {
              number: {
                value: Math.floor(particleCount * 0.3),
              },
              links: {
                enable: false,
              },
            },
          },
        },
      ],
    };
  }, [timeOfDay, intensity, portalPosition, interactive, performanceMode]);
  
  // Temporary CSS-based particle system while fixing TSParticles
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 30%, rgba(56, 178, 172, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(44, 82, 130, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 60% 20%, rgba(155, 44, 44, 0.06) 0%, transparent 50%)
        `,
        animation: 'aurora-shimmer 8s infinite ease-in-out'
      }}
    >
      <style>{`
        @keyframes aurora-shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default ParticleSystemAdvanced;