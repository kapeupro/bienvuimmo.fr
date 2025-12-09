'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Search, MapPin, Bed, Bath, Square, Heart, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

// Données d'exemple des annonces
const properties = [
  {
    id: 1,
    reference: 'BV001',
    title: 'Appartement T3 lumineux avec balcon',
    type: 'Appartement',
    transactionType: 'Vente',
    city: 'Paris',
    postalCode: '75001',
    address: 'Rue de Rivoli',
    price: 450000,
    surface: 75,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    description: 'Superbe appartement T3 en plein cœur de Paris. Lumineux avec son grand balcon plein sud. Cuisine équipée, parquet ancien, moulures.',
    photos: ['/images/apt1.jpg'],
    energyClass: 'C',
    gesClass: 'D',
    features: ['Balcon', 'Parquet', 'Cave'],
    createdAt: '2024-12-08'
  },
  {
    id: 2,
    reference: 'BV002',
    title: 'Maison familiale avec jardin',
    type: 'Maison',
    transactionType: 'Vente',
    city: 'Lyon',
    postalCode: '69002',
    address: 'Avenue Jean Jaurès',
    price: 620000,
    surface: 145,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    description: 'Belle maison de 5 pièces avec grand jardin arboré. Garage double, cuisine aménagée, salon cathédrale.',
    photos: ['/images/maison1.jpg'],
    energyClass: 'B',
    gesClass: 'C',
    features: ['Jardin', 'Garage', 'Terrasse'],
    createdAt: '2024-12-07'
  },
  {
    id: 3,
    reference: 'BV003',
    title: 'Studio meublé - Quartier latin',
    type: 'Appartement',
    transactionType: 'Location',
    city: 'Paris',
    postalCode: '75005',
    address: 'Rue Mouffetard',
    price: 1200,
    surface: 28,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    description: 'Charmant studio meublé au cœur du Quartier Latin. Idéal étudiant ou jeune actif. Proche toutes commodités.',
    photos: ['/images/studio1.jpg'],
    energyClass: 'D',
    gesClass: 'E',
    features: ['Meublé', 'Cave'],
    createdAt: '2024-12-06'
  },
  {
    id: 4,
    reference: 'BV004',
    title: 'Villa contemporaine avec piscine',
    type: 'Maison',
    transactionType: 'Vente',
    city: 'Nice',
    postalCode: '06000',
    address: 'Promenade des Anglais',
    price: 1250000,
    surface: 220,
    rooms: 7,
    bedrooms: 5,
    bathrooms: 3,
    description: 'Exceptionnelle villa d\'architecte avec piscine à débordement. Vue mer panoramique, prestations haut de gamme.',
    photos: ['/images/villa1.jpg'],
    energyClass: 'A',
    gesClass: 'B',
    features: ['Piscine', 'Vue mer', 'Garage', 'Jardin'],
    createdAt: '2024-12-05'
  },
  {
    id: 5,
    reference: 'BV005',
    title: 'Appartement T2 rénové centre-ville',
    type: 'Appartement',
    transactionType: 'Location',
    city: 'Marseille',
    postalCode: '13001',
    address: 'La Canebière',
    price: 950,
    surface: 52,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    description: 'Bel appartement T2 entièrement rénové. Cuisine ouverte sur séjour, chambre avec dressing. Proche métro.',
    photos: ['/images/apt2.jpg'],
    energyClass: 'C',
    gesClass: 'C',
    features: ['Rénové', 'Parking'],
    createdAt: '2024-12-04'
  },
  {
    id: 6,
    reference: 'BV006',
    title: 'Loft industriel - Quartier des Chartrons',
    type: 'Appartement',
    transactionType: 'Vente',
    city: 'Bordeaux',
    postalCode: '33000',
    address: 'Quai des Chartrons',
    price: 385000,
    surface: 95,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    description: 'Magnifique loft dans ancien chai bordelais. Volumes exceptionnels, poutres apparentes, verrière.',
    photos: ['/images/loft1.jpg'],
    energyClass: 'D',
    gesClass: 'D',
    features: ['Loft', 'Parquet', 'Cave'],
    createdAt: '2024-12-03'
  },
  {
    id: 7,
    reference: 'BV007',
    title: 'Maison de ville avec terrasse',
    type: 'Maison',
    transactionType: 'Vente',
    city: 'Toulouse',
    postalCode: '31000',
    address: 'Place du Capitole',
    price: 520000,
    surface: 130,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    description: 'Charmante maison de ville avec terrasse tropézienne. Rénovation de qualité, matériaux nobles.',
    photos: ['/images/maison2.jpg'],
    energyClass: 'B',
    gesClass: 'B',
    features: ['Terrasse', 'Cave', 'Climatisation'],
    createdAt: '2024-12-02'
  },
  {
    id: 8,
    reference: 'BV008',
    title: 'Appartement T4 familial',
    type: 'Appartement',
    transactionType: 'Location',
    city: 'Nantes',
    postalCode: '44000',
    address: 'Île de Nantes',
    price: 1450,
    surface: 90,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    description: 'Grand appartement familial avec 3 chambres. Balcon, parking souterrain, proche tramway.',
    photos: ['/images/apt3.jpg'],
    energyClass: 'B',
    gesClass: 'C',
    features: ['Balcon', 'Parking', 'Cave'],
    createdAt: '2024-12-01'
  },
];

