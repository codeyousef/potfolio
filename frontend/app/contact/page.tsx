'use client';

import { useState, useRef } from 'react';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import gsap from 'gsap';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formChaos, setFormChaos] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Chaos mode activated
    setFormChaos(true);
    
    // Make form go crazy
    if (formRef.current) {
      gsap.to(formRef.current, {
        rotation: 720,
        scale: 0,
        duration: 1,
        ease: 'power4.in',
        onComplete: () => {
          alert("Message sent to the void! (Actually sent though)");
          setFormData({ name: '', email: '', message: '' });
          setFormChaos(false);
          gsap.set(formRef.current, { rotation: 0, scale: 1 });
        }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Random glitch on input
    if (Math.random() > 0.9) {
      e.target.style.color = ['var(--violence-pink)', 'var(--toxic-green)', 'var(--warning-yellow)'][Math.floor(Math.random() * 3)];
      setTimeout(() => {
        e.target.style.color = '';
      }, 200);
    }
  };

  return (
    <>
      <ChaosCursor />
      <ExplosiveNav />
      
      <main className="bg-void-black text-ghost-white min-h-screen py-32 px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-8xl font-display mb-8 text-center">
            <GlitchText text="HIRE ME" intensity="high" />
          </h1>
          <p className="text-2xl text-center mb-16 opacity-60">
            (Before someone boring does)
          </p>
          
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xl mb-2 text-violence-pink">
                WHO ARE YOU?
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-transparent border-2 border-violence-pink text-ghost-white focus:border-toxic-green focus:outline-none transition-colors"
                placeholder="Your name (or alias)"
              />
            </div>
            
            <div>
              <label className="block text-xl mb-2 text-toxic-green">
                HOW DO I REACH YOU?
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-transparent border-2 border-toxic-green text-ghost-white focus:border-warning-yellow focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-xl mb-2 text-warning-yellow">
                WHAT'S THE DAMAGE?
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-transparent border-2 border-warning-yellow text-ghost-white focus:border-violence-pink focus:outline-none transition-colors resize-none"
                placeholder="Tell me about your project. The weirder, the better."
              />
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={formChaos}
                className="px-12 py-4 text-2xl font-bold bg-violence-pink text-void-black hover:bg-toxic-green transition-all duration-200 transform hover:scale-110 hover:rotate-3 disabled:opacity-50"
              >
                {formChaos ? 'SENDING TO THE VOID...' : 'SEND IT'}
              </button>
            </div>
          </form>
          
          <div className="mt-16 text-center">
            <p className="text-xl mb-4">OR</p>
            <p className="text-2xl">
              <span className="text-violence-pink">Email:</span>{' '}
              <span className="glitch" data-text="chaos@portfolio.com">
                chaos@portfolio.com
              </span>
            </p>
            <p className="text-sm opacity-50 mt-2">
              (The real one is in the console, obviously)
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border-2 border-violence-pink transform -rotate-3">
              <p className="text-4xl mb-2">⚡</p>
              <p className="text-sm">FAST REPLIES</p>
              <p className="text-xs opacity-50">(if I like you)</p>
            </div>
            <div className="p-4 border-2 border-toxic-green transform rotate-2">
              <p className="text-4xl mb-2">🎯</p>
              <p className="text-sm">100% HONEST</p>
              <p className="text-xs opacity-50">(maybe too honest)</p>
            </div>
            <div className="p-4 border-2 border-warning-yellow transform -rotate-1">
              <p className="text-4xl mb-2">🔥</p>
              <p className="text-sm">NO BORING</p>
              <p className="text-xs opacity-50">(ever)</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}