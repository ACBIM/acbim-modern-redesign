import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DeferredIframeEmbed from '@/components/DeferredIframeEmbed'
import IndustryProcessSynoptique from '@/components/IndustryProcessSynoptique'
import { PROJECTS_DATA, SERVICES_DATA } from '@/constants'
import { pickMetaDescription } from '@/lib/seo'
import type { Project, ProjectKeyFigure } from '@/types'
import { getCollectionsForProject } from '@/lib/projectCollections'
import { generateBreadcrumbSchema, generateProjectSchema } from '@/lib/schema'
import { BASE_PATH, BASE_URL, COMPANY_NAME } from '@/lib/site'

type NormalizedGalleryItem =
  | {
      kind: 'image'
      src: string
      alt: string
      caption?: string
      fit?: 'cover' | 'contain'
    }
  | {
      kind: 'video'
      src: string
      alt: string
      caption?: string
      poster?: string
      embedUrl?: string
    }

function getYouTubeVideoId(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.toLowerCase()

    if (host === 'youtu.be') {
      const id = url.pathname.replace(/^\/+/, '').split('/')[0]
      return id || null
    }

    if (host.includes('youtube.com')) {
      if (url.pathname === '/watch') {
        return url.searchParams.get('v')
      }

      const parts = url.pathname.split('/').filter(Boolean)
      const markerIndex = parts.findIndex((part) => part === 'embed' || part === 'shorts')
      if (markerIndex >= 0 && parts[markerIndex + 1]) {
        return parts[markerIndex + 1]
      }
    }

    return null
  } catch {
    return null
  }
}

function toYouTubeAutoplayEmbedUrl(rawUrl: string): string | null {
  const videoId = getYouTubeVideoId(rawUrl)
  if (!videoId) return null

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId,
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function normalizeProjectGallery(project: Project): NormalizedGalleryItem[] {
  return (project.gallery ?? [])
    .map((item, index): NormalizedGalleryItem | null => {
      if (typeof item === 'string') {
        return {
          kind: 'image',
          src: item,
          alt: `${project.title} - visuel ${index + 1}`,
          fit: 'cover',
        }
      }

      const src = item?.src
      if (typeof src !== 'string' || src.trim().length === 0) return null

      if (item.kind === 'video') {
        return {
          kind: 'video',
          src,
          alt: item.alt?.trim() || `${project.title} - video ${index + 1}`,
          caption: item.caption?.trim() || undefined,
          poster: item.poster?.trim() || undefined,
          embedUrl: toYouTubeAutoplayEmbedUrl(src) || undefined,
        }
      }

      return {
        kind: 'image',
        src,
        alt: item.alt?.trim() || `${project.title} - visuel ${index + 1}`,
        caption: item.caption?.trim() || undefined,
        fit: item.fit === 'contain' ? 'contain' : 'cover',
      }
    })
    .filter((item): item is NormalizedGalleryItem => item !== null)
}

function withBasePath(rawUrl: string): string {
  if (!rawUrl.startsWith('/') || BASE_PATH.length === 0) return rawUrl
  if (rawUrl === BASE_PATH || rawUrl.startsWith(`${BASE_PATH}/`)) return rawUrl
  return `${BASE_PATH}${rawUrl}`
}

function splitInteractivePrompt(text: string): { before: string; emphasis: string; after: string } | null {
  const match = text.match(/Cliquez dans la fenêtre pour prendre la main[^!?.]*[!?.]/i)
  if (!match || typeof match.index !== 'number') return null

  const start = match.index
  const end = start + match[0].length

  return {
    before: text.slice(0, start).trimEnd(),
    emphasis: match[0].trim(),
    after: text.slice(end).trimStart(),
  }
}

function getSimilarProjects(project: Project): Project[] {
  const tags = project.tags ?? []
  if (tags.length === 0) return []

  const projectTagSet = new Set(tags)

  return PROJECTS_DATA
    .filter((candidate) => candidate.slug !== project.slug && (candidate.tags?.length ?? 0) > 0)
    .map((candidate) => {
      const sharedTags = (candidate.tags ?? []).filter((tag) => projectTagSet.has(tag))
      return { candidate, score: sharedTags.length, sharedTags }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.candidate.title.localeCompare(b.candidate.title)
    })
    .slice(0, 3)
    .map((entry) => entry.candidate)
}

function hasFilledArray<T>(value: T[] | undefined): value is T[] {
  return Array.isArray(value) && value.length > 0
}

export async function generateStaticParams() {
  return PROJECTS_DATA.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = PROJECTS_DATA.find((item) => item.slug === slug)
  if (!project) return {}

  const title = project.title
  const socialTitle = `${project.title} | ${COMPANY_NAME}`
  const description = pickMetaDescription([project.excerpt, project.description]) ?? project.description
  const canonical = `/projets/${project.slug}/`

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: socialTitle,
      description,
      type: 'article',
      url: `${BASE_URL}${canonical}`,
      images: [
        {
          url: project.imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [project.imageUrl],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = PROJECTS_DATA.find((item) => item.slug === slug)
  if (!project) notFound()

  const relatedServices = SERVICES_DATA.filter((service) => project.services.includes(service.slug))
  const similarProjects = getSimilarProjects(project)
  const galleryItems = normalizeProjectGallery(project)
  const linkedCollections = getCollectionsForProject(project)
  const projectCategoryLabel = project.categoryShort ?? project.category
  const immersiveTourEmbedUrl = project.immersiveTourEmbedUrl?.trim() || null
  const gaussianSplatViewerUrl = project.gaussianSplatViewerUrl?.trim() || null
  const gaussianSplatViewerSrc = gaussianSplatViewerUrl ? withBasePath(gaussianSplatViewerUrl) : null
  const gaussianSplatViewerTitle = project.gaussianSplatViewerTitle?.trim() || `${project.title} - viewer Gaussian Splat`
  const gaussianSplatViewerDescription =
    project.gaussianSplatViewerDescription?.trim() ||
    'Chargez le viewer 3D interactif pour explorer la restitution photogrammetrique en Gaussian Splat.'
  const gaussianSplatDescriptionWithPrompt = splitInteractivePrompt(gaussianSplatViewerDescription)
  const showIndustryProcessSynoptique = project.slug === 'industrie'

  const projectSchema = generateProjectSchema(slug)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Projets', url: '/projets/' },
    { name: project.title, url: `/projets/${project.slug}/` },
  ])

  const storyBlocks = project.context
    ? [
        { label: 'Le besoin', value: project.context.need },
        { label: 'Notre reponse', value: project.context.response },
        { label: 'Le resultat', value: project.context.result },
      ]
    : []

  const keyFigures: ProjectKeyFigure[] = hasFilledArray(project.keyFigures) ? project.keyFigures : []
  const deliverables = hasFilledArray(project.deliverables) ? project.deliverables : []
  const constraints = hasFilledArray(project.constraints) ? project.constraints : []
  const outcomes = hasFilledArray(project.outcomes) ? project.outcomes : []

  const hasStorySection = storyBlocks.length > 0

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main>
        <section className="relative flex items-center justify-center bg-slate-800 py-28 text-white md:py-36">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="100vw"
            className="absolute inset-0 z-0 object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 container mx-auto px-6 text-center">
            <p className="text-lg font-semibold text-[#ee7527]">{projectCategoryLabel}</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight md:text-6xl">{project.title}</h1>
            {project.excerpt ? <p className="mx-auto mt-4 max-w-3xl text-base text-slate-200 md:text-lg">{project.excerpt}</p> : null}
          </div>
        </section>

        {hasStorySection ? (
          <section className="bg-slate-50 py-5 md:py-6">
            <div className="container mx-auto px-6">
              <div className="mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ee7527]">Histoire projet</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">Le projet en 20 secondes</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {storyBlocks.map((block, index) => {
                  const storyTileStyles = [
                    {
                      article: 'border-rose-200/80 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50',
                      label: 'text-rose-700',
                      accent: 'from-rose-500 via-orange-500 to-amber-400',
                    },
                    {
                      article: 'border-cyan-200/80 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50',
                      label: 'text-cyan-700',
                      accent: 'from-sky-500 via-cyan-500 to-teal-400',
                    },
                    {
                      article: 'border-emerald-200/90 bg-gradient-to-br from-emerald-50 via-lime-50 to-green-50',
                      label: 'text-emerald-700',
                      accent: 'from-emerald-500 via-lime-500 to-green-400',
                    },
                  ] as const

                  const style = storyTileStyles[index] ?? storyTileStyles[0]

                  return (
                    <article
                      key={block.label}
                      className={`relative overflow-hidden rounded-xl border p-3.5 shadow-sm md:p-4 ${style.article}`}
                    >
                      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.accent}`} />
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${style.label}`}>{block.label}</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">{block.value}</p>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-white pt-8 pb-12 md:pt-10 md:pb-14">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-8">
              <div className="space-y-8 xl:col-span-8">
                <div>
                  <h2 className="mb-4 text-3xl font-bold text-slate-800">A propos du projet</h2>
                  <div className="prose prose-lg max-w-none leading-relaxed text-slate-600">
                    <p>{project.description}</p>
                  </div>
                </div>

                {galleryItems.length > 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm md:p-6">
                    <div className="mb-6 text-center xl:text-left">
                      <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Galerie du projet</h2>
                      <p className="mx-auto mt-3 max-w-3xl text-slate-600 xl:mx-0">
                        Extraits visuels du process et des livrables
                      </p>
                      <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527] xl:mx-0" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {galleryItems.map((image, index) => (
                        <figure
                          key={`${image.src}-${index}`}
                          className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md ring-1 ring-slate-100"
                        >
                          <div className="aspect-[4/3] w-full bg-slate-100">
                            {image.kind === 'video' ? (
                              image.embedUrl ? (
                                <iframe
                                  src={image.embedUrl}
                                  title={image.alt}
                                  className="h-full w-full"
                                  loading="lazy"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allowFullScreen
                                />
                              ) : (
                                <video
                                  src={image.src}
                                  poster={image.poster}
                                  className="h-full w-full object-cover"
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                  controls
                                  preload="metadata"
                                />
                              )
                            ) : (
                              <Image
                                src={image.src}
                                alt={image.alt}
                                width={800}
                                height={600}
                                className={`h-full w-full ${image.fit === 'contain' ? 'object-contain p-2' : 'object-cover'}`}
                              />
                            )}
                          </div>
                          {image.caption ? (
                            <figcaption className="border-t border-slate-200 p-4">
                              <p className="text-sm leading-relaxed text-slate-700">{image.caption}</p>
                            </figcaption>
                          ) : null}
                        </figure>
                      ))}
                    </div>
                  </div>
                ) : null}

                {gaussianSplatViewerSrc ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
                    <div className="mb-5 text-center xl:text-left">
                      <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">Viewer 3D Gaussian Splat</h2>
                      <p className="mx-auto mt-3 max-w-3xl text-slate-600 xl:mx-0">
                        {gaussianSplatDescriptionWithPrompt ? (
                          <>
                            {gaussianSplatDescriptionWithPrompt.before ? gaussianSplatDescriptionWithPrompt.before : null}
                            <span className="mt-2 block">
                              <span className="inline-flex items-center rounded-full border border-[#ee7527]/30 bg-[#ee7527]/12 px-3 py-1 text-sm font-semibold text-[#c85c1c] shadow-sm">
                                {gaussianSplatDescriptionWithPrompt.emphasis}
                              </span>
                            </span>
                            {gaussianSplatDescriptionWithPrompt.after ? (
                              <span className="mt-2 block">{gaussianSplatDescriptionWithPrompt.after}</span>
                            ) : null}
                          </>
                        ) : (
                          gaussianSplatViewerDescription
                        )}
                      </p>
                    </div>
                    <DeferredIframeEmbed
                      src={gaussianSplatViewerSrc}
                      title={gaussianSplatViewerTitle}
                      buttonLabel="Charger le viewer 3D"
                      helperText="Chargement a la demande pour ne pas ralentir l ouverture de la page. Le viewer demarre uniquement au clic."
                      paddingTop="62.5%"
                    />
                  </div>
                ) : null}

                {immersiveTourEmbedUrl ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
                    <div className="mb-5 text-center xl:text-left">
                      <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">Visite virtuelle immersive</h2>
                      <p className="mx-auto mt-3 max-w-3xl text-slate-600 xl:mx-0">
                        Explorez la visite interactive directement depuis cette page.
                      </p>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-md">
                      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          src={immersiveTourEmbedUrl}
                          title={`${project.title} - visite virtuelle Matterport`}
                          className="absolute inset-0 h-full w-full"
                          allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <aside className="space-y-5 xl:col-span-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-md">
                  <h3 className="mb-4 text-xl font-bold text-slate-800">Details rapides</h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    {project.client ? (
                      <li className="flex items-start gap-3">
                        <strong className="w-20 flex-shrink-0 text-slate-900">Client</strong>
                        <span>{project.client}</span>
                      </li>
                    ) : null}
                    {project.date ? (
                      <li className="flex items-start gap-3">
                        <strong className="w-20 flex-shrink-0 text-slate-900">Date</strong>
                        <span>{project.date}</span>
                      </li>
                    ) : null}
                    <li className="flex items-start gap-3">
                      <strong className="w-20 flex-shrink-0 text-slate-900">Type</strong>
                      <span>{projectCategoryLabel}</span>
                    </li>
                  </ul>

                  {keyFigures.length > 0 ? (
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Details techniques</h4>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
                        {keyFigures.map((figure) => (
                          <div key={`${figure.label}-${figure.value}`} className="rounded-xl border border-slate-200 bg-white p-3">
                            <p className="text-base font-bold leading-tight text-slate-900">{figure.value}</p>
                            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">{figure.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {project.tags && project.tags.length > 0 ? (
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {linkedCollections.length > 0 ? (
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Thematiques</h4>
                      <div className="flex flex-wrap gap-2">
                        {linkedCollections.map((collection) => (
                          <Link
                            key={collection.slug}
                            href={`/projets/collections/${collection.slug}`}
                            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-[#ee7527] hover:text-[#d9661f]"
                          >
                            {collection.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {relatedServices.length > 0 ? (
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Services appliques</h4>
                      <div className="flex flex-wrap gap-2">
                        {relatedServices.map((service) => (
                          <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className="rounded-full bg-[#ee7527]/15 px-3 py-1 text-xs font-semibold text-[#c85c1c] transition-colors hover:bg-[#ee7527]/25"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {deliverables.length > 0 ? (
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Ce qu on a livre</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">Livrables de mission</h3>
                    <ul className="mt-4 grid grid-cols-1 gap-2.5">
                      {deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                          <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-[#ee7527]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ) : null}

                {constraints.length > 0 ? (
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Contraintes de mission</p>
                    <ul className="mt-4 space-y-3">
                      {constraints.map((constraint) => (
                        <li key={constraint} className="flex items-start gap-3 text-sm text-slate-700">
                          <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-slate-400" />
                          <span>{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ) : null}

                {outcomes.length > 0 ? (
                  <article className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Pourquoi c etait utile</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">Benefices pour notre client</h3>
                    <ul className="mt-4 space-y-3">
                      {outcomes.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                          <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ) : null}
              </aside>
            </div>

            {showIndustryProcessSynoptique ? (
              <div className="mt-8">
                <IndustryProcessSynoptique />
              </div>
            ) : null}
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
              {similarProjects.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900">Projets similaires</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Projets avec les mêmes tags techniques.
                  </p>
                  <div className="mt-5 space-y-4">
                    {similarProjects.map((candidate) => (
                      <Link
                        key={candidate.slug}
                        href={`/projets/${candidate.slug}`}
                        className="group grid grid-cols-[96px_1fr] gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-[#ee7527] hover:bg-white"
                      >
                        <div className="overflow-hidden rounded-lg">
                          <Image
                            src={candidate.imageUrl}
                            alt={candidate.title}
                            width={192}
                            height={128}
                            className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                            {candidate.categoryShort ?? candidate.category}
                          </p>
                          <h3 className="mt-1 text-sm font-bold text-slate-900">{candidate.title}</h3>
                          {candidate.tags && candidate.tags.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {candidate.tags.slice(0, 3).map((tag) => (
                                <span key={`${candidate.slug}-${tag}`} className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {relatedServices.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900">Services associes</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Briques de service mobilisees sur ce projet.
                  </p>
                  <div className="mt-5 grid grid-cols-1 gap-3">
                    {relatedServices.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#ee7527] hover:bg-white"
                      >
                        <p className="text-sm font-bold text-slate-900">{service.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{service.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-8 rounded-2xl border border-[#ee7527]/20 bg-white p-6 shadow-sm md:p-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ee7527]">Projet similaire ?</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                    Vous avez un batiment ou un amenagement comparable ?
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                    Dites-nous simplement la surface, la ville et l objectif du projet. Nous revenons vers vous avec une premiere orientation
                    de mission et les services adaptes.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-[#ee7527] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d9661f]"
                >
                  Contacter ACBIM
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
