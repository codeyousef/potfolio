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

  // Aurora glass theme - always uses transparent aurora glass styling
  const currentTheme = {
    text: 'text-white',
    textSecondary: 'text-gray-200',
    accent: 'text-teal-400',
    maroon: 'text-red-400',
    navy: 'text-blue-400',
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
            className="glass-button px-8 py-3 flex items-center gap-2 glow-teal reflection"
          >
            {t.home.exploreWork}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={language === 'ar' ? '15,18 9,12 15,6' : '9,18 15,12 9,6'}></polyline>
            </svg>
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="glass-button px-8 py-3 glow-navy reflection"
          >
            {t.home.getInTouch}
          </button>
        </div>
      </div>

      <div className="md:w-2/5 relative">
        <div className="relative aspect-square rounded-full overflow-hidden p-3 border border-white/20 shadow-2xl glow-teal reflection animate-[materialize_1s_ease-out_forwards]">
          {/* Glowing ring */}
          <div className="absolute inset-3 rounded-full border border-white/20 z-10 animate-pulse" 
            style={{ 
              boxShadow: "0 0 20px rgba(56, 178, 172, 0.3), inset 0 0 20px rgba(56, 178, 172, 0.3)",
              animation: "pulse 3s infinite ease-in-out"
            }}>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-accent/70 via-navy-accent/50 to-maroon-accent/60 animate-pulse mix-blend-overlay"></div>
              <ArabicCalligraphyElement className="absolute inset-0 text-white opacity-90 transform scale-150" />
            </div>
          </div>

          {/* Orbit elements with enhanced effects */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-accent/30 to-transparent"></div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-navy-accent/30 to-transparent"></div>
          </div>

          {/* Rotating gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-accent/10 via-transparent to-maroon-accent/10 animate-spin" 
            style={{ animationDuration: '15s', mixBlendMode: 'overlay' }}>
          </div>

          {/* Orbital elements with glow */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-teal-accent/80 border border-white/20 shadow-lg glow-teal"></div>
          <div className="absolute bottom-10 right-10 w-4 h-4 rounded-full bg-maroon-accent/80 border border-white/20 shadow-lg glow-maroon"></div>
          <div className="absolute bottom-20 left-10 w-8 h-8 rounded-full bg-navy-accent/80 border border-white/20 shadow-lg glow-navy"></div>
        </div>

        <div className="absolute -bottom-4 -right-4 p-2 rounded-full glass-button flex items-center justify-center shadow-lg glow-teal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white animate-bounce">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>

        {/* Add floating particles around the circle */}
        <div className="absolute -top-6 -right-6 w-4 h-4 rounded-full bg-teal-accent/40 animate-pulse glow-teal"></div>
        <div className="absolute top-1/4 -left-8 w-3 h-3 rounded-full bg-navy-accent/40 animate-pulse glow-navy"></div>
        <div className="absolute bottom-1/3 -right-10 w-5 h-5 rounded-full bg-maroon-accent/40 animate-pulse glow-maroon"></div>
      </div>
    </div>
  )
}

export default HomeCanvas
