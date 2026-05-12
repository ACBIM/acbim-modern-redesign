'use client'

import { useEffect, useState } from 'react'
import { GA_MEASUREMENT_ID } from '@/lib/site'

const CONSENT_KEY = 'acbim_analytics_consent_v3'
const LEGACY_CONSENT_KEYS = ['acbim_analytics_consent_v2', 'acbim_analytics_consent']
const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000

type ConsentState = 'unknown' | 'granted' | 'denied'

function buildConsentRecord(status: Exclude<ConsentState, 'unknown'>) {
  const now = Date.now()

  return {
    status,
    decidedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + CONSENT_DURATION_MS).toISOString(),
  }
}

function parseStoredConsent(value: string | null): Exclude<ConsentState, 'unknown'> | null {
  if (!value) return null
  if (value === 'granted' || value === 'denied') return value

  try {
    const parsed = JSON.parse(value) as { status?: ConsentState; expiresAt?: string }
    if (parsed.status !== 'granted' && parsed.status !== 'denied') return null
    if (!parsed.expiresAt || Date.parse(parsed.expiresAt) <= Date.now()) return null
    return parsed.status
  } catch {
    return null
  }
}

function getStoredConsent() {
  const currentConsent = parseStoredConsent(window.localStorage.getItem(CONSENT_KEY))
  if (currentConsent) return currentConsent

  for (const key of LEGACY_CONSENT_KEYS) {
    const legacyConsent = parseStoredConsent(window.localStorage.getItem(key))
    if (legacyConsent) return legacyConsent
  }

  return null
}

function updateGoogleConsent(status: Exclude<ConsentState, 'unknown'>) {
  if (!window.gtag) return

  window.gtag('consent', 'update', {
    analytics_storage: status,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

function sendPageView() {
  if (!GA_MEASUREMENT_ID || !window.gtag) return

  const searchParams = new URLSearchParams(window.location.search)
  const debugMode = searchParams.has('ga_debug') || searchParams.has('ga_manual_test')

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    ...(debugMode ? { debug_mode: true } : {}),
  })
}

function removeCookie(name: string) {
  const host = window.location.hostname
  const domainParts = host.split('.')
  const candidateDomains = new Set<string>(['', host, `.${host}`, 'aura-bim.fr', '.aura-bim.fr'])

  if (domainParts.length > 2) {
    const rootDomain = domainParts.slice(-2).join('.')
    candidateDomains.add(rootDomain)
    candidateDomains.add(`.${rootDomain}`)
  }

  for (const domain of candidateDomains) {
    const domainPart = domain ? `; domain=${domain}` : ''
    document.cookie = `${name}=; Max-Age=0; path=/${domainPart}; SameSite=Lax; Secure`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`
  }
}

function removeAnalyticsCookies() {
  document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0]?.trim())
    .filter(Boolean)
    .filter((name) => name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_'))
    .forEach(removeCookie)
}

export default function AnalyticsConsentBanner() {
  const [consent, setConsent] = useState<ConsentState>('unknown')

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const storedConsent = getStoredConsent()

    if (!storedConsent) {
      setConsent('unknown')
      return
    }

    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(buildConsentRecord(storedConsent)))
    for (const key of LEGACY_CONSENT_KEYS) window.localStorage.removeItem(key)

    updateGoogleConsent(storedConsent)
    setConsent(storedConsent)

    if (storedConsent === 'granted') sendPageView()
    if (storedConsent === 'denied') removeAnalyticsCookies()
  }, [])

  const applyConsent = (nextConsent: Exclude<ConsentState, 'unknown'>) => {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(buildConsentRecord(nextConsent)))
    for (const key of LEGACY_CONSENT_KEYS) window.localStorage.removeItem(key)

    updateGoogleConsent(nextConsent)
    setConsent(nextConsent)

    if (nextConsent === 'granted') sendPageView()
    if (nextConsent === 'denied') removeAnalyticsCookies()
  }

  if (!GA_MEASUREMENT_ID || consent !== 'unknown') return null

  return (
    <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-4xl rounded-lg border border-slate-300 bg-white p-4 shadow-2xl md:flex md:items-center md:justify-between md:gap-5">
      <div className="text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-950">Cookies de mesure d'audience</p>
        <p>
          ACBIM utilise Google Analytics pour mesurer l'audience du site. Vous pouvez accepter ou refuser cette mesure.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:justify-end">
        <button
          type="button"
          onClick={() => applyConsent('denied')}
          className="rounded-md border border-slate-900 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => applyConsent('granted')}
          className="rounded-md border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Accepter
        </button>
      </div>
    </div>
  )
}
