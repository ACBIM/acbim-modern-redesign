import type { Metadata } from 'next'
import CookiePreferencesButton from '@/components/CookiePreferencesButton'
import LegalPageShell from '@/components/LegalPageShell'
import { generateBreadcrumbSchema } from '@/lib/schema'
import { BASE_URL, COMPANY_LEGAL_NAME, COMPANY_NAME, GA_MEASUREMENT_ID } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Gestion des cookies',
  description: 'Informations sur les cookies, traceurs et contenus tiers utilises par le site ACBIM.',
  alternates: {
    canonical: '/cookies/',
  },
  openGraph: {
    title: `Gestion des cookies | ${COMPANY_NAME}`,
    description: 'Choix et informations sur les cookies utilises par le site ACBIM.',
    type: 'website',
    url: `${BASE_URL}/cookies/`,
  },
}

const cookieRows = [
  {
    name: 'Préférence de consentement ACBIM',
    provider: COMPANY_LEGAL_NAME,
    purpose: 'Memoriser votre choix concernant les cookies de mesure d audience.',
    required: 'Oui',
    retention: '6 mois',
  },
  {
    name: 'Google Analytics (_ga, _ga_*)',
    provider: 'Google LLC',
    purpose: 'Mesurer l audience du site et comprendre les pages consultees, uniquement après acceptation.',
    required: 'Non',
    retention: '13 mois maximum',
  },
  {
    name: 'Traceurs tiers YouTube / youtube-nocookie.com',
    provider: 'Google LLC',
    purpose: 'Afficher certaines videos integrees et le hero video. Le chargement du lecteur peut entrainer la lecture ou le dépôt de traceurs Google.',
    required: 'Non',
    retention: 'Variable selon Google et l état de connexion a votre compte',
  },
  {
    name: 'Traceurs tiers Google Maps',
    provider: 'Google LLC',
    purpose: 'Afficher la carte interactive des projets.',
    required: 'Non',
    retention: 'Variable selon Google',
  },
  {
    name: 'Traceurs tiers Matterport',
    provider: 'Matterport, LLC',
    purpose: 'Afficher certaines visites virtuelles immersives.',
    required: 'Non',
    retention: 'Variable selon Matterport',
  },
]

const providerPolicies = [
  {
    name: 'Google - Confidentialite',
    href: 'https://policies.google.com/privacy?hl=fr',
  },
  {
    name: 'Google - Cookies et technologies similaires',
    href: 'https://policies.google.com/technologies/cookies?hl=fr',
  },
  {
    name: 'Matterport - Privacy Policy',
    href: 'https://matterport.com/privacy-policy',
  },
  {
    name: 'Matterport - Cookie Policy',
    href: 'https://matterport.com/cookie-policy',
  },
]

export default function CookiesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Cookies', url: '/cookies/' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <LegalPageShell
        title="Gestion des cookies"
        description="Cette page detaille les traceurs utilises sur le site et permet de modifier votre choix a tout moment."
        updatedAt="23 avril 2026"
      >
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Principe</h2>
          <p className="mt-4">
            Le site ACBIM fonctionne sans cookie publicitaire. Les cookies et traceurs de mesure d audience Google
            Analytics ne sont charges qu après votre acceptation. Le refus est conserve avec la meme durée que
            l acceptation afin de ne pas vous redemander un choix a chaque page.
          </p>
          <p className="mt-4">
            Certaines pages affichent aussi des contenus tiers Google ou Matterport. Lorsqu un lecteur YouTube, une
            carte Google Maps ou une visite immersive Matterport se charge, le fournisseur concerne peut lire ou deposer
            ses propres traceurs selon sa configuration et votre session eventuelle chez lui.
          </p>
          {GA_MEASUREMENT_ID ? (
            <div className="mt-6">
              <CookiePreferencesButton className="rounded-md border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                Modifier mes préférences
              </CookiePreferencesButton>
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              La mesure d audience n est pas configuree sur cet environnement.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Traceurs utilises</h2>
          <div className="mt-5 overflow-x-auto border-y border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Nom
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Fournisseur
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Finalite
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Obligatoire
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Conservation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {cookieRows.map((row) => (
                  <tr key={row.name}>
                    <td className="px-4 py-4 align-top font-medium text-slate-950">{row.name}</td>
                    <td className="px-4 py-4 align-top">{row.provider}</td>
                    <td className="px-4 py-4 align-top">{row.purpose}</td>
                    <td className="px-4 py-4 align-top">{row.required}</td>
                    <td className="px-4 py-4 align-top">{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Contenus tiers integres</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>Le hero video utilise le domaine youtube-nocookie.com, qui reste un service Google.</li>
            <li>La carte des projets utilise un embed Google Maps.</li>
            <li>Certaines pages services et projets integrent des visites immersives Matterport.</li>
          </ul>
          <p className="mt-4">
            Ces services ne sont pas des cookies strictement nécessaires au fonctionnement général du site. Ils sont
            utilises pour enrichir certaines pages et restent soumis a la politique du fournisseur tiers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Retrait du consentement</h2>
          <p className="mt-4">
            Vous pouvez retirer votre consentement a tout moment depuis cette page ou depuis le lien &quot;Gestion des
            cookies&quot; en pied de page. En cas de refus, les cookies Google Analytics connus sont supprimes par le site
            lorsque c est techniquement possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Politiques des fournisseurs tiers</h2>
          <ul className="mt-4 space-y-3">
            {providerPolicies.map((policy) => (
              <li key={policy.href}>
                <a
                  className="font-semibold text-[#c75d19] underline-offset-4 hover:underline"
                  href={policy.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {policy.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Parametrage du navigateur</h2>
          <p className="mt-4">
            Vous pouvez aussi supprimer les cookies depuis les reglages de votre navigateur. Ce reglage est distinct du
            choix exprime sur le site et peut supprimer la préférence memorisee localement.
          </p>
        </section>
      </LegalPageShell>
    </>
  )
}
