'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Filter, Building2, MapPin, Home, Euro, 
  Eye, Pencil, Trash2, MoreVertical, X, Check, AlertCircle,
  Loader2, ChevronDown
} from 'lucide-react';

interface Property {
  id: string;
  reference: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  price: number;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  address?: string;
  city?: string;
  postalCode?: string;
  views?: number;
  createdAt: string;
  agentFirstName?: string;
  agentLastName?: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [total, setTotal] = useState(0);
  
  // Modal states
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTMENT',
    transactionType: 'SALE',
    status: 'AVAILABLE',
    price: '',
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus) params.append('status', filterStatus);
      if (filterType) params.append('type', filterType);
      
      const res = await fetch(`/api/properties?${params.toString()}`, {
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des biens');
      }

      const data = await res.json();
      setProperties(data.properties || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les biens');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterStatus, filterType]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Check URL params for action
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'new') {
      setShowNewModal(true);
    }
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          surface: formData.surface ? parseFloat(formData.surface) : null,
          rooms: formData.rooms ? parseInt(formData.rooms) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }

      setShowNewModal(false);
      setFormData({
        title: '', description: '', type: 'APARTMENT', transactionType: 'SALE', status: 'AVAILABLE',
        price: '', surface: '', rooms: '', bedrooms: '', bathrooms: '',
        address: '', city: '', postalCode: ''
      });
      fetchProperties();
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setShowDeleteModal(null);
      fetchProperties();
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-700 border-green-200';
      case 'UNDER_OFFER': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'SOLD': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'RENTED': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'APARTMENT': return 'Appartement';
      case 'HOUSE': return 'Maison';
      case 'LAND': return 'Terrain';
      case 'COMMERCIAL': return 'Commerce';
      case 'PARKING': return 'Parking';
      default: return type;
    }
  };

  const stats = {
    total: total,
    available: properties.filter(p => p.status === 'AVAILABLE').length,
    underOffer: properties.filter(p => p.status === 'UNDER_OFFER').length,
    sold: properties.filter(p => p.status === 'SOLD').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Gestion des biens</h1>
          <p className="mt-2 text-stone-600">Gérez votre portefeuille immobilier</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
        >
          <Plus className="w-5 h-5" />
          Ajouter un bien
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Référence, titre, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Statut
            </label>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
              >
                <option value="">Tous les statuts</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="UNDER_OFFER">Sous offre</option>
                <option value="SOLD">Vendu</option>
                <option value="RENTED">Loué</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Type
            </label>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none"
              >
                <option value="">Tous les types</option>
                <option value="APARTMENT">Appartement</option>
                <option value="HOUSE">Maison</option>
                <option value="LAND">Terrain</option>
                <option value="COMMERCIAL">Commerce</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-600">Total</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-600">Disponibles</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.available}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-600">Sous offre</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.underOffer}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-sm text-stone-600">Vendus</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.sold}</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Properties list */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-stone-500">Chargement des biens...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">Aucun bien</h3>
            <p className="text-stone-500 mb-6">Commencez par ajouter votre premier bien immobilier</p>
            <button 
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter un bien
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {properties.map((property) => (
              <div key={property.id} className="p-6 hover:bg-stone-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Home className="w-9 h-9 text-amber-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">{property.reference}</span>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(property.status)}`}>
                        {getStatusLabel(property.status)}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-stone-100 text-stone-600">
                        {getTypeLabel(property.type)}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-stone-900 text-lg">{property.title}</h3>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                      {property.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {property.city} {property.postalCode}
                        </span>
                      )}
                      {property.surface && (
                        <>
                          <span>•</span>
                          <span>{property.surface} m²</span>
                        </>
                      )}
                      {property.rooms && (
                        <>
                          <span>•</span>
                          <span>{property.rooms} pièces</span>
                        </>
                      )}
                      {property.views !== undefined && property.views > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {property.views} vues
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-stone-900">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-3 justify-end">
                      <button 
                        className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowDeleteModal(property.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Property Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-stone-900">Nouveau bien</h2>
              <button 
                onClick={() => setShowNewModal(false)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{submitError}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Titre du bien *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Appartement T3 - Centre ville"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Type de bien *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="APARTMENT">Appartement</option>
                    <option value="HOUSE">Maison</option>
                    <option value="LAND">Terrain</option>
                    <option value="COMMERCIAL">Commerce</option>
                    <option value="PARKING">Parking</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Transaction *
                  </label>
                  <select
                    required
                    value={formData.transactionType}
                    onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="SALE">Vente</option>
                    <option value="RENT">Location</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="AVAILABLE">Disponible</option>
                    <option value="UNDER_OFFER">Sous offre</option>
                    <option value="SOLD">Vendu</option>
                    <option value="RENTED">Loué</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 250000"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Surface (m²)
                  </label>
                  <input
                    type="number"
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                    placeholder="Ex: 75"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Nombre de pièces
                  </label>
                  <input
                    type="number"
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    placeholder="Ex: 3"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Chambres
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    placeholder="Ex: 2"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ex: 12 rue de la République"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: Paris"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="Ex: 75001"
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description du bien..."
                    rows={4}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button 
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-3 text-stone-700 hover:bg-stone-100 rounded-xl font-medium transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  Créer le bien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Supprimer ce bien ?</h2>
            <p className="text-stone-600 mb-6">
              Cette action est irréversible. Toutes les données associées à ce bien seront supprimées.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="px-5 py-3 text-stone-700 hover:bg-stone-100 rounded-xl font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => handleDelete(showDeleteModal)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
