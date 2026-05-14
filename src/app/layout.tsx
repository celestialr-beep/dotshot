import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Dotshot — Where Creative Professionals Connect',
    template: '%s | Dotshot',
  },
  description:
    'Dotshot connects photographers, videographers, makeup artists, hairstylists, and creatives for free collabs and paid campaigns. Reduce production costs. Build your network. Get featured.',
  keywords: [
    'creative professionals',
    'photographer',
    'videographer',
    'makeup artist',
    'hairstylist',
    'collaboration',
    'content creation',
    'Orlando',
    'campaigns',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Dotshot',
    title: 'Dotshot — Where Creative Professionals Connect',
    description:
      'Connect with photographers, videographers, makeup artists and more. Free collabs and paid campaigns in one platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dotshot',
    description: 'Where creative professionals connect.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-dark text-text antialiased">
        {children}
      </body>
    </html>
  )
}
