import { motion } from 'framer-motion';
import { useAethelframeStore, CanvasId } from '../../store/useAethelframeStore';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const pages: { id: CanvasId; label: string; path: string }[] = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'portfolio', label: 'Portfolio', path: '/projects' },
  { id: 'services', label: 'Services', path: '/services' },
  { id: 'journal', label: 'Journal', path: '/journal' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

const PageTitlesNav = memo(() => {
  const { activeCanvasId, setActiveCanvas } = useAethelframeStore();
  const navigate = useNavigate();

  // Log the current activeCanvasId
  console.log('PageTitlesNav: rendering with activeCanvasId =', activeCanvasId);
  console.log('PageTitlesNav: activeCanvasId from localStorage =', localStorage.getItem('aethelframe_activeCanvas'));

  // Use the activeCanvasId from the store directly
  // This ensures consistency with the URL path and other components
  console.log('PageTitlesNav: using activeCanvasId =', activeCanvasId);

  const handleNavigation = (page: { id: CanvasId; path: string }) => {
    console.log('PageTitlesNav: handleNavigation called with page =', page);
    console.log('PageTitlesNav: setting activeCanvas to', page.id);

    // First update the activeCanvasId in the store
    setActiveCanvas(page.id);

    // Then navigate to the new path
    console.log('PageTitlesNav: navigating to', page.path);
    navigate(page.path);
  };

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
            onClick={() => handleNavigation(page)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.span 
            className={`text-sm font-light transition-colors cursor-pointer ${
              activeCanvasId === page.id 
                ? 'text-highlight-color' 
                : 'text-white/50 group-hover:text-white/80'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: activeCanvasId === page.id ? 1 : 0, x: activeCanvasId === page.id ? 0 : -10 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleNavigation(page)}
          >
            {page.label}
          </motion.span>
        </div>
      ))}
    </div>
  );
});

export default PageTitlesNav;
