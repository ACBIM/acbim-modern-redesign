import { GA_MEASUREMENT_ID } from '@/lib/site'

export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>

const DEBUG_QUERY_PARAMS = ['ga_debug', 'ga_manual_test']

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function shouldEnableDebugMode() {
  if (typeof window === 'undefined') return false

  const searchParams = new URLSearchParams(window.location.search)
  return DEBUG_QUERY_PARAMS.some((paramName) => searchParams.has(paramName))
}

function withDebugMode(params: AnalyticsEventParams = {}) {
  if (!shouldEnableDebugMode()) return params

  return {
    ...params,
    debug_mode: true,
  }
}

export function initializeAnalytics(_measurementId = GA_MEASUREMENT_ID) {
  // The global Google tag is now loaded directly in app/layout.tsx.
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, withDebugMode(params))
}

export function trackPageView(pagePath: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || !window.gtag) return

  const pageViewParams = withDebugMode({
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  })

  window.gtag('config', GA_MEASUREMENT_ID, pageViewParams)
}

export function trackLeadFormSubmit(formName = 'contact_form') {
  trackEvent('generate_lead', {
    form_name: formName,
    engagement_type: 'contact',
  })
}
