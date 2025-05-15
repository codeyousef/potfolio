import type { Metadata } from 'next';
import { Inter, Montserrat, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import EmergenceProvider from '../context/EmergenceContext';

// Configure fonts with variable support and appropriate weights
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['200', '300', '400'],
  display: 'swap'
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['200', '300', '400', '500'],
  display: 'swap'
});

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  weight: ['300', '400'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Aethelframe Protocol | Emergence',
  description: 'An interactive portfolio journey through the phases of Emergence - from Seed to Bloom.',
  keywords: ['portfolio', 'design', 'art', 'fashion', 'interactive', 'emergence'],
  creator: 'Aethelframe',
  metadataBase: new URL('https://aethelframe.com'),
  openGraph: {
    title: 'Aethelframe Protocol | Emergence',
    description: 'An interactive portfolio journey through the phases of Emergence - from Seed to Bloom.',
    url: 'https://aethelframe.com',
    siteName: 'Aethelframe Protocol',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aethelframe Protocol | Emergence',
    description: 'An interactive portfolio journey through the phases of Emergence - from Seed to Bloom.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${robotoMono.variable}`}>
      <body className="font-sans bg-brand-bg text-brand-text">
        <EmergenceProvider>
          {children}
          <Analytics />
        </EmergenceProvider>
      </body>
    </html>
  );
}
