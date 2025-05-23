import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { useTranslations } from '../../lib/translations'

interface HomeCanvasProps {
  language: 'en' | 'ar'
  isDarkTheme: boolean
}

const HomeCanvas: React.FC<HomeCanvasProps> = ({ language, isDarkTheme }) => {
  const { currentPhase } = useAethelframeStore()
  const t = useTranslations(language)
  
  // Theme configuration
  const currentTheme = isDarkTheme ? {
    bg: 'bg-black',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    accent: 'text-teal-400',
    accentBg: 'bg-teal-500',
    maroon: 'text-red-500',
    cardBg: 'bg-gray-900/80',
    border: 'border-gray-700'
  } : {
    bg: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'text-teal-600',
    accentBg: 'bg-teal-500',
    maroon: 'text-red-600',
    cardBg: 'bg-white/80',
    border: 'border-gray-300'
  }
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
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
    <section className="h-screen flex items-center justify-center relative overflow-hidden snap-start">          
      <div className="container mx-auto px-8 pt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-3/5 relative">
            <div className={`absolute -top-16 -left-8 w-20 h-20 ${currentTheme.maroon} opacity-30 transform rotate-12`}>
              <ArabicCalligraphyElement className="w-full h-full" />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-6 relative">
              <div className="overflow-hidden">
                <span className={`block ${currentTheme.text} transform hover:scale-105 transition-transform`}>
                  {t.home.title.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
              <div className="overflow-hidden mt-2">
                <span className={`block ${currentTheme.accent} transform hover:scale-105 transition-transform`}>
                  {t.home.title.split(' ').slice(2).join(' ')}
                </span>
              </div>
            </h2>
            
            <div className={`text-xl ${currentTheme.textSecondary} max-w-xl mb-10 relative`}>
              {t.home.description}
              <div className={`absolute ${language === 'ar' ? '-left-6' : '-right-6'} bottom-0 w-20 h-20 ${currentTheme.accent} opacity-20 transform ${language === 'ar' ? 'rotate-12' : '-rotate-12'}`}>
                <ArabicCalligraphyElement className="w-full h-full" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => scrollToSection('portfolio')}
                className={`px-8 py-3 rounded-full ${currentTheme.accentBg} hover:opacity-90 transition-all duration-300 text-white font-medium flex items-center gap-2 shadow-lg`}
              >
                {t.home.exploreWork}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points={language === 'ar' ? '15,18 9,12 15,6' : '9,18 15,12 9,6'}></polyline>
                </svg>
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`px-8 py-3 rounded-full border ${currentTheme.border} ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all duration-300 ${currentTheme.text} font-medium`}
              >
                {t.home.getInTouch}
              </button>
            </div>
          </div>
          
          <div className="md:w-2/5 relative">
            <div className={`relative aspect-square rounded-full overflow-hidden ${currentTheme.cardBg} backdrop-blur-sm p-3 ${currentTheme.border} border shadow-2xl`}>
              <div className={`absolute inset-6 rounded-full ${currentTheme.border} border`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-36 h-36 relative">
                  <div className={`absolute inset-0 rounded-full ${currentTheme.accentBg} opacity-60 animate-pulse mix-blend-overlay`}></div>
                  <ArabicCalligraphyElement className={`absolute inset-0 ${currentTheme.text} opacity-80 transform scale-150`} />
                </div>
              </div>
              
              {/* Orbit elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className={`absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent`}></div>
                <div className={`absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent`}></div>
              </div>
              
              <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${currentTheme.accentBg} opacity-60 backdrop-blur-md ${currentTheme.border} border shadow-lg`}></div>
              <div className={`absolute bottom-10 right-10 w-4 h-4 rounded-full bg-red-500 opacity-60 backdrop-blur-md border border-red-300 shadow-lg`}></div>
              <div className={`absolute bottom-20 left-10 w-8 h-8 rounded-full bg-blue-600 opacity-60 backdrop-blur-md border border-blue-300 shadow-lg`}></div>
            </div>
            
            <div className={`absolute -bottom-4 -right-4 p-2 rounded-full bg-gray-800 backdrop-blur-md flex items-center justify-center shadow-lg`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${currentTheme.accent} animate-bounce`}>
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeCanvas