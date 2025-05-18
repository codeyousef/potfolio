import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProjectBySlug } from '@/lib/directus';
import type { DirectusProject } from '@/types/directus';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log('ProjectDetail - slug:', slug); // Debug log

  const { data: project, isLoading, error } = useQuery<DirectusProject | null>({
    queryKey: ['project', slug],
    queryFn: async () => {
      if (!slug) {
        console.error('No slug provided in URL');
        return null;
      }
      
      console.log('Fetching project with slug:', slug);
      
      try {
        const project = await getProjectBySlug(slug);
        console.log('Fetched project:', project);
        
        if (!project) {
          console.error('Project not found for slug:', slug);
          return null;
        }
        
        return project;
      } catch (err) {
        console.error('Error fetching project:', err);
        return null;
      }
    },
  });

  // Log the project data when it changes
  useEffect(() => {
    if (project) {
      console.log('Project data loaded:', project);
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-gray-400 mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const directusUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
  const mainImageUrl = project.main_image && typeof project.main_image === 'object' && project.main_image.id 
    ? `${directusUrl}/assets/${project.main_image.id}?width=1200` 
    : null;

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <motion.article 
          className="max-w-4xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies?.map((tech) => (
                <span 
                  key={tech.id} 
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tech.name}
                </span>
              ))}
            </div>
            {project.project_url && (
              <a 
                href={project.project_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                View Live Project →
              </a>
            )}
          </header>

          {mainImageUrl && (
            <motion.div 
              className="mb-12 rounded-lg overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src={mainImageUrl} 
                alt={project.title} 
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </motion.div>
          )}

          <div className="prose prose-invert max-w-none">
            {project.description_rich_text ? (
              <div dangerouslySetInnerHTML={{ __html: project.description_rich_text }} />
            ) : (
              <p className="text-gray-400">{project.description || 'No description available.'}</p>
            )}
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.gallery.map((image) => {
                  if (typeof image !== 'object' || !image.id) return null;
                  const galleryImageUrl = `${directusUrl}/assets/${image.id}?width=600`;
                  return (
                    <motion.div 
                      key={image.id}
                      className="overflow-hidden rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <img 
                        src={galleryImageUrl} 
                        alt={`${project.title} gallery`} 
                        className="w-full h-64 object-cover"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
