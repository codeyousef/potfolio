'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ProjectDetailCanvas from '../../../components/canvases/ProjectDetailCanvas';
import { CanvasProvider } from '../../../context/CanvasContext'; 

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  if (!slug) {
    return <p>Loading project or project not found...</p>;
  }

  return (
    <CanvasProvider initialActiveCanvas={null}> 
      <div className="min-h-screen bg-background text-text">
        <ProjectDetailCanvas slug={slug} />
      </div>
    </CanvasProvider>
  );
};

export default ProjectDetailPage;
