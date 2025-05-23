import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import PortfolioDesign from './PortfolioDesign';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { memo } from 'react';

const ServicesCanvas = memo(() => {
  const { setActiveCanvas } = useAethelframeStore();

  return (
    <KineticCanvasWrapper id="services">
      <PortfolioDesign hideNavigation={true} />
    </KineticCanvasWrapper>
  );
});

export default ServicesCanvas;
