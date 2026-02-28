import Image from 'next/image'

const PARTNERS = [
  {
    name: 'ACDEAU',
    website: 'https://www.acdeau.fr/',
    logoUrl: '/images/optimized/partenaires/acdeau-quadri.webp',
    description:
      "La societe ACDEAU, basee a Aurillac dans le Cantal et creee en 2010, propose ses services dans les domaines de l'alimentation en eau potable et de l'assainissement.",
  },
  {
    name: '2B Maitrise & Concept',
    website: 'https://www.2b-mc.fr/',
    logoUrl: '/images/optimized/partenaires/logo-g-vertical.webp',
    description:
      "2B Maitrise & Concept concilie 15 ans d'experience en maitrise d'oeuvre et 15 ans de terrain en travaux publics, en liant conception et realisation.",
  },
  {
    name: 'EREAH',
    website: 'https://www.ereah.fr/',
    logoUrl: '/images/optimized/partenaires/ereah-logo.webp',
    description:
      "EREAH est un bureau d'etudes d'ingenierie fluides, thermique et energie dans le domaine du batiment.",
  },
  {
    name: 'EnerBIM',
    website: 'https://enerbim.com/',
    logoUrl: '/images/optimized/partenaires/logotype-enerbim-gd.webp',
    description:
      "EnerBIM accompagne les professionnels dans la transition numerique et developpe des solutions innovantes pour le batiment, l'energie et l'interoperabilite BIM.",
  },
]

export default function Partners() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Nos partenaires</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
            Nous collaborons avec des structures complementaires pour proposer une approche complete, du terrain aux
            recommandations d&apos;amelioration.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {PARTNERS.map((partner) => (
            <article key={partner.name} className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="mb-5 flex h-24 items-center justify-center">
                <Image src={partner.logoUrl} alt={partner.name} width={220} height={120} className="max-h-24 w-auto object-contain" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{partner.name}</h3>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-slate-600">{partner.description}</p>
              <div className="mt-6">
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-[#ee7527] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d9661f]"
                >
                  Visiter le site
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
