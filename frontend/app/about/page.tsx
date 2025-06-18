'use client';

import { useRef, useEffect } from 'react';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import gsap from 'gsap';

export default function AboutPage() {
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Random text mutations
    const mutateText = () => {
      if (!textRef.current) return;
      
      const spans = textRef.current.querySelectorAll('.mutate');
      const randomSpan = spans[Math.floor(Math.random() * spans.length)] as HTMLElement;
      
      gsap.to(randomSpan, {
        scale: Math.random() * 1.5 + 0.8,
        rotation: Math.random() * 20 - 10,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)',
        onComplete: () => {
          gsap.to(randomSpan, {
            scale: 1,
            rotation: 0,
            duration: 0.5
          });
        }
      });
    };
    
    const interval = setInterval(mutateText, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ChaosCursor />
      <ExplosiveNav />
      
      <main className="bg-void-black text-ghost-white min-h-screen py-32 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-8xl font-display mb-16 text-center">
            <GlitchText text="WHO?" intensity="high" />
          </h1>
          
          <div ref={textRef} className="space-y-8 text-2xl">
            <p>
              <span className="mutate inline-block">I'm</span>{' '}
              <span className="mutate inline-block text-violence-pink">that developer</span>{' '}
              <span className="mutate inline-block">your mom</span>{' '}
              <span className="mutate inline-block">warned you about.</span>
            </p>
            
            <p className="text-toxic-green">
              <span className="mutate inline-block">I make</span>{' '}
              <span className="mutate inline-block">websites</span>{' '}
              <span className="mutate inline-block">that make</span>{' '}
              <span className="mutate inline-block">people</span>{' '}
              <span className="mutate inline-block">question</span>{' '}
              <span className="mutate inline-block text-warning-yellow">everything.</span>
            </p>
            
            <p>
              <span className="mutate inline-block">Started</span>{' '}
              <span className="mutate inline-block">coding</span>{' '}
              <span className="mutate inline-block">at 12.</span>{' '}
              <span className="mutate inline-block text-violence-pink">Been ruining</span>{' '}
              <span className="mutate inline-block">the internet</span>{' '}
              <span className="mutate inline-block">ever since.</span>
            </p>
            
            <div className="my-16 p-8 border-4 border-warning-yellow transform rotate-2">
              <h2 className="text-4xl font-bold mb-4">ACHIEVEMENTS</h2>
              <ul className="space-y-2 text-xl">
                <li>• Crashed 3 browsers (intentionally)</li>
                <li>• Made a client cry (tears of joy, allegedly)</li>
                <li>• Got banned from a design forum (badge of honor)</li>
                <li>• 100% completion rate (on projects I like)</li>
                <li>• 0 boring websites delivered</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-8 my-16">
              <div className="p-6 border-2 border-toxic-green transform -rotate-1">
                <h3 className="text-3xl font-bold mb-2 text-toxic-green">SKILLS</h3>
                <p className="text-lg">Everything*</p>
                <p className="text-xs opacity-50 mt-2">*that matters</p>
              </div>
              <div className="p-6 border-2 border-violence-pink transform rotate-1">
                <h3 className="text-3xl font-bold mb-2 text-violence-pink">TOOLS</h3>
                <p className="text-lg">Chaos & VSCode</p>
                <p className="text-xs opacity-50 mt-2">(mostly chaos)</p>
              </div>
            </div>
            
            <p className="text-4xl font-bold text-center my-16">
              <span className="text-warning-yellow">Currently:</span>{' '}
              <span className="glitch" data-text="AVAILABLE">AVAILABLE</span>{' '}
              <span className="text-sm opacity-50">(for the right kind of wrong)</span>
            </p>
            
            <div className="text-center">
              <p className="text-6xl mb-4">📧</p>
              <p className="text-xl opacity-60">
                If you made it this far, you know what to do.
              </p>
              <p className="text-xs opacity-30 mt-2">
                (hint: check the console)
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}