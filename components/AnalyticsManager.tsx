'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { trackEvent, trackPageView, initializeAnalytics } from '@/lib/analytics'
import { GA_MEASUREMENT_ID } from '@/lib/site'

const CONSENT_KEY = 'acbim_analytics_consent_v2'
const LEGACY_CONSENT_KEY = 'acbim_analytics_consent'
const CONSENT_VERSION = 2
const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000

type ConsentState = 'unknown' | 'granted' | 'denied'

interface ConsentRecord {
  status: Exclude<ConsentState, 'unknown'>
  version: number
  decidedAt: string
  expiresAt: string
}

function disableGoogleAnalytics(disabled: boolean) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return

  ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled
}

function isStoredConsent(value: string | null): ConsentRecord | null {
  if (!value) return null

  if (value === 'granted' || value === 'denied') {
    const now = Date.now()
    return {
      status: value,
      version: 1,
      decidedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + CONSENT_DURATION_MS).toISOString(),
    }
  }

  try {
    const parsed = JSON.parse(value) as Partial<ConsentRecord>
    if (parsed.status !== 'granted' && parsed.status !== 'denied') return null
    if (!parsed.expiresAt || Number.isNaN(Date.parse(parsed.expiresAt))) return null

    return {
      status: parsed.status,
      version: Number(parsed.version) || CONSENT_VERSION,
      decidedAt: parsed.decidedAt || new Date().toISOString(),
      expiresAt: parsed.expiresAt,
    }
  } catch {
    return null
  }
}

function removeCookie(name: string) {
  if (typeof document === 'undefined') return

  const host = window.location.hostname
  const domainParts = host.split('.')
  const candidateDomains = new Set<string>(['', host, `.${host}`])

  if (domainParts.length > 2) {
    const rootDomain = domainParts.slice(-2).join('.')
    candidateDomains.add(rootDomain)
    candidateDomains.add(`.${rootDomain}`)
  }

  candidateDomains.add('aura-bim.fr')
  candidateDomains.add('.aura-bim.fr')

  for (const domain of candidateDomains) {
    const domainPart = domain ? `; domain=${domain}` : ''
    document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax; Secure`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`
  }
}

function removeAnalyticsCookies() {
  if (typeof document === 'undefined') return

  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter(Boolean)

  for (const name of cookieNames) {
    if (name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_')) {
      removeCookie(name)
    }
  }
}

function buildConsentRecord(status: Exclude<ConsentState, 'unknown'>): ConsentRecord {
  const now = Date.now()
  return {
    status,
    version: CONSENT_VERSION,
    decidedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + CONSENT_DURATION_MS).toISOString(),
  }
}

