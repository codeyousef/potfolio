'use client';

import { useState, useEffect } from 'react';
import { projectsAPI, journalAPI, servicesAPI, Project, JournalEntry, Service, PaginatedResponse } from '@/lib/api';

// Generic hook for paginated data
function usePaginatedData<T>(
  fetcher: (params: any) => Promise<PaginatedResponse<T>>,
  params?: any
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetcher({ ...params, page });
        
        if (page === 1) {
          setData(response.results);
        } else {
          setData(prev => [...prev, ...response.results]);
        }
        
        setHasMore(!!response.next);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, params?.tech_stack, params?.tag, params?.category]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return { data, loading, error, hasMore, loadMore };
}

// Hook for single item data
function useSingleData<T>(
  fetcher: (slug: string) => Promise<T>,
  slug: string | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetcher(slug);
        setData(response);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return { data, loading, error };
}

// Projects hooks
export function useProjects(params?: {
  tech_stack?: string;
  tag?: string;
  category?: string;
}) {
  return usePaginatedData<Project>(projectsAPI.getPublished, params);
}

export function useProject(slug: string | null) {
  return useSingleData<Project>(projectsAPI.getBySlug, slug);
}

// Journal hooks
export function useJournalEntries(params?: { tag?: string }) {
  return usePaginatedData<JournalEntry>(journalAPI.getPublished, params);
}

export function useJournalEntry(slug: string | null) {
  return useSingleData<JournalEntry>(journalAPI.getBySlug, slug);
}

// Services hooks
export function useServices() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await servicesAPI.getPublished();
        setData(response);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useService(slug: string | null) {
  return useSingleData<Service>(servicesAPI.getBySlug, slug);
}

// Featured items hooks
export function useFeaturedProjects(limit: number = 3) {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getPublished({ page_size: limit });
        setData(response.results);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, loading, error };
}

export function useLatestJournalEntries(limit: number = 3) {
  const [data, setData] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await journalAPI.getPublished({ page_size: limit });
        setData(response.results);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  return { data, loading, error };
}