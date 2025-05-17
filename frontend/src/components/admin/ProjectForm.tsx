import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { directus } from '@/lib/directus/client';
import { useToast } from '@/components/ui/use-toast';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  status: z.enum(['draft', 'published', 'archived']),
  description_short: z.string().optional(),
  description_long: z.string().optional(),
  featured: z.boolean().default(false),
  date_published: z.string().optional(),
  live_url: z.string().url('Must be a valid URL').or(z.literal('')),
  github_url: z.string().url('Must be a valid URL').or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = {
  project?: ProjectFormValues & { id?: string };
  onSuccess?: () => void;
};

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatingSlug, setGeneratingSlug] = useState(false);
  const isEditing = !!project?.id;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      status: project?.status || 'draft',
      description_short: project?.description_short || '',
      description_long: project?.description_long || '',
      featured: project?.featured || false,
      date_published: project?.date_published || new Date().toISOString().split('T')[0],
      live_url: project?.live_url || '',
      github_url: project?.github_url || '',
      tags: project?.tags || [],
    },
  });

  const generateSlug = (title: string) => {
    if (!title) return '';
    
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleGenerateSlug = (title: string) => {
    if (!title) return;
    
    try {
      setGeneratingSlug(true);
      const slug = generateSlug(title);
      form.setValue('slug', slug, { shouldValidate: true });
    } catch (error) {
      console.error('Error generating slug:', error);
    } finally {
      setGeneratingSlug(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title) {
        const slug = form.getValues('slug');
        const generatedSlug = generateSlug(value.title);
        
        // Only update slug if it's empty or matches the generated slug
        if (!slug || slug === generatedSlug) {
          form.setValue('slug', generatedSlug, { shouldValidate: true });
        }
      }
    });
    
    return () => {
      if (typeof subscription === 'function') {
        subscription();
      } else if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [form]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setLoading(true);
      
      if (isEditing && project?.id) {
        // Update existing project
        await directus.items('projects').updateOne(project.id, data);
        toast({
          title: 'Success',
          description: 'Project updated successfully',
        });
      } else {
        // Create new project
        await directus.items('projects').createOne(data);
        toast({
          title: 'Success',
          description: 'Project created successfully',
        });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/projects');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-6 text-lg font-medium">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="My Awesome Project"
                    {...form.register('title')}
                    disabled={loading}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        const title = form.getValues('title');
                        if (title) {
                          form.setValue('slug', generateSlug(title), { shouldValidate: true });
                        }
                      }}
                      disabled={generatingSlug}
                    >
                      {generatingSlug ? 'Generating...' : 'Generate from title'}
                    </Button>
                  </div>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                      /projects/
                    </span>
                    <Input
                      id="slug"
                      className="rounded-l-none"
                      placeholder="my-awesome-project"
                      {...form.register('slug')}
                      disabled={loading}
                    />
                  </div>
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.slug.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_short">Short Description</Label>
                  <Textarea
                    id="description_short"
                    placeholder="A brief description of your project"
                    className="min-h-[100px]"
                    {...form.register('description_short')}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_long">Long Description</Label>
                  <Textarea
                    id="description_long"
                    placeholder="A detailed description of your project"
                    className="min-h-[200px]"
                    {...form.register('description_long')}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-6 text-lg font-medium">Project Links</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input
                    id="live_url"
                    type="url"
                    placeholder="https://example.com"
                    {...form.register('live_url')}
                    disabled={loading}
                  />
                  {form.formState.errors.live_url && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.live_url.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    type="url"
                    placeholder="https://github.com/username/repo"
                    {...form.register('github_url')}
                    disabled={loading}
                  />
                  {form.formState.errors.github_url && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.github_url.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-6 text-lg font-medium">Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value: 'draft' | 'published' | 'archived') =>
                      form.setValue('status', value)
                    }
                    value={form.watch('status')}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Featured</Label>
                    <p className="text-sm text-muted-foreground">
                      Show this project in featured section
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={form.watch('featured')}
                    onCheckedChange={(checked) =>
                      form.setValue('featured', checked)
                    }
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Publish Date</Label>
                  <Input
                    type="datetime-local"
                    {...form.register('date_published')}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-medium">Actions</h2>
              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {projectId ? 'Update Project' : 'Create Project'}
                    </>
                  )}
                </Button>

                {projectId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                    disabled={loading}
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this project?')) {
                        try {
                          setLoading(true);
                          await directus.items('projects').deleteOne(projectId);
                          toast({
                            title: 'Success',
                            description: 'Project deleted successfully',
                          });
                          router.push('/admin/projects');
                          router.refresh();
                        } catch (error) {
                          console.error('Error deleting project:', error);
                          toast({
                            title: 'Error',
                            description: 'Failed to delete project',
                            variant: 'destructive',
                          });
                        } finally {
                          setLoading(false);
                        }
                      }
                    }}
                  >
                    Delete Project
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
