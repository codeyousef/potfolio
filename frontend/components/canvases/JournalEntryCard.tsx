'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DirectusJournalEntry, DirectusFile } from './ProjectSculpture'; 
import { format } from 'date-fns'; // For formatting dates

interface JournalEntryCardProps {
  entry: DirectusJournalEntry;
  directusAssetBaseUrl: string;
  index: number; // For staggered animation
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, directusAssetBaseUrl, index }) => {
  const getFullImageUrl = (imageAsset: DirectusFile | string | undefined, presetKey?: string): string => {
    if (!imageAsset) return '/placeholder-journal-thumb.jpg'; // Fallback journal image
    const imageId = typeof imageAsset === 'string' ? imageAsset : imageAsset.id;
    const queryParams = presetKey ? `?key=${presetKey}` : '?fit=cover&width=400&height=225&quality=75'; // Default params for a card
    return `${directusAssetBaseUrl}/assets/${imageId}${queryParams}`;
  };

  const featuredImageUrl = getFullImageUrl(entry.featured_image, 'journal-thumb');
  const featuredImageAlt = typeof entry.featured_image === 'object' && entry.featured_image?.title 
    ? entry.featured_image.title 
    : entry.title || 'Journal entry featured image';

  const formattedDate = entry.publication_date 
    ? format(new Date(entry.publication_date), 'MMMM d, yyyy') 
    : 'Date not available';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-neutral-800/70 border border-neutral-700/90 rounded-lg overflow-hidden shadow-md h-full flex flex-col group transition-all duration-300 hover:border-primary-accent/50"
    >
      <Link href={`/journal/${entry.slug}`} className="block">
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <Image
            src={featuredImageUrl}
            alt={featuredImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/journal/${entry.slug}`} className="block mb-2">
          <h3 className="text-xl font-semibold font-heading text-neutral-100 group-hover:text-primary-accent transition-colors duration-300 line-clamp-2" title={entry.title}>
            {entry.title}
          </h3>
        </Link>
        <p className="text-xs font-mono text-neutral-400 mb-3">
          {formattedDate}
        </p>
        {entry.excerpt && (
          <p className="text-sm text-neutral-300 mb-4 line-clamp-3 flex-grow">
            {entry.excerpt}
          </p>
        )}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {entry.tags.slice(0, 3).map(tag => (
              <span key={tag} className="bg-primary-accent/10 text-primary-accent text-xs font-mono px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link href={`/journal/${entry.slug}`} className="mt-auto inline-block text-sm font-medium text-primary-accent hover:text-primary-accent/80 transition-colors duration-300 self-start">
          Read More &rarr;
        </Link>
      </div>
    </motion.div>
  );
};

export default JournalEntryCard;
