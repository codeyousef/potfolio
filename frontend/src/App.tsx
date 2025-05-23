import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { useTranslations } from '@lib/translations'
import Overture from '@components/sections/Overture'

// Import individual canvas components to extract their content
import HomeCanvas from '@components/canvases/HomeCanvas'
import PortfolioCanvas from '@components/canvases/PortfolioCanvas'
import ServicesCanvas from '@components/canvases/ServicesCanvas'
import JournalCanvas from '@components/canvases/JournalCanvas'
import ContactCanvas from '@components/canvases/ContactCanvas'

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState(1)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(true)
  const [activeSection, setActiveSection] = useState('home')
  const [scrollIndicator, setScrollIndicator] = useState(0)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [language, setLanguage] = useState('en') // 'en' or 'ar'
  
  // Contact form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  
  // Refs for scrolling to sections
  const homeRef = useRef(null)
  const portfolioRef = useRef(null)
  const servicesRef = useRef(null)
  const blogRef = useRef(null)
  const contactRef = useRef(null)

  const { 
    currentPhase, 
    activeCanvasId, 
    isOvertureVisible, 
    setActiveCanvas,
    hideOverture,
    fetchProjects,
    fetchJournalEntries,
    fetchServices,
    projects,
    journalEntries,
    services
  } = useAethelframeStore()

  // Get translations
  const t = useTranslations(language)

  // Generate Arabic letters data
  const arabicLetters = useMemo(() => {
    const letters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض']
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      letter: letters[i % letters.length],
      size: Math.random() * 60 + 40,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 200 - 100,
      rotationX: Math.random() * 360,
      rotationY: Math.random() * 360,
      rotationZ: Math.random() * 360,
      speed: Math.random() * 30 + 20,
      delay: Math.random() * 10
    }))
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    
    // Scroll event listener for section detection
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const scrollMax = document.body.scrollHeight - windowHeight
      
      // Calculate scroll progress percentage
      setScrollIndicator((scrollPosition / scrollMax) * 100)
      
      // Determine active section based on scroll position
      const sections = [
        { ref: homeRef, id: 'home' },
        { ref: portfolioRef, id: 'portfolio' },
        { ref: servicesRef, id: 'services' },
        { ref: blogRef, id: 'journal' },
        { ref: contactRef, id: 'contact' }
      ]
      
      // Find the current visible section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.ref.current) {
          const rect = (section.ref.current as HTMLElement).getBoundingClientRect()
          if (rect.top <= windowHeight * 0.5) {
            setActiveSection(section.id)
            setActiveCanvas(section.id as any)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      clearInterval(cursorInterval)
    }
  }, [setActiveCanvas])

  // Fetch data on initial load
  useEffect(() => {
    fetchProjects()
    fetchJournalEntries()
    fetchServices()
  }, [fetchProjects, fetchJournalEntries, fetchServices])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const nextProject = () => {
    setCurrentProject((prev) => (prev % 4) + 1)
  }
  
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en')
  }

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    setMenuOpen(false)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name, email, subject, message })
    // Reset form
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
    // Show success message or feedback
    alert('Message sent successfully!')
  }

  // Generate random particles
  const generateParticles = (count: number) => {
    const particles = []
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        size: Math.random() * 6 + 2,
        color: i % 3 === 0 ? '#be123c' : i % 3 === 1 ? '#1e3a8a' : '#5eead4',
        speed: Math.random() * 30 + 25,
        delay: Math.random() * 5,
        top: Math.random() * 100,
        left: Math.random() * 100
      })
    }
    return particles
  }
  
  const particles = generateParticles(20)

  // Theme configuration
  const themeConfig = {
    dark: {
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
      inputBg: 'bg-gray-800',
      gradientStart: 'from-black',
      gradientMid: 'via-gray-900',
      gradientEnd: 'to-black'
    },
    light: {
      bg: 'bg-white',
      bgSecondary: 'bg-gray-50',
      bgTertiary: 'bg-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      border: 'border-gray-200',
      accent: 'text-teal-600',
      accentBg: 'bg-teal-600',
      maroon: 'text-red-600',
      navy: 'text-blue-600',
      cardBg: 'bg-white/90',
      inputBg: 'bg-gray-100',
      gradientStart: 'from-white',
      gradientMid: 'via-gray-50',
      gradientEnd: 'to-white'
    }
  }
  
  const currentTheme = isDarkTheme ? themeConfig.dark : themeConfig.light

  // Calculate dynamic background gradient based on scroll
  const getScrollBasedGradient = () => {
    const progress = (scrollIndicator || 0) / 100
    
    if (isDarkTheme) {
      if (progress < 0.2) {
        return 'from-red-950 via-black to-black'
      } else if (progress < 0.4) {
        return 'from-black via-blue-950 to-black'
      } else if (progress < 0.6) {
        return 'from-black via-purple-950 to-red-950'
      } else if (progress < 0.8) {
        return 'from-blue-950 via-black to-teal-950'
      } else {
        return 'from-teal-950 via-black to-red-950'
      }
    } else {
      if (progress < 0.2) {
        return 'from-red-50 via-white to-white'
      } else if (progress < 0.4) {
        return 'from-white via-blue-50 to-white'
      } else if (progress < 0.6) {
        return 'from-white via-purple-50 to-red-50'
      } else if (progress < 0.8) {
        return 'from-blue-50 via-white to-teal-50'
      } else {
        return 'from-teal-50 via-white to-red-50'
      }
    }
  }

  if (isOvertureVisible) {
    return <Overture onComplete={hideOverture} />
  }

  return (
    <div className={`h-screen transition-all duration-1000 overflow-x-hidden relative bg-gradient-to-br ${getScrollBasedGradient()} snap-y snap-mandatory overflow-y-scroll`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Custom Cursor */}
      <div 
        className="fixed pointer-events-none z-50 transition-opacity duration-300" 
        style={{ 
          left: `${mousePosition.x}px`, 
          top: `${mousePosition.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: showCursor ? 1 : 0.5
        }}
      >
        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-teal-400/50 rounded-full"></div>
      </div>
      
      {/* 3D Arabic Letters Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ perspective: '1000px' }}>
        {arabicLetters.map(letter => (
          <div 
            key={letter.id}
            className="absolute text-teal-400/20 font-bold pointer-events-none select-none arabic-float"
            style={{ 
              left: `${letter.x}%`, 
              top: `${letter.y}%`,
              fontSize: `${letter.size}px`,
              animationDuration: `${letter.speed}s`,
              animationDelay: `${letter.delay}s`,
              '--initial-x': `${letter.x}%`,
              '--initial-y': `${letter.y}%`,
              '--z': `${letter.z}px`,
              '--rx': `${letter.rotationX}deg`,
              '--ry': `${letter.rotationY}deg`,
              '--rz': `${letter.rotationZ}deg`,
              transformStyle: 'preserve-3d'
            } as React.CSSProperties}
          >
            {letter.letter}
          </div>
        ))}
      </div>
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="absolute rounded-full mix-blend-screen animate-bounce" 
            style={{ 
              width: `${particle.size}px`, 
              height: `${particle.size}px`, 
              backgroundColor: particle.color,
              top: `${particle.top}%`, 
              left: `${particle.left}%`,
              animationDuration: `${particle.speed}s`,
              animationDelay: `${particle.delay}s`,
              opacity: 0.15,
              filter: 'blur(1px)'
            }}
          ></div>
        ))}
      </div>
      
      {/* Scroll Progress Indicator */}
      <div className={`fixed left-0 top-0 h-1 ${currentTheme.accentBg} z-50`} style={{ width: `${scrollIndicator}%` }}></div>
      
      
      {/* Header */}
      <header className={`fixed w-full py-6 px-8 flex justify-between items-center z-40 transition-all duration-300 ${currentTheme.bg}/90 backdrop-blur-md ${currentTheme.border} border-b`}>
        <div className="logo-container relative">
          <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
            {language === 'ar' ? 'إيثل' : 'AETHEL'}<span className={currentTheme.accent}>{language === 'ar' ? 'فريم' : 'FRAME'}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className={`px-3 py-2 rounded-full ${currentTheme.bgTertiary} hover:${currentTheme.accent} transition-all duration-300 text-sm font-medium`}
            title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
          >
            {language === 'ar' ? 'EN' : 'ع'}
          </button>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full ${currentTheme.bgTertiary} hover:${currentTheme.accent} transition-all duration-300`}
            title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkTheme ? '☀️' : '🌙'}
          </button>
          
          <button 
            className={`menu-button p-2 rounded-full ${currentTheme.bgTertiary} hover:${currentTheme.accent} transition-all duration-300`}
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </header>
      
      {/* Menu Backdrop */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      
      {/* Navigation menu */}
      <div className={`nav-menu fixed top-0 ${language === 'ar' ? 'left-0' : 'right-0'} h-full w-64 ${currentTheme.bg}/95 backdrop-blur-md transition-transform duration-500 z-50 ${currentTheme.border} ${language === 'ar' ? 'border-r' : 'border-l'} ${menuOpen ? 'translate-x-0' : language === 'ar' ? '-translate-x-full' : 'translate-x-full'}`}>
        {/* Close Button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className={`text-lg font-semibold ${currentTheme.text}`}>
            {t.nav.menu || 'Menu'}
          </h2>
          <button 
            onClick={toggleMenu}
            className={`p-2 rounded-full ${currentTheme.bgTertiary} hover:${currentTheme.accent} transition-all duration-300`}
            title="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-8">
          <ul className="space-y-8">
            {[
              { id: 'home', ref: homeRef, label: t.nav.home },
              { id: 'portfolio', ref: portfolioRef, label: t.nav.portfolio },
              { id: 'services', ref: servicesRef, label: t.nav.services },
              { id: 'journal', ref: blogRef, label: t.nav.journal },
              { id: 'contact', ref: contactRef, label: t.nav.contact }
            ].map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => {
                    scrollToSection(item.ref)
                    setMenuOpen(false) // Close menu after navigation
                  }} 
                  className={`text-xl hover:${currentTheme.accent} transition-colors flex items-center gap-3 w-full ${language === 'ar' ? 'text-right' : 'text-left'} ${activeSection === item.id ? currentTheme.accent : currentTheme.text}`}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
          
          <div className={`mt-16 pt-6 ${currentTheme.border} border-t`}>
            <p className={`text-sm ${currentTheme.textMuted}`}>© 2025 {language === 'ar' ? 'إيثل فريم' : 'AETHELFRAME'}</p>
          </div>
        </div>
      </div>
      
      {/* Home Section */}
      <section ref={homeRef} id="home">
        <HomeCanvas language={language} isDarkTheme={isDarkTheme} />
      </section>
      
      {/* Portfolio Section */}
      <section ref={portfolioRef} id="portfolio">
        <PortfolioCanvas language={language} isDarkTheme={isDarkTheme} />
      </section>
      
      {/* Services Section */}
      <section ref={servicesRef} id="services">
        <ServicesCanvas language={language} isDarkTheme={isDarkTheme} />
      </section>
      
      {/* Journal Section */}
      <section ref={blogRef} id="journal">
        <JournalCanvas language={language} isDarkTheme={isDarkTheme} />
      </section>
      
      {/* Contact Section */}
      <section ref={contactRef} id="contact">
        <ContactCanvas 
          language={language} 
          isDarkTheme={isDarkTheme}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          subject={subject}
          setSubject={setSubject}
          message={message}
          setMessage={setMessage}
          handleSubmitMessage={handleSubmitMessage}
        />
      </section>
      
      <style>{`
        @keyframes arabic-float {
          0% {
            transform: translate3d(var(--initial-x, 0%), var(--initial-y, 0%), var(--z, 0px)) 
                       rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) rotateZ(var(--rz, 0deg));
            opacity: 0.2;
          }
          25% {
            transform: translate3d(calc(var(--initial-x, 0%) - 100px), calc(var(--initial-y, 0%) - 80px), calc(var(--z, 0px) + 100px)) 
                       rotateX(calc(var(--rx, 0deg) + 90deg)) rotateY(calc(var(--ry, 0deg) + 45deg)) rotateZ(calc(var(--rz, 0deg) + 180deg));
            opacity: 0.4;
          }
          50% {
            transform: translate3d(calc(var(--initial-x, 0%) + 120px), calc(var(--initial-y, 0%) - 60px), calc(var(--z, 0px) - 80px)) 
                       rotateX(calc(var(--rx, 0deg) + 180deg)) rotateY(calc(var(--ry, 0deg) + 90deg)) rotateZ(calc(var(--rz, 0deg) + 360deg));
            opacity: 0.6;
          }
          75% {
            transform: translate3d(calc(var(--initial-x, 0%) - 80px), calc(var(--initial-y, 0%) + 100px), calc(var(--z, 0px) + 60px)) 
                       rotateX(calc(var(--rx, 0deg) + 270deg)) rotateY(calc(var(--ry, 0deg) + 135deg)) rotateZ(calc(var(--rz, 0deg) + 180deg));
            opacity: 0.3;
          }
          100% {
            transform: translate3d(var(--initial-x, 0%), var(--initial-y, 0%), var(--z, 0px)) 
                       rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) rotateZ(var(--rz, 0deg));
            opacity: 0.2;
          }
        }
        
        .arabic-float {
          animation: arabic-float 15s ease-in-out infinite;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }
        
        html, body {
          height: 100%;
          overflow: hidden;
        }
        
        /* Enhanced scroll snap behavior */
        .snap-y {
          scroll-snap-type: y mandatory;
          height: 100vh;
          overflow-y: scroll;
        }
        
        .snap-start {
          scroll-snap-align: start;
          scroll-snap-stop: always;
          height: 100vh;
          flex-shrink: 0;
        }
        
        section {
          position: relative;
          transition: all 0.8s ease-in-out;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default App