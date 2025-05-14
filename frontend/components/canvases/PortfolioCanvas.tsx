'use client';

import React, { useEffect } from 'react';
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

const PortfolioCanvas: React.FC = () => { 
  useEffect(() => {
    console.log('PortfolioCanvas mounted');
    
    // Apply media query for responsive grid
    const updateGrid = () => {
      const projectsContainer = document.getElementById('projects-grid');
      if (projectsContainer) {
        if (window.innerWidth < 640) {
          projectsContainer.style.gridTemplateColumns = '1fr';
        } else if (window.innerWidth < 1024) {
          projectsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
          projectsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
      }
    };

    // Initial call
    updateGrid();
    
    // Add resize listener
    window.addEventListener('resize', updateGrid);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateGrid);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full text-center p-4 pt-16 overflow-y-auto" 
         style={{ paddingBottom: '100px' }}>
      <h1 style={{ 
        fontFamily: 'var(--font-montserrat, sans-serif)',
        fontWeight: 600, 
        fontSize: '2rem',
        color: '#3b82f6',
        marginBottom: '2rem',
        lineHeight: 1.2
      }}>
        Portfolio Showcase
      </h1>
      
      {/* Projects Grid Container */}
      <div 
        id="projects-grid"
        style={{ 
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          padding: '0 8px',
          margin: '0 auto'
        }}
      >
        {mockProjects.map((project) => (
          <div
            key={project.id}
            style={{ 
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: '#000',
              border: '1px solid #333',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              height: '240px',
              position: 'relative',
              transition: 'transform 0.2s ease-in-out, border-color 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#333';
            }}
          >
            <Link href={`/portfolio/${project.id}`} style={{
              display: 'block',
              width: '100%',
              height: '100%',
              textDecoration: 'none'
            }}>
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Project Info Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ overflow: 'hidden', textAlign: 'left' }}>
                    <h3 style={{
                      margin: 0,
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {project.title}
                    </h3>
                    <p style={{
                      margin: '2px 0 0 0',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px'
                    }}>
                      {project.category}
                    </p>
                  </div>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#3b82f6',
                    whiteSpace: 'nowrap'
                  }}>
                    View Project
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioCanvas;
