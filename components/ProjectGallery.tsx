'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ProjectGalleryProps {
  project: {
    title: string
    gallery: string[]
  }
}

export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="lg:order-2 mb-12 lg:mb-0">
      <div className="aspect-video w-full rounded-lg shadow-xl overflow-hidden mb-4 bg-slate-200">
        <Image 
          src={project.gallery[activeIndex]} 
          alt={`${project.title} - image ${activeIndex + 1}`} 
          width={800}
          height={450}
          className="w-full h-full object-cover transition-opacity duration-300" 
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {project.gallery.map((img: string, index: number) => (
          <button 
            key={index} 
            onClick={() => setActiveIndex(index)}
            className={`aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ee7527] transition-all duration-200 ${activeIndex === index ? 'ring-2 ring-[#ee7527] ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
            aria-label={`Voir l'image ${index + 1}`}
          >
            <Image 
              src={img} 
              alt={`Miniature ${index + 1}`} 
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
