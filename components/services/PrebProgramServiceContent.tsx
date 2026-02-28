import Image from 'next/image'
import Link from 'next/link'
import AppIcon from '@/components/AppIcon'
import type { Service } from '@/types'

const PREB_PARAGRAPHS = [
  "De la capture du bati aux scenarios de renovation : une chaine fiable, pilotee par la maquette numerique.",
  "Pour reussir une renovation energetique, tout commence par une base 'etat existant' fiable. Trop souvent, les audits et etudes partent de plans incomplets, de surfaces approximatives ou d'hypotheses de composition qui generent ensuite des ecarts, des reprises d'etudes et des couts.",
  "Chez ACBIM, nous deployons une methode eprouvee : Scan 3D -> maquette numerique BIM de l'existant -> collecte technique (thermique et systemes) -> simulations et audit energetique via notre partenaire BET thermique -> livrables et plan d'action.",
  "Nous ne realisons pas l'audit thermique en interne : nous auscultons le bati, collectons et structurons les donnees techniques (enveloppe, menuiseries, parois, systemes, locaux techniques, incoherences, pathologies visibles) et les integrons dans une maquette numerique exploitable.",
  "Les simulations thermiques reglementaires et le rapport d'audit energetique sont realises avec notre partenaire EREAH (L'Union - Toulouse), dans un cadre aligne avec les exigences attendues (ADEME, OPQIBI, methodologies de calcul et livrables conformes selon la mission).",
  "Cette approche a deja ete utilisee a grande echelle sur des programmes de renovation couvrant environ 160 batiments, avec un retour d'experience concret sur l'organisation de la collecte terrain et la production de livrables utiles aux decideurs comme aux maitres d'oeuvre.",
  "Une demarche eco-responsable par la donnee : mieux mesurer, mieux decider, eviter les erreurs de conception, limiter les interventions inutiles et prioriser les investissements la ou ils ont le plus d'impact.",
]

const PREB_BENEFITS = [
  'Methode eprouvee sur 160 batiments : organisation robuste, livrables directement exploitables.',
  "Etat existant fiable (scan 3D + controles) : moins d'hypotheses, moins d'aleas en phase etude / travaux.",
  'Maquette 3D support de decision : scenarios comparables et tracables, base commune MOA / MOE / BET.',
  'Donnees techniques structurees : enveloppe, systemes, locaux techniques, points singuliers integres a la maquette.',
  "Audit energetique realise avec BET thermique partenaire : simulations + rapport conformes aux attendus de mission.",
  "Livrables complets : nuage de points/3D, plans 2D, maquette BIM, exports, rapport d'audit et plan d'actions.",
]

const PREB_PROCESS = [
  {
    title: "1. Releve scan 3D de l'existant",
    iconKey: 'scan' as const,
    description:
      "Acquisition rapide et precise de l'enveloppe et des volumes (interieur / exterieur) pour fiabiliser surfaces, hauteurs, epaisseurs et singularites. Selon configuration : scanner 3D, prises de hauteur, et si besoin releves complementaires (topo / drone / 360).",
  },
  {
    title: '2. Maquette numerique du batiment (BIM)',
    iconKey: 'cube' as const,
    description:
      "Production d'une maquette Scan-to-BIM structuree, prete a recevoir les informations techniques : typologies de parois, menuiseries, zonages, locaux, equipements reperes. Base partagee pour etudes, arbitrages et consultation des entreprises.",
  },
  {
    title: '3. Collecte technique & audit sur maquette (avec BET thermique)',
    iconKey: 'cog' as const,
    description:
      "ACBIM realise l'auscultation et la collecte des donnees techniques puis les structure dans la maquette. Notre partenaire EREAH prend ensuite le relais pour les simulations, la comparaison de scenarios et le rapport d'audit energetique.",
  },
  {
    title: "4. Livrables et plan d'action",
    iconKey: 'document-download' as const,
    description:
      "Remise d'un dossier complet : maquette numerique, plans 2D, exports, et rapport d'audit avec scenarios d'amelioration (priorisation, gains, phasage). La maquette devient un socle durable pour consultation, travaux et exploitation.",
  },
]

const PREB_DELIVERABLES = [
  "Nuage de points (visualisation + formats d'echange)",
  'Plans 2D : plans, coupes, elevations, plans de masse (si demande)',
  "Maquette numerique BIM de l'existant (LOD selon besoin projet)",
  'Donnees techniques structurees dans la maquette (reperages, attributs, nomenclatures)',
  "Dossier audit energetique et scenarios (realises par BET thermique partenaire)",
  'Exports IFC / DWG / PDF et convention de nommage / arborescence',
]

