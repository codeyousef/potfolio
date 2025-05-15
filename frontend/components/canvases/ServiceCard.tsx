import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DirectusService, DirectusFile } from './ProjectSculpture'; // Adjust path if needed

interface ServiceCardProps {
  service: DirectusService;
  directusAssetBaseUrl: string;
  index: number; // For staggered animation
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, directusAssetBaseUrl, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: index * 0.15, duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
    },
  };

  const getFullImageUrl = (imageAsset: DirectusFile | string | undefined, presetKey?: string): string => {
    if (!imageAsset) return ''; // Return empty if no image
    const imageId = typeof imageAsset === 'string' ? imageAsset : imageAsset.id;
    const queryParams = presetKey ? `?key=${presetKey}` : '?fit=contain&width=100&height=100&quality=80'; // Default params for an icon-like image
    return `${directusAssetBaseUrl}/assets/${imageId}${queryParams}`;
  };

  const featuredImageUrl = getFullImageUrl(service.featured_image, 'service-icon');
  const featuredImageAlt = typeof service.featured_image === 'object' && service.featured_image?.title 
    ? service.featured_image.title 
    : service.title || 'Service image';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-neutral-800/60 border border-neutral-700/80 rounded-xl p-6 md:p-8 text-center shadow-lg h-full flex flex-col items-center justify-start hover:bg-neutral-750/70 hover:border-primary-accent/40 transition-all duration-300 group"
    >
      {/* Icon or Image */} 
      {service.icon_svg && (
        <div 
          className="w-16 h-16 mb-6 text-primary-accent group-hover:text-primary-accent/80 transition-colors duration-300 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: service.icon_svg }}
        />
      )}
      {!service.icon_svg && featuredImageUrl && (
        <div className="relative w-20 h-20 mb-6 rounded-full overflow-hidden border-2 border-primary-accent/30 group-hover:border-primary-accent/60 transition-all duration-300">
          <Image 
            src={featuredImageUrl}
            alt={featuredImageAlt}
            fill
            className="object-contain p-2"
            sizes="80px"
          />
        </div>
      )}
      {!service.icon_svg && !featuredImageUrl && (
        <div className="w-16 h-16 mb-6 bg-primary-accent/10 rounded-full flex items-center justify-center text-primary-accent text-3xl font-bold group-hover:bg-primary-accent/20 transition-colors duration-300">
          {service.title ? service.title.charAt(0).toUpperCase() : 'S'}
        </div>
      )}

      {/* Title */} 
      <h3 className="text-xl md:text-2xl font-semibold font-heading text-neutral-100 mb-3 group-hover:text-primary-accent transition-colors duration-300">
        {service.title}
      </h3>
      
      {/* Description */} 
      {service.description_rich_text && (
        <div 
          className="text-sm text-neutral-300/90 leading-relaxed prose prose-sm prose-invert max-w-xs prose-p:my-1 prose-ul:my-1 prose-li:my-0.5"
          dangerouslySetInnerHTML={{ __html: service.description_rich_text }}
        />
      )}
    </motion.div>
  );
};

export default ServiceCard;
