'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import ScrollIndicator from '@/components/ScrollIndicator';
import { useFeaturedProjects, useLatestJournalEntries, useServices } from '@/lib/hooks/useApi';
import Link from 'next/link';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/api';
import { useEffect, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import Dashboard3D from '@/components/3d/Dashboard3D';
import ErrorBoundary from '@/components/ErrorBoundary';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Dynamic import for 3D content with SSR disabled
const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-bg-dark" />
});

export default function HomePage() {
  const { data: featuredProjects = [] } = useFeaturedProjects(3);
  const { data: latestPosts = [] } = useLatestJournalEntries(3);
  const { data: services = [] } = useServices();

  // GSAP Animations
  useEffect(() => {
    // Hero text animation - commented out to use CSS animations instead
    // This prevents the disappearing issue caused by GSAP opacity animations
    /*
    const heroTimeline = gsap.timeline();
    heroTimeline
      .from('.hero-title', {
        y: 100,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.1,
        clearProps: 'all'
      })
      .from('.hero-subtitle', {
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'all'
      }, '-=0.5')
      .from('.hero-cta', {
        scale: 0.8,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.1,
        clearProps: 'all'
      }, '-=0.3');
    */

    // Metrics counter animation
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach((metric) => {
      const finalValue = metric.textContent || '0';
      const numericValue = parseInt(finalValue.replace(/\D/g, ''));
      
      ScrollTrigger.create({
        trigger: metric,
        start: 'top 80%',
        onEnter: () => {
          gsap.from(metric, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            modifiers: {
              textContent: (value) => {
                const num = Math.round(parseFloat(value));
                return finalValue.replace(/\d+/, num.toString());
              }
            }
          });
        },
        once: true
      });
    });

    // Service cards 3D tilt
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card) => {
      card.addEventListener('mousemove', (e: any) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-bg-dark">
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 via-bg-dark to-accent-primary/10 z-[1]" />
        
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-[2]">
          <ErrorBoundary fallback={null}>
            <HeroCanvas />
          </ErrorBoundary>
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/50 z-[5]" />
        
        {/* Content Overlay */}
        <div className="relative z-10 h-full grid grid-cols-12 items-center">
          <div className="col-start-2 col-span-10 md:col-span-5">
            {/* Background panel for text */}
            <div className="absolute inset-0 -left-8 -right-8 bg-black/60 backdrop-blur-sm rounded-r-3xl md:rounded-none md:bg-transparent" />
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display leading-tight mb-6">
                <span className="hero-title inline-block font-bold text-white opacity-100" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)' }}>
                  Creative Developer
                </span>
                <br />
                <span className="hero-title inline-block font-bold opacity-100" style={{ color: '#00D9FF', textShadow: '0 4px 20px rgba(0,217,255,0.5), 0 2px 10px rgba(0,0,0,0.9)' }}>
                  Building Digital Experiences
                </span>
              </h1>
              <p className="hero-subtitle text-xl mb-8 max-w-lg text-white/95 opacity-100" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                Crafting immersive web experiences that push the boundaries of design and technology.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/work"
                  className="hero-cta inline-block px-8 py-4 bg-accent-primary text-black font-semibold rounded-full hover:bg-accent-hover transition-all transform hover:scale-105 shadow-lg opacity-100"
                >
                  View Work
                </Link>
                <Link
                  href="/contact"
                  className="hero-cta inline-block px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/30 shadow-lg opacity-100"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <ScrollIndicator />
      </section>

      {/* Impact Metrics */}
      <section className="py-20 bg-bg-section-1">
        <div className="container mx-auto px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center">
              <div className="metric-value text-5xl font-display text-accent-primary mb-2">
                50+
              </div>
              <p className="text-text-secondary">Projects Delivered</p>
            </div>
            <div className="text-center">
              <div className="metric-value text-5xl font-display text-accent-primary mb-2">
                98%
              </div>
              <p className="text-text-secondary">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="metric-value text-5xl font-display text-accent-primary mb-2">
                5+
              </div>
              <p className="text-text-secondary">Years Experience</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / Dashboard Section */}
      <section className="py-20 bg-bg-section-1 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Text Block - 40% width (2/5 columns) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <h2 className="text-5xl font-display mb-6">
                <span className="gradient-text">Crafting</span> Digital
                <br />
                Experiences
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                Full-stack developer specializing in creating immersive web experiences 
                that blend cutting-edge technology with thoughtful design.
              </p>
              
              {/* Skills Visualization */}
              <div className="space-y-4">
                <div className="skill-item">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Frontend Development</span>
                    <span className="text-sm text-accent-primary">95%</span>
                  </div>
                  <div className="h-2 bg-bg-card rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '95%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-accent-primary to-primary-base rounded-full"
                    />
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">3D Graphics & WebGL</span>
                    <span className="text-sm text-accent-primary">90%</span>
                  </div>
                  <div className="h-2 bg-bg-card rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '90%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-gradient-to-r from-accent-primary to-primary-base rounded-full"
                    />
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Backend & APIs</span>
                    <span className="text-sm text-accent-primary">85%</span>
                  </div>
                  <div className="h-2 bg-bg-card rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-gradient-to-r from-accent-primary to-primary-base rounded-full"
                    />
                  </div>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 flex gap-4"
              >
                <Link
                  href="/about"
                  className="px-6 py-3 bg-accent-primary text-black font-semibold rounded-full hover:bg-accent-hover transition-all transform hover:scale-105"
                >
                  Learn More
                </Link>
                <Link
                  href="/resume"
                  className="px-6 py-3 bg-bg-card text-white font-semibold rounded-full hover:bg-bg-section-2 transition-all border border-white/10"
                >
                  Download Resume
                </Link>
              </motion.div>
            </motion.div>

            {/* 3D Dashboard Scene - 60% width (3/5 columns) */}
            <div className="lg:col-span-3 h-[600px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-primary-base/10 rounded-2xl" />
              <div className="relative h-full rounded-2xl overflow-hidden">
                <Canvas
                  camera={{ position: [0, 0, 8], fov: 45 }}
                  className="bg-transparent"
                  dpr={[1, 2]}
                  gl={{ 
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                  }}
                >
                  <Suspense fallback={null}>
                    {/* Lighting setup */}
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[5, 5, 5]} intensity={0.6} castShadow />
                    <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00D9FF" />
                    <pointLight position={[5, -5, 5]} intensity={0.2} color="#A47864" />
                    
                    {/* Dashboard 3D Component */}
                    <Float
                      speed={1.5}
                      rotationIntensity={0.1}
                      floatIntensity={0.3}
                    >
                      <Dashboard3D />
                    </Float>
                    
                    <OrbitControls
                      enablePan={false}
                      enableZoom={false}
                      minPolarAngle={Math.PI / 3}
                      maxPolarAngle={Math.PI / 1.5}
                      autoRotate
                      autoRotateSpeed={0.5}
                    />
                  </Suspense>
                </Canvas>
                
                {/* Overlay Stats */}
                <div className="absolute top-8 left-8 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="glass-dark rounded-lg p-4"
                  >
                    <p className="text-sm text-text-muted mb-1">Lines of Code</p>
                    <p className="text-2xl font-mono text-accent-primary">1.2M+</p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="glass-dark rounded-lg p-4"
                  >
                    <p className="text-sm text-text-muted mb-1">Git Commits</p>
                    <p className="text-2xl font-mono text-highlight">5,000+</p>
                  </motion.div>
                </div>
                
                <div className="absolute bottom-8 right-8 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="glass-dark rounded-lg p-4"
                  >
                    <p className="text-sm text-text-muted mb-1">Tech Stack</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary rounded text-xs">React</span>
                      <span className="px-2 py-1 bg-primary-base/20 text-primary-base rounded text-xs">Three.js</span>
                      <span className="px-2 py-1 bg-highlight/20 text-highlight rounded text-xs">Next.js</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-display mb-4">Featured Work</h2>
              <p className="text-text-secondary">Recent projects that showcase creative excellence</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Link href={`/work/${project.slug}`}>
                    <div className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-bg-card">
                      {project.main_image && (
                        <Image
                          src={getMediaUrl(project.main_image.file)}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute bottom-0 p-6">
                          <h3 className="text-2xl font-display mb-2">{project.title}</h3>
                          <p className="text-text-secondary">{project.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/work"
                className="inline-block px-8 py-3 bg-bg-card rounded-full hover:bg-bg-section-2 transition-colors"
              >
                View All Projects
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services Preview */}
      {services.length > 0 && (
        <section className="py-20 bg-bg-section-1">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-display mb-4">What I Do</h2>
              <p className="text-text-secondary">Comprehensive services for digital excellence</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="service-card bg-bg-card rounded-xl p-8 hover:bg-bg-section-2 transition-colors transform-gpu"
                >
                  {service.icon_svg && (
                    <div 
                      className="w-12 h-12 mb-4 text-accent-primary"
                      dangerouslySetInnerHTML={{ __html: service.icon_svg }}
                    />
                  )}
                  <h3 className="text-2xl font-display mb-4">{service.title}</h3>
                  <div 
                    className="text-text-secondary line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: service.description_rich_text }}
                  />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/services"
                className="inline-block px-8 py-3 bg-accent-primary text-bg-dark rounded-full hover:bg-accent-hover transition-colors"
              >
                All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {latestPosts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-display mb-4">Latest Insights</h2>
              <p className="text-text-secondary">Thoughts on design, development, and digital innovation</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group">
                      <h3 className="text-xl font-display mb-2 group-hover:text-accent-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-text-secondary line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <span className="text-accent-primary">Read more →</span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-block px-8 py-3 bg-bg-card rounded-full hover:bg-bg-section-2 transition-colors"
              >
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-base to-accent-primary">
        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-display mb-4 text-bg-dark">Let's Create Something Amazing</h2>
            <p className="text-bg-dark/80 mb-8 max-w-2xl mx-auto">
              Ready to transform your ideas into exceptional digital experiences?
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-bg-dark text-text-primary rounded-full hover:bg-bg-section-1 transition-colors"
            >
              Start a Project
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}