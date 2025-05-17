import { motion } from 'framer-motion';
import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import ParticleAccent from '../effects/ParticleAccent';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { DirectusJournalEntry } from '../../types/directus';
import { format } from 'date-fns';

const JournalEntryCard = ({ entry }: { entry: DirectusJournalEntry }) => {
  const directusUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
  const imageUrl = entry.featured_image && typeof entry.featured_image === 'object' && entry.featured_image.id 
    ? `${directusUrl}/assets/${entry.featured_image.id}?key=journal-thumb` 
    : null;

  // Format the publication date if available
  const formattedDate = entry.publication_date 
    ? format(new Date(entry.publication_date), 'MMMM d, yyyy')
    : 'No date';

  return (
    <motion.div 
      className="journal-entry-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
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
          onClick={() => console.log(`Navigate to journal entry: ${entry.slug}`)}
          className="canvas-action-link text-sm"
        >
          Read More →
        </button>
      </div>
    </motion.div>
  );
};

const JournalCanvas = () => {
  const { journalEntries, isLoading } = useAethelframeStore();

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

        {isLoading.journalEntries ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">Loading journal entries...</p>
          </div>
        ) : journalEntries.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">No journal entries found.</p>
          </div>
        ) : (
          <div className="journal-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            {journalEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </KineticCanvasWrapper>
  );
};

export default JournalCanvas;
