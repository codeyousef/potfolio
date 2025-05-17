import { motion } from 'framer-motion';
import { useAethelframeStore, CanvasId } from '../../store/useAethelframeStore';

const positions: { id: CanvasId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'services', label: 'Services' },
  { id: 'journal', label: 'Journal' },
  { id: 'contact', label: 'Contact' },
];

const PositionIndicator = () => {
  const { activeCanvasId, currentPhase } = useAethelframeStore();
  
  // Only show in growth or bloom phases
  if (currentPhase === 'seed') return null;
  
  // Find the active position index
  const activeIndex = positions.findIndex(pos => pos.id === activeCanvasId);
  
  return (
    <div className="position-indicator">
      <div className="indicator-track">
        {positions.map((position, index) => (
          <div 
            key={position.id}
            className={`indicator-point ${activeCanvasId === position.id ? 'active' : ''}`}
          >
            <motion.div 
              className="indicator-dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
            
            {activeCanvasId === position.id && (
              <motion.div 
                className="indicator-label"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {position.label}
              </motion.div>
            )}
          </div>
        ))}
        
        {/* Active position indicator line */}
        <motion.div 
          className="active-indicator-line"
          initial={{ height: 0 }}
          animate={{ 
            height: `${(activeIndex / (positions.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>
    </div>
  );
};

export default PositionIndicator;