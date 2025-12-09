"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  BarChart3, 
  Calendar, 
  FileText, 
  ChevronRight,
  Check,
  ArrowRight,
  Home,
  Key,
  TrendingUp,
  Shield,
  Zap,
  Menu,
  X,
  Star,
  Play,
  Sparkles,
  MousePointer2,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Quote
} from "lucide-react";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Building2,
      title: "Gestion des biens",
      description: "Centralisez tous vos mandats, photos HD, documents et historique en un seul endroit sécurisé.",
      color: "amber"
    },
    {
      icon: Users,
      title: "CRM intelligent",
      description: "Suivez chaque interaction avec vos acquéreurs et vendeurs. Relances automatiques incluses.",
      color: "blue"
    },
    {
      icon: Sparkles,
      title: "Matching IA",
      description: "Notre algorithme rapproche automatiquement vos biens avec les acquéreurs les plus pertinents.",
      color: "purple"
    },
    {
      icon: Calendar,
      title: "Planning & Visites",
      description: "Calendrier partagé, rappels SMS automatiques, bons de visite générés en 1 clic.",
      color: "green"
    },
    {
      icon: FileText,
      title: "Documents légaux",
      description: "Mandats, compromis, états des lieux conformes générés et signés électroniquement.",
      color: "rose"
    },
    {
      icon: BarChart3,
      title: "Analytics avancés",
      description: "Tableaux de bord temps réel, KPIs personnalisés, rapports exportables.",
      color: "cyan"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: billingCycle === 'monthly' ? "29" : "24",
      description: "Pour les agents indépendants",
      features: [
        "1 utilisateur",
        "20 biens actifs",
        "100 contacts",
        "Support email",
        "Diffusion manuelle"
      ],
      highlighted: false,
      cta: "Démarrer"
    },
    {
      name: "Pro",
      price: billingCycle === 'monthly' ? "59" : "49",
      description: "Pour les petites agences",
      features: [
        "3 utilisateurs",
        "100 biens actifs",
        "500 contacts",
        "Support prioritaire",
        "Matching IA",
        "Signature électronique",
        "Analytics avancés"
      ],
      highlighted: true,
      cta: "Essai gratuit"
    },
    {
      name: "Business",
      price: billingCycle === 'monthly' ? "99" : "82",
      description: "Pour les agences ambitieuses",
      features: [
        "5 utilisateurs",
        "Biens illimités",
        "Contacts illimités",
        "Support dédié 24/7",
        "Matching IA avancé",
        "API & Webhooks",
        "Multi-agences",
        "Formation incluse"
      ],
      highlighted: false,
      cta: "Contacter"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dupont",
      role: "Directrice, Immobilier Saint-Germain",
      content: "BienVuImmo a transformé notre façon de travailler. Le matching IA nous fait gagner 10h par semaine.",
      avatar: "MD",
      rating: 5
    },
    {
      name: "Thomas Leroy",
      role: "Agent indépendant, Lyon",
      content: "Interface intuitive, support réactif. J'ai doublé mes ventes en 6 mois grâce au CRM intelligent.",
      avatar: "TL",
      rating: 5
    },
    {
      name: "Sophie Martin",
      role: "Gérante, Agence du Parc",
      content: "Enfin un outil pensé pour les petites agences. Le rapport qualité/prix est imbattable.",
      avatar: "SM",
      rating: 5
    }
  ];

  const stats = [
    { value: "500+", label: "Agences actives", icon: Building2 },
    { value: "15k", label: "Biens gérés", icon: Home },
    { value: "98%", label: "Satisfaction client", icon: Star },
    { value: "<2h", label: "Temps de réponse", icon: Clock }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      amber: "from-amber-500 to-orange-500 bg-amber-50 text-amber-600 border-amber-200",
      blue: "from-blue-500 to-indigo-500 bg-blue-50 text-blue-600 border-blue-200",
      purple: "from-purple-500 to-pink-500 bg-purple-50 text-purple-600 border-purple-200",
      green: "from-emerald-500 to-teal-500 bg-emerald-50 text-emerald-600 border-emerald-200",
      rose: "from-rose-500 to-red-500 bg-rose-50 text-rose-600 border-rose-200",
      cyan: "from-cyan-500 to-blue-500 bg-cyan-50 text-cyan-600 border-cyan-200"
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-bl from-amber-100/40 via-orange-50/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-stone-100/60 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-stone-900/5 py-3" 
          : "bg-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
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
            </a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              <a href="/fonctionnalites" className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium rounded-full hover:bg-stone-100">Fonctionnalités</a>
              <a href="/tarifs" className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium rounded-full hover:bg-stone-100">Tarifs</a>
              <a href="/annonces" className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium rounded-full hover:bg-stone-100">Annonces</a>
              <a href="/contact" className="px-4 py-2 text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium rounded-full hover:bg-stone-100">Contact</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="/connexion" className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors rounded-full hover:bg-stone-100">
                Connexion
              </a>
              <a href="/inscription" className="group relative bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold overflow-hidden transition-all hover:shadow-xl hover:shadow-stone-900/20">
                <span className="relative z-10 flex items-center gap-2">
                  Essai gratuit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
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
              <a href="/fonctionnalites" className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Fonctionnalités</a>
              <a href="/tarifs" className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Tarifs</a>
              <a href="/annonces" className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Annonces</a>
              <a href="/contact" className="block px-4 py-3 text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Contact</a>
              <div className="pt-4 mt-4 border-t border-stone-100 space-y-3">
                <a href="/connexion" className="block w-full px-4 py-3 text-left text-stone-600 hover:bg-stone-50 rounded-xl transition-colors font-medium">Connexion</a>
                <a href="/inscription" className="block w-full bg-stone-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold text-center">Essai gratuit — 14 jours</a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 px-4 py-2 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-800 text-sm font-medium">Nouveau : Matching IA intégré</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08]">
                <span className="text-stone-900">Votre agence,</span>
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600">simplifiée</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                        <stop stopColor="#F59E0B"/>
                        <stop offset="1" stopColor="#EA580C"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-stone-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Le logiciel tout-en-un conçu pour les agences immobilières indépendantes. 
                Gérez vos biens, contacts et transactions <span className="text-stone-700 font-medium">en un seul endroit</span>.
              </p>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group relative bg-stone-900 text-white px-8 py-4 rounded-2xl text-base font-semibold overflow-hidden transition-all hover:shadow-2xl hover:shadow-stone-900/25 hover:-translate-y-0.5">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Démarrer gratuitement
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <button className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold border-2 border-stone-200 hover:border-stone-300 hover:bg-white transition-all">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <Play className="w-4 h-4 text-stone-600 group-hover:text-amber-600 ml-0.5" />
                  </div>
                  Voir la démo
                </button>
              </div>

              {/* Trust bar */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                <div className="flex -space-x-3">
                  {['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'].map((color, i) => (
                    <div 
                      key={i}
                      className="w-11 h-11 rounded-full border-[3px] border-white flex items-center justify-center text-xs font-bold text-white shadow-lg"
                      style={{ backgroundColor: color }}
                    >
                      {['MD', 'SL', 'JD', 'AB'][i]}
                    </div>
                  ))}
                  <div className="w-11 h-11 rounded-full bg-stone-100 border-[3px] border-white flex items-center justify-center text-xs font-bold text-stone-600 shadow-lg">
                    +497
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-stone-700">4.9/5</span>
                  </div>
                  <span className="text-sm text-stone-500">+500 agences satisfaites</span>
                </div>
              </div>
            </div>

            {/* Right content - Dashboard preview */}
            <div className="relative mt-8 lg:mt-0">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-[40px] blur-3xl scale-90" />
              
              {/* Main dashboard card */}
              <div className="relative bg-white rounded-[32px] shadow-2xl shadow-stone-900/10 p-5 sm:p-8 border border-stone-200/60">
                {/* Window controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-stone-100 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-stone-500 font-medium">En ligne</span>
                  </div>
                </div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-stone-400 mb-1">Bonjour, Marie 👋</p>
                    <h3 className="text-xl font-bold text-stone-900">Tableau de bord</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    MD
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
                    <Building2 className="w-5 h-5 mb-2 opacity-80" />
                    <p className="text-2xl sm:text-3xl font-bold">24</p>
                    <p className="text-xs opacity-80">Biens actifs</p>
                  </div>
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <Calendar className="w-5 h-5 mb-2 text-stone-400" />
                    <p className="text-2xl sm:text-3xl font-bold text-stone-900">12</p>
                    <p className="text-xs text-stone-500">Visites</p>
                  </div>
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <TrendingUp className="w-5 h-5 mb-2 text-green-500" />
                    <p className="text-2xl sm:text-3xl font-bold text-stone-900">3</p>
                    <p className="text-xs text-stone-500">Offres</p>
                  </div>
                </div>

                {/* Property list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                        <Home className="w-6 h-6 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">Appartement T3</p>
                        <p className="text-sm text-stone-500">Paris 11e • 65m²</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amber-600">485 000 €</span>
                      <p className="text-xs text-green-600 font-medium">3 matchs</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">Maison 5 pièces</p>
                        <p className="text-sm text-stone-500">Vincennes • 120m²</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amber-600">890 000 €</span>
                      <p className="text-xs text-stone-400 font-medium">1 match</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div 
                className="absolute -left-4 sm:-left-12 top-1/3 bg-white rounded-2xl shadow-xl shadow-stone-900/10 p-4 border border-stone-100 max-w-[200px]"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Nouveau match !</p>
                    <p className="text-xs text-stone-500">3 acquéreurs</p>
                  </div>
                </div>
              </div>

              <div 
                className="absolute -right-2 sm:-right-8 bottom-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/30 p-4 text-white"
                style={{ animation: 'floatDelayed 7s ease-in-out infinite' }}
              >
                <Key className="w-8 h-8 mb-2 opacity-90" />
                <p className="text-lg font-bold">2 ventes</p>
                <p className="text-xs text-amber-100">ce mois-ci 🎉</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-stone-900/5 border border-stone-100 p-8 sm:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-1">{stat.value}</p>
                  <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalités" className="py-20 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-amber-100/80 px-4 py-2 rounded-full text-amber-800 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Fonctionnalités complètes
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Tout ce dont vous avez
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> besoin</span>
            </h2>
            <p className="text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto">
              Une suite complète d&apos;outils pour gérer votre activité immobilière de A à Z
            </p>
          </div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const colorClasses = getColorClasses(feature.color);
              const isActive = activeFeature === index;
              
              return (
                <div 
                  key={index}
                  className={`group relative bg-white rounded-3xl p-8 border-2 transition-all duration-500 cursor-pointer hover:-translate-y-2 ${
                    isActive ? 'border-amber-300 shadow-xl shadow-amber-500/10' : 'border-stone-100 hover:border-stone-200 shadow-sm hover:shadow-lg'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${colorClasses.split(' ').slice(2, 4).join(' ')}`}>
                    <feature.icon className={`w-8 h-8 ${colorClasses.split(' ')[3]}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-stone-900">{feature.title}</h3>
                  <p className="text-stone-500 leading-relaxed">{feature.description}</p>
                  
                  {/* Arrow */}
                  <div className={`absolute bottom-8 right-8 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'
                  }`}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-20 sm:py-32 bg-stone-900 text-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-amber-300 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              14 jours d&apos;essai gratuit
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Un forfait pour chaque
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400"> ambition</span>
            </h2>
            <p className="text-lg sm:text-xl text-stone-400 max-w-2xl mx-auto mb-10">
              Sans engagement. Changez de forfait ou annulez à tout moment.
            </p>
            
            {/* Billing toggle */}
            <div className="inline-flex items-center gap-4 bg-stone-800/50 backdrop-blur p-1.5 rounded-full">
              <button 
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Mensuel
              </button>
              <button 
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly' ? 'bg-white text-stone-900' : 'text-stone-400 hover:text-white'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Annuel
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">-17%</span>
              </button>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                  plan.highlighted 
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/25 scale-105 lg:scale-110" 
                    : "bg-stone-800/40 backdrop-blur border border-stone-700/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-amber-600 text-xs font-bold px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Star className="w-3 h-3 fill-amber-500" />
                    PLUS POPULAIRE
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={plan.highlighted ? "text-amber-100" : "text-stone-400"}>{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl sm:text-6xl font-bold">{plan.price}€</span>
                    <span className={plan.highlighted ? "text-amber-100" : "text-stone-400"}>/mois</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className={`text-sm mt-1 ${plan.highlighted ? "text-amber-100" : "text-stone-500"}`}>
                      Facturé {parseInt(plan.price) * 12}€/an
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "bg-white/20" : "bg-amber-500/20"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? "text-white" : "text-amber-400"}`} />
                      </div>
                      <span className={plan.highlighted ? "text-white" : "text-stone-300"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                  plan.highlighted 
                    ? "bg-white text-amber-600 hover:bg-amber-50 shadow-lg hover:shadow-xl" 
                    : "bg-stone-700 text-white hover:bg-stone-600"
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="témoignages" className="py-20 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100/80 px-4 py-2 rounded-full text-amber-800 text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-amber-500" />
              Témoignages clients
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              Ils nous font
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> confiance</span>
            </h2>
          </div>

          {/* Testimonials grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg shadow-stone-900/5 border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-stone-600 leading-relaxed mb-8 text-lg">
                  &quot;{testimonial.content}&quot;
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">{testimonial.name}</p>
                    <p className="text-sm text-stone-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50" />
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(251 191 36 / 0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-amber-700 text-sm font-semibold shadow-lg shadow-amber-500/10 mb-8">
            <Zap className="w-4 h-4" />
            Offre de lancement : -20% à vie
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-stone-900">
            Prêt à transformer
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">votre agence ?</span>
          </h2>
          <p className="text-lg sm:text-xl text-stone-600 mb-10 max-w-2xl mx-auto">
            Rejoignez les centaines d&apos;agences qui ont simplifié leur quotidien avec BienVuImmo.
            <span className="font-medium text-stone-800"> Essai gratuit, sans carte bancaire.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative bg-stone-900 text-white px-10 py-5 rounded-2xl text-lg font-semibold overflow-hidden transition-all hover:shadow-2xl hover:shadow-stone-900/25 hover:-translate-y-1">
              <span className="relative z-10 flex items-center justify-center gap-3">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-lg font-semibold border-2 border-stone-300 hover:border-stone-400 bg-white/80 backdrop-blur transition-all hover:shadow-lg">
              <Phone className="w-5 h-5" />
              Nous appeler
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-stone-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-1">
              <a href="#" className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  BienVu<span className="text-amber-400">Immo</span>
                </span>
              </a>
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
                <li><a href="/fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="/tarifs" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="/annonces" className="hover:text-white transition-colors">Annonces</a></li>
                <li><a href="/inscription" className="hover:text-white transition-colors">Essai gratuit</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Compte</h4>
              <ul className="space-y-4 text-stone-400">
                <li><a href="/connexion" className="hover:text-white transition-colors">Connexion</a></li>
                <li><a href="/inscription" className="hover:text-white transition-colors">Inscription</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Tableau de bord</a></li>
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

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        * {
          scroll-behavior: smooth;
        }
        ::selection {
          background-color: rgb(251 191 36 / 0.3);
        }
      `}</style>
    </div>
  );
}