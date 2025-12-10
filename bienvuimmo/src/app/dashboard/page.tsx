"use client";

import { useState, useEffect, useCallback } from "react";
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
  Plus,
  MapPin,
  Eye,
  LogOut,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

interface DashboardStats {
  properties: {
    total: number;
    available: number;
    underOffer: number;
    sold: number;
  };
  contacts: {
    total: number;
  };
  visits: {
    total: number;
    upcoming: number;
    thisWeek: number;
  };
  mandates: {
    total: number;
    active: number;
  };
}

interface Property {
  id: string;
  reference: string;
  title: string;
  city: string;
  price: number;
  surface: number;
  status: string;
  views: number;
  createdAt: string;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

interface Visit {
  id: string;
  date: string;
  time: string;
  status: string;
  propertyTitle: string;
  firstName: string;
  lastName: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [statsRes, propertiesRes, activitiesRes, visitsRes] = await Promise.all([
        fetch('/api/dashboard/stats', { credentials: 'include' }),
        fetch('/api/dashboard/properties', { credentials: 'include' }),
        fetch('/api/dashboard/activities', { credentials: 'include' }),
        fetch('/api/dashboard/visits', { credentials: 'include' })
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (propertiesRes.ok) {
        const data = await propertiesRes.json();
        setProperties(data.properties || []);
      }

      if (activitiesRes.ok) {
        const data = await activitiesRes.json();
        setActivities(data.activities || []);
      }

      if (visitsRes.ok) {
        const data = await visitsRes.json();
        setVisits(data.visits || []);
      }
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError('Impossible de charger les données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user, fetchDashboardData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return "bg-green-100 text-green-700 border-green-200";
      case 'UNDER_OFFER':
        return "bg-orange-100 text-orange-700 border-orange-200";
      case 'SOLD':
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponible';
      case 'UNDER_OFFER': return 'Sous offre';
      case 'SOLD': return 'Vendu';
      case 'RENTED': return 'Loué';
      default: return status;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PROPERTY_CREATED': return { icon: Home, color: 'bg-amber-100 text-amber-600' };
      case 'CONTACT_CREATED': return { icon: Users, color: 'bg-green-100 text-green-600' };
      case 'VISIT_SCHEDULED': return { icon: Calendar, color: 'bg-blue-100 text-blue-600' };
      case 'MANDATE_CREATED': return { icon: FileText, color: 'bg-purple-100 text-purple-600' };
      default: return { icon: Sparkles, color: 'bg-stone-100 text-stone-600' };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const formatVisitDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === tomorrow.toDateString()) return "Demain";
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Chargement du tableau de bord...</p>
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
            {user?.agency?.name ? ' — ' : ''}Voici un aperçu de votre activité
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2.5 text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-medium transition-all"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
          <Link 
            href="/dashboard/properties?action=new"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un bien</span>
          </Link>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 - Biens */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-amber-600" />
            </div>
            {stats && stats.properties.total > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs font-semibold text-green-600">Actif</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">Biens</p>
            <p className="text-3xl font-bold text-stone-900">{stats?.properties.total || 0}</p>
            <p className="text-sm text-stone-500 mt-2">
              <span className="font-semibold text-green-600">{stats?.properties.available || 0}</span> disponibles
              {(stats?.properties.underOffer || 0) > 0 && (
                <span className="ml-2 text-orange-600">• {stats?.properties.underOffer} sous offre</span>
              )}
            </p>
          </div>
        </div>

        {/* Stat 2 - Contacts */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">Contacts</p>
            <p className="text-3xl font-bold text-stone-900">{stats?.contacts.total || 0}</p>
            <p className="text-sm text-stone-500 mt-2">
              Base de données CRM
            </p>
          </div>
        </div>

        {/* Stat 3 - Visites */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            {(stats?.visits.upcoming || 0) > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full">
                <Clock className="w-3 h-3 text-orange-600" />
                <span className="text-xs font-semibold text-orange-600">{stats?.visits.upcoming} à venir</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-stone-500 mb-1">Visites</p>
            <p className="text-3xl font-bold text-stone-900">{stats?.visits.total || 0}</p>
            <p className="text-sm text-stone-500 mt-2">
              <span className="font-semibold text-orange-600">{stats?.visits.thisWeek || 0}</span> cette semaine
            </p>
          </div>
        </div>

        {/* Stat 4 - Mandats */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-1 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            {(stats?.mandates.active || 0) > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-white" />
                <span className="text-xs font-semibold text-white">Actifs</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-amber-100 mb-1">Mandats</p>
            <p className="text-3xl font-bold">{stats?.mandates.total || 0}</p>
            <p className="text-sm text-amber-100 mt-2">
              {stats?.mandates.active || 0} mandats actifs
            </p>
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
              <Link 
                href="/dashboard/properties" 
                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-semibold group"
              >
                Voir tout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {properties.length === 0 ? (
              <div className="p-12 text-center">
                <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500 mb-4">Aucun bien pour le moment</p>
                <Link 
                  href="/dashboard/properties?action=new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter votre premier bien
                </Link>
              </div>
            ) : (
              properties.map((property) => (
                <Link 
                  key={property.id} 
                  href={`/dashboard/properties/${property.id}`}
                  className="block p-6 hover:bg-stone-50 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Home className="w-7 h-7 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">{property.reference}</span>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(property.status)}`}>
                          {getStatusLabel(property.status)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-stone-500">
                        {property.city && (
                          <>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {property.city}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        {property.surface && <span>{property.surface}m²</span>}
                      </div>
                      {property.views > 0 && (
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5 text-xs text-stone-500">
                            <Eye className="w-4 h-4" />
                            {property.views} vues
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-stone-900">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent activities - 1 column */}
        <div className="bg-white rounded-2xl border border-stone-200">
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900">Activité récente</h2>
            <p className="text-sm text-stone-500 mt-0.5">Dernières notifications</p>
          </div>
          <div className="divide-y divide-stone-100">
            {activities.length === 0 ? (
              <div className="p-8 text-center">
                <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500 text-sm">Aucune activité récente</p>
              </div>
            ) : (
              activities.map((activity) => {
                const { icon: Icon, color } = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="p-4 hover:bg-stone-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 leading-snug">{activity.message}</p>
                        <p className="text-xs text-stone-500 mt-1">{formatDate(activity.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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
            <Link 
              href="/dashboard/visits"
              className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-semibold transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Voir le planning
            </Link>
          </div>
        </div>
        <div className="p-6">
          {visits.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 mb-4">Aucune visite planifiée</p>
              <Link 
                href="/dashboard/visits?action=new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Planifier une visite
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {visits.slice(0, 3).map((visit) => (
                <div key={visit.id} className="bg-stone-50 rounded-xl p-5 hover:bg-stone-100 transition-colors border border-stone-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        visit.status === 'CONFIRMED' ? 'bg-green-500' : 
                        visit.status === 'CANCELLED' ? 'bg-red-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                        {formatVisitDate(visit.date)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-amber-600">{visit.time}</span>
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-3 text-sm">{visit.propertyTitle || 'Bien non spécifié'}</h3>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center text-xs font-bold">
                      {visit.firstName?.[0]}{visit.lastName?.[0]}
                    </div>
                    <span>{visit.firstName} {visit.lastName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-br from-stone-50 to-amber-50/30 rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-bold text-stone-900 mb-2">Actions rapides</h2>
        <p className="text-sm text-stone-500 mb-6">Accédez rapidement aux fonctions principales</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/dashboard/properties?action=new"
            className="group flex items-center gap-3 p-4 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-700 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 bg-amber-100 group-hover:bg-amber-200 rounded-lg flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-amber-600" />
            </div>
            <span className="font-semibold">Ajouter un bien</span>
          </Link>
          
          <Link 
            href="/dashboard/contacts?action=new"
            className="group flex items-center gap-3 p-4 bg-white hover:bg-purple-50 border border-stone-200 hover:border-purple-300 text-stone-700 hover:text-purple-700 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-semibold">Nouveau contact</span>
          </Link>
          
          <Link 
            href="/dashboard/visits?action=new"
            className="group flex items-center gap-3 p-4 bg-white hover:bg-orange-50 border border-stone-200 hover:border-orange-300 text-stone-700 hover:text-orange-700 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-semibold">Planifier visite</span>
          </Link>
          
          <Link 
            href="/dashboard/mandates?action=new"
            className="group flex items-center gap-3 p-4 bg-white hover:bg-green-50 border border-stone-200 hover:border-green-300 text-stone-700 hover:text-green-700 rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold">Créer un mandat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
