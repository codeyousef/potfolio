'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/lib/hooks/useApi';
import { getMediaUrl } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import gsap from 'gsap';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: project, loading, error } = useProject(slug);
  const [glitchMode, setGlitchMode] = useState(false);
  const [secretsRevealed, setSecretsRevealed] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Random glitch mode
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchMode(true);
        setTimeout(() => setGlitchMode(false), 1000);
      }
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleImageClick = (index: number) => {
    // Explode image on click
    const images = galleryRef.current?.querySelectorAll('.gallery-image');
    if (images && images[index]) {
      gsap.to(images[index], {
        scale: 2,
        rotation: 720,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        onComplete: () => {
          gsap.set(images[index], { scale: 1, rotation: 0, opacity: 1 });
          setSecretsRevealed(prev => prev + 1);
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-6xl text-violence-pink">
          <GlitchText text="DECRYPTING PROJECT..." intensity="high" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-center">
          <div className="text-8xl mb-4">⚠️</div>
          <div className="text-4xl text-warning-yellow mb-8">
            <GlitchText text="PROJECT CLASSIFIED" intensity="high" />
          </div>
          <Link href="/work" className="text-toxic-green text-xl hover:text-violence-pink">
            ← ABORT MISSION
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChaosCursor />
      <ExplosiveNav />
      
      <main className="bg-void-black text-ghost-white min-h-screen pt-32 pb-16 px-8">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-8">
          <Link 
            href="/work" 
            className="inline-flex items-center gap-2 text-toxic-green hover:text-violence-pink transition-colors text-xl font-bold group"
          >
            <span className="group-hover:translate-x-[-10px] transition-transform">←</span>
            ESCAPE VELOCITY
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-12">
            {project.main_image && (
              <div className="relative h-[70vh] overflow-hidden border-4 border-violence-pink mb-8">
                <Image
                  src={getMediaUrl(project.main_image.file)}
                  alt={project.title}
                  fill
                  className="object-cover"
                  style={{
                    filter: glitchMode ? 'hue-rotate(180deg) saturate(300%)' : 'none',
                    transform: glitchMode ? 'scale(1.1)' : 'scale(1)',
                  }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void-black via-transparent to-transparent" />
                
                {/* Glitch overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="glitch-lines opacity-50" />
                </div>
                
                {/* Project Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h1 className="text-6xl md:text-8xl font-display mb-4">
                    {glitchMode ? (
                      <GlitchText text={project.title} intensity="high" />
                    ) : (
                      <span className="glitch" data-text={project.title}>{project.title}</span>
                    )}
                  </h1>
                  <p className="text-2xl text-warning-yellow max-w-3xl">
                    {project.description}
                  </p>
                </div>
              </div>
            )}
            
            {/* Links - Chaos Style */}
            <div className="flex gap-6 mb-12">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-toxic-green text-void-black font-bold text-xl hover:bg-violence-pink transition-all transform hover:scale-110 hover:rotate-3"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { scale: 1.2, rotation: -5, duration: 0.3 });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { scale: 1, rotation: 0, duration: 0.3 });
                  }}
                >
                  🚀 LAUNCH PROJECT
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-transparent border-4 border-warning-yellow text-warning-yellow font-bold text-xl hover:bg-warning-yellow hover:text-void-black transition-all transform hover:scale-110 hover:rotate-3"
                >
                  💀 VIEW SOURCE
                </a>
              )}
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* About Section */}
              <div className="mb-16">
                <h2 className="text-4xl font-bold mb-6 text-violence-pink transform -rotate-1">
                  THE STORY
                </h2>
                {project.long_description_html ? (
                  <div 
                    className="chaos-content text-lg space-y-4"
                    dangerouslySetInnerHTML={{ __html: project.long_description_html }}
                  />
                ) : (
                  <p className="text-xl">{project.description}</p>
                )}
              </div>

              {/* Gallery - Chaos Mode */}
              {project.gallery_images && project.gallery_images.length > 0 && (
                <div>
                  <h2 className="text-4xl font-bold mb-6 text-toxic-green transform rotate-1">
                    EVIDENCE
                  </h2>
                  <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.gallery_images.map((image, index) => (
                      <div 
                        key={image.id} 
                        className="gallery-image relative aspect-video overflow-hidden border-4 border-warning-yellow cursor-pointer group"
                        onClick={() => handleImageClick(index)}
                        style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
                      >
                        <Image
                          src={getMediaUrl(image.file)}
                          alt={`${project.title} - Image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-violence-pink/0 group-hover:bg-violence-pink/20 transition-colors" />
                        
                        {/* Click me overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-2xl font-bold bg-void-black px-4 py-2">
                            CLICK TO DESTROY
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {secretsRevealed > 0 && (
                    <p className="text-center mt-6 text-warning-yellow">
                      Secrets revealed: {secretsRevealed} / {project.gallery_images.length}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Chaos Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                {/* Tech Stack */}
                <div className="p-6 border-4 border-violence-pink transform -rotate-2">
                  <h3 className="text-2xl font-bold mb-4 text-violence-pink">WEAPONS USED</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech, index) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-toxic-green/20 text-toxic-green text-sm font-bold uppercase"
                        style={{ 
                          transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)`,
                          animationDelay: `${index * 0.1}s` 
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="p-6 border-4 border-warning-yellow transform rotate-1">
                    <h3 className="text-2xl font-bold mb-4 text-warning-yellow">CLASSIFIED AS</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-violence-pink/20 text-violence-pink text-sm font-bold uppercase"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta Info */}
                <div className="p-6 border-4 border-toxic-green transform -rotate-1">
                  <h3 className="text-2xl font-bold mb-4 text-toxic-green">INTEL</h3>
                  <dl className="space-y-4">
                    {project.category && (
                      <div>
                        <dt className="text-sm opacity-60">OPERATION TYPE</dt>
                        <dd className="text-xl font-bold uppercase">{project.category}</dd>
                      </div>
                    )}
                    {project.year && (
                      <div>
                        <dt className="text-sm opacity-60">YEAR OF CHAOS</dt>
                        <dd className="text-xl font-bold">{project.year}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm opacity-60">DANGER LEVEL</dt>
                      <dd className="text-xl font-bold text-warning-yellow">
                        {'🔥'.repeat(Math.floor(Math.random() * 5) + 1)}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Random warning */}
                <div className="p-4 bg-warning-yellow text-void-black text-center transform rotate-3">
                  <p className="font-bold">
                    {['USE AT YOUR OWN RISK', 'NO REFUNDS', 'MAY CAUSE ADDICTION', 'SIDE EFFECTS VARY'][Math.floor(Math.random() * 4)]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        .chaos-content h2 {
          font-size: 2rem;
          font-weight: bold;
          margin: 2rem 0 1rem;
          color: var(--toxic-green);
        }
        
        .chaos-content h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.5rem 0 0.75rem;
          color: var(--warning-yellow);
        }
        
        .chaos-content p {
          margin-bottom: 1rem;
          line-height: 1.8;
        }
        
        .chaos-content a {
          color: var(--violence-pink);
          text-decoration: underline;
          text-decoration-style: wavy;
        }
        
        .chaos-content ul,
        .chaos-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        .chaos-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  );
}