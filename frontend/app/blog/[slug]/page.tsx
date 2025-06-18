'use client';

import { useParams } from 'next/navigation';
import { useJournalEntry } from '@/lib/hooks/useApi';
import { getMediaUrl } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import gsap from 'gsap';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: entry, loading, error } = useJournalEntry(slug);
  const [readProgress, setReadProgress] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track reading progress
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const progress = (scrolled / total) * 100;
      setReadProgress(progress);
      
      // Random glitch while reading
      if (Math.random() > 0.98 && !isGlitching) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isGlitching]);

  useEffect(() => {
    // Highlight random words on hover
    if (contentRef.current) {
      const paragraphs = contentRef.current.querySelectorAll('p');
      paragraphs.forEach(p => {
        const words = p.innerHTML.split(' ');
        p.innerHTML = words.map(word => 
          `<span class="hover:text-violence-pink hover:text-2xl transition-all duration-200 cursor-pointer inline-block">${word}</span>`
        ).join(' ');
      });
    }
  }, [entry]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-6xl">
          <GlitchText text="LOADING THOUGHTS..." intensity="high" />
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <div className="text-2xl text-warning-yellow mb-8">
            <GlitchText text="BRAIN CELL NOT FOUND" intensity="high" />
          </div>
          <Link href="/blog" className="text-toxic-green text-xl hover:text-violence-pink">
            ← ESCAPE TO SAFETY
          </Link>
        </div>
      </div>
    );
  }

  // Calculate read time (but make it chaotic)
  const actualReadTime = Math.ceil((entry.content_rich_text?.length || 0) / 1000);
  const chaosReadTime = Math.floor(Math.random() * 30) + 1;

  return (
    <>
      <ChaosCursor />
      <ExplosiveNav />
      
      {/* Reading Progress Bar (but it lies) */}
      <div className="fixed top-0 left-0 w-full h-2 bg-ghost-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-violence-pink via-toxic-green to-warning-yellow transition-all duration-300"
          style={{ width: `${Math.min(readProgress * 1.5, 100)}%` }}
        />
      </div>

      <main className="bg-void-black text-ghost-white min-h-screen pt-32 pb-16 px-8">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-toxic-green hover:text-violence-pink transition-colors text-xl font-bold"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, { x: -20, duration: 0.3 });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, { x: 0, duration: 0.3 });
            }}
          >
            ← GET ME OUT OF HERE
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          {entry.featured_image && (
            <div className="relative h-[60vh] overflow-hidden mb-8 border-4 border-violence-pink">
              <Image
                src={getMediaUrl(entry.featured_image.file)}
                alt={entry.title}
                fill
                className="object-cover"
                style={{
                  filter: isGlitching ? 'hue-rotate(90deg) saturate(200%)' : 'none',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void-black via-transparent to-transparent" />
              
              {/* Glitch overlay */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity mix-blend-screen">
                <div className="glitch-lines" />
              </div>
            </div>
          )}
          
          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-6">
            {entry.tags.map((tag, index) => (
              <span
                key={tag}
                className="px-4 py-2 bg-toxic-green/20 text-toxic-green text-sm font-bold uppercase transform hover:scale-110 transition-transform"
                style={{ transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)` }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-display mb-8">
            {isGlitching ? (
              <GlitchText text={entry.title} intensity="high" />
            ) : (
              <span className="glitch" data-text={entry.title}>{entry.title}</span>
            )}
          </h1>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-warning-yellow mb-12">
            <div>
              📅 {format(new Date(entry.publication_date), 'MMM d, yyyy')}
              <span className="text-xs opacity-50"> (or was it?)</span>
            </div>
            <div>
              ⏱️ {chaosReadTime} min read
              <span className="text-xs opacity-50"> (trust me)</span>
            </div>
            <div className="text-violence-pink">
              👁️ {Math.floor(Math.random() * 9999)} views
              <span className="text-xs opacity-50"> (and counting)</span>
            </div>
          </div>

          {/* Excerpt */}
          {entry.excerpt && (
            <p className="text-2xl mb-12 text-toxic-green border-l-4 border-toxic-green pl-6">
              {entry.excerpt}
            </p>
          )}

          {/* Main Content */}
          <div ref={contentRef} className="chaos-content">
            {entry.content_rich_text ? (
              <div 
                className="text-lg leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: entry.content_rich_text }}
                style={{
                  filter: isGlitching ? 'blur(1px)' : 'none',
                }}
              />
            ) : (
              <p className="text-xl">{entry.excerpt}</p>
            )}
          </div>

          {/* Random interruptions */}
          <div className="my-16 p-8 bg-violence-pink/10 border-4 border-violence-pink transform rotate-2">
            <p className="text-2xl font-bold text-center">
              {['STILL READING?', 'YOU OKAY?', 'NEED A BREAK?', 'MIND = BLOWN?'][Math.floor(Math.random() * 4)]}
            </p>
          </div>

          {/* Bottom section */}
          <div className="mt-20 pt-8 border-t-4 border-warning-yellow">
            <h3 className="text-3xl font-bold mb-6">WANT MORE CHAOS?</h3>
            
            {/* Tags again but different */}
            <div className="flex flex-wrap gap-3 mb-12">
              {entry.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-6 py-3 bg-transparent border-2 border-toxic-green text-toxic-green font-bold hover:bg-toxic-green hover:text-void-black transition-all transform hover:scale-110 hover:rotate-6"
                >
                  MORE {tag.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Back to blog */}
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-block px-12 py-4 text-2xl font-bold bg-warning-yellow text-void-black hover:bg-violence-pink transition-all duration-200 transform hover:scale-125 hover:rotate-12"
              >
                BACK TO THE MADNESS
              </Link>
            </div>
            
            {/* Final message */}
            <p className="text-center mt-12 text-sm opacity-50">
              You've reached the end. Or have you? 🤔
            </p>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        .chaos-content h2 {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 3rem 0 1.5rem;
          color: var(--toxic-green);
          transform: rotate(-1deg);
        }
        
        .chaos-content h3 {
          font-size: 2rem;
          font-weight: bold;
          margin: 2rem 0 1rem;
          color: var(--warning-yellow);
          transform: rotate(1deg);
        }
        
        .chaos-content p {
          margin-bottom: 1.5rem;
        }
        
        .chaos-content a {
          color: var(--violence-pink);
          text-decoration: underline;
          text-decoration-style: wavy;
          text-underline-offset: 4px;
        }
        
        .chaos-content a:hover {
          color: var(--toxic-green);
          text-decoration-thickness: 3px;
        }
        
        .chaos-content blockquote {
          border-left: 4px solid var(--warning-yellow);
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          transform: rotate(-1deg);
          background: rgba(255, 190, 11, 0.1);
          padding: 1.5rem;
        }
        
        .chaos-content code {
          background: var(--violence-pink);
          color: var(--void-black);
          padding: 0.25rem 0.5rem;
          font-family: monospace;
          font-weight: bold;
        }
        
        .chaos-content pre {
          background: rgba(255, 0, 110, 0.1);
          border: 2px solid var(--violence-pink);
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2rem 0;
          transform: rotate(0.5deg);
        }
        
        .chaos-content img {
          max-width: 100%;
          height: auto;
          margin: 2rem 0;
          border: 4px solid var(--toxic-green);
          transform: rotate(-1deg);
        }
        
        .chaos-content ul,
        .chaos-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .chaos-content li {
          margin-bottom: 0.5rem;
        }
        
        .chaos-content li::marker {
          color: var(--warning-yellow);
          font-weight: bold;
        }
      `}</style>
    </>
  );
}