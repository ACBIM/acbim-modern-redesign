import optimizedManifest from '@/public/images/optimized/manifest.json'

type ManifestVariant = {
  width?: number
  height?: number
  src?: string
}

type ManifestEntry = {
  width?: number
  height?: number
  fallback?: string | null
  avifFallback?: string | null
  variants?: ManifestVariant[]
  avifVariants?: ManifestVariant[]
  formats?: Record<string, { fallback?: string | null; variants?: ManifestVariant[] }>
}

type ImageDimensions = {
  width: number
  height: number
}

const DEFAULT_DIMENSIONS: ImageDimensions = {
  width: 800,
  height: 600,
}

const dimensionsBySrc = new Map<string, ImageDimensions>()
const avifSrcSetBySrc = new Map<string, string>()

for (const entry of Object.values(optimizedManifest as Record<string, ManifestEntry>)) {
  const entryDimensions = entry.width && entry.height ? { width: entry.width, height: entry.height } : null
  const webpSources = new Set<string>()
  const avifVariants = entry.formats?.avif?.variants ?? entry.avifVariants ?? []
  const avifSrcSet = avifVariants
    .filter((variant) => variant.src && variant.width)
    .map((variant) => `${variant.src} ${variant.width}w`)
    .join(', ')

  const registerVariant = (variant: ManifestVariant | null | undefined) => {
    if (!variant?.src) return
    const variantDimensions =
      variant.width && variant.height ? { width: variant.width, height: variant.height } : entryDimensions
    if (variantDimensions) dimensionsBySrc.set(variant.src, variantDimensions)
  }

  if (entry.fallback) {
    webpSources.add(entry.fallback)
    if (entryDimensions) dimensionsBySrc.set(entry.fallback, entryDimensions)
  }
  if (entry.avifFallback && entryDimensions) dimensionsBySrc.set(entry.avifFallback, entryDimensions)
  entry.variants?.forEach((variant) => {
    if (variant.src) webpSources.add(variant.src)
    registerVariant(variant)
  })
  entry.avifVariants?.forEach(registerVariant)

  for (const formatEntry of Object.values(entry.formats ?? {})) {
    if (formatEntry.fallback) {
      if (formatEntry === entry.formats?.webp) webpSources.add(formatEntry.fallback)
      if (entryDimensions) dimensionsBySrc.set(formatEntry.fallback, entryDimensions)
    }
    formatEntry.variants?.forEach((variant) => {
      if (formatEntry === entry.formats?.webp && variant.src) webpSources.add(variant.src)
      registerVariant(variant)
    })
  }

  if (avifSrcSet) {
    for (const src of webpSources) {
      avifSrcSetBySrc.set(src, avifSrcSet)
    }
  }
}

export function getImageDimensions(src: string, fallback: ImageDimensions = DEFAULT_DIMENSIONS): ImageDimensions {
  return dimensionsBySrc.get(src) ?? fallback
}

export function getAvifSrcSet(src: string): string | undefined {
  return avifSrcSetBySrc.get(src)
}
