import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/monolith.css'

// Ultra-clean Inter font for the monolith design
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '300', '400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Digital Architect | Premium Portfolio',
    template: '%s | Digital Architect'
  },
  description: 'Crafting tomorrow\'s interfaces with today\'s technology. A portfolio of precision and digital craftsmanship.',
  keywords: ['digital architect', 'ui/ux design', 'frontend development', 'premium design', 'interface design'],
  authors: [{ name: 'Digital Architect' }],
  creator: 'Digital Architect',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Digital Architect',
    description: 'Precision in every pixel. Crafting tomorrow\'s interfaces with today\'s technology.',
    url: '/',
    siteName: 'Digital Architect',
    images: [
      {
        url: '/og-monolith.jpg',
        width: 1200,
        height: 630,
        alt: 'Digital Architect Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Architect',
    description: 'Precision in every pixel. Premium digital craftsmanship.',
    images: ['/og-monolith.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Console message */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('%c DIGITAL ARCHITECT', 'font-size: 24px; color: #FFFFFF; font-weight: 100; font-family: Inter;');
              console.log('%c Precision in every pixel.', 'font-size: 12px; color: rgba(255,255,255,0.6); font-family: Inter;');
              console.log('%c If you appreciate craft, let\\'s talk: hello@digitalarchitect.com', 'font-size: 11px; color: rgba(255,255,255,0.4); font-family: Inter;');
            `,
          }}
        />
      </head>
      <body 
        className="antialiased"
        style={{
          fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
          backgroundColor: '#000000',
          color: '#FFFFFF'
        }}
      >
        {/* Main content */}
        <div className="relative">
          {children}
        </div>
      </body>
    </html>
  )
}