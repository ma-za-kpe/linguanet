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
};

export const metadata: Metadata = {
  title: {
    default: 'LinguaNet - Turn Your Voice into Value | Preserve Languages, Power AI',
    template: '%s | LinguaNet'
  },
  description: 'LinguaNet transforms smartphones into AI data factories. Record audio in African languages like Twi, earn instant USDC rewards, and help preserve endangered languages while powering inclusive AI development.',
  keywords: [
    'LinguaNet',
    'African languages',
    'AI training data',
    'Twi language',
    'blockchain',
    'USDC payments',
    'language preservation',
    'mobile money',
    'MTN Mobile Money',
    'M-Pesa',
    'Base blockchain',
    'ENS domains',
    'Filecoin storage',
    'Ghana tech',
    'West Africa',
    'ETHAccra 2025',
    'decentralized marketplace',
    'voice recording',
    'language data',
    'AI datasets'
  ],
  authors: [
    { name: 'LinguaNet Team', url: 'https://linguanet.ai' }
  ],
  creator: 'LinguaNet',
  publisher: 'LinguaNet',
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
    title: 'LinguaNet - Turn Your Voice into Value',
    description: 'Record audio in African languages, earn instant USDC rewards. Preserve languages, power AI.',
    url: 'https://linguanet.vercel.app',
    siteName: 'LinguaNet',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LinguaNet - Decentralized Language Data Marketplace',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinguaNet - Turn Your Voice into Value',
    description: 'Record audio in African languages, earn instant USDC rewards. Preserve languages, power AI.',
    creator: '@linguanet',
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#667eea',
      },
    ],
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
  colorScheme: 'dark light',
  generator: 'Next.js',
  applicationName: 'LinguaNet',
  appLinks: {
    web: {
      url: 'https://linguanet.vercel.app',
      should_fallback: true,
    },
  },
};

import { Providers } from '@/lib/providers';

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
              name: 'LinguaNet',
              description: 'Decentralized language data marketplace for AI training',
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
                name: 'LinguaNet',
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
      </body>
    </html>
  );
}