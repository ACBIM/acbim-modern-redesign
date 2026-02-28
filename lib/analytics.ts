export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function ensureDataLayer() {
  if (typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args)
    }
  }
}

export function initializeAnalytics(measurementId: string) {
  if (typeof window === 'undefined' || !measurementId) return

  ensureDataLayer()
  window.gtag?.('js', new Date())
  window.gtag?.('config', measurementId, {
    send_page_view: false,
    anonymize_ip: true,
  })
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

export function trackPageView(pagePath: string) {
  if (typeof window === 'undefined') return

  trackEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  })
}

export function trackLeadFormSubmit(formName = 'contact_form') {
  trackEvent('generate_lead', {
    form_name: formName,
    engagement_type: 'contact',
  })
}
