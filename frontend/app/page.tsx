'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import BigHead from '@/components/3d/BigHead';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ChaosLoader from '@/components/loaders/ChaosLoader';
import VortexShowcase from '@/components/chaos/VortexShowcase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFeaturedProjects, useServices } from '@/lib/hooks/useApi';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [scrollChaos, setScrollChaos] = useState({
    multiplier: 1,
    direction: 1,
    isGlitching: false
  });
  const logoRef = useRef<HTMLDivElement>(null);
  const logoClickCount = useRef(0);

  const { data: projects = [] } = useFeaturedProjects(6);
  const { data: services = [] } = useServices();

  // Ensure client-side only operations happen after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Exit detection and boring website prompt
  useEffect(() => {
    let userHasInteracted = false;
    
    const markUserInteraction = () => {
      userHasInteracted = true;
    };
    
    // Track user interaction to enable beforeunload
    const interactionEvents = ['click', 'keydown', 'mousemove', 'scroll'];
    interactionEvents.forEach(event => {
      document.addEventListener(event, markUserInteraction, { once: true });
    });

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (userHasInteracted) {
        // This will trigger the browser's confirmation dialog
        e.preventDefault();
        e.returnValue = ''; // Modern browsers ignore custom messages
        
        // Try to show our custom message in browsers that support it
        setTimeout(() => {
          try {
            const wantsBoring = confirm("Since you couldn't figure out the secret code, do you want to see the boring website?");
            if (wantsBoring) {
              window.location.href = '/boring';
            }
          } catch (e) {
            // Silent fail if browser blocks this
          }
        }, 0);
        
        return '';
      }
    };

    // Alternative approach: Intercept back button and navigation
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      const wantsBoring = confirm("Since you couldn't figure out the secret code, do you want to see the boring website?");
      if (wantsBoring) {
        window.location.href = '/boring';
      } else {
        // Push state back to stay on current page
        history.pushState(null, '', window.location.href);
      }
    };

    // Push an extra state to catch back button
    history.pushState(null, '', window.location.href);
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      interactionEvents.forEach(event => {
        document.removeEventListener(event, markUserInteraction);
      });
    };
  }, []);

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

    // Rebellious scroll behavior (only interfere during chaos)
    const handleWheel = (e: WheelEvent) => {
      // Only interfere with scroll during chaos mode
      if (scrollChaos.isGlitching) {
        e.preventDefault();
        window.scrollBy({
          top: e.deltaY * scrollChaos.direction * scrollChaos.multiplier,
          behavior: 'auto'
        });
        return;
      }
      
      // 5% chance of chaos on normal scroll
      if (Math.random() > 0.95 && !scrollChaos.isGlitching) {
        setScrollChaos({
          isGlitching: true,
          direction: Math.random() > 0.5 ? -1 : 3,
          multiplier: Math.random() * 2 + 0.5
        });
        
        setTimeout(() => {
          setScrollChaos({
            isGlitching: false,
            direction: 1,
            multiplier: 1
          });
        }, 500);
      }
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

    // Idle timer for auto-pilot
    let idleTimer: NodeJS.Timeout;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        activateAutoPilot();
      }, 30000);
    };
    
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);

    // Cleanup
    return () => {
      clearInterval(hueInterval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, [scrollChaos]);

  const activateBoringMode = () => {
    // Temporarily make everything "normal"
    document.body.classList.add('boring-mode');
    gsap.to('*', {
      rotation: 0,
      scale: 1,
      x: 0,
      y: 0,
      duration: 1,
      ease: 'power2.inOut'
    });
    
    setTimeout(() => {
      document.body.classList.remove('boring-mode');
      alert("Just kidding! Chaos is eternal.");
      window.location.reload();
    }, 3000);
  };

  const activateAutoPilot = () => {
    // Site starts scrolling and clicking on its own
    const autoScroll = () => {
      window.scrollBy({
        top: Math.random() * 200 - 100,
        behavior: 'smooth'
      });
      
      if (Math.random() > 0.7) {
        // Randomly click something
        const clickables = document.querySelectorAll('a, button');
        const target = clickables[Math.floor(Math.random() * clickables.length)] as HTMLElement;
        if (target) {
          const event = new MouseEvent('mouseover', { bubbles: true });
          target.dispatchEvent(event);
        }
      }
      
      if (document.body.classList.contains('auto-pilot')) {
        setTimeout(autoScroll, 2000 + Math.random() * 3000);
      }
    };
    
    document.body.classList.add('auto-pilot');
    autoScroll();
  };

  const handleLogoClick = () => {
    logoClickCount.current++;
    if (logoClickCount.current === 7) {
      revealSecretContact();
      logoClickCount.current = 0;
    }
  };

  const revealSecretContact = () => {
    gsap.to(logoRef.current, {
      rotation: 720,
      scale: 2,
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
      onComplete: () => {
        alert("Secret unlocked! Real contact: chaos@actualportfolio.com");
        gsap.to(logoRef.current, {
          rotation: 0,
          scale: 1,
          duration: 0.5
        });
      }
    });
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
      
      {/* Logo with secret */}
      <div 
        ref={logoRef}
        className="fixed top-4 left-4 z-50 cursor-pointer select-none"
        onClick={handleLogoClick}
      >
        <div className="text-4xl font-bold text-violence-pink glitch" data-text="CHAOS">
          CHAOS
        </div>
      </div>
      
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
              <Suspense fallback={null}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
                
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#FF006E" />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00F5FF" />
                
                <BigHead />
                
                <Environment preset="warehouse" background={false} />
              </Suspense>
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
        
        {/* Services - But Honest */}
        <section className="min-h-screen p-8">
          <h2 className="text-6xl font-display text-center mb-16 text-toxic-green">
            <GlitchText text="THINGS I DO FOR MONEY" intensity="medium" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className="p-6 border-2 border-warning-yellow hover:border-violence-pink transition-colors"
                style={{
                  transform: isClient ? `rotate(${Math.random() * 10 - 5}deg)` : 'rotate(0deg)',
                  animation: isClient ? `float ${3 + Math.random() * 2}s ease-in-out infinite` : 'none'
                }}
              >
                <h3 className="text-2xl font-bold mb-4 text-warning-yellow">
                  {service.title}
                </h3>
                <div className="text-sm opacity-80" dangerouslySetInnerHTML={{ __html: service.description_rich_text }} />
                <p className="mt-4 text-xs opacity-50">
                  {index === 0 && "(I'll make it pretty, then make it weird)"}
                  {index === 1 && "(Your backend will be solid. Frontend might scare you)"}
                  {index === 2 && "(I'll optimize it. Then add chaos. Still fast though)"}
                </p>
              </div>
            ))}
          </div>
        </section>
        
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
        
        {/* Project Descriptions with Aggressive Honesty */}
        {projects.length > 0 && (
          <section className="min-h-screen p-8">
            <h2 className="text-6xl font-display text-center mb-16">
              <GlitchText text="RECENT CATASTROPHES" intensity="high" />
            </h2>
            
            <div className="space-y-16 max-w-4xl mx-auto">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="relative">
                  <h3 className="text-3xl font-bold mb-4 text-violence-pink">
                    {project.title}
                  </h3>
                  <p className="text-xl mb-2">{project.description}</p>
                  <p className="text-sm opacity-60">
                    {project.title.includes('Corporate') && 
                      "They wanted 'innovative but safe.' I gave them 'safe but looks innovative.' They loved it. I died inside. +47% engagement though."
                    }
                    {project.title.includes('App') && 
                      "I spent 3 months building this. 7 people used it. Those 7 people said it changed their lives. Worth it? You tell me."
                    }
                    {!project.title.includes('Corporate') && !project.title.includes('App') &&
                      "Turns out, people just want things to work. Revolutionary, I know. Made it fast. Made it work. Client happy. Bank account happy."
                    }
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        
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
          <div className="absolute bottom-4 right-4 text-xs opacity-10 hover:opacity-100 transition-opacity cursor-help">
            The real email is in the console.
          </div>
        </section>
      </main>
    </>
  );
}