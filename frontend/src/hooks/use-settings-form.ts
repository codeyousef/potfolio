import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from './use-settings';
import { Settings } from '@/lib/services/settings-service';

const settingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required'),
  site_description: z.string().min(1, 'Site description is required'),
  contact_email: z.string().email('Please enter a valid email address'),
  social_links: z.object({
    twitter: z.string().url('Please enter a valid URL').or(z.literal('')),
    github: z.string().url('Please enter a valid URL').or(z.literal('')),
    linkedin: z.string().url('Please enter a valid URL').or(z.literal('')),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export function useSettingsForm() {
  const { toast } = useToast();
  const { settings, isLoading, isSaving, updateSettings } = useSettings();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: '',
      site_description: '',
      contact_email: '',
      social_links: {
        twitter: '',
        github: '',
        linkedin: '',
      },
    },
    values: settings || undefined,
  });

  // Reset form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await updateSettings(data);
      
      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });
      
      return true;
    } catch (error) {
      console.error('Error in form submission:', error);
      return false;
    }
  };

  return {
    form,
    isLoading,
    isSaving,
    onSubmit,
  };
}
