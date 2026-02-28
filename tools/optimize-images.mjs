import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const PROJECT_ROOT = process.cwd()
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public')

const DEFAULTS = {
  source: 'RESSOURCES/images',
  target: 'public/images/optimized',
  widths: [768, 1280, 1600],
  quality: 78,
  clean: false,
}

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.jfif', '.png', '.webp', '.svg', '.avif', '.tif', '.tiff'])

function parseArgs(argv) {
  const options = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue

    const rawToken = token.slice(2)
    const equalsIndex = rawToken.indexOf('=')

    if (equalsIndex >= 0) {
      const key = rawToken.slice(0, equalsIndex)
      const value = rawToken.slice(equalsIndex + 1)
      options[key] = value
      continue
    }

    const next = argv[index + 1]
    if (!next || next.startsWith('--')) {
      options[rawToken] = true
      continue
    }

    options[rawToken] = next
    index += 1
  }

  return options
}

function parseWidths(rawWidths) {
  if (!rawWidths) return DEFAULTS.widths

  const parsed = rawWidths
    .split(',')
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((value) => Number.isInteger(value) && value > 0)

  if (parsed.length === 0) return DEFAULTS.widths
  return Array.from(new Set(parsed)).sort((left, right) => left - right)
}

function normalizeSegment(value) {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return normalized || 'image'
}

function toPosixPath(value) {
  return value.split(path.sep).join('/')
}

function toPublicUrl(absolutePath) {
  if (absolutePath.startsWith(PUBLIC_DIR)) {
    return `/${toPosixPath(path.relative(PUBLIC_DIR, absolutePath))}`
  }

  return toPosixPath(path.relative(PROJECT_ROOT, absolutePath))
}

async function statSafe(filePath) {
  try {
    return await fs.stat(filePath)
  } catch {
    return null
  }
}

async function shouldGenerate(sourceFile, outputFile) {
  const [sourceStat, outputStat] = await Promise.all([statSafe(sourceFile), statSafe(outputFile)])
  if (!sourceStat) return false
  if (!outputStat) return true
  return sourceStat.mtimeMs > outputStat.mtimeMs
}

async function readFilesRecursively(directoryPath) {
  const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true })
  const files = []

  for (const entry of directoryEntries) {
    const absolutePath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      const nestedFiles = await readFilesRecursively(absolutePath)
      files.push(...nestedFiles)
      continue
    }

    if (!entry.isFile()) continue
    const extension = path.extname(entry.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(extension)) continue
    files.push(absolutePath)
  }

  return files
}

function resolveUniqueBaseName(baseName, outputDirectory, sourceRelativePath, map) {
  let candidate = baseName
  let suffix = 2

  while (true) {
    const key = `${outputDirectory}::${candidate}`
    const existingSource = map.get(key)

    if (!existingSource || existingSource === sourceRelativePath) {
      map.set(key, sourceRelativePath)
      return candidate
    }

    candidate = `${baseName}-${suffix}`
    suffix += 1
  }
}

async function run() {
  const cliOptions = parseArgs(process.argv.slice(2))

  const sourcePath = path.resolve(PROJECT_ROOT, String(cliOptions.source ?? DEFAULTS.source))
  const targetPath = path.resolve(PROJECT_ROOT, String(cliOptions.target ?? DEFAULTS.target))
  const widths = parseWidths(String(cliOptions.widths ?? DEFAULTS.widths.join(',')))

  const qualityValue = Number.parseInt(String(cliOptions.quality ?? DEFAULTS.quality), 10)
  const quality = Number.isInteger(qualityValue) && qualityValue > 0 && qualityValue <= 100 ? qualityValue : DEFAULTS.quality

  const clean = cliOptions.clean === true || cliOptions.clean === 'true'

  const sourceStat = await statSafe(sourcePath)
  if (!sourceStat || !sourceStat.isDirectory()) {
    console.error(`[images:build] Source folder not found: ${sourcePath}`)
    process.exitCode = 1
    return
  }

  if (clean) {
    await fs.rm(targetPath, { recursive: true, force: true })
  }

  await fs.mkdir(targetPath, { recursive: true })

  const sourceFiles = await readFilesRecursively(sourcePath)
  if (sourceFiles.length === 0) {
    console.log(`[images:build] No input images found in ${sourcePath}`)
    return
  }

  const manifest = {}
  const usedBaseNames = new Map()

  let generatedCount = 0
  let reusedCount = 0
  let skippedCount = 0

  for (const sourceFile of sourceFiles) {
    const sourceRelativePath = path.relative(sourcePath, sourceFile)
    const sourceRelativePosix = toPosixPath(sourceRelativePath)

    let metadata
    try {
      metadata = await sharp(sourceFile).metadata()
    } catch (error) {
      skippedCount += 1
      console.warn(`[images:build] Skip (invalid image): ${sourceRelativePosix}`)
      continue
    }

    if (!metadata.width || metadata.width <= 0) {
      skippedCount += 1
      console.warn(`[images:build] Skip (unknown width): ${sourceRelativePosix}`)
      continue
    }

    const relativeDirectory = path.dirname(sourceRelativePath)
    const directorySegments = relativeDirectory === '.' ? [] : relativeDirectory.split(path.sep).map(normalizeSegment)
    const outputDirectory = path.join(targetPath, ...directorySegments)
    await fs.mkdir(outputDirectory, { recursive: true })

    const rawBaseName = normalizeSegment(path.parse(sourceFile).name)
    const uniqueBaseName = resolveUniqueBaseName(rawBaseName, outputDirectory, sourceRelativePosix, usedBaseNames)

    const effectiveWidths = Array.from(new Set(widths.map((width) => Math.min(width, metadata.width)))).sort((left, right) => left - right)
    const variants = []

    for (const width of effectiveWidths) {
      const outputFile = path.join(outputDirectory, `${uniqueBaseName}-w${width}.webp`)
      const generateFile = await shouldGenerate(sourceFile, outputFile)

      if (generateFile) {
        await sharp(sourceFile)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality, effort: 4 })
          .toFile(outputFile)
        generatedCount += 1
      } else {
        reusedCount += 1
      }

      variants.push({
        width,
        src: toPublicUrl(outputFile),
      })
    }

    const fallbackVariant = variants[variants.length - 1]
    const fallbackFile = path.join(outputDirectory, `${uniqueBaseName}.webp`)
    const fallbackNeedsUpdate = fallbackVariant ? await shouldGenerate(sourceFile, fallbackFile) : false

    if (fallbackVariant && fallbackNeedsUpdate) {
      await fs.copyFile(path.join(PUBLIC_DIR, fallbackVariant.src.replace(/^\//, '').replace(/\//g, path.sep)), fallbackFile)
      generatedCount += 1
    } else if (fallbackVariant) {
      reusedCount += 1
    }

    manifest[sourceRelativePosix] = {
      source: sourceRelativePosix,
      fallback: fallbackVariant ? toPublicUrl(fallbackFile) : null,
      variants,
    }
  }

  const manifestPath = path.join(targetPath, 'manifest.json')
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')

  console.log(`[images:build] Source: ${sourcePath}`)
  console.log(`[images:build] Target: ${targetPath}`)
  console.log(`[images:build] Input files: ${sourceFiles.length}`)
  console.log(`[images:build] Generated files: ${generatedCount}`)
  console.log(`[images:build] Reused files: ${reusedCount}`)
  console.log(`[images:build] Skipped files: ${skippedCount}`)
  console.log(`[images:build] Manifest: ${manifestPath}`)
}

run().catch((error) => {
  console.error('[images:build] Failed:', error)
  process.exitCode = 1
})
