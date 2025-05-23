import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import PortfolioDesign from './PortfolioDesign';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { memo } from 'react';

const ContactCanvas = memo(() => {
  const { setActiveCanvas } = useAethelframeStore();

  return (
    <KineticCanvasWrapper id="contact">
      <PortfolioDesign hideNavigation={true} />
    </KineticCanvasWrapper>
  );
});

export default ContactCanvas;
