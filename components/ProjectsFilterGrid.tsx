'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

interface ProjectsFilterGridProps {
  projects: Project[]
}

const PRIMARY_FILTERS = [
  'Patrimoine',
  'Scan 3D',
  'Drone',
  'Plans 2D',
  'BIM',
  'Visite virtuelle',
  'Rendu 3D',
  'Espace public',
  'Audit energetique',
  "Plan d'interieur",
  'Numerisation',
  'Geometre',
  'Topographie',
  'Maquette 3D',
  'Modelisation',
] as const

const FILTER_ALIASES: Record<string, string[]> = {
  'scan 3d': ['scan 3d', 'scan 3d couleur', 'nuage de points'],
  drone: ['drone', 'photogrammetrie', 'vues aeriennes'],
  'plans 2d': ['plans 2d', 'plan', 'coupes', 'elevations', 'dwg', 'pdf'],
  bim: ['bim', 'maquette bim', 'maquette numerique 3d', 'revit', 'ifc'],
  'visite virtuelle': ['visite virtuelle', 'matterport', '360', 'google street view'],
  'rendu 3d': ['rendu 3d', 'video 3d', 'twinmotion', 'rendu images'],
  'espace public': ['espace public', 'espaces publics', 'centre-bourg', 'vrd'],
  'audit energetique': ['audit energetique', 'actee'],
  "plan d'interieur": ['plans 2d', 'plan', 'coupes', 'elevations', 'interieur', 'piece'],
  numerisation: ['numerisation', 'scan 3d', 'nuage de points', 'photogrammetrie', 'orthophoto', 'georeferencement'],
  geometre: ['topographie', 'georeferencement', 'plans 2d', 'releve'],
  topographie: ['topographie', 'georeferencement'],
  'maquette 3d': ['maquette 3d', 'maquette bim', 'maquette numerique 3d', 'revit', 'ifc'],
  modelisation: ['modelisation', 'maquette', 'revit', 'bim'],
}

function normalizeFilterValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function dedupeByNormalized(values: string[]) {
  const seen = new Set<string>()
  const result: string[] = []

  values.forEach((value) => {
    const key = normalizeFilterValue(value)
    if (seen.has(key)) return
    seen.add(key)
    result.push(value)
  })

  return result
}

function projectMatchesFilter(project: Project, filterValue: string) {
  if (filterValue === 'Tous') return true

  const normalizedFilter = normalizeFilterValue(filterValue)
  const aliasTerms = FILTER_ALIASES[normalizedFilter]

  const valuesToCheck = [
    project.title,
    project.category,
    project.categoryShort ?? '',
    project.excerpt ?? '',
    project.description,
    ...(project.tags ?? []),
    ...project.services,
  ]
    .map(normalizeFilterValue)
    .filter(Boolean)

  if (aliasTerms && aliasTerms.length > 0) {
    return aliasTerms.some((term) => {
      const normalizedTerm = normalizeFilterValue(term)
      return valuesToCheck.some((candidate) => candidate.includes(normalizedTerm))
    })
  }

  return valuesToCheck.some((candidate) => candidate === normalizedFilter)
}

export default function ProjectsFilterGrid({ projects }: ProjectsFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState('Tous')
  const [showAllFilters, setShowAllFilters] = useState(false)

  const filters = useMemo(() => {
    const values = new Map<string, number>()

    projects.forEach((project) => {
      const displayCategory = project.categoryShort ?? project.category
      values.set(displayCategory, (values.get(displayCategory) ?? 0) + 1)
      project.tags?.forEach((tag) => values.set(tag, (values.get(tag) ?? 0) + 1))
    })

    const dynamicFilters = Array.from(values.entries())
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1]
        return a[0].localeCompare(b[0], 'fr')
      })
      .map(([label]) => label)

    const ordered = dedupeByNormalized(['Tous', ...PRIMARY_FILTERS, ...dynamicFilters])

    return ordered
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => projectMatchesFilter(project, activeFilter))
  }, [activeFilter, projects])

  const primaryVisibleFilters = useMemo(() => {
    const base = dedupeByNormalized(['Tous', ...PRIMARY_FILTERS])

    if (activeFilter !== 'Tous' && !base.some((value) => normalizeFilterValue(value) === normalizeFilterValue(activeFilter))) {
      base.push(activeFilter)
    }

    return base.filter((value) => filters.some((candidate) => normalizeFilterValue(candidate) === normalizeFilterValue(value)))
  }, [activeFilter, filters])

  const secondaryFilters = useMemo(() => {
    const primarySet = new Set(primaryVisibleFilters.map(normalizeFilterValue))
    return filters.filter((value) => !primarySet.has(normalizeFilterValue(value)))
  }, [filters, primaryVisibleFilters])

  return (
    <div>
      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {primaryVisibleFilters.map((filterValue) => (
            <button
              key={filterValue}
              type="button"
              onClick={() => setActiveFilter(filterValue)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                normalizeFilterValue(activeFilter) === normalizeFilterValue(filterValue)
                  ? 'border-[#ee7527] bg-[#ee7527] text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-[#ee7527] hover:text-[#ee7527]'
              }`}
            >
              {filterValue}
            </button>
          ))}
        </div>

        {secondaryFilters.length > 0 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowAllFilters((value) => !value)}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#ee7527] hover:text-[#ee7527]"
            >
              {showAllFilters ? 'Voir moins de filtres' : `Voir plus de filtres (${secondaryFilters.length})`}
            </button>
          </div>
        )}

        {showAllFilters && secondaryFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {secondaryFilters.map((filterValue) => (
              <button
                key={filterValue}
                type="button"
                onClick={() => setActiveFilter(filterValue)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  normalizeFilterValue(activeFilter) === normalizeFilterValue(filterValue)
                    ? 'border-[#ee7527] bg-[#ee7527] text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-[#ee7527] hover:text-[#ee7527]'
                }`}
              >
                {filterValue}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Link key={project.slug} href={`/projets/${project.slug}`} className="block group relative overflow-hidden rounded-lg shadow-lg">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={400}
              height={300}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110 md:h-72"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <span className="rounded-md bg-[#ee7527] px-2 py-1 text-sm font-semibold">{project.categoryShort ?? project.category}</span>
              <h3 className="mt-2 text-2xl font-bold">{project.title}</h3>
              <div className="mt-2 max-h-0 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                <p className="text-sm text-slate-200">{project.excerpt ?? project.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p className="mt-8 text-center text-slate-500">Aucun projet ne correspond à ce filtre.</p>
      )}
    </div>
  )
}
