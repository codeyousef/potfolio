'use client';

import { useEffect, useState, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, DepthOfField, SSAO } from '@react-three/postprocessing';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import MonolithNavigation from '@/components/tech/MonolithNavigation';
import AbstractSculpture from '@/components/tech/AbstractSculpture';
import LuxuryCursor from '@/components/tech/LuxuryCursor';
import LoadingSequence from '@/components/tech/LoadingSequence';
import { useProjects, useJournalEntries, useServices } from '@/lib/hooks/useApi';
import '@/styles/monolith.css';

// Abstract Project Visual Component
const AbstractProjectVisual = ({ project, isActive }: { project: any; isActive: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const seed = useMemo(() => project.title.charCodeAt(0), [project.title]);
  
  const forms = useMemo(() => {
    const count = 3 + (seed % 3);
    const shapes = [];
    
    for (let i = 0; i < count; i++) {
      shapes.push({
        position: [
          (Math.sin(seed + i) * 2),
          (Math.cos(seed + i) * 2),
          (Math.sin(seed * i) * 1)
        ],
        scale: 0.5 + (seed % 3) * 0.3,
        rotation: [seed * 0.1, seed * 0.2, seed * 0.3]
      });
    }
    
    return shapes;
  }, [seed]);
  
  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef}>
      {forms.map((form, i) => (
        <mesh key={i} position={form.position} scale={form.scale} rotation={form.rotation}>
          <octahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#FFFFFF"
            metalness={0.8}
            roughness={0.2}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
};

// Project Display Component
const ProjectDisplay = ({ project, index, alignment }: { 
  project: any; 
  index: number; 
  alignment: 'left' | 'right';
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <article 
      style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '32px',
        alignItems: 'center',
        marginBottom: 'var(--space-34)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        style={{ 
          gridColumn: alignment === 'right' ? '9 / 13' : '1 / 5',
          textAlign: alignment
        }}
      >
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <span className="text-10 font-light text-light-40 tracking-wider" style={{ textTransform: 'uppercase' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        
        <h3 className="text-32 font-light text-light tracking-tight" style={{ marginBottom: 'var(--space-5)' }}>
          {project.title}
        </h3>
        
        <p className="text-14 font-light text-light-60" style={{ lineHeight: '1.8', marginBottom: 'var(--space-8)' }}>
          {project.description}
        </p>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: 'var(--space-8)',
          justifyContent: alignment === 'right' ? 'flex-end' : 'flex-start'
        }}>
          {project.tech_stack?.map((tech: string) => (
            <span 
              key={tech}
              className="text-10 font-light text-light-40 tracking-wider"
              style={{ textTransform: 'uppercase' }}
            >
              {tech}
            </span>
          ))}
        </div>
        
        <a 
          href={`/work/${project.slug}`}
          className="link"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}
        >
          <span className="text-12 font-light tracking-wider" style={{ textTransform: 'uppercase' }}>
            View Case Study
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ opacity: 0.6 }}>
            <path d="M0 8 L8 8" stroke="currentColor" strokeWidth="0.5" />
            <path d="M6 6 L8 8 L6 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </a>
      </div>
      
      <div 
        style={{ 
          gridColumn: alignment === 'right' ? '1 / 8' : '6 / 13',
          gridRow: 1,
          aspectRatio: '16/10',
          backgroundColor: 'var(--graphite)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <AbstractProjectVisual project={project} isActive={isHovered} />
          </Suspense>
        </Canvas>
        
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 1s cubic-bezier(0.19, 1, 0.22, 1)'
          }}
        />
      </div>
    </article>
  );
};

