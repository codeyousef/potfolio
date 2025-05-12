'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Service {
  id: number;
  title: string;
  slug: string;
}

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    slug: string;
    description: string;
    coverImage: {
      url: string;
      width: number;
      height: number;
      alternativeText?: string;
    };
    categories?: Category[];
    services?: Service[];
  };
  index: number;
}

/**
 * ProjectCard component that follows the "Emergence" theme from the Aethelframe Protocol
 * Implements the "Kinetic Frames" concept with hover animations and transitions
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Staggered animation for grid items
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
        delay: index * 0.1
      }
    }
  };

  // Title animation on hover
  const titleVariants = {
    rest: { 
      y: 0,
    },
    hover: { 
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Category tags animation
  const tagsVariants = {
    rest: { 
      opacity: 0.7,
      y: 5
    },
    hover: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    }
  };

  // Image scale on hover
  const imageVariants = {
    rest: { 
      scale: 1,
    },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.7,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group"
    >
      <Link href={`/portfolio/${project.slug}`}>
        <motion.article
          className="relative overflow-hidden rounded-sm bg-gray-900 hover:bg-gray-800 transition-colors duration-500"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial="rest"
          animate={isHovered ? "hover" : "rest"}
        >
          {/* Project Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <motion.div
              variants={imageVariants}
              className="w-full h-full"
            >
              <Image
                src={project.coverImage.url}
                alt={project.coverImage.alternativeText || project.title}
                width={project.coverImage.width}
                height={project.coverImage.height}
                className="object-cover object-center w-full h-full"
              />
            </motion.div>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-70" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <motion.h3 
              variants={titleVariants}
              className="font-montserrat text-xl font-light mb-2 tracking-wide"
            >
              {project.title}
            </motion.h3>
            
            {/* Categories */}
            {project.categories && project.categories.length > 0 && (
              <motion.div 
                variants={tagsVariants}
                className="flex flex-wrap gap-2 mt-3"
              >
                {project.categories.map(category => (
                  <motion.span
                    key={category.id}
                    className="text-xs px-2 py-1 rounded-sm bg-black bg-opacity-50 text-gray-300"
                  >
                    {category.name}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
