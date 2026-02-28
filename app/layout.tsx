import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Poppins } from 'next/font/google'
import './globals.css'
import BackToTopButton from '@/components/BackToTopButton'
import AnalyticsManager from '@/components/AnalyticsManager'
import { generateOrganizationSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_NAME, DEFAULT_OG_IMAGE_URL, SITE_LOCALE } from '@/lib/site'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const defaultDescription =
  "ACBIM, expert BIM à Aurillac: relevé scanner 3D, modélisation BIM, drone, visite virtuelle, plans 2D et plans topographiques pour vos projets de rénovation et de gestion patrimoniale."

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${COMPANY_NAME} | BIM, Relevé 3D et Numérisation`,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    'BIM Cantal',
    'relevé scanner 3D Aurillac',
    'maquette numérique BIM',
    'numérisation bâtiment',
    'drone photogrammétrie',
    'visite virtuelle 360',
    'plans 2D',
    'plans topographiques',
    'Auvergne-Rhône-Alpes',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    url: BASE_URL,
    siteName: COMPANY_NAME,
    title: `${COMPANY_NAME} | BIM, Relevé 3D et Numérisation`,
    description: defaultDescription,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${COMPANY_NAME} - Numérisation 3D et BIM`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY_NAME} | BIM, Relevé 3D et Numérisation`,
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE_URL],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationSchema = generateOrganizationSchema()

  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${poppins.className} bg-slate-50 text-slate-800`}>
        {children}
        <AnalyticsManager />
        <BackToTopButton />
      </body>
    </html>
  )
}
