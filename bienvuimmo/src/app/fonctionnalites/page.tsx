'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Building2, Users, BarChart3, FileText, Zap, Shield, 
  ArrowRight, CheckCircle2, Smartphone, Globe, Bell, 
  Calendar, Camera, Key, MessageSquare, PieChart,
  RefreshCw, Search, Upload, Lock
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FonctionnalitesPage() {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.features-hero', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.feature-section', {
        scrollTrigger: {
          trigger: '.feature-section',
          start: 'top 80%',
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.feature-grid-item', {
        scrollTrigger: {
          trigger: '.feature-grid',
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const mainFeatures = [
    {
      icon: Building2,
      title: 'Gestion de biens',
      description: 'Gérez tous vos biens immobiliers depuis une interface unique et intuitive.',
      color: 'blue',
      details: [
        'Fiches détaillées avec photos HD',
        'Diagnostic de performance énergétique (DPE)',
        'Historique complet des prix',
        'Géolocalisation précise',
        'Gestion des mandats',
        'Suivi des visites',
      ],
    },
    {
      icon: Users,
      title: 'CRM intelligent',
      description: 'Un CRM puissant pour gérer vos contacts et automatiser vos relances.',
      color: 'purple',
      details: [
        'Base de contacts unifiée',
        'Matching automatique biens/acheteurs',
        'Alertes et rappels personnalisés',
        'Historique des interactions',
        'Segmentation avancée',
        'Pipelines de vente',
      ],
    },
    {
      icon: Zap,
      title: 'Multidiffusion',
      description: 'Publiez vos annonces sur tous les portails en un clic.',
      color: 'yellow',
      details: [
        'SeLoger, LeBonCoin, Bien\'ici',
        'PAP, Logic-Immo, Figaro Immo',
        'Publication automatique',
        'Synchronisation en temps réel',
        'Statistiques par portail',
        'Optimisation des annonces',
      ],
    },
    {
      icon: FileText,
      title: 'Documents & mandats',
      description: 'Générez et signez vos documents en quelques secondes.',
      color: 'green',
      details: [
        'Génération automatique de mandats',
        'Signature électronique légale',
        'Modèles personnalisables',
        'Stockage sécurisé',
        'Historique des versions',
        'Conformité juridique',
      ],
    },
    {
      icon: BarChart3,
      title: 'Analytics & rapports',
      description: 'Prenez les bonnes décisions grâce à des données précises.',
      color: 'red',
      details: [
        'Tableaux de bord en temps réel',
        'Statistiques de performance',
        'Rapports personnalisables',
        'Prévisions de ventes',
        'Analyse de la concurrence',
        'Export PDF/Excel',
      ],
    },
    {
      icon: Shield,
      title: 'Sécurité & conformité',
      description: 'Vos données sont protégées selon les standards les plus élevés.',
      color: 'indigo',
      details: [
        'Conforme RGPD',
        'Hébergement en France',
        'Chiffrement SSL/TLS',
        'Sauvegarde automatique',
        'Authentification 2FA',
        'Audit de sécurité régulier',
      ],
    },
  ];

  const additionalFeatures = [
    { icon: Smartphone, title: 'Application mobile', description: 'Accédez à vos données où que vous soyez' },
    { icon: Globe, title: 'Multi-langues', description: 'Interface disponible en français et anglais' },
    { icon: Bell, title: 'Notifications', description: 'Alertes en temps réel par email et push' },
    { icon: Calendar, title: 'Agenda intégré', description: 'Planifiez vos visites et rendez-vous' },
    { icon: Camera, title: 'Galerie photos', description: 'Upload illimité de photos HD' },
    { icon: Key, title: 'Gestion des clés', description: 'Suivi des clés et accès aux biens' },
    { icon: MessageSquare, title: 'Messagerie', description: 'Communiquez avec vos clients' },
    { icon: PieChart, title: 'Rapports visuels', description: 'Graphiques et statistiques clairs' },
    { icon: RefreshCw, title: 'Synchronisation', description: 'Données synchronisées en temps réel' },
    { icon: Search, title: 'Recherche avancée', description: 'Trouvez rapidement ce que vous cherchez' },
    { icon: Upload, title: 'Import/Export', description: 'Importez vos données existantes' },
    { icon: Lock, title: 'Rôles & permissions', description: 'Contrôlez les accès de votre équipe' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 pt-36 text-center">
        <div className="features-hero max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            Plus de 50 fonctionnalités intégrées
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Tout ce dont votre agence a besoin,{' '}
            <span className="text-amber-600">en une seule plateforme</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            De la gestion de biens à la signature électronique, découvrez les outils qui vont 
            révolutionner votre façon de travailler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-lg text-lg font-medium flex items-center justify-center gap-2">
              Démarrer l'essai gratuit
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/contact" className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition border-2 border-gray-200 text-lg font-medium">
              Demander une démo
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section ref={featuresRef} className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-24">
          {mainFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className={`feature-section grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-100 mb-6`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-50 rounded-2xl p-8 h-80 flex items-center justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <feature.icon className={`h-32 w-32 text-${feature.color}-300`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Et bien plus encore...
            </h2>
            <p className="text-xl text-gray-600">
              Des dizaines de fonctionnalités pour simplifier votre quotidien
            </p>
          </div>
          <div className="feature-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {additionalFeatures.map((feature) => (
              <div 
                key={feature.title}
                className="feature-grid-item bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition text-center"
              >
                <div className="inline-flex p-3 rounded-lg bg-amber-50 mb-4">
                  <feature.icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-12 text-center text-white shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à découvrir toutes nos fonctionnalités ?
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Testez bienvuimmo gratuitement pendant 14 jours, sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition shadow-lg text-lg font-medium inline-flex items-center justify-center gap-2">
              Essai gratuit
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/tarifs" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition text-lg font-medium">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
