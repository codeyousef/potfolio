import React from 'react';
import Image from 'next/image';
import { getProjects } from '../../lib/api';
import MainLayout from '../../components/layout/MainLayout';
import ProjectCard from '../../components/ui/ProjectCard';
import CanvasTransition from '../../components/layout/CanvasTransition';

async function getPortfolioData() {
  // Fetch projects from Strapi with population of relationships
  const projects = await getProjects({
    populate: ['coverImage', 'categories', 'services'],
    sort: ['createdAt:desc'],
  });
  
  return {
    projects: projects.data,
  };
}

export default async function PortfolioPage() {
  const { projects } = await getPortfolioData();
  
  return (
    <MainLayout>
      <CanvasTransition isVisible={true} phase="growth">
        <div className="mb-16">
          <h1 className="font-montserrat font-light text-4xl md:text-5xl text-center tracking-wide mt-12 mb-2">
            Atelier
          </h1>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            A curated collection of projects that embody the Emergence aesthetic, 
            where design, technology, and narrative converge.
          </p>
          
          {/* Projects grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={{
                    id: project.id,
                    title: project.attributes.title,
                    slug: project.attributes.slug,
                    description: project.attributes.description || '',
                    coverImage: {
                      url: project.attributes.galleryImages?.data?.[0]?.attributes?.url || '/placeholder-project.jpg',
                      width: project.attributes.galleryImages?.data?.[0]?.attributes?.width || 1200,
                      height: project.attributes.galleryImages?.data?.[0]?.attributes?.height || 800,
                      alternativeText: project.attributes.galleryImages?.data?.[0]?.attributes?.alternativeText || project.attributes.title
                    },
                    categories: project.attributes.categories?.data?.map(cat => ({
                      id: cat.id,
                      name: cat.attributes.name,
                      slug: cat.attributes.slug
                    })) || [],
                    services: project.attributes.services?.data?.map(service => ({
                      id: service.id,
                      title: service.attributes.title,
                      slug: service.attributes.slug
                    })) || []
                  }}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-sm p-8 mt-8">
              <p className="text-gray-400 font-['Roboto_Mono'] text-sm">No projects found</p>
              <p className="text-gray-500 text-xs mt-2">Projects will appear here once added to your CMS</p>
            </div>
          )}
        </div>
      </CanvasTransition>
    </MainLayout>
  );
}
