import { motion } from 'framer-motion';
import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import ParticleAccent from '../effects/ParticleAccent';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { DirectusJournalEntry } from '../../types/directus';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const JournalEntryCard = ({ entry }: { entry: DirectusJournalEntry }) => {
  const navigate = useNavigate();
  const directusUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
  const imageUrl = entry.featured_image && typeof entry.featured_image === 'object' && entry.featured_image.id 
    ? `${directusUrl}/assets/${entry.featured_image.id}?key=journal-thumb` 
    : null;

  const handleReadMoreClick = () => {
    navigate(`/journal/${entry.slug}`);
  };

  // Format the publication date if available
  const formattedDate = entry.publication_date 
    ? format(new Date(entry.publication_date), 'MMMM d, yyyy')
    : 'No date';

  return (
    <motion.div 
      className="journal-entry-card cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
      onClick={handleReadMoreClick}
    >
      {imageUrl && (
        <div className="journal-image">
          <img src={imageUrl} alt={entry.title} className="w-full h-48 object-cover" />
        </div>
      )}

      <div className="journal-content p-6">
        <div className="text-xs font-mono text-highlight-color/70 mb-2">{formattedDate}</div>
        <h3 className="text-xl font-heading text-highlight-color mb-3">{entry.title}</h3>

        {entry.excerpt ? (
          <p className="text-gray-400 text-sm mb-4">{entry.excerpt}</p>
        ) : (
          <p className="text-gray-400 text-sm mb-4">No excerpt available.</p>
        )}

        <button 
          onClick={handleReadMoreClick}
          className="canvas-action-link text-sm"
        >
          Read More →
        </button>
      </div>
    </motion.div>
  );
};

const JournalCanvas = () => {
  const { 
    journalEntries, 
    isLoading, 
    currentJournalTag, 
    setJournalTag,
    journalPagination,
    setJournalPage
  } = useAethelframeStore();

  // Extract all unique tags from journal entries
  const allTags = Array.from(
    new Set(
      journalEntries
        .flatMap(entry => entry.tags || [])
        .filter(Boolean)
    )
  );

  // Handle tag click
  const handleTagClick = (tag: string | null) => {
    console.log('handleTagClick called with tag:', tag);
    setJournalTag(tag);
  };

  return (
    <KineticCanvasWrapper id="journal">
      <ParticleAccent count={12} />

      <div className="canvas-content-wrapper items-center justify-center text-center p-6">
        <motion.h2 
          className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          Journal
        </motion.h2>

        {/* Tag filters */}
        <motion.div 
          className="tag-filters flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              currentJournalTag === null 
                ? 'bg-highlight-color text-black font-medium' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            onClick={() => handleTagClick(null)}
          >
            All Posts
          </button>

          {allTags.map(tag => (
            <button 
              key={tag}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentJournalTag === tag 
                  ? 'bg-highlight-color text-black font-medium' 
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {isLoading.journalEntries ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">Loading journal entries...</p>
          </div>
        ) : journalEntries.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">
              {currentJournalTag 
                ? `No journal entries found with tag "${currentJournalTag}".` 
                : "No journal entries found."}
            </p>
          </div>
        ) : (
          <>
            <div className="journal-grid grid grid-cols-1 md:grid-cols-2 gap-8">
              {journalEntries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </div>

            {/* Pagination Controls */}
            {journalPagination.totalPages > 1 && (
              <div className="pagination-controls flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setJournalPage(1)}
                  disabled={!journalPagination.hasPrevious}
                  className={`pagination-button px-3 py-1 rounded ${
                    journalPagination.hasPrevious
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                      : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
                  }`}
                >
                  First
                </button>

                <button
                  onClick={() => setJournalPage(journalPagination.currentPage - 1)}
                  disabled={!journalPagination.hasPrevious}
                  className={`pagination-button px-3 py-1 rounded ${
                    journalPagination.hasPrevious
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                      : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-400">
                  Page {journalPagination.currentPage} of {journalPagination.totalPages}
                </span>

                <button
                  onClick={() => setJournalPage(journalPagination.currentPage + 1)}
                  disabled={!journalPagination.hasNext}
                  className={`pagination-button px-3 py-1 rounded ${
                    journalPagination.hasNext
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                      : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>

                <button
                  onClick={() => setJournalPage(journalPagination.totalPages)}
                  disabled={!journalPagination.hasNext}
                  className={`pagination-button px-3 py-1 rounded ${
                    journalPagination.hasNext
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
                      : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
                  }`}
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </KineticCanvasWrapper>
  );
};

export default JournalCanvas;
