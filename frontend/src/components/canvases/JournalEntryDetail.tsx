import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAethelframeStore } from '@store/useAethelframeStore'
import KineticCanvasWrapper from '@components/core/KineticCanvasWrapper'
import { JournalEntry } from '@types/models'
import { getJournalEntryBySlug } from '@lib/api'

const JournalEntryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { currentPhase } = useAethelframeStore()
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch journal entry on initial load
  useEffect(() => {
    const fetchEntry = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        const data = await getJournalEntryBySlug(slug)
        
        if (data) {
          setEntry(data)
          setError(null)
        } else {
          setError('Journal entry not found')
        }
      } catch (err) {
        console.error('Error fetching journal entry:', err)
        setError('Failed to load journal entry')
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [slug])

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  // Animation variants based on the current phase
  const contentVariants = {
    seed: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: 'easeInOut', delay: 0.3 }
    },
    growth: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 }
    },
    bloom: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 }
    }
  }

  return (
    <KineticCanvasWrapper>
      <div className="w-full min-h-screen pt-24 pb-12">
        <motion.div 
          className="container mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={contentVariants[currentPhase]}
        >
          {/* Back button */}
          <Link 
            to="/journal" 
            className="inline-flex items-center text-small text-teal-accent hover:underline mb-8"
          >
            ← Back to Journal
          </Link>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-accent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 mb-8">
              <h2 className="text-h4 font-secondary font-bold mb-2 text-red-400">{error}</h2>
              <p className="text-body mb-4">The journal entry you're looking for could not be found.</p>
              <Link 
                to="/journal" 
                className="inline-block px-4 py-2 bg-teal-accent text-white rounded-md hover:bg-teal-accent/80 transition-colors"
              >
                Return to Journal
              </Link>
            </div>
          ) : entry ? (
            <div className="max-w-4xl mx-auto">
              {/* Featured Image */}
              {entry.featured_image && (
                <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
                  <img 
                    src={entry.featured_image.file} 
                    alt={entry.title} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
              
              {/* Date */}
              {entry.publication_date && (
                <p className="text-small text-gray-500 mb-2">
                  {formatDate(entry.publication_date)}
                </p>
              )}
              
              {/* Title */}
              <h1 className="text-h2 md:text-h1 font-secondary font-bold mb-6">{entry.title}</h1>
              
              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {entry.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-gray-800 rounded-full text-small"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Content */}
              {entry.content_rich_text ? (
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: entry.content_rich_text }}
                />
              ) : (
                <p className="text-body text-gray-400">No content available for this entry.</p>
              )}
            </div>
          ) : null}
        </motion.div>
      </div>
    </KineticCanvasWrapper>
  )
}

export default JournalEntryDetail