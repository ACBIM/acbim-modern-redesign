export type IconKey =
  | 'cube'
  | 'camera'
  | 'cloud-pc'
  | 'scan'
  | 'collection'
  | 'drone'
  | 'virtual-tour'
  | 'reno-energetique'
  | 'clipboard-list'
  | 'cog'
  | 'document-download'

export interface ProcessStep {
  title: string
  description: string
  iconKey: IconKey
}

export interface ServiceGalleryItem {
  src: string
  alt: string
  caption?: string
}

export interface ProjectGalleryItem {
  src: string
  alt?: string
  caption?: string
  kind?: 'image' | 'video'
  poster?: string
  fit?: 'cover' | 'contain'
}

export interface ProjectStory {
  need: string
  response: string
  result: string
}

export interface ProjectKeyFigure {
  label: string
  value: string
}

export interface Service {
  slug: string
  iconKey: IconKey
  title: string
  subtitle: string
  imageUrl: string
  cardImageUrl?: string
  cardImageRotationUrls?: string[]
  matterportEmbedUrl?: string
  description: string
  detailedDescription?: string
  seoKeywords?: string[]
  benefits: string[]
  process: ProcessStep[]
  gallery?: ServiceGalleryItem[]
  relatedProjects?: string[]
}

export interface Project {
  slug: string
  isTopProject?: boolean
  imageUrl: string
  category: string
  categoryShort?: string
  title: string
  excerpt?: string
  description: string
  client: string
  date: string
  publishedAt?: string
  services: string[]
  tags?: string[]
  gallery: Array<string | ProjectGalleryItem>
  immersiveTourEmbedUrl?: string
  gaussianSplatViewerUrl?: string
  gaussianSplatViewerTitle?: string
  gaussianSplatViewerDescription?: string
  context?: ProjectStory
  deliverables?: string[]
  keyFigures?: ProjectKeyFigure[]
  constraints?: string[]
  outcomes?: string[]
  skills?: string[]
}

export interface Client {
  name: string
  logoUrl: string
}
