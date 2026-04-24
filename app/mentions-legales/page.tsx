import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'
import { generateBreadcrumbSchema } from '@/lib/schema'
import {
  BASE_URL,
  COMPANY_ADDRESS,
  COMPANY_APE_CODE,
  COMPANY_EMAIL,
  COMPANY_LEGAL_FORM,
  COMPANY_LEGAL_NAME,
  COMPANY_NAME,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PUBLICATION_DIRECTOR,
  COMPANY_RCS,
  COMPANY_SHARE_CAPITAL,
  COMPANY_SIREN,
  COMPANY_SIRET,
  COMPANY_VAT_NUMBER,
  HOSTING_PROVIDERS,
} from '@/lib/site'

export const metadata: Metadata = {
  title: 'Mentions legales',
  description: "Mentions legales de l'editeur du site ACBIM, bureau d'etudes a Aurillac.",
  alternates: {
    canonical: '/mentions-legales/',
  },
  openGraph: {
    title: `Mentions legales | ${COMPANY_NAME}`,
    description: "Informations legales de l'editeur du site ACBIM.",
    type: 'website',
    url: `${BASE_URL}/mentions-legales/`,
  },
}

const legalDetails = [
  ['Editeur', COMPANY_LEGAL_NAME],
  ['Enseigne', COMPANY_NAME],
  ['Forme juridique', COMPANY_LEGAL_FORM],
  ['Capital social', COMPANY_SHARE_CAPITAL],
  ['SIREN', COMPANY_SIREN],
  ['SIRET du siege', COMPANY_SIRET],
  ['RCS', COMPANY_RCS],
  ['TVA intracommunautaire', COMPANY_VAT_NUMBER],
  ['Code APE', COMPANY_APE_CODE],
  ['Siege social', `${COMPANY_ADDRESS.streetAddress}, ${COMPANY_ADDRESS.postalCode} ${COMPANY_ADDRESS.addressLocality}`],
  ['Email', COMPANY_EMAIL],
  ['Telephone', COMPANY_PHONE_DISPLAY],
]

export default function LegalNoticePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Mentions legales', url: '/mentions-legales/' },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <LegalPageShell
        title="Mentions legales"
        description="Identification de l'editeur, de la direction de publication et des prestataires techniques du site."
        updatedAt="23 avril 2026"
      >
        <section>
          <h2 className="text-2xl font-bold text-slate-950">Editeur du site</h2>
          <dl className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            {legalDetails.map(([label, value]) => (
              <div key={label} className="grid gap-2 py-4 md:grid-cols-[220px_1fr]">
                <dt className="font-semibold text-slate-950">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Direction de la publication</h2>
          <p className="mt-4">
            Directrice de la publication : {COMPANY_PUBLICATION_DIRECTOR}, representante de {COMPANY_LEGAL_NAME}.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Hebergement et prestataires techniques</h2>
          <div className="mt-5 space-y-5">
            {HOSTING_PROVIDERS.map((provider) => (
              <article key={provider.label} className="border-l-4 border-[#ee7527] pl-5">
                <h3 className="font-semibold text-slate-950">{provider.label}</h3>
                <p>{provider.name}</p>
                <p className="text-slate-600">{provider.address}</p>
                <p className="text-slate-600">Telephone : {provider.phone}</p>
                <p className="text-slate-600">
                  Site :{' '}
                  <a className="underline-offset-4 hover:underline" href={provider.website} target="_blank" rel="noreferrer">
                    {provider.website}
                  </a>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Propriete intellectuelle</h2>
          <p className="mt-4">
            Les textes, images, logos, visuels, photographies, videos, modeles, schemas, fichiers et elements graphiques
            presents sur ce site sont proteges par le droit de la propriete intellectuelle. Toute reproduction,
            representation, adaptation ou reutilisation, totale ou partielle, est interdite sans autorisation ecrite
            prealable de {COMPANY_LEGAL_NAME}.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Responsabilite</h2>
          <p className="mt-4">
            ACBIM met en oeuvre des moyens raisonnables pour assurer l'exactitude et la mise a jour des informations
            diffusees. Les informations presentees ont une vocation generale et ne remplacent pas un echange technique
            adapte a chaque projet. Les liens externes sont fournis a titre informatif ; ACBIM ne controle pas leur
            contenu et ne peut etre tenue responsable des pages tierces consultees.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-950">Donnees personnelles</h2>
          <p className="mt-4">
            Les traitements de donnees personnelles realises via ce site sont decrits dans la{' '}
            <a className="font-semibold text-[#c75d19] underline-offset-4 hover:underline" href="/politique-confidentialite/">
              politique de confidentialite
            </a>
            {' '}et dans la{' '}
            <a className="font-semibold text-[#c75d19] underline-offset-4 hover:underline" href="/cookies/">
              page cookies
            </a>
            .
          </p>
        </section>
      </LegalPageShell>
    </>
  )
}
