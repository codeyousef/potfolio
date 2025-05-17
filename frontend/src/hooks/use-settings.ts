import { useState, useEffect, useCallback } from 'react';
import { Settings, getSettings, updateSettings as updateSettingsApi } from '@/lib/services/settings-service';
import { useToast } from '@/components/ui/use-toast';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    try {
      setIsSaving(true);
      const updatedSettings = await updateSettingsApi(newSettings);
      setSettings(prev => ({
        ...prev,
        ...updatedSettings,
      }));
      
      toast({
        title: 'Success',
        description: 'Settings updated successfully.',
      });
      
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    isSaving,
    updateSettings,
    refreshSettings: fetchSettings,
  };
}
