import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout';
import CanvasTransition from '../../components/layout/CanvasTransition';
import { getAPI, StrapiResponse } from '../../lib/api';

interface Service {
  title: string;
  slug: string;
  description: string;
}

async function getServicesData() {
  try {
    const response = await getAPI.get<StrapiResponse<Service>>('/services', {
      params: {
        sort: ['title:asc'],
      }
    });
    return {
      services: response.data.data,
    };
  } catch (error) {
    console.error('Error fetching services:', error);
    return {
      services: [],
    };
  }
}

export default async function ServicesPage() {
  const { services } = await getServicesData();
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  return (
    <MainLayout>
      <CanvasTransition isVisible={true} phase="growth">
        <div className="mb-16">
          <h1 className="font-montserrat font-light text-4xl md:text-5xl text-center tracking-wide mt-12 mb-2">
            Services
          </h1>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Specialized expertise offered through a lens of precision, artistry, and innovation.
          </p>
          
          {services.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className="bg-gray-900 rounded-sm overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors duration-300"
                  variants={itemVariants}
                >
                  <div className="p-8">
                    <h3 className="font-montserrat font-light text-xl tracking-wide mb-4 text-white">
                      {service.attributes.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {service.attributes.description}
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <span className="font-['Roboto_Mono'] text-xs text-gray-500 tracking-wider">
                        [SERVICE_ID: {service.attributes.slug}]
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-sm p-8 mt-8 max-w-4xl mx-auto">
              <p className="text-gray-400 font-['Roboto_Mono'] text-sm">No services found</p>
              <p className="text-gray-500 text-xs mt-2">Services will appear here once added to your CMS</p>
            </div>
          )}
          
          <div className="mt-24 max-w-4xl mx-auto">
            <div className="border border-gray-800 rounded-sm p-8 bg-gray-900/50">
              <h2 className="font-montserrat font-light text-2xl mb-4">Custom Collaboration</h2>
              <p className="text-gray-300 mb-4">
                Looking for a tailored solution? Let's discuss how we can collaborate on your unique vision.
              </p>
              <a 
                href="/contact" 
                className="inline-block font-['Roboto_Mono'] text-sm border border-gray-700 px-4 py-2 rounded-sm hover:border-teal-400 hover:text-teal-400 transition-colors duration-300 mt-2"
              >
                Initiate Discussion
              </a>
            </div>
          </div>
        </div>
      </CanvasTransition>
    </MainLayout>
  );
}