const PREB_FUNDING = [
  {
    title: 'ACTEE / Fonds CHENE',
    phases: ['ingenierie amont', 'travaux', 'maintenance post-travaux'],
    points: [
      "Les cadres ACTEE/Fonds Chene integrent des postes d'ingenierie amont (dont etudes energetiques, SDIE, audits) selon les appels et lots eligibles.",
      "Les missions d'AMO/MOE et d'accompagnement au pilotage peuvent etre mobilisables selon le perimetre retenu.",
      "Les fonctions de suivi (economes de flux, outillage de suivi, instrumentation) peuvent aussi s'inscrire dans une logique programme.",
    ],
    footnote: "Lecture fondee sur des documents institutionnels de reference et sur le cadre du programme ACTEE (FNCCR).",
  },
  {
    title: 'Fonds Vert',
    phases: ['ingenierie amont', 'travaux'],
    points: [
      "Le Fonds Vert peut articuler ingenierie amont et travaux dans une meme trajectoire de renovation, selon les axes et criteres applicables.",
      "La logique programme permet de prioriser des actions rapides puis des operations plus structurelles (enveloppe, systemes, rehabilitation).",
    ],
  },
  {
    title: 'Banque des Territoires / EduRenov',
    phases: ['ingenierie amont', 'travaux'],
    points: [
      "Les dispositifs Banque des Territoires / EduRenov structurent des parcours de financement sur les phases amont et travaux, notamment pour le bati scolaire.",
      "L'intracting introduit une logique de financement adossee aux economies d'energie, utile dans une strategie de programmation.",
    ],
  },
  {
    title: 'ADEME (selon dispositifs)',
    phases: ['ingenierie amont', 'travaux'],
    points: [
      "L'ADEME propose, selon dispositifs et territoires, des aides mobilisables sur l'ingenierie amont et certaines phases d'accompagnement/travaux.",
      'Exemples de references courantes : CEP, SDIE, AMO CPE (conditions, plafonds et eligibilites a verifier au cas par cas).',
    ],
    footnote: "Toujours verifier les conditions et plafonds en vigueur au moment du montage (eligibilite, calendrier, territoire).",
  },
]

const PREB_MOBILIZED_SUBSIDIES_TOTAL = '8,2 M EUR'

const PREB_EPCI_PARK = [
  { epci: 'Chataigneraie', batiments: 91, subventionnes: 42 },
  { epci: 'Sumene Artense', batiments: 29, subventionnes: 5 },
  { epci: 'Hautes Terres', batiments: 17, subventionnes: 1 },
  { epci: 'Cere & Goul', batiments: 11, subventionnes: 1 },
  { epci: 'Pays de Gentiane', batiments: 10, subventionnes: 1 },
]

const PREB_FAQ = [
  {
    q: "ACBIM realise-t-elle l'audit energetique ?",
    a: "Non. ACBIM realise la collecte terrain, la structuration des donnees et la maquette BIM. Les simulations et le rapport d'audit energetique sont realises par notre BET thermique partenaire EREAH.",
  },
  {
    q: 'Pourquoi commencer par un scan 3D ?',
    a: "Parce que la renovation energetique se joue sur la precision : surfaces, hauteurs, epaisseurs, singularites, locaux techniques. Une base fiable limite les hypotheses et les erreurs.",
  },
  {
    q: "A qui s'adresse ce programme ?",
    a: 'Collectivites, EPCI, bailleurs, industriels, gestionnaires de patrimoine, AMO/MOE : des qu il faut decider, prioriser et phaser des travaux sur un parc de batiments.',
  },
]

