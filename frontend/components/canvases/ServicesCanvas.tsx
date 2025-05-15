'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPublishedServices } from '@/lib/directus';
import ServiceCard from './ServiceCard';
import { DirectusService } from './ProjectSculpture';

const ServicesCanvas = () => {
  const [services, setServices] = useState<DirectusService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const directusAssetBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!directusAssetBaseUrl) {
      setError("NEXT_PUBLIC_API_URL is not set. Cannot fetch services.");
      setIsLoading(false);
      return;
    }

    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const fetchedServices = await getPublishedServices();
        setServices(fetchedServices);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Failed to load services.");
        setServices([]); // Clear services on error
      }
      setIsLoading(false);
    };

    fetchServices();
  }, [directusAssetBaseUrl]);

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

  const introTextVariants = {
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
        <p className="text-neutral-400 text-lg">Loading Services Spectrum...</p>
      </div>
    );
  }

  if (error && !services.length) {
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
        className="font-montserrat font-medium text-5xl md:text-7xl lg:text-8xl text-secondary-accent leading-tight tracking-tight mb-8 md:mb-12"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        Services Spectrum.
      </motion.h1>

      <motion.p 
        className="mb-12 md:mb-16 font-inter text-lg md:text-xl text-brand-off-white/70 max-w-xl mx-auto"
        variants={introTextVariants}
        initial="hidden"
        animate="visible"
      >
        Offering a curated selection of services at the intersection of design, technology, and digital artistry to bring your vision to life.
      </motion.p>

      {error && services.length === 0 && !isLoading && (
         <div className="text-center text-red-500 my-10">
           <p>{error}</p>
         </div>
      )}

      {!isLoading && !error && services.length === 0 && (
        <div className="text-center text-neutral-400 my-10">
          <p>No services are currently listed. Please check back later.</p>
        </div>
      )}

      {services.length > 0 && (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 px-4">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              directusAssetBaseUrl={directusAssetBaseUrl!}
              index={index} 
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ServicesCanvas;
