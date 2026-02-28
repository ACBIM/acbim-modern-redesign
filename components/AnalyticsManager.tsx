'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { trackEvent, trackPageView, initializeAnalytics } from '@/lib/analytics'
import { GA_MEASUREMENT_ID } from '@/lib/site'

const CONSENT_KEY = 'acbim_analytics_consent'

type ConsentState = 'unknown' | 'granted' | 'denied'

export default function AnalyticsManager() {
  const pathname = usePathname()
  const [consent, setConsent] = useState<ConsentState>('unknown')
  const [isConfigured, setIsConfigured] = useState(false)
  const lastTrackedPath = useRef('')

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const storedConsent = window.localStorage.getItem(CONSENT_KEY)
    if (storedConsent === 'granted' || storedConsent === 'denied') {
      setConsent(storedConsent)
      return
    }

    setConsent('unknown')
  }, [])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || consent !== 'granted' || isConfigured) return

    initializeAnalytics(GA_MEASUREMENT_ID)
    setIsConfigured(true)
  }, [consent, isConfigured])

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

  const applyConsent = (nextConsent: Exclude<ConsentState, 'unknown'>) => {
    if (!GA_MEASUREMENT_ID) return

    window.localStorage.setItem(CONSENT_KEY, nextConsent)
    setConsent(nextConsent)

    if (nextConsent === 'denied') {
      setIsConfigured(false)
      lastTrackedPath.current = ''
    }
  }

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      {consent === 'granted' ? (
        <Script
          id="ga4-script"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      ) : null}

      {consent === 'unknown' ? (
        <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl rounded-xl border border-slate-300 bg-white/95 p-4 shadow-2xl backdrop-blur md:flex md:items-center md:justify-between md:gap-4">
          <p className="text-sm text-slate-700">
            Nous utilisons Google Analytics pour mesurer l audience du site. Acceptez-vous les cookies de mesure?
          </p>
          <div className="mt-3 flex gap-2 md:mt-0">
            <button
              type="button"
              onClick={() => applyConsent('denied')}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={() => applyConsent('granted')}
              className="rounded-md bg-[#ee7527] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#d9661f]"
            >
              Accepter
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
