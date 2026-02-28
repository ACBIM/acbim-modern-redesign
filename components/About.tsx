'use client'

import Image from 'next/image'

export default function About() {
  const experienceYears = new Date().getFullYear() - 2017

  return (
    <section id="a-propos" className="bg-slate-100 py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="lg:w-1/2">
            <Image
              src="/images/optimized/hero/20200121-dgfip-aurillac-04.webp"
              alt="Maquette numerique du projet DGFIP a Aurillac"
              width={600}
              height={400}
              className="h-full w-full rounded-lg object-cover shadow-2xl"
            />
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Notre histoire</h2>
            <div className="mt-4 h-1 w-24 rounded bg-[#ee7527]" />

            <p className="mt-6 leading-relaxed text-slate-600">
              Fonde en 2017 a Aurillac, ACBIM est un bureau d&apos;etudes techniques specialise dans les releves 3D,
              releves par drone, la maquette numerique 3D et la topographie. Nous nous positionnons comme un acteur
              engage de la transition numerique et ecologique du batiment, en fournissant des donnees fiables et
              exploitables pour les collectivites, architectes, industriels et gestionnaires de patrimoine.
            </p>

            <p className="mt-4 leading-relaxed text-slate-600">
              Notre equipe pluridisciplinaire de 5 experts utilise des technologies de pointe (scanner laser, drone, GPS
              RTK) pour repondre avec precision a vos besoins sur des projets de renovation, de gestion patrimoniale ou
              d&apos;audits energetiques.
            </p>

            <div className="mt-8 flex flex-col space-y-4 text-center sm:flex-row sm:space-x-8 sm:space-y-0 sm:text-left">
              <div className="flex-1">
                <span className="text-4xl font-bold text-[#ee7527]">{experienceYears}+</span>
                <p className="text-slate-500">Annees d&apos;experience</p>
              </div>
              <div className="flex-1">
                <span className="text-4xl font-bold text-[#ee7527]">200+</span>
                <p className="text-slate-500">Projets realises</p>
              </div>
              <div className="flex-1">
                <span className="text-4xl font-bold text-[#ee7527]">5</span>
                <p className="text-slate-500">Experts a votre service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
