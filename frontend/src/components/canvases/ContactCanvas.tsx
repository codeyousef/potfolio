import { motion } from 'framer-motion';
import { useState } from 'react';
import KineticCanvasWrapper from '../core/KineticCanvasWrapper';
import ParticleAccent from '../effects/ParticleAccent';

const ContactCanvas = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // In a real implementation, you would send the form data to your backend
      // For now, we'll just simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' });
      setFormStatus('success');

      // Reset status after 3 seconds
      setTimeout(() => setFormStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');

      // Reset status after 3 seconds
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  return (
    <KineticCanvasWrapper id="contact">
      <ParticleAccent count={10} />

      <div className="canvas-content-wrapper items-center justify-center text-center p-6 w-full max-w-4xl mx-auto">
        <motion.h2 
          className="page-title mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          Contact
        </motion.h2>

        <div className="w-full flex flex-col items-center">
          {/* Contact Information */}
          <motion.div 
            className="w-full max-w-2xl text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-heading text-highlight-color mb-6">Get in Touch</h3>
            <p className="text-gray-300 mb-8">
              We'd love to hear from you. Whether you have a question about our services, 
              projects, or anything else, our team is ready to answer all your questions.
            </p>
            
            <div className="flex justify-center space-x-12 mb-8">
              <div className="flex items-center">
                <span className="font-mono text-highlight-color mr-2">Email:</span>
                <a href="mailto:hello@aethelframe.com" className="hover:text-highlight-color transition-colors">
                  hello@aethelframe.com
                </a>
              </div>
              <div className="flex items-center">
                <span className="font-mono text-highlight-color mr-2">Location:</span>
                <span>Digital Realm, Creative District</span>
              </div>
            </div>

            <div className="social-links">
              <h4 className="text-sm font-mono text-gray-500 mb-3">CONNECT WITH US</h4>
              <div className="flex justify-center space-x-6">
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div>
                <label htmlFor="name" className="block text-sm font-mono text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-sm px-4 py-2 text-white focus:border-highlight-color focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-mono text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/30 border border-gray-700 rounded-sm px-4 py-2 text-white focus:border-highlight-color focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-mono text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-black/30 border border-gray-700 rounded-sm px-4 py-2 text-white focus:border-highlight-color focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className={`px-6 py-3 border border-highlight-color text-highlight-color hover:bg-highlight-color/10 transition-colors duration-300 ${
                  formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {formStatus === 'success' && (
                <motion.p 
                  className="text-green-500 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Your message has been sent successfully!
                </motion.p>
              )}

              {formStatus === 'error' && (
                <motion.p 
                  className="text-red-500 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  There was an error sending your message. Please try again.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </KineticCanvasWrapper>
  );
};

export default ContactCanvas;
