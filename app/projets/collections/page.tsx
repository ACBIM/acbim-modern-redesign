import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_NAME, DEFAULT_OG_IMAGE_URL } from '@/lib/site'
import { getCollectionsSummary } from '@/lib/projectCollections'

export const metadata: Metadata = {
  title: 'Thematiques de projets | Par objectifs',
  description:
    'Explorez les realisations ACBIM par objectifs de mission : rehabilitation, renovation energetique, controle/conformite, communication et concertation.',
  alternates: {
    canonical: '/projets/collections/',
  },
  openGraph: {
    title: `Thematiques de projets | ${COMPANY_NAME}`,
    description:
      'References ACBIM organisees par objectifs : rehabilitation/patrimoine, renovation energetique, controle/conformite, communication et concertation.',
    type: 'website',
    url: `${BASE_URL}/projets/collections/`,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${COMPANY_NAME} - Thematiques de projets`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Thematiques de projets | ${COMPANY_NAME}`,
    description:
      'References ACBIM organisees par objectifs de mission pour faciliter la lecture des savoir-faire et cas d usage.',
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export default function ProjectCollectionsIndexPage() {
  const collections = getCollectionsSummary()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Projets', url: '/projets/' },
    { name: 'Thematiques', url: '/projets/collections/' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="bg-slate-50">
        <section className="bg-white py-24 pt-40">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Par objectifs</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">Thematiques de projets</h1>
            <p className="mx-auto mt-4 max-w-4xl text-lg leading-relaxed text-slate-600">
              Une lecture editoriale de nos realisations pour aller plus vite vers les references pertinentes selon votre objectif :
              rehabiliter, structurer un programme, verifier la faisabilite ou communiquer un projet.
            </p>
            <div className="mx-auto mt-5 h-1 w-24 rounded bg-[#ee7527]" />
          </div>
        </section>

        <section className="py-14 md:py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {collections.map((collection) => {
                const coverProject = collection.projects[0]
                return (
                  <article key={collection.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {coverProject ? (
                      <div className="relative h-52 w-full bg-slate-100">
                        <Image src={coverProject.imageUrl} alt={collection.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-5 text-white">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ffb489]">{collection.heroEyebrow}</p>
                          <p className="mt-2 text-lg font-bold">{collection.title}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid h-52 place-items-center bg-gradient-to-br from-slate-100 to-slate-200 p-6 text-center">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ee7527]">{collection.heroEyebrow}</p>
                          <p className="mt-2 text-lg font-bold text-slate-900">{collection.title}</p>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <p className="text-sm leading-relaxed text-slate-600">{collection.description}</p>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {collection.projects.length} projet{collection.projects.length > 1 ? 's' : ''} dans la selection
                        </p>
                        <Link
                          href={`/projets/collections/${collection.slug}`}
                          className="inline-flex items-center rounded-full bg-[#ee7527] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d9661f]"
                        >
                          Voir la thematique
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <Link href="/projets" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#ee7527] hover:text-[#ee7527]">
                Retour a toutes les realisations
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
