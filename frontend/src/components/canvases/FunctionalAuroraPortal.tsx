import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FunctionalAuroraPortalProps {
  language?: 'en' | 'ar'
}

const FunctionalAuroraPortal: React.FC<FunctionalAuroraPortalProps> = ({ language = 'en' }) => {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track mouse for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Navigation data with real structure
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
      subtitle: 'Aurora Portal System',
      description: 'A revolutionary holographic interface that transforms digital interaction through interdimensional energy fields.',
      actions: [
        { label: 'Explore Portal', action: () => setActiveSection('portfolio') },
        { label: 'Learn More', action: () => setActiveSection('about') }
      ]
    },
    about: {
      title: 'About the Aurora Portal',
      subtitle: 'Interdimensional Interface Technology',
      description: 'The Aurora Portal System represents the next evolution in human-computer interaction, using quantum-entangled light particles to create a truly three-dimensional workspace.',
      features: [
        'Quantum Light Manipulation',
        'Holographic Content Rendering',
        'Gestural Control System',
        'Neural Interface Compatibility'
      ]
    },
    portfolio: {
      title: 'Portfolio Matrix',
      subtitle: 'Digital Constructs & Experiences',
      projects: [
        {
          id: 1,
          title: 'Neural Symphony',
          category: 'AI Art',
          description: 'An AI-generated musical composition that responds to brain activity.',
          tech: ['Neural Networks', 'Audio Synthesis', 'Brain-Computer Interface']
        },
        {
          id: 2,
          title: 'Quantum Garden',
          category: 'Interactive Experience',
          description: 'A virtual garden where plants grow based on quantum probability.',
          tech: ['Quantum Computing', 'Procedural Generation', 'Real-time Physics']
        },
        {
          id: 3,
          title: 'Holographic Archive',
          category: 'Data Visualization',
          description: 'A 3D data archive that stores information in light patterns.',
          tech: ['Holography', 'Data Science', '3D Visualization']
        }
      ]
    },
    services: {
      title: 'Portal Services',
      subtitle: 'Dimensional Engineering Solutions',
      services: [
        {
          name: 'Interface Design',
          description: 'Creating holographic user interfaces for next-generation applications.',
          price: 'From $5,000'
        },
        {
          name: 'Portal Development',
          description: 'Building custom aurora portal systems for enterprise clients.',
          price: 'From $15,000'
        },
        {
          name: 'Quantum Consulting',
          description: 'Strategic guidance on implementing quantum interface technologies.',
          price: 'From $2,500'
        }
      ]
    },
    contact: {
      title: 'Establish Connection',
      subtitle: 'Initiate Portal Communications',
      description: 'Ready to transcend traditional interfaces? Reach out through the quantum communication grid.',
      methods: [
        { type: 'Quantum Mail', value: 'hello@aethelframe.portal' },
        { type: 'Neural Link', value: '+1 (555) AURORA-1' },
        { type: 'Hologram', value: 'Sector 7G, Portal District' }
      ]
    }
  }

  const currentContent = content[activeSection as keyof typeof content]

  return (
    <div
      ref={containerRef}
      className="functional-aurora-portal"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, #001122 0%, #000000 70%)',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Portal Beam - Functional as visual anchor */}
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
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '2px',
            height: '100%',
            background: 'linear-gradient(180deg, #00D4FF 0%, #38B2AC 50%, #001122 100%)',
            transform: 'translateX(-50%)',
            filter: 'blur(1px)'
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '100px',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0,212,255,0.1) 0%, rgba(56,178,172,0.05) 50%, transparent 100%)',
            transform: 'translateX(-50%)',
            filter: 'blur(50px)'
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Navigation Ring - Functional top navigation */}
      <nav style={{
        position: 'fixed',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        gap: '20px'
      }}>
        {navigation.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: activeSection === item.id 
                ? 'radial-gradient(circle, rgba(56,178,172,0.3) 0%, rgba(0,212,255,0.1) 100%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(56,178,172,0.05) 100%)',
              border: activeSection === item.id ? '2px solid #38B2AC' : '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(20px)',
              color: '#FFFFFF',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            whileHover={{ 
              scale: 1.1,
              boxShadow: '0 0 20px rgba(56,178,172,0.5)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            {item.icon}
          </motion.button>
        ))}
      </nav>

      {/* Main Content Area - Functional layout */}
      <main style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '1200px',
        height: '60%',
        zIndex: 50
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            {/* Section Title */}
            <motion.h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FFFFFF 0%, #00D4FF 50%, #38B2AC 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px',
                textShadow: '0 0 30px rgba(56,178,172,0.3)'
              }}
              animate={{ 
                textShadow: [
                  '0 0 30px rgba(56,178,172,0.3)',
                  '0 0 40px rgba(0,212,255,0.4)',
                  '0 0 30px rgba(56,178,172,0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {currentContent.title}
            </motion.h1>

            {/* Section Subtitle */}
            <motion.p
              style={{
                fontSize: '20px',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '32px',
                textShadow: '0 0 10px rgba(0,212,255,0.3)'
              }}
            >
              {currentContent.subtitle}
            </motion.p>

            {/* Content Container */}
            <div style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(56,178,172,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '800px',
              width: '100%'
            }}>
              {/* Home Content */}
              {activeSection === 'home' && (
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', lineHeight: '1.6', marginBottom: '32px' }}>
                    {content.home.description}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    {content.home.actions.map((action, index) => (
                      <motion.button
                        key={index}
                        onClick={action.action}
                        style={{
                          padding: '15px 30px',
                          background: index === 0 
                            ? 'linear-gradient(45deg, #38B2AC 0%, #00D4FF 100%)'
                            : 'transparent',
                          border: '2px solid #38B2AC',
                          borderRadius: '30px',
                          color: '#FFFFFF',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(56,178,172,0.5)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* About Content */}
              {activeSection === 'about' && (
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                    {content.about.description}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {content.about.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        style={{
                          padding: '20px',
                          background: 'rgba(56,178,172,0.1)',
                          border: '1px solid rgba(56,178,172,0.3)',
                          borderRadius: '10px',
                          color: '#FFFFFF'
                        }}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(56,178,172,0.15)' }}
                      >
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{feature}</h4>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Content */}
              {activeSection === 'portfolio' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  {content.portfolio.projects.map((project) => (
                    <motion.div
                      key={project.id}
                      style={{
                        padding: '20px',
                        background: 'rgba(0,212,255,0.1)',
                        border: '1px solid rgba(0,212,255,0.3)',
                        borderRadius: '15px',
                        color: '#FFFFFF'
                      }}
                      whileHover={{ 
                        scale: 1.03, 
                        backgroundColor: 'rgba(0,212,255,0.15)',
                        boxShadow: '0 0 20px rgba(0,212,255,0.3)'
                      }}
                    >
                      <h3 style={{ margin: '0 0 8px 0', color: '#00D4FF' }}>{project.title}</h3>
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                        {project.category}
                      </p>
                      <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.4' }}>
                        {project.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {project.tech.map((tech, index) => (
                          <span
                            key={index}
                            style={{
                              fontSize: '12px',
                              padding: '4px 8px',
                              background: 'rgba(56,178,172,0.2)',
                              borderRadius: '10px',
                              color: '#38B2AC'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Services Content */}
              {activeSection === 'services' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {content.services.services.map((service, index) => (
                    <motion.div
                      key={index}
                      style={{
                        padding: '24px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: '#FFFFFF'
                      }}
                      whileHover={{ 
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(56,178,172,0.5)'
                      }}
                    >
                      <div>
                        <h3 style={{ margin: '0 0 8px 0', color: '#FFFFFF' }}>{service.name}</h3>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>{service.description}</p>
                      </div>
                      <div style={{ color: '#38B2AC', fontWeight: 'bold', fontSize: '18px' }}>
                        {service.price}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Contact Content */}
              {activeSection === 'contact' && (
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                    {content.contact.description}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {content.contact.methods.map((method, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '16px',
                          background: 'rgba(56,178,172,0.1)',
                          border: '1px solid rgba(56,178,172,0.3)',
                          borderRadius: '10px',
                          color: '#FFFFFF'
                        }}
                      >
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{method.type}</span>
                        <span style={{ color: '#38B2AC', fontWeight: 'bold' }}>{method.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

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

      {/* Status Indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '10px 20px',
        background: 'rgba(56,178,172,0.2)',
        border: '1px solid rgba(56,178,172,0.5)',
        borderRadius: '20px',
        color: '#38B2AC',
        fontSize: '12px',
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}>
        Portal Status: {activeSection.toUpperCase()} - ACTIVE
      </div>
    </div>
  )
}

export default FunctionalAuroraPortal