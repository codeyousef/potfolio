'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProjectDetailCanvas from '../../../components/canvases/ProjectDetailCanvas';

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  if (!slug) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-dark-gray text-brand-off-white"><p>Loading project or project not found...</p></div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark-gray text-brand-off-white">
      <ProjectDetailCanvas slug={slug} />
    </div>
  );
};

export default ProjectDetailPage;
