import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';
import { APP, SEO_DEFAULTS } from '@xyz-eyewear/config';
import { Providers } from './providers';
import { StorefrontShell } from '@/components/layout/StorefrontShell';
import '@/styles/globals.css';

// ─── Font Configuration ───────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
});

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SEO_DEFAULTS.CANONICAL_URL),
  title: {
    default: SEO_DEFAULTS.DEFAULT_TITLE,
    template: SEO_DEFAULTS.TITLE_TEMPLATE,
  },
  description: SEO_DEFAULTS.DEFAULT_DESCRIPTION,
  keywords: [
    'eyeglasses',
    'sunglasses',
    'contact lenses',
    'blue light glasses',
    'premium eyewear',
    'designer frames',
    'eye care',
    'optical store',
    'XYZ Eyewear',
    'buy glasses online',
  ],
  authors: [{ name: APP.NAME, url: APP.URL }],
  creator: APP.NAME,
  publisher: APP.NAME,
  openGraph: {
    type: 'website',
    siteName: APP.NAME,
    title: SEO_DEFAULTS.DEFAULT_TITLE,
    description: SEO_DEFAULTS.DEFAULT_DESCRIPTION,
    url: APP.URL,
    images: [
      {
        url: SEO_DEFAULTS.OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${APP.NAME} — ${APP.TAGLINE}`,
      },
    ],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_DEFAULTS.DEFAULT_TITLE,
    description: SEO_DEFAULTS.DEFAULT_DESCRIPTION,
    creator: SEO_DEFAULTS.TWITTER_HANDLE,
    images: [SEO_DEFAULTS.OG_IMAGE],
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    // google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
};

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: APP.NAME,
              url: APP.URL,
              logo: `${APP.URL}/images/logo.png`,
              description: APP.DESCRIPTION,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: APP.SUPPORT_PHONE,
                contactType: 'Customer Service',
                availableLanguage: ['English', 'Hindi'],
              },
              sameAs: Object.values(APP.SOCIAL),
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased text-obsidian-900 bg-white min-h-screen flex flex-col">
        <Providers>
          <StorefrontShell>
            {children}
          </StorefrontShell>
        </Providers>
        <Script
          id="razorpay-checkout-sdk"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
