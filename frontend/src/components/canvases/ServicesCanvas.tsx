import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import ParticleAccent from '../effects/ParticleAccent';
import { useAethelframeStore } from '../../store/useAethelframeStore';
import { DirectusService } from '../../types/directus';

// Extend the DirectusService type to include the slug property
interface ServiceWithSlug extends DirectusService {
  slug: string;
}

interface ServiceCardProps {
  service: ServiceWithSlug;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const directusUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
  const imageUrl = service.featured_image && typeof service.featured_image === 'object' && service.featured_image.id 
    ? `${directusUrl}/assets/${service.featured_image.id}?key=service-thumb` 
    : null;

  return (
    <motion.div 
      className="service-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
    >
      {imageUrl && (
        <div className="service-image">
          <img src={imageUrl} alt={service.title} className="w-full h-32 object-cover" />
        </div>
      )}

      <div className="service-content p-6">
        <h3 className="text-xl font-heading text-highlight-color mb-3">
          <Link to={`/services/${service.slug}`} className="hover:underline">
            {service.title}
          </Link>
        </h3>

        {service.description_rich_text ? (
          <div 
            className="text-gray-400 text-sm"
            dangerouslySetInnerHTML={{ __html: service.description_rich_text }}
          />
        ) : (
          <p className="text-gray-400 text-sm">No description available.</p>
        )}
      </div>
    </motion.div>
  );
};

const ServicesCanvas = () => {
  const { services, isLoading } = useAethelframeStore();

  return (
    <KineticCanvasWrapper id="services">
      <ParticleAccent count={15} />

      <div className="canvas-content-wrapper items-center justify-center text-center p-6">
        <motion.h2 
          className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          Our Services
        </motion.h2>

        {isLoading.services ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-400">No services found.</p>
          </div>
        ) : (
          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              // Ensure the service has a slug before rendering the card
              if (!('slug' in service) || !service.slug) return null;
              return <ServiceCard key={service.id} service={service as ServiceWithSlug} />;
            })}
          </div>
        )}
      </div>
    </KineticCanvasWrapper>
  );
};

export default ServicesCanvas;
