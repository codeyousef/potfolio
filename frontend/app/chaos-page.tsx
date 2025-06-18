'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useScroll } from '@react-three/fiber';
import { ScrollControls, PerspectiveCamera, Environment } from '@react-three/drei';
import BigHead from '@/components/3d/BigHead';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ChaosLoader from '@/components/loaders/ChaosLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy load heavy components
const VortexShowcase = dynamic(() => import('@/components/chaos/VortexShowcase'), {
  ssr: false,
  loading: () => <div className="h-screen bg-void-black" />
});

export default function ChaosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollChaos, setScrollChaos] = useState({
    multiplier: 1,
    direction: 1,
    isGlitching: false
  });

  useEffect(() => {
    // Set random CSS variable for dynamic colors
    const updateRandomHue = () => {
      document.documentElement.style.setProperty('--random-hue', Math.random() * 360 + '');
    };
    const hueInterval = setInterval(updateRandomHue, 2000);

    // Track mouse position for CSS
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', (e.clientX / window.innerWidth).toString());
      document.documentElement.style.setProperty('--mouse-y', (e.clientY / window.innerHeight).toString());
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Rebellious scroll behavior
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // 5% chance of chaos
      if (Math.random() > 0.95 && !scrollChaos.isGlitching) {
        setScrollChaos({
          isGlitching: true,
          direction: Math.random() > 0.5 ? -1 : 3,
          multiplier: 1
        });
        
        setTimeout(() => {
          setScrollChaos({
            isGlitching: false,
            direction: 1,
            multiplier: 1
          });
        }, 500);
      }
      
      window.scrollBy({
        top: e.deltaY * scrollChaos.direction * scrollChaos.multiplier,
        behavior: scrollChaos.isGlitching ? 'auto' : 'smooth'
      });
    };
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Konami code easter egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateBoringMode();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    document.addEventListener('keydown', handleKeydown);

    // Logo secret clicks
    let logoClicks = 0;
    const handleLogoClick = () => {
      logoClicks++;
      if (logoClicks === 7) {
        revealSecretContact();
        logoClicks = 0;
      }
    };

    // Cleanup
    return () => {
      clearInterval(hueInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [scrollChaos]);

  const activateBoringMode = () => {
    alert("BORING MODE ACTIVATED. Just kidding, that would be boring.");
    document.body.style.filter = 'grayscale(100%)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 3000);
  };

  const revealSecretContact = () => {
    alert("You found it! Email: chaos@definitely-not-fake.com");
  };

  return (
    <>
      {/* Custom Cursor */}
      <ChaosCursor />
      
      {/* Loading Screen */}
      {isLoading && (
        <ChaosLoader onComplete={() => setIsLoading(false)} />
      )}
      
      {/* Explosive Navigation */}
      <ExplosiveNav />
      
      {/* Main Content */}
      <main className="bg-void-black text-ghost-white overflow-x-hidden">
        {/* Hero Section with Big Head */}
        <section className="h-[200vh] relative">
          {/* Hidden message in comments */}
          {/* 
            IF YOU'RE READING THIS, YOU'RE THE KIND OF PERSON I WANT TO WORK WITH.
            EMAIL ME WITH THE SUBJECT "I FOUND IT" FOR A SURPRISE.
          */}
          
          {/* 3D Canvas with Big Head */}
          <div className="fixed inset-0 z-0">
            <Canvas
              gl={{ 
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance'
              }}
            >
              <ScrollControls pages={2}>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
                  
                  <ambientLight intensity={0.2} />
                  <directionalLight position={[10, 10, 5]} intensity={1} color="#FF006E" />
                  <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00F5FF" />
                  
                  <BigHead />
                  
                  <Environment preset="warehouse" background={false} />
                </Suspense>
              </ScrollControls>
            </Canvas>
          </div>
          
          {/* Hero Text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
            <h1 
              className="font-display leading-none"
              style={{ fontSize: 'var(--text-hero)' }}
            >
              <GlitchText 
                text="I CREATE" 
                className="block"
                intensity="low"
              />
              <GlitchText 
                text="EXPERIENCES" 
                className="block text-violence-pink"
                intensity="high"
              />
              <GlitchText 
                text="THAT HAUNT YOU" 
                className="block"
                intensity="medium"
                splitOnScroll
              />
            </h1>
            
            <p 
              className="mt-8 opacity-50"
              style={{ fontSize: 'var(--text-subhero)' }}
            >
              (scroll if you dare)
            </p>
          </div>
        </section>
        
        {/* Projects Vortex */}
        <VortexShowcase />
        
        {/* About Section */}
        <section className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl">
            <h2 className="text-6xl font-display mb-8 text-warning-yellow">
              <GlitchText text="TOO MUCH INFORMATION" intensity="medium" />
            </h2>
            
            <div className="space-y-4 text-2xl">
              <p>I'm a developer who thinks design school dropouts have the right idea.</p>
              <p className="text-toxic-green">I build websites that make people uncomfortable in the best way.</p>
              <p>My code is clean. <span className="text-violence-pink">My designs are not.</span></p>
              <p>I've won awards. I've lost clients. <span className="text-warning-yellow">Sometimes for the same project.</span></p>
              <p>I believe the web is too boring and I'm doing my part to fix that.</p>
              <p className="text-4xl font-bold mt-8">Currently accepting projects that scare me.</p>
              <p className="text-sm opacity-50 mt-4">P.S. I also do normal websites if you're into that sort of thing.</p>
            </div>
          </div>
        </section>
        
        {/* Contact CTA */}
        <section className="h-screen flex items-center justify-center relative">
          <div className="text-center">
            <h2 className="text-8xl font-display mb-8">
              <GlitchText text="LET'S BREAK SOMETHING" intensity="high" />
            </h2>
            <button 
              className="px-12 py-6 text-2xl font-bold bg-violence-pink text-void-black hover:bg-toxic-green transition-colors duration-200 transform hover:scale-110 hover:rotate-3"
              onClick={() => window.location.href = 'mailto:chaos@portfolio.com?subject=I%20Want%20Chaos'}
            >
              HIRE ME (IF YOU DARE)
            </button>
          </div>
          
          {/* Hidden in plain sight */}
          <div className="absolute bottom-4 right-4 text-xs opacity-10">
            The real email is in the console.
          </div>
        </section>
      </main>
      
      <style jsx global>{`
        /* Import chaos styles */
        @import url('/src/styles/chaos.css');
      `}</style>
    </>
  );
}