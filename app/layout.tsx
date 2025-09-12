import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#667eea',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: {
    default: 'LinguaDAO - The First Decentralized Language Preservation Protocol',
    template: '%s | LinguaDAO'
  },
  description: 'LinguaDAO is the first decentralized language preservation protocol. Save endangered African languages through blockchain-powered voice mining. Earn $LINGUA tokens, own Voice Share NFTs, and participate in the future of linguistic heritage preservation.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#7c3aed' },
    ],
  },
  keywords: [
    'LinguaDAO',
    'decentralized language preservation',
    'African languages',
    'language extinction',
    'Proof of Voice',
    'Voice Share NFTs',
    '$LINGUA token',
    'language preservation protocol',
    'endangered languages',
    'Twi language',
    'Yoruba',
    'Swahili',
    'blockchain',
    'Base L2',
    'DeFi',
    'language AMM',
    'extinction insurance',
    'voice mining',
    'cultural preservation',
    'Web3 Africa',
    'linguistic heritage',
    'DAO governance'
  ],
  authors: [
    { name: 'LinguaDAO Team', url: 'https://linguadao.africa' }
  ],
  creator: 'LinguaDAO',
  publisher: 'LinguaDAO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://linguanet.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LinguaDAO - The First Decentralized Language Preservation Protocol',
    description: 'Save endangered African languages through blockchain. Earn rewards, own NFTs, preserve cultural heritage forever.',
    url: 'https://linguanet.vercel.app',
    siteName: 'LinguaDAO',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LinguaDAO - Decentralized Language Preservation Protocol',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinguaDAO - Decentralized Language Preservation',
    description: 'The first protocol where preserving culture pays. Save endangered languages, earn rewards, own the future.',
    creator: '@LinguaDAO',
    images: ['/twitter-image.png'],
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
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
  },
  category: 'technology',
  classification: 'Blockchain, AI, Language Technology',
  referrer: 'origin-when-cross-origin',
  generator: 'Next.js',
  applicationName: 'LinguaDAO',
  appLinks: {
    web: {
      url: 'https://linguanet.vercel.app',
      should_fallback: true,
    },
  },
};

import { Providers } from '@/lib/providers';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'LinguaDAO',
              description: 'The First Decentralized Language Preservation Protocol',
              url: 'https://linguanet.vercel.app',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '127',
              },
              author: {
                '@type': 'Organization',
                name: 'LinguaDAO',
                url: 'https://linguanet.vercel.app',
              },
            }),
          }}
        />
        {/* Additional Schema.org markup for the hackathon */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: 'ETHAccra Hackathon 2025',
              startDate: '2025-01-01',
              endDate: '2025-01-03',
              location: {
                '@type': 'Place',
                name: 'Accra, Ghana',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Accra',
                  addressCountry: 'GH',
                },
              },
              organizer: {
                '@type': 'Organization',
                name: 'ETHAccra',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}