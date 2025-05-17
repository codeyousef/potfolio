import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { directus } from '@/lib/directus/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        const response = await directus.items('projects').readOne(id, {
          fields: [
            'id',
            'title',
            'slug',
            'status',
            'description_short',
            'description_long',
            'featured',
            'date_published',
            'live_url',
            'github_url',
            'tags',
          ],
        });
        setProject(response);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-4">{error}</h2>
          <Button onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/projects')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <h1 className="text-2xl font-bold">Edit Project</h1>
      </div>
      <ProjectForm 
        project={project} 
        onSuccess={() => navigate('/admin/projects')}
      />
    </div>
  );
}
