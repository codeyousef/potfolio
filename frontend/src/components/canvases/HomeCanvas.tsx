import { motion } from 'framer-motion';
import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import PortfolioDesign from './PortfolioDesign';
import { memo } from 'react';

const HomeCanvas = memo(() => {
  const { currentPhase } = useAethelframeStore();

  return (
    <KineticCanvasWrapper id="home">
      <PortfolioDesign hideNavigation={true} />
    </KineticCanvasWrapper>
  );
});

export default HomeCanvas;
