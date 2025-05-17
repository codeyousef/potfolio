import { motion } from 'framer-motion';
import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import ParticleAccent from '../effects/ParticleAccent';

const HomeCanvas = () => {
  const { currentPhase, setActiveCanvas } = useAethelframeStore();

  // Different animations and content based on current phase
  const getContent = () => {
    switch(currentPhase) {
      case 'seed':
        return {
          title: "AETHELFRAME",
          subtitle: "Digital Artisan",
          description: "A vessel for digital creation and transformation."
        };
      case 'growth':
        return {
          title: "AETHELFRAME",
          subtitle: "Digital Design & Development Studio",
          description: "Crafting bespoke digital experiences that transform visions into reality."
        };
      case 'bloom':
      default:
        return {
          title: "AETHELFRAME",
          subtitle: "Art Direction & Development",
          description: "An independent creative studio specializing in high-end digital design, art direction, and full-stack development for visionary brands and individuals."
        };
    }
  };

  const content = getContent();

  const titleVariants = {
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

  const subtitleVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        delay: 0.3,
        ease: [0.76, 0, 0.24, 1] 
      }
    }
  };

  const descriptionVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.6,
        ease: [0.76, 0, 0.24, 1] 
      }
    }
  };

  const ctaVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.9,
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };

  return (
    <KineticCanvasWrapper id="home">
      <ParticleAccent count={30} />
      <div className="canvas-content-wrapper items-center justify-center text-center p-6">
        <motion.h1 
          className="page-title"
          variants={titleVariants}
          initial="initial"
          animate="animate"
        >
          {content.title}
        </motion.h1>

        <motion.h2 
          className="text-xl md:text-2xl font-light mb-6 text-white/80"
          variants={subtitleVariants}
          initial="initial"
          animate="animate"
        >
          {content.subtitle}
        </motion.h2>

        <motion.p 
          className="max-w-xl text-base md:text-lg text-white/60 mb-10"
          variants={descriptionVariants}
          initial="initial"
          animate="animate"
        >
          {content.description}
        </motion.p>

        <motion.div
          variants={ctaVariants}
          initial="initial"
          animate="animate"
        >
          <button 
            onClick={() => setActiveCanvas('portfolio')}
            className="canvas-action-link text-base md:text-lg"
          >
            Explore Work
          </button>
        </motion.div>
      </div>
    </KineticCanvasWrapper>
  );
};

export default HomeCanvas;
