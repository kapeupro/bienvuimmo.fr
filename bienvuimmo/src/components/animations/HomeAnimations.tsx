'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Building2, Users, BarChart3, FileText, Zap, Shield, ArrowRight, CheckCircle2, MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import Link from 'next/link';

// Enregistrer le plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeAnimations() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const propertiesRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation du Hero
      const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      heroTimeline
        .from('.hero-badge', {
          opacity: 0,
          y: 30,
          duration: 0.8,
        })
        .from('.hero-title', {
          opacity: 0,
          y: 50,
          duration: 1,
        }, '-=0.4')
        .from('.hero-subtitle', {
          opacity: 0,
          y: 30,
          duration: 0.8,
        }, '-=0.5')
        .from('.hero-buttons', {
          opacity: 0,
          y: 30,
          duration: 0.8,
        }, '-=0.4')
        .from('.hero-features', {
          opacity: 0,
          y: 20,
          duration: 0.6,
        }, '-=0.3');

      // Animation des Stats au scroll
      gsap.from('.stat-card', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
      });

      // Animation des compteurs de stats
      const statValues = document.querySelectorAll('.stat-value');
      statValues.forEach((stat) => {
        const finalValue = stat.textContent || '';
        const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(numericValue)) {
          gsap.from(stat, {
            scrollTrigger: {
              trigger: stat,
              start: 'top 85%',
            },
            textContent: 0,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
              const current = parseFloat(stat.textContent || '0');
              if (finalValue.includes('K')) {
                stat.textContent = Math.round(current) + 'K+';
              } else if (finalValue.includes('%')) {
                stat.textContent = Math.round(current) + '%';
              } else if (finalValue.includes('/')) {
                stat.textContent = current.toFixed(1) + '/5';
              } else if (finalValue.includes('+')) {
                stat.textContent = Math.round(current) + '+';
              }
            }
          });
        }
      });

      // Animation des partenaires - animation directe sans ScrollTrigger pour visibilité immédiate
      const partnersTimeline = gsap.timeline({ delay: 1 });
      partnersTimeline
        .from('.partners-title', {
          opacity: 0,
          y: 30,
          duration: 0.8,
        })
        .from('.partner-logo', {
          opacity: 0,
          y: 40,
          scale: 0.8,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.5)',
        }, '-=0.4');

      // Animation des Features au scroll
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.7,
        stagger: {
          amount: 0.6,
          grid: [2, 3],
          from: 'start',
        },
      });

      // Animation du titre des features
      gsap.from('.features-title', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
      });

      // Animation des Property cards
      gsap.from('.property-card', {
        scrollTrigger: {
          trigger: propertiesRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.15,
      });

      // Animation du titre properties
      gsap.from('.properties-title', {
        scrollTrigger: {
          trigger: propertiesRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
      });

      // Animation des Pricing cards
      gsap.from('.pricing-card', {
        scrollTrigger: {
          trigger: pricingRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 80,
        rotateX: 15,
        duration: 0.9,
        stagger: 0.2,
        transformOrigin: 'center top',
      });

      // Animation du titre pricing
      gsap.from('.pricing-title', {
        scrollTrigger: {
          trigger: pricingRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
      });

      // Animation du CTA final
      gsap.from('.cta-section', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'back.out(1.5)',
      });

      // Animation hover pour les feature cards
      const featureCards = document.querySelectorAll('.feature-card');
      featureCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            duration: 0.3,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            duration: 0.3,
          });
        });
      });

      // Parallax effect sur le hero
      gsap.to('.hero-bg', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 100,
        opacity: 0.5,
      });

    });

    return () => ctx.revert();
  }, []);

  const features = [
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
  ];

  const stats = [
    { label: 'Agences actives', value: '500+' },
    { label: 'Biens gérés', value: '15K+' },
    { label: 'Temps gagné', value: '70%' },
    { label: 'Satisfaction', value: '4.9/5' },
  ];

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      description: 'Pour tester',
      features: ['5 biens max', '1 utilisateur', 'CRM basique', 'Support email'],
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
  ];

  // Annonces à afficher sur la page d'accueil
  const featuredProperties = [
    {
      id: 1,
      reference: 'BV001',
      title: 'Appartement T3 lumineux avec balcon',
      type: 'Appartement',
      transactionType: 'Vente',
      city: 'Paris',
      postalCode: '75001',
      price: 450000,
      surface: 75,
      bedrooms: 2,
      bathrooms: 1,
      energyClass: 'C',
    },
    {
      id: 2,
      reference: 'BV002',
      title: 'Maison familiale avec jardin',
      type: 'Maison',
      transactionType: 'Vente',
      city: 'Lyon',
      postalCode: '69002',
      price: 620000,
      surface: 145,
      bedrooms: 4,
      bathrooms: 2,
      energyClass: 'B',
    },
    {
      id: 4,
      reference: 'BV004',
      title: 'Villa contemporaine avec piscine',
      type: 'Maison',
      transactionType: 'Vente',
      city: 'Nice',
      postalCode: '06000',
      price: 1250000,
      surface: 220,
      bedrooms: 5,
      bathrooms: 3,
      energyClass: 'A',
    },
    {
      id: 6,
      reference: 'BV006',
      title: 'Loft industriel - Quartier des Chartrons',
      type: 'Appartement',
      transactionType: 'Vente',
      city: 'Bordeaux',
      postalCode: '33000',
      price: 385000,
      surface: 95,
      bedrooms: 2,
      bathrooms: 1,
      energyClass: 'D',
    },
  ];

  const getEnergyClassColor = (energyClass: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-green-500',
      'B': 'bg-lime-500',
      'C': 'bg-yellow-500',
      'D': 'bg-orange-500',
      'E': 'bg-red-400',
      'F': 'bg-red-500',
      'G': 'bg-red-600',
    };
    return colors[energyClass] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">bienvuimmo</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/annonces" className="text-gray-600 hover:text-blue-600 transition">
              Annonces
            </Link>
            <Link href="/fonctionnalites" className="text-gray-600 hover:text-blue-600 transition">
              Fonctionnalités
            </Link>
            <Link href="/tarifs" className="text-gray-600 hover:text-blue-600 transition">
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

      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 py-20 text-center relative">
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50 -z-10 rounded-3xl" />
        <div className="max-w-4xl mx-auto">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Le SaaS immobilier nouvelle génération
          </div>
          
          <h1 className="hero-title text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gérez votre agence immobilière en{' '}
            <span className="text-blue-600 relative">
              toute simplicité
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 100 2 150 2C200 2 250 4 298 10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          
          <p className="hero-subtitle text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            CRM, gestion de biens, multidiffusion, signatures électroniques... 
            Tout ce dont vous avez besoin dans une seule plateforme moderne.
          </p>
          
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg text-lg font-medium flex items-center justify-center gap-2 hover:scale-105 hover:shadow-xl">
              Démarrer gratuitement
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition border-2 border-gray-200 text-lg font-medium hover:border-blue-300">
              Voir la démo
            </button>
          </div>

          <div className="hero-features mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
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
      <section ref={statsRef} className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card bg-white rounded-xl p-6 shadow-sm border text-center hover:shadow-md transition-shadow">
              <div className="stat-value text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section ref={partnersRef} className="container mx-auto px-4 py-16 bg-white">
        <div className="partners-title text-center mb-12">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Nos partenaires de diffusion
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Diffusez vos annonces sur les meilleurs portails
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 max-w-5xl mx-auto">
          {/* SeLoger */}
          <div className="partner-logo flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
            <div className="w-40 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <span className="text-white font-bold text-xl">SeLoger</span>
            </div>
            <span className="text-sm text-gray-500">N°1 de l'immobilier</span>
          </div>
          {/* LeBonCoin */}
          <div className="partner-logo flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
            <div className="w-40 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <span className="text-white font-bold text-xl">leboncoin</span>
            </div>
            <span className="text-sm text-gray-500">1ère audience France</span>
          </div>
          {/* Bien'ici */}
          <div className="partner-logo flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
            <div className="w-40 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <span className="text-white font-bold text-xl">Bien'ici</span>
            </div>
            <span className="text-sm text-gray-500">Portail nouvelle génération</span>
          </div>
          {/* PAP */}
          <div className="partner-logo flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
            <div className="w-40 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <span className="text-white font-bold text-xl">PAP</span>
            </div>
            <span className="text-sm text-gray-500">De particulier à particulier</span>
          </div>
          {/* Logic-Immo */}
          <div className="partner-logo flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
            <div className="w-40 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <span className="text-white font-bold text-xl">Logic-Immo</span>
            </div>
            <span className="text-sm text-gray-500">Expert immobilier</span>
          </div>
          {/* Figaro Immo */}
          <div className="partner-logo flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gray-50 transition cursor-pointer group">
            <div className="w-40 h-16 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <span className="text-white font-bold text-lg">Figaro Immo</span>
            </div>
            <span className="text-sm text-gray-500">Média de référence</span>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-10">
          Et bien d'autres... <span className="font-semibold text-blue-600">+20 portails partenaires</span>
        </p>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="container mx-auto px-4 py-20">
        <div className="features-title text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une suite complète d'outils pour gérer votre activité immobilière de A à Z
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card bg-white rounded-xl p-6 shadow-sm border cursor-pointer"
            >
              <div className={`inline-flex p-3 rounded-lg bg-${feature.color}-100 mb-4 transition-transform`}>
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

      {/* Featured Properties Section */}
      <section ref={propertiesRef} id="properties" className="container mx-auto px-4 py-20 bg-white">
        <div className="properties-title text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nos dernières annonces
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez une sélection de biens disponibles sur notre plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {featuredProperties.map((property) => (
            <Link 
              href={`/annonces/${property.id}`}
              key={property.id}
              className="property-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image placeholder */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Building2 className="h-12 w-12" />
                </div>
                
                {/* Transaction type badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.transactionType === 'Vente' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-purple-600 text-white'
                  }`}>
                    {property.transactionType}
                  </span>
                </div>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>

                {/* Energy class */}
                <div className="absolute bottom-3 left-3 flex gap-1">
                  <span className={`px-2 py-1 text-xs font-bold text-white rounded ${getEnergyClassColor(property.energyClass)}`}>
                    DPE {property.energyClass}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 mb-2">
                  {property.title}
                </h3>

                <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{property.city} ({property.postalCode})</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    <span>{property.surface} m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{property.bedrooms} ch.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR',
                      maximumFractionDigits: 0 
                    }).format(property.price)}
                    {property.transactionType === 'Location' && (
                      <span className="text-sm font-normal text-gray-500">/mois</span>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/annonces"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg text-lg font-medium hover:scale-105"
          >
            Voir toutes les annonces
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="container mx-auto px-4 py-20 bg-gray-50">
        <div className="pricing-title text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-xl text-gray-600">
            Choisissez la formule adaptée à votre agence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card rounded-xl p-8 ${
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
                className={`w-full py-3 rounded-lg font-medium transition hover:scale-105 ${
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
      <section ref={ctaRef} className="container mx-auto px-4 py-20">
        <div className="cta-section bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à moderniser votre agence ?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Rejoignez des centaines d'agences qui ont déjà fait le choix de bienvuimmo
          </p>
          <button className="group px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-lg text-lg font-medium inline-flex items-center gap-2 hover:scale-105">
            Démarrer gratuitement
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
                <li><Link href="/annonces" className="hover:text-white transition">Annonces</Link></li>
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