function SectionTitle({
  eyebrow,
  title,
  intro,
  light = false,
}: {
  eyebrow: string
  title: string
  intro?: string
  light?: boolean
}) {
  return (
    <div className="mb-8">
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${light ? 'text-emerald-200' : 'text-emerald-700'}`}>{eyebrow}</p>
      <h2 className={`mt-2 text-3xl font-bold md:text-4xl ${light ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      {intro ? <p className={`mt-3 max-w-4xl leading-relaxed ${light ? 'text-emerald-50/90' : 'text-slate-600'}`}>{intro}</p> : null}
    </div>
  )
}

function VisualSlot({
  title,
  caption,
  src,
  imageFit = 'cover',
}: {
  title: string
  caption: string
  src?: string
  imageFit?: 'cover' | 'contain'
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-slate-100 to-slate-200">
        {src ? (
          <Image
            src={src}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={imageFit === 'contain' ? 'object-contain p-2' : 'object-cover'}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-5">
            <div className="w-full rounded-xl border-2 border-dashed border-emerald-300 bg-white/80 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Espace visuel</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{title}</p>
            </div>
          </div>
        )}
      </div>
      <figcaption className="p-4">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{caption}</p>
      </figcaption>
    </figure>
  )
}

export default function PrebProgramServiceContent({ service }: { service: Service }) {
  const totalSubventionnes = PREB_EPCI_PARK.reduce((sum, row) => sum + row.subventionnes, 0)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-16 md:py-20">
        <div className="pointer-events-none absolute -top-20 left-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-lime-200/35 blur-3xl" />
        <div className="container relative mx-auto px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Methode PREB
              </div>
              <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                Du relevé sur site aux scénarios de rénovation : un processus fiable éprouvé et approuvé.
              </h2>
              <p className="mt-4 max-w-4xl text-lg leading-relaxed text-slate-700">{service.description}</p>
              <div className="mt-8 space-y-5">
                {PREB_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph} className="max-w-4xl leading-relaxed text-slate-700">{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="space-y-4 lg:sticky lg:top-24">
                <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Chiffres cles</p>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {[
                      { value: '~160', label: 'batiments traites via la methode PREB' },
                      { value: `${totalSubventionnes}`, label: 'batiments renoves et subventionnes grace au programme PREB' },
                      {
                        value: PREB_MOBILIZED_SUBSIDIES_TOTAL,
                        label: 'Programmes facilitant la mobilisation des subventions (montant total identifie)',
                      },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                        <p className="text-lg font-bold text-emerald-800">{stat.value}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-lime-200 bg-lime-50 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-800">Partenariat</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    ACBIM structure la base, la collecte terrain et la maquette. Les simulations et le rapport d'audit energetique sont realises
                    avec le BET thermique partenaire EREAH (L'Union - Toulouse).
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Les moyens mis en oeuvre</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {[
                      'Scanner laser 3D, drone et captures complementaires selon site',
                      'Production Scan-to-BIM + plans 2D + exports',
                      'Organisation possible en site occupe',
                      'Livrables exploitables pour MOA / MOE / BET',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-emerald-50 via-lime-50/40 to-white py-14 md:py-16">
        <div className="container mx-auto space-y-8 px-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <SectionTitle
                eyebrow="Pourquoi la maquette change tout"
                title="Une renovation energetique n'est pas qu'une question d'isolation"
                intro="C'est aussi un projet de patrimoine, de systemes, d'usage et de contraintes. La maquette numerique permet de centraliser une information fiable, reduire les approximations, tester des scenarios sans repartir de zero et conserver une base utile pour la suite."
              />
            </div>
            <VisualSlot
              title="La 3D comme noyau centrale d'informations et de simulation"
              caption="Un rapport d'audit avec à minima 3 scénarios de rénovation, du plus simple au plus ambitieux !"
              src="/images/optimized/maquette-numerique-3d-bim/thermique-vert.webp"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container mx-auto px-6">
          <SectionTitle
            eyebrow="Chaine operationnelle"
            title="Une methode PREB lisible de la capture au plan d'action"
            intro="Une chaine de production claire pour comprendre les dependances entre releve, maquette, collecte technique, simulations et arbitrages."
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PREB_PROCESS.map((step, index) => (
              <article key={step.title} className="relative rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50 p-5 shadow-sm">
                <div className="absolute right-4 top-4 text-xs font-bold text-emerald-200">0{index + 1}</div>
                <div className="mb-3 inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-700">
                  <AppIcon name={step.iconKey} className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm">
              <SectionTitle eyebrow="Benefices" title="Pourquoi cette methode est robuste" />
              <ul className="space-y-3">
                {PREB_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 rounded-xl border border-white bg-white p-3 shadow-sm">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm leading-relaxed text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 xl:col-span-2">
              <VisualSlot
                title="Superposition nuage de points et maquette BIM"
                caption="Fiabilisation de l'etat existant avant arbitrages et simulations."
                src="/images/optimized/maquette-numerique-3d-bim/maquetteetnuage.webp"
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <SectionTitle
                  eyebrow="Livrables"
                  title="Un dossier de travail (pas seulement un rapport)"
                  intro="Selon le cadrage du projet, nous livrons notamment :"
                />
                <ul className="grid grid-cols-1 gap-3">
                  {PREB_DELIVERABLES.map((item) => (
                    <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-700 to-green-700 p-6 text-white shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">Nos moyens</p>
                <p className="mt-2 text-sm leading-relaxed text-emerald-50">
                  ACBIM mobilise des moyens de releve et de production adaptes : scanner laser 3D, drone, solutions de capture, stations de
                  travail et logiciels metiers, pour produire des livrables precis et exploitables. Nous savons organiser la capture en site occupe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-green-950 to-slate-950 py-16 text-white">
        <div className="pointer-events-none absolute left-10 top-10 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="container relative mx-auto px-6">
          <SectionTitle
            eyebrow="Financements & ingenierie"
            title="Les phases d'etudes et d'ingenierie sont aussi strategiques... et souvent subventionnables"
            intro="Notre approche PREB integre la lecture des cadres de financement publics et des documentations institutionnelles de reference (ACTEE/FNCCR, Fonds Vert, Banque des Territoires, ADEME). Cela permet de positionner l'ingenierie amont comme une phase strategique du programme, et de preparer des dossiers plus solides."
            light
          />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {PREB_FUNDING.map((card) => (
              <article key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white">{card.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {card.phases.map((phase) => (
                    <span key={phase} className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                      {phase}
                    </span>
                  ))}
                </div>
                <ul className="mt-4 space-y-2">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-emerald-50/90">
                      <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-lime-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {'footnote' in card && card.footnote ? <p className="mt-4 text-xs leading-relaxed text-emerald-100/80">{card.footnote}</p> : null}
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-100">A retenir</p>
            <p className="mt-2 text-sm leading-relaxed text-amber-50/95">
              Les dispositifs, taux, plafonds et calendriers evoluent. Les points ci-dessus s'appuient sur des documents institutionnels et des
              cadres publics de reference. Le niveau de mobilisation des aides depend ensuite du montage, de l'eligibilite du porteur, du
              territoire et du calendrier. La qualite du cadrage amont reste determinante pour securiser les arbitrages et les dossiers.
            </p>
            <div className="mt-4">
              <Link
                href="https://programme-cee-actee.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-amber-200/40 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-50 transition hover:bg-white/10"
              >
                Source officielle ACTEE (FNCCR)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container mx-auto px-6">
          <SectionTitle
            eyebrow="Retour d'experience PREB"
            title="Lecture programme : volumes, subventions, pilotage"
            intro="L'objectif est de montrer une logique de programme multi-batiments et de priorisation, avec une lecture des enveloppes mobilisees a l'echelle globale."
          />
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Enveloppe de subventions mobilisee</h3>
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Montant total identifie</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-800">{PREB_MOBILIZED_SUBSIDIES_TOTAL}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    Sur les programmes analyses, la structuration en logique PREB facilite le montage, la priorisation et l'appel a
                    subventions. La lecture est presentee ici en montant global mobilise, plus utile pour une vision programme.
                  </p>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-600">
                  Les dispositifs et calendriers evoluent selon les periodes et les territoires. Le point cle reste la qualite du cadrage
                  amont et des donnees pour accelerer les decisions et la mobilisation des aides.
                </p>
              </div>

              <VisualSlot
                title="Extrait du rapport d'audit énergétique"
                caption="Un rapport complet par bâtiment vous est transmis, performance de l'existant + programmes d'améliorations."
                src="/images/optimized/preb/audit.webp"
                imageFit="contain"
              />
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">Liste des EPCI et nombre de batiments</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-emerald-200 text-left text-xs uppercase tracking-wide text-emerald-800">
                      <th className="pb-2 pr-4">EPCI</th>
                      <th className="pb-2 pr-4">Batiments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREB_EPCI_PARK.map((row) => (
                      <tr key={row.epci} className="border-b border-emerald-100 align-top">
                        <td className="py-3 pr-4 font-semibold text-slate-800">{row.epci}</td>
                        <td className="py-3 pr-4 text-slate-700">{row.batiments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-600">Vue synthetique du parc PREB par EPCI.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-lime-50 to-white py-14 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SectionTitle eyebrow="Mini-FAQ" title="Questions frequentes avant de demarrer" />
              <div className="space-y-3">
                {PREB_FAQ.map((item) => (
                  <details key={item.q} className="group rounded-xl border border-slate-200 bg-slate-50 p-4 open:bg-white open:shadow-sm">
                    <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-slate-800">
                      {item.q}
                      <span className="float-right text-emerald-600 transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-700 to-green-700 p-6 text-white shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">CTA</p>
              <h2 className="mt-2 text-2xl font-bold md:text-3xl">Vous avez un programme pluriannuel de renovation ?</h2>
              <p className="mt-4 text-sm leading-relaxed text-emerald-50">
                Parlons d'abord de la base de donnees : vos plans sont-ils fiables, complets, a jour ? ACBIM peut securiser l'etat existant
                (scan + maquette), structurer les donnees techniques et permettre le lancement d'un audit energetique sur une base robuste.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50">
                  Demander un cadrage PREB
                </Link>
                <Link href="/services/releve-scanner-3d-numerisation" className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  Voir la brique scan 3D
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
