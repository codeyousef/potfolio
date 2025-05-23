import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import PortfolioDesign from './PortfolioDesign';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { memo } from 'react';

const PortfolioCanvas = memo(() => {
  const { setActiveCanvas } = useAethelframeStore();

  return (
    <KineticCanvasWrapper id="portfolio">
      <PortfolioDesign hideNavigation={true} />
    </KineticCanvasWrapper>
  );
});

export default PortfolioCanvas;
