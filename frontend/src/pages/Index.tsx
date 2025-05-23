import { AnimatePresence } from 'framer-motion';
import { useAethelframeStore, CanvasId } from '../store/useAethelframeStore';
import { useEffect, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Overture from '../components/sections/Overture';
import SiteShell from '../components/core/SiteShell';

const Index = memo(() => {
  const location = useLocation();
  const { 
    isOvertureVisible, 
    fetchProjects, 
    fetchJournalEntries, 
    fetchServices, 
    setActiveCanvas,
    setJournalTag,
    hideOverture
  } = useAethelframeStore();

  // Use a ref to track whether data has been fetched
  const dataFetchedRef = useRef(false);

  // Set active canvas based on current path when the component mounts
  // This runs once when the component mounts and whenever the location changes
  useEffect(() => {
    const path = location.pathname;
    let canvasId: CanvasId = 'home';

    if (path.startsWith('/projects')) {
      canvasId = 'portfolio';
    } else if (path.startsWith('/services')) {
      canvasId = 'services';
    } else if (path.startsWith('/journal')) {
      canvasId = 'journal';
    } else if (path.startsWith('/contact')) {
      canvasId = 'contact';
    }

    // Log the current path and canvas ID for debugging
    console.log('Current path:', path);
    console.log('Setting active canvas to:', canvasId);

    // Always set the active canvas based on the current URL path
    // This ensures the correct canvas is displayed regardless of what's in localStorage
    setActiveCanvas(canvasId);
  }, [location, setActiveCanvas]); // Run when location or setActiveCanvas changes

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
    // Only fetch data if it hasn't been fetched yet
    if (!dataFetchedRef.current) {
      console.log('Fetching data for the first time');
      fetchProjects();
      fetchJournalEntries();
      fetchServices();
      dataFetchedRef.current = true;
    }
  }, [fetchProjects, fetchJournalEntries, fetchServices]);

  // Check if user has visited before and hide overture if they have
  useEffect(() => {
    console.log('Index: checking if user has visited before');
    const visited = localStorage.getItem('aethelframe_visited');
    console.log('Index: aethelframe_visited =', visited);

    if (visited === 'true') {
      console.log('Index: user has visited before, calling hideOverture()');
      hideOverture();
    } else {
      console.log('Index: user has not visited before, not hiding overture');
    }
  }, [hideOverture]);

  // Log the current state before rendering
  console.log('Index: rendering with isOvertureVisible =', isOvertureVisible);
  console.log('Index: activeCanvasId from localStorage =', localStorage.getItem('aethelframe_activeCanvas'));

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Noise overlay for the entire application */}
      <div className="noise-overlay"></div>

      <AnimatePresence mode="wait" initial={false}>
        {/* Show overture or site shell based on state */}
        {isOvertureVisible ? (
          <Overture key="overture" />
        ) : (
          <SiteShell key="siteshell" />
        )}
      </AnimatePresence>
    </div>
  );
});

export default Index;