export default function AnalyticsManager() {
  const pathname = usePathname()
  const [consent, setConsent] = useState<ConsentState>('unknown')
  const [isConfigured, setIsConfigured] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [draftConsent, setDraftConsent] = useState<Exclude<ConsentState, 'unknown'>>('denied')
  const lastTrackedPath = useRef('')

  const shouldShowBanner = GA_MEASUREMENT_ID && consent === 'unknown' && !isPreferencesOpen
  const shouldShowPreferences = GA_MEASUREMENT_ID && isPreferencesOpen

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const storedConsent =
      isStoredConsent(window.localStorage.getItem(CONSENT_KEY)) ||
      isStoredConsent(window.localStorage.getItem(LEGACY_CONSENT_KEY))

    if (storedConsent && Date.parse(storedConsent.expiresAt) > Date.now()) {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(storedConsent))
      window.localStorage.removeItem(LEGACY_CONSENT_KEY)
      setConsent(storedConsent.status)
      setDraftConsent(storedConsent.status)
      disableGoogleAnalytics(storedConsent.status === 'denied')
      return
    }

    window.localStorage.removeItem(CONSENT_KEY)
    window.localStorage.removeItem(LEGACY_CONSENT_KEY)
    disableGoogleAnalytics(true)
    setConsent('unknown')
    setDraftConsent('denied')
  }, [])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const openPreferences = () => {
      setDraftConsent(consent === 'granted' ? 'granted' : 'denied')
      setIsPreferencesOpen(true)
    }

    window.addEventListener('acbim:open-cookie-preferences', openPreferences)
    return () => {
      window.removeEventListener('acbim:open-cookie-preferences', openPreferences)
    }
  }, [consent])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || consent !== 'granted' || isConfigured) return

    disableGoogleAnalytics(false)
    initializeAnalytics(GA_MEASUREMENT_ID)
    setIsConfigured(true)
  }, [consent, isConfigured])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || consent !== 'denied') return

    disableGoogleAnalytics(true)
    removeAnalyticsCookies()
    setIsConfigured(false)
    lastTrackedPath.current = ''
  }, [consent])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || consent !== 'granted' || !isConfigured) return
    if (!pathname || lastTrackedPath.current === pathname) return

    lastTrackedPath.current = pathname
    trackPageView(pathname)
  }, [consent, isConfigured, pathname])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || consent !== 'granted') return

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href') || ''
      if (href.startsWith('mailto:')) {
        trackEvent('contact_email_click', { link_url: href })
      } else if (href.startsWith('tel:')) {
        trackEvent('contact_phone_click', { link_url: href })
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [consent])

  const currentLabel = useMemo(() => {
    if (consent === 'granted') return 'Mesure d’audience acceptée'
    if (consent === 'denied') return 'Mesure d’audience refusée'
    return 'Aucun choix enregistré'
  }, [consent])

  const applyConsent = (nextConsent: Exclude<ConsentState, 'unknown'>) => {
    if (!GA_MEASUREMENT_ID) return

    const record = buildConsentRecord(nextConsent)
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record))
    window.localStorage.removeItem(LEGACY_CONSENT_KEY)
    setConsent(nextConsent)
    setDraftConsent(nextConsent)
    setIsPreferencesOpen(false)

    if (nextConsent === 'denied') {
      disableGoogleAnalytics(true)
      removeAnalyticsCookies()
      setIsConfigured(false)
      lastTrackedPath.current = ''
    } else {
      disableGoogleAnalytics(false)
    }
  }

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      {shouldShowBanner ? (
        <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-4xl rounded-lg border border-slate-300 bg-white p-4 shadow-2xl md:flex md:items-center md:justify-between md:gap-5">
          <div className="text-sm leading-6 text-slate-700">
            <p className="font-semibold text-slate-950">Cookies de mesure d'audience</p>
            <p>
              ACBIM utilise Google Analytics uniquement avec votre accord pour mesurer l’audience du site. Vous pouvez
              accepter, refuser ou modifier votre choix à tout moment.
            </p>
            <Link className="font-semibold text-[#c75d19] underline-offset-4 hover:underline" href="/cookies/">
              En savoir plus
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:justify-end">
            <button
              type="button"
              onClick={() => applyConsent('denied')}
              className="rounded-md border border-slate-900 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftConsent('denied')
                setIsPreferencesOpen(true)
              }}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Paramétrer
            </button>
            <button
              type="button"
              onClick={() => applyConsent('granted')}
              className="rounded-md border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Tout accepter
            </button>
          </div>
        </div>
      ) : null}

      {shouldShowPreferences ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-4 sm:items-center">
          <section
            className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ee7527]">Cookies</p>
                <h2 id="cookie-preferences-title" className="mt-1 text-2xl font-bold text-slate-950">
                  Préférences de confidentialité
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(false)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Fermer
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-700">
              Statut actuel : <span className="font-semibold text-slate-950">{currentLabel}</span>. Le site ne dépose
              pas de cookie publicitaire. La mesure d’audience Google Analytics est facultative.
            </p>

            <div className="mt-5 rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-950">Mesure d'audience</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Autoriser Google Analytics à produire des statistiques de consultation du site ACBIM.
                  </p>
                </div>
                <label className="inline-flex min-w-32 items-center gap-3 text-sm font-semibold text-slate-950">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-slate-300 text-[#ee7527] focus:ring-[#ee7527]"
                    checked={draftConsent === 'granted'}
                    onChange={(event) => setDraftConsent(event.currentTarget.checked ? 'granted' : 'denied')}
                  />
                  Autoriser
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyConsent('denied')}
                className="rounded-md border border-slate-900 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Tout refuser
              </button>
              <button
                type="button"
                onClick={() => applyConsent(draftConsent)}
                className="rounded-md border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Enregistrer mon choix
              </button>
              <button
                type="button"
                onClick={() => applyConsent('granted')}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Tout accepter
              </button>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Votre choix est conservé 6 mois. Les cookies Google Analytics sont configurés pour une durée maximale de
              13 mois.
            </p>
          </section>
        </div>
      ) : null}
    </>
  )
}
