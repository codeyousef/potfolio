'use client';

import { useState, useEffect, useRef } from 'react';
import { useJournalEntries } from '@/lib/hooks/useApi';
import { getMediaUrl } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import GlitchText from '@/components/chaos/GlitchText';
import ChaosCursor from '@/components/chaos/ChaosCursor';
import ExplosiveNav from '@/components/chaos/ExplosiveNav';
import gsap from 'gsap';

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [chaosMode, setChaosMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const postsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: entries, loading, error, hasMore, loadMore } = useJournalEntries(
    selectedTag ? { tag: selectedTag } : undefined
  );

  // Extract unique tags from all entries
  const allTags = Array.from(
    new Set(entries.flatMap(entry => entry.tags))
  );

  useEffect(() => {
    // Random chaos mode activation
    const chaosTimer = setInterval(() => {
      if (Math.random() > 0.95) {
        setChaosMode(true);
        // Scramble all posts
        if (postsRef.current) {
          const posts = postsRef.current.querySelectorAll('.blog-post');
          posts.forEach((post) => {
            gsap.to(post, {
              rotation: Math.random() * 720 - 360,
              scale: Math.random() * 1.5 + 0.5,
              duration: 2,
              ease: 'elastic.out(1, 0.3)',
              onComplete: () => {
                gsap.to(post, {
                  rotation: 0,
                  scale: 1,
                  duration: 1
                });
              }
            });
          });
        }
        setTimeout(() => setChaosMode(false), 3000);
      }
    }, 10000);

    return () => clearInterval(chaosTimer);
  }, []);

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-4xl text-violence-pink glitch" data-text="LOADING...">
          LOADING...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void-black">
        <div className="text-4xl text-warning-yellow">
          <GlitchText text="ERROR 404: BRAIN NOT FOUND" intensity="high" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ChaosCursor />
      <ExplosiveNav />
      
      <main className="bg-void-black text-ghost-white min-h-screen py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-8xl font-display mb-4 text-center">
            <GlitchText text="BRAIN DUMP" intensity="high" />
          </h1>
          <p className="text-2xl text-center mb-16 opacity-60">
            (Warning: May contain traces of sanity)
          </p>
          
          {/* Tag Filter - Chaos Style */}
          {allTags.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedTag('')}
                  className={`px-6 py-3 text-lg font-bold transition-all transform hover:scale-110 ${
                    selectedTag === ''
                      ? 'bg-violence-pink text-void-black rotate-3'
                      : 'bg-transparent border-2 border-toxic-green text-toxic-green hover:bg-toxic-green hover:text-void-black'
                  }`}
                  style={{ transform: selectedTag === '' ? 'rotate(3deg)' : 'rotate(0deg)' }}
                >
                  ALL CHAOS
                </button>
                {allTags.map((tag, index) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-6 py-3 text-lg font-bold transition-all transform hover:scale-110 ${
                      selectedTag === tag
                        ? 'bg-warning-yellow text-void-black'
                        : 'bg-transparent border-2 border-violence-pink text-violence-pink hover:bg-violence-pink hover:text-void-black'
                    }`}
                    style={{ 
                      transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blog Posts - Chaos Grid */}
          <div ref={postsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="blog-post group relative"
                style={{
                  transform: isClient ? `rotate(${Math.random() * 6 - 3}deg)` : 'rotate(0deg)',
                }}
              >
                <Link href={`/blog/${entry.slug}`}>
                  <div className="bg-transparent border-4 border-toxic-green overflow-hidden hover:border-violence-pink transition-all duration-300 group-hover:scale-105">
                    {/* Featured Image with Glitch Effect */}
                    {entry.featured_image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={getMediaUrl(entry.featured_image.file)}
                          alt={entry.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-void-black via-transparent to-transparent" />
                        {/* Glitch overlay on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-screen">
                          <div className="glitch-lines" />
                        </div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Date with attitude */}
                      <time className="text-sm text-warning-yellow">
                        {format(new Date(entry.publication_date), 'MMM d, yyyy')} 
                        <span className="text-xs opacity-50"> (probably)</span>
                      </time>
                      
                      {/* Title */}
                      <h2 className="text-2xl font-bold mt-2 mb-3 group-hover:glitch group-hover:text-violence-pink transition-colors">
                        {chaosMode ? (
                          <GlitchText text={entry.title} intensity="high" />
                        ) : (
                          entry.title
                        )}
                      </h2>
                      
                      {/* Excerpt */}
                      <p className="text-ghost-white/70 line-clamp-3 mb-4">
                        {entry.excerpt}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-violence-pink/20 text-violence-pink text-xs font-bold uppercase"
                            style={{ transform: isClient ? `rotate(${Math.random() * 10 - 5}deg)` : 'rotate(0deg)' }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Random chaos badge */}
                    {isClient && Math.random() > 0.8 && (
                      <div 
                        className="absolute top-4 right-4 bg-warning-yellow text-void-black px-3 py-1 text-sm font-bold animate-pulse"
                        style={{ transform: `rotate(${Math.random() * 30 - 15}deg)` }}
                      >
                        {['FRESH', 'SPICY', 'UNHINGED', 'MUST READ', '!!!'][Math.floor(Math.random() * 5)]}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Load More Button - Chaos Style */}
          {hasMore && (
            <div className="mt-16 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-12 py-4 text-2xl font-bold bg-toxic-green text-void-black hover:bg-violence-pink transition-all duration-200 transform hover:scale-110 hover:rotate-6 disabled:opacity-50"
              >
                {loading ? (
                  <GlitchText text="LOADING..." intensity="medium" />
                ) : (
                  'GIMME MORE CHAOS'
                )}
              </button>
            </div>
          )}
          
          {/* Empty state */}
          {entries.length === 0 && (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🤯</p>
              <p className="text-4xl mb-4">NO THOUGHTS HEAD EMPTY</p>
              <p className="text-xl opacity-60">(Check back when my brain reboots)</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}