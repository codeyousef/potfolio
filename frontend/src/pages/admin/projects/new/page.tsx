import { ProjectForm } from '@/components/admin/ProjectForm';
import { useNavigate } from 'react-router-dom';

export default function NewProjectPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Project</h1>
      </div>
      <ProjectForm 
        onSuccess={() => navigate('/admin/projects')} 
      />
    </div>
  );
}
