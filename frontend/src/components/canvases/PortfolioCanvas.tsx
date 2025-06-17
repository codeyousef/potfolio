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
    fetchProjects(activeProjectTechFilter, activeProjectTagFilter, activeProjectCategoryFilter)
  }, [fetchProjects, activeProjectTechFilter, activeProjectTagFilter, activeProjectCategoryFilter])

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
    <section className="h-screen pt-32 pb-16 relative snap-start flex flex-col justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 relative inline-block">
              <span className={currentTheme.text}>
                {t.portfolio.title}
              </span>
              <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-teal-500 rounded-full"></span>
            </h2>
            <p className={`text-xl ${currentTheme.textSecondary} max-w-2xl mx-auto mt-6`}>
              {t.portfolio.subtitle}
            </p>
          </div>

          {/* Filter Controls */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
            <div className="flex flex-col gap-4">
              {/* Filter Type Selector */}
              <div className="flex justify-center gap-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setFilterType('category')
                    setProjectTechFilter(null)
                    setProjectTagFilter(null)
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer ${
                    filterType === 'category' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  } border border-white/20`}
                  type="button"
                >
                  Categories
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setFilterType('tech')
                    setProjectCategoryFilter(null)
                    setProjectTagFilter(null)
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer ${
                    filterType === 'tech' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  } border border-white/20`}
                  type="button"
                >
                  Tech Stack
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setFilterType('tags')
                    setProjectCategoryFilter(null)
                    setProjectTechFilter(null)
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer ${
                    filterType === 'tags' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  } border border-white/20`}
                  type="button"
                >
                  Tags
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
                {/* All/Clear Filter Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (filterType === 'tech') setProjectTechFilter(null)
                    else if (filterType === 'tags') setProjectTagFilter(null)
                    else if (filterType === 'category') setProjectCategoryFilter(null)
                  }}
                  className={`px-4 py-1 rounded-full transition-all cursor-pointer border border-white/20 text-xs ${
                    (filterType === 'category' && !activeProjectCategoryFilter) ||
                    (filterType === 'tech' && !activeProjectTechFilter) ||
                    (filterType === 'tags' && !activeProjectTagFilter)
                      ? 'bg-teal-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                  type="button"
                >
                  {t.portfolio.allWorks}
                </button>

                {/* Dynamic Filter Options */}
                {filterType === 'category' && uniqueCategories.slice(0, 5).map((category) => (
                  <button 
                    key={category}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setProjectCategoryFilter(category === activeProjectCategoryFilter ? null : category)
                    }}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer border border-white/20 text-xs ${
                      activeProjectCategoryFilter === category
                        ? 'bg-teal-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    type="button"
                  >
                    {category}
                  </button>
                ))}

                {filterType === 'tech' && uniqueTechStack.slice(0, 5).map((tech) => (
                  <button 
                    key={tech}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setProjectTechFilter(tech === activeProjectTechFilter ? null : tech)
                    }}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer border border-white/20 text-xs ${
                      activeProjectTechFilter === tech
                        ? 'bg-teal-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    type="button"
                  >
                    {tech}
                  </button>
                ))}

                {filterType === 'tags' && uniqueTags.slice(0, 5).map((tag) => (
                  <button 
                    key={tag}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setProjectTagFilter(tag === activeProjectTagFilter ? null : tag)
                    }}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer border border-white/20 text-xs ${
                      activeProjectTagFilter === tag
                        ? 'bg-teal-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? projects.slice(0, 6).map((project, index) => (
              <div key={project.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
                {/* Project Image */}
                <div className="aspect-video rounded-lg overflow-hidden mb-4 relative group">
                  {project.main_image ? (
                    <img 
                      src={project.main_image.file} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-blue-600/20 flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h7l2 3h9a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                  )}
                  
                  {/* Browser Chrome */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                </div>
              
                {/* Content */}
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-teal-400/30 text-xs text-teal-400">
                    {project.category || 'Project'}
                  </span>
                  
                  <h3 className="text-xl font-bold text-white">
                    {language === 'ar' ? (project.title_ar || project.title) : project.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm">
                    {language === 'ar' ? (project.description_ar || project.description) : project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="px-2 py-1 text-xs rounded bg-white/5 text-gray-400 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {project.live_url && (
                      <a 
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-white rounded-full text-xs transition-colors flex items-center gap-1"
                      >
                        {t.portfolio.liveDemo}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15,3 21,3 21,9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    )}
                    {project.repo_url && (
                      <a 
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 rounded-full text-xs transition-colors flex items-center gap-1 border border-white/20"
                      >
                        {t.portfolio.viewProject}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-gray-300 py-10">
                <p>No projects found with the current filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioCanvas
