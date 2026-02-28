'use client'

import React from 'react';
import Link from 'next/link';
import { SERVICES_DATA } from '@/constants';
import type { Service } from '@/types';
import AppIcon from './AppIcon';
import ServiceCardRotatingImage from './ServiceCardRotatingImage';

const ServiceCard: React.FC<{ service: Service; className?: string }> = ({ service, className }) => {
    const linkClassName = className
        ? `block h-full transform hover:-translate-y-2 transition-transform duration-300 ${className}`
        : 'block h-full transform hover:-translate-y-2 transition-transform duration-300';

    return (
        <Link href={`/services/${service.slug}`} className={linkClassName}>
            <div className="bg-white h-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
                <div className="relative h-48 w-full">
                    <ServiceCardRotatingImage
                        primarySrc={service.cardImageUrl ?? service.imageUrl}
                        alternateSrcs={service.cardImageRotationUrls}
                        alt={service.title}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>
                <div className="p-8 flex flex-col items-center text-center flex-grow">
                    <div className="mb-4 text-[#ee7527] bg-[#ee7527]/10 p-3 rounded-full">
                        <AppIcon name={service.iconKey} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                </div>
            </div>
        </Link>
    );
};

const Services: React.FC = () => {
    const shouldCenterLastServiceOnDesktop = SERVICES_DATA.length % 3 === 1;

    return (
        <section id="services" className="py-20 bg-slate-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Nos Pôles d'Expertise</h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                        Nous proposons une gamme complète de prestations techniques pour documenter, modéliser, visualiser et valoriser le bâti et les territoires.
                    </p>
                    <div className="mt-4 w-24 h-1 bg-[#ee7527] mx-auto rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SERVICES_DATA.map((service, index) => {
                        const isLastService = index === SERVICES_DATA.length - 1;
                        const cardClassName =
                            shouldCenterLastServiceOnDesktop && isLastService ? 'lg:col-start-2' : undefined;

                        return <ServiceCard key={service.slug} service={service} className={cardClassName} />;
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
