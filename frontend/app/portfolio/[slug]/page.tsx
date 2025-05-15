'use client';

import React from 'react';
import ProjectDetailCanvas from '../../../components/canvases/ProjectDetailCanvas';
import { getProjectBySlug } from '../../../lib/directus'; // Adjust path as necessary
import { notFound } from 'next/navigation';

interface ProjectDetailPageProps {
  params: { slug: string };
}

const directusAssetBaseUrl = process.env.NEXT_PUBLIC_API_URL;

// Revalidate data at most every hour, or on-demand via webhook
export const revalidate = 3600; 

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  return {
    title: `${project.title} | Portfolio`,
    description: project.description || `Details for the project: ${project.title}`,
    // Add more metadata like openGraph images if desired
    // openGraph: {
    //   images: project.main_image ? [`${directusAssetBaseUrl}/assets/${typeof project.main_image === 'string' ? project.main_image : project.main_image.id}?key=og-image`] : [],
    // },
  };
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = async ({ params }) => {
  const slug = params.slug;

  if (!directusAssetBaseUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined. Cannot display project assets.");
    // Optionally, render an error state or fallback
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark-gray text-brand-off-white">
        <p>Configuration error. Site admin has been notified.</p>
      </div>
    );
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound(); // Triggers the not-found.tsx UI or Next.js default 404 page
  }

  return (
    <div className="min-h-screen bg-brand-dark-gray text-brand-off-white">
      <ProjectDetailCanvas project={project} directusAssetBaseUrl={directusAssetBaseUrl} />
    </div>
  );
};

export default ProjectDetailPage;
