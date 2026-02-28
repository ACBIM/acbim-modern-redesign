import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AppIcon from '@/components/AppIcon'
import ServiceGalleryRibbon from '@/components/ServiceGalleryRibbon'
import PrebProgramServiceContent from '@/components/services/PrebProgramServiceContent'
import { PROJECTS_DATA, SERVICES_DATA } from '@/constants'
import { pickMetaDescription } from '@/lib/seo'
import { generateBreadcrumbSchema, generateServiceSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_NAME } from '@/lib/site'

export async function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICES_DATA.find((item) => item.slug === slug)
  if (!service) return {}

  const title = service.title
  const socialTitle = `${service.title} | ${COMPANY_NAME}`
  const description = pickMetaDescription([service.description]) ?? service.description
  const canonical = `/services/${service.slug}/`
  const keywords = service.seoKeywords
    ? [...service.seoKeywords, COMPANY_NAME, 'Aurillac', 'Cantal', 'Auvergne-Rhône-Alpes']
    : undefined

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: socialTitle,
      description,
      type: 'article',
      url: `${BASE_URL}${canonical}`,
      images: [
        {
          url: service.imageUrl,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [service.imageUrl],
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = SERVICES_DATA.find((item) => item.slug === slug)
  if (!service) notFound()

  const hasServiceNavigation = SERVICES_DATA.length > 1
  const serviceIndex = SERVICES_DATA.findIndex((item) => item.slug === service.slug)
  const previousService = hasServiceNavigation ? SERVICES_DATA[(serviceIndex - 1 + SERVICES_DATA.length) % SERVICES_DATA.length] : null
  const nextService = hasServiceNavigation ? SERVICES_DATA[(serviceIndex + 1) % SERVICES_DATA.length] : null

  const detailedDescriptionParagraphs =
    service.detailedDescription
      ?.split(/\r?\n\r?\n/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0) ?? []

  const relatedProjects = PROJECTS_DATA.filter((project) => service.relatedProjects?.includes(project.slug))
  const hasMatterportEmbed = typeof service.matterportEmbedUrl === 'string' && service.matterportEmbedUrl.trim().length > 0
  const isPrebProgramService = service.slug === 'programme-renovation-energetique-batiments'
  const serviceSchema = generateServiceSchema(slug)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Services', url: '/services/' },
    { name: service.title, url: `/services/${service.slug}/` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main>
        <section className="relative flex items-center justify-center bg-slate-800 py-32 text-white md:py-40">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            sizes="100vw"
            className="absolute inset-0 z-0 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 container mx-auto px-6 text-center">
            <h1 className="mb-2 text-4xl font-bold leading-tight md:text-6xl">{service.title}</h1>
            <p className="mx-auto max-w-4xl text-lg text-slate-200 md:text-2xl">{service.subtitle}</p>
          </div>
        </section>

        {isPrebProgramService ? (
          <PrebProgramServiceContent service={service} />
        ) : (
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <h2 className="mb-4 text-3xl font-bold text-slate-800">Description du service</h2>
                <div className="max-w-none leading-relaxed text-slate-600">
                  <p className="text-lg font-semibold text-slate-700">{service.description}</p>
                  {detailedDescriptionParagraphs.length > 0 && (
                    <div className="prose prose-lg mt-6 max-w-none leading-relaxed text-slate-600">
                      {detailedDescriptionParagraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 shadow-md">
                  <h3 className="mb-5 text-2xl font-bold text-slate-800">Bénéfices clés</h3>
                  <ul className="space-y-4">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start">
                        <svg className="mt-1 mr-3 h-6 w-6 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {!isPrebProgramService && service.gallery && service.gallery.length > 0 && <ServiceGalleryRibbon items={service.gallery} />}

        {!isPrebProgramService && hasMatterportEmbed && (
          <section className="bg-slate-50 py-12 md:py-14">
            <div className="container mx-auto px-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">Visite virtuelle immersive</h2>
                <p className="mx-auto mt-3 max-w-3xl text-slate-600">
                  Explorez un exemple interactif directement depuis cette page.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-lg">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={service.matterportEmbedUrl}
                    title={`${service.title} - visite virtuelle Matterport`}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {!isPrebProgramService && service.process.length > 0 && (
          <section className="bg-slate-50 py-4 md:py-5">
            <div className="container mx-auto px-6">
              <div className="mb-3 text-center md:mb-4">
                <h2 className="text-xl font-bold text-slate-800 md:text-2xl">Notre processus</h2>
                <div className="mx-auto mt-1.5 h-0.5 w-12 rounded bg-[#ee7527]" />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                {service.process.map((step) => (
                  <div key={step.title} className="h-full rounded-lg bg-white p-2.5 text-center shadow-sm">
                    <div className="mb-1.5 flex items-center justify-center">
                      <AppIcon name={step.iconKey} className="h-8 w-8 text-[#ee7527]" />
                    </div>
                    <h3 className="mb-1 text-base font-bold text-slate-800">{step.title}</h3>
                    <p className="text-xs leading-snug text-slate-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!isPrebProgramService && relatedProjects.length > 0 && (
          <section className="bg-white py-20">
            <div className="container mx-auto px-6">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Projets associés</h2>
                <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.map((project) => (
                  <Link key={project.slug} href={`/projets/${project.slug}`} className="group relative block overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="h-64 w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="text-2xl font-bold">{project.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasServiceNavigation && previousService && nextService && (
          <section className="bg-white py-8 md:py-10">
            <div className="container mx-auto px-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:p-5">
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Explorer les services</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Link
                    href={`/services/${previousService.slug}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-[#ee7527] hover:shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service precedent</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">{previousService.title}</p>
                  </Link>

                  <Link
                    href="/services"
                    className="flex items-center justify-center rounded-lg bg-[#ee7527] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#d9661f]"
                  >
                    Voir tous les services
                  </Link>

                  <Link
                    href={`/services/${nextService.slug}`}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-right transition hover:border-[#ee7527] hover:shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service suivant</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">{nextService.title}</p>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {!isPrebProgramService && (
          <section className="bg-slate-800 py-20 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ce service vous intéresse ?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-slate-300">Contactez-nous dès aujourd&apos;hui pour discuter de votre projet et obtenir un devis personnalisé.</p>
            <Link href="/contact" className="inline-block rounded-full bg-[#ee7527] px-8 py-3 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-[#d9661f]">
              Demander un devis
            </Link>
          </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
