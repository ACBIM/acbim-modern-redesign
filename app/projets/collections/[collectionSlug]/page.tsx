import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_NAME, DEFAULT_OG_IMAGE_URL } from '@/lib/site'
import { getProjectCollectionBySlug, getProjectsForCollection, getServicesForCollection, PROJECT_COLLECTIONS } from '@/lib/projectCollections'

export async function generateStaticParams() {
  return PROJECT_COLLECTIONS.map((collection) => ({ collectionSlug: collection.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collectionSlug: string }>
}): Promise<Metadata> {
  const { collectionSlug } = await params
  const collection = getProjectCollectionBySlug(collectionSlug)
  if (!collection) return {}

  const canonical = `/projets/collections/${collection.slug}/`
  const title = `${collection.title} | Thematiques de projets`

  return {
    title,
    description: collection.seoDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${collection.title} | ${COMPANY_NAME}`,
      description: collection.seoDescription,
      type: 'website',
      url: `${BASE_URL}${canonical}`,
      images: [
        {
          url: DEFAULT_OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${COMPANY_NAME} - ${collection.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${collection.title} | ${COMPANY_NAME}`,
      description: collection.seoDescription,
      images: [DEFAULT_OG_IMAGE_URL],
    },
  }
}

export default async function ProjectCollectionPage({
  params,
}: {
  params: Promise<{ collectionSlug: string }>
}) {
  const { collectionSlug } = await params
  const collection = getProjectCollectionBySlug(collectionSlug)
  if (!collection) notFound()

  const projects = getProjectsForCollection(collection.slug)
  const relatedServices = getServicesForCollection(collection.slug)

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Projets', url: '/projets/' },
    { name: 'Thematiques', url: '/projets/collections/' },
    { name: collection.title, url: `/projets/collections/${collection.slug}/` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="bg-slate-50">
        <section className="relative overflow-hidden bg-slate-950 py-24 pt-40 text-white">
          <div className="pointer-events-none absolute -top-10 left-0 h-64 w-64 rounded-full bg-[#ee7527]/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="container relative mx-auto px-6">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffb489]">{collection.heroEyebrow}</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{collection.title}</h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-200">{collection.subtitle}</p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">{collection.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {collection.objectives.map((objective) => (
                  <span key={objective} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100">
                    {objective}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#ee7527]/30 bg-[#ee7527]/10 px-4 py-2 text-sm font-semibold text-[#ffb489]">
                  {projects.length} projet{projects.length > 1 ? 's' : ''} dans cette thematique
                </span>
                <Link
                  href="/projets/collections"
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Voir toutes les thematiques
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Projets representatifs</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Selection de references lisibles pour illustrer cette logique de mission.
                    </p>
                  </div>
                </div>

                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {projects.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/projets/${project.slug}`}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="relative h-56 w-full bg-slate-100">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4 text-white">
                            <p className="inline-flex rounded-full bg-[#ee7527] px-2.5 py-1 text-xs font-bold">
                              {project.categoryShort ?? project.category}
                            </p>
                            <h3 className="mt-2 text-xl font-bold leading-tight">{project.title}</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm leading-relaxed text-slate-600">{project.excerpt ?? project.description}</p>
                          {project.tags && project.tags.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.tags.slice(0, 4).map((tag) => (
                                <span key={`${project.slug}-${tag}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
                    <p className="text-lg font-bold text-slate-900">Selection en cours</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {collection.emptyStateMessage ??
                        'Cette thematique sera enrichie avec de nouvelles references publiees prochainement. Contactez-nous si vous souhaitez une reference proche de votre cas d usage.'}
                    </p>
                    <div className="mt-5">
                      <Link
                        href="/contact"
                        className="inline-flex items-center rounded-xl bg-[#ee7527] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#d9661f]"
                      >
                        Demander une reference proche de mon projet
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <aside className="space-y-6 xl:col-span-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Comment lire cette thematique</p>
                  <ul className="mt-4 space-y-3">
                    {collection.objectives.map((objective) => (
                      <li key={objective} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                        <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-[#ee7527]" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {relatedServices.length > 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Services associes</p>
                    <div className="mt-4 space-y-3">
                      {relatedServices.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#ee7527] hover:bg-white"
                        >
                          <p className="text-sm font-bold text-slate-900">{service.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">{service.description}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="rounded-2xl border border-[#ee7527]/20 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Besoin similaire ?</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">Parlons de votre objectif</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Donnez-nous votre contexte (type de site, objectif, delai, livrables attendus). Nous vous orientons vers la bonne combinaison
                    de services et de references.
                  </p>
                  <div className="mt-5 space-y-3">
                    <Link
                      href="/contact"
                      className="flex items-center justify-center rounded-xl bg-[#ee7527] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#d9661f]"
                    >
                      Contacter ACBIM
                    </Link>
                    <Link
                      href="/projets"
                      className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#ee7527] hover:text-[#ee7527]"
                    >
                      Voir toutes les realisations
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
