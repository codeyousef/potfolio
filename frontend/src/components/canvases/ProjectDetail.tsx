import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAethelframeStore } from '@store/useAethelframeStore'
import KineticCanvasWrapper from '@components/core/KineticCanvasWrapper'
import { Project } from '@types/models'
import { getProjectBySlug } from '@lib/api'

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { currentPhase } = useAethelframeStore()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch project on initial load
  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        const data = await getProjectBySlug(slug)
        
        if (data) {
          setProject(data)
          setError(null)
        } else {
          setError('Project not found')
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  // Animation variants based on the current phase
  const contentVariants = {
    seed: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: 'easeInOut', delay: 0.3 }
    },
    growth: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 }
    },
    bloom: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 }
    }
  }

  return (
    <KineticCanvasWrapper>
      <div className="w-full min-h-screen pt-24 pb-12">
        <motion.div 
          className="container mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={contentVariants[currentPhase]}
        >
          {/* Back button */}
          <Link 
            to="/projects" 
            className="inline-flex items-center text-small text-teal-accent hover:underline mb-8"
          >
            ← Back to Projects
          </Link>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-accent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 mb-8">
              <h2 className="text-h4 font-secondary font-bold mb-2 text-red-400">{error}</h2>
              <p className="text-body mb-4">The project you're looking for could not be found.</p>
              <Link 
                to="/projects" 
                className="inline-block px-4 py-2 bg-teal-accent text-white rounded-md hover:bg-teal-accent/80 transition-colors"
              >
                Return to Projects
              </Link>
            </div>
          ) : project ? (
            <div className="max-w-4xl mx-auto">
              {/* Main Image */}
              {project.main_image && (
                <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
                  <img 
                    src={project.main_image.file} 
                    alt={project.title} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-h2 md:text-h1 font-secondary font-bold mb-6">{project.title}</h1>
              
              {/* Year */}
              {project.year && (
                <p className="text-small text-gray-500 mb-4">
                  {project.year}
                </p>
              )}
              
              {/* Tech Stack */}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech_stack.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 bg-gray-800 rounded-full text-small"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Description */}
              {project.description && (
                <p className="text-body mb-6">{project.description}</p>
              )}
              
              {/* Long Description */}
              {project.long_description_html ? (
                <div 
                  className="prose prose-invert max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: project.long_description_html }}
                />
              ) : null}
              
              {/* Project Links */}
              <div className="flex flex-wrap gap-4 mt-8">
                {project.live_url && (
                  <a 
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-teal-accent text-white rounded-full text-small uppercase tracking-wider transition-all hover:bg-teal-accent/90"
                  >
                    View Live
                  </a>
                )}
                
                {project.repo_url && (
                  <a 
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2 border border-gray-700 rounded-full text-small uppercase tracking-wider transition-all hover:border-teal-accent/50"
                  >
                    View Code
                  </a>
                )}
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </KineticCanvasWrapper>
  )
}

export default ProjectDetail