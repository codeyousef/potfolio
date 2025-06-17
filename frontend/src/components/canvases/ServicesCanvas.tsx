import React, { useEffect } from 'react'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { useTranslations } from '../../lib/translations'
import FloatingGlassShard from '../core/FloatingGlassShard'

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

  // Aurora glass theme - always uses transparent aurora glass styling
  const currentTheme = {
    text: 'text-white',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-300',
    accent: 'text-teal-400',
    maroon: 'text-red-400',
    navy: 'text-blue-400',
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
    <section className="h-screen pt-32 pb-16 relative snap-start flex flex-col justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>          
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              {t.services.title}
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              {t.services.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length > 0 ? services.map((service, index) => {
              const colorTheme = index === 0 ? 'text-red-400' : index === 1 ? 'text-blue-400' : 'text-teal-400';
              
              return (
                <div key={service.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  {/* Service Icon */}
                  <div className={`service-icon mb-4 ${colorTheme}`}>
                    {service.featured_image ? (
                      <img 
                        src={service.featured_image.file} 
                        alt={language === 'ar' && service.title_ar ? service.title_ar : service.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white">
                    {language === 'ar' && service.title_ar ? service.title_ar : service.title}
                  </h3>

                  <p className="text-gray-300 text-sm">
                    {language === 'ar' && service.description_ar ? service.description_ar : service.description}
                  </p>
                </div>
              );
            }) : (
              <>
                {/* Fallback Service Cards */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="service-icon mb-4 text-red-400">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{t.services.webDev.title}</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {t.services.webDev.items.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-400"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="service-icon mb-4 text-blue-400">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                      <path d="M2 2l7.586 7.586"></path>
                      <circle cx="11" cy="11" r="2"></circle>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{t.services.animation.title}</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {t.services.animation.items.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <div className="service-icon mb-4 text-teal-400">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="7.5,4.21 12,6.81 16.5,4.21"></polyline>
                      <polyline points="7.5,19.79 7.5,14.6 3,12"></polyline>
                      <polyline points="21,12 16.5,14.6 16.5,19.79"></polyline>
                      <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{t.services.gameDev.title}</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {t.services.gameDev.items.slice(0, 4).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-teal-400"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesCanvas
