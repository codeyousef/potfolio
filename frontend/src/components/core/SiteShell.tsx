import { AnimatePresence } from 'framer-motion';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import CuratorLensNav from '../navigation/CuratorLensNav';
import PositionIndicator from '../navigation/PositionIndicator';
import ContactBeacon from '../navigation/ContactBeacon';
import HomeCanvas from '../canvases/HomeCanvas';
import PortfolioCanvas from '../canvases/PortfolioCanvas';
import ServicesCanvas from '../canvases/ServicesCanvas';
import JournalCanvas from '../canvases/JournalCanvas';
import ContactCanvas from '../canvases/ContactCanvas';

const SiteShell = () => {
  const { activeCanvasId } = useAethelframeStore();

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="noise-overlay"></div>
      
      {/* Navigation Components */}
      <CuratorLensNav />
      <PositionIndicator />
      <ContactBeacon />
      
      {/* Active Canvas */}
      <AnimatePresence mode="wait">
        {activeCanvasId === 'home' && <HomeCanvas key="home" />}
        {activeCanvasId === 'portfolio' && <PortfolioCanvas key="portfolio" />}
        {activeCanvasId === 'services' && <ServicesCanvas key="services" />}
        {activeCanvasId === 'journal' && <JournalCanvas key="journal" />}
        {activeCanvasId === 'contact' && <ContactCanvas key="contact" />}
      </AnimatePresence>
    </div>
  );
};

export default SiteShell;