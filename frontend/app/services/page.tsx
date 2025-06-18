'use client';

import { useServices } from '@/lib/hooks/useApi';
import { getMediaUrl } from '@/lib/api';
import { useState, useRef, useEffect } from 'react';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import gsap from 'gsap';

export default function ServicesPage() {
  const { data: services, loading, error } = useServices();
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [chaosLevel, setChaosLevel] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Increase chaos level as user scrolls
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setChaosLevel(Math.min(scrollPercent * 10, 10));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleServiceClick = (serviceId: number) => {
    if (expandedService === serviceId) {
      // Collapse with explosion
      const card = document.getElementById(`service-${serviceId}`);
      if (card) {
        gsap.to(card, {
          scale: 0,
          rotation: 720,
          opacity: 0,
          duration: 0.5,
          ease: 'power4.in',
          onComplete: () => {
            setExpandedService(null);
            gsap.set(card, { scale: 1, rotation: 0, opacity: 1 });
          }
        });
      }
    } else {
      setExpandedService(serviceId);
      // Shake other services
      const otherCards = servicesRef.current?.querySelectorAll(`.service-card:not(#service-${serviceId})`);
      otherCards?.forEach(card => {
        gsap.to(card, {
          x: 'random(-20, 20)',
          y: 'random(-20, 20)',
          rotation: 'random(-5, 5)',
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
          onComplete: () => {
            gsap.to(card, { x: 0, y: 0, rotation: 0, duration: 0.3 });
          }
        });
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-6xl">
          <GlitchText text="LOADING..." intensity="high" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-4xl text-warning-yellow">
          <GlitchText text="SERVICES.EXE HAS STOPPED WORKING" intensity="high" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ChaosCursor />
      <ExplosiveNav />
      
      <main className="bg-void-black text-ghost-white min-h-screen py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-8xl font-display mb-4 text-center">
            <GlitchText text="SERVICES" intensity="high" />
          </h1>
          <p className="text-2xl text-center mb-16 opacity-60">
            (Things I do when I'm not breaking the internet)
          </p>
          
          {/* Chaos Level Indicator */}
          <div className="mb-8 text-center">
            <p className="text-sm text-warning-yellow mb-2">CHAOS LEVEL: {Math.floor(chaosLevel)}/10</p>
            <div className="w-64 h-4 bg-ghost-white/20 mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-toxic-green to-violence-pink transition-all duration-300"
                style={{ width: `${chaosLevel * 10}%` }}
              />
            </div>
          </div>

          {/* Services Grid */}
          <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={`service-${service.id}`}
                className="service-card relative group"
                style={{
                  transform: `rotate(${Math.sin(index + chaosLevel) * 5}deg)`,
                }}
              >
                <div className="h-full bg-transparent border-4 border-warning-yellow overflow-hidden hover:border-violence-pink transition-all duration-300">
                  {/* Service Image with Chaos Effect */}
                  {service.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getMediaUrl(service.featured_image.file)}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-150 transition-transform duration-700"
                        style={{
                          filter: `hue-rotate(${chaosLevel * 36}deg)`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-void-black to-transparent" />
                      {/* Glitch overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="glitch-lines" />
                      </div>
                    </div>
                  )}
                  
                  {/* Service Content */}
                  <div className="p-6">
                    {/* Icon with spin */}
                    {service.icon_svg && (
                      <div 
                        className="w-16 h-16 mb-4 text-toxic-green group-hover:animate-spin"
                        dangerouslySetInnerHTML={{ __html: service.icon_svg }}
                        style={{
                          filter: `drop-shadow(0 0 10px currentColor)`,
                        }}
                      />
                    )}
                    
                    <h3 className="text-2xl font-bold mb-4 group-hover:glitch">
                      {chaosLevel > 5 ? (
                        <GlitchText text={service.title} intensity="medium" />
                      ) : (
                        service.title
                      )}
                    </h3>
                    
                    {/* Description */}
                    <div 
                      className={`text-sm mb-4 ${
                        expandedService === service.id ? '' : 'line-clamp-3'
                      }`}
                    >
                      <div dangerouslySetInnerHTML={{ __html: service.description_rich_text }} />
                    </div>
                    
                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => handleServiceClick(service.id)}
                      className="px-6 py-2 bg-violence-pink text-void-black font-bold hover:bg-toxic-green transition-all duration-200 transform hover:scale-110 hover:rotate-3"
                    >
                      {expandedService === service.id ? 'LESS!' : 'MORE!'}
                    </button>
                    
                    {/* Random price tag */}
                    {isClient && Math.random() > 0.7 && (
                      <div 
                        className="absolute top-4 right-4 bg-warning-yellow text-void-black px-3 py-1 text-sm font-bold"
                        style={{ transform: `rotate(${Math.random() * 30 - 15}deg)` }}
                      >
                        ${Math.floor(Math.random() * 9000 + 1000)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chaos CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold mb-4">
              <GlitchText text="NEED CHAOS?" intensity="medium" />
            </h2>
            <p className="text-xl mb-8 opacity-60">
              Let's break the internet together
            </p>
            <a
              href="/contact"
              className="inline-block px-12 py-4 text-2xl font-bold bg-toxic-green text-void-black hover:bg-violence-pink transition-all duration-200 transform hover:scale-125 hover:rotate-12"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.5,
                  rotation: 180,
                  duration: 0.5,
                  ease: 'elastic.out(1, 0.3)'
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  rotation: 0,
                  duration: 0.5
                });
              }}
            >
              HIRE ME NOW
            </a>
            
            {/* Warning */}
            <p className="mt-8 text-xs opacity-50">
              * Results may vary. Side effects include: mind-blowing designs, 
              <br />excessive creativity, and uncontrollable innovation.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}