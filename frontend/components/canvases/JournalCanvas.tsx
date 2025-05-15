'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPublishedJournalEntries } from '@/lib/directus';
import JournalEntryCard from './JournalEntryCard';
import { DirectusJournalEntry } from './ProjectSculpture';

const JournalCanvas = () => {
  const [entries, setEntries] = useState<DirectusJournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const directusAssetBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!directusAssetBaseUrl) {
      setError("NEXT_PUBLIC_API_URL is not set. Cannot fetch journal entries.");
      setIsLoading(false);
      return;
    }

    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const fetchedEntries = await getPublishedJournalEntries();
        setEntries(fetchedEntries);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch journal entries:", err);
        setError("Failed to load journal entries.");
        setEntries([]); // Clear entries on error
      }
      setIsLoading(false);
    };

    fetchEntries();
  }, [directusAssetBaseUrl]); // Dependency array ensures fetch runs if URL changes

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
        delay: 0.3,
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
        <p className="text-neutral-400 text-lg">Loading Field Notes...</p>
        {/* Optional: Add a spinner or more elaborate loading animation here */}
      </div>
    );
  }

  // Error state due to missing API URL is handled by the useEffect setting the error message
  if (error && !entries.length) { // Show error prominently if no entries and error exists
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-start h-full w-full text-center p-8 pt-16 md:pt-24 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="font-montserrat font-medium text-5xl md:text-7xl lg:text-8xl text-secondary-accent leading-tight tracking-tight mb-4 md:mb-6"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Field Notes.
      </motion.h1>
      <motion.p
        className="mb-12 md:mb-16 font-inter text-lg md:text-xl text-brand-off-white/70 max-w-lg"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
      >
        Insights, articles, and reflections from the digital frontier.
      </motion.p>

      {/* Display error message if API URL is missing, but still attempt to show entries if some were loaded before error (less likely with current logic) */}
      {error && entries.length === 0 && !isLoading && (
         <div className="text-center text-red-500 mb-8">
           <p>{error}</p>
         </div>
      )}

      {/* Message for no entries found, ensuring API URL was present and no other error stopped fetching */}
      {!isLoading && !error && entries.length === 0 && (
        <div className="text-center text-neutral-400">
          <p>No journal entries found at the moment. Check back soon!</p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 px-4">
          {entries.map((entry, index) => (
            <JournalEntryCard 
              key={entry.id} 
              entry={entry} 
              directusAssetBaseUrl={directusAssetBaseUrl!}
              index={index}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default JournalCanvas;
