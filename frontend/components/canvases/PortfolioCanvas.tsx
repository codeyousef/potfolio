'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectItem[]>([]);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: "auto", 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="portfolio-container">
      <motion.h2 
        className="portfolio-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Portfolio
      </motion.h2>

      {/* Filter Toggle Button */}
      <motion.button
        className="filter-toggle-button"
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
            className="filter-container"
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="filter-content">
              {/* Categories Filter */}
              <div className="mb-4">
                <div className="filter-label">Categories</div>
                <div className="flex flex-wrap mt-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`filter-button ${
                        selectedCategories.includes(category)
                          ? 'filter-button-active'
                          : 'filter-button-inactive'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Years Filter */}
              <div>
                <div className="filter-label">Years</div>
                <div className="flex flex-wrap mt-2">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => toggleYear(year)}
                      className={`filter-button ${
                        selectedYears.includes(year)
                          ? 'filter-button-active'
                          : 'filter-button-inactive'
                      }`}
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
        className="projects-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProjects.map(project => (
          <motion.div
            key={project.id}
            className="project-card"
            variants={itemVariants}
            whileHover={{ y: -8 }}
          >
            <div className="project-image-container">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="project-image"
              />
              <div className="project-year-badge">
                {project.year}
              </div>
              <div className="project-overlay">
                <button className="project-cta-button">
                  View Project
                </button>
              </div>
            </div>
            <div className="project-content">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-category">{project.category}</div>
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              <div className="project-footer">
                <div className="project-tags">
                  {project.tags?.map(tag => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
                <div className="project-view-details">
                  Details
                  <svg 
                    className="project-view-details-arrow" 
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
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Contact CTA */}
      <motion.div 
        className="contact-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="contact-cta-title">Interested in working together?</h3>
        <p className="contact-cta-description">Let's discuss how we can bring your vision to life</p>
        <button className="contact-cta-button">Get in Touch</button>
      </motion.div>
    </div>
  );
};

export default PortfolioCanvas;
