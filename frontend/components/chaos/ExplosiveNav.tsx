'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

interface NavItem {
  label: string;
  href: string;
  position: { x: string; y: string };
  rotation: number;
  scale: number;
  physics?: {
    mass: number;
    tension: number;
  };
  glitchOnHover?: boolean;
}

const navItems: NavItem[] = [
  { 
    label: 'HOME', 
    href: '/',
    position: { x: '5%', y: '5%' },
    rotation: 15,
    scale: 1.8,
    physics: { mass: 1, tension: 250 },
    glitchOnHover: true
  },
  { 
    label: 'WORK', 
    href: '/work',
    position: { x: '10%', y: '15%' },
    rotation: -23,
    scale: 1.5,
    physics: { mass: 2, tension: 180 }
  },
  { 
    label: 'WHO?', 
    href: '/about',
    position: { x: '85%', y: '8%' },
    rotation: 47,
    scale: 0.8,
    physics: { mass: 0.5, tension: 300 }
  },
  { 
    label: 'HIRE ME', 
    href: '/contact',
    position: { x: '73%', y: '82%' },
    rotation: -134,
    scale: 2.2,
    physics: { mass: 3, tension: 100 },
    glitchOnHover: true
  },
  { 
    label: '???', 
    href: '/secrets',
    position: { x: '45%', y: '92%' },
    rotation: 90,
    scale: 0.6,
    physics: { mass: 1, tension: 500 }
  },
  { 
    label: 'BLOG', 
    href: '/blog',
    position: { x: '20%', y: '70%' },
    rotation: 15,
    scale: 1.2,
    physics: { mass: 1.5, tension: 200 }
  },
  { 
    label: 'SERVICES', 
    href: '/services',
    position: { x: '92%', y: '45%' },
    rotation: -60,
    scale: 1.0,
    physics: { mass: 1, tension: 250 }
  }
];

export default function ExplosiveNav() {
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isExploded, setIsExploded] = useState(false);

  useEffect(() => {
    // Initial explosion animation
    const tl = gsap.timeline();
    
    tl.from(itemRefs.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: {
        amount: 0.3,
        from: 'random'
      },
      ease: 'elastic.out(1, 0.5)',
      onComplete: () => setIsExploded(true)
    });

    // Physics simulation for floating
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      
      const physics = navItems[index].physics || { mass: 1, tension: 200 };
      const floatAmount = 20 / physics.mass;
      const speed = physics.tension / 100;
      
      gsap.to(item, {
        y: `+=${floatAmount}`,
        x: `+=${floatAmount / 2}`,
        rotation: `+=${5}`,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2
      });
    });

    // Mouse repulsion effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!isExploded) return;
      
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        
        const rect = item.getBoundingClientRect();
        const itemX = rect.left + rect.width / 2;
        const itemY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - itemX, 2) + 
          Math.pow(e.clientY - itemY, 2)
        );
        
        if (distance < 150) {
          const angle = Math.atan2(itemY - e.clientY, itemX - e.clientX);
          const force = (150 - distance) / 150;
          const physics = navItems[index].physics || { mass: 1, tension: 200 };
          const pushAmount = force * 50 / physics.mass;
          
          gsap.to(item, {
            x: Math.cos(angle) * pushAmount,
            y: Math.sin(angle) * pushAmount,
            duration: 0.3,
            overwrite: 'auto'
          });
        } else {
          gsap.to(item, {
            x: 0,
            y: 0,
            duration: 0.5,
            overwrite: 'auto'
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isExploded]);

  const handleItemHover = (index: number, isHovering: boolean) => {
    const item = itemRefs.current[index];
    if (!item) return;
    
    if (navItems[index].glitchOnHover && isHovering) {
      item.classList.add('glitch');
      item.setAttribute('data-text', navItems[index].label);
    } else {
      item.classList.remove('glitch');
    }
    
    // Crazy hover animation
    gsap.to(item, {
      scale: isHovering ? navItems[index].scale * 1.2 : navItems[index].scale,
      rotation: isHovering ? navItems[index].rotation + 180 : navItems[index].rotation,
      duration: 0.3,
      ease: isHovering ? 'elastic.out(1, 0.3)' : 'power2.out'
    });
  };

  return (
    <nav ref={navRef} className="nav-explosion">
      {navItems.map((item, index) => (
        <Link
          key={item.label}
          href={item.href}
          ref={el => itemRefs.current[index] = el}
          className="nav-item"
          style={{
            left: item.position.x,
            top: item.position.y,
            transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
            fontSize: `${item.scale}rem`,
            color: index % 2 === 0 ? 'var(--violence-pink)' : 
                   index % 3 === 0 ? 'var(--toxic-green)' : 
                   'var(--warning-yellow)',
            '--rotation': `${item.rotation}deg`
          } as React.CSSProperties}
          onMouseEnter={() => handleItemHover(index, true)}
          onMouseLeave={() => handleItemHover(index, false)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}