'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/api';

interface Project {
  id: string;
  title: string;
  description: string;
  description_rich_text: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  main_image?: {
    file: string;
    alt_text: string;
  };
  status: string;
  slug: string;
}

interface CorruptedProjectCardProps {
  project: Project;
  corruptionSeed: number;
  systemHealth: number;
}

// Generate corrupted data based on project and seed
const generateCorruptedData = (project: Project, seed: number): string => {
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const lines = [];
  
  // Generate corrupted memory addresses
  for (let i = 0; i < 8; i++) {
    const addr = (0x1000 + seed + i * 0x100).toString(16).toUpperCase();
    let data = '';
    for (let j = 0; j < 32; j++) {
      data += chars[Math.floor(Math.random() * chars.length)];
    }
    lines.push(`0x${addr}: ${data}`);
  }
  
  // Inject fragments of real data
  const fragments = [
    `PROJ_NAME: ${project.title.split('').map(c => Math.random() > 0.7 ? chars[Math.floor(Math.random() * chars.length)] : c).join('')}`,
    `STATUS: ${Math.random() > 0.5 ? 'CLASSIFIED' : 'CORRUPTED'}`,
    `TECH: ${project.tech_stack[0] || 'UNKNOWN'}.${Math.random() > 0.5 ? 'exe' : 'dll'}`,
    `MEM_LEAK: ${Math.floor(Math.random() * 1000)}KB/s`,
    `BREACH_LVL: ${Math.floor(Math.random() * 10)}/10`
  ];
  
  fragments.forEach((fragment, i) => {
    const position = Math.floor(Math.random() * (lines.length - 1));
    lines.splice(position, 0, fragment);
  });
  
  return lines.join('\n');
};

export default function CorruptedProjectCard({ project, corruptionSeed, systemHealth }: CorruptedProjectCardProps) {
  const [isCorrupted, setIsCorrupted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  
  const corruptedData = useMemo(() => 
    generateCorruptedData(project, corruptionSeed), 
    [project, corruptionSeed]
  );

  useEffect(() => {
    // More corruption when system health is low
    if (systemHealth < 50) {
      const interval = setInterval(() => {
        setGlitchIntensity(Math.random());
        setTimeout(() => setGlitchIntensity(0), 200);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [systemHealth]);

  return (
    <motion.div 
      className="relative group"
      onMouseEnter={() => {
        setIsCorrupted(false);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsCorrupted(true);
        setIsHovered(false);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Terminal window */}
      <div 
        className="p-6 font-mono relative overflow-hidden"
        style={{ 
          backgroundColor: '#000000',
          border: '1px solid #00FF41',
          boxShadow: isHovered ? '0 0 30px #00FF41' : '0 0 10px #00FF41',
          filter: glitchIntensity > 0 ? `hue-rotate(${glitchIntensity * 360}deg)` : 'none'
        }}
      >
        {/* Window decoration */}
        <div className="flex items-center mb-4 text-xs">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF0040' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFAA00' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00FF41' }} />
          </div>
          <div className="ml-4" style={{ color: '#008F11' }}>
            /projects/{project.slug}.exe
          </div>
        </div>
        
        {/* Content */}
        <div className="relative min-h-[200px]">
          {/* Corrupted state */}
          <AnimatePresence>
            {isCorrupted && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <pre className="text-sm overflow-hidden whitespace-pre-wrap" style={{ color: '#00FF41' }}>
                  {corruptedData}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Clean state */}
          <AnimatePresence>
            {!isCorrupted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <h3 className="text-2xl mb-2" style={{ color: '#00D4FF' }}>
                  {project.title}
                </h3>
                <p className="mb-4" style={{ color: '#FFFFFF' }}>
                  {project.description}
                </p>
                
                {/* Tech stack as running processes */}
                <div className="text-xs mb-4" style={{ color: '#00FF41' }}>
                  <div>RUNNING PROCESSES:</div>
                  {project.tech_stack.map((tech, i) => (
                    <div key={tech}>
                      PID {Math.floor(1000 + i * 137)} - {tech}.exe - 
                      {Math.floor(Math.random() * 100)}% CPU
                    </div>
                  ))}
                </div>
                
                {/* Status */}
                <div style={{ color: '#FFAA00' }}>
                  STATUS: {project.status === 'published' ? 'OPERATIONAL' : 'CLASSIFIED'}
                </div>
                
                {/* Links */}
                <div className="mt-4 flex gap-4">
                  {project.github_url && (
                    <a 
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                      style={{ color: '#00FF41' }}
                    >
                      [VIEW SOURCE]
                    </a>
                  )}
                  {project.live_url && (
                    <a 
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                      style={{ color: '#00D4FF' }}
                    >
                      [BREACH SYSTEM]
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `linear-gradient(0deg, transparent 0%, #00FF41 50%, transparent 100%)`,
            height: '2px',
            top: '0',
            animation: 'scanlines 3s linear infinite'
          }}
        />
      </div>
      
      {/* 3D hologram preview on hover */}
      {!isCorrupted && project.main_image && (
        <motion.div 
          className="absolute -top-4 -right-4 w-48 h-48 pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <div className="relative w-full h-full">
            <Image
              src={getMediaUrl(project.main_image.file)}
              alt={project.main_image.alt_text}
              fill
              className="object-cover"
              style={{
                filter: 'hue-rotate(120deg) saturate(2)',
                opacity: 0.8,
                clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)'
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, #00FF41 50%, transparent 70%)',
                animation: 'hologramScan 2s linear infinite'
              }}
            />
          </div>
        </motion.div>
      )}
      
      <style jsx>{`
        @keyframes hologramScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
}