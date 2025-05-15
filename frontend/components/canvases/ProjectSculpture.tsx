import Image from 'next/image';
import React from 'react';

// Interface for a Directus file object (simplified)
export interface DirectusFile {
  id: string;
  title?: string;
  filename_disk?: string;
  // Add other relevant fields like width, height, description if needed
}

// Interface for a Directus project item
export interface DirectusProject {
  id: string;
  status: string; // e.g., 'published', 'draft'
  title: string;
  slug?: string;
  category?: string;
  year?: string;
  description?: string;
  main_image?: DirectusFile | string; // Can be a file object or just an ID
  tech_stack?: string[];
  tags?: string[];
  live_url?: string;
  repo_url?: string;
  long_description_html?: string; // For rich text content from Directus
  gallery_images?: { directus_files_id: DirectusFile | string }[]; // For a gallery relationship
  // any other fields from your Directus collection
}

// Interface for a Directus journal entry
export interface DirectusJournalEntry {
  id: string;
  status: string; // e.g., 'published', 'draft'
  title: string;
  slug: string; // For dynamic routing
  publication_date?: string; // ISO date string
  excerpt?: string; // A short summary
  content_rich_text?: string; // Main content, likely HTML from WYSIWYG
  featured_image?: DirectusFile | string; // Can be a file object or just an ID
  tags?: string[];
  // any other fields from your JournalEntries collection
}

// Interface for a Directus service item
export interface DirectusService {
  id: string;
  status: string; // e.g., 'published'
  title: string;
  description_rich_text?: string; // Main content, likely HTML from WYSIWYG
  icon_svg?: string; // Field to store SVG content directly or an ID to an icon file
  featured_image?: DirectusFile | string; // Optional image for the service
  // any other fields from your Services collection
}

interface ProjectSculptureProps {
  project: DirectusProject;
  directusAssetBaseUrl: string;
}

const ProjectSculpture: React.FC<ProjectSculptureProps> = ({ project, directusAssetBaseUrl }) => {
  const imageUrl = project.main_image
    ? `${directusAssetBaseUrl}/assets/${typeof project.main_image === 'string' ? project.main_image : project.main_image.id}?key=portfolio-thumb&fit=cover&width=400&height=225` // Optimized preset
    : '/placeholder-project.jpg'; // Fallback image

  const mainImageAlt = typeof project.main_image === 'object' && project.main_image?.title 
    ? project.main_image.title 
    : project.title || 'Project image';

  return (
    <div className="group bg-neutral-800/60 border border-neutral-700/80 rounded-lg overflow-hidden shadow-lg h-full flex flex-col transition-all duration-300 hover:shadow-primary-accent/40 hover:border-primary-accent/60 hover:bg-neutral-800">
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={mainImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          priority={false} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold font-heading text-neutral-100 mb-1 truncate group-hover:text-primary-accent transition-colors duration-300" title={project.title}>
          {project.title}
        </h3>
        <p className="text-xs font-mono text-primary-accent/90 mb-2">
          {project.category} {project.year && `| ${project.year}`}
        </p>
        {project.description && (
          <p className="text-sm text-neutral-300 mb-3 line-clamp-2 flex-grow">
            {project.description.substring(0, 100) + (project.description.length > 100 ? '...' : '')}
          </p>
        )}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 3).map(tech => (
              <span key={tech} className="inline-block bg-neutral-700/80 text-neutral-300 text-xs font-mono px-2 py-0.5 rounded-full">
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 3 && (
                <span className="inline-block text-neutral-400 text-xs font-mono px-2 py-0.5 rounded-full">
                    +{project.tech_stack.length - 3} more
                </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSculpture;
