'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Overture from '../components/sections/Overture';
import SiteShell from '../components/core/SiteShell';

export default function HomePage() {
  const [showOverture, setShowOverture] = useState(true);

  const handleBeginExperience = () => {
    setShowOverture(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {showOverture ? (
          <Overture key="overture" onBegin={handleBeginExperience} />
        ) : (
          <SiteShell key="siteshell" />
        )}
      </AnimatePresence>
    </main>
  );
}
