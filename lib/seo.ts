const DEFAULT_META_DESCRIPTION_MAX_LENGTH = 160

function normalizeSeoText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function truncateMetaDescription(value: string, maxLength = DEFAULT_META_DESCRIPTION_MAX_LENGTH): string {
  const normalized = normalizeSeoText(value)
  if (normalized.length <= maxLength) return normalized

  const softLimit = Math.max(40, maxLength - 3)
  const slice = normalized.slice(0, softLimit + 1)
  const lastSpaceIndex = slice.lastIndexOf(' ')
  const cutIndex = lastSpaceIndex >= Math.floor(softLimit * 0.6) ? lastSpaceIndex : softLimit
  const trimmed = slice.slice(0, cutIndex).replace(/[,:;.\- ]+$/, '')

  return `${trimmed}...`
}

export function pickMetaDescription(
  candidates: Array<string | null | undefined>,
  maxLength = DEFAULT_META_DESCRIPTION_MAX_LENGTH,
): string | undefined {
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue
    const normalized = normalizeSeoText(candidate)
    if (!normalized) continue
    return truncateMetaDescription(normalized, maxLength)
  }

  return undefined
}

