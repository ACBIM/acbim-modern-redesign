import { PROJECTS_DATA, SERVICES_DATA } from '@/constants'
import type { Project, Service } from '@/types'

export interface ProjectCollectionDefinition {
  slug: string
  title: string
  subtitle: string
  description: string
  seoDescription: string
  heroEyebrow: string
  objectives: string[]
  match: {
    projectSlugs?: string[]
    tagsAny?: string[]
    serviceSlugsAny?: string[]
    categoriesAny?: string[]
  }
  emptyStateMessage?: string
}

export const PROJECT_COLLECTIONS: ProjectCollectionDefinition[] = [
  {
    slug: 'patrimoine-monuments-historiques',
    title: 'Patrimoine et monuments historiques',
    subtitle:
      'References de releve, plans, maquette et documentation pour preparer des etudes sur des batiments patrimoniaux et sites remarquables.',
    description:
      'Une thematique centree sur la fiabilisation de l existant en contexte patrimonial : releves, plans, maquettes et supports utiles a la restauration, la rehabilitation et la conservation.',
    seoDescription:
      'Projets ACBIM pour patrimoine et monuments historiques : releve 3D, drone, plans 2D, maquette BIM et livrables pour restauration et conservation.',
    heroEyebrow: 'Thematique',
    objectives: [
      'Fiabiliser l existant avant etudes de restauration et rehabilitation.',
      'Produire des livrables lisibles pour la coordination des interventions.',
      'Documenter le patrimoine avec des donnees reutilisables dans le temps.',
    ],
    match: {
      projectSlugs: ['musee-des-beaux-arts', 'chateau-sedieres-correze', 'espace-public'],
      tagsAny: ['Patrimoine', 'Monument Historique', 'Musee', 'Musee / patrimoine', 'Patrimoine MH'],
      serviceSlugsAny: [
        'releve-scanner-3d-numerisation',
        'dessin-2d-plans-coupes-elevations',
        'maquette-numerique-3d-bim',
        'image-video-environnement-de-projet',
      ],
      categoriesAny: ['Musee / patrimoine', 'Patrimoine MH'],
    },
  },
  {
    slug: 'releve-existant-plans-maquette',
    title: 'Releve de l existant, plans et maquette',
    subtitle:
      'Le coeur de metier ACBIM : fiabiliser l existant avec releves, plans et maquette numerique pour preparer les etudes et les decisions.',
    description:
      'Une thematique orientee base existant fiable : scan 3D, plans 2D, maquette BIM et livrables techniques pour lancer des etudes, coordonner et arbitrer.',
    seoDescription:
      'References ACBIM de releve de l existant, plans et maquette : scan 3D, plans 2D, BIM et livrables techniques pour fiabiliser les projets.',
    heroEyebrow: 'Thematique',
    objectives: [
      'Constituer une base existant fiable avant conception et travaux.',
      'Relier releve, plans et maquette pour limiter les reprises.',
      'Produire des livrables directement exploitables par les equipes projet.',
    ],
    match: {
      projectSlugs: [
        'centre-de-soins-vic',
        'musee-des-beaux-arts',
        'chateau-sedieres-correze',
        'patinoire-du-lioran',
      ],
      tagsAny: ['Scan 3D', 'Plans 2D', 'BIM', 'Maquette BIM', 'Maquette numerique 3D', 'Orthophoto'],
      serviceSlugsAny: [
        'releve-scanner-3d-numerisation',
        'dessin-2d-plans-coupes-elevations',
        'maquette-numerique-3d-bim',
      ],
      categoriesAny: ['Medical / soins', 'Musee / patrimoine', 'Patrimoine MH', 'Equipement sportif'],
    },
  },
  {
    slug: 'renovation-audit-preparation-travaux',
    title: 'Renovation, audit et preparation des travaux',
    subtitle:
      'References utiles pour lancer des etudes, preparer les arbitrages et structurer des livrables de decision avant travaux.',
    description:
      'Une thematique orientee preparation des interventions : base existant fiable, livrables techniques, maquette et supports utiles aux audits, etudes et scenarios de travaux.',
    seoDescription:
      'Projets ACBIM pour renovation, audit et preparation des travaux : releve 3D, plans, maquette BIM et livrables pour fiabiliser les decisions en amont.',
    heroEyebrow: 'Thematique',
    objectives: [
      'Structurer une base technique fiable avant audit et scenario de travaux.',
      'Produire des supports lisibles pour arbitrages MOA/MOE.',
      'Limiter les reprises d etudes en consolidant l existant en amont.',
    ],
    match: {
      projectSlugs: ['patinoire-du-lioran', 'centre-de-soins-vic', 'musee-des-beaux-arts', 'chateau-sedieres-correze'],
      tagsAny: ['Audit energetique', 'BIM', 'Patrimoine', 'Sante', 'Equipement sportif'],
      serviceSlugsAny: [
        'releve-scanner-3d-numerisation',
        'dessin-2d-plans-coupes-elevations',
        'maquette-numerique-3d-bim',
      ],
      categoriesAny: ['Medical / soins', 'Musee / patrimoine', 'Patrimoine MH', 'Equipement sportif'],
    },
  },
  {
    slug: 'communication-projet-experiences-immersives',
    title: 'Communication projet et experiences immersives',
    subtitle:
      'Visuels, rendus, visites virtuelles et supports immersifs pour expliquer rapidement un projet et faciliter les arbitrages.',
    description:
      'Une thematique dediee aux projets ou la visualisation, les medias et l immersion aident a mieux comprendre, presenter et decider.',
    seoDescription:
      'Projets ACBIM de communication projet et experiences immersives : rendus 3D, visuels, videos et visites virtuelles pour presentations et concertation.',
    heroEyebrow: 'Thematique',
    objectives: [
      'Rendre un projet lisible pour des publics techniques et non techniques.',
      'Faciliter la concertation et les arbitrages avec des supports visuels clairs.',
      'Produire des medias reutilisables pour reunions, communication et diffusion.',
    ],
    match: {
      projectSlugs: ['espace-public', 'commerce-pisciniste', 'patinoire-du-lioran'],
      tagsAny: ['Rendu 3D', 'Visite virtuelle', 'Espace public', 'Communication'],
      serviceSlugsAny: [
        'image-video-communication-de-projet',
        'image-video-environnement-de-projet',
        'visite-virtuelle-360-3d',
      ],
      categoriesAny: ['Rendu 3D / espace public', 'Visite virtuelle / commerce', 'Equipement sportif'],
    },
  },
]

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function projectTimestamp(project: Project) {
  const raw = project.publishedAt ?? project.date ?? ''
  const ts = Date.parse(raw)
  return Number.isNaN(ts) ? 0 : ts
}

