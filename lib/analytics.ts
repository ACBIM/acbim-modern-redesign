export type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>

const GOOGLE_TAG_SCRIPT_ID = 'ga4-script'
const DEBUG_QUERY_PARAMS = ['ga_debug', 'ga_manual_test']

let configuredMeasurementId = ''

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

function loadGoogleTagScript(measurementId: string) {
  if (typeof document === 'undefined') return
  if (document.getElementById(GOOGLE_TAG_SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = GOOGLE_TAG_SCRIPT_ID
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`

  document.head.appendChild(script)
}

function shouldEnableDebugMode() {
  if (typeof window === 'undefined') return false

  const searchParams = new URLSearchParams(window.location.search)
  return DEBUG_QUERY_PARAMS.some((paramName) => searchParams.has(paramName))
}

function withAnalyticsDefaults(params: AnalyticsEventParams = {}) {
  const nextParams: AnalyticsEventParams = {
    ...params,
  }

  if (configuredMeasurementId && !nextParams.send_to) {
    nextParams.send_to = configuredMeasurementId
  }

  if (shouldEnableDebugMode()) {
    nextParams.debug_mode = true
  }

  return nextParams
}

function withDebugMode(params: AnalyticsEventParams = {}) {
  if (!shouldEnableDebugMode()) return params

  return {
    ...params,
    debug_mode: true,
  }
}

export function initializeAnalytics(measurementId: string) {
  if (typeof window === 'undefined' || !measurementId) return

  configuredMeasurementId = measurementId
  ensureDataLayer()
  loadGoogleTagScript(measurementId)

  const configParams: AnalyticsEventParams = {
    send_page_view: false,
    anonymize_ip: true,
    cookie_expires: 60 * 60 * 24 * 395,
    cookie_update: false,
    cookie_flags: 'SameSite=Lax;Secure',
  }

  if (shouldEnableDebugMode()) {
    configParams.debug_mode = true
  }

  window.gtag?.('js', new Date())
  window.gtag?.('config', measurementId, configParams)
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, withAnalyticsDefaults(params))
}

export function trackPageView(pagePath: string) {
  if (typeof window === 'undefined') return

  const pageViewParams = withDebugMode({
    send_page_view: true,
    page_title: document.title,
    page_location: window.location.href,
    page_path: pagePath,
  })

  if (configuredMeasurementId) {
    window.gtag?.('config', configuredMeasurementId, pageViewParams)
    return
  }

  trackEvent('page_view', pageViewParams)
}

export function trackLeadFormSubmit(formName = 'contact_form') {
  trackEvent('generate_lead', {
    form_name: formName,
    engagement_type: 'contact',
  })
}
