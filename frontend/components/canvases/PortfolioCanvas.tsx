'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergence } from '@/context/EmergenceContext';

// Define types for our data
interface ProjectItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  year: string;
  description?: string;
  tags?: string[];
}

const PortfolioCanvas: React.FC = () => {
  const { currentPhase } = useEmergence();
  
  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Mock data - would be fetched from Directus in production
  const mockProjects: ProjectItem[] = [
    {
      id: '1',
      title: 'Emergence Protocol',
      category: 'Web Design',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
      year: '2023',
      description: 'A responsive web application with dynamic content and interactive elements.',
      tags: ['React', 'TypeScript', 'Tailwind']
    },
    {
      id: '2',
      title: 'Kinetic Interface',
      category: 'UI/UX',
      imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766',
      year: '2023',
      description: 'Innovative user interface design with motion and interaction principles.',
      tags: ['Figma', 'Framer', 'Prototyping']
    },
    {
      id: '3',
      title: 'Horizon Framework',
      category: 'Development',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      year: '2022',
      description: 'A versatile framework for building scalable web applications.',
      tags: ['JavaScript', 'Node.js', 'API']
    },
    {
      id: '4',
      title: 'Bloom Analytics',
      category: 'Data Visualization',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      year: '2022',
      description: 'Interactive data visualization dashboard with real-time updates.',
      tags: ['D3.js', 'SVG', 'Data']
    },
    {
      id: '5',
      title: 'Veil Security',
      category: 'Cybersecurity',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
      year: '2021',
      description: 'Advanced security protocols and encryption methods for sensitive data.',
      tags: ['Security', 'Encryption', 'Auth']
    },
    {
      id: '6',
      title: 'Unfurling Platform',
      category: 'Web Design',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      year: '2021',
      description: 'A comprehensive platform for content management and distribution.',
      tags: ['CMS', 'Content', 'Design']
    },
  ];

  // Extract unique categories and years for filters
  const categories = [...new Set(mockProjects.map(project => project.category))];
  const years = [...new Set(mockProjects.map(project => project.year))].sort((a, b) => parseInt(b) - parseInt(a));

  // Filter projects based on selected categories and years
  useEffect(() => {
    let filtered = [...mockProjects];
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(project => selectedCategories.includes(project.category));
    }
    
    if (selectedYears.length > 0) {
      filtered = filtered.filter(project => selectedYears.includes(project.year));
    }
    
    setFilteredProjects(filtered);
  }, [selectedCategories, selectedYears]);

  // Initialize filtered projects with all projects
  useEffect(() => {
    setFilteredProjects(mockProjects);
  }, []);

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle year selection
  const toggleYear = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // View project details
  const viewProjectDetails = (project: ProjectItem) => {
    setSelectedProject(project);
  };

  // Close project details
  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  // Phase-specific classes and styles
  const getPhaseStyles = () => {
    const baseButtonClass = "px-4 py-2 rounded-sm font-mono text-sm transition-all duration-300";
    const baseFilterClass = "px-3 py-1 rounded-sm text-xs mr-2 mb-2 font-mono transition-all duration-300";
    const baseTitleClass = "text-3xl md:text-5xl font-heading tracking-wide mb-6";
    const baseTagClass = "text-xs px-2 py-1 rounded-sm mr-2 font-mono";
    
    switch (currentPhase) {
      case 'seed':
        return {
          container: "p-6 md:p-8 my-8",
          title: `${baseTitleClass} text-seed-accent`,
          button: `${baseButtonClass} border border-seed-accent text-seed-accent hover:bg-seed-accent/10`,
          filterButton: {
            active: `${baseFilterClass} bg-seed-accent/20 text-seed-accent border border-seed-accent/60`,
            inactive: `${baseFilterClass} bg-transparent text-neutral-400 border border-neutral-700 hover:text-seed-accent hover:border-seed-accent/40`
          },
          projectCard: "bg-black/30 rounded-md overflow-hidden transition-all duration-300 border border-neutral-900 hover:border-seed-accent/40",
          tag: `${baseTagClass} bg-seed-accent/10 text-seed-accent/90`,
          overlay: "bg-black/70"
        };
      case 'growth':
        return {
          container: "p-6 md:p-8 my-8",
          title: `${baseTitleClass} text-growth-accent`,
          button: `${baseButtonClass} border border-growth-accent text-growth-accent hover:bg-growth-accent/10`,
          filterButton: {
            active: `${baseFilterClass} bg-growth-accent/20 text-growth-accent border border-growth-accent/60`,
            inactive: `${baseFilterClass} bg-transparent text-neutral-400 border border-neutral-700 hover:text-growth-accent hover:border-growth-accent/40`
          },
          projectCard: "bg-black/30 rounded-md overflow-hidden transition-all duration-300 border border-neutral-900 hover:border-growth-accent/40",
          tag: `${baseTagClass} bg-growth-accent/10 text-growth-accent/90`,
          overlay: "bg-black/60"
        };
      case 'bloom':
        return {
          container: "p-6 md:p-8 my-8",
          title: `${baseTitleClass} text-bloom-accent`,
          button: `${baseButtonClass} border border-bloom-accent text-bloom-accent hover:bg-bloom-accent/10`,
          filterButton: {
            active: `${baseFilterClass} bg-bloom-accent/20 text-bloom-accent border border-bloom-accent/60`,
            inactive: `${baseFilterClass} bg-transparent text-neutral-400 border border-neutral-700 hover:text-bloom-accent hover:border-bloom-accent/40`
          },
          projectCard: "bg-black/20 rounded-md overflow-hidden transition-all duration-300 border border-neutral-800 hover:border-bloom-accent/40",
          tag: `${baseTagClass} bg-bloom-accent/10 text-bloom-accent/90`,
          overlay: "bg-black/50"
        };
      default:
        return {
          container: "p-6 md:p-8 my-8",
          title: baseTitleClass,
          button: baseButtonClass,
          filterButton: {
            active: `${baseFilterClass} bg-gray-700 text-white`,
            inactive: `${baseFilterClass} bg-transparent text-gray-400 border border-gray-700`
          },
          projectCard: "bg-black/30 rounded-md overflow-hidden transition-all duration-300 border border-neutral-900",
          tag: baseTagClass,
          overlay: "bg-black/70"
        };
    }
  };

  const styles = getPhaseStyles();

  // Animation variants - adjusted for phases
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: currentPhase === 'bloom' ? 0.5 : 0.7,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: currentPhase === 'seed' ? 0.15 : currentPhase === 'growth' ? 0.1 : 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: currentPhase === 'bloom' ? 0.6 : 0.8,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      }
    }
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: "auto", 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className={`min-h-screen ${styles.container}`}>
      <motion.h2 
        className={styles.title}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.2,
          ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
        }}
      >
        Portfolio
      </motion.h2>

      {/* Filter Toggle Button */}
      <motion.button
        className={styles.button}
        onClick={toggleFilters}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="mr-2">{showFilters ? '−' : '+'}</span>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </motion.button>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="mt-4 overflow-hidden"
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="p-5 border border-neutral-800 rounded-md bg-black/20">
              {/* Categories Filter */}
              <div className="mb-4">
                <div className="text-sm font-mono mb-2 text-neutral-400">Categories</div>
                <div className="flex flex-wrap mt-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={
                        selectedCategories.includes(category)
                          ? styles.filterButton.active
                          : styles.filterButton.inactive
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Years Filter */}
              <div>
                <div className="text-sm font-mono mb-2 text-neutral-400">Years</div>
                <div className="flex flex-wrap mt-2">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => toggleYear(year)}
                      className={
                        selectedYears.includes(year)
                          ? styles.filterButton.active
                          : styles.filterButton.inactive
                      }
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProjects.map(project => (
          <motion.div
            key={project.id}
            className={styles.projectCard}
            variants={itemVariants}
            whileHover={{ 
              y: currentPhase === 'seed' ? -5 : currentPhase === 'growth' ? -8 : -10,
              transition: { 
                duration: 0.3,
                ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1] 
              }
            }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute top-2 right-2 px-2 py-1 text-xs font-mono bg-black/70 rounded-sm">
                {project.year}
              </div>
              <div className={`absolute inset-0 opacity-0 hover:opacity-100 ${styles.overlay} transition-opacity duration-300 flex items-center justify-center`}>
                <button 
                  onClick={() => viewProjectDetails(project)}
                  className={styles.button}
                >
                  View Project
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-heading tracking-wider mb-1">{project.title}</h3>
              <div className="text-sm font-mono text-neutral-400 mb-3">{project.category}</div>
              {project.description && (
                <p className="text-sm mb-4 text-neutral-300 line-clamp-2">{project.description}</p>
              )}
              <div className="flex justify-between items-end">
                <div className="flex flex-wrap">
                  {project.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                  {project.tags && project.tags.length > 2 && (
                    <span className="text-xs px-2 py-1 font-mono text-neutral-400">+{project.tags.length - 2}</span>
                  )}
                </div>
                <button 
                  onClick={() => viewProjectDetails(project)}
                  className="text-xs font-mono flex items-center gap-1 transition-colors duration-300"
                >
                  Details
                  <svg 
                    className="w-3 h-3" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M5 12H19M19 12L12 5M19 12L12 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={closeProjectDetails}
          >
            <motion.div 
              className="bg-black/90 border border-neutral-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-md"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img 
                  src={selectedProject.imageUrl} 
                  alt={selectedProject.title} 
                  className="w-full h-64 md:h-80 object-cover"
                />
                <button 
                  onClick={closeProjectDetails}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center"
                >
                  <svg 
                    className="w-4 h-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M18 6L6 18M6 6L18 18" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-heading tracking-wider">{selectedProject.title}</h2>
                  <div className="px-2 py-1 text-xs font-mono bg-black/70 rounded-sm">{selectedProject.year}</div>
                </div>
                <div className="text-sm font-mono text-neutral-400 mb-4">{selectedProject.category}</div>
                <p className="text-base mb-6">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags?.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <button className={styles.button}>
                  Visit Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact CTA */}
      <motion.div 
        className="mt-12 p-6 border border-neutral-800 rounded-md bg-black/30 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className={`text-xl md:text-2xl font-heading mb-3 ${
          currentPhase === 'seed' 
            ? 'text-seed-accent' 
            : currentPhase === 'growth' 
              ? 'text-growth-accent' 
              : 'text-bloom-accent'
        }`}>
          Interested in working together?
        </h3>
        <p className="text-neutral-300 mb-6 max-w-xl mx-auto">
          Let's discuss how we can bring your vision to life
        </p>
        <button className={styles.button}>Get in Touch</button>
      </motion.div>
    </div>
  );
};

export default PortfolioCanvas;
