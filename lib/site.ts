const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aura-bim.fr'

export const SITE_URL = rawSiteUrl.replace(/\/+$/, '')
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '')
export const BASE_URL = `${SITE_URL}${BASE_PATH}`

export const COMPANY_NAME = 'ACBIM'
export const COMPANY_LEGAL_NAME = 'ACBIM-MOPUS'
export const COMPANY_LEGAL_FORM = 'SAS'
export const COMPANY_SHARE_CAPITAL = '4 800 EUR'
export const COMPANY_SIREN = '752 690 750'
export const COMPANY_SIRET = '752 690 750 00027'
export const COMPANY_RCS = '752 690 750 R.C.S. Aurillac'
export const COMPANY_VAT_NUMBER = 'FR47752690750'
export const COMPANY_APE_CODE = '71.12B - Ingenierie, etudes techniques'
export const COMPANY_PUBLICATION_DIRECTOR = 'Aurelie Baladier'
export const SITE_LOCALE = 'fr_FR'
export const COMPANY_PHONE_E164 = '+33643200476'
export const COMPANY_PHONE_DISPLAY = '+33 6 43 20 04 76'
export const COMPANY_EMAIL = 'contact@acbim.fr'
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADps95TNABwksdqi'
export const DEFAULT_OG_IMAGE_URL = `${BASE_URL}/images/optimized/seo/og-default.webp`
export const COMPANY_ADDRESS = {
  streetAddress: '52 avenue Jean Baptiste Veyre',
  addressLocality: 'Aurillac',
  postalCode: '15000',
  addressCountry: 'FR',
  addressRegion: 'Auvergne-Rhône-Alpes',
}

export const HOSTING_PROVIDERS = [
  {
    label: 'Site statique',
    name: 'Cloudflare, Inc. (Cloudflare Pages)',
    address: '101 Townsend St, San Francisco, CA 94107, USA',
    phone: '+1 (650) 319-8930',
    website: 'https://www.cloudflare.com/',
  },
  {
    label: 'Endpoint formulaire',
    name: 'OVH SAS',
    address: '2 rue Kellermann, 59100 Roubaix, France',
    phone: '+33 9 72 10 10 07',
    website: 'https://www.ovhcloud.com/fr/',
  },
]
