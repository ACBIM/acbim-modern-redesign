import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Contact from '@/components/Contact'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_NAME, DEFAULT_OG_IMAGE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact | Devis et informations',
  description:
    "Contactez notre bureau d'etudes ACBIM a Aurillac pour toute question ou demande de devis concernant nos services de releve 3D, modelisation BIM et topographie.",
  openGraph: {
    title: `Contact | Devis et informations | ${COMPANY_NAME}`,
    description: "Contactez notre bureau d'etudes pour vos projets de numerisation 3D.",
    type: 'website',
    url: `${BASE_URL}/contact/`,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${COMPANY_NAME} - Contact`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact | Devis et informations | ${COMPANY_NAME}`,
    description: "Contactez notre bureau d'etudes pour vos projets de numerisation 3D.",
    images: [DEFAULT_OG_IMAGE_URL],
  },
  alternates: {
    canonical: '/contact/',
  },
}

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Contact', url: '/contact/' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />
      <main>
        <div className="pt-20">
          <Contact headingTag="h1" />
        </div>
      </main>
      <Footer />
    </>
  )
}
