'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = transparent
    ? scrolled
      ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-stone-900/5 py-3'
      : 'bg-transparent py-5'
    : 'bg-white/90 backdrop-blur-xl shadow-lg shadow-stone-900/5 py-3';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-none">
                BienVu<span className="text-amber-600">Immo</span>
              </span>
              <span className="text-[10px] text-stone-400 font-medium tracking-wider uppercase">Logiciel immobilier</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/fonctionnalites" className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium rounded-full hover:bg-stone-100">
              Fonctionnalités
            </Link>
            <Link href="/tarifs" className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium rounded-full hover:bg-stone-100">
              Tarifs
            </Link>
            <Link href="/annonces" className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium rounded-full hover:bg-stone-100">
              Annonces
            </Link>
            <Link href="/contact" className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium rounded-full hover:bg-stone-100">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/connexion" className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100">
              Connexion
            </Link>
            <Link href="/inscription" className="group relative bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold overflow-hidden transition-all hover:shadow-xl hover:shadow-stone-900/20">
              <span className="relative z-10 flex items-center gap-2">
                Essai gratuit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2.5 rounded-xl hover:bg-stone-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-100 shadow-xl">
          <div className="px-6 py-6 space-y-2">
            <Link href="/fonctionnalites" className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
              Fonctionnalités
            </Link>
            <Link href="/tarifs" className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
              Tarifs
            </Link>
            <Link href="/annonces" className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
              Annonces
            </Link>
            <Link href="/contact" className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="pt-4 mt-4 border-t border-stone-100 space-y-3">
              <Link href="/connexion" className="block w-full px-4 py-3 text-left text-stone-600 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Connexion
              </Link>
              <Link href="/inscription" className="block w-full bg-stone-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold text-center" onClick={() => setIsMenuOpen(false)}>
                Essai gratuit — 14 jours
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
