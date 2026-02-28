import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const portValue = Number.parseInt(process.env.PORT || '8080', 10)
const initialPort = Number.isInteger(portValue) && portValue > 0 ? portValue : 8080
const maxPortAttempts = 10
const publicDir = path.join(__dirname, 'out')

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
}

function getMimeType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
}

function toSafeRelativePath(rawPathname) {
  const decodedPath = decodeURIComponent(rawPathname || '/')
  const normalized = path.posix.normalize(decodedPath)
  const withoutLeadingSlash = normalized.replace(/^\/+/, '')

  if (withoutLeadingSlash.startsWith('..')) {
    return null
  }

  return withoutLeadingSlash
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  } catch {
    return false
  }
}

async function resolveRequestFile(pathname) {
  const safeRelativePath = toSafeRelativePath(pathname)
  if (safeRelativePath === null) return null

  const candidates = []

  if (!safeRelativePath) {
    candidates.push(path.join(publicDir, 'index.html'))
  } else {
    candidates.push(path.join(publicDir, safeRelativePath))

    const looksLikeFile = path.posix.extname(safeRelativePath) !== ''
    if (!looksLikeFile) {
      candidates.push(path.join(publicDir, safeRelativePath, 'index.html'))
      candidates.push(path.join(publicDir, `${safeRelativePath}.html`))
    }
  }

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return { filePath: candidate, statusCode: 200 }
    }
  }

  const next404 = path.join(publicDir, '404.html')
  if (await fileExists(next404)) {
    return { filePath: next404, statusCode: 404 }
  }

  return null
}

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    const resolved = await resolveRequestFile(requestUrl.pathname)

    if (!resolved) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('404 - File Not Found')
      return
    }

    const body = await fs.readFile(resolved.filePath)
    res.writeHead(resolved.statusCode, { 'Content-Type': getMimeType(resolved.filePath) })
    res.end(body)
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('500 - Internal Server Error')
    console.error('[preview] Failed to serve request:', error)
  }
})

let currentPort = initialPort
let remainingPortRetries = maxPortAttempts - 1

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE' && remainingPortRetries > 0) {
    remainingPortRetries -= 1
    currentPort += 1
    console.warn(`[preview] Port in use, retrying on ${currentPort}...`)
    server.listen(currentPort)
    return
  }

  console.error('[preview] Server failed to start:', error)
  process.exitCode = 1
})

server.on('listening', () => {
  console.log(`[preview] Static server started on http://localhost:${currentPort}`)
  console.log(`[preview] Serving files from: ${publicDir}`)
})

server.listen(currentPort)
