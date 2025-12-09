import { Building2, Users, BarChart3, FileText, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">bienvuimmo</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition">
              Tarifs
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition">
              Contact
            </Link>
            <button className="px-4 py-2 text-blue-600 hover:text-blue-700 transition">
              Connexion
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
              Essai gratuit
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Le SaaS immobilier nouvelle génération
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gérez votre agence immobilière en{' '}
            <span className="text-blue-600">toute simplicité</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            CRM, gestion de biens, multidiffusion, signatures électroniques... 
            Tout ce dont vous avez besoin dans une seule plateforme moderne.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg text-lg font-medium flex items-center justify-center gap-2">
              Démarrer gratuitement
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition border-2 border-gray-200 text-lg font-medium">
              Voir la démo
            </button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>14 jours d'essai</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Support français</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { label: 'Agences actives', value: '500+' },
            { label: 'Biens gérés', value: '15K+' },
            { label: 'Temps gagné', value: '70%' },
            { label: 'Satisfaction', value: '4.9/5' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une suite complète d'outils pour gérer votre activité immobilière de A à Z
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Building2,
              title: 'Gestion de biens',
              description: 'Fiches complètes, photos HD, DPE, historique des prix et visites',
              color: 'blue',
            },
            {
              icon: Users,
              title: 'CRM intelligent',
              description: 'Contacts, matching automatique, suivi des relances et alertes',
              color: 'purple',
            },
            {
              icon: Zap,
              title: 'Multidiffusion',
              description: 'Publication auto sur SeLoger, LeBonCoin, Bien\'ici, PAP...',
              color: 'yellow',
            },
            {
              icon: FileText,
              title: 'Documents & mandats',
              description: 'Génération automatique, signature électronique intégrée',
              color: 'green',
            },
            {
              icon: BarChart3,
              title: 'Analytics & rapports',
              description: 'Tableaux de bord, stats de performance, prévisions',
              color: 'red',
            },
            {
              icon: Shield,
              title: 'Sécurisé & conforme',
              description: 'RGPD, hébergement France, sauvegarde automatique',
              color: 'indigo',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition group cursor-pointer"
            >
              <div className={`inline-flex p-3 rounded-lg bg-${feature.color}-100 mb-4 group-hover:scale-110 transition`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-xl text-gray-600">
            Choisissez la formule adaptée à votre agence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: 'Starter',
              price: '15€',
              description: 'Pour démarrer',
              features: ['10 biens max', '1 utilisateur', 'CRM basique', 'Support email'],
              cta: 'Commencer',
              highlight: false,
            },
            {
              name: 'Pro',
              price: '79€',
              description: 'Pour petites agences',
              features: ['50 biens', '3 utilisateurs', 'Multidiffusion', 'Signature électronique', 'Support prioritaire'],
              cta: 'Essai 14 jours',
              highlight: true,
            },
            {
              name: 'Business',
              price: '199€',
              description: 'Pour réseaux',
              features: ['Biens illimités', 'Utilisateurs illimités', 'API complète', 'Multi-agences', 'Account manager dédié'],
              cta: 'Contactez-nous',
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-8 ${
                plan.highlight
                  ? 'bg-blue-600 text-white shadow-2xl scale-105'
                  : 'bg-white text-gray-900 shadow-sm border'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={plan.highlight ? 'text-blue-100' : 'text-gray-600'}>
                {plan.description}
              </p>
              <div className="my-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={plan.highlight ? 'text-blue-100' : 'text-gray-600'}>
                  /mois
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className={`h-5 w-5 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-medium transition ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à moderniser votre agence ?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Rejoignez des centaines d'agences qui ont déjà fait le choix de bienvuimmo
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-lg text-lg font-medium inline-flex items-center gap-2">
            Démarrer gratuitement
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">bienvuimmo</span>
              </div>
              <p className="text-sm">
                Le SaaS immobilier qui simplifie votre quotidien.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Fonctionnalités</Link></li>
                <li><Link href="#" className="hover:text-white transition">Tarifs</Link></li>
                <li><Link href="#" className="hover:text-white transition">Démo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">À propos</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Carrières</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition">CGV</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 bienvuimmo. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}