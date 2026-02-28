'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    
    // Détecter si on est sur la page d'accueil
    const isHomePage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/services', label: 'Services' },
        { href: '/projets', label: 'Réalisations' },
        { href: '/a-propos', label: 'À Propos' },
        { href: '/contact', label: 'Contact' },
    ];
    
    // Logique de style selon la page
    const shouldUseDarkStyle = isHomePage ? (scrolled || isOpen) : true;
    
    const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseDarkStyle ? 'bg-white shadow-md' : 'bg-transparent'
    }`;
    
    const linkColor = shouldUseDarkStyle ? 'text-slate-800' : 'text-white';
    
    return (
        <header className={headerClasses}>
            <div className="container mx-auto px-6 flex justify-between items-center h-20">
                <Link href="/">
                    <Logo scrolled={shouldUseDarkStyle} />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <Link 
                            key={link.href} 
                            href={link.href} 
                            className={`font-medium ${pathname === link.href ? 'text-[#ee7527]' : linkColor} hover:text-[#ee7527] transition-colors`}
                        >
                            {link.label}
                        </Link>
                    ))}
                     <a 
                        href="https://acbimcloud.fr/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#ee7527] hover:bg-[#d9661f] text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300"
                    >
                        Acbimcloud
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`focus:outline-none ${linkColor}`}
                        aria-label="Ouvrir le menu"
                        aria-expanded={isOpen}
                        aria-controls="mobile-nav"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <nav id="mobile-nav" className="md:hidden bg-white shadow-lg">
                    <div className="px-6 py-4 flex flex-col space-y-4">
                        {navLinks.map(link => (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                onClick={() => setIsOpen(false)}
                                className={`${pathname === link.href ? 'text-[#ee7527]' : 'text-slate-800'} hover:text-[#ee7527] font-medium`}
                            >
                                {link.label}
                            </Link>
                        ))}
                         <a 
                            href="https://acbimcloud.fr/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#ee7527] hover:bg-[#d9661f] text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300 text-center"
                        >
                            Acbimcloud
                        </a>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;
