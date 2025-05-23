import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useAethelframeStore, CanvasId } from '../../store/useAethelframeStore';
import ArabicLettersBackground from '../effects/ArabicLettersBackground';
import ArabicCalligraphyElement from '../effects/ArabicCalligraphyElement';
import FloatingParticles from '../effects/FloatingParticles';
import CustomCursor from '../effects/CustomCursor';
import { ChevronRight, ChevronUp, ChevronDown, Mail, MessageCircle, Monitor, PenTool, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioDesign: React.FC<{ hideNavigation?: boolean }> = memo(({ hideNavigation = false }) => {
  const { 
    currentPhase, 
    setActiveCanvas,
    projects,
    services,
    journalEntries,
    activeCanvasId
  } = useAethelframeStore();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(1);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [scrollIndicator, setScrollIndicator] = useState(0);
  const [activeSection, setActiveSection] = useState(activeCanvasId);

  // Function to handle navigation between canvases
  const handleNavigation = (canvasId: CanvasId) => {
    // Map canvas IDs to their corresponding paths
    const paths = {
      'home': '/',
      'portfolio': '/projects',
      'services': '/services',
      'journal': '/journal',
      'contact': '/contact'
    };

    // Update the active canvas in the store
    setActiveCanvas(canvasId);

    // Navigate to the corresponding path if we're not in a canvas
    // This prevents navigation when the component is used within a canvas
    if (!hideNavigation) {
      navigate(paths[canvasId], { replace: true });
    }
  };

  // Update activeSection when activeCanvasId changes
  useEffect(() => {
    // Only update if activeSection is different from activeCanvasId
    if (activeSection !== activeCanvasId) {
      setActiveSection(activeCanvasId);

      // Don't scroll to sections when the component is used in a canvas
      // This prevents interference with navigation between canvases
      if (!hideNavigation) {
        // Scroll to the appropriate section only when in the same canvas
        if (activeCanvasId === 'home' && homeRef.current) {
          homeRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (activeCanvasId === 'portfolio' && portfolioRef.current) {
          portfolioRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (activeCanvasId === 'services' && servicesRef.current) {
          servicesRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (activeCanvasId === 'journal' && blogRef.current) {
          blogRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (activeCanvasId === 'contact' && contactRef.current) {
          contactRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [activeCanvasId, activeSection, hideNavigation]);

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Refs for scrolling to sections
  const homeRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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
  };

  const currentTheme = isDarkTheme ? themeConfig.dark : themeConfig.light;

  // Calculate dynamic background gradient based on phase
  const getPhaseBasedGradient = () => {
    if (isDarkTheme) {
      switch(currentPhase) {
        case 'seed':
          return 'from-red-950 via-black to-black';
        case 'growth':
          return 'from-black via-blue-950 to-black';
        case 'bloom':
        default:
          return 'from-black via-purple-950 to-red-950';
      }
    } else {
      switch(currentPhase) {
        case 'seed':
          return 'from-red-50 via-white to-white';
        case 'growth':
          return 'from-white via-blue-50 to-white';
        case 'bloom':
        default:
          return 'from-white via-purple-50 to-red-50';
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    setMenuOpen(false);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, subject, message });
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    // Show success message or feedback
    alert('Message sent successfully!');
  };

  // Projects data - use actual projects from store if available
  const projectsData = projects.length > 0 ? projects.slice(0, 4).map((project, index) => ({
    id: index + 1,
    title: project.title,
    category: project.category || "Project",
    description: project.description || "A creative project by Aethelframe.",
    color: index % 4 === 0 ? "from-red-600 to-red-900" : 
           index % 4 === 1 ? "from-blue-700 to-blue-950" : 
           index % 4 === 2 ? "from-purple-600 to-purple-900" : 
           "from-teal-600 to-teal-900"
  })) : [
    {
      id: 1,
      title: "Digital Dreamscape",
      category: "3D Animation",
      description: "An immersive VR experience exploring the boundaries between reality and imagination.",
      color: "from-red-600 to-red-900"
    },
    {
      id: 2,
      title: "Neural Navigator",
      category: "Interactive Game",
      description: "A puzzle-based adventure that challenges players to navigate through neural networks.",
      color: "from-blue-700 to-blue-950"
    },
    {
      id: 3,
      title: "Ethereal Echoes",
      category: "3D Sculpture Series",
      description: "A collection of digital sculptures inspired by the interplay of light and shadow.",
      color: "from-purple-600 to-purple-900"
    },
    {
      id: 4,
      title: "Code Canvas",
      category: "Generative Art",
      description: "Algorithmic artwork that evolves based on viewer interaction and environmental data.",
      color: "from-teal-600 to-teal-900"
    }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.76, 0, 0.24, 1] 
      }
    }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] 
      }
    }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 overflow-x-hidden relative bg-gradient-to-br ${getPhaseBasedGradient()}`}>
      <CustomCursor />

      {/* 3D Arabic Letters Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ perspective: '1000px' }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <ArabicLettersBackground />
        </Canvas>
      </div>

      {/* Floating Particles */}
      <FloatingParticles count={20} />

      {/* Scroll Progress Indicator */}
      <motion.div 
        className={`fixed left-0 top-0 h-1 ${currentTheme.accentBg} z-50`} 
        initial={{ width: 0 }}
        animate={{ width: `${scrollIndicator}%` }}
        transition={{ duration: 0.2 }}
      />

      {/* Side Navigation Indicators */}
      {!hideNavigation && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden md:block">
          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { id: 'home', ref: homeRef, canvasId: 'home' as CanvasId },
              { id: 'portfolio', ref: portfolioRef, canvasId: 'portfolio' as CanvasId },
              { id: 'services', ref: servicesRef, canvasId: 'services' as CanvasId },
              { id: 'blog', ref: blogRef, canvasId: 'journal' as CanvasId },
              { id: 'contact', ref: contactRef, canvasId: 'contact' as CanvasId }
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveCanvas(item.canvasId)}
                className={`relative group ${activeSection === item.id ? 'nav-active' : ''}`}
                variants={fadeIn}
              >
                <motion.div 
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === item.id ? `${currentTheme.accentBg}` : `${currentTheme.bgTertiary}`}`}
                  whileHover={{ scale: 1.2 }}
                  animate={{ 
                    scale: activeSection === item.id ? 1.25 : 1
                  }}
                />
                <motion.span 
                  className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 whitespace-nowrap text-sm tracking-wider transition-opacity uppercase font-light text-white"
                  initial={{ x: 10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                >
                  {item.id}
                </motion.span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

      {/* Header */}
      {!hideNavigation && (
        <motion.header 
          className={`fixed w-full py-6 px-8 flex justify-between items-center z-40 transition-all duration-300 ${currentTheme.bg}/90 backdrop-blur-md ${currentTheme.border} border-b`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="logo-container relative">
            <motion.h1 
              className={`text-3xl font-bold ${currentTheme.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AETHEL<span className={currentTheme.accent}>FRAME</span>
            </motion.h1>
            <ArabicCalligraphyElement className={`absolute -bottom-4 left-0 w-full h-8 ${currentTheme.accent} opacity-70 transform scale-110`} />
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${currentTheme.bgTertiary} hover:${currentTheme.accent} transition-all duration-300`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </motion.button>

            <motion.button 
              className={`menu-button p-2 rounded-full ${currentTheme.bgTertiary} hover:${currentTheme.accent} transition-all duration-300`}
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {menuOpen ? <ChevronRight size={24} /> : <ChevronRight size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </motion.header>
      )}

      {/* Navigation menu */}
      {!hideNavigation && (
        <motion.div 
          className={`nav-menu fixed top-0 right-0 h-full w-64 ${currentTheme.bg}/95 backdrop-blur-md ${currentTheme.border} border-l z-50`}
          initial={{ x: '100%' }}
          animate={{ x: menuOpen ? 0 : '100%' }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="p-8 pt-20">
            <motion.ul 
              className="space-y-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                { id: 'home', label: 'Home', ref: homeRef, canvasId: 'home' as CanvasId },
                { id: 'portfolio', label: 'Portfolio', ref: portfolioRef, canvasId: 'portfolio' as CanvasId },
                { id: 'services', label: 'Services', ref: servicesRef, canvasId: 'services' as CanvasId },
                { id: 'blog', label: 'Blog', ref: blogRef, canvasId: 'journal' as CanvasId },
                { id: 'contact', label: 'Contact', ref: contactRef, canvasId: 'contact' as CanvasId }
              ].map((item) => (
                <motion.li key={item.id} variants={fadeInUp}>
                  <motion.button 
                    onClick={() => setActiveCanvas(item.canvasId)} 
                    className={`text-xl hover:${currentTheme.accent} transition-colors flex items-center gap-3 w-full text-left ${activeSection === item.id ? currentTheme.accent : currentTheme.text}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{item.label}</span>
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>

            <ArabicCalligraphyElement className={`w-32 h-20 ${currentTheme.textMuted} mx-auto mt-16`} />

            <motion.div 
              className={`mt-12 pt-6 ${currentTheme.border} border-t`}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <p className={`text-sm ${currentTheme.textMuted}`}>© 2025 AETHELFRAME</p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <main className={`relative ${currentTheme.text}`}>
        {/* Home Section */}
        <section 
          ref={homeRef}
          id="home" 
          className="min-h-screen flex items-center justify-center relative py-20 overflow-hidden"
        >          
          <div className="container mx-auto px-8 pt-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div 
                className="md:w-3/5 relative"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className={`absolute -top-16 -left-8 w-20 h-20 ${currentTheme.maroon} opacity-30 transform rotate-12`}>
                  <ArabicCalligraphyElement className="w-full h-full" />
                </div>

                <motion.h2 className="text-5xl md:text-7xl font-bold mb-6 relative">
                  <motion.div 
                    className="overflow-hidden"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <motion.span 
                      className={`block ${currentTheme.text}`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      Creative Digital
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    className="overflow-hidden mt-2"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <motion.span 
                      className={`block ${currentTheme.accent}`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      Experiences
                    </motion.span>
                  </motion.div>
                </motion.h2>

                <motion.p 
                  className={`text-xl ${currentTheme.textSecondary} max-w-xl mb-10 relative`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  An independent creative studio specializing in high-end digital design, art direction, and full-stack development for visionary brands and individuals.
                  <span className={`absolute -right-6 bottom-0 w-20 h-20 ${currentTheme.accent} opacity-20 transform -rotate-12`}>
                    <ArabicCalligraphyElement className="w-full h-full" />
                  </span>
                </motion.p>

                <motion.div 
                  className="flex flex-wrap gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <motion.button 
                    onClick={() => setActiveCanvas('portfolio')}
                    className={`px-8 py-3 rounded-full ${currentTheme.accentBg} hover:opacity-90 transition-all duration-300 text-white font-medium flex items-center gap-2 shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Work <ChevronRight size={18} />
                  </motion.button>
                  <motion.button 
                    onClick={() => setActiveCanvas('contact')}
                    className={`px-8 py-3 rounded-full border ${currentTheme.border} hover:${currentTheme.bgTertiary} transition-all duration-300 ${currentTheme.text} font-medium`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get in Touch
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="md:w-2/5 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div 
                  className={`relative aspect-square rounded-full overflow-hidden ${currentTheme.cardBg} backdrop-blur-sm p-3 ${currentTheme.border} border shadow-2xl`}
                  animate={{ 
                    rotateY: [0, 10, 0, -10, 0],
                    rotateX: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <div className={`absolute inset-6 rounded-full ${currentTheme.border} border`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-36 relative">
                      <motion.div 
                        className={`absolute inset-0 rounded-full ${currentTheme.accentBg} opacity-60 mix-blend-overlay`}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 0.4, 0.6]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                      <ArabicCalligraphyElement className={`absolute inset-0 ${currentTheme.text} opacity-80 transform scale-150`} />
                    </div>
                  </div>

                  {/* Orbit elements */}
                  <motion.div 
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className={`absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent`}></div>
                    <div className={`absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent`}></div>
                  </motion.div>

                  <motion.div 
                    className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${currentTheme.accentBg} opacity-60 backdrop-blur-md ${currentTheme.border} border shadow-lg`}
                    animate={{ 
                      y: [0, 5, 0, -5, 0],
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                  <motion.div 
                    className={`absolute bottom-10 right-10 w-4 h-4 rounded-full bg-red-500 opacity-60 backdrop-blur-md border border-red-300 shadow-lg`}
                    animate={{ 
                      x: [0, 5, 0, -5, 0],
                      y: [0, -5, 0, 5, 0],
                    }}
                    transition={{ 
                      duration: 7, 
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                  <motion.div 
                    className={`absolute bottom-20 left-10 w-8 h-8 rounded-full bg-blue-600 opacity-60 backdrop-blur-md border border-blue-300 shadow-lg`}
                    animate={{ 
                      x: [0, -5, 0, 5, 0],
                      y: [0, 5, 0, -5, 0],
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                </motion.div>

                <motion.div 
                  className={`absolute -bottom-4 -right-4 p-2 rounded-full ${currentTheme.bgTertiary} backdrop-blur-md flex items-center justify-center shadow-lg`}
                  animate={{ 
                    y: [0, 5, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <ChevronDown size={24} className={`${currentTheme.accent}`} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section 
          ref={portfolioRef}
          id="portfolio" 
          className={`min-h-screen py-32 relative bg-gradient-to-b ${currentTheme.gradientMid} ${currentTheme.gradientEnd} ${currentTheme.gradientStart}`}
        >          
          <div className="container mx-auto px-8 relative z-10">
            <motion.div 
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl font-bold mb-6 relative inline-block">
                <span className={`${currentTheme.text}`}>
                  Selected Works
                </span>
                <motion.span 
                  className={`absolute -bottom-2 left-1/4 right-1/4 h-1 ${currentTheme.accentBg} rounded-full`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </h2>
            </motion.div>

            {/* Project showcase - Circular layout */}
            <motion.div 
              className="project-showcase relative min-h-96 mx-auto max-w-6xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative flex items-center justify-center min-h-96">
                <motion.div 
                  className={`absolute inset-0 rounded-full ${currentTheme.border} border opacity-30`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />

                {/* Project orbiting elements */}
                {projectsData.map((project, index) => {
                  const angle = (index * (360 / projectsData.length)) * (Math.PI / 180);
                  const radius = 200;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.button 
                      key={project.id}
                      className={`absolute w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${project.color} transition-all duration-300 cursor-pointer z-10 ${currentProject === project.id ? 'scale-125 shadow-lg' : 'scale-100 opacity-70'}`}
                      style={{
                        left: 'calc(50% - 32px)',
                        top: 'calc(50% - 32px)',
                      }}
                      animate={{
                        x,
                        y,
                        scale: currentProject === project.id ? 1.25 : 1,
                        opacity: currentProject === project.id ? 1 : 0.7
                      }}
                      transition={{ 
                        duration: 0.5,
                        type: "spring"
                      }}
                      onClick={() => setCurrentProject(project.id)}
                      whileHover={{ scale: currentProject === project.id ? 1.35 : 1.1 }}
                      whileTap={{ scale: currentProject === project.id ? 1.2 : 0.95 }}
                    >
                      <span className="text-xl font-bold text-white">{project.id}</span>
                    </motion.button>
                  );
                })}

                {/* Central Project Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className={`w-80 h-80 ${currentTheme.cardBg} backdrop-blur-md rounded-full ${currentTheme.border} border flex flex-col items-center justify-center p-6 shadow-2xl overflow-hidden`}
                    animate={{ 
                      scale: [1, 1.02, 1],
                      rotate: [0, 1, 0, -1, 0]
                    }}
                    transition={{ 
                      duration: 10, 
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentProject}
                        className="w-full h-full flex flex-col items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Project Screenshot/Preview */}
                        <motion.div 
                          className="w-48 h-32 rounded-lg mb-4 relative overflow-hidden group shadow-xl"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="absolute top-2 left-5 w-2 h-2 rounded-full bg-yellow-400"></div>
                          <div className="absolute top-2 left-8 w-2 h-2 rounded-full bg-green-400"></div>
                          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${projectsData[currentProject-1].color} opacity-80`}></div>
                        </motion.div>

                        <div className="text-center">
                          <motion.span 
                            className={`inline-block px-3 py-1 rounded-full ${currentTheme.bgTertiary} ${currentTheme.border} border text-xs ${currentTheme.accent} mb-2`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            {projectsData[currentProject-1].category}
                          </motion.span>
                          <motion.h3 
                            className={`text-lg font-bold mb-2 ${currentTheme.text}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            {projectsData[currentProject-1].title}
                          </motion.h3>
                          <motion.p 
                            className={`${currentTheme.textSecondary} text-xs leading-relaxed mb-3 max-w-xs`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                          >
                            {projectsData[currentProject-1].description}
                          </motion.p>

                          <motion.button 
                            className={`px-4 py-2 rounded-full ${currentTheme.cardBg} hover:${currentTheme.bgTertiary} transition-all text-xs ${currentTheme.border} border flex items-center gap-2 mx-auto`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCanvas('portfolio')}
                          >
                            View Project <ChevronRight size={12} />
                          </motion.button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section 
          ref={servicesRef}
          id="services" 
          className={`min-h-screen py-32 relative bg-gradient-to-b ${currentTheme.gradientEnd} ${currentTheme.gradientStart} ${currentTheme.gradientMid}`}
        >          
          <div className="container mx-auto px-8 relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl font-bold mb-4 relative inline-block">
                <span className={currentTheme.text}>
                  Services
                </span>
                <motion.span 
                  className={`absolute -bottom-2 left-1/4 right-1/4 h-1 ${currentTheme.accentBg} rounded-full`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </h2>
              <motion.p 
                className={`text-xl ${currentTheme.textSecondary} max-w-2xl mx-auto mt-6`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Specialized creative solutions tailored to your unique vision and requirements
              </motion.p>
            </motion.div>

            {/* Services Grid */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 lg:gap-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Service Cards - use actual services from store if available */}
              {(services.length > 0 ? services.slice(0, 3) : [
                {
                  title: "Web Development",
                  icon: "Monitor",
                  color: "maroon",
                  features: ["Custom website design", "Full-stack development", "Interactive experiences"]
                },
                {
                  title: "3D & Animation",
                  icon: "PenTool",
                  color: "navy",
                  features: ["3D modeling & sculpting", "Character design", "Motion graphics"]
                },
                {
                  title: "Game Development",
                  icon: "Box",
                  color: "accent",
                  features: ["Interactive 3D games", "VR/AR experiences", "Game asset creation"]
                }
              ]).map((service, index) => (
                <motion.div 
                  key={index}
                  className={`flex-1 min-w-80 max-w-96 ${currentTheme.cardBg} backdrop-blur-md rounded-2xl ${currentTheme.border} border p-8 transform transition-all duration-500 hover:shadow-xl group`}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className={`service-icon mb-6 ${currentTheme[service.color as keyof typeof currentTheme]} group-hover:${currentTheme.accent} transition-colors duration-300`}>
                    {service.icon === "Monitor" && <Monitor size={40} />}
                    {service.icon === "PenTool" && <PenTool size={40} />}
                    {service.icon === "Box" && <Box size={40} />}
                  </div>

                  <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>{service.title}</h3>

                  <ul className={`${currentTheme.textSecondary} space-y-2`}>
                    {(service.features || []).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${currentTheme[service.color as keyof typeof currentTheme]} group-hover:${currentTheme.accent} transition-colors`}></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <ArabicCalligraphyElement className={`absolute -bottom-4 -right-4 w-24 h-16 ${currentTheme.textMuted} opacity-20 transform -rotate-12 group-hover:opacity-30 transition-opacity`} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Blog Section */}
        <section 
          ref={blogRef}
          id="blog" 
          className={`min-h-screen py-32 relative bg-gradient-to-b ${currentTheme.gradientStart} ${currentTheme.gradientMid} ${currentTheme.gradientEnd}`}
        >          
          <div className="container mx-auto px-8 relative z-10">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl font-bold mb-4 relative inline-block">
                <span className={currentTheme.text}>
                  Latest Articles
                </span>
                <motion.span 
                  className={`absolute -bottom-2 left-1/4 right-1/4 h-1 ${currentTheme.accentBg} rounded-full`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </h2>
              <motion.p 
                className={`text-xl ${currentTheme.textSecondary} max-w-2xl mx-auto mt-6`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Insights and explorations from the intersection of art, design, and technology
              </motion.p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap justify-center gap-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Blog Posts - use actual journal entries from store if available */}
              {(journalEntries.length > 0 ? journalEntries.slice(0, 3) : [
                {
                  title: "The Future of WebGL and 3D Web Experiences",
                  date: "May 15, 2025",
                  excerpt: "Exploring the latest advancements in WebGL technology and how it's transforming the way we experience content on the web. From interactive product showcases to immersive storytelling...",
                  tags: ["WebGL", "3D"]
                },
                {
                  title: "Arabic Calligraphy in Modern Digital Design",
                  date: "May 2, 2025",
                  excerpt: "How traditional Arabic calligraphy is finding new expression in contemporary digital art and design. We explore the techniques for incorporating these beautiful elements while respecting...",
                  tags: ["Typography", "Culture"]
                },
                {
                  title: "Vaporwave Aesthetics in Contemporary Design",
                  date: "April 22, 2025",
                  excerpt: "A deep dive into how vaporwave aesthetics continue to influence modern digital design, from nostalgic color palettes to glitch art and retro typography. We examine how to incorporate...",
                  tags: ["Aesthetics", "Trends"]
                }
              ]).map((post, index) => (
                <motion.div 
                  key={index}
                  className="blog-post relative group max-w-sm"
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className={`blog-image aspect-video rounded-2xl overflow-hidden flex items-center justify-center mb-0 relative ${currentTheme.cardBg}`}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-600/20"></div>
                    <div className={`absolute top-4 left-4 ${currentTheme.bg}/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs ${currentTheme.accent} flex items-center gap-1`}>
                      <span>{post.date}</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="blog-content p-6 transform group-hover:translate-y-2 transition-transform"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className={`text-xl font-bold mb-3 ${currentTheme.text} group-hover:${currentTheme.accent} transition-colors`}>
                      {post.title}
                    </h3>

                    <p className={`${currentTheme.textMuted} text-sm line-clamp-3`}>
                      {post.excerpt}
                    </p>

                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex space-x-2">
                        {post.tags.map((tag, i) => (
                          <span 
                            key={i}
                            className={`inline-block px-3 py-1 rounded-full ${currentTheme.cardBg} ${currentTheme.border} border ${i % 2 === 0 ? currentTheme.maroon : currentTheme.navy} text-xs`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <motion.button 
                        className={`text-sm ${currentTheme.accent} hover:${currentTheme.text} transition-colors flex items-center gap-1`}
                        whileHover={{ x: 5 }}
                        onClick={() => setActiveCanvas('journal')}
                      >
                        Read More
                        <ChevronRight size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          ref={contactRef}
          id="contact" 
          className={`min-h-screen py-32 relative bg-gradient-to-b ${currentTheme.gradientMid} ${currentTheme.gradientEnd} ${currentTheme.gradientStart}`}
        >          
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-4xl font-bold mb-4 relative inline-block">
                  <span className={currentTheme.text}>
                    Let's Create Together
                  </span>
                  <motion.span 
                    className={`absolute -bottom-2 left-1/4 right-1/4 h-1 ${currentTheme.accentBg} rounded-full`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  />
                </h2>
                <motion.p 
                  className={`text-xl ${currentTheme.textSecondary} max-w-2xl mx-auto mt-6`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Ready to bring your vision to life? Reach out and let's discuss how we can collaborate on your next project.
                </motion.p>
              </motion.div>

              <div className="flex flex-col md:flex-row gap-16 justify-between">
                <motion.div 
                  className="md:w-2/5"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <motion.div 
                    className={`rounded-2xl ${currentTheme.cardBg} backdrop-blur-md ${currentTheme.border} border p-8 transform transition-all duration-500`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full ${currentTheme.bgTertiary} flex items-center justify-center ${currentTheme.text}`}>
                          <Mail size={18} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-medium mb-1 ${currentTheme.text}`}>Email</h3>
                          <p className={currentTheme.accent}>hello@aethelframe.com</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full ${currentTheme.bgTertiary} flex items-center justify-center ${currentTheme.text}`}>
                          <MessageCircle size={18} />
                        </div>
                        <div>
                          <h3 className={`text-lg font-medium mb-1 ${currentTheme.text}`}>Social</h3>
                          <div className="flex gap-4 mt-2">
                            <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>Twitter</a>
                            <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>Instagram</a>
                            <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>Behance</a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <ArabicCalligraphyElement className={`w-40 h-24 ${currentTheme.textMuted} opacity-20 mx-auto mt-12`} />
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="md:w-3/5"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <motion.div 
                    className={`rounded-2xl ${currentTheme.cardBg} backdrop-blur-md ${currentTheme.border} border p-8 transform transition-all duration-500 relative overflow-hidden`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className={`text-2xl font-bold mb-6 relative z-10 ${currentTheme.text}`}>Send a Message</h3>

                    <motion.form 
                      className="space-y-6 relative z-10"
                      onSubmit={handleSubmitMessage}
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={fadeInUp}>
                          <label className={`block text-sm ${currentTheme.textMuted} mb-2`}>Name</label>
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full ${currentTheme.inputBg} ${currentTheme.border} border rounded-full px-6 py-3 ${currentTheme.text} focus:${currentTheme.accent} focus:outline-none transition-colors`}
                            placeholder="Your name"
                          />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                          <label className={`block text-sm ${currentTheme.textMuted} mb-2`}>Email</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full ${currentTheme.inputBg} ${currentTheme.border} border rounded-full px-6 py-3 ${currentTheme.text} focus:${currentTheme.accent} focus:outline-none transition-colors`}
                            placeholder="Your email"
                          />
                        </motion.div>
                      </div>

                      <motion.div variants={fadeInUp}>
                        <label className={`block text-sm ${currentTheme.textMuted} mb-2`}>Subject</label>
                        <input 
                          type="text" 
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className={`w-full ${currentTheme.inputBg} ${currentTheme.border} border rounded-full px-6 py-3 ${currentTheme.text} focus:${currentTheme.accent} focus:outline-none transition-colors`}
                          placeholder="What's this about?"
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <label className={`block text-sm ${currentTheme.textMuted} mb-2`}>Message</label>
                        <textarea 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={`w-full ${currentTheme.inputBg} ${currentTheme.border} border rounded-3xl px-6 py-3 ${currentTheme.text} focus:${currentTheme.accent} focus:outline-none transition-colors min-h-32`}
                          placeholder="Tell me about your project..."
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <motion.button 
                          type="submit"
                          className={`px-8 py-3 rounded-full ${currentTheme.accentBg} hover:opacity-90 transition-all duration-300 text-white font-medium shadow-lg`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Send Message
                        </motion.button>
                      </motion.div>
                    </motion.form>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Back to top button */}
          {!hideNavigation && (
            <motion.button 
              onClick={() => setActiveCanvas('home')}
              className={`back-to-top fixed right-8 bottom-8 w-12 h-12 rounded-full ${currentTheme.bgTertiary} backdrop-blur-sm flex items-center justify-center ${currentTheme.text} z-30 hover:${currentTheme.accent} transition-all duration-300 shadow-lg`}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ChevronUp size={24} />
            </motion.button>
          )}
        </section>

        {/* Footer */}
        <footer className={`py-10 ${currentTheme.bg} ${currentTheme.border} border-t relative z-10`}>
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="logo-container relative">
                <h1 className={`text-2xl font-bold ${currentTheme.text}`}>
                  AETHEL<span className={currentTheme.accent}>FRAME</span>
                </h1>
              </div>

              <p className={`text-sm ${currentTheme.textMuted}`}>
                © 2025 AETHELFRAME. All rights reserved.
              </p>

              <div className="flex gap-4">
                <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>
                  Terms
                </a>
                <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>
                  Privacy
                </a>
                <a href="#" className={`${currentTheme.textMuted} hover:${currentTheme.accent} transition-colors`}>
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
});

export default PortfolioDesign;
