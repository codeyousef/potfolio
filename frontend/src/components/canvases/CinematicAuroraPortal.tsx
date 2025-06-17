import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CinematicAuroraPortalProps {
  language?: 'en' | 'ar'
}

const CinematicAuroraPortal: React.FC<CinematicAuroraPortalProps> = ({ language = 'en' }) => {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Track mouse for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Navigation data
  const navigation = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'about', label: 'About', icon: '◊' },
    { id: 'portfolio', label: 'Portfolio', icon: '⚡' },
    { id: 'services', label: 'Services', icon: '◈' },
    { id: 'contact', label: 'Contact', icon: '◉' }
  ]

  // Content for each section
  const content = {
    home: {
      title: 'AETHELFRAME',
      subtitle: 'Everything App for your teams',
      description: 'Help all team member setting up your all-in-one management of clients, jobs, stock, and finance.',
      cta: 'Get Free →'
    },
    about: {
      title: 'About Portal',
      subtitle: 'Interdimensional Interface Technology',
      description: 'Advanced holographic workspace that transforms team collaboration through quantum-enhanced productivity systems.',
      features: ['Real-time Sync', 'AI Automation', 'Secure Cloud', 'Team Analytics']
    },
    portfolio: {
      title: 'Projects',
      subtitle: 'Digital Experiences & Solutions',
      projects: [
        { title: 'Team Dashboard', desc: 'Unified team management interface', tech: 'React, Node.js' },
        { title: 'Client Portal', desc: 'Customer relationship management', tech: 'Vue, Firebase' },
        { title: 'Analytics Suite', desc: 'Data visualization platform', tech: 'D3.js, Python' }
      ]
    },
    services: {
      title: 'Services',
      subtitle: 'Enterprise Solutions',
      services: [
        { name: 'Team Setup', price: '$99/mo', desc: 'Complete team onboarding' },
        { name: 'Enterprise', price: '$299/mo', desc: 'Full feature access' },
        { name: 'Custom', price: 'Contact', desc: 'Tailored solutions' }
      ]
    },
    contact: {
      title: 'Contact',
      subtitle: 'Get in touch with our team',
      description: 'Ready to transform your team productivity? Reach out to discuss your needs.',
      email: 'hello@aethelframe.com'
    }
  }

  const currentContent = content[activeSection as keyof typeof content]

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Exact Screenshot Light Effect */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: 0,
          height: '100vh',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {/* Massive spotlight base - exactly like screenshot */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: '800px',
            height: '100vh',
            background: `
              radial-gradient(ellipse 400px 100vh at center bottom, 
                rgba(255,255,255,0.9) 0%,
                rgba(173,216,255,0.8) 15%,
                rgba(135,206,235,0.6) 35%, 
                rgba(65,105,225,0.3) 60%,
                rgba(0,100,255,0.1) 80%,
                transparent 100%
              )
            `,
            transform: 'translateX(-50%)',
            filter: 'blur(3px)'
          }}
          animate={{ 
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Intense core beam */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: '120px',
            height: '100vh',
            background: `
              linear-gradient(0deg,
                rgba(255,255,255,1) 0%,
                rgba(255,255,255,0.9) 20%,
                rgba(173,216,255,0.7) 50%,
                rgba(135,206,235,0.4) 80%,
                transparent 100%
              )
            `,
            transform: 'translateX(-50%)',
            filter: 'blur(2px)'
          }}
          animate={{ 
            opacity: [0.9, 1, 0.9]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Bright center line */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: '8px',
            height: '100vh',
            background: `
              linear-gradient(0deg,
                rgba(255,255,255,1) 0%,
                rgba(255,255,255,0.8) 60%,
                rgba(173,216,255,0.5) 100%
              )
            `,
            transform: 'translateX(-50%)',
            boxShadow: '0 0 40px rgba(255,255,255,0.8)'
          }}
          animate={{ 
            opacity: [0.8, 1, 0.8],
            boxShadow: [
              '0 0 40px rgba(255,255,255,0.8)',
              '0 0 60px rgba(255,255,255,1)',
              '0 0 40px rgba(255,255,255,0.8)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Ultra-wide base glow for atmosphere */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-20%',
            width: '1600px',
            height: '80vh',
            background: `
              radial-gradient(ellipse 800px 40vh at center top,
                rgba(135,206,235,0.3) 0%,
                rgba(65,105,225,0.15) 40%,
                transparent 70%
              )
            `,
            transform: 'translateX(-50%)',
            filter: 'blur(40px)'
          }}
          animate={{ 
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Left Side Content - Matching Screenshot Layout */}
      <div
        style={{
          position: 'absolute',
          left: '80px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '400px',
          zIndex: 50
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Title */}
            <motion.h1
              style={{
                fontSize: '52px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '16px',
                lineHeight: '1.1',
                textShadow: '0 0 30px rgba(135,206,235,0.5)'
              }}
            >
              {currentContent.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              style={{
                fontSize: '28px',
                fontWeight: '400',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '24px',
                lineHeight: '1.3'
              }}
            >
              {currentContent.subtitle}
            </motion.h2>

            {/* Description */}
            <motion.p
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: '1.6',
                marginBottom: '32px',
                maxWidth: '380px'
              }}
            >
              {currentContent.description}
            </motion.p>

            {/* CTA Button for Home */}
            {activeSection === 'home' && (
              <motion.button
                onClick={() => setActiveSection('portfolio')}
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
                  border: 'none',
                  borderRadius: '30px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(255,107,107,0.3)',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 12px 40px rgba(255,107,107,0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {content.home.cta}
              </motion.button>
            )}

            {/* About Features */}
            {activeSection === 'about' && content.about.features && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                {content.about.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(135,206,235,0.1)',
                      border: '1px solid rgba(135,206,235,0.3)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      backdropFilter: 'blur(10px)'
                    }}
                    whileHover={{ backgroundColor: 'rgba(135,206,235,0.15)' }}
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Portfolio Projects */}
            {activeSection === 'portfolio' && content.portfolio.projects && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                {content.portfolio.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    style={{
                      padding: '16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)'
                    }}
                    whileHover={{ 
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      borderColor: 'rgba(135,206,235,0.4)'
                    }}
                  >
                    <h4 style={{ color: '#FFFFFF', margin: '0 0 4px 0', fontSize: '16px' }}>{project.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 8px 0', fontSize: '14px' }}>{project.desc}</p>
                    <span style={{ color: '#87CEEB', fontSize: '12px' }}>{project.tech}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Services */}
            {activeSection === 'services' && content.services.services && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                {content.services.services.map((service, index) => (
                  <motion.div
                    key={index}
                    style={{
                      padding: '16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <div>
                      <h4 style={{ color: '#FFFFFF', margin: '0 0 4px 0', fontSize: '16px' }}>{service.name}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0', fontSize: '14px' }}>{service.desc}</p>
                    </div>
                    <span style={{ color: '#87CEEB', fontSize: '16px', fontWeight: '600' }}>{service.price}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Contact */}
            {activeSection === 'contact' && (
              <div style={{ marginTop: '20px' }}>
                <div
                  style={{
                    padding: '20px',
                    background: 'rgba(135,206,235,0.1)',
                    border: '1px solid rgba(135,206,235,0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <h4 style={{ color: '#FFFFFF', margin: '0 0 8px 0' }}>Email</h4>
                  <p style={{ color: '#87CEEB', margin: '0', fontSize: '16px' }}>{content.contact.email}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Side UI Panel - Matching Screenshot */}
      <div
        style={{
          position: 'absolute',
          right: '80px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '420px',
          height: '300px',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          zIndex: 50,
          overflow: 'hidden'
        }}
      >
        {/* Panel Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F5F' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27CA3F' }}></div>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Portal Interface</span>
        </div>

        {/* Panel Content */}
        <div style={{ padding: '20px' }}>
          {/* Navigation Menu */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navigation.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    padding: '8px 12px',
                    background: activeSection === item.id 
                      ? 'rgba(135,206,235,0.2)' 
                      : 'rgba(255,255,255,0.05)',
                    border: '1px solid',
                    borderColor: activeSection === item.id 
                      ? 'rgba(135,206,235,0.4)' 
                      : 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Status Indicators */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>System Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Portal Beam</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27CA3F' }}></div>
                  <span style={{ color: '#27CA3F', fontSize: '12px' }}>Active</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Energy Field</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#87CEEB' }}></div>
                  <span style={{ color: '#87CEEB', fontSize: '12px' }}>Stable</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Interface</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFBD2E' }}></div>
                  <span style={{ color: '#FFBD2E', fontSize: '12px' }}>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Navigation Orbs - Floating in energy field */}
      <div style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 100
      }}>
        {navigation.map((item, index) => {
          const angle = (index - 2) * 25; // Spread in arc
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: activeSection === item.id 
                  ? 'radial-gradient(circle, rgba(135,206,235,0.4) 0%, rgba(65,105,225,0.2) 100%)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                border: activeSection === item.id ? '2px solid #87CEEB' : '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(20px)',
                color: '#FFFFFF',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${angle}deg)`,
                boxShadow: activeSection === item.id ? '0 0 20px rgba(135,206,235,0.4)' : 'none'
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 0 25px rgba(135,206,235,0.6)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ transform: `rotate(${-angle}deg)` }}>{item.icon}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Exit Controls */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <motion.button
          onClick={() => window.location.href = window.location.pathname}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,107,107,0.2)',
            border: '1px solid rgba(255,107,107,0.5)',
            borderRadius: '20px',
            color: '#FFFFFF',
            fontSize: '14px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,107,107,0.3)' }}
        >
          ← Exit Portal
        </motion.button>
      </div>
    </div>
  )
}

export default CinematicAuroraPortal