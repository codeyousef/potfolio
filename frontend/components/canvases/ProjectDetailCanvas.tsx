'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Re-using mock data structure from AtelierCanvas for now
interface ProjectItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  year: string;
  description?: string; // Added for detail view
  longDescription?: string[];
  techStack?: string[];
  liveUrl?: string;
}

// Expanded mock project data (ensure IDs match those in AtelierCanvas if direct linking)
const mockProjectsData: ProjectItem[] = [
  { id: '1', title: 'Project Alpha', category: 'Web Design', imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', year: '2023', description: 'A cutting-edge web experience for a leading tech innovator.', longDescription: ['Detailed paragraph 1 about Alpha. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Detailed paragraph 2 about Alpha. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'], techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Directus'], liveUrl: '#' },
  { id: '2', title: 'System Beta', category: 'Branding', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', year: '2022', description: 'A comprehensive branding strategy for a disruptive startup.', longDescription: ['More details about System Beta...'], techStack: ['Illustrator', 'Photoshop', 'Figma'], liveUrl: '#' },
  { id: '3', title: 'Initiative Gamma', category: 'Interactive Art', imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', year: '2024', description: 'An immersive art installation exploring digital consciousness.', longDescription: ['Exploring the depths of Initiative Gamma...'], techStack: ['Processing', 'Unity', 'TouchDesigner'] },
  { id: '4', title: 'Delta Framework', category: 'UX/UI', imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', year: '2023', description: 'A user-centric design framework for enterprise applications.' },
  { id: '5', title: 'Epsilon Launch', category: 'Development', imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', year: '2024', description: 'Full-stack development of a scalable e-commerce platform.' },
  { id: '6', title: 'Zeta Synthesis', category: 'Creative Coding', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80', year: '2022', description: 'Generative visuals and soundscapes for a live performance.' },
];

interface ProjectDetailCanvasProps {
  slug: string;
}

const ProjectDetailCanvas: React.FC<ProjectDetailCanvasProps> = ({ slug }) => {
  const [project, setProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const foundProject = mockProjectsData.find(p => p.id === slug);
    setProject(foundProject || null);
  }, [slug]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen text-brand-off-white bg-brand-dark-gray">
        <p>Loading project details or project not found...</p>
      </div>
    );
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
    }),
  };

  return (
    <motion.div 
      className="min-h-screen bg-brand-dark-gray text-brand-off-white selection:bg-primary-accent selection:text-brand-pure-white"
      initial={{ opacity: 0}}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' }}}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' }}}
    >
      <header className="relative h-[60vh] md:h-[70vh] w-full">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-gray via-brand-dark-gray/70 to-transparent" />
        <motion.div 
          className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16"
          custom={0} variants={sectionVariants} initial="hidden" animate="visible"
        >
          <Link href="/#portfolio" scroll={false} className="font-inter text-sm text-primary-accent hover:underline mb-2 inline-block">
            &larr; Return to Portfolio
          </Link>
          <h1 className="font-montserrat font-bold text-4xl md:text-6xl lg:text-7xl text-brand-off-white leading-tight tracking-tight">
            {project.title}
          </h1>
          <p className="font-inter text-lg md:text-xl text-brand-off-white/80 mt-2">
            {project.category} / {project.year}
          </p>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto p-8 md:p-12 lg:p-16">
        <motion.section custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
          <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-brand-off-white mb-4">Overview</h2>
          <p className="font-inter text-brand-off-white/90 leading-relaxed text-base md:text-lg">
            {project.description || 'Detailed description coming soon.'}
          </p>
        </motion.section>

        {project.longDescription && (
          <motion.section custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
            <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-brand-off-white mb-4">The Story</h2>
            {project.longDescription.map((paragraph, index) => (
              <p key={index} className="font-inter text-brand-off-white/90 leading-relaxed text-base md:text-lg mb-4">
                {paragraph}
              </p>
            ))}
          </motion.section>
        )}

        {project.techStack && project.techStack.length > 0 && (
          <motion.section custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
            <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-brand-off-white mb-4">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="bg-primary-accent/10 text-primary-accent px-3 py-1.5 rounded-full text-xs sm:text-sm font-inter font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>
        )}
        
        {project.liveUrl && project.liveUrl !== '#' && (
            <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible" className="mt-12 text-center">
                <Link 
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-montserrat text-lg bg-primary-accent text-brand-pure-white px-8 py-3 rounded-md hover:bg-primary-accent/80 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                    View Live Project
                </Link>
            </motion.div>
        )}

      </main>
      
      <footer className="text-center p-8 border-t border-brand-off-white/10 mt-16">
        <Link href="/#portfolio" scroll={false} className="font-inter text-sm text-primary-accent hover:underline">
            &larr; Back to The Portfolio
        </Link>
        <p className="text-xs text-brand-off-white/50 mt-2">Aethelframe Protocol &copy; {new Date().getFullYear()}</p>
      </footer>
    </motion.div>
  );
};

export default ProjectDetailCanvas;
