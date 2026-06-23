import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Poppins } from 'next/font/google'
import './globals.css'
import AnalyticsConsentBanner from '@/components/AnalyticsConsentBanner'
import BackToTopButton from '@/components/BackToTopButton'
import { generateOrganizationSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_NAME, DEFAULT_OG_IMAGE_URL, GA_MEASUREMENT_ID, SITE_LOCALE } from '@/lib/site'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const defaultDescription =
  "Géomètre-topographe à Aurillac (Cantal) : mesure de l’existant, relevé 3D, état des lieux, plans de l’existant, scanner laser, drone et BIM."

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `Géomètre-topographe & relevé 3D — mesure de l’existant | ${COMPANY_NAME}`,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    'géomètre-topographe Cantal',
    'relevé 3D Cantal',
    'état des lieux Aurillac',
    'plans de l’existant',
    'scanner 3D Aurillac',
    'maquette numérique BIM',
    'drone photogrammétrie',
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
    title: `Géomètre-topographe & relevé 3D — mesure de l’existant | ${COMPANY_NAME}`,
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
    title: `Géomètre-topographe & relevé 3D — mesure de l’existant | ${COMPANY_NAME}`,
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
        {GA_MEASUREMENT_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className={`${poppins.className} bg-slate-50 text-slate-800`}>
        {children}
        <AnalyticsConsentBanner />
        <BackToTopButton />
      </body>
    </html>
  )
}
