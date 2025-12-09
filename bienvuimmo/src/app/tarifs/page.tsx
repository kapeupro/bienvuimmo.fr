'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Building2, CheckCircle2, ArrowRight, Zap, Users, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function TarifsPage() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-title', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.pricing-card', {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.faq-item', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: '/mois',
      description: 'Idéal pour découvrir la plateforme',
      features: [
        '5 biens maximum',
        '1 utilisateur',
        'CRM basique',
        'Support email',
        'Accès mobile',
      ],
      notIncluded: [
        'Multidiffusion',
        'Signature électronique',
        'API',
      ],
      cta: 'Commencer gratuitement',
      highlight: false,
      icon: Zap,
    },
    {
      name: 'Pro',
      price: '79€',
      period: '/mois',
      description: 'Pour les agences en croissance',
      features: [
        '50 biens',
        '3 utilisateurs',
        'CRM complet',
        'Multidiffusion (5 portails)',
        'Signature électronique',
        'Support prioritaire',
        'Statistiques avancées',
        'Import/Export données',
      ],
      notIncluded: [
        'API complète',
        'Multi-agences',
      ],
      cta: 'Essai gratuit 14 jours',
      highlight: true,
      popular: true,
      icon: Building2,
    },
    {
      name: 'Business',
      price: '199€',
      period: '/mois',
      description: 'Pour les réseaux d\'agences',
      features: [
        'Biens illimités',
        'Utilisateurs illimités',
        'Toutes les fonctionnalités Pro',
        'Multi-agences',
        'API complète',
        'Marque blanche',
        'Account manager dédié',
        'Formation personnalisée',
        'SLA garanti 99.9%',
      ],
      notIncluded: [],
      cta: 'Contactez-nous',
      highlight: false,
      icon: Users,
    },
  ];

  const faqs = [
    {
      question: 'Puis-je changer de formule à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre formule à tout moment. Le changement prend effet immédiatement et le prorata est calculé automatiquement.',
    },
    {
      question: 'Y a-t-il un engagement minimum ?',
      answer: 'Non, toutes nos formules sont sans engagement. Vous pouvez résilier à tout moment depuis votre espace client.',
    },
    {
      question: 'Comment fonctionne l\'essai gratuit ?',
      answer: 'L\'essai gratuit de 14 jours vous donne accès à toutes les fonctionnalités de la formule Pro. Aucune carte bancaire n\'est requise.',
    },
    {
      question: 'Les mises à jour sont-elles incluses ?',
      answer: 'Oui, toutes les mises à jour et nouvelles fonctionnalités sont incluses dans votre abonnement, sans surcoût.',
    },
    {
      question: 'Proposez-vous des réductions pour un paiement annuel ?',
      answer: 'Oui, vous bénéficiez de 2 mois offerts en optant pour le paiement annuel, soit une réduction de 17%.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">bienvuimmo</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/fonctionnalites" className="text-gray-600 hover:text-blue-600 transition">
              Fonctionnalités
            </Link>
            <Link href="/tarifs" className="text-blue-600 font-medium">
              Tarifs
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition">
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

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="pricing-title max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choisissez la formule adaptée à votre agence. Sans engagement, sans surprise.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            2 mois offerts avec le paiement annuel
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section ref={pricingRef} className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card relative rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-blue-600 text-white shadow-2xl scale-105 z-10'
                  : 'bg-white text-gray-900 shadow-lg border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-medium rounded-full shadow-lg">
                  Le plus populaire
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${plan.highlight ? 'bg-blue-500' : 'bg-blue-100'}`}>
                  <plan.icon className={`h-6 w-6 ${plan.highlight ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </div>
              
              <p className={plan.highlight ? 'text-blue-100' : 'text-gray-600'}>
                {plan.description}
              </p>
              
              <div className="my-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className={plan.highlight ? 'text-blue-100' : 'text-gray-600'}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className={`flex items-center gap-2 ${plan.highlight ? 'text-blue-300' : 'text-gray-400'}`}>
                    <span className="h-5 w-5 flex items-center justify-center flex-shrink-0">✕</span>
                    <span className="text-sm line-through">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-xl font-medium transition flex items-center justify-center gap-2 hover:scale-[1.02] ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparatif */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Toutes les formules incluent
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {[
              'Hébergement sécurisé',
              'Mises à jour gratuites',
              'Support français',
              'Sauvegarde quotidienne',
              'Application mobile',
              'Import de données',
              'RGPD conforme',
              'SSL inclus',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre agence ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Démarrez votre essai gratuit de 14 jours, sans carte bancaire requise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-lg text-lg font-medium inline-flex items-center justify-center gap-2">
              Démarrer l'essai gratuit
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition text-lg font-medium">
              Parler à un expert
            </Link>
          </div>
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
                <li><Link href="/fonctionnalites" className="hover:text-white transition">Fonctionnalités</Link></li>
                <li><Link href="/tarifs" className="hover:text-white transition">Tarifs</Link></li>
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
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
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
