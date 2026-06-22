import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SERVICES_DATA } from '@/constants'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: "Zones d'intervention dans le Cantal et alentours",
  description:
    "Géomètre-topographe et relevé 3D à Aurillac : ACBIM intervient dans le Cantal, la Corrèze, le Lot, l'Aveyron, la Lozère, le Puy-de-Dôme et la Haute-Loire.",
  keywords: [
    "géomètre-topographe Cantal",
    'relevé 3D Aurillac',
    'topographie Corrèze',
    'scanner 3D Lot',
    'drone Aveyron',
    'plans topographiques Auvergne-Rhône-Alpes',
  ],
  alternates: {
    canonical: '/zones-intervention/',
  },
  openGraph: {
    title: `Zones d'intervention | ${COMPANY_NAME}`,
    description:
      "ACBIM, géomètre-topographe et relevé 3D basé à Aurillac, intervient dans le Cantal et les départements voisins.",
    type: 'website',
    url: `${BASE_URL}/zones-intervention/`,
  },
}

interface Zone {
  dept: string
  code: string
  cities: string[]
  note: string
}

const ZONES: Zone[] = [
  {
    dept: 'Cantal',
    code: '15',
    cities: ['Aurillac', 'Mauriac', 'Saint-Flour', 'Arpajon-sur-Cère'],
    note: "Notre département d'attache : interventions rapides à Aurillac et dans tout le Cantal, du relevé de bâtiment au plan topographique.",
  },
  {
    dept: 'Corrèze',
    code: '19',
    cities: ['Tulle', 'Brive-la-Gaillarde', 'Ussel'],
    note: "Relevés 3D, drone et plans pour la rénovation et l'aménagement, de Tulle à Brive et jusqu'au plateau de Millevaches.",
  },
  {
    dept: 'Lot',
    code: '46',
    cities: ['Cahors', 'Figeac', 'Gourdon', 'Souillac'],
    note: 'Numérisation du bâti ancien, plans de façades et topographie pour le patrimoine de la vallée du Lot.',
  },
  {
    dept: 'Aveyron',
    code: '12',
    cities: ['Rodez', 'Millau', 'Villefranche-de-Rouergue', 'Decazeville'],
    note: "Maquette BIM, relevé scanner 3D et missions drone pour les collectivités et maîtres d'œuvre du bassin ruthénois et du Sud-Aveyron.",
  },
  {
    dept: 'Lozère',
    code: '48',
    cities: ['Mende', 'Marvejols', 'Florac'],
    note: "Topographie, orthophotos drone et relevés en sites difficiles d'accès sur les Causses et les Cévennes lozériennes.",
  },
  {
    dept: 'Puy-de-Dôme',
    code: '63',
    cities: ['Clermont-Ferrand', 'Issoire', 'Riom', 'Thiers'],
    note: 'Relevés 3D, plans 2D et rendus de projet pour la métropole clermontoise et le Livradois.',
  },
  {
    dept: 'Haute-Loire',
    code: '43',
    cities: ['Le Puy-en-Velay', 'Brioude', 'Yssingeaux'],
    note: 'Plans topographiques, scanner 3D et photogrammétrie autour du Puy-en-Velay et du Brivadois.',
  },
]

export default function ZonesInterventionPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: "Zones d'intervention", url: '/zones-intervention/' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="bg-slate-50">
        {/* Hero */}
        <section className="bg-[#1d1d1b] pb-20 pt-32 text-center text-white md:pb-24 md:pt-36">
          <div className="container mx-auto px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Zones d&apos;intervention</p>
            <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
              Géomètre-topographe et relevé <span className="text-[#ee7527]">3D</span> dans le Cantal et les
              départements voisins
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-200 md:text-xl">
              Basée à Aurillac (Cantal), l&apos;équipe ACBIM se déplace pour vos relevés scanner 3D, plans 2D et
              topographiques, maquettes BIM et missions drone dans tout le Cantal et les départements limitrophes.
            </p>
            <div className="mx-auto mt-6 h-1 w-24 rounded bg-[#ee7527]" />
          </div>
        </section>

        {/* Départements */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Nos secteurs d&apos;intervention</h2>
              <p className="mx-auto mt-3 max-w-3xl text-slate-600">
                Cantal, Corrèze, Lot, Aveyron, Lozère, Puy-de-Dôme et Haute-Loire : une couverture de proximité au
                cœur du Massif central, avec une capacité d&apos;intervention nationale pour les projets qui le
                nécessitent.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ZONES.map((zone) => (
                <article
                  key={zone.dept}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#ee7527] hover:shadow-md"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-bold text-slate-800">{zone.dept}</h3>
                    <span className="text-sm font-semibold text-slate-400">{zone.code}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{zone.note}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {zone.cities.map((city) => (
                      <li
                        key={city}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Prestations */}
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Nos prestations dans votre secteur</h2>
              <p className="mx-auto mt-3 max-w-3xl text-slate-600">
                Quel que soit le département, nous mobilisons les mêmes outils et la même rigueur pour vos livrables.
              </p>
              <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES_DATA.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}/`}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-[#ee7527] hover:bg-white"
                >
                  <span className="font-semibold text-slate-700 group-hover:text-slate-900">{service.title}</span>
                  <span className="text-[#ee7527]" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1d1d1b] py-16 text-center text-white md:py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold md:text-3xl">Un projet dans le Cantal ou un département voisin ?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">
              Parlons de votre besoin : relevé, plans, maquette BIM, topographie ou drone. Nous évaluons ensemble la
              meilleure approche pour votre site.
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-block rounded-full bg-[#ee7527] px-8 py-3 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-[#d9661f]"
            >
              Discutons de votre projet
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
