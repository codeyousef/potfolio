'use client';

import { useState, useEffect } from 'react';
import { useFeaturedProjects } from '@/lib/hooks/useApi';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import Image from 'next/image';
import Link from 'next/link';
import { getMediaUrl } from '@/lib/api';
import gsap from 'gsap';

export default function WorkPage() {
  const { data: projects = [] } = useFeaturedProjects(20);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleProjectHover = (index: number, isHovering: boolean) => {
    setHoveredProject(isHovering ? index : null);
    
    if (isHovering) {
      // Chaos effect on hover
      const cards = document.querySelectorAll('.project-card');
      cards.forEach((card, i) => {
        if (i !== index) {
          gsap.to(card, {
            scale: 0.95,
            opacity: 0.5,
            filter: 'blur(2px)',
            duration: 0.3
          });
        } else {
          gsap.to(card, {
            scale: 1.05,
            rotate: Math.random() * 10 - 5,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      });
    } else {
      // Reset
      const cards = document.querySelectorAll('.project-card');
      cards.forEach((card) => {
        gsap.to(card, {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          rotate: 0,
          duration: 0.3
        });
      });
    }
  };

  return (
    <>
      <ChaosCursor />
      <ExplosiveNav />
      
      <main className="bg-void-black text-ghost-white min-h-screen py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-8xl font-display mb-4 text-center">
            <GlitchText text="WORK" intensity="high" />
          </h1>
          <p className="text-2xl text-center mb-16 opacity-60">
            (Some call it art. Some call it madness. I call it Tuesday.)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-card relative group"
                onMouseEnter={() => handleProjectHover(index, true)}
                onMouseLeave={() => handleProjectHover(index, false)}
              >
                <Link href={`/work/${project.slug}`}>
                  <div className="relative aspect-[4/3] overflow-hidden border-2 border-violence-pink">
                    {project.main_image && (
                      <Image
                        src={getMediaUrl(project.main_image.file)}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    
                    {/* Glitch overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-t from-void-black to-transparent" />
                      <div className="absolute bottom-0 p-6">
                        <h3 className="text-2xl font-bold mb-2">
                          <GlitchText text={project.title} intensity="medium" />
                        </h3>
                        <p className="text-sm opacity-80">{project.description}</p>
                        <div className="flex gap-2 mt-2">
                          {project.tech_stack.map((tech) => (
                            <span 
                              key={tech}
                              className="text-xs px-2 py-1 bg-toxic-green/20 text-toxic-green"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Random chaos badge */}
                    {isClient && Math.random() > 0.7 && (
                      <div 
                        className="absolute top-4 right-4 bg-warning-yellow text-void-black px-3 py-1 text-sm font-bold"
                        style={{ transform: `rotate(${Math.random() * 30 - 15}deg)` }}
                      >
                        {['HOT', 'NEW', 'WTF', 'VIRAL', '!!!'][Math.floor(Math.random() * 5)]}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">NO PROJECTS FOUND</p>
              <p className="text-xl opacity-60">(They're probably hiding from you)</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}