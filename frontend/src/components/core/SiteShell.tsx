import { AnimatePresence } from 'framer-motion';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import PageTitlesNav from '../navigation/PageTitlesNav';
import HomeCanvas from '../canvases/HomeCanvas';
import PortfolioCanvas from '../canvases/PortfolioCanvas';
import ServicesCanvas from '../canvases/ServicesCanvas';
import JournalCanvas from '../canvases/JournalCanvas';
import ContactCanvas from '../canvases/ContactCanvas';
import { memo } from 'react';

const SiteShell = memo(() => {
  const { activeCanvasId } = useAethelframeStore();

  // Log the current activeCanvasId
  console.log('SiteShell: rendering with activeCanvasId =', activeCanvasId);
  console.log('SiteShell: activeCanvasId from localStorage =', localStorage.getItem('aethelframe_activeCanvas'));

  // Use the activeCanvasId from the store directly
  // This ensures consistency with the URL path and other components
  console.log('SiteShell: using activeCanvasId =', activeCanvasId);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="noise-overlay"></div>

      {/* Navigation */}
      <PageTitlesNav />

      {/* Active Canvas */}
      <AnimatePresence mode="wait" initial={false}>
        {activeCanvasId === 'home' && (
          console.log('SiteShell: rendering HomeCanvas'),
          <HomeCanvas key="home" />
        )}
        {activeCanvasId === 'portfolio' && (
          console.log('SiteShell: rendering PortfolioCanvas'),
          <PortfolioCanvas key="portfolio" />
        )}
        {activeCanvasId === 'services' && (
          console.log('SiteShell: rendering ServicesCanvas'),
          <ServicesCanvas key="services" />
        )}
        {activeCanvasId === 'journal' && (
          console.log('SiteShell: rendering JournalCanvas'),
          <JournalCanvas key="journal" />
        )}
        {activeCanvasId === 'contact' && (
          console.log('SiteShell: rendering ContactCanvas'),
          <ContactCanvas key="contact" />
        )}
      </AnimatePresence>
    </div>
  );
});

export default SiteShell;
