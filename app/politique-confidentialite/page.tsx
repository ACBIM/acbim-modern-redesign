import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'
import { generateBreadcrumbSchema } from '@/lib/schema'
import {
  BASE_URL,
  COMPANY_EMAIL,
  COMPANY_LEGAL_NAME,
  COMPANY_NAME,
  COMPANY_PHONE_DISPLAY,
} from '@/lib/site'

export const metadata: Metadata = {
  title: 'Politique de confidentialite',
  description:
    'Politique de confidentialite du site ACBIM : formulaire de contact, audience, contenus tiers, durées de conservation et droits RGPD.',
  alternates: {
    canonical: '/politique-confidentialite/',
  },
  openGraph: {
    title: `Politique de confidentialite | ${COMPANY_NAME}`,
    description: 'Traitements de données personnelles réalisés via le site ACBIM.',
    type: 'website',
    url: `${BASE_URL}/politique-confidentialite/`,
  },
}

const processingRows = [
  {
    purpose: 'Répondre aux demandes envoyees via le formulaire, par email ou par téléphone',
    data: 'Nom, email, téléphone si communique, sujet, message, informations de projet',
    basis: 'Mesures precontractuelles et intérêt legitime',
  },
  {
    purpose: 'Assurer le suivi commercial ou technique d une demande professionnelle',
    data: 'Coordonnées, historique des echanges, pieces utiles au projet',
    basis: 'Intérêt legitime ou execution d un contrat',
  },
  {
    purpose: 'Securiser le formulaire et limiter les envois abusifs',
    data: 'Adresse IP, user-agent, horodatage, URL d origine, identifiant de demande',
    basis: 'Intérêt legitime',
  },
  {
    purpose: 'Mesurer l audience du site avec Google Analytics après consentement',
    data: 'Pages consultees, evenements de navigation, identifiants de mesure, données techniques de visite',
    basis: 'Consentement',
  },
]

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Politique de confidentialite', url: '/politique-confidentialite/' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <LegalPageShell
        title="Politique de confidentialite"
        description="Cette page explique quelles données sont traitees via le site, pourquoi, pendant combien de temps et comment exercer vos droits."
        updatedAt="23 avril 2026"
      >
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Responsable du traitement</h2>
          <p className="mt-4">
            Le responsable du traitement est {COMPANY_LEGAL_NAME}, éditeur du site {COMPANY_NAME}. Pour toute question
            relative aux données personnelles, vous pouvez ecrire a{' '}
            <a className="font-semibold text-[#c75d19] underline-offset-4 hover:underline" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>
            {' '}ou contacter ACBIM au {COMPANY_PHONE_DISPLAY}.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Traitements réalisés</h2>
          <div className="mt-5 overflow-x-auto border-y border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-100 text-slate-950">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Finalite
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Données concernees
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Base legale
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {processingRows.map((row) => (
                  <tr key={row.purpose}>
                    <td className="px-4 py-4 align-top font-medium text-slate-950">{row.purpose}</td>
                    <td className="px-4 py-4 align-top">{row.data}</td>
                    <td className="px-4 py-4 align-top">{row.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Formulaire de contact</h2>
          <p className="mt-4">
            Les champs obligatoires du formulaire servent uniquement a comprendre votre demande et a vous répondre. Le
            formulaire archive aussi des données techniques limitees afin de securiser le service, diagnostiquer une
            erreur d envoi et limiter les abus. Ces données ne sont pas revendues.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Destinataires et sous-traitants</h2>
          <p className="mt-4">
            Les données sont accessibles aux personnes habilitees chez ACBIM et, lorsque cela est nécessaire, a ses
            prestataires techniques : Cloudflare pour l hébergement statique, OVH pour l endpoint du formulaire,
            prestataires de messagerie, Google LLC pour la mesure d audience et certains contenus integres
            (YouTube, Google Maps) et Matterport, LLC pour certaines visites immersives. Ces services peuvent impliquer
            des traitements hors Union europeenne ; ACBIM s appuie sur les garanties contractuelles mises a disposition
            par ces prestataires lorsqu elles sont applicables.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Contenus tiers integres</h2>
          <p className="mt-4">
            Certaines pages du site affichent des contenus heberges par des tiers. C est notamment le cas de videos
            YouTube, de la carte Google Maps des projets et de certaines visites immersives Matterport.
          </p>
          <p className="mt-4">
            Lorsque ces contenus sont affiches, votre navigateur se connecte directement au fournisseur concerne. Celui-ci
            peut alors recevoir votre adresse IP, votre user-agent, la page d origine, des données techniques de
            navigation et, selon son propre fonctionnement, lire ou deposer des traceurs soumis a sa propre politique.
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>YouTube / youtube-nocookie.com : videos integrees et hero video.</li>
            <li>Google Maps : carte interactive des projets.</li>
            <li>Matterport : certaines visites virtuelles immersives.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Durées de conservation</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            <li>Demandes de contact : temps nécessaire au traitement, puis jusqu a 3 ans après le dernier echange.</li>
            <li>Documents lies a une mission ou un contrat : durée de la relation puis durées legales applicables.</li>
            <li>Journaux techniques du formulaire : jusqu a 12 mois, sauf besoin de sécurité ou contentieux.</li>
            <li>Choix cookies : 6 mois avant une nouvelle demande de choix.</li>
            <li>Cookies Google Analytics : durée maximale configuree a 13 mois.</li>
            <li>Traceurs de YouTube, Google Maps et Matterport : selon la politique du fournisseur tiers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Vos droits</h2>
          <p className="mt-4">
            Vous disposez des droits d acces, de rectification, d effacement, de limitation, d opposition et, lorsque
            c est applicable, de portabilite. Vous pouvez aussi retirer votre consentement aux cookies de mesure
            d audience a tout moment.
          </p>
          <p className="mt-4">
            Pour exercer vos droits, envoyez votre demande a{' '}
            <a className="font-semibold text-[#c75d19] underline-offset-4 hover:underline" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>
            {' '}avec l objet &quot;Données personnelles&quot;. En cas de difficulte non resolue, vous pouvez saisir la CNIL.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Cookies</h2>
          <p className="mt-4">
            Le site utilise des traceurs techniques indispensables et, si vous l acceptez, Google Analytics pour mesurer
            l audience. Certaines pages peuvent aussi charger des contenus tiers Google ou Matterport. Le détail et les
            options de retrait sont disponibles sur la{' '}
            <Link className="font-semibold text-[#c75d19] underline-offset-4 hover:underline" href="/cookies/">
              page cookies
            </Link>
            .
          </p>
        </section>
      </LegalPageShell>
    </>
  )
}
