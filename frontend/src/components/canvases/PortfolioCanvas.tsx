import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAethelframeStore } from '@store/useAethelframeStore'
import { Project } from '@types/models'
import { useTranslations } from '../../lib/translations'

interface PortfolioCanvasProps {
  language: 'en' | 'ar'
  isDarkTheme: boolean
}

const PortfolioCanvas: React.FC<PortfolioCanvasProps> = ({ language, isDarkTheme }) => {
  const { 
    currentPhase, 
    projects, 
    projectsPagination,
    activeProjectTechFilter,
    activeProjectTagFilter,
    activeProjectCategoryFilter,
    fetchProjects,
    setProjectTechFilter,
    setProjectTagFilter,
    setProjectCategoryFilter
  } = useAethelframeStore()
  const t = useTranslations(language)
  
  const [currentProject, setCurrentProject] = useState(0)
  const [filterType, setFilterType] = useState<'category' | 'tech' | 'tags'>('category')
  
  // Get unique tech stacks and tags from projects
  const uniqueTechStack = [...new Set(projects.flatMap(p => p.tech_stack || []))]
  const uniqueTags = [...new Set(projects.flatMap(p => p.tags || []))]
  const uniqueCategories = [...new Set(projects.map(p => p.category).filter(Boolean))]
  
  console.log('Filter data:', { 
    projects: projects.length, 
    uniqueTechStack, 
    uniqueTags, 
    uniqueCategories,
    filterType,
    activeFilters: {
      tech: activeProjectTechFilter,
      tag: activeProjectTagFilter,
      category: activeProjectCategoryFilter
    }
  })
  
  // Reset current project when projects change (due to filtering)
  useEffect(() => {
    if (projects.length > 0) {
      setCurrentProject(0)
    }
  }, [projects])
  
  // Get the current project object
  const currentProjectObj = projects[currentProject] || null
  
  // Fetch projects on initial load
  useEffect(() => {
    console.log('Fetching projects with filters:', { 
      tech: activeProjectTechFilter, 
      tag: activeProjectTagFilter, 
      category: activeProjectCategoryFilter 
    })
    fetchProjects(activeProjectTechFilter, activeProjectTagFilter, activeProjectCategoryFilter)
  }, [fetchProjects, activeProjectTechFilter, activeProjectTagFilter, activeProjectCategoryFilter])
  
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

  // Mock projects data if not loaded with bilingual support
  const mockProjects = [
    {
      id: 1,
      title: language === 'ar' ? "مشهد الأحلام الرقمي" : "Digital Dreamscape",
      category: language === 'ar' ? "الرسوم المتحركة ثلاثية الأبعاد" : "3D Animation",
      description: language === 'ar' ? "تجربة واقع افتراضي غامرة تستكشف الحدود بين الواقع والخيال." : "An immersive VR experience exploring the boundaries between reality and imagination.",
      color: "from-red-600 to-red-900"
    },
    {
      id: 2,
      title: language === 'ar' ? "الملاح العصبي" : "Neural Navigator",
      category: language === 'ar' ? "لعبة تفاعلية" : "Interactive Game",
      description: language === 'ar' ? "مغامرة تعتمد على الألغاز تتحدى اللاعبين للتنقل عبر الشبكات العصبية." : "A puzzle-based adventure that challenges players to navigate through neural networks.",
      color: "from-blue-700 to-blue-950"
    },
    {
      id: 3,
      title: language === 'ar' ? "أصداء أثيرية" : "Ethereal Echoes",
      category: language === 'ar' ? "سلسلة منحوتات ثلاثية الأبعاد" : "3D Sculpture Series",
      description: language === 'ar' ? "مجموعة من المنحوتات الرقمية مستوحاة من تفاعل الضوء والظل." : "A collection of digital sculptures inspired by the interplay of light and shadow.",
      color: "from-purple-600 to-purple-900"
    },
    {
      id: 4,
      title: language === 'ar' ? "لوحة الكود" : "Code Canvas",
      category: language === 'ar' ? "الفن التوليدي" : "Generative Art",
      description: language === 'ar' ? "عمل فني خوارزمي يتطور بناءً على تفاعل المشاهد والبيانات البيئية." : "Algorithmic artwork that evolves based on viewer interaction and environmental data.",
      color: "from-teal-600 to-teal-900"
    }
  ]

  const displayProjects = projects.length > 0 ? projects.slice(0, 4).map((project, index) => ({
    id: project.id,
    title: language === 'ar' ? (project.title_ar || project.title) : project.title,
    category: language === 'ar' ? (project.category_ar || project.category || 'مشروع') : (project.category || 'Project'),
    description: language === 'ar' ? (project.description_ar || project.description || 'مشروع رقمي إبداعي') : (project.description || 'A creative digital project'),
    color: mockProjects[index % mockProjects.length].color
  })) : mockProjects

  return (
    <section className={`h-screen pt-32 pb-16 relative bg-gradient-to-b ${currentTheme.gradientMid} ${currentTheme.gradientEnd} ${currentTheme.gradientStart} snap-start flex flex-col justify-center`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Arabic Calligraphy Background Elements */}
      {language === 'ar' && (
        <>
          <ArabicCalligraphyElement className={`absolute top-20 right-10 w-32 h-12 ${currentTheme.textMuted} opacity-20 transform rotate-12`} />
          <ArabicCalligraphyElement className={`absolute bottom-32 left-16 w-24 h-10 ${currentTheme.textMuted} opacity-15 transform -rotate-6`} />
          <ArabicCalligraphyElement className={`absolute top-1/3 left-1/4 w-20 h-8 ${currentTheme.textMuted} opacity-10 transform rotate-45`} />
        </>
      )}
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-6 relative inline-block">
            <span className={`${currentTheme.text}`}>
              {t.portfolio.title}
            </span>
            <span className={`absolute -bottom-2 left-1/4 right-1/4 h-1 ${currentTheme.accentBg} rounded-full`}></span>
          </h2>
        </div>
        
        {/* Filter Type Selector */}
        <div className="flex justify-center gap-2 mb-6">
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Switching to category filter')
              setFilterType('category')
              // Clear other filters when switching to category
              setProjectTechFilter(null)
              setProjectTagFilter(null)
            }}
            className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${filterType === 'category' ? `${currentTheme.accentBg} text-white` : `${currentTheme.cardBg} ${currentTheme.text} hover:${currentTheme.bgTertiary}`} ${currentTheme.border} border`}
            type="button"
          >
            Categories
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Switching to tech filter')
              setFilterType('tech')
              // Clear other filters when switching to tech
              setProjectCategoryFilter(null)
              setProjectTagFilter(null)
            }}
            className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${filterType === 'tech' ? `${currentTheme.accentBg} text-white` : `${currentTheme.cardBg} ${currentTheme.text} hover:${currentTheme.bgTertiary}`} ${currentTheme.border} border`}
            type="button"
          >
            Tech Stack
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('Switching to tags filter')
              setFilterType('tags')
              // Clear other filters when switching to tags
              setProjectCategoryFilter(null)
              setProjectTechFilter(null)
            }}
            className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${filterType === 'tags' ? `${currentTheme.accentBg} text-white` : `${currentTheme.cardBg} ${currentTheme.text} hover:${currentTheme.bgTertiary}`} ${currentTheme.border} border`}
            type="button"
          >
            Tags
          </button>
        </div>
        
        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 min-h-[50px] relative z-20">
          {/* All/Clear Filter Button */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('All Works clicked, filterType:', filterType)
              if (filterType === 'tech') setProjectTechFilter(null)
              else if (filterType === 'tags') setProjectTagFilter(null)
              else if (filterType === 'category') setProjectCategoryFilter(null)
              else {
                setProjectTechFilter(null)
                setProjectTagFilter(null)
                setProjectCategoryFilter(null)
              }
            }}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer ${currentTheme.border} border ${
              (filterType === 'category' && !activeProjectCategoryFilter) ||
              (filterType === 'tech' && !activeProjectTechFilter) ||
              (filterType === 'tags' && !activeProjectTagFilter)
                ? `${currentTheme.accentBg} text-white`
                : `${currentTheme.cardBg} hover:${currentTheme.bgTertiary} ${currentTheme.text}`
            }`}
            type="button"
          >
            {t.portfolio.allWorks}
          </button>
          
          {/* Category Filters */}
          {filterType === 'category' && uniqueCategories.map((category) => (
            <button 
              key={category}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Category clicked:', category, 'Current:', activeProjectCategoryFilter)
                setProjectCategoryFilter(category === activeProjectCategoryFilter ? null : category)
              }}
              className={`px-6 py-2 rounded-full transition-all cursor-pointer ${currentTheme.border} border ${
                activeProjectCategoryFilter === category
                  ? `${currentTheme.accentBg} text-white`
                  : `${currentTheme.cardBg} hover:${currentTheme.bgTertiary} ${currentTheme.text}`
              }`}
              type="button"
            >
              {category}
            </button>
          ))}
          
          {/* Tech Stack Filters */}
          {filterType === 'tech' && uniqueTechStack.map((tech) => (
            <button 
              key={tech}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Tech clicked:', tech, 'Current:', activeProjectTechFilter)
                setProjectTechFilter(tech === activeProjectTechFilter ? null : tech)
              }}
              className={`px-6 py-2 rounded-full transition-all cursor-pointer ${currentTheme.border} border ${
                activeProjectTechFilter === tech
                  ? `${currentTheme.accentBg} text-white`
                  : `${currentTheme.cardBg} hover:${currentTheme.bgTertiary} ${currentTheme.text}`
              }`}
              type="button"
            >
              {tech}
            </button>
          ))}
          
          {/* Tag Filters */}
          {filterType === 'tags' && uniqueTags.map((tag) => (
            <button 
              key={tag}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Tag clicked:', tag, 'Current:', activeProjectTagFilter)
                setProjectTagFilter(tag === activeProjectTagFilter ? null : tag)
              }}
              className={`px-6 py-2 rounded-full transition-all cursor-pointer ${currentTheme.border} border ${
                activeProjectTagFilter === tag
                  ? `${currentTheme.accentBg} text-white`
                  : `${currentTheme.cardBg} hover:${currentTheme.bgTertiary} ${currentTheme.text}`
              }`}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
        
        {/* Project showcase - Circular layout */}
        <div className="project-showcase relative min-h-[600px] mx-auto max-w-7xl">
          <div className="relative flex items-center justify-center min-h-[600px]">
            <div className={`absolute inset-0 rounded-full ${currentTheme.border} border animate-spin opacity-30`} style={{ animationDuration: '30s' }}></div>
            
            {/* Project orbiting elements */}
            {projects.length > 0 ? projects.map((project, index) => {
              const angle = (index * (360 / displayProjects.length)) * (Math.PI / 180)
              const radius = 280  // Increased from 200 to accommodate larger center
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              
              return (
                <button 
                  key={project.id}
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-600 transition-all duration-300 cursor-pointer z-10 ${currentProject === index ? 'scale-125 shadow-lg' : 'scale-100 opacity-70'}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    left: 'calc(50% - 32px)',
                    top: 'calc(50% - 32px)',
                  }}
                  onClick={() => setCurrentProject(index)}
                >
                  <span className="text-xl font-bold text-white">{index + 1}</span>
                </button>
              )
            }) : (
              <div className={`text-center ${currentTheme.textSecondary}`}>
                <p>No projects found with the current filters.</p>
              </div>
            )}
            
            {/* Central Project Display */}
            {currentProjectObj && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-96 h-[480px] ${currentTheme.cardBg} backdrop-blur-md rounded-2xl ${currentTheme.border} border flex flex-col items-center justify-center p-8 transform transition-all duration-500 shadow-2xl overflow-hidden`}>
                
                  {/* Project Screenshot/Preview - Now twice as big */}
                  <div className="w-80 h-64 rounded-xl mb-6 relative overflow-hidden group shadow-2xl">
                    {currentProjectObj.main_image ? (
                      <img 
                        src={currentProjectObj.main_image.file} 
                        alt={`${currentProjectObj.title} screenshot`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className={`w-full h-full ${currentTheme.bgTertiary} flex items-center justify-center`}>
                        <span className={`${currentTheme.textMuted} text-sm`}>No image available</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="absolute top-3 left-8 w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="absolute top-3 left-13 w-3 h-3 rounded-full bg-green-400"></div>
                    <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 to-blue-600 opacity-80`}></div>
                    
                    {/* Overlay with project info on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className={`text-center text-white ${language === 'ar' ? 'font-arabic' : ''}`}>
                        <h4 className="text-lg font-bold mb-2">{currentProjectObj.title}</h4>
                        <p className="text-sm opacity-90">{currentProjectObj.category}</p>
                      </div>
                    </div>
                  </div>
                
                  <div className={`text-center flex-1 flex flex-col justify-between ${language === 'ar' ? 'font-arabic' : ''}`}>
                    <div>
                      <span className={`inline-block px-4 py-2 rounded-full ${currentTheme.bgTertiary} ${currentTheme.border} border text-sm ${currentTheme.accent} mb-3`}>
                        {currentProjectObj.category || 'Uncategorized'}
                      </span>
                      <h3 className={`text-xl font-bold mb-3 ${currentTheme.text}`}>
                        {currentProjectObj.title}
                      </h3>
                      <p className={`${currentTheme.textSecondary} text-sm leading-relaxed mb-4 max-w-sm ${language === 'ar' ? 'text-right' : 'text-left'} mx-auto`}>
                        {currentProjectObj.description}
                      </p>
                      
                      {/* Tech Stack Tags */}
                      {currentProjectObj.tech_stack && currentProjectObj.tech_stack.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-3">
                          {currentProjectObj.tech_stack.slice(0, 3).map((tech, index) => (
                            <span key={index} className={`px-2 py-1 text-xs rounded-full ${currentTheme.bgSecondary} ${currentTheme.textMuted}`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  
                    <div className={`flex gap-3 justify-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      {currentProjectObj.live_url && (
                        <a 
                          href={currentProjectObj.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-5 py-2 rounded-full ${currentTheme.accentBg} hover:opacity-90 transition-all text-sm ${currentTheme.border} border flex items-center gap-2 text-white shadow-lg ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                        >
                          {t.portfolio.liveDemo}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 0-8-3-8-8s3-8 8-8 8 3 8 8-3 8-8 8z"></path>
                            <path d="M21 3l-12 12"></path>
                          </svg>
                        </a>
                      )}
                      {currentProjectObj.repo_url && (
                        <a 
                          href={currentProjectObj.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-5 py-2 rounded-full ${currentTheme.cardBg} hover:${currentTheme.bgTertiary} transition-all text-sm ${currentTheme.border} border flex items-center gap-2 ${currentTheme.text} ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                        >
                          {t.portfolio.viewProject}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={language === 'ar' ? 'transform rotate-180' : ''}>
                            <polyline points="9,18 15,12 9,6"></polyline>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioCanvas