import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout';
import CanvasTransition from '../../components/layout/CanvasTransition';
import { getAPI, StrapiResponse } from '../../lib/api';

interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
  };
}

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  categories: {
    data: Category[];
  };
  coverImage?: {
    data: {
      attributes: {
        url: string;
        width: number;
        height: number;
        alternativeText?: string;
      };
    };
  };
}

async function getBlogPostsData() {
  try {
    const response = await getAPI.get<StrapiResponse<BlogPost>>('/blog-posts', {
      params: {
        populate: ['categories', 'coverImage'],
        sort: ['createdAt:desc'],
      }
    });
    return {
      posts: response.data.data,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      posts: [],
    };
  }
}

export default async function JournalPage() {
  const { posts } = await getBlogPostsData();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
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
      <CanvasTransition isVisible={true} phase="bloom">
        <div className="mb-16">
          <h1 className="font-montserrat font-light text-4xl md:text-5xl text-center tracking-wide mt-12 mb-2">
            Journal
          </h1>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Explorations, reflections, and discourse on design, technology, and the creative process.
          </p>
          
          {posts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 gap-12 max-w-3xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  className="border-b border-gray-800 pb-12 last:border-b-0"
                  variants={itemVariants}
                >
                  <Link href={`/journal/${post.attributes.slug}`} className="block group">
                    {post.attributes.coverImage?.data && (
                      <div className="relative aspect-video overflow-hidden mb-6 rounded-sm">
                        <Image
                          src={post.attributes.coverImage.data.attributes.url}
                          alt={post.attributes.coverImage.data.attributes.alternativeText || post.attributes.title}
                          width={post.attributes.coverImage.data.attributes.width}
                          height={post.attributes.coverImage.data.attributes.height}
                          className="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="mb-4">
                      {post.attributes.categories?.data.length > 0 && (
                        <div className="flex gap-3 mb-2">
                          {post.attributes.categories.data.map((category) => (
                            <span 
                              key={category.id} 
                              className="text-xs text-gray-400 font-['Roboto_Mono'] tracking-wider"
                            >
                              {category.attributes.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <h2 className="font-montserrat font-light text-2xl mb-2 group-hover:text-white transition-colors duration-300">
                        {post.attributes.title}
                      </h2>
                      
                      <time className="text-sm text-gray-500 block mb-4">
                        {formatDate(post.attributes.createdAt)}
                      </time>
                    </div>
                    
                    <p className="text-gray-400 leading-relaxed">
                      {truncateContent(post.attributes.content)}
                    </p>
                    
                    <div className="mt-4">
                      <span className="inline-block font-['Roboto_Mono'] text-xs text-gray-500 border-b border-gray-700 pb-1 group-hover:text-teal-400 group-hover:border-teal-400 transition-colors duration-300">
                        Read Entry
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-900 rounded-sm p-8 mt-8 max-w-3xl mx-auto">
              <p className="text-gray-400 font-['Roboto_Mono'] text-sm">No journal entries found</p>
              <p className="text-gray-500 text-xs mt-2">Journal entries will appear here once added to your CMS</p>
            </div>
          )}
        </div>
      </CanvasTransition>
    </MainLayout>
  );
}
