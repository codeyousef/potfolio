'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Mock data type
interface ProjectItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  year: string;
}

// Mock project data
const mockProjects: ProjectItem[] = [
  { id: '1', title: 'Project Alpha', category: 'Web Design', imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', year: '2023' },
  { id: '2', title: 'System Beta', category: 'Branding', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', year: '2022' },
  { id: '3', title: 'Initiative Gamma', category: 'Interactive Art', imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', year: '2024' },
  { id: '4', title: 'Delta Framework', category: 'UX/UI', imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', year: '2023' },
  { id: '5', title: 'Epsilon Launch', category: 'Development', imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', year: '2024' },
  { id: '6', title: 'Zeta Synthesis', category: 'Creative Coding', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', year: '2022' },
];

const AtelierCanvas: React.FC = () => {
  const titleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.4, // Existing delay for title
      },
    },
  };

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.7, // Delay after title is visible
      },
    },
  };

  const projectItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start h-full w-full text-center p-8 pt-16 md:pt-24 overflow-y-auto" // Added more top padding, allow scroll
    >
      <motion.h1
        className="font-montserrat font-semibold text-5xl md:text-7xl lg:text-8xl text-primary-accent leading-tight tracking-tight mb-12 md:mb-16"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        The Atelier.
      </motion.h1>
      
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl px-2 md:px-4"
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {mockProjects.map((project) => (
          <Link key={project.id} href={`/portfolio/${project.id}`} passHref legacyBehavior>
            <motion.div
              className="group relative overflow-hidden rounded-md shadow-lg bg-neutral-800 cursor-pointer aspect-[4/3]"
              variants={projectItemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-700 ease-in-out mix-blend-luminosity group-hover:mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                <h3 className="font-montserrat text-lg md:text-xl font-medium text-white drop-shadow-sm">
                  {project.title}
                </h3>
                <p className="font-inter text-xs md:text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-300">
                  {project.category} - {project.year}
                </p>
              </div>
              {/* Subtle hint for interaction, always visible at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/30 group-hover:bg-black/0 transition-all duration-500 ease-in-out flex justify-between items-center">
                <h3 className="font-montserrat text-base font-medium text-white/90 group-hover:text-white">
                  {project.title}
                </h3>
                <span className='font-inter text-xs text-gray-400 group-hover:text-primary-accent'>View Details</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AtelierCanvas;
