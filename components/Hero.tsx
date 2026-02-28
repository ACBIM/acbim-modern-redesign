'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import heroManifest from '@/public/images/optimized/hero/manifest.json'

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@acbimmopus631'
const HERO_YOUTUBE_VIDEO_IDS = ['u_nTOaORcag', 'tUWTFwEXYs8', 'TJfeWFBb0is']

type HeroSlide =
  | { id: string; type: 'image'; src: string; alt: string }
  | { id: string; type: 'youtube'; videoId: string }

interface HeroManifestItem {
  source: string
  fallback: string | null
  variants: Array<{ width: number; src: string }>
}

function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&enablejsapi=1`
}

function interleaveSlides(imageSlides: HeroSlide[], videoSlides: HeroSlide[]) {
  if (videoSlides.length === 0) return imageSlides
  if (imageSlides.length === 0) return videoSlides

  const result: HeroSlide[] = []
  const bucketCount = videoSlides.length + 1
  const baseBucketSize = Math.floor(imageSlides.length / bucketCount)
  const extraItems = imageSlides.length % bucketCount

  let imageIndex = 0
  for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
    const currentBucketSize = baseBucketSize + (bucketIndex < extraItems ? 1 : 0)

    for (let count = 0; count < currentBucketSize; count += 1) {
      result.push(imageSlides[imageIndex])
      imageIndex += 1
    }

    if (bucketIndex < videoSlides.length) {
      result.push(videoSlides[bucketIndex])
    }
  }

  return result
}

function sourceNameToAlt(sourceName: string) {
  return sourceName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim()
}

const heroManifestData = heroManifest as Record<string, HeroManifestItem>
const generatedImageSlides: HeroSlide[] = Object.values(heroManifestData)
  .filter((entry) => typeof entry.fallback === 'string' && entry.fallback.length > 0)
  .sort((left, right) => left.source.localeCompare(right.source, 'fr'))
  .map((entry) => ({
    id: `img-${entry.source}`,
    type: 'image',
    src: entry.fallback as string,
    alt: sourceNameToAlt(entry.source),
  }))

const fallbackImageSlides: HeroSlide[] = [
  {
    id: 'img-fallback-default',
    type: 'image',
    src: '/images/services/scan-3d.webp',
    alt: 'Projet ACBIM',
  },
]

const youtubeSlides: HeroSlide[] = HERO_YOUTUBE_VIDEO_IDS.map((videoId) => ({
  id: `video-youtube-${videoId}`,
  type: 'youtube' as const,
  videoId,
}))

const heroSlides: HeroSlide[] = interleaveSlides(
  generatedImageSlides.length > 0 ? generatedImageSlides : fallbackImageSlides,
  youtubeSlides,
)

const AUTOPLAY_INTERVAL_MS = 7000

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const youtubeIframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({})

  const currentSlide = heroSlides[currentIndex]
  const isYouTubeSlide = currentSlide.type === 'youtube'

  const postPlayerCommand = useCallback((slideId: string, command: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute') => {
    const frame = youtubeIframeRefs.current[slideId]
    if (!frame?.contentWindow) return

    frame.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: command,
        args: [],
      }),
      '*',
    )
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % heroSlides.length)
    }, AUTOPLAY_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [isYouTubeSlide])

  useEffect(() => {
    for (const slide of heroSlides) {
      if (slide.type !== 'youtube') continue

      const isActiveYouTubeSlide = isYouTubeSlide && slide.id === currentSlide.id
      if (isActiveYouTubeSlide) {
        postPlayerCommand(slide.id, isVideoPlaying ? 'playVideo' : 'pauseVideo')
        postPlayerCommand(slide.id, isMuted ? 'mute' : 'unMute')
      } else {
        postPlayerCommand(slide.id, 'pauseVideo')
        postPlayerCommand(slide.id, 'mute')
      }
    }
  }, [currentSlide.id, isYouTubeSlide, isVideoPlaying, isMuted, postPlayerCommand])

  const handleTogglePlayback = () => {
    setIsVideoPlaying((value) => !value)
  }

  const handleToggleMute = () => {
    setIsMuted((value) => !value)
  }

  return (
    <section id="home" className="relative flex h-screen items-center justify-center overflow-hidden text-white">
      <div className="absolute inset-0 overflow-hidden">
        {heroSlides.map((slide, index) => {
          const isActive = index === currentIndex

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              aria-hidden={!isActive}
            >
              {slide.type === 'image' ? (
                <Image src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="100vw" className="object-cover" />
              ) : isActive ? (
                <iframe
                  ref={(node) => {
                    youtubeIframeRefs.current[slide.id] = node
                  }}
                  title="Video ACBIM en arriere-plan"
                  src={getYouTubeEmbedUrl(slide.videoId)}
                  className="h-full w-full scale-[1.22] object-cover"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="h-full w-full bg-black" />
              )}
            </div>
          )
        })}
      </div>

      <div className="absolute inset-0 bg-[#1d1d1b]/80" />

      <div className="relative z-10 px-6 text-center">
        <h1 className="mb-8 text-6xl font-bold leading-tight md:text-8xl">
          BET <span className="text-[#ee7527]">ACBIM</span>
        </h1>
        <h2 className="mb-4 text-4xl font-bold leading-tight md:text-6xl">
          Votre patrimoine <span className="text-[#ee7527]">numerique</span>
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-lg text-slate-200 md:text-xl">
          Du releve sur site au livrable: ACBIM propose des solutions de releves 3D, maquette numerique 3D, orthophotos, imagerie 3D, plans 2D et plans topographiques au service de vos projets de renovation et de gestion de patrimoine.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-[#ee7527] px-8 py-3 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-[#d9661f]"
          >
            Discutons de votre projet
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {heroSlides.map((slide, index) => {
            const isActive = index === currentIndex
            const baseLabel = slide.type === 'youtube' ? `Afficher la video ${index + 1}` : `Afficher le visuel ${index + 1}`

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${isActive ? 'bg-[#ee7527]' : 'bg-white/60 hover:bg-white'}`}
                aria-label={baseLabel}
              />
            )
          })}
        </div>

        {isYouTubeSlide && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/35 bg-black/20 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:border-[#ee7527] hover:text-[#ee7527]"
            >
              Voir toutes nos videos
            </a>
            <button
              type="button"
              onClick={handleTogglePlayback}
              className="rounded-full border border-white/30 bg-black/20 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:border-[#ee7527] hover:text-[#ee7527]"
            >
              {isVideoPlaying ? 'Pause video' : 'Lecture video'}
            </button>
            <button
              type="button"
              onClick={handleToggleMute}
              className="rounded-full border border-white/30 bg-black/20 px-4 py-1.5 text-xs font-medium text-slate-200 transition hover:border-[#ee7527] hover:text-[#ee7527]"
            >
              {isMuted ? 'Activer son' : 'Couper son'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
