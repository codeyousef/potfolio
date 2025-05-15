'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergence } from '@/context/EmergenceContext';
import { getPublishedProjects } from '@/lib/directus'; // Import function to fetch projects
import { DirectusProject } from '@/components/canvases/ProjectSculpture'; // Import DirectusProject type

const PortfolioCanvas: React.FC = () => {
  const { currentPhase } = useEmergence();
  const directusAssetBaseUrl = process.env.NEXT_PUBLIC_API_URL; // For image URLs

  // State for projects, loading, and errors
  const [projects, setProjects] = useState<DirectusProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<DirectusProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<DirectusProject | null>(null);

  // Fetch projects from Directus
  useEffect(() => {
    if (!directusAssetBaseUrl) {
      setError("NEXT_PUBLIC_API_URL is not set. Cannot fetch projects.");
      setIsLoading(false);
      return;
    }

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await getPublishedProjects();
        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects); // Initialize filteredProjects
        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects.");
        setProjects([]);
        setFilteredProjects([]);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, [directusAssetBaseUrl]);

  // Extract unique categories and years for filters from fetched projects
  const categories = [...new Set(projects.map(project => project.category || 'Uncategorized'))];
  const years = [...new Set(projects.map(project => project.year || 'Unknown Year'))].sort((a, b) => {
    const yearA = parseInt(a);
    const yearB = parseInt(b);
    if (isNaN(yearA) && isNaN(yearB)) return 0;
    if (isNaN(yearA)) return 1; // Push 'Unknown Year' or non-numeric years to the end
    if (isNaN(yearB)) return -1;
    return yearB - yearA;
  });

  // Filter projects based on selected categories and years
  useEffect(() => {
    let filtered = [...projects]; // Start with all fetched projects
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(project => project.category && selectedCategories.includes(project.category));
    }
    
    if (selectedYears.length > 0) {
      filtered = filtered.filter(project => project.year && selectedYears.includes(project.year));
    }
    
    setFilteredProjects(filtered);
  }, [selectedCategories, selectedYears, projects]); // Depend on projects state now

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
  const viewProjectDetails = (project: DirectusProject) => {
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
        <p className={`text-neutral-400 text-lg ${styles.title.replace(/text-(3xl|5xl|heading|tracking-wide|mb-6)/g, '')}`}>
          Loading Atelier...
        </p>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
        <p className={`text-red-500 text-lg ${styles.title.replace(/text-(3xl|5xl|heading|tracking-wide|mb-6)/g, '')}`}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className={`relative ${styles.container}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Title */}
      <motion.h1 
        className={styles.title}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Atelier.
      </motion.h1>

      {/* Filters Toggle Button */}
      <div className="flex justify-center mb-6">
        <button onClick={toggleFilters} className={styles.button}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="mb-8 p-4 bg-black/20 rounded-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <h3 className={`text-lg font-semibold mb-2 ${styles.title.split(' ')[1]}`}>Categories</h3>
              <div className="flex flex-wrap">
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={selectedCategories.includes(category) ? styles.filterButton.active : styles.filterButton.inactive}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${styles.title.split(' ')[1]}`}>Years</h3>
              <div className="flex flex-wrap">
                {years.map(year => (
                  <button 
                    key={year}
                    onClick={() => toggleYear(year)}
                    className={selectedYears.includes(year) ? styles.filterButton.active : styles.filterButton.inactive}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      {error && projects.length > 0 && (
        <div className="text-center text-red-400 mb-6">
          <p>{error} Displaying cached or limited data.</p>
        </div>
      )}
      {!isLoading && !error && projects.length === 0 && (
        <div className="text-center text-neutral-400 mt-10">
          <p>No projects found matching your criteria, or the atelier is currently empty.</p>
        </div>
      )}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {filteredProjects.map((project, index) => {
          // Construct image URL from Directus asset ID
          const imageUrl = project.main_image && typeof project.main_image === 'object' && project.main_image.id 
            ? `${directusAssetBaseUrl}/assets/${project.main_image.id}?key=portfolio-thumb` // Added a key for potential transformations
            : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'; // Default placeholder

          return (
            <motion.div 
              key={project.id} 
              className={styles.projectCard}
              onClick={() => viewProjectDetails(project)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            >
              <div className="aspect-[4/3] bg-neutral-800 overflow-hidden">
                <img src={imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h2 className={`text-xl font-semibold mb-1 ${styles.title.split(' ')[1]}`}>{project.title}</h2>
                <p className="text-sm text-neutral-400 mb-2">{project.category} - {project.year}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${styles.overlay}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectDetails} // Close on overlay click
          >
            <motion.div 
              className={`bg-neutral-900 p-6 rounded-lg shadow-2xl max-w-2xl w-full relative border ${styles.projectCard.replace(/hover:[^ ]+/, '')}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
            >
              <button 
                onClick={closeProjectDetails} 
                className={`absolute top-3 right-3 text-2xl ${styles.title.split(' ')[1]} hover:opacity-70 transition-opacity`}
              >
                &times;
              </button>
              <h2 className={`text-3xl font-bold mb-3 ${styles.title.split(' ')[1]}`}>{selectedProject.title}</h2>
              <p className="text-sm text-neutral-400 mb-3">{selectedProject.category} - {selectedProject.year}</p>
              {
                selectedProject.main_image && typeof selectedProject.main_image === 'object' && selectedProject.main_image.id && (
                  <div className="w-full h-64 md:h-80 rounded-md overflow-hidden mb-4 bg-neutral-800">
                    <img 
                      src={`${directusAssetBaseUrl}/assets/${selectedProject.main_image.id}?key=portfolio-detail`}
                      alt={selectedProject.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              }
              <p className="text-neutral-300 mb-4 whitespace-pre-wrap">
                {selectedProject.description || 'No description available.'}
              </p>
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="flex flex-wrap">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PortfolioCanvas;
