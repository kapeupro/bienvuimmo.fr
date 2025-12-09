'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  Zap
} from 'lucide-react';

// Données d'exemple des annonces (même que dans la page liste)
const properties = [
  {
    id: 1,
    reference: 'BV001',
    title: 'Appartement T3 lumineux avec balcon',
    type: 'Appartement',
    transactionType: 'Vente',
    city: 'Paris',
    postalCode: '75001',
    address: '15 Rue de Rivoli',
    price: 450000,
    surface: 75,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    floor: 4,
    totalFloors: 6,
    buildYear: 1920,
    description: `Superbe appartement T3 en plein cœur de Paris, situé au 4ème étage d'un immeuble haussmannien avec ascenseur.

Cet appartement lumineux de 75m² se compose :
- Une entrée avec rangements
- Un séjour double de 30m² avec parquet ancien et moulures
- Une cuisine équipée et aménagée ouverte sur le séjour
- Deux chambres spacieuses (12m² et 14m²)
- Une salle de bain avec baignoire
- Un WC séparé
- Un grand balcon filant plein sud

Prestations de qualité : parquet massif, moulures, cheminées décoratives, double vitrage.

Cave et local à vélos en sous-sol.

Proche métro, commerces et écoles. Quartier calme et recherché.

Idéal pour un couple ou une petite famille souhaitant vivre au cœur de Paris.`,
    photos: ['/images/apt1-1.jpg', '/images/apt1-2.jpg', '/images/apt1-3.jpg', '/images/apt1-4.jpg'],
    energyClass: 'C',
    energyValue: 185,
    gesClass: 'D',
    gesValue: 35,
    features: ['Balcon', 'Parquet', 'Cave', 'Ascenseur', 'Gardien', 'Interphone'],
    charges: 250,
    taxeFonciere: 1200,
    agent: {
      name: 'Sophie Martin',
      phone: '+33 6 12 34 56 78',
      email: 'sophie.martin@bienvuimmo.fr',
      photo: '/images/agent1.jpg'
    },
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
    address: '8 Avenue Jean Jaurès',
    price: 620000,
    surface: 145,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    floor: 0,
    totalFloors: 2,
    buildYear: 1995,
    description: `Belle maison familiale de 145m² sur terrain de 500m² avec jardin arboré.

Cette maison de 5 pièces se compose :

Au rez-de-chaussée :
- Grande entrée avec placard
- Salon-séjour de 45m² avec cheminée
- Cuisine aménagée et équipée
- WC invités

À l'étage :
- 4 chambres (dont une suite parentale avec dressing et salle d'eau)
- Salle de bain familiale
- WC

Extérieurs :
- Jardin paysager de 350m²
- Terrasse carrelée de 30m²
- Garage double

Prestations : chauffage au sol, climatisation réversible, alarme.

Quartier résidentiel calme, proche écoles et commerces.`,
    photos: ['/images/maison1-1.jpg', '/images/maison1-2.jpg'],
    energyClass: 'B',
    energyValue: 95,
    gesClass: 'C',
    gesValue: 22,
    features: ['Jardin', 'Garage', 'Terrasse', 'Cheminée', 'Climatisation', 'Alarme'],
    charges: 0,
    taxeFonciere: 2800,
    agent: {
      name: 'Jean Dupont',
      phone: '+33 6 23 45 67 89',
      email: 'jean.dupont@bienvuimmo.fr',
      photo: '/images/agent2.jpg'
    },
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
    address: '22 Rue Mouffetard',
    price: 1200,
    surface: 28,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    floor: 3,
    totalFloors: 5,
    buildYear: 1850,
    description: `Charmant studio meublé au cœur du Quartier Latin.

Ce studio fonctionnel de 28m² comprend :
- Un espace de vie avec coin cuisine équipée
- Un coin nuit avec lit double
- Une salle d'eau avec douche et WC

Entièrement meublé et équipé : lit, bureau, rangements, électroménager.

Idéalement situé rue Mouffetard, à proximité des universités, commerces et transports.

Parfait pour étudiant ou jeune actif.

Charges comprises : eau, chauffage collectif.
Électricité et internet à la charge du locataire.`,
    photos: ['/images/studio1-1.jpg'],
    energyClass: 'D',
    energyValue: 230,
    gesClass: 'E',
    gesValue: 48,
    features: ['Meublé', 'Cave', 'Interphone'],
    charges: 80,
    taxeFonciere: 0,
    agent: {
      name: 'Marie Dubois',
      phone: '+33 6 34 56 78 90',
      email: 'marie.dubois@bienvuimmo.fr',
      photo: '/images/agent3.jpg'
    },
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
    address: '45 Promenade des Anglais',
    price: 1250000,
    surface: 220,
    rooms: 7,
    bedrooms: 5,
    bathrooms: 3,
    floor: 0,
    totalFloors: 1,
    buildYear: 2018,
    description: `Exceptionnelle villa d'architecte avec vue mer panoramique.

Cette villa contemporaine de 220m² offre des prestations haut de gamme :

Rez-de-chaussée :
- Vaste séjour de 60m² avec baies vitrées
- Cuisine américaine équipée premium
- Suite parentale avec dressing et salle d'eau
- Bureau / chambre d'amis

Étage :
- 4 chambres avec placards intégrés
- 2 salles de bain
- Terrasse panoramique

Extérieurs :
- Piscine à débordement chauffée
- Jardin méditerranéen de 800m²
- Pool house avec cuisine d'été
- Garage 3 voitures

Prestations : domotique complète, climatisation, alarme, portail automatique.`,
    photos: ['/images/villa1-1.jpg', '/images/villa1-2.jpg', '/images/villa1-3.jpg'],
    energyClass: 'A',
    energyValue: 45,
    gesClass: 'B',
    gesValue: 8,
    features: ['Piscine', 'Vue mer', 'Garage', 'Jardin', 'Domotique', 'Climatisation'],
    charges: 0,
    taxeFonciere: 5500,
    agent: {
      name: 'Sophie Martin',
      phone: '+33 6 12 34 56 78',
      email: 'sophie.martin@bienvuimmo.fr',
      photo: '/images/agent1.jpg'
    },
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
    address: '88 La Canebière',
    price: 950,
    surface: 52,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    floor: 2,
    totalFloors: 5,
    buildYear: 1930,
    description: `Bel appartement T2 entièrement rénové au cœur de Marseille.

Cet appartement lumineux de 52m² comprend :
- Un séjour de 20m² avec cuisine ouverte équipée
- Une chambre de 14m² avec dressing
- Une salle de bain moderne avec douche à l'italienne
- WC séparé

Rénovation complète en 2023 : électricité, plomberie, isolation.

Place de parking en sous-sol incluse.

Proche métro, commerces et Vieux-Port.`,
    photos: ['/images/apt2-1.jpg', '/images/apt2-2.jpg'],
    energyClass: 'C',
    energyValue: 165,
    gesClass: 'C',
    gesValue: 25,
    features: ['Rénové', 'Parking', 'Interphone', 'Cave'],
    charges: 120,
    taxeFonciere: 0,
    agent: {
      name: 'Jean Dupont',
      phone: '+33 6 23 45 67 89',
      email: 'jean.dupont@bienvuimmo.fr',
      photo: '/images/agent2.jpg'
    },
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
    address: '12 Quai des Chartrons',
    price: 385000,
    surface: 95,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    floor: 1,
    totalFloors: 2,
    buildYear: 1880,
    description: `Magnifique loft dans ancien chai bordelais.

Ce loft atypique de 95m² offre des volumes exceptionnels :
- Double hauteur sous plafond (5m)
- Verrière d'atelier
- Poutres apparentes
- Sol en béton ciré

Organisation :
- Grand espace de vie ouvert de 50m²
- Cuisine équipée style industriel
- 2 chambres en mezzanine
- Salle de bain contemporaine

Cave voûtée en sous-sol.

Quartier prisé des Chartrons, proche quais et tramway.`,
    photos: ['/images/loft1-1.jpg', '/images/loft1-2.jpg'],
    energyClass: 'D',
    energyValue: 245,
    gesClass: 'D',
    gesValue: 38,
    features: ['Loft', 'Parquet', 'Cave', 'Mezzanine', 'Verrière'],
    charges: 180,
    taxeFonciere: 1800,
    agent: {
      name: 'Marie Dubois',
      phone: '+33 6 34 56 78 90',
      email: 'marie.dubois@bienvuimmo.fr',
      photo: '/images/agent3.jpg'
    },
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
    address: '5 Place du Capitole',
    price: 520000,
    surface: 130,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    floor: 0,
    totalFloors: 3,
    buildYear: 1900,
    description: `Charmante maison de ville avec terrasse tropézienne.

Cette maison de caractère de 130m² offre :

Rez-de-chaussée :
- Entrée sur cour privative
- Séjour avec cheminée
- Cuisine aménagée

1er étage :
- 2 chambres
- Salle de bain

2ème étage :
- Suite parentale avec salle d'eau
- Accès terrasse tropézienne de 25m²

Rénovation soignée avec matériaux nobles : tomettes, parquet, escalier en pierre.

Emplacement privilégié en hyper-centre.`,
    photos: ['/images/maison2-1.jpg'],
    energyClass: 'B',
    energyValue: 88,
    gesClass: 'B',
    gesValue: 12,
    features: ['Terrasse', 'Cave', 'Climatisation', 'Cheminée', 'Cour'],
    charges: 0,
    taxeFonciere: 2200,
    agent: {
      name: 'Sophie Martin',
      phone: '+33 6 12 34 56 78',
      email: 'sophie.martin@bienvuimmo.fr',
      photo: '/images/agent1.jpg'
    },
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
    address: '10 Boulevard de l\'Île de Nantes',
    price: 1450,
    surface: 90,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    floor: 5,
    totalFloors: 7,
    buildYear: 2020,
    description: `Grand appartement familial dans résidence récente.

Cet appartement de 90m² au 5ème étage comprend :
- Séjour lumineux de 28m² avec accès balcon
- Cuisine équipée séparée
- 3 chambres (12m², 11m², 10m²)
- Salle de bain avec baignoire
- Salle d'eau avec douche
- WC séparé

Balcon de 8m² exposé sud-ouest.
Parking souterrain et cave inclus.

Résidence sécurisée avec gardien.
Proche tramway, commerces et écoles.`,
    photos: ['/images/apt3-1.jpg', '/images/apt3-2.jpg'],
    energyClass: 'B',
    energyValue: 75,
    gesClass: 'C',
    gesValue: 18,
    features: ['Balcon', 'Parking', 'Cave', 'Ascenseur', 'Gardien', 'Interphone'],
    charges: 180,
    taxeFonciere: 0,
    agent: {
      name: 'Jean Dupont',
      phone: '+33 6 23 45 67 89',
      email: 'jean.dupont@bienvuimmo.fr',
      photo: '/images/agent2.jpg'
    },
    createdAt: '2024-12-01'
  },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = parseInt(params.id as string);
  const property = properties.find(p => p.id === propertyId);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Annonce non trouvée</h1>
          <p className="text-gray-600 mb-6">Cette annonce n'existe pas ou a été supprimée.</p>
          <Link
            href="/annonces"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour aux annonces
          </Link>
        </div>
      </div>
    );
  }

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
            <Building2 className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900">bienvuimmo</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/annonces" className="text-amber-600 font-medium">
              Annonces
            </Link>
            <Link href="/fonctionnalites" className="text-gray-600 hover:text-amber-600 transition">
              Fonctionnalités
            </Link>
            <Link href="/tarifs" className="text-gray-600 hover:text-amber-600 transition">
              Tarifs
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-amber-600 transition">
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-amber-600">Accueil</Link>
          <span>/</span>
          <Link href="/annonces" className="hover:text-amber-600">Annonces</Link>
          <span>/</span>
          <span className="text-gray-900">{property.reference}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Photos and details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Building2 className="h-24 w-24" />
                </div>
                
                {/* Navigation buttons */}
                {property.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPhotoIndex(prev => prev === 0 ? property.photos.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setCurrentPhotoIndex(prev => prev === property.photos.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                {/* Photo counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                  {currentPhotoIndex + 1} / {property.photos.length}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Transaction badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    property.transactionType === 'Vente' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-purple-600 text-white'
                  }`}>
                    {property.transactionType}
                  </span>
                </div>
              </div>

              {/* Thumbnail row */}
              {property.photos.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {property.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                        idx === currentPhotoIndex ? 'border-amber-600' : 'border-transparent'
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Réf. {property.reference}</p>
                  <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                </div>
                <p className="text-3xl font-bold text-amber-600">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR',
                    maximumFractionDigits: 0 
                  }).format(property.price)}
                  {property.transactionType === 'Location' && (
                    <span className="text-lg font-normal text-gray-500">/mois</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="h-5 w-5" />
                <span>{property.address}, {property.city} ({property.postalCode})</span>
              </div>

              {/* Key info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="text-center">
                  <Square className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                  <p className="text-lg font-semibold text-gray-900">{property.surface} m²</p>
                  <p className="text-sm text-gray-500">Surface</p>
                </div>
                <div className="text-center">
                  <Building2 className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                  <p className="text-lg font-semibold text-gray-900">{property.rooms}</p>
                  <p className="text-sm text-gray-500">Pièces</p>
                </div>
                <div className="text-center">
                  <Bed className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                  <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
                  <p className="text-sm text-gray-500">Chambres</p>
                </div>
                <div className="text-center">
                  <Bath className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                  <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
                  <p className="text-sm text-gray-500">SdB</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {property.description}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Équipements</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm"
                    >
                      <Check className="h-4 w-4" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900">{property.type}</p>
                </div>
                {property.floor !== undefined && (
                  <div>
                    <p className="text-sm text-gray-500">Étage</p>
                    <p className="font-medium text-gray-900">{property.floor}/{property.totalFloors}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Année de construction</p>
                  <p className="font-medium text-gray-900">{property.buildYear}</p>
                </div>
                {property.charges > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Charges</p>
                    <p className="font-medium text-gray-900">{property.charges} €/mois</p>
                  </div>
                )}
                {property.taxeFonciere > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Taxe foncière</p>
                    <p className="font-medium text-gray-900">{property.taxeFonciere} €/an</p>
                  </div>
                )}
              </div>
            </div>

            {/* DPE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagnostic de performance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Energy */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium text-gray-900">Consommation énergétique</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 text-2xl font-bold text-white rounded-lg ${getEnergyClassColor(property.energyClass)}`}>
                      {property.energyClass}
                    </span>
                    <span className="text-gray-600">
                      {property.energyValue} kWh/m²/an
                    </span>
                  </div>
                </div>

                {/* GES */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Thermometer className="h-5 w-5 text-amber-500" />
                    <span className="font-medium text-gray-900">Émissions de GES</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 text-2xl font-bold text-white rounded-lg ${getEnergyClassColor(property.gesClass)}`}>
                      {property.gesClass}
                    </span>
                    <span className="text-gray-600">
                      {property.gesValue} kg CO₂/m²/an
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Contact */}
          <div className="space-y-6">
            {/* Agent card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacter l'agent</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {property.agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{property.agent.name}</p>
                  <p className="text-sm text-gray-500">Agent immobilier</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium"
                >
                  <Phone className="h-5 w-5" />
                  {property.agent.phone}
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center gap-3 w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  <Mail className="h-5 w-5" />
                  Envoyer un email
                </a>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="flex items-center gap-3 w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  <Calendar className="h-5 w-5" />
                  Demander une visite
                </button>
              </div>

              {/* Contact form */}
              {showContactForm && (
                <form className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                      placeholder="Je souhaite visiter ce bien..."
                      defaultValue={`Bonjour,\n\nJe suis intéressé(e) par le bien ${property.reference} "${property.title}".\n\nJe souhaiterais organiser une visite.\n\nCordialement`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium"
                  >
                    Envoyer ma demande
                  </button>
                </form>
              )}
            </div>

            {/* Back to list */}
            <Link
              href="/annonces"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour aux annonces
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-amber-400" />
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
