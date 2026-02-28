import { PROJECTS_DATA, SERVICES_DATA } from '@/constants'
import { BASE_URL, COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_NAME, COMPANY_PHONE_E164 } from '@/lib/site'

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE_URL}#organization`,
    name: COMPANY_NAME,
    description: 'Expert en modélisation des données du bâtiment',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    email: COMPANY_EMAIL,
    telephone: COMPANY_PHONE_E164,
    areaServed: ['Cantal', 'Auvergne-Rhône-Alpes', 'Régions limitrophes'],
    address: {
      '@type': 'PostalAddress',
      ...COMPANY_ADDRESS,
    },
    sameAs: ['https://www.linkedin.com/company/acbim-mopus/?viewAsMember=true'],
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
    areaServed: ['Cantal', 'Auvergne-Rhône-Alpes', 'Régions limitrophes'],
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
