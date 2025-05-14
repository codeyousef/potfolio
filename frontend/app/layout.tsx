import type { Metadata } from 'next';
import { Inter, Montserrat, Roboto_Mono } from 'next/font/google';
import './globals.css';
// import './components.css'; // Temporarily commented out for diagnosis

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300'],
  display: 'swap'
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300'],
  display: 'swap'
});

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  weight: ['400'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Aethelframe Protocol',
  description: 'An interactive portfolio experience showcasing Emergence Theme',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${robotoMono.variable}`}>
      <body className="font-sans bg-blue-500 text-brand-text">
        {children}
      </body>
    </html>
  );
}
