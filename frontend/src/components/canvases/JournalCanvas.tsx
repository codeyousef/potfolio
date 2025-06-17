import React, { useEffect } from 'react'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { useTranslations } from '../../lib/translations'
import FloatingGlassShard from '../core/FloatingGlassShard'

interface JournalCanvasProps {
  language: 'en' | 'ar'
  isDarkTheme: boolean
}

const JournalCanvas: React.FC<JournalCanvasProps> = ({ language, isDarkTheme }) => {
  const { 
    journalEntries, 
    fetchJournalEntries
  } = useAethelframeStore()
  const t = useTranslations(language)
  
  // Fetch journal entries on initial load
  useEffect(() => {
    fetchJournalEntries()
  }, [fetchJournalEntries])
  
  // Aurora glass theme - always uses transparent aurora glass styling
  const currentTheme = {
    text: 'text-white',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-300',
    accent: 'text-teal-400',
    maroon: 'text-red-400',
    navy: 'text-blue-400',
  }

  return (
    <section className="h-screen pt-32 pb-16 relative snap-start flex flex-col justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>          
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              {t.journal.title}
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              {t.journal.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journalEntries.length > 0 ? journalEntries.map((entry, index) => (
              <div key={entry.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all group">
                {/* Featured Image */}
                <div className="aspect-video relative overflow-hidden">
                  {entry.featured_image ? (
                    <img 
                      src={entry.featured_image.file} 
                      alt={language === 'ar' && entry.title_ar ? entry.title_ar : entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-blue-600/20 flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                  )}
                  
                  {/* Date Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-teal-400 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{new Date(entry.publication_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                  </div>
                </div>
              
                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white hover:text-teal-400 transition-colors">
                    {language === 'ar' && entry.title_ar ? entry.title_ar : entry.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {language === 'ar' && entry.excerpt_ar ? entry.excerpt_ar : entry.excerpt}
                  </p>
                  
                  {/* Tags and Read More */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      {(language === 'ar' && entry.tags_ar ? entry.tags_ar : entry.tags || []).slice(0, 2).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className={`inline-block px-2 py-1 rounded-full text-xs border ${
                            tagIndex === 0 
                              ? 'border-red-400/30 text-red-400 bg-red-400/10' 
                              : 'border-blue-400/30 text-blue-400 bg-blue-400/10'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <button className="text-sm text-teal-400 hover:text-white transition-colors flex items-center gap-1">
                      {t.journal.readMore}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points={language === 'ar' ? '15,18 9,12 15,6' : '9,18 15,12 9,6'}></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-gray-300 py-10">
                <p>{t.journal.noEntries}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default JournalCanvas