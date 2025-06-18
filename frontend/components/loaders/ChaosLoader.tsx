'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

interface LoadingStage {
  duration: number;
  content: string;
  glitchLevel: 'low' | 'medium' | 'high';
}

const loadingStages: LoadingStage[] = [
  {
    duration: 800,
    content: "INITIALIZING CHAOS ENGINE...",
    glitchLevel: 'high'
  },
  {
    duration: 600,
    content: "LOADING YOUR NIGHTMARES...",
    glitchLevel: 'medium'
  },
  {
    duration: 400,
    content: "ALMOST THERE... OR ARE WE?",
    glitchLevel: 'low'
  }
];

export default function ChaosLoader({ onComplete }: { onComplete: () => void }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [progressWidth, setProgressWidth] = useState(30);
  const [progressPercentage, setProgressPercentage] = useState(50);

  // Set client-side only values after hydration
  useEffect(() => {
    setIsClient(true);
    setProgressWidth(Math.random() * 30 + (currentStage + 1) * 30);
    setProgressPercentage(Math.floor(Math.random() * 50 + 50));
  }, [currentStage]);

  useEffect(() => {
    let stageTimer: NodeJS.Timeout;
    
    const progressToNextStage = () => {
      if (currentStage < loadingStages.length - 1) {
        setCurrentStage(prev => prev + 1);
      } else {
        // Loading complete - trigger exit animation
        gsap.to('.chaos-loader', {
          scale: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power4.in',
          onComplete: () => {
            setIsVisible(false);
            onComplete();
          }
        });
      }
    };

    stageTimer = setTimeout(progressToNextStage, loadingStages[currentStage].duration);

    return () => clearTimeout(stageTimer);
  }, [currentStage, onComplete]);

  if (!isVisible) return null;

  const getGlitchIntensity = () => {
    switch (loadingStages[currentStage].glitchLevel) {
      case 'high':
        return 'animate-pulse';
      case 'medium':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  return (
    <div className="chaos-loader">
      <div className={`chaos-loader-text ${getGlitchIntensity()}`}>
        {loadingStages[currentStage].content.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block"
            style={{
              animationDelay: `${index * 50}ms`,
              color: index % 3 === 0 ? 'var(--violence-pink)' : 
                     index % 3 === 1 ? 'var(--toxic-green)' : 
                     'var(--warning-yellow)'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      
      {/* Progress bar - but it lies */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-64">
        <div className="h-1 bg-white/20 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violence-pink via-toxic-green to-warning-yellow"
            style={{
              width: isClient ? `${progressWidth}%` : '30%',
              transition: 'width 200ms ease-out'
            }}
          />
        </div>
        <p className="text-xs text-center mt-2 opacity-50">
          {isClient ? progressPercentage : 50}% (trust us)
        </p>
      </div>
    </div>
  );
}