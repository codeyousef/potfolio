import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google'
import '@/styles/chaos.css'

// Futuristic distorted font for headers - Orbitron gives a digital/tech feel
const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-distortion',
  weight: ['400', '700', '900'],
})

// Extended version of Inter for body
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

// Monospace font for code elements
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'DIGITAL CHAOS ENGINE | Portfolio',
    template: '%s | CHAOS'
  },
  description: 'A portfolio that breaks the internet, not just the grid. Warning: May cause confusion, admiration, or both.',
  keywords: ['web developer', 'chaos', 'experimental', 'portfolio', 'creative', 'digital art'],
  authors: [{ name: 'Chaos Creator' }],
  creator: 'Digital Chaos Engine',
  publisher: 'The Void',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'DIGITAL CHAOS ENGINE',
    description: 'Enter at your own risk. This portfolio weaponizes confusion into engagement.',
    url: '/',
    siteName: 'CHAOS ENGINE',
    images: [
      {
        url: '/og-chaos.jpg',
        width: 1200,
        height: 630,
        alt: 'CHAOS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIGITAL CHAOS ENGINE',
    description: 'A portfolio that makes visitors question reality.',
    images: ['/og-chaos.jpg'],
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
  maximumScale: 1,
  userScalable: false, // No escape from the chaos
  themeColor: '#FF006E', // Violence pink
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Console message */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('%c WELCOME TO THE CHAOS ENGINE', 'font-size: 30px; color: #FF006E; font-weight: bold;');
              console.log('%c If you can read this, you\\'re hired.', 'font-size: 14px; color: #00F5FF;');
              console.log('%c Real email: actually@chaos-portfolio.com', 'font-size: 12px; color: #FFBE0B;');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {/* Background chaos effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-violence-pink blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-toxic-green blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-warning-yellow blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
        
        {/* Main content */}
        <div id="chaos-root" className="relative z-10">
          {children}
        </div>
        
        {/* Hidden messages */}
        <div style={{ display: 'none' }}>
          <p>If you're looking at the source code, you're my kind of person.</p>
          <p>Send me a message with the subject "SOURCE CODE EXPLORER" for bonus points.</p>
        </div>
      </body>
    </html>
  )
}