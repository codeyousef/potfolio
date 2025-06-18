'use client';

import { useServices, useFeaturedProjects } from '@/lib/hooks/useApi';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/api';
import Link from 'next/link';
import { useEffect } from 'react';
import './boring.css';

export default function BoringPage() {
  const { data: projects = [] } = useFeaturedProjects(6);
  const { data: services = [] } = useServices();

  // Force boring mode and reset all chaos
  useEffect(() => {
    // Remove chaos cursor
    document.body.style.cursor = 'default';
    document.documentElement.style.cursor = 'default';
    
    // Add boring class to body
    document.body.classList.add('boring-mode');
    document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    document.body.style.background = 'white';
    document.body.style.color = '#333';
    
    // Remove any chaos event listeners
    const newBody = document.body.cloneNode(true);
    document.body.parentNode?.replaceChild(newBody, document.body);
    
    return () => {
      document.body.classList.remove('boring-mode');
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'white',
      color: '#333',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      cursor: 'default'
    }}>
      {/* Header */}
      <header style={{ 
        background: '#007bff', 
        color: 'white', 
        padding: '16px 0',
        borderBottom: '1px solid #0056b3'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            margin: 0,
            color: 'white'
          }}>John Developer</h1>
          <nav>
            <ul style={{ 
              display: 'flex', 
              gap: '24px', 
              listStyle: 'none', 
              margin: 0, 
              padding: 0 
            }}>
              <li><Link href="#about" style={{ color: 'white', textDecoration: 'none' }}>About</Link></li>
              <li><Link href="#services" style={{ color: 'white', textDecoration: 'none' }}>Services</Link></li>
              <li><Link href="#portfolio" style={{ color: 'white', textDecoration: 'none' }}>Portfolio</Link></li>
              <li><Link href="#contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link></li>
              <li><Link href="/" style={{ color: '#ffd700', textDecoration: 'none', fontWeight: '500' }}>← Back to Chaos</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        background: '#f8f9fa', 
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#333'
          }}>Professional Web Developer</h2>
          <p style={{ 
            fontSize: '20px', 
            color: '#666', 
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Creating clean, responsive websites with modern technologies
          </p>
          <button style={{ 
            background: '#007bff',
            color: 'white',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Get In Touch
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '64px 0' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '30px', 
            fontWeight: '600', 
            textAlign: 'center', 
            marginBottom: '32px',
            color: '#333'
          }}>About Me</h2>
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            textAlign: 'center' 
          }}>
            <p style={{ 
              fontSize: '18px', 
              marginBottom: '24px',
              lineHeight: '1.7',
              color: '#555'
            }}>
              I am a passionate web developer with over 5 years of experience creating 
              beautiful and functional websites. I specialize in modern web technologies 
              and always strive to deliver high-quality solutions.
            </p>
            <p style={{ 
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#555'
            }}>
              My expertise includes React, Next.js, TypeScript, and various backend 
              technologies. I believe in clean code, user-centered design, and 
              continuous learning.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ 
        padding: '64px 0', 
        background: '#f8f9fa' 
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '30px', 
            fontWeight: '600', 
            textAlign: 'center', 
            marginBottom: '48px',
            color: '#333'
          }}>My Services</h2>
          <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {services.map((service) => (
              <div key={service.id} className="card" style={{
                background: 'white',
                padding: '24px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  color: '#333'
                }}>{service.title}</h3>
                <div style={{ 
                  color: '#666', 
                  lineHeight: '1.6' 
                }} dangerouslySetInnerHTML={{ __html: service.description_rich_text }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">My Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {project.main_image && (
                  <div className="relative h-48">
                    <Image
                      src={getMediaUrl(project.main_image.file)}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.map((tech: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="max-w-2xl mx-auto">
            <form className="bg-white p-8 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 John Developer. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/" className="text-blue-400 hover:underline">
              Miss the chaos? Go back →
            </Link>
          </div>
        </div>
      </footer>

      {/* Hidden message for people who inspect */}
      <div style={{ display: 'none' }}>
        You found the boring site! But the real portfolio is much more fun.
        Email: john@portfolio.com with subject "I PREFER BORING" if you actually want to hire the boring version.
      </div>
    </div>
  );
}