import './globals.css';
import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'Find USCE — US Clinical Observership Programs for IMGs',
  description: 'Discover 500+ Internal Medicine observership programs across the US. Search by state, USMLE requirements, visa type, and more. Powered by Gemini AI.',
  keywords: 'USCE, observership, IMG, internal medicine, clinical experience, USMLE, residency',
  openGraph: {
    title: 'Find USCE — US Clinical Observership Programs for IMGs',
    description: 'Discover 500+ Internal Medicine observership programs across the US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
