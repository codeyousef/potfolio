'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { DirectusProject, DirectusFile } from './ProjectSculpture';

interface ProjectDetailCanvasProps {
  project: DirectusProject | null;
  directusAssetBaseUrl: string;
}

const ProjectDetailCanvas: React.FC<ProjectDetailCanvasProps> = ({ project, directusAssetBaseUrl }) => {
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen text-brand-off-white bg-brand-dark-gray">
        <p>Project data is not available.</p>
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

  const getFullImageUrl = (imageAsset: DirectusFile | string | undefined, presetKey?: string): string => {
    if (!imageAsset) return '/placeholder-project-detail.jpg';
    const imageId = typeof imageAsset === 'string' ? imageAsset : imageAsset.id;
    const queryParams = presetKey ? `?key=${presetKey}` : '?fit=cover&width=1200&height=675&quality=80';
    return `${directusAssetBaseUrl}/assets/${imageId}${queryParams}`;
  };

  const mainImageUrl = getFullImageUrl(project.main_image, 'project-detail-hero');
  const mainImageAlt = typeof project.main_image === 'object' && project.main_image?.title 
    ? project.main_image.title 
    : project.title || 'Project main image';

  const longDescriptionHtml = project.long_description_html || project.description;

  return (
    <motion.div 
      className="min-h-screen bg-brand-dark-gray text-brand-off-white selection:bg-primary-accent selection:text-brand-pure-white"
      initial={{ opacity: 0}}
      animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' }}}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' }}}
    >
      <header className="relative h-[60vh] md:h-[70vh] w-full">
        <Image
          src={mainImageUrl}
          alt={mainImageAlt}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-gray via-brand-dark-gray/70 to-transparent" />
        <motion.div 
          className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16"
          custom={0} variants={sectionVariants} initial="hidden" animate="visible"
        >
          <Link href="/portfolio#portfolio-grid" scroll={false} className="font-inter text-sm text-primary-accent hover:underline mb-2 inline-block">
            &larr; Return to Portfolio
          </Link>
          <h1 className="font-montserrat font-bold text-4xl md:text-6xl lg:text-7xl text-brand-off-white leading-tight tracking-tight">
            {project.title}
          </h1>
          <p className="font-inter text-lg md:text-xl text-brand-off-white/80 mt-2">
            {project.category} {project.year && `/ ${project.year}`}
          </p>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto p-8 md:p-12 lg:p-16">
        {project.description && (
          <motion.section custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
            <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-brand-off-white mb-4">Overview</h2>
            <div 
              className="font-inter text-brand-off-white/90 leading-relaxed text-base md:text-lg prose prose-invert prose-neutral lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br />') }}
            />
          </motion.section>
        )}

        {longDescriptionHtml && project.description !== longDescriptionHtml && (
          <motion.section custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
            <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-brand-off-white mb-4">The Story</h2>
            <div 
              className="font-inter text-brand-off-white/90 leading-relaxed text-base md:text-lg prose prose-invert prose-neutral lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: longDescriptionHtml.replace(/\n/g, '<br />') }}
            />
          </motion.section>
        )}

        {project.gallery_images && project.gallery_images.length > 0 && (
          <motion.section custom={2.5} variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
            <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-brand-off-white mb-4">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.gallery_images.map((imageItem, index) => {
                const galleryImg = imageItem.directus_files_id;
                if (!galleryImg) return null;
                const galleryImageUrl = getFullImageUrl(galleryImg, 'project-gallery-thumb');
                const galleryImageAlt = typeof galleryImg === 'object' && galleryImg.title ? galleryImg.title : `${project.title} gallery image ${index + 1}`;
                return (
                  <div key={typeof galleryImg === 'string' ? galleryImg : galleryImg.id} className="relative aspect-video rounded overflow-hidden shadow-lg">
                    <Image 
                      src={galleryImageUrl}
                      alt={galleryImageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {project.tech_stack && project.tech_stack.length > 0 && (
          <motion.section custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="mb-12">
            <h2 className="font-montserrat font-semibold text-2xl md:text-3xl text-brand-off-white mb-4">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map(tech => (
                <span key={tech} className="bg-primary-accent/10 text-primary-accent px-3 py-1.5 rounded-full text-xs sm:text-sm font-inter font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>
        )}
        
        {(project.live_url || project.repo_url) && (
            <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible" className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                {project.live_url && project.live_url !== '#' && (
                    <Link 
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full sm:w-auto text-center font-montserrat text-lg bg-primary-accent text-brand-pure-white px-8 py-3 rounded-md hover:bg-primary-accent/80 transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        View Live Project
                    </Link>
                )}
                {project.repo_url && project.repo_url !== '#' && (
                     <Link 
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full sm:w-auto text-center font-montserrat text-lg bg-transparent border border-primary-accent text-primary-accent px-8 py-3 rounded-md hover:bg-primary-accent/10 transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                        View Repository
                    </Link>
                )}
            </motion.div>
        )}

      </main>
      
      <footer className="text-center p-8 border-t border-brand-off-white/10 mt-16">
        <Link href="/portfolio#portfolio-grid" scroll={false} className="font-inter text-sm text-primary-accent hover:underline">
            &larr; Back to The Portfolio
        </Link>
        <p className="text-xs text-brand-off-white/50 mt-2">Aethelframe Protocol &copy; {new Date().getFullYear()}</p>
      </footer>
    </motion.div>
  );
};

export default ProjectDetailCanvas;
