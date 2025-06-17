import React, { useState, useEffect } from 'react'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { useTranslations } from '@lib/translations'
import Overture from '@components/sections/Overture'
import SiteShell from '@components/core/SiteShell'
import FloatingGlassShard from '@components/core/FloatingGlassShard'

// Import individual canvas components to extract their content
import HomeCanvas from '@components/canvases/HomeCanvas'
import PortfolioCanvas from '@components/canvases/PortfolioCanvas'
import ServicesCanvas from '@components/canvases/ServicesCanvas'
import JournalCanvas from '@components/canvases/JournalCanvas'
import ContactCanvas from '@components/canvases/ContactCanvas'
import PlasmaWaterfallDemo from '@components/canvases/PlasmaWaterfallDemo'

const App: React.FC = () => {
  // Check URL for demo mode
  const isPlasmaWaterfallMode = window.location.search.includes('demo=plasma') || window.location.search.includes('plasma=true')
  
  const [activeSection, setActiveSection] = useState('home')
  const [language, setLanguage] = useState('en') // 'en' or 'ar'

  // Contact form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const { 
    currentPhase, 
    isOvertureVisible, 
    activeCanvasId,
    setActiveCanvas,
    hideOverture,
    fetchProjects,
    fetchJournalEntries,
    fetchServices
  } = useAethelframeStore()

  // Get translations
  const t = useTranslations(language)

  // Initialize canvas based on active section
  useEffect(() => {
    setActiveCanvas(activeSection as any)
  }, [activeSection, setActiveCanvas])
  
  // Debug activeCanvasId changes
  useEffect(() => {
    console.log('Active canvas changed to:', activeCanvasId)
  }, [activeCanvasId])

  // Fetch data on initial load
  useEffect(() => {
    fetchProjects()
    fetchJournalEntries()
    fetchServices()
  }, [fetchProjects, fetchJournalEntries, fetchServices])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en')
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

  // Render the appropriate canvas content based on active canvas
  const renderActiveCanvas = () => {
    switch (activeCanvasId) {
      case 'home':
        return <HomeCanvas language={language} isDarkTheme={true} />
      case 'portfolio':
        return <PortfolioCanvas language={language} isDarkTheme={true} />
      case 'services':
        return <ServicesCanvas language={language} isDarkTheme={true} />
      case 'journal':
        return <JournalCanvas language={language} isDarkTheme={true} />
      case 'contact':
        return (
          <ContactCanvas 
            language={language} 
            isDarkTheme={true}
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
        )
      default:
        return <HomeCanvas language={language} isDarkTheme={true} />
    }
  }

  // Render Plasma Waterfall Demo if in demo mode
  if (isPlasmaWaterfallMode) {
    return <PlasmaWaterfallDemo language={language} />
  }

  return (
    <SiteShell>
      {isOvertureVisible ? (
        <Overture onComplete={hideOverture} />
      ) : (
        <div className="min-h-screen flex flex-col relative" dir={language === 'ar' ? 'rtl' : 'ltr'} style={{ zIndex: 10, overflowY: 'auto', overflowX: 'hidden' }}>
          {/* Logo Floating Glass Shard */}
          <FloatingGlassShard 
            position={{ x: 50, y: 15 }}
            distanceFromPortal={150}
            rotation={0}
            shape="hexagon"
          >
            <h1 className="text-2xl font-bold text-white">
              {language === 'ar' ? 'إيثل' : 'AETHEL'}
              <span className="text-teal-400">{language === 'ar' ? 'فريم' : 'FRAME'}</span>
            </h1>
          </FloatingGlassShard>

          {/* Language Toggle */}
          <FloatingGlassShard 
            position={{ x: 85, y: 10 }}
            distanceFromPortal={200}
            rotation={-3}
            shape="triangle"
          >
            <button 
              onClick={toggleLanguage}
              className="text-white hover:text-teal-400 transition-colors px-3 py-2"
              title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>
          </FloatingGlassShard>

          {/* Demo Links */}
          <FloatingGlassShard 
            position={{ x: 15, y: 10 }}
            distanceFromPortal={200}
            rotation={3}
            shape="pentagon"
          >
            <div className="flex flex-col gap-1 text-center">
              <a 
                href="?demo=plasma"
                className="text-white hover:text-cyan-400 transition-colors px-2 py-1 text-xs"
                title="Plasma Waterfall Effect Demo"
              >
                💧 Plasma Waterfall
              </a>
            </div>
          </FloatingGlassShard>


          {/* Main Content Area */}
          <div className="w-full relative" style={{ paddingTop: '40px', paddingBottom: '40px', minHeight: '100vh' }}>
            <div className="relative z-20 w-full h-full">
              {renderActiveCanvas()}
            </div>
          </div>
        </div>
      )}
      
      {/* Ensure scrolling is enabled */}
      <style>{`
        html, body, #root {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: auto !important;
          min-height: 100vh;
        }
      `}</style>
    </SiteShell>
  )
}

export default App
