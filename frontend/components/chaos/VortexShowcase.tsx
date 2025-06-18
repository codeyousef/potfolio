'use client';

import { useEffect, useRef, useState } from 'react';
import { useFeaturedProjects } from '@/lib/hooks/useApi';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectCardProps {
  project: any;
  index: number;
  totalProjects: number;
  scrollProgress: number;
  currentIndex: number;
  onHover: () => void;
}

function ProjectCard({ project, index, totalProjects, scrollProgress, currentIndex, onHover }: ProjectCardProps) {
  const angle = (index / totalProjects) * Math.PI * 2;
  const radius = 40 + (scrollProgress * 20);
  const isActive = Math.abs(index - currentIndex) < 2;
  
  const x = 50 + Math.cos(angle + scrollProgress * Math.PI) * radius;
  const y = 50 + Math.sin(angle + scrollProgress * Math.PI) * radius;
  const rotation = (angle * 180 / Math.PI) + scrollProgress * 360;
  const scale = 1 - Math.abs(index - currentIndex) * 0.2;
  const zIndex = totalProjects - Math.abs(index - currentIndex);

  return (
    <div
      className="absolute w-64 h-64 cursor-pointer transition-all duration-500"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        zIndex,
        opacity: isActive ? 1 : 0.3
      }}
      onMouseEnter={onHover}
    >
      <div className="relative w-full h-full bg-bg-card border-2 border-violence-pink overflow-hidden group">
        {project.main_image && (
          <Image
            src={getMediaUrl(project.main_image.file)}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-void-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 p-4">
            <h3 className="text-xl font-bold text-ghost-white">{project.title}</h3>
            <p className="text-sm text-toxic-green">{project.category}</p>
          </div>
        </div>
        
        {/* Glitch overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 mix-blend-screen pointer-events-none">
          <div className="glitch" data-text={project.title}>
            {project.title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VortexShowcase() {
  const { data: projects = [] } = useFeaturedProjects(12);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(50);
  const [fakeTotal, setFakeTotal] = useState(10);

  // Set client-side only values after hydration
  useEffect(() => {
    setIsClient(true);
    setFakeProgress(Math.floor(Math.random() * 100));
    setFakeTotal(Math.floor(Math.random() * 20 + projects.length));
  }, [projects.length]);

  useEffect(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: '.vortex-sticky',
      scrub: 1,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        setCurrentIndex(Math.floor(self.progress * projects.length));
      }
    });

    return () => trigger.kill();
  }, [projects.length]);

  const createExplosion = (index: number) => {
    // Create particle explosion effect
    const particles = 50;
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 pointer-events-none';
      particle.style.background = ['var(--violence-pink)', 'var(--toxic-green)', 'var(--warning-yellow)'][i % 3];
      particle.style.left = '50%';
      particle.style.top = '50%';
      container.appendChild(particle);

      const angle = (i / particles) * Math.PI * 2;
      const velocity = 200 + Math.random() * 300;
      
      gsap.to(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    }
  };

  return (
    <section className="h-[500vh] relative" ref={containerRef}>
      <div className="vortex-sticky sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-6xl font-display text-center z-50">
            <span className="block text-warning-yellow">PROJECTS</span>
            <span className="block text-2xl opacity-50">IN THE VORTEX</span>
          </h2>
        </div>
        
        <div className="vortex-container relative w-full h-full">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              totalProjects={projects.length}
              scrollProgress={scrollProgress}
              currentIndex={currentIndex}
              onHover={() => createExplosion(index)}
            />
          ))}
        </div>
        
        {/* Progress indicator (but it's wrong on purpose) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-4xl font-mono text-toxic-green">
            {isClient ? fakeProgress : 50}%
          </div>
          <div className="text-xs opacity-50">
            Project {currentIndex + 1} of {isClient ? fakeTotal : projects.length + 10}
          </div>
        </div>
      </div>
    </section>
  );
}