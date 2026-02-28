'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CLIENTS_DATA } from '@/constants'

interface ClientsProps {
  variant?: 'section' | 'page'
}

export default function Clients({ variant = 'section' }: ClientsProps) {
  const isSection = variant === 'section'
  const wrapperClass = isSection ? 'py-20 bg-cover bg-center bg-fixed relative' : ''
  const wrapperStyle = isSection ? { backgroundImage: "url('/images/optimized/hero/bgclient.webp')" } : {}

  return (
    <section className={wrapperClass} style={wrapperStyle}>
      {isSection && <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />}
      <div className="container relative mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Ils nous font confiance</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Nous sommes fiers de collaborer avec des acteurs exigeants : &Eacute;tat, D&eacute;partements, EPCI, collectivit&eacute;s, gestionnaires de patrimoine, architectes, bureaux d&rsquo;&eacute;tudes, entreprises et industriels. Ce qui nous vaut leur confiance : une r&eacute;ponse claire, une organisation ma&icirc;tris&eacute;e, des livrables fiables, propres et homog&egrave;nes.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
        </div>

        <div className="grid grid-cols-2 items-center justify-center gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CLIENTS_DATA.map((client) => (
            <div key={client.name} className="flex h-20 items-center justify-center" title={client.name}>
              <Image
                src={client.logoUrl}
                alt={client.name}
                width={120}
                height={80}
                className="max-h-full max-w-full object-contain filter grayscale transition-all duration-300 ease-in-out hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        {isSection && (
          <div className="mt-16 text-center">
            <Link
              href="/a-propos"
              className="inline-block rounded-md bg-[#ee7527] px-6 py-3 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#d9661f] hover:shadow-xl"
            >
              Decouvrir nos references et projets
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