export default function AnnoncesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTransaction, setFilterTransaction] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const cities = Array.from(new Set(properties.map(p => p.city)));

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesTransaction = filterTransaction === 'all' || property.transactionType === filterTransaction;
    const matchesCity = filterCity === 'all' || property.city === filterCity;
    
    const matchesPriceMin = !priceMin || property.price >= parseInt(priceMin);
    const matchesPriceMax = !priceMax || property.price <= parseInt(priceMax);
    
    return matchesSearch && matchesType && matchesTransaction && matchesCity && matchesPriceMin && matchesPriceMax;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">bienvuimmo</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/annonces" className="text-blue-600 font-medium">
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

      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trouvez votre bien idéal
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {properties.length} biens disponibles à la vente et à la location
            </p>
            
            {/* Barre de recherche principale */}
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ville, adresse, type de bien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <select
                  value={filterTransaction}
                  onChange={(e) => setFilterTransaction(e.target.value)}
                  className="px-4 py-3 bg-gray-100 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="all">Acheter / Louer</option>
                  <option value="Vente">Acheter</option>
                  <option value="Location">Louer</option>
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span>Filtres</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium">
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
                      className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="all">Tous les types</option>
                      <option value="Appartement">Appartement</option>
                      <option value="Maison">Maison</option>
                      <option value="Terrain">Terrain</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Ville</label>
                    <select
                      value={filterCity}
                      onChange={(e) => setFilterCity(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="all">Toutes les villes</option>
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
                      className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Prix max</label>
                    <input
                      type="number"
                      placeholder="€ Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results section */}
      <section className="container mx-auto px-4 py-12">
        {/* Results header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
            </h2>
            {(filterType !== 'all' || filterTransaction !== 'all' || filterCity !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filterType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {filterType}
                    <button onClick={() => setFilterType('all')} className="hover:text-blue-900">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {filterTransaction !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {filterTransaction}
                    <button onClick={() => setFilterTransaction('all')} className="hover:text-blue-900">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {filterCity !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {filterCity}
                    <button onClick={() => setFilterCity('all')} className="hover:text-blue-900">
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Trier par :</span>
            <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm">
              <option>Plus récent</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Surface croissante</option>
            </select>
          </div>
        </div>

        {/* Properties grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Building2 className="h-16 w-16" />
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
                <div className="absolute bottom-3 left-3 flex gap-1">
                  <span className={`px-2 py-1 text-xs font-bold text-white rounded ${getEnergyClassColor(property.energyClass)}`}>
                    DPE {property.energyClass}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                    {property.title}
                  </h3>
                </div>

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

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
                  <Link
                    href={`/annonces/${property.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                  >
                    Voir détails →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun bien ne correspond à vos critères
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos filtres de recherche
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterTransaction('all');
                setFilterCity('all');
                setPriceMin('');
                setPriceMax('');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg"
            >
              Découvrir notre solution
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
              <h4 className="font-semibold text-white mb-4">Annonces</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/annonces?type=Appartement" className="hover:text-white transition">Appartements</Link></li>
                <li><Link href="/annonces?type=Maison" className="hover:text-white transition">Maisons</Link></li>
                <li><Link href="/annonces?transaction=Vente" className="hover:text-white transition">Acheter</Link></li>
                <li><Link href="/annonces?transaction=Location" className="hover:text-white transition">Louer</Link></li>
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
