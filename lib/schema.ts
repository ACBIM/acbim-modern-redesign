import { PROJECTS_DATA, SERVICES_DATA } from '@/constants'
import {
  BASE_URL,
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_LEGAL_NAME,
  COMPANY_NAME,
  COMPANY_PHONE_E164,
  DEFAULT_OG_IMAGE_URL,
} from '@/lib/site'

const SOCIAL_PROFILE_URLS = [
  'https://www.linkedin.com/company/acbim-mopus/',
  'https://www.facebook.com/acbimmopus3d',
  'https://www.youtube.com/@acbimmopus631',
]

// Cantal + départements limitrophes (couverture SEO local — AuditOpus #2)
const AREA_SERVED = [
  { '@type': 'City', name: 'Aurillac' },
  { '@type': 'AdministrativeArea', name: 'Cantal' },
  { '@type': 'AdministrativeArea', name: 'Corrèze' },
  { '@type': 'AdministrativeArea', name: 'Lot' },
  { '@type': 'AdministrativeArea', name: 'Aveyron' },
  { '@type': 'AdministrativeArea', name: 'Lozère' },
  { '@type': 'AdministrativeArea', name: 'Puy-de-Dôme' },
  { '@type': 'AdministrativeArea', name: 'Haute-Loire' },
  { '@type': 'AdministrativeArea', name: 'Auvergne-Rhône-Alpes' },
]

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${BASE_URL}#organization`,
    name: COMPANY_NAME,
    legalName: COMPANY_LEGAL_NAME,
    description:
      "Bureau d'études et géomètre-topographe à Aurillac (Cantal) : relevé scanner 3D, maquette numérique BIM, plans 2D et topographiques, drone, visite virtuelle et rénovation énergétique.",
    slogan: 'Votre patrimoine numérique',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    image: DEFAULT_OG_IMAGE_URL,
    email: COMPANY_EMAIL,
    telephone: COMPANY_PHONE_E164,
    priceRange: '€€',
    award: ["BIM d'Argent", 'PTNB'],
    areaServed: AREA_SERVED,
    address: {
      '@type': 'PostalAddress',
      ...COMPANY_ADDRESS,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '12:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '14:00',
        closes: '18:00',
      },
    ],
    sameAs: SOCIAL_PROFILE_URLS,
  }
}

export function generateServiceSchema(slug: string) {
  const service = SERVICES_DATA.find((item) => item.slug === slug)
  if (!service) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    serviceType: service.title,
    provider: {
      '@type': 'Organization',
      '@id': `${BASE_URL}#organization`,
      name: COMPANY_NAME,
      url: BASE_URL,
    },
    areaServed: AREA_SERVED,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/contact/`,
    },
  }
}

export function generateProjectSchema(slug: string) {
  const project = PROJECTS_DATA.find((item) => item.slug === slug)
  if (!project) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    dateCreated: project.publishedAt ?? project.date,
    genre: project.category,
    image: project.imageUrl,
    creator: {
      '@type': 'Organization',
      '@id': `${BASE_URL}#organization`,
      name: COMPANY_NAME,
      url: BASE_URL,
    },
    url: `${BASE_URL}/projets/${project.slug}/`,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}
