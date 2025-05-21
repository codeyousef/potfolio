import { AnimatePresence } from 'framer-motion';
import { useAethelframeStore } from '../store/useAethelframeStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Overture from '../components/sections/Overture';
import SiteShell from '../components/core/SiteShell';

const Index = () => {
  const location = useLocation();
  const { 
    isOvertureVisible, 
    fetchProjects, 
    fetchJournalEntries, 
    fetchServices, 
    setActiveCanvas,
    setJournalTag 
  } = useAethelframeStore();

  // Check if we have a journal tag in the location state
  useEffect(() => {
    if (location.state && location.state.journalTag) {
      // Set the active canvas to journal
      setActiveCanvas('journal');
      // Set the journal tag filter
      setJournalTag(location.state.journalTag);
    }
  }, [location.state, setActiveCanvas, setJournalTag]);

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