// Blog Post Card Component
const BlogPostCard = ({ post, index }: { post: any; index: number }) => {
  return (
    <article style={{ marginBottom: 'var(--space-13)' }}>
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <span className="text-10 font-light text-light-40 tracking-wider" style={{ textTransform: 'uppercase' }}>
          {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>
      
      <h3 className="text-20 font-light text-light tracking-tight" style={{ marginBottom: 'var(--space-3)' }}>
        {post.title}
      </h3>
      
      <p className="text-14 font-light text-light-60" style={{ lineHeight: '1.8', marginBottom: 'var(--space-5)' }}>
        {post.excerpt}
      </p>
      
      <a 
        href={`/blog/${post.slug}`}
        className="link text-12 font-light tracking-wider"
        style={{ textTransform: 'uppercase' }}
      >
        Read Article
      </a>
    </article>
  );
};

// Service Card Component
const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  return (
    <div style={{ marginBottom: 'var(--space-13)' }}>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <span className="text-10 font-light text-light-40 tracking-wider" style={{ textTransform: 'uppercase' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      
      <h3 className="text-32 font-light text-light tracking-tight" style={{ marginBottom: 'var(--space-5)' }}>
        {service.title}
      </h3>
      
      <p className="text-14 font-light text-light-60" style={{ lineHeight: '1.8' }}>
        {service.description}
      </p>
    </div>
  );
};

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  
  // API Hooks
  const { data: projects, loading: projectsLoading } = useProjects();
  const { data: journalEntries, loading: journalLoading } = useJournalEntries();
  const { data: services, loading: servicesLoading } = useServices();
  
  useEffect(() => {
    document.body.classList.add('monolith-theme');
    
    return () => {
      document.body.classList.remove('monolith-theme');
    };
  }, []);
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm);
  };
  
  return (
    <>
      <LoadingSequence onComplete={() => setIsLoaded(true)} />
      <LuxuryCursor />
      <MonolithNavigation />
      
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="bg-void"
        style={{ 
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          y: heroY
        }}
        id="home"
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 35 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance"
            }}
          >
            <ambientLight intensity={0.01} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} color="#FFFFFF" />
            <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#FFFFFF" />
            
            <Suspense fallback={null}>
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <AbstractSculpture />
              </Float>
            </Suspense>
            
            <EffectComposer>
              <SSAO samples={31} radius={5} intensity={30} luminanceInfluence={0.1} />
              <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={2} />
            </EffectComposer>
          </Canvas>
        </div>
        
        <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <div className="container">
            <motion.div 
              style={{ maxWidth: '1024px' }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            >
              <h1 
                className="text-80 md:text-120 font-thin text-light tracking-tight"
                style={{ 
                  lineHeight: '0.85',
                  marginBottom: 'var(--space-8)'
                }}
              >
                Digital
                <br />
                Architect
              </h1>
              
              <div 
                style={{ 
                  width: '96px', 
                  height: '1px', 
                  backgroundColor: 'var(--light-20)',
                  marginBottom: 'var(--space-8)'
                }} 
              />
              
              <p 
                className="text-16 font-light text-light-60 tracking-wide"
                style={{ 
                  maxWidth: '448px',
                  lineHeight: '1.8'
                }}
              >
                Crafting tomorrow's interfaces with today's technology.
              </p>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          style={{ 
            position: 'absolute', 
            bottom: '32px', 
            left: '32px' 
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div 
            className="text-10 font-light text-light-40 tracking-wider"
            style={{ textTransform: 'uppercase', marginBottom: '16px' }}
          >
            Scroll
          </div>
          <div 
            style={{
              width: '1px',
              height: '64px',
              background: 'linear-gradient(to bottom, var(--light-40), transparent)'
            }}
          />
        </motion.div>
      </motion.section>
      
      {/* Projects Section */}
      <section 
        className="bg-obsidian"
        style={{ 
          minHeight: '100vh',
          paddingTop: 'var(--space-34)',
          paddingBottom: 'var(--space-34)'
        }}
        id="projects"
      >
        <div className="container">
          <div style={{ marginBottom: 'var(--space-21)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
              <div style={{ width: '32px', height: '1px', backgroundColor: 'var(--light-20)' }} />
              <span 
                className="text-10 font-light text-light-40 tracking-wider"
                style={{ 
                  margin: '0 16px',
                  textTransform: 'uppercase'
                }}
              >
                Selected Works
              </span>
            </div>
            
            <h2 className="text-48 font-thin text-light tracking-tight">
              Precision in Every Pixel
            </h2>
          </div>
          
          <div>
            {projectsLoading ? (
              <div className="text-light-40">Loading projects...</div>
            ) : (
              projects?.slice(0, 4).map((project: any, index: number) => (
                <ProjectDisplay
                  key={project.id}
                  project={project}
                  index={index}
                  alignment={index % 2 === 0 ? 'left' : 'right'}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section 
        className="bg-void"
        style={{ 
          paddingTop: 'var(--space-34)',
          paddingBottom: 'var(--space-34)'
        }}
        id="services"
      >
        <div className="container">
          <div style={{ marginBottom: 'var(--space-21)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
              <div style={{ width: '32px', height: '1px', backgroundColor: 'var(--light-20)' }} />
              <span 
                className="text-10 font-light text-light-40 tracking-wider"
                style={{ 
                  margin: '0 16px',
                  textTransform: 'uppercase'
                }}
              >
                Capabilities
              </span>
            </div>
            
            <h2 className="text-48 font-thin text-light tracking-tight">
              Services & Expertise
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: 'var(--space-8)' 
          }}>
            {servicesLoading ? (
              <div className="text-light-40">Loading services...</div>
            ) : (
              services?.map((service: any, index: number) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section 
        className="bg-obsidian"
        style={{ 
          paddingTop: 'var(--space-34)',
          paddingBottom: 'var(--space-34)'
        }}
        id="journal"
      >
        <div className="container">
          <div style={{ marginBottom: 'var(--space-21)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
              <div style={{ width: '32px', height: '1px', backgroundColor: 'var(--light-20)' }} />
              <span 
                className="text-10 font-light text-light-40 tracking-wider"
                style={{ 
                  margin: '0 16px',
                  textTransform: 'uppercase'
                }}
              >
                Journal
              </span>
            </div>
            
            <h2 className="text-48 font-thin text-light tracking-tight">
              Thoughts & Insights
            </h2>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: 'var(--space-8)',
            maxWidth: '1200px'
          }}>
            {journalLoading ? (
              <div className="text-light-40">Loading articles...</div>
            ) : (
              journalEntries?.slice(0, 6).map((post: any, index: number) => (
                <BlogPostCard key={post.id} post={post} index={index} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section 
        className="bg-void"
        style={{ 
          paddingTop: 'var(--space-34)',
          paddingBottom: 'var(--space-34)'
        }}
        id="about"
      >
        <div className="container">
          <div style={{ maxWidth: '768px' }}>
            <h2 
              className="text-32 font-thin text-light tracking-tight"
              style={{ marginBottom: 'var(--space-8)' }}
            >
              About
            </h2>
            
            <div 
              className="text-16 font-light text-light-80 tracking-wide"
              style={{ 
                lineHeight: '2',
                marginBottom: 'var(--space-13)'
              }}
            >
              <p style={{ marginBottom: 'var(--space-5)' }}>
                I design and develop digital experiences that exist at the 
                intersection of art and technology.
              </p>
              <p style={{ marginBottom: 'var(--space-5)' }}>
                My work focuses on creating interfaces that feel inevitable—
                as if they couldn't exist any other way.
              </p>
            </div>
            
            <div 
              className="text-14 font-light text-light-60 tracking-wide"
              style={{ lineHeight: '2' }}
            >
              <p style={{ marginBottom: 'var(--space-3)' }}>
                <span style={{ color: 'var(--light-40)' }}>Currently:</span> Building the future of interaction design.
              </p>
              <p style={{ marginBottom: 'var(--space-8)' }}>
                <span style={{ color: 'var(--light-40)' }}>Previously:</span> Apple, Google, IDEO.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section 
        className="bg-graphite"
        style={{ 
          paddingTop: 'var(--space-34)',
          paddingBottom: 'var(--space-34)'
        }}
        id="contact"
      >
        <div className="container">
          <div style={{ maxWidth: '768px' }}>
            <h2 
              className="text-32 font-thin text-light tracking-tight"
              style={{ marginBottom: 'var(--space-8)' }}
            >
              Contact
            </h2>
            
            <p 
              className="text-16 font-light text-light-60 tracking-wide"
              style={{ 
                lineHeight: '1.8',
                marginBottom: 'var(--space-13)'
              }}
            >
              Interested in working together? Let's create something extraordinary.
            </p>
            
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--light-20)',
                    color: 'var(--light)',
                    fontSize: 'var(--text-16)',
                    fontWeight: 'var(--weight-light)',
                    letterSpacing: 'var(--tracking-wide)',
                    outline: 'none',
                    transition: 'border-color 0.7s cubic-bezier(0.19, 1, 0.22, 1)'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = 'var(--light-40)'}
                  onBlur={(e) => e.target.style.borderBottomColor = 'var(--light-20)'}
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--light-20)',
                    color: 'var(--light)',
                    fontSize: 'var(--text-16)',
                    fontWeight: 'var(--weight-light)',
                    letterSpacing: 'var(--tracking-wide)',
                    outline: 'none',
                    transition: 'border-color 0.7s cubic-bezier(0.19, 1, 0.22, 1)'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = 'var(--light-40)'}
                  onBlur={(e) => e.target.style.borderBottomColor = 'var(--light-20)'}
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--light-20)',
                    color: 'var(--light)',
                    fontSize: 'var(--text-16)',
                    fontWeight: 'var(--weight-light)',
                    letterSpacing: 'var(--tracking-wide)',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.7s cubic-bezier(0.19, 1, 0.22, 1)'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = 'var(--light-40)'}
                  onBlur={(e) => e.target.style.borderBottomColor = 'var(--light-20)'}
                />
              </div>
              
              <button
                type="submit"
                className="link"
                style={{
                  background: 'none',
                  border: '1px solid var(--light-20)',
                  padding: 'var(--space-3) var(--space-5)',
                  color: 'var(--light-60)',
                  fontSize: 'var(--text-12)',
                  fontWeight: 'var(--weight-light)',
                  letterSpacing: 'var(--tracking-wider)',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  marginTop: 'var(--space-5)',
                  width: 'fit-content',
                  transition: 'all 0.7s cubic-bezier(0.19, 1, 0.22, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--light-60)';
                  e.currentTarget.style.color = 'var(--light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--light-20)';
                  e.currentTarget.style.color = 'var(--light-60)';
                }}
              >
                Send Message
              </button>
            </form>
            
            <div style={{ marginTop: 'var(--space-21)' }}>
              <p className="text-14 font-light text-light-60 tracking-wide">
                Or reach out directly:<br />
                <a 
                  href="mailto:hello@example.com" 
                  className="link"
                  style={{ color: 'var(--light-80)' }}
                >
                  hello@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}