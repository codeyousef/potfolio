import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJournalEntryBySlug } from '@/lib/api';
import type { DirectusJournalEntry } from '@/types/directus';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const JournalEntryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log('JournalEntryDetail - slug:', slug); // Debug log

  const { data: entry, isLoading, error } = useQuery<DirectusJournalEntry | null>({
    queryKey: ['journalEntry', slug],
    queryFn: async () => {
      if (!slug) {
        console.error('No slug provided in URL');
        return null;
      }

      console.log('Fetching journal entry with slug:', slug);

      try {
        const journalEntry = await getJournalEntryBySlug(slug);
        console.log('Fetched journal entry:', journalEntry);

        if (!journalEntry) {
          console.error('Journal entry not found for slug:', slug);
          return null;
        }

        return journalEntry;
      } catch (err) {
        console.error('Error fetching journal entry:', err);
        return null;
      }
    },
  });

  // Log the journal entry data when it changes
  useEffect(() => {
    if (entry) {
      console.log('Journal entry data loaded:', entry);
    }
  }, [entry]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/" state={{ journalTag: null }}>Back to Home</Link>
        </Button>
      </div>
    );
  }

  const directusUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
  const featuredImageUrl = entry.featured_image && typeof entry.featured_image === 'object' && entry.featured_image.id 
    ? `${directusUrl}/assets/${entry.featured_image.id}?width=1200` 
    : null;

  // Format the publication date if available
  const formattedDate = entry.publication_date 
    ? format(new Date(entry.publication_date), 'MMMM d, yyyy')
    : 'No date';

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/" state={{ journalTag: null }} className="flex items-center gap-2">
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
            <div className="text-sm font-mono text-highlight-color/70 mb-2">{formattedDate}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{entry.title}</h1>
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {entry.tags.map((tag, index) => (
                  <Link 
                    key={index}
                    to="/"
                    state={{ journalTag: tag }}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-highlight-color hover:text-black transition-colors cursor-pointer"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {featuredImageUrl && (
            <motion.div 
              className="mb-12 rounded-lg overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src={featuredImageUrl} 
                alt={entry.title} 
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </motion.div>
          )}

          <div className="prose prose-invert max-w-none">
            {entry.content_rich_text ? (
              <div dangerouslySetInnerHTML={{ __html: entry.content_rich_text }} />
            ) : (
              <p className="text-gray-400">{entry.excerpt || 'No content available.'}</p>
            )}
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
};

export default JournalEntryDetail;
