import { motion } from 'framer-motion';
import { useAethelframeStore, CanvasId } from '../../store/useAethelframeStore';

const pages: { id: CanvasId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'services', label: 'Services' },
  { id: 'journal', label: 'Journal' },
  { id: 'contact', label: 'Contact' },
];

const PageTitlesNav = () => {
  const { activeCanvasId, setActiveCanvas } = useAethelframeStore();
  
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-6">
      {pages.map((page, index) => (
        <div key={page.id} className="flex items-center space-x-3 group">
          <motion.div
            className={`w-2 h-2 rounded-full transition-colors ${
              activeCanvasId === page.id 
                ? 'bg-highlight-color' 
                : 'bg-white/30 group-hover:bg-white/50'
            }`}
            onClick={() => setActiveCanvas(page.id)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.span 
            className={`text-sm font-light transition-colors ${
              activeCanvasId === page.id 
                ? 'text-highlight-color' 
                : 'text-white/50 group-hover:text-white/80'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: activeCanvasId === page.id ? 1 : 0, x: activeCanvasId === page.id ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            {page.label}
          </motion.span>
        </div>
      ))}
    </div>
  );
};

export default PageTitlesNav;
