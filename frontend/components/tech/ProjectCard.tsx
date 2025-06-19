'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import ProjectPreview3D from './ProjectPreview3D';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  type: string;
  tech: string[];
  metrics: Array<{ label: string; value: string }>;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
  delay?: number;
}

export default function ProjectCard({ project, className = '', delay = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass Card Container */}
      <div className="glass-panel h-full p-8 cursor-pointer overflow-hidden project-card">
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 bg-gradient-radial opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 30% 40%, var(--ai-blue) 0%, transparent 50%)`
          }}
        />
        
        {/* 3D Preview Window */}
        <div className="relative h-64 mb-6 rounded-lg overflow-hidden bg-deep-space">
          <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={0.8} />
            <Suspense fallback={null}>
              <ProjectPreview3D project={project} isActive={isHovered} />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Project Info */}
        <div className="relative z-10">
          <div className="flex items-center mb-3">
            <span className="text-xs neural-mono" style={{ color: 'var(--ai-blue)' }}>
              {project.category}
            </span>
            <span className="mx-2 text-neural-white/20">•</span>
            <span className="text-xs text-neural-white/60">{project.year}</span>
          </div>
          
          <h3 className="text-2xl font-light mb-3">{project.title}</h3>
          <p className="text-neural-white/60 mb-6 leading-relaxed">{project.description}</p>
          
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map(tech => (
              <span 
                key={tech} 
                className="px-3 py-1 text-xs rounded-full border neural-mono"
                style={{
                  backgroundColor: 'var(--glass-white)',
                  borderColor: 'var(--glass-border)'
                }}
              >
                {tech}
              </span>
            ))}
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {project.metrics.map(metric => (
              <div key={metric.label}>
                <div className="text-2xl font-light" style={{ color: 'var(--ai-blue)' }}>
                  {metric.value}
                </div>
                <div className="text-xs text-neural-white/40">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Hover State - View Project */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: 'rgba(5, 5, 5, 0.9)' }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center pointer-events-auto">
            <svg 
              className="w-12 h-12 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: 'var(--ai-blue)' }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
            <span className="text-lg">View Project</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}