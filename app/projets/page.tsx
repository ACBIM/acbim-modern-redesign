import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProjectsFilterGrid from '@/components/ProjectsFilterGrid'
import { PROJECTS_DATA } from '@/constants'
import { getCollectionsSummary } from '@/lib/projectCollections'
import { BASE_URL, COMPANY_NAME, DEFAULT_OG_IMAGE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Nos realisations',
  description:
    'Decouvrez les projets de releve 3D, modelisation BIM et topographie realises par ACBIM dans le Cantal, en Auvergne-Rhone-Alpes et regions limitrophes.',
  openGraph: {
    title: `Nos realisations | ${COMPANY_NAME}`,
    description:
      'Decouvrez les projets de releve 3D, modelisation BIM et topographie realises par ACBIM dans le Cantal, en Auvergne-Rhone-Alpes et regions limitrophes.',
    type: 'website',
    url: `${BASE_URL}/projets/`,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${COMPANY_NAME} - Projets et realisations`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Nos realisations | ${COMPANY_NAME}`,
    description:
      'Decouvrez les projets de releve 3D, modelisation BIM et topographie realises par ACBIM dans le Cantal, en Auvergne-Rhone-Alpes et regions limitrophes.',
    images: [DEFAULT_OG_IMAGE_URL],
  },
  alternates: {
    canonical: '/projets/',
  },
}

export default function ProjectsPage() {
  const collections = getCollectionsSummary()

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <div className="bg-white pb-20 pt-32 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">Nos realisations</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
              Découvrez une sélection de projet réalisés pour le patrimoine, les bâtiments publics, l'industrie : relevés 3D, plans, BIM, imagerie drone/360° et infographie pour la conception et la communication, partout en France.
            </p>
            <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
          </div>
        </div>

        <div className="pt-12 pb-8 md:pt-14">
          <div className="container mx-auto px-6">
            <ProjectsFilterGrid projects={PROJECTS_DATA} />
          </div>
        </div>

        <section className="pb-20 md:pb-24">
          <div className="container mx-auto px-6">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Listing par objectifs</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Les missions</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                  Une lecture métier et par objectifs de nos references.
                </p>
              </div>
              <Link
                href="/projets/collections"
                className="inline-flex items-center justify-center rounded-full border border-[#ee7527]/30 bg-white px-4 py-2 text-sm font-semibold text-[#d9661f] transition hover:bg-[#ee7527]/10"
              >
                Voir tout
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/projets/collections/${collection.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#ee7527]/40 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{collection.heroEyebrow}</p>
                  <h3 className="mt-2 text-lg font-bold leading-tight text-slate-900 group-hover:text-[#d9661f]">{collection.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{collection.subtitle}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {collection.projects.length} projet{collection.projects.length > 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#ee7527]">Explorer</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
