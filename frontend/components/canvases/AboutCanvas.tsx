'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEmergence } from '@/context/EmergenceContext';

// Define skill categories and items
interface SkillItem {
  name: string;
  level: number; // 1-5 scale
}

interface SkillCategory {
  name: string;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Design',
    skills: [
      { name: 'UI/UX Design', level: 5 },
      { name: 'Visual Design', level: 4 },
      { name: 'Design Systems', level: 5 },
      { name: 'Typography', level: 4 },
      { name: 'Motion Design', level: 4 },
    ],
  },
  {
    name: 'Development',
    skills: [
      { name: 'JavaScript/TypeScript', level: 5 },
      { name: 'React.js', level: 5 },
      { name: 'Next.js', level: 4 },
      { name: 'Node.js', level: 4 },
      { name: 'CSS/Tailwind', level: 5 },
    ],
  },
  {
    name: 'Tools',
    skills: [
      { name: 'Figma', level: 5 },
      { name: 'Framer', level: 4 },
      { name: 'Adobe Suite', level: 4 },
      { name: 'Git', level: 4 },
      { name: 'Directus CMS', level: 3 },
    ],
  },
];

const AboutCanvas: React.FC = () => {
  const { currentPhase } = useEmergence();

  // Phase-specific styling
  const getPhaseStyles = () => {
    const baseTitleClass = "text-4xl md:text-5xl lg:text-6xl font-heading font-light tracking-wider mb-8";
    const baseButtonClass = "px-4 py-2 rounded-sm font-mono text-sm transition-all duration-300";
    const baseSubtitleClass = "text-xl md:text-2xl font-heading tracking-wide mb-6";
    
    switch(currentPhase) {
      case 'seed':
        return {
          container: "bg-seed-bg",
          title: `${baseTitleClass} text-seed-accent`,
          subtitle: `${baseSubtitleClass} text-seed-accent/90`,
          text: "text-seed-text",
          button: `${baseButtonClass} border border-seed-accent text-seed-accent hover:bg-seed-accent/10`,
          skill: {
            bar: "bg-seed-accent/20",
            fill: "bg-seed-accent",
            text: "text-seed-text",
          }
        };
      case 'growth':
        return {
          container: "bg-growth-bg",
          title: `${baseTitleClass} text-growth-accent`,
          subtitle: `${baseSubtitleClass} text-growth-accent/90`,
          text: "text-growth-text",
          button: `${baseButtonClass} border border-growth-accent text-growth-accent hover:bg-growth-accent/10`,
          skill: {
            bar: "bg-growth-accent/20",
            fill: "bg-growth-accent",
            text: "text-growth-text",
          }
        };
      case 'bloom':
        return {
          container: "bg-bloom-bg",
          title: `${baseTitleClass} text-bloom-accent`,
          subtitle: `${baseSubtitleClass} text-bloom-accent/90`,
          text: "text-bloom-text",
          button: `${baseButtonClass} border border-bloom-accent text-bloom-accent hover:bg-bloom-accent/10`,
          skill: {
            bar: "bg-bloom-accent/20",
            fill: "bg-bloom-accent",
            text: "text-bloom-text",
          }
        };
      default:
        return {
          container: "bg-black",
          title: baseTitleClass,
          subtitle: baseSubtitleClass,
          text: "text-gray-300",
          button: baseButtonClass,
          skill: {
            bar: "bg-gray-700",
            fill: "bg-gray-400",
            text: "text-gray-300",
          }
        };
    }
  };

  const styles = getPhaseStyles();

  // Animation variants based on current phase
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        when: "beforeChildren", 
        staggerChildren: currentPhase === 'seed' ? 0.15 : currentPhase === 'growth' ? 0.1 : 0.07,
        duration: 0.5 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: currentPhase === 'bloom' ? 0.5 : 0.7,
        ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
      } 
    }
  };

  // Content based on current phase
  const getPhaseContent = () => {
    switch(currentPhase) {
      case 'seed':
        return {
          title: "About",
          intro: "Aethelframe Protocol is an experimental digital atelier at the intersection of code and design.",
          description: "Founded on principles of minimalism and systematic thinking, I craft digital experiences with meticulous attention to detail and a focus on both form and function."
        };
      case 'growth':
        return {
          title: "About",
          intro: "Aethelframe Protocol is a design and development studio creating thoughtful digital experiences.",
          description: "With a background spanning computational design and front-end development, I approach projects as systems to solve and experiences to craft, always with the end-user in mind."
        };
      case 'bloom':
        return {
          title: "About",
          intro: "Aethelframe Protocol is a multidisciplinary creative studio specializing in elevated digital experiences.",
          description: "Merging technical expertise with design sensibility, I create work that balances aesthetic refinement with functional clarity, exploring the boundaries between digital art and thoughtful user experience."
        };
      default:
        return {
          title: "About",
          intro: "Welcome to Aethelframe Protocol.",
          description: "A creative studio working at the intersection of design and technology."
        };
    }
  };

  const content = getPhaseContent();

  return (
    <div className={`min-h-screen w-full py-16 px-6 md:p-16`}>
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.h1 
          className={styles.title}
          variants={itemVariants}
        >
          {content.title}
        </motion.h1>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16" variants={itemVariants}>
          <div>
            <p className={`text-xl md:text-2xl mb-4 font-heading ${styles.text}`}>
              {content.intro}
            </p>
            <p className={`mb-6 font-mono leading-relaxed ${styles.text} opacity-80`}>
              {content.description}
            </p>
            <a 
              href="#" 
              className={`inline-block mt-4 ${styles.button}`}
            >
              Download Resume
            </a>
          </div>

          <div className="relative">
            {/* Abstract decorative element that changes with phases */}
            <div className="aspect-square w-full relative overflow-hidden rounded-sm">
              <div className={`absolute inset-0 border border-neutral-800 rounded-sm`}>
                <motion.div 
                  className={`absolute w-3/4 h-3/4 rounded-full opacity-20 ${
                    currentPhase === 'seed' 
                      ? 'bg-seed-accent' 
                      : currentPhase === 'growth' 
                        ? 'bg-growth-accent' 
                        : 'bg-bloom-accent'
                  }`}
                  initial={{ x: '10%', y: '10%', scale: 0.8 }}
                  animate={{ 
                    x: currentPhase === 'bloom' ? '25%' : '15%', 
                    y: currentPhase === 'bloom' ? '25%' : '15%',
                    scale: currentPhase === 'bloom' ? 0.9 : 0.8,
                    transition: { 
                      duration: 8, 
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                />
                
                <motion.div 
                  className={`absolute w-1/2 h-1/2 rounded-sm rotate-45 opacity-20 ${
                    currentPhase === 'seed' 
                      ? 'bg-seed-accent' 
                      : currentPhase === 'growth' 
                        ? 'bg-growth-accent' 
                        : 'bg-bloom-accent'
                  }`}
                  initial={{ right: '20%', bottom: '20%', rotate: 45 }}
                  animate={{ 
                    rotate: currentPhase === 'bloom' ? 60 : 45,
                    scale: currentPhase === 'bloom' ? 1.1 : 1,
                    right: currentPhase === 'bloom' ? '25%' : '20%',
                    bottom: currentPhase === 'bloom' ? '25%' : '20%',
                    transition: { 
                      duration: 10, 
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.h2 className={styles.subtitle} variants={itemVariants}>
          Skills & Expertise
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={itemVariants}
        >
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <h3 className={`text-lg font-heading mb-4 ${styles.text}`}>{category.name}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-mono ${styles.skill.text}`}>{skill.name}</span>
                      <span className={`text-xs font-mono opacity-60 ${styles.skill.text}`}>
                        {skill.level}/5
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-sm ${styles.skill.bar}`}>
                      <motion.div 
                        className={`h-full rounded-sm ${styles.skill.fill}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.level / 5) * 100}%` }}
                        transition={{ 
                          duration: 1,
                          delay: 0.2 + (categoryIndex * 0.1) + (skillIndex * 0.05),
                          ease: currentPhase === 'bloom' ? [0.34, 1.56, 0.64, 1] : [0.16, 1, 0.3, 1]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Experience Section */}
        <motion.h2 className={styles.subtitle} variants={itemVariants}>
          Experience
        </motion.h2>

        <motion.div 
          className="space-y-8 mb-16"
          variants={itemVariants}
        >
          <div className="border-l-2 border-neutral-800 pl-6 py-2 relative">
            <div className={`absolute w-3 h-3 rounded-full left-[-8px] top-6 ${
              currentPhase === 'seed' 
                ? 'bg-seed-accent' 
                : currentPhase === 'growth' 
                  ? 'bg-growth-accent' 
                  : 'bg-bloom-accent'
            }`} />
            <h3 className={`text-lg font-heading ${styles.text}`}>Lead Designer & Developer</h3>
            <p className={`text-sm font-mono opacity-70 mb-2 ${styles.text}`}>Aethelframe Protocol · 2020 - Present</p>
            <p className={`font-mono text-sm ${styles.text} opacity-80`}>
              Established and led the creative direction of the studio, working with clients across various industries to deliver high-quality digital experiences.
            </p>
          </div>

          <div className="border-l-2 border-neutral-800 pl-6 py-2 relative">
            <div className={`absolute w-3 h-3 rounded-full left-[-8px] top-6 ${
              currentPhase === 'seed' 
                ? 'bg-seed-accent' 
                : currentPhase === 'growth' 
                  ? 'bg-growth-accent' 
                  : 'bg-bloom-accent'
            }`} />
            <h3 className={`text-lg font-heading ${styles.text}`}>Senior UI/UX Designer</h3>
            <p className={`text-sm font-mono opacity-70 mb-2 ${styles.text}`}>Horizon Digital · 2018 - 2020</p>
            <p className={`font-mono text-sm ${styles.text} opacity-80`}>
              Led design initiatives for enterprise clients, creating comprehensive design systems and user-centered interfaces for web and mobile applications.
            </p>
          </div>

          <div className="border-l-2 border-neutral-800 pl-6 py-2 relative">
            <div className={`absolute w-3 h-3 rounded-full left-[-8px] top-6 ${
              currentPhase === 'seed' 
                ? 'bg-seed-accent' 
                : currentPhase === 'growth' 
                  ? 'bg-growth-accent' 
                  : 'bg-bloom-accent'
            }`} />
            <h3 className={`text-lg font-heading ${styles.text}`}>Frontend Developer</h3>
            <p className={`text-sm font-mono opacity-70 mb-2 ${styles.text}`}>Bloom Technologies · 2016 - 2018</p>
            <p className={`font-mono text-sm ${styles.text} opacity-80`}>
              Implemented responsive web applications using modern JavaScript frameworks, focusing on performance optimization and accessibility.
            </p>
          </div>
        </motion.div>

        {/* Footer section */}
        <motion.div 
          className="border-t border-neutral-800 pt-8 mt-16"
          variants={itemVariants}
        >
          <p className={`font-mono text-sm ${styles.text} opacity-70 mb-4`}>
            {currentPhase === 'seed' 
              ? "Always exploring new territories." 
              : currentPhase === 'growth' 
                ? "Constantly evolving, always learning."
                : "Where design meets code, magic happens."}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutCanvas;
