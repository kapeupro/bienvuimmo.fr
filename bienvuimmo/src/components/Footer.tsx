'use client';

import Link from 'next/link';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-stone-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                BienVu<span className="text-amber-400">Immo</span>
              </span>
            </Link>
            <p className="text-stone-400 leading-relaxed mb-6">
              Le logiciel tout-en-un pour les agences immobilières indépendantes.
            </p>
            <div className="flex gap-3">
              {['twitter', 'linkedin', 'facebook'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-stone-500 rounded" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-6">Produit</h4>
            <ul className="space-y-4 text-stone-400">
              <li><Link href="/fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
              <li><Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link href="/annonces" className="hover:text-white transition-colors">Annonces</Link></li>
              <li><Link href="/inscription" className="hover:text-white transition-colors">Essai gratuit</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Compte</h4>
            <ul className="space-y-4 text-stone-400">
              <li><Link href="/connexion" className="hover:text-white transition-colors">Connexion</Link></li>
              <li><Link href="/inscription" className="hover:text-white transition-colors">Inscription</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Tableau de bord</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-stone-400">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500" />
                <a href="mailto:contact@bienvuimmo.fr" className="hover:text-white transition-colors">
                  contact@bienvuimmo.fr
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">
                  01 23 45 67 89
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-stone-500 text-sm">
              © 2025 BienVuImmo. Tous droits réservés.
            </p>
            <p className="text-stone-600 text-xs mt-1">
              Créé avec <span className="text-red-500">❤</span> par <span className="text-amber-400 font-medium">Dimitri Sarrazin</span>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-stone-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
