import type { Metadata } from 'next'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Clients from '@/components/Clients'
import ProjectsMap from '@/components/ProjectsMap'
import Partners from '@/components/Partners'
import PhoneRevealLink from '@/components/PhoneRevealLink'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_NAME, DEFAULT_OG_IMAGE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'À propos | Notre histoire et expertise',
  description:
    "Découvrez l'histoire, les missions et l'équipe d'ACBIM. Bureau d'études techniques spécialisé dans la transition numérique du bâtiment depuis 2017.",
  openGraph: {
    title: `À propos | Notre histoire et expertise | ${COMPANY_NAME}`,
    description: "Découvrez l'histoire, la mission et l'équipe d'ACBIM.",
    type: 'website',
    url: `${BASE_URL}/a-propos/`,
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${COMPANY_NAME} - À propos`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `À propos | Notre histoire et expertise | ${COMPANY_NAME}`,
    description: "Découvrez l'histoire, la mission et l'équipe d'ACBIM.",
    images: [DEFAULT_OG_IMAGE_URL],
  },
  alternates: {
    canonical: '/a-propos/',
  },
}

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'À propos', url: '/a-propos/' },
  ])
  const experienceYears = new Date().getFullYear() - 2017
  const companyPhoneDisplay = '06 43 20 04 76'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />
      <main>
        <div className="bg-white pb-20 pt-32 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">Allier l'expertise du géomètre à la puissance des nouvelles technologies pour vos plans 2D et maquettes 3D</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
              Depuis 2017, ACBIM accompagne les acteurs du bâtiment et des territoires avec des données fiables et une expertise de pointe passant par la création de plan, de maquette 3D ou programme de rénovation énergétique.
            </p>
            <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
          </div>
        </div>

        <section className="bg-slate-50 py-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center gap-12 lg:flex-row">
              <div className="lg:w-1/2">
                <Image
                  src="/images/optimized/hero/20200121-dgfip-aurillac-04.webp"
                  alt="Maquette numérique du projet DGFIP a Aurillac"
                  width={600}
                  height={400}
                  className="h-full w-full rounded-lg object-cover shadow-2xl"
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Notre histoire</h2>
                <div className="mt-4 h-1 w-24 rounded bg-[#ee7527]" />
                <p className="mt-6 leading-relaxed text-slate-600">
                  Fondé en 2017 a Aurillac, ACBIM est un bureau d'études techniques spécialisé dans les relevés 3D, relevés par drone, la maquette numérique 3D et la topographie. Nous nous positionnons comme un acteur engage de la transition numérique et écologique du bâtiment, en fournissant des données fiables et exploitables pour les collectivités, architectes, industriels et gestionnaires de patrimoine.
                </p>
                <p className="mt-4 leading-relaxed text-slate-600">
                  Notre équipe pluridisciplinaire de 5 experts utilise des technologies de pointe (scanner laser, drone, GPS RTK) pour répondre avec précision à vos besoins sur des projets de rénovation, de gestion patrimoniale ou d'audits énergétiques.
                </p>
                <div className="mt-8 flex flex-col space-y-4 text-center sm:flex-row sm:space-x-8 sm:space-y-0 sm:text-left">
                  <div className="flex-1">
                    <span className="text-4xl font-bold text-[#ee7527]">{experienceYears}+</span>
                    <p className="text-slate-500">Années d'experience</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-4xl font-bold text-[#ee7527]">200+</span>
                    <p className="text-slate-500">Projets réalisés</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-4xl font-bold text-[#ee7527]">5</span>
                    <p className="text-slate-500">Experts à votre service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-20 text-white">
          <div className="container mx-auto px-6">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="order-2 lg:order-1 lg:col-span-5">
                <h2 className="text-3xl font-bold md:text-4xl">Des projets partout en France</h2>
                <p className="mt-4 text-slate-300">
                  De l'Auvergne-Rhône-Alpes aux zones limitrophes, nous accompagnons des chantiers complexes sur tout le territoire.
                </p>
                <ProjectsMap variant="compact" className="mt-6" />
              </div>

              <div className="order-1 lg:order-2 lg:col-span-7">
                <div>
                  <h2 className="text-3xl font-bold md:text-4xl">L'innovation au service de vos projets</h2>
                  <p className="mt-4 text-slate-300">
                    Pour vous offrir des livrables d'une fidélité absolue, nous investissons dans les technologies les plus performantes du marche.
                  </p>
                  <div className="mt-6 space-y-4">
                    <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
                      <h3 className="text-xl font-semibold text-white">Le relevé par drone nouvelle génération</h3>
                      <p className="mt-2 text-slate-300">
                        Avec notre DJI Matrice 4E (modèle 2026), nous realisons des inspections techniques et des captations de données à haute résolution sur de grandes surfaces.
                      </p>
                    </article>
                    <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
                      <h3 className="text-xl font-semibold text-white">Scan laser 3D et précision millimétrique</h3>
                      <p className="mt-2 text-slate-300">
                        Nous utilisons des scanners statiques et mobiles (Leica RTC 360) pour figer la réalité en un nuage de points exhaustif.
                      </p>
                    </article>
                    <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
                      <h3 className="text-xl font-semibold text-white">Le Trépied Porte-à-Faux exclusif</h3>
                      <p className="mt-2 text-slate-300">
                        Une innovation unique en France conçue par nos soins, permettant de scanner des façades et des zones inaccessibles (balcons, corniches) sans nacelle ni échafaudage.
                      </p>
                    </article>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-slate-950 to-slate-900 py-16 text-white">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl backdrop-blur-sm md:p-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold md:text-4xl">Une expertise reconnue</h2>
                  <p className="mt-4 text-slate-300">
                    Faire appel à ACBIM, c'est choisir un partenaire récompensé pour sa rigueur et sa vision.
                  </p>
                </div>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
                    <h3 className="text-xl font-semibold text-white">Lauréat du BIM d'Argent</h3>
                    <p className="mt-2 text-slate-300">
                      Une distinction qui salue notre méthodologie innovante sur les plans de rénovation énergétique (PREB).
                    </p>
                  </article>
                  <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-5">
                    <h3 className="text-xl font-semibold text-white">Reconnaissance PTNB</h3>
                    <p className="mt-2 text-slate-300">
                      Lauréat du Plan Transition Numérique dans le Bâtiment pour nos travaux en gestion et maintenance.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-5xl">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Infos pratiques</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Nous joindre facilement</h2>
                <p className="mx-auto mt-4 max-w-3xl text-slate-600">
                  Coordonnées de contact, adresse postale et horaires de disponibilité.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Contact</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
                      <a href={`mailto:${COMPANY_EMAIL}`} className="mt-1 inline-block font-medium text-slate-900 hover:text-[#ee7527]">
                        {COMPANY_EMAIL}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Téléphone</p>
                      <div className="mt-1">
                        <PhoneRevealLink
                          phoneDisplay={companyPhoneDisplay}
                          linkClassName="inline-block font-medium text-slate-900 hover:text-[#ee7527]"
                          buttonClassName="rounded-md bg-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Adresse postale</h3>
                  <div className="mt-4 text-sm leading-relaxed text-slate-700">
                    <p>{COMPANY_ADDRESS.streetAddress}</p>
                    <p>
                      {COMPANY_ADDRESS.postalCode} {COMPANY_ADDRESS.addressLocality}
                    </p>
                    <p className="mt-2 text-slate-500">Auvergne-Rhône-Alpes</p>
                  </div>
                </article>

                <article className="rounded-2xl border border-[#ee7527]/20 bg-gradient-to-b from-orange-50 to-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">Horaires</h3>
                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">Du lundi au vendredi</p>
                    <p>8h à 12h</p>
                    <p>14h à 18h</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <Partners />

        <div className="bg-white py-20">
          <Clients variant="page" />
        </div>
      </main>
      <Footer />
    </>
  )
}
