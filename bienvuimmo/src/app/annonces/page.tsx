'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Search, MapPin, Bed, Bath, Square, Heart, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Property {
  id: string;
  reference: string;
  title: string;
  description?: string;
  type: string;
  transactionType: string;
  status: string;
  price: number;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  address?: string;
  city: string;
  postalCode: string;
  energyClass?: string;
  gesClass?: string;
  features?: string[];
  mainPhoto?: string;
  agencyName?: string;
  createdAt: string;
}

export default function AnnoncesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterTransaction, setFilterTransaction] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterType) params.append('type', filterType);
      if (filterTransaction) params.append('transactionType', filterTransaction);
      if (filterCity) params.append('city', filterCity);
      if (priceMin) params.append('minPrice', priceMin);
      if (priceMax) params.append('maxPrice', priceMax);

      const res = await fetch(`/api/annonces?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
        setTotal(data.total || 0);
        
        // Extract unique cities
        const uniqueCities = Array.from(new Set(data.properties?.map((p: Property) => p.city).filter(Boolean))) as string[];
        setCities(uniqueCities);
      }
    } catch (error) {
      console.error('Erreur chargement annonces:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterType, filterTransaction, filterCity, priceMin, priceMax]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bienvuimmo_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('bienvuimmo_favorites', JSON.stringify(newFavorites));
  };

  const getEnergyClassColor = (energyClass?: string) => {
    if (!energyClass) return 'bg-gray-400';
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'APARTMENT': 'Appartement',
      'HOUSE': 'Maison',
      'LAND': 'Terrain',
      'COMMERCIAL': 'Commerce',
      'PARKING': 'Parking',
      'OTHER': 'Autre'
    };
    return labels[type] || type;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterTransaction('');
    setFilterCity('');
    setPriceMin('');
    setPriceMax('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero section */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trouvez votre bien idéal
            </h1>
            <p className="text-xl text-amber-100 mb-8">
              {total} bien{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''} à la vente et à la location
            </p>
            
            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ville, adresse, type de bien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 text-gray-900 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <select
                  value={filterTransaction}
                  onChange={(e) => setFilterTransaction(e.target.value)}
                  className="px-4 py-3 bg-gray-100 text-gray-900 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">Acheter / Louer</option>
                  <option value="SALE">Acheter</option>
                  <option value="RENT">Louer</option>
                </select>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span>Filtres</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition font-medium"
                >
                  Rechercher
                </button>
              </div>
              
              {/* Filtres avancés */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Type de bien</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="">Tous les types</option>
                      <option value="APARTMENT">Appartement</option>
                      <option value="HOUSE">Maison</option>
                      <option value="LAND">Terrain</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Ville</label>
                    <select
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="">Toutes les villes</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Prix min</label>
                    <input
                      type="number"
                      placeholder="€ Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Prix max</label>
                    <input
                      type="number"
                      placeholder="€ Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Results section */}
      <section className="container mx-auto px-4 py-12">
        {/* Active filters */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Chargement...' : `${total} bien${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
            </h2>
            {(filterType || filterTransaction || filterCity) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filterType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                    {getTypeLabel(filterType)}
                    <button onClick={() => setFilterType('')} className="hover:text-amber-900">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {filterTransaction && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                    {filterTransaction === 'SALE' ? 'Vente' : 'Location'}
                    <button onClick={() => setFilterTransaction('')} className="hover:text-amber-900">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {filterCity && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                    {filterCity}
                    <button onClick={() => setFilterCity('')} className="hover:text-amber-900">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        )}

        {/* Properties grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300">
                  {property.mainPhoto ? (
                    <Image
                      src={property.mainPhoto}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Building2 className="h-16 w-16" />
                    </div>
                  )}
                  
                  {/* Transaction type badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.transactionType === 'SALE' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-purple-600 text-white'
                    }`}>
                      {property.transactionType === 'SALE' ? 'Vente' : 'Location'}
                    </span>
                  </div>
                  
                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition"
                  >
                    <Heart 
                      className={`h-5 w-5 transition ${
                        favorites.includes(property.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </button>

                  {/* Energy class */}
                  {property.energyClass && (
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      <span className={`px-2 py-1 text-xs font-bold text-white rounded ${getEnergyClassColor(property.energyClass)}`}>
                        DPE {property.energyClass}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition line-clamp-2">
                      {property.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{property.city} ({property.postalCode})</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {property.surface && (
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>{property.surface} m²</span>
                      </div>
                    )}
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms} ch.</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-xl font-bold text-amber-600">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR',
                        maximumFractionDigits: 0 
                      }).format(property.price)}
                      {property.transactionType === 'RENT' && (
                        <span className="text-sm font-normal text-gray-500">/mois</span>
                      )}
                    </p>
                    <Link
                      href={`/annonces/${property.id}`}
                      className="text-sm font-medium text-amber-600 hover:text-amber-700 transition"
                    >
                      Voir détails →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun bien ne correspond à vos critères
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos filtres de recherche
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vous êtes agent immobilier ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Gérez vos biens et diffusez vos annonces facilement avec BienvuImmo
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium text-lg"
            >
              Découvrir notre solution
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
