'use client'

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/services', label: 'Services' },
        { href: '/projets', label: 'Réalisations' },
        { href: '/a-propos', label: 'À Propos' },
        { href: '/contact', label: 'Contact' },
        { href: 'https://acbimcloud.fr/', label: 'Acbimcloud', external: true },
    ];

    return (
        <footer className="bg-[#1d1d1b] text-slate-300">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">AC<span className="text-[#ee7527]">BIM</span></h3>
                        <p className="text-sm text-slate-400">
                            Bureau d&apos;etudes Releve 3D - Plans - BIM - Topographie - Drone
                            <br />
                            Nous realisons vos livrables conformes et exploitables pour vous fournir une base fiable, afin de renover, vous projeter, diagnostiquer et gerer votre patrimoine.
                            <br />
                            Concretisez vos projets avec rigueur et reactivite.
                        </p>
                        <address className="text-sm text-slate-400 mt-4 not-italic">
                            52 Av Jean Baptiste Veyre,<br/>15000 Aurillac
                        </address>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    {link.external ? (
                                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">{link.label}</a>
                                    ) : (
                                        <Link href={link.href} className="text-slate-400 hover:text-white transition-colors">{link.label}</Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Suivez-nous</h4>
                         <div className="flex justify-center md:justify-start space-x-4">
                            <a href="https://www.linkedin.com/company/acbim-mopus/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/acbimmopus3d" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                   <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.142v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/>
                                </svg>
                            </a>
                             <a href="https://www.youtube.com/@acbimmopus631" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                   <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-700/50 pt-8 text-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} ACBIM. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
