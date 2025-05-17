import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useSettingsForm } from '@/hooks/use-settings-form';
import { getFieldError } from '@/lib/utils';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { form, isLoading, isSaving, onSubmit } = useSettingsForm();
  
  if (isLoading) {
    // This will be handled by the loading.tsx file
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your portfolio settings and preferences
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Update your portfolio's general information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                {...form.register('site_name')}
                placeholder="My Portfolio"
                disabled={isSaving}
              />
              {form.formState.errors.site_name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.site_name.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                {...form.register('site_description')}
                placeholder="A brief description of your portfolio"
                rows={3}
                disabled={isSaving}
              />
              {form.formState.errors.site_description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.site_description.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                {...form.register('contact_email')}
                placeholder="contact@example.com"
                disabled={isSaving}
              />
              {form.formState.errors.contact_email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.contact_email.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Add or update your social media profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="social_links.twitter">Twitter</Label>
              <Input
                id="social_links.twitter"
                {...form.register('social_links.twitter')}
                placeholder="https://twitter.com/username"
                disabled={isSaving}
              />
              {form.formState.errors.social_links?.twitter && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.social_links.twitter.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social_links.github">GitHub</Label>
              <Input
                id="social_links.github"
                {...form.register('social_links.github')}
                placeholder="https://github.com/username"
                disabled={isSaving}
              />
              {form.formState.errors.social_links?.github && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.social_links.github.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="social_links.linkedin">LinkedIn</Label>
              <Input
                id="social_links.linkedin"
                {...form.register('social_links.linkedin')}
                placeholder="https://linkedin.com/in/username"
                disabled={isSaving}
              />
              {form.formState.errors.social_links?.linkedin && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.social_links.linkedin.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
