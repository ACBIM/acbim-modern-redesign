interface ProjectsMapProps {
  className?: string
  variant?: 'full' | 'compact'
}

export default function ProjectsMap({ className = '', variant = 'full' }: ProjectsMapProps) {
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl ${className}`.trim()}>
        <div className="relative aspect-[4/3] w-full">
          <iframe
            title="Carte des projets ACBIM"
            src="https://www.google.com/maps/d/embed?mid=1ShvD_bDSIejRy0ajLUU6SIGlThDOU-M&ehbc=2E312F"
            className="absolute inset-0 h-full w-full border-0 grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    )
  }

  return (
    <section className={`bg-slate-900 py-20 text-white ${className}`.trim()}>
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Des projets partout en France</h2>
          <p className="mt-4 text-slate-300">
            Nous avons eu la chance d&apos;intervenir sur des projets varies, en Auvergne-Rhone-Alpes et bien au-dela.
          </p>
          <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl">
          <div className="relative aspect-[4/3] w-full md:aspect-[16/8]">
            <iframe
              title="Carte des projets ACBIM"
              src="https://www.google.com/maps/d/embed?mid=1ShvD_bDSIejRy0ajLUU6SIGlThDOU-M&ehbc=2E312F"
              className="absolute inset-0 h-full w-full border-0 grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
