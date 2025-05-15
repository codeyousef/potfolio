import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getJournalEntryBySlug } from '@/lib/directus';
import { DirectusFile } from '@/components/canvases/ProjectSculpture'; // Assuming interfaces are here
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface JournalEntryPageProps {
    params: {
        slug: string;
    };
}

const JournalEntryPage = async ({ params }: JournalEntryPageProps) => {
    const { slug } = params;
    const entry = await getJournalEntryBySlug(slug);
    const directusAssetBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!entry) {
        notFound();
    }

    const getFullImageUrl = (imageAsset: DirectusFile | string | undefined, presetKey?: string): string => {
        if (!directusAssetBaseUrl || !imageAsset) return '/placeholder-journal-featured.jpg'; // Fallback image
        const imageId = typeof imageAsset === 'string' ? imageAsset : imageAsset.id;
        const queryParams = presetKey ? `?key=${presetKey}` : '?fit=cover&quality=85'; // Default params for featured image
        return `${directusAssetBaseUrl}/assets/${imageId}${queryParams}`;
    };

    const featuredImageUrl = getFullImageUrl(entry.featured_image, 'journal-featured');
    const featuredImageAlt = typeof entry.featured_image === 'object' && entry.featured_image?.title
        ? entry.featured_image.title
        : entry.title || 'Journal entry featured image';

    const formattedDate = entry.publication_date
        ? format(new Date(entry.publication_date), 'MMMM d, yyyy')
        : 'Date not available';

    return (
        <motion.article
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Header Section */}
            <header className="mb-8 md:mb-12 border-b border-neutral-700 pb-8">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-neutral-100 mb-4 leading-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    {entry.title}
                </motion.h1>
                <motion.p
                    className="text-sm font-mono text-neutral-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Published on {formattedDate}
                </motion.p>
                {entry.tags && entry.tags.length > 0 && (
                    <motion.div
                        className="mt-4 flex flex-wrap gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        {entry.tags.map(tag => (
                            <span key={tag} className="bg-primary-accent/10 text-primary-accent text-xs font-mono px-2.5 py-1 rounded-full">
                {tag}
              </span>
                        ))}
                    </motion.div>
                )}
            </header>

            {/* Featured Image */}
            {entry.featured_image && directusAssetBaseUrl && (
                <motion.div
                    className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-lg overflow-hidden mb-8 md:mb-12 shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    <Image
                        src={featuredImageUrl}
                        alt={featuredImageAlt}
                        fill
                        className="object-cover"
                        priority // Prioritize loading of LCP element
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1000px"
                    />
                </motion.div>
            )}

            {/* Content Section */}
            {entry.content_rich_text && (
                <motion.div
                    className="prose prose-lg prose-invert max-w-none
                     prose-headings:font-heading prose-headings:text-neutral-100 prose-headings:font-semibold
                     prose-p:text-neutral-300 prose-p:leading-relaxed
                     prose-a:text-primary-accent prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-neutral-200
                     prose-blockquote:border-primary-accent prose-blockquote:text-neutral-400
                     prose-ul:list-disc prose-ol:list-decimal
                     prose-li:marker:text-primary-accent
                     prose-code:bg-neutral-800 prose-code:text-secondary-accent prose-code:p-1 prose-code:rounded-md prose-code:text-sm
                     prose-img:rounded-md prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: entry.content_rich_text }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                />
            )}

            {!entry.content_rich_text && (
                <p className="text-neutral-400">Content for this entry is not available.</p>
            )}

            {/* Back to Journal Link (Optional) */}
            <motion.div
                className="mt-12 md:mt-16 pt-8 border-t border-neutral-700 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <a href="/journal" className="text-primary-accent hover:text-primary-accent/80 transition-colors duration-300 font-medium">
                    &larr; Back to Field Notes
                </a>
            </motion.div>

        </motion.article>
    );
};

export default JournalEntryPage;