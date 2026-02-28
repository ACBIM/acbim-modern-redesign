import type { MetadataRoute } from 'next'
import { PROJECTS_DATA, SERVICES_DATA } from '@/constants'
import { PROJECT_COLLECTIONS } from '@/lib/projectCollections'
import { BASE_URL } from '@/lib/site'

export const dynamic = 'force-static'

const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
  {
    url: `${BASE_URL}/services/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/projets/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/projets/collections/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/a-propos/`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/contact/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages: MetadataRoute.Sitemap = SERVICES_DATA.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const projectPages: MetadataRoute.Sitemap = PROJECTS_DATA.map((project) => ({
    url: `${BASE_URL}/projets/${project.slug}/`,
    lastModified: project.publishedAt ? new Date(project.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const collectionPages: MetadataRoute.Sitemap = PROJECT_COLLECTIONS.map((collection) => ({
    url: `${BASE_URL}/projets/collections/${collection.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [...staticPages, ...servicePages, ...projectPages, ...collectionPages]
}
