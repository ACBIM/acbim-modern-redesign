#!/usr/bin/env node
import { setTimeout as delay } from 'node:timers/promises'

const DEFAULT_URL = 'https://www.aura-bim.fr/'
const DEFAULT_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-5X4N22V2B0'

function parseArgs(argv) {
  const options = {
    url: DEFAULT_URL,
    id: DEFAULT_MEASUREMENT_ID,
    repeat: 1,
    interval: 30,
  }

  for (const arg of argv) {
    const [key, ...parts] = arg.split('=')
    const value = parts.join('=')

    if (key === '--url' && value) options.url = value
    if (key === '--id' && value) options.id = value
    if (key === '--repeat' && value) options.repeat = Math.max(1, Number(value) || 1)
    if (key === '--interval' && value) options.interval = Math.max(1, Number(value) || 30)
  }

  return options
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'acbim-ga-diagnostic/1.0',
    },
  })

  const text = await response.text()
  return {
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get('content-type') || '',
    text,
  }
}

function extractScriptUrls(html, baseUrl) {
  return [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((match) => new URL(match[1], baseUrl).href)
}

function findHits(text, measurementId) {
  return {
    measurementId: text.includes(measurementId),
    googleTagManager: text.includes('googletagmanager.com/gtag/js'),
    analyticsConsent: text.includes('acbim_analytics_consent'),
    consentBanner: text.includes('Cookies de mesure') || text.includes("mesure d'audience"),
  }
}

async function checkOnce(options, passIndex) {
  const page = await fetchText(options.url)
  const scriptUrls = extractScriptUrls(page.text, options.url)
  const scriptResults = await Promise.all(
    scriptUrls.map(async (url) => {
      try {
        const result = await fetchText(url)
        return {
          url,
          status: result.status,
          hits: findHits(result.text, options.id),
        }
      } catch (error) {
        return {
          url,
          status: 'ERR',
          error: error.message,
          hits: findHits('', options.id),
        }
      }
    }),
  )

  const gtagUrl = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(options.id)}`
  const gtag = await fetchText(gtagUrl)
  const htmlHits = findHits(page.text, options.id)

  const scriptsWithMeasurementId = scriptResults.filter((script) => script.hits.measurementId)
  const scriptsWithLoader = scriptResults.filter((script) => script.hits.googleTagManager)
  const scriptsWithConsent = scriptResults.filter((script) => script.hits.analyticsConsent || script.hits.consentBanner)
  const directTagInHtml = htmlHits.measurementId && htmlHits.googleTagManager
  const bundledTagCode = scriptsWithMeasurementId.length > 0 && scriptsWithLoader.length > 0

  const ok =
    page.ok &&
    gtag.ok &&
    (directTagInHtml || bundledTagCode)

  return {
    passIndex,
    ok,
    page,
    htmlHits,
    scriptCount: scriptResults.length,
    directTagInHtml,
    scriptsWithMeasurementId,
    scriptsWithLoader,
    scriptsWithConsent,
    gtag,
    gtagUrl,
  }
}

function printScriptList(label, scripts) {
  console.log(`${label}: ${scripts.length}`)
  for (const script of scripts) {
    console.log(`- ${script.status} ${script.url}`)
  }
}

function printResult(result, options) {
  console.log(`\n[${result.passIndex}] ${new Date().toISOString()}`)
  console.log(`URL: ${options.url}`)
  console.log(`Measurement ID: ${options.id}`)
  console.log(`Homepage: HTTP ${result.page.status} ${result.page.contentType}`)
  console.log(`Scripts found: ${result.scriptCount}`)
  console.log(`Measurement ID directly in HTML: ${result.htmlHits.measurementId ? 'YES' : 'NO'}`)
  console.log(`Google tag script directly in HTML: ${result.htmlHits.googleTagManager ? 'YES' : 'NO'}`)
  console.log(`Direct Google tag in HTML: ${result.directTagInHtml ? 'YES' : 'NO'}`)
  console.log(`Google gtag.js reachable: HTTP ${result.gtag.status} ${result.gtag.contentType}`)
  printScriptList('Scripts containing measurement ID', result.scriptsWithMeasurementId)
  printScriptList('Scripts containing gtag loader code', result.scriptsWithLoader)
  printScriptList('Scripts containing consent code/banner', result.scriptsWithConsent)
  console.log(`Result: ${result.ok ? 'OK' : 'KO'}`)

  if (result.ok) {
    console.log('Interpretation: the live page contains a GA4 tag and the Google tag endpoint is reachable.')
    console.log('Runtime confirmation is a browser Network check for a collect request with HTTP 204.')
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  let failures = 0

  console.log('GA deployment check')
  console.log('This verifies the published HTML/JS bundle and the Google tag endpoint.')
  console.log('It does not read your private GA dashboard.')

  for (let index = 1; index <= options.repeat; index += 1) {
    const result = await checkOnce(options, index)
    printResult(result, options)
    if (!result.ok) failures += 1
    if (index < options.repeat) await delay(options.interval * 1000)
  }

  process.exitCode = failures ? 1 : 0
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
