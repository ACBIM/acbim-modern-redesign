'use client'

import { useId, useState } from 'react'

type DeferredIframeEmbedProps = {
  src: string
  title: string
  buttonLabel?: string
  helperText?: string
  paddingTop?: string
  allow?: string
}

export default function DeferredIframeEmbed({
  src,
  title,
  buttonLabel = 'Charger le viewer',
  helperText = 'Chargement a la demande pour ne pas ralentir l ouverture de la page.',
  paddingTop = '56.25%',
  allow = 'autoplay; fullscreen; web-share; xr-spatial-tracking',
}: DeferredIframeEmbedProps) {
  const [hasStartedLoading, setHasStartedLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const iframeId = useId()

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-md">
      <div className="relative w-full" style={{ paddingTop }}>
        {hasStartedLoading ? (
          <iframe
            id={iframeId}
            src={src}
            title={title}
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
            allow={allow}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setIsReady(true)}
          />
        ) : null}

        {!isReady ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Viewer interactif</p>
              <h3 className="mt-2 text-xl font-bold text-white md:text-2xl">Gaussian Splat</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{helperText}</p>

              <button
                type="button"
                aria-controls={iframeId}
                onClick={() => setHasStartedLoading(true)}
                disabled={hasStartedLoading}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#ee7527] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d9661f] disabled:cursor-wait disabled:bg-[#d9661f]"
              >
                {hasStartedLoading ? 'Chargement du viewer...' : buttonLabel}
              </button>

              {hasStartedLoading ? (
                <p className="mt-3 text-xs text-slate-400">Le viewer se charge dans ce bloc, sans bloquer la page.</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
