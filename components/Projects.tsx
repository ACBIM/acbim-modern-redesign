'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS_DATA } from '@/constants';
import type { Project } from '@/types';

const HOME_PROJECTS_LIMIT = 6;

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    return (
        <Link href={`/projets/${project.slug}`} className="block group relative overflow-hidden rounded-lg shadow-lg">
            <Image 
                src={project.imageUrl} 
                alt={project.title} 
                width={400}
                height={300}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-64 md:h-72 object-cover transform group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                <span className="text-sm font-semibold bg-[#ee7527] px-2 py-1 rounded-md">{project.categoryShort ?? project.category}</span>
                <h3 className="text-2xl font-bold mt-2">{project.title}</h3>
                <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 mt-2">
                     <p className="text-slate-200 text-sm">{project.excerpt ?? project.description}</p>
                </div>
            </div>
        </Link>
    );
};

const Projects: React.FC = () => {
  const topProjects = PROJECTS_DATA.filter((project) => project.isTopProject);
  const projectsForHome = (topProjects.length > 0 ? topProjects : PROJECTS_DATA).slice(0, HOME_PROJECTS_LIMIT);

  return (
    <section id="projects" className="bg-white py-20">
        <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Nos realisations</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                    Decouvrez une selection de projets vitrines representatifs de notre savoir-faire.
                </p>
                <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#ee7527]"></div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projectsForHome.map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                ))}
            </div>
            <div className="mt-10 text-center">
                <Link
                    href="/projets"
                    className="inline-flex items-center rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#ee7527] hover:text-[#ee7527]"
                >
                    Voir toutes les realisations
                </Link>
            </div>
        </div>
    </section>
  );
};

export default Projects;
