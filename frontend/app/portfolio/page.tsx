import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import PortfolioCanvas from '@/components/canvases/PortfolioCanvas';

// We'll replace the direct API calls with a data fetcher function that works with Directus
async function getPortfolioData() {
  // In a production environment, this would fetch from Directus CMS
  // For now, we'll return mock data that matches our expected format
  
  // This structure mimics what we'd expect from Directus
  const mockProjects = [
    {
      id: '1',
      attributes: {
        title: 'Modern E-commerce Platform',
        slug: 'modern-ecommerce',
        description: 'A cutting-edge e-commerce solution with headless architecture',
        galleryImages: {
          data: [
            {
              attributes: {
                url: '/images/projects/ecommerce.jpg',
                width: 1200,
                height: 800,
                alternativeText: 'E-commerce platform showcase'
              }
            }
          ]
        },
        categories: {
          data: [
            {
              id: '1',
              attributes: {
                name: 'Web Development',
                slug: 'web-development'
              }
            },
            {
              id: '2',
              attributes: {
                name: 'UI/UX Design',
                slug: 'ui-ux-design'
              }
            }
          ]
        },
        services: {
          data: [
            {
              id: '1',
              attributes: {
                title: 'Frontend Development',
                slug: 'frontend-development'
              }
            },
            {
              id: '2',
              attributes: {
                title: 'Design System',
                slug: 'design-system'
              }
            }
          ]
        }
      }
    },
    {
      id: '2',
      attributes: {
        title: 'Financial Dashboard',
        slug: 'financial-dashboard',
        description: 'Interactive data visualization for financial analytics',
        galleryImages: {
          data: [
            {
              attributes: {
                url: '/images/projects/dashboard.jpg',
                width: 1200,
                height: 800,
                alternativeText: 'Financial dashboard interface'
              }
            }
          ]
        },
        categories: {
          data: [
            {
              id: '1',
              attributes: {
                name: 'Web Development',
                slug: 'web-development'
              }
            },
            {
              id: '3',
              attributes: {
                name: 'Data Visualization',
                slug: 'data-visualization'
              }
            }
          ]
        },
        services: {
          data: [
            {
              id: '3',
              attributes: {
                title: 'Interactive Visualization',
                slug: 'interactive-visualization'
              }
            }
          ]
        }
      }
    },
    {
      id: '3',
      attributes: {
        title: 'Minimalist Publishing Platform',
        slug: 'minimalist-publishing',
        description: 'Clean, distraction-free platform for writers and creators',
        galleryImages: {
          data: [
            {
              attributes: {
                url: '/images/projects/publishing.jpg',
                width: 1200,
                height: 800,
                alternativeText: 'Publishing platform preview'
              }
            }
          ]
        },
        categories: {
          data: [
            {
              id: '1',
              attributes: {
                name: 'Web Development',
                slug: 'web-development'
              }
            },
            {
              id: '4',
              attributes: {
                name: 'Content Management',
                slug: 'content-management'
              }
            }
          ]
        },
        services: {
          data: [
            {
              id: '4',
              attributes: {
                title: 'CMS Development',
                slug: 'cms-development'
              }
            },
            {
              id: '5',
              attributes: {
                title: 'User Experience Design',
                slug: 'ux-design'
              }
            }
          ]
        }
      }
    }
  ];
  
  return {
    projects: mockProjects,
  };
}

export default async function PortfolioPage() {
  const { projects } = await getPortfolioData();
  
  return (
    <MainLayout>
      <PortfolioCanvas projects={projects} />
    </MainLayout>
  );
}
