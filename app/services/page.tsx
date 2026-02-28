import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppIcon from '@/components/AppIcon'
import ServiceCardRotatingImage from '@/components/ServiceCardRotatingImage'
import { SERVICES_DATA } from '@/constants'
import type { Service } from '@/types'
import { BASE_URL, COMPANY_NAME, DEFAULT_OG_IMAGE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: "Services BIM, relevé 3D, drone, plans 2D et topographiques",
  description:
    "Découvrez les services ACBIM: relevé scanner 3D, modélisation BIM, dessin 2D, plans topographiques, drone, rendus visuels et visites virtuelles pour vos projets dans le Cantal et l'Auvergne-Rhône-Alpes.",
  keywords: [
    'services BIM',
    'relevé 3D',
    'plans 2D',
    'plans topographiques',
    'drone photogrammétrie',
    'Aurillac',
    'Cantal',
  ],
  openGraph: {
    title: `Services BIM, releve 3D, drone, plans 2D et topographiques | ${COMPANY_NAME}`,
    description:
      "Decouvrez les services ACBIM: releve scanner 3D, modelisation BIM, dessin 2D, plans topographiques, drone, rendus visuels et visites virtuelles pour vos projets dans le Cantal et l'Auvergne-Rhone-Alpes.",
    type: 'website',
    url: `${BASE_URL}/services/`,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${COMPANY_NAME} - Services BIM et numerisation`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Services BIM, releve 3D, drone, plans 2D et topographiques | ${COMPANY_NAME}`,
    description:
      "Decouvrez les services ACBIM: releve scanner 3D, modelisation BIM, dessin 2D, plans topographiques, drone, rendus visuels et visites virtuelles pour vos projets dans le Cantal et l'Auvergne-Rhone-Alpes.",
    images: [DEFAULT_OG_IMAGE_URL],
  },
  alternates: {
    canonical: '/services/',
  },
}

function ServiceCard({ service, className }: { service: Service; className?: string }) {
  const linkClassName = className
    ? `block h-full transform transition-transform duration-300 hover:-translate-y-2 ${className}`
    : 'block h-full transform transition-transform duration-300 hover:-translate-y-2'

  return (
    <Link href={`/services/${service.slug}`} className={linkClassName}>
      <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="relative h-48 w-full">
          <ServiceCardRotatingImage
            primarySrc={service.cardImageUrl ?? service.imageUrl}
            alternateSrcs={service.cardImageRotationUrls}
            alt={service.title}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="flex flex-grow flex-col items-center p-8 text-center">
          <div className="mb-4 rounded-full bg-[#ee7527]/10 p-3 text-[#ee7527]">
            <AppIcon name={service.iconKey} />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-800">{service.title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{service.description}</p>
        </div>
      </div>
    </Link>
  )
}

export default function ServicesPage() {
  const shouldCenterLastServiceOnDesktop = SERVICES_DATA.length % 3 === 1

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <div className="bg-white pb-20 pt-32 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">Nos Pôles d&apos;expertise</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
              Nous proposons une gamme complète de prestations techniques pour documenter, modéliser, représenter, visualiser et valoriser le bâti et les territoires, incluant les plans 2D et les plans topographiques.
            </p>
            <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
          </div>
        </div>

        <div className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {SERVICES_DATA.map((service, index) => {
                const isLastService = index === SERVICES_DATA.length - 1
                const cardClassName =
                  shouldCenterLastServiceOnDesktop && isLastService ? 'lg:col-start-2' : undefined

                return <ServiceCard key={service.slug} service={service} className={cardClassName} />
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
