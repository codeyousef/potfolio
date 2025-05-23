import React, { useEffect } from 'react'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { useTranslations } from '../../lib/translations'

interface ServicesCanvasProps {
  language: 'en' | 'ar'
  isDarkTheme: boolean
}

const ServicesCanvas: React.FC<ServicesCanvasProps> = ({ language, isDarkTheme }) => {
  const { 
    services, 
    fetchServices
  } = useAethelframeStore()
  const t = useTranslations(language)
  
  // Fetch services on initial load
  useEffect(() => {
    fetchServices()
  }, [fetchServices])
  
  // Theme configuration
  const currentTheme = isDarkTheme ? {
    bg: 'bg-black',
    bgSecondary: 'bg-gray-900',
    bgTertiary: 'bg-gray-800',
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
    bgSecondary: 'bg-gray-50',
    bgTertiary: 'bg-gray-100',
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

  // Arabic Calligraphy Component
  const ArabicCalligraphyElement = ({ className }: { className: string }) => (
    <div className={`arabic-element ${className}`}>
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <path
          d="M10,20 Q30,5 50,20 T90,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10,25 Q30,40 50,25 T90,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="22.5" r="2" fill="currentColor" />
      </svg>
    </div>
  )

  return (
    <section className={`h-screen pt-32 pb-16 relative bg-gradient-to-b ${currentTheme.gradientStart} ${currentTheme.gradientMid} ${currentTheme.gradientEnd} snap-start flex flex-col justify-center`} dir={language === 'ar' ? 'rtl' : 'ltr'}>          
      <div className="container mx-auto px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 relative inline-block">
            <span className={currentTheme.text}>
              {t.services.title}
            </span>
            <span className={`absolute -bottom-2 left-1/4 right-1/4 h-1 ${currentTheme.accentBg} rounded-full`}></span>
          </h2>
          <p className={`text-xl ${currentTheme.textSecondary} max-w-2xl mx-auto mt-6`}>
            {t.services.subtitle}
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {services.length > 0 ? services.map((service, index) => {
            const colorTheme = index === 0 ? currentTheme.maroon : index === 1 ? currentTheme.navy : currentTheme.accent
            const hoverTheme = index === 0 ? currentTheme.accent : index === 1 ? currentTheme.accent : currentTheme.maroon
            
            return (
              <div key={service.id} className={`flex-1 min-w-80 max-w-96 ${currentTheme.cardBg} backdrop-blur-md rounded-2xl ${currentTheme.border} border p-8 transform transition-all duration-500 hover:shadow-xl group relative`}>
                <div className={`service-icon mb-6 ${colorTheme} group-hover:${hoverTheme} transition-colors duration-300`}>
                  {service.featured_image ? (
                    <img 
                      src={service.featured_image.file} 
                      alt={language === 'ar' && service.title_ar ? service.title_ar : service.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  )}
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>
                  {language === 'ar' && service.title_ar ? service.title_ar : service.title}
                </h3>
                
                <p className={`${currentTheme.textSecondary} mb-4`}>
                  {language === 'ar' && service.description_ar ? service.description_ar : service.description}
                </p>
                
                <ArabicCalligraphyElement className={`absolute ${language === 'ar' ? '-bottom-4 -left-4' : '-bottom-4 -right-4'} w-24 h-16 ${currentTheme.textMuted} opacity-20 transform ${language === 'ar' ? 'rotate-12' : '-rotate-12'} group-hover:opacity-30 transition-opacity`} />
              </div>
            )
          }) : (
            <>
              {/* Fallback Service Card 1 - Web Development */}
              <div className={`flex-1 min-w-80 max-w-96 ${currentTheme.cardBg} backdrop-blur-md rounded-2xl ${currentTheme.border} border p-8 transform transition-all duration-500 hover:shadow-xl group relative`}>
                <div className={`service-icon mb-6 ${currentTheme.maroon} group-hover:${currentTheme.accent} transition-colors duration-300`}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>{t.services.webDev.title}</h3>
                
                <ul className={`${currentTheme.textSecondary} space-y-2`}>
                  {t.services.webDev.items.map((item, idx) => (
                    <li key={idx} className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.maroon} group-hover:${currentTheme.accent} transition-colors`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <ArabicCalligraphyElement className={`absolute ${language === 'ar' ? '-bottom-4 -left-4' : '-bottom-4 -right-4'} w-24 h-16 ${currentTheme.textMuted} opacity-20 transform ${language === 'ar' ? 'rotate-12' : '-rotate-12'} group-hover:opacity-30 transition-opacity`} />
              </div>
              
              {/* Fallback Service Card 2 - 3D & Animation */}
              <div className={`flex-1 min-w-80 max-w-96 ${currentTheme.cardBg} backdrop-blur-md rounded-2xl ${currentTheme.border} border p-8 transform transition-all duration-500 hover:shadow-xl group relative`}>
                <div className={`service-icon mb-6 ${currentTheme.navy} group-hover:${currentTheme.accent} transition-colors duration-300`}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>{t.services.animation.title}</h3>
                
                <ul className={`${currentTheme.textSecondary} space-y-2`}>
                  {t.services.animation.items.map((item, idx) => (
                    <li key={idx} className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.navy} group-hover:${currentTheme.accent} transition-colors`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <ArabicCalligraphyElement className={`absolute ${language === 'ar' ? '-bottom-4 -left-4' : '-bottom-4 -right-4'} w-24 h-16 ${currentTheme.textMuted} opacity-20 transform ${language === 'ar' ? 'rotate-12' : '-rotate-12'} group-hover:opacity-30 transition-opacity`} />
              </div>
              
              {/* Fallback Service Card 3 - Game Development */}
              <div className={`flex-1 min-w-80 max-w-96 ${currentTheme.cardBg} backdrop-blur-md rounded-2xl ${currentTheme.border} border p-8 transform transition-all duration-500 hover:shadow-xl group relative`}>
                <div className={`service-icon mb-6 ${currentTheme.accent} group-hover:${currentTheme.maroon} transition-colors duration-300`}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="7.5,4.21 12,6.81 16.5,4.21"></polyline>
                    <polyline points="7.5,19.79 7.5,14.6 3,12"></polyline>
                    <polyline points="21,12 16.5,14.6 16.5,19.79"></polyline>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>{t.services.gameDev.title}</h3>
                
                <ul className={`${currentTheme.textSecondary} space-y-2`}>
                  {t.services.gameDev.items.map((item, idx) => (
                    <li key={idx} className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${currentTheme.accent} group-hover:${currentTheme.maroon} transition-colors`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <ArabicCalligraphyElement className={`absolute ${language === 'ar' ? '-bottom-4 -left-4' : '-bottom-4 -right-4'} w-24 h-16 ${currentTheme.textMuted} opacity-20 transform ${language === 'ar' ? 'rotate-12' : '-rotate-12'} group-hover:opacity-30 transition-opacity`} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default ServicesCanvas