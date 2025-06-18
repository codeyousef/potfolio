'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook for progressive reveal animations
export function useProgressiveReveal(selector: string = '.reveal-element') {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element) => {
      gsap.fromTo(element,
        {
          y: 100,
          opacity: 0,
          rotateY: -15,
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [selector]);
}

// Hook for parallax scrolling
export function useParallaxScroll(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    gsap.to(element, {
      yPercent: -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [speed]);

  return ref;
}

// Hook for text reveal animations
export function useTextReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const text = element.innerText;
    element.innerHTML = '';

    // Create spans for each word
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      element.appendChild(span);
    });

    const words = element.querySelectorAll('span');

    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return ref;
}

// Hook for scale animations on scroll
export function useScaleOnScroll() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.fromTo(element,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return ref;
}

// Hook for horizontal scroll sections
export function useHorizontalScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const container = containerRef.current;
    const track = trackRef.current;
    const slides = track.children;

    if (slides.length === 0) return;

    const slideWidth = (slides[0] as HTMLElement).offsetWidth;
    const totalWidth = slideWidth * slides.length;

    gsap.to(track, {
      x: -totalWidth + window.innerWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { containerRef, trackRef };
}

// Hook for sticky elements with progress tracking
export function useStickyProgress() {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || !progressRef.current) return;

    const element = ref.current;
    const progress = progressRef.current;

    ScrollTrigger.create({
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        gsap.to(progress, {
          scaleX: self.progress,
          duration: 0.1,
          ease: 'none',
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { ref, progressRef };
}

// Hook for magnetic cursor effect
export function useMagneticCursor() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = Math.max(rect.width, rect.height);
      
      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        gsap.to(element, {
          x: x * strength * 0.3,
          y: y * strength * 0.3,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
}