import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import ProjectSculpture from '../portfolio/ProjectSculpture';
import ParticleAccent from '../effects/ParticleAccent';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { DirectusProject } from '../../types/directus';
import { useNavigate } from 'react-router-dom';

const arrangeProjects = (projects: DirectusProject[]) => {
  // For a more interesting layout, we'll position projects in a scattered arrangement
  // Use a fixed arrangement for the first 4 projects, and a grid for any additional ones
  const arrangements = [
    { initialX: -250, initialY: -100, initialScale: 1, initialRotate: -3 },
    { initialX: 250, initialY: -50, initialScale: 0.9, initialRotate: 2 },
    { initialX: -200, initialY: 150, initialScale: 0.95, initialRotate: 1 },
    { initialX: 220, initialY: 180, initialScale: 1.05, initialRotate: -2 },
  ];

  return projects.slice(0, 4).map((project, index) => ({
    project,
    ...arrangements[index % arrangements.length]
  }));
};

const PortfolioCanvas = () => {
  const { 
    projects, 
    isLoading, 
    currentProjectTechStack, 
    currentProjectTag, 
    setProjectTechStack, 
    setProjectTag,
    projectPagination,
    setProjectPage
  } = useAethelframeStore();
  const [arrangedProjects, setArrangedProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (projects.length > 0) {
      setArrangedProjects(arrangeProjects(projects));
    }
  }, [projects]);

  // Extract all unique tech stacks from projects
  const allTechStacks = Array.from(
    new Set(
      projects
        .flatMap(project => project.tech_stack || [])
        .filter(Boolean)
    )
  );

  // Extract all unique tags from projects
  const allTags = Array.from(
    new Set(
      projects
        .flatMap(project => project.tags || [])
        .filter(Boolean)
    )
  );

  // Handle tech stack click
  const handleTechStackClick = (tech_stack: string | null) => {
    console.log('handleTechStackClick called with tech_stack:', tech_stack);
    setProjectTechStack(tech_stack);
  };

  // Handle tag click
  const handleTagClick = (tag: string | null) => {
    console.log('handleTagClick called with tag:', tag);
    setProjectTag(tag);
  };

  const titleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.76, 0, 0.24, 1] 
      }
    }
  };

  return (
    <KineticCanvasWrapper id="portfolio">
      <ParticleAccent count={20} />

      <div className="canvas-content-wrapper items-center justify-center text-center p-6">
        <motion.h2 
          className="page-title"
          variants={titleVariants}
          initial="initial"
          animate="animate"
        >
          Selected Works
        </motion.h2>

        {/* Tech Stack filters */}
        <motion.div 
          className="filter-section mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm text-gray-400 mb-2">Filter by Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button 
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentProjectTechStack === null 
                  ? 'bg-highlight-color text-black font-medium' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => handleTechStackClick(null)}
            >
              All Tech Stacks
            </button>

            {allTechStacks.map(tech => (
              <button 
                key={tech}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  currentProjectTechStack === tech 
                    ? 'bg-highlight-color text-black font-medium' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                onClick={() => handleTechStackClick(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tag filters */}
        <motion.div 
          className="filter-section mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm text-gray-400 mb-2">Filter by Tag</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button 
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentProjectTag === null 
                  ? 'bg-highlight-color text-black font-medium' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => handleTagClick(null)}
            >
              All Tags
            </button>

            {allTags.map(tag => (
              <button 
                key={tag}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  currentProjectTag === tag 
                    ? 'bg-highlight-color text-black font-medium' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading.projects ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">
              {currentProjectTechStack || currentProjectTag 
                ? `No projects found with the selected filters.` 
                : "No projects found."}
            </p>
          </div>
        ) : (
          <>
            <div className="portfolio-space">
              {arrangedProjects.map((item) => (
                <ProjectSculpture
                  key={item.project.id}
                  project={item.project}
                  initialX={item.initialX}
                  initialY={item.initialY}
                  initialScale={item.initialScale}
                  initialRotate={item.initialRotate}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {projectPagination.totalPages > 1 && (
              <div className="pagination-controls flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setProjectPage(1)}
                  disabled={!projectPagination.hasPrevious}
                  className={`pagination-button px-3 py-1 rounded ${
                    projectPagination.hasPrevious
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                      : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
                  }`}
                >
                  First
                </button>

                <button
                  onClick={() => setProjectPage(projectPagination.currentPage - 1)}
                  disabled={!projectPagination.hasPrevious}
                  className={`pagination-button px-3 py-1 rounded ${
                    projectPagination.hasPrevious
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                      : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-400">
                  Page {projectPagination.currentPage} of {projectPagination.totalPages}
                </span>

                <button
                  onClick={() => setProjectPage(projectPagination.currentPage + 1)}
                  disabled={!projectPagination.hasNext}
                  className={`pagination-button px-3 py-1 rounded ${
                    projectPagination.hasNext
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                      : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>

                <button
                  onClick={() => setProjectPage(projectPagination.totalPages)}
                  disabled={!projectPagination.hasNext}
                  className={`pagination-button px-3 py-1 rounded ${
                    projectPagination.hasNext
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                      : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
                  }`}
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </KineticCanvasWrapper>
  );
};

export default PortfolioCanvas;
