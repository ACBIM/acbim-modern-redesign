'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type ServiceCardRotatingImageProps = {
  primarySrc: string
  alternateSrcs?: string[]
  alt: string
  sizes: string
  className?: string
  intervalMs?: number
}

export default function ServiceCardRotatingImage({
  primarySrc,
  alternateSrcs,
  alt,
  sizes,
  className = 'object-cover',
  intervalMs = 2000,
}: ServiceCardRotatingImageProps) {
  const imageSources = Array.from(new Set([primarySrc, ...(alternateSrcs ?? [])].filter(Boolean)))
  const [activeIndex, setActiveIndex] = useState(0)
  const rotationKey = imageSources.join('|')

  useEffect(() => {
    setActiveIndex(0)

    if (imageSources.length < 2) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % imageSources.length)
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [intervalMs, imageSources.length, rotationKey])

  const activeSrc = imageSources[activeIndex] ?? primarySrc

  return (
    <Image
      key={activeSrc}
      src={activeSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
    />
  )
}
