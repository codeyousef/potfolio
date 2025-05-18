import { motion } from 'framer-motion';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { DirectusProject } from '../../types/directus';
import { Link } from 'react-router-dom';

interface ProjectSculptureProps {
  project: DirectusProject;
  initialX?: number;
  initialY?: number;
  initialScale?: number;
  initialRotate?: number;
}

const ProjectSculpture = ({
  project,
  initialX = 0,
  initialY = 0,
  initialScale = 1,
  initialRotate = 0
}: ProjectSculptureProps) => {
  const { currentPhase } = useAethelframeStore();

  // Construct image URL from Directus asset ID
  const directusUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
  const imageUrl = project.main_image && typeof project.main_image === 'object' && project.main_image.id 
    ? `${directusUrl}/assets/${project.main_image.id}?key=portfolio-thumb` 
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'; // Default placeholder

  // Adjust the animation based on the current phase
  const getTransition = () => {
    switch(currentPhase) {
      case 'seed': return { duration: 1.5 };
      case 'growth': return { duration: 1.2 };
      case 'bloom': return { duration: 0.8 };
      default: return { duration: 1 };
    }
  };

  return (
    <motion.div
      className="project-sculpture"
      initial={{
        x: initialX,
        y: initialY,
        scale: initialScale,
        rotate: initialRotate,
        opacity: 0
      }}
      animate={{
        x: initialX,
        y: initialY,
        scale: initialScale,
        rotate: initialRotate,
        opacity: 1
      }}
      transition={getTransition()}
      whileHover={{ 
        scale: initialScale * 1.05, 
        zIndex: 10, 
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)' 
      }}
      style={{
        width: 300,
        height: 400,
      }}
    >
      {/* Project Image */}
      <motion.div 
        className="w-full h-full overflow-hidden"
        whileHover={{ scale: 1.1 }}
      >
        <img 
          src={imageUrl} 
          alt={project.title}
          className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all"
        />
      </motion.div>

      {/* Project Title (Always Visible) */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <h3 className="font-heading text-highlight-color text-lg">{project.title}</h3>
      </div>

      {/* Project Info Overlay (On Hover) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4"
        initial={{ y: '100%' }}
        whileHover={{ y: '0%' }}
        transition={{ 
          ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)', 
          duration: 0.4 
        }}
      >
        <p className="text-gray-400 text-sm mb-3">{project.description || 'No description available.'}</p>
        <Link 
          to={`/projects/${project.slug}`}
          className="canvas-action-link text-sm inline-flex items-center"
        >
          Discover <span className="ml-1">→</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ProjectSculpture;
