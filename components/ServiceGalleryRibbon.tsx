'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { ServiceGalleryItem } from '@/types'

interface ServiceGalleryRibbonProps {
  items: ServiceGalleryItem[]
}

export default function ServiceGalleryRibbon({ items }: ServiceGalleryRibbonProps) {
  const ribbonRef = useRef<HTMLDivElement>(null)
  const loopItems = useMemo(() => (items.length > 1 ? [...items, ...items] : items), [items])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const ribbon = ribbonRef.current
    if (!ribbon) return

    // Preserve page vertical scrolling when the pointer is over the ribbon.
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      window.scrollBy({ top: event.deltaY, behavior: 'auto' })
    }

    ribbon.addEventListener('wheel', handleWheel, { passive: false })

    if (items.length <= 1) {
      return () => {
        ribbon.removeEventListener('wheel', handleWheel)
      }
    }

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches) {
      return () => {
        ribbon.removeEventListener('wheel', handleWheel)
      }
    }

    const firstCard = ribbon.querySelector<HTMLElement>('[data-gallery-card]')
    if (!firstCard) {
      return () => {
        ribbon.removeEventListener('wheel', handleWheel)
      }
    }

    const ribbonStyles = window.getComputedStyle(ribbon)
    const gap = Number.parseFloat(ribbonStyles.columnGap || ribbonStyles.gap || '0')
    const stepSize = firstCard.offsetWidth + gap
    let virtualIndex = 0
    let intervalId: number | null = null
    let resetId: number | null = null

    const clearTimers = () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
        intervalId = null
      }
      if (resetId !== null) {
        window.clearTimeout(resetId)
        resetId = null
      }
    }

    const tick = () => {
      virtualIndex += 1
      const target = virtualIndex * stepSize
      ribbon.scrollTo({ left: target, behavior: 'smooth' })
      setActiveIndex(virtualIndex % items.length)

      // At the end of the duplicated sequence, jump back to start seamlessly.
      if (virtualIndex === items.length) {
        resetId = window.setTimeout(() => {
          ribbon.scrollLeft = 0
          virtualIndex = 0
        }, 700)
      }
    }

    const start = () => {
      clearTimers()
      intervalId = window.setInterval(tick, 2200)
    }

    const pause = () => clearTimers()
    const resume = () => start()

    ribbon.scrollLeft = 0
    start()
    ribbon.addEventListener('mouseenter', pause)
    ribbon.addEventListener('mouseleave', resume)

    return () => {
      clearTimers()
      ribbon.removeEventListener('mouseenter', pause)
      ribbon.removeEventListener('mouseleave', resume)
      ribbon.removeEventListener('wheel', handleWheel)
    }
  }, [items.length])

  return (
    <section className="bg-slate-100 py-10 md:py-12">
      <div className="container mx-auto px-6">
        <div className="mb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Galerie du service</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm md:p-5">
          <div
            ref={ribbonRef}
            data-ribbon
            className="flex justify-center gap-6 overflow-x-hidden px-2 py-1 [touch-action:pan-y_pinch-zoom]"
          >
            {loopItems.map((image, index) => (
              <figure
                key={`${image.src}-${index}`}
                data-gallery-card
                className={`w-36 flex-none transition-all duration-500 sm:w-44 md:w-48 ${
                  index % items.length === activeIndex ? 'scale-[1.06] opacity-100' : 'scale-100 opacity-90'
                }`}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 192px, (min-width: 768px) 176px, 144px"
                    className="object-contain p-1 transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <figcaption className="mt-2 text-center text-xs font-medium leading-snug text-slate-600">
                  {image.caption ?? image.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        [data-ribbon] {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        [data-ribbon]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
