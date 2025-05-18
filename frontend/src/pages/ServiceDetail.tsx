import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import directus from '@/lib/directus';
import { DirectusService } from '@/types/directus';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading, error } = useQuery<DirectusService>({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data } = await directus.items('services').readByQuery({
        filter: { slug: { _eq: slug } },
        fields: [
          '*',
          'featured_image.*',
          'related_services.*',
        ],
        limit: 1,
      });
      return data?.[0];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
        <p className="text-gray-400 mb-8">The service you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const directusUrl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
  const imageUrl = service.featured_image && typeof service.featured_image === 'object' && service.featured_image.id 
    ? `${directusUrl}/assets/${service.featured_image.id}?width=1200` 
    : null;

  return (
    <motion.div 
      className="min-h-screen bg-background text-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/#services" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </Button>

        <motion.article 
          className="max-w-4xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <header className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
                {service.tagline && (
                  <p className="text-xl text-primary mb-6">{service.tagline}</p>
                )}
              </div>
              
              {service.icon && (
                <div className="p-4 bg-secondary rounded-lg">
                  <span className="text-4xl">{service.icon}</span>
                </div>
              )}
            </div>
          </header>

          {imageUrl && (
            <motion.div 
              className="mb-12 rounded-lg overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src={imageUrl} 
                alt={service.title} 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </motion.div>
          )}

          <div className="prose prose-invert max-w-none">
            {service.description_rich_text ? (
              <div dangerouslySetInnerHTML={{ __html: service.description_rich_text }} />
            ) : (
              <p className="text-gray-400">{service.description || 'No description available.'}</p>
            )}
          </div>

          {service.process_steps && service.process_steps.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Our Process</h2>
              <div className="space-y-8">
                {service.process_steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    className="bg-secondary/30 p-6 rounded-lg border-l-4 border-primary"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      <span className="text-primary mr-2">0{index + 1}.</span>
                      {step.title}
                    </h3>
                    <p className="text-gray-400">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {service.related_services && service.related_services.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.related_services.map((relatedService) => {
                  if (typeof relatedService !== 'object' || !relatedService.id) return null;
                  return (
                    <motion.div 
                      key={relatedService.id}
                      className="p-6 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors"
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">{relatedService.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {relatedService.description}
                      </p>
                      <Link 
                        to={`/services/${relatedService.slug}`} 
                        className="text-primary hover:underline inline-flex items-center"
                      >
                        Learn more →
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </motion.div>
  );
};

export default ServiceDetail;
