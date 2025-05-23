import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import PortfolioDesign from './PortfolioDesign';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { memo } from 'react';

const JournalCanvas = memo(() => {
  const { setActiveCanvas } = useAethelframeStore();

  return (
    <KineticCanvasWrapper id="journal">
      <PortfolioDesign hideNavigation={true} />
    </KineticCanvasWrapper>
  );
});

export default JournalCanvas;