function matchesAnyNormalized(candidateValues: string[] | undefined, expectedValues: string[] | undefined) {
  if (!candidateValues || candidateValues.length === 0 || !expectedValues || expectedValues.length === 0) return false
  const candidateSet = new Set(candidateValues.map(normalize))
  return expectedValues.some((value) => candidateSet.has(normalize(value)))
}

export function getProjectCollectionBySlug(slug: string) {
  return PROJECT_COLLECTIONS.find((collection) => collection.slug === slug)
}

export function getProjectsForCollection(collectionSlug: string) {
  const collection = getProjectCollectionBySlug(collectionSlug)
  if (!collection) return []

  const explicitOrder = collection.match.projectSlugs ?? []
  const explicitSet = new Set(explicitOrder)
  const explicitIndex = new Map(explicitOrder.map((slug, index) => [slug, index]))

  const projects = PROJECTS_DATA.filter((project) => {
    if (explicitSet.has(project.slug)) return true

    const categoryCandidates = [project.category, project.categoryShort].filter(Boolean) as string[]
    const categoryHit = matchesAnyNormalized(categoryCandidates, collection.match.categoriesAny)
    const tagsHit = matchesAnyNormalized(project.tags, collection.match.tagsAny)
    const servicesHit = matchesAnyNormalized(project.services, collection.match.serviceSlugsAny)

    return categoryHit || tagsHit || servicesHit
  })

  return projects.sort((a, b) => {
    const aExplicit = explicitIndex.has(a.slug)
    const bExplicit = explicitIndex.has(b.slug)

    if (aExplicit && bExplicit) return (explicitIndex.get(a.slug) ?? 0) - (explicitIndex.get(b.slug) ?? 0)
    if (aExplicit) return -1
    if (bExplicit) return 1

    return projectTimestamp(b) - projectTimestamp(a)
  })
}

export function getCollectionsSummary() {
  return PROJECT_COLLECTIONS.map((collection) => ({
    ...collection,
    projects: getProjectsForCollection(collection.slug),
  }))
}

export function getCollectionsForProject(project: Project) {
  return PROJECT_COLLECTIONS.filter((collection) =>
    getProjectsForCollection(collection.slug).some((candidate) => candidate.slug === project.slug),
  )
}

export function getServicesForCollection(collectionSlug: string): Service[] {
  const projects = getProjectsForCollection(collectionSlug)
  const serviceSlugSet = new Set(projects.flatMap((project) => project.services))

  return SERVICES_DATA.filter((service) => serviceSlugSet.has(service.slug))
}
