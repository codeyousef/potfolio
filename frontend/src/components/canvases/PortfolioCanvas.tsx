import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import ProjectSculpture from '../portfolio/ProjectSculpture';
import ParticleAccent from '../effects/ParticleAccent';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { DirectusProject } from '../../types/directus';

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
  const { projects, isLoading } = useAethelframeStore();
  const [arrangedProjects, setArrangedProjects] = useState<any[]>([]);

  useEffect(() => {
    if (projects.length > 0) {
      setArrangedProjects(arrangeProjects(projects));
    }
  }, [projects]);

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

        {isLoading.projects ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">No projects found.</p>
          </div>
        ) : (
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
        )}
      </div>
    </KineticCanvasWrapper>
  );
};

export default PortfolioCanvas;
