import { motion } from 'framer-motion';
import { useAethelframeStore } from '../../store/useAethelframeStore';

const ContactBeacon = () => {
  const { setActiveCanvas, currentPhase } = useAethelframeStore();
  
  // Only show in growth or bloom phases
  if (currentPhase === 'seed') return null;
  
  return (
    <motion.div 
      className="contact-beacon"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      onClick={() => setActiveCanvas('contact')}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulsing rings */}
      <div className="beacon-rings">
        <motion.div 
          className="ring ring-1"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="ring ring-2"
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>
      
      {/* Center dot */}
      <div className="beacon-center">
        <span className="text-xs font-roboto-mono">Contact</span>
      </div>
    </motion.div>
  );
};

export default ContactBeacon;