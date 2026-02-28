const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aura-bim.fr'

export const SITE_URL = rawSiteUrl.replace(/\/+$/, '')
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '')
export const BASE_URL = `${SITE_URL}${BASE_PATH}`

export const COMPANY_NAME = 'ACBIM'
export const SITE_LOCALE = 'fr_FR'
export const COMPANY_PHONE_E164 = '+33643200476'
export const COMPANY_EMAIL = 'contact@acbim.fr'
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
export const DEFAULT_OG_IMAGE_URL = `${BASE_URL}/images/optimized/seo/og-default.webp`
export const COMPANY_ADDRESS = {
  streetAddress: '52 avenue Jean Baptiste Veyre',
  addressLocality: 'Aurillac',
  postalCode: '15000',
  addressCountry: 'FR',
  addressRegion: 'Auvergne-Rhône-Alpes',
}
