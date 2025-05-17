import { AnimatePresence } from 'framer-motion';
import { useAethelframeStore } from '../store/useAethelframeStore';
import { useEffect } from 'react';
import Overture from '../components/sections/Overture';
import SiteShell from '../components/core/SiteShell';

const Index = () => {
  const { isOvertureVisible, fetchProjects, fetchJournalEntries, fetchServices } = useAethelframeStore();
  
  // Fetch data from Directus when the component mounts
  useEffect(() => {
    fetchProjects();
    fetchJournalEntries();
    fetchServices();
  }, [fetchProjects, fetchJournalEntries, fetchServices]);
  
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Noise overlay for the entire application */}
      <div className="noise-overlay"></div>
      
      <AnimatePresence mode="wait">
        {/* Show overture or site shell based on state */}
        {isOvertureVisible ? (
          <Overture key="overture" />
        ) : (
          <SiteShell key="siteshell" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;