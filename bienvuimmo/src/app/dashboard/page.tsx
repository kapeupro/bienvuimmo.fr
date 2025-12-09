"use client";

import { 
  Building2, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  ArrowRight,
  Home,
  Sparkles,
  CheckCircle2,
  Clock,
  Euro,
  Plus,
  MapPin,
  Eye,
  Heart,
  Phone,
  Mail,
  BarChart3,
  Activity,
  LogOut
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();

  // Données statiques pour la démonstration
  const stats = {
    totalProperties: 147,
    availableProperties: 98,
    totalContacts: 234,
    pendingVisits: 12,
    monthlyRevenue: 45678,
    activeMandate: 56,
    thisMonthSales: 3,
    conversionRate: 18.5
  };

  const recentProperties = [
    { 
      id: 1, 
      ref: "BV001", 
      title: "Appartement T3 - Centre ville", 
      city: "Paris 11e", 
      price: 450000, 
      status: "Disponible",
      surface: "65m²",
      views: 142,
      likes: 28,
      matches: 5
    },
    { 
      id: 2, 
      ref: "BV002", 
      title: "Maison 5 pièces avec jardin", 
      city: "Lyon 6e", 
      price: 620000, 
      status: "Sous offre",
      surface: "120m²",
      views: 89,
      likes: 15,
      matches: 2
    },
    { 
      id: 3, 
      ref: "BV003", 
      title: "Studio meublé - Quartier latin", 
      city: "Paris 5e", 
      price: 180000, 
      status: "Disponible",
      surface: "28m²",
      views: 256,
      likes: 42,
      matches: 8
    },
    { 
      id: 4, 
      ref: "BV004", 
      title: "Villa moderne avec piscine", 
      city: "Nice", 
      price: 1250000, 
      status: "Disponible",
      surface: "200m²",
      views: 67,
      likes: 12,
      matches: 3
    },
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: "match", 
      message: "5 nouveaux matchs pour Appartement T3", 
      time: "Il y a 15 min", 
      icon: Sparkles,
      color: "purple"
    },
    { 
      id: 2, 
      type: "visit", 
      message: "Visite confirmée - Villa Nice", 
      time: "Il y a 1h", 
      icon: Calendar,
      color: "blue"
    },
    { 
      id: 3, 
      type: "contact", 
      message: "Nouveau contact : Sophie Martin", 
      time: "Il y a 2h", 
      icon: Users,
      color: "green"
    },
    { 
      id: 4, 
      type: "mandate", 
      message: "Mandat signé pour BV002", 
      time: "Il y a 4h", 
      icon: FileText,
      color: "amber"
    },
    { 
      id: 5, 
      type: "property", 
      message: "Bien BV004 ajouté avec succès", 
      time: "Hier", 
      icon: Home,
      color: "stone"
    },
  ];

  const upcomingVisits = [
    {
      id: 1,
      property: "Appartement T3 - Centre ville",
      contact: "Jean Dupont",
      date: "Aujourd'hui",
      time: "14:30",
      status: "confirmed"
    },
    {
      id: 2,
      property: "Villa moderne avec piscine",
      contact: "Marie Laurent",
      date: "Demain",
      time: "10:00",
      status: "pending"
    },
    {
      id: 3,
      property: "Maison 5 pièces",
      contact: "Pierre Bernard",
      date: "Mercredi",
      time: "16:00",
      status: "confirmed"
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "Disponible" 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-orange-100 text-orange-700 border-orange-200";
  };

  const getActivityColor = (color: string) => {
    const colors = {
      purple: "bg-purple-100 text-purple-600",
      blue: "bg-amber-100 text-amber-600",
      green: "bg-green-100 text-green-600",
      amber: "bg-amber-100 text-amber-600",
      stone: "bg-stone-100 text-stone-600"
    };
    return colors[color as keyof typeof colors] || colors.stone;
  };

  // Afficher un loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const userName = user?.firstName || 'Utilisateur';

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Bonjour, {userName} 👋</h1>
          <p className="mt-1 text-stone-500">
            {user?.agency?.name && <span className="text-amber-600 font-medium">{user.agency.name}</span>}
            {user?.agency?.name ? ' — ' : ''}Voici un aperçu de votre activité aujourd&apos;hui
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all">
            <Plus className="w-4 h-4" />
            <span>Ajouter un bien</span>
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span className="text-xs font-semibold text-green-600">+8%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">Biens actifs</p>
            <p className="text-3xl font-bold text-stone-900">{stats.totalProperties}</p>
            <p className="text-sm text-stone-500 mt-2">
              <span className="font-semibold text-green-600">{stats.availableProperties}</span> disponibles
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full">
              <Activity className="w-3 h-3 text-amber-600" />
              <span className="text-xs font-semibold text-amber-600">+12</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">Contacts</p>
            <p className="text-3xl font-bold text-stone-900">{stats.totalContacts}</p>
            <p className="text-sm text-stone-500 mt-2">
              Base de données
            </p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
              <Clock className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-semibold text-orange-600">3 aujourd&apos;hui</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">Visites</p>
            <p className="text-3xl font-bold text-stone-900">{stats.pendingVisits}</p>
            <p className="text-sm text-stone-500 mt-2">
              Cette semaine
            </p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-1 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Euro className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
              <TrendingUp className="w-3 h-3 text-white" />
              <span className="text-xs font-semibold text-white">+12%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-100 mb-1">CA du mois</p>
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stats.monthlyRevenue)}
            </p>
            <p className="text-sm text-amber-100 mt-2">
              {stats.thisMonthSales} ventes ce mois
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.activeMandate}</p>
              <p className="text-xs text-stone-500">Mandats actifs</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">23</p>
              <p className="text-xs text-stone-500">Matchs IA</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">{stats.conversionRate}%</p>
              <p className="text-xs text-stone-500">Taux conversion</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900">8.2k</p>
              <p className="text-xs text-stone-500">Vues ce mois</p>
            </div>
          </div>
        </div>
      </div>

      {/* Three columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent properties - 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200">
          <div className="p-6 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Biens récents</h2>
                <p className="text-sm text-stone-500 mt-0.5">Vos derniers biens ajoutés</p>
              </div>
              <a 
                href="/dashboard/properties" 
                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-semibold group"
              >
                Voir tout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {recentProperties.map((property) => (
              <div key={property.id} className="p-6 hover:bg-stone-50 transition-colors group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Home className="w-7 h-7 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">{property.ref}</span>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                      {property.matches > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          <Sparkles className="w-3 h-3" />
                          {property.matches} matchs
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.city}
                      </span>
                      <span>•</span>
                      <span>{property.surface}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Eye className="w-4 h-4" />
                        {property.views}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Heart className="w-4 h-4" />
                        {property.likes}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-stone-900">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activities - 1 column */}
        <div className="bg-white rounded-2xl border border-stone-200">
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900">Activité récente</h2>
            <p className="text-sm text-stone-500 mt-0.5">Dernières notifications</p>
          </div>
          <div className="divide-y divide-stone-100">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 leading-snug">{activity.message}</p>
                      <p className="text-xs text-stone-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming visits */}
      <div className="bg-white rounded-2xl border border-stone-200">
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Prochaines visites</h2>
              <p className="text-sm text-stone-500 mt-0.5">Planning de la semaine</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-semibold transition-colors">
              <Calendar className="w-4 h-4" />
              Voir le planning
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            {upcomingVisits.map((visit) => (
              <div key={visit.id} className="bg-stone-50 rounded-xl p-5 hover:bg-stone-100 transition-colors border border-stone-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      visit.status === 'confirmed' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{visit.date}</span>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{visit.time}</span>
                </div>
                <h3 className="font-semibold text-stone-900 mb-3 text-sm">{visit.property}</h3>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center text-xs font-bold">
                    {visit.contact.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{visit.contact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-br from-stone-50 to-amber-50/30 rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-900 mb-2">Actions rapides</h2>
        <p className="text-sm text-stone-500 mb-6">Accédez rapidement aux fonctions principales</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="group flex items-center gap-3 p-4 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-700 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="w-10 h-10 bg-amber-100 group-hover:bg-amber-200 rounded-lg flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-amber-600" />
            </div>
            <span className="font-semibold">Ajouter un bien</span>
          </button>
          
          <button className="group flex items-center gap-3 p-4 bg-white hover:bg-purple-50 border border-stone-200 hover:border-purple-300 text-stone-700 hover:text-purple-700 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-semibold">Nouveau contact</span>
          </button>
          
          <button className="group flex items-center gap-3 p-4 bg-white hover:bg-orange-50 border border-stone-200 hover:border-orange-300 text-stone-700 hover:text-orange-700 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-semibold">Planifier visite</span>
          </button>
          
          <button className="group flex items-center gap-3 p-4 bg-white hover:bg-green-50 border border-stone-200 hover:border-green-300 text-stone-700 hover:text-green-700 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold">Créer un mandat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
