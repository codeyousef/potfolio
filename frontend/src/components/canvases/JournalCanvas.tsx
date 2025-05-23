import React, { useEffect } from 'react'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { useTranslations } from '../../lib/translations'

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
  
  // Theme configuration
  const currentTheme = isDarkTheme ? {
    bg: 'bg-black',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-500',
    border: 'border-gray-700',
    accent: 'text-teal-400',
    accentBg: 'bg-teal-500',
    maroon: 'text-red-500',
    navy: 'text-blue-500',
    cardBg: 'bg-gray-900/80',
    gradientStart: 'from-black',
    gradientMid: 'via-gray-900',
    gradientEnd: 'to-black'
  } : {
    bg: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    border: 'border-gray-300',
    accent: 'text-teal-600',
    accentBg: 'bg-teal-500',
    maroon: 'text-red-600',
    navy: 'text-blue-600',
    cardBg: 'bg-white/80',
    gradientStart: 'from-white',
    gradientMid: 'via-gray-50',
    gradientEnd: 'to-white'
  }

  return (
    <section className={`h-screen pt-32 pb-16 relative bg-gradient-to-b ${currentTheme.gradientStart} ${currentTheme.gradientMid} ${currentTheme.gradientEnd} snap-start flex flex-col justify-center`}>          
      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 relative inline-block">
            <span className={currentTheme.text}>
              {t.journal.title}
            </span>
            <span className={`absolute -bottom-2 left-1/4 right-1/4 h-1 ${currentTheme.accentBg} rounded-full`}></span>
          </h2>
          <p className={`text-xl ${currentTheme.textSecondary} max-w-2xl mx-auto mt-6`}>
            {t.journal.subtitle}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12">
          {journalEntries.length > 0 ? journalEntries.map((entry) => (
            <div key={entry.id} className="blog-post relative group max-w-sm">
              <div className={`blog-image aspect-video rounded-2xl overflow-hidden flex items-center justify-center mb-0 relative ${currentTheme.cardBg}`}>
                {entry.featured_image ? (
                  <img 
                    src={entry.featured_image.file} 
                    alt={language === 'ar' && entry.title_ar ? entry.title_ar : entry.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-600/20"></div>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${currentTheme.textMuted}`}>
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </>
                )}
                <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'} ${currentTheme.bg}/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs ${currentTheme.accent} flex items-center gap-1`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{new Date(entry.publication_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
              </div>
            
              <div className="blog-content p-6 transform group-hover:translate-y-2 transition-transform">
                <h3 className={`text-xl font-bold mb-3 ${currentTheme.text} group-hover:${currentTheme.accent} transition-colors`}>
                  {language === 'ar' && entry.title_ar ? entry.title_ar : entry.title}
                </h3>
                
                <p className={`${currentTheme.textMuted} text-sm line-clamp-3`}>
                  {language === 'ar' && entry.excerpt_ar ? entry.excerpt_ar : entry.excerpt}
                </p>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-2">
                    {(language === 'ar' && entry.tags_ar ? entry.tags_ar : entry.tags || []).slice(0, 2).map((tag, index) => (
                      <span key={index} className={`inline-block px-3 py-1 rounded-full ${currentTheme.cardBg} ${currentTheme.border} border ${index === 0 ? currentTheme.maroon : currentTheme.navy} text-xs`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className={`text-sm ${currentTheme.accent} hover:${currentTheme.text} transition-colors flex items-center gap-1`}>
                    {t.journal.readMore}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points={language === 'ar' ? '15,18 9,12 15,6' : '9,18 15,12 9,6'}></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className={`text-center ${currentTheme.textSecondary}`}>
              <p>{t.journal.noEntries}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default JournalCanvas