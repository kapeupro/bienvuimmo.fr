'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  Building2, MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail, 
  ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2, Send, X
} from 'lucide-react';
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
  floor?: number;
  totalFloors?: number;
  buildYear?: number;
  address?: string;
  city: string;
  postalCode: string;
  energyClass?: string;
  gesClass?: string;
  features?: string[];
  photos?: { id: string; url: string; title?: string }[];
  agencyName?: string;
  agencyPhone?: string;
  agencyEmail?: string;
  createdAt: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/annonces/${propertyId}`);
        if (!res.ok) {
          throw new Error('Annonce non trouvée');
        }
        const data = await res.json();
        setProperty(data.property);
        
        // Check if in favorites
        const saved = localStorage.getItem('bienvuimmo_favorites');
        if (saved) {
          const favorites = JSON.parse(saved);
          setIsFavorite(favorites.includes(propertyId));
        }
      } catch (err) {
        setError('Annonce non trouvée');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem('bienvuimmo_favorites');
    let favorites: string[] = saved ? JSON.parse(saved) : [];
    
    if (isFavorite) {
      favorites = favorites.filter(f => f !== propertyId);
    } else {
      favorites.push(propertyId);
    }
    
    localStorage.setItem('bienvuimmo_favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch('/api/annonces/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          ...contactForm
        })
      });

      if (res.ok) {
        setSent(true);
        setContactForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      console.error('Erreur envoi contact:', err);
    } finally {
      setSending(false);
    }
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
      'PARKING': 'Parking'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Annonce non trouvée</h1>
          <p className="text-gray-600 mb-6">Cette annonce n&apos;existe pas ou a été supprimée.</p>
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

  const photos = property.photos || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b mt-16">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/annonces" className="text-gray-500 hover:text-amber-600">Annonces</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">{property.reference}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] bg-gray-200">
                {photos.length > 0 ? (
                  <Image
                    src={photos[currentPhotoIndex]?.url || ''}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Building2 className="h-24 w-24" />
                  </div>
                )}
                
                {/* Navigation arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPhotoIndex(i => i === 0 ? photos.length - 1 : i - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentPhotoIndex(i => i === photos.length - 1 ? 0 : i + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white rounded-full text-sm">
                      {currentPhotoIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className="p-2 bg-white rounded-full shadow hover:shadow-md transition"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow hover:shadow-md transition">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {photos.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                        index === currentPhotoIndex ? 'ring-2 ring-amber-500' : ''
                      }`}
                    >
                      <Image
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        width={80}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.transactionType === 'SALE' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {property.transactionType === 'SALE' ? 'Vente' : 'Location'}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {getTypeLabel(property.type)}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                </div>
                <p className="text-2xl font-bold text-amber-600 whitespace-nowrap">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR',
                    maximumFractionDigits: 0 
                  }).format(property.price)}
                  {property.transactionType === 'RENT' && <span className="text-lg font-normal">/mois</span>}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{property.address}, {property.city} {property.postalCode}</span>
              </div>

              {/* Key features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                {property.surface && (
                  <div className="text-center">
                    <Square className="w-6 h-6 mx-auto text-amber-600 mb-1" />
                    <p className="font-semibold">{property.surface} m²</p>
                    <p className="text-sm text-gray-500">Surface</p>
                  </div>
                )}
                {property.rooms && (
                  <div className="text-center">
                    <Building2 className="w-6 h-6 mx-auto text-amber-600 mb-1" />
                    <p className="font-semibold">{property.rooms}</p>
                    <p className="text-sm text-gray-500">Pièces</p>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="text-center">
                    <Bed className="w-6 h-6 mx-auto text-amber-600 mb-1" />
                    <p className="font-semibold">{property.bedrooms}</p>
                    <p className="text-sm text-gray-500">Chambres</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <Bath className="w-6 h-6 mx-auto text-amber-600 mb-1" />
                    <p className="font-semibold">{property.bathrooms}</p>
                    <p className="text-sm text-gray-500">SdB</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {property.description || 'Aucune description disponible.'}
                </div>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Équipements</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm"
                      >
                        <Check className="w-4 h-4" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Energy */}
              {(property.energyClass || property.gesClass) && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Diagnostics</h2>
                  <div className="flex gap-4">
                    {property.energyClass && (
                      <div className="flex items-center gap-2">
                        <span className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded ${getEnergyClassColor(property.energyClass)}`}>
                          {property.energyClass}
                        </span>
                        <span className="text-sm text-gray-600">DPE</span>
                      </div>
                    )}
                    {property.gesClass && (
                      <div className="flex items-center gap-2">
                        <span className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded ${getEnergyClassColor(property.gesClass)}`}>
                          {property.gesClass}
                        </span>
                        <span className="text-sm text-gray-600">GES</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agency card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              
              {property.agencyName && (
                <div className="mb-4">
                  <p className="font-medium text-gray-900">{property.agencyName}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {property.agencyPhone && (
                  <a href={`tel:${property.agencyPhone}`} className="flex items-center gap-3 text-gray-600 hover:text-amber-600">
                    <Phone className="w-5 h-5" />
                    <span>{property.agencyPhone}</span>
                  </a>
                )}
                {property.agencyEmail && (
                  <a href={`mailto:${property.agencyEmail}`} className="flex items-center gap-3 text-gray-600 hover:text-amber-600">
                    <Mail className="w-5 h-5" />
                    <span>{property.agencyEmail}</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setShowContactForm(true)}
                className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition"
              >
                Contacter l&apos;agence
              </button>
            </div>

            {/* Reference */}
            <div className="bg-gray-100 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">Référence</p>
              <p className="font-mono font-semibold text-gray-900">{property.reference}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact form modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Contacter l&apos;agence</h2>
              <button onClick={() => setShowContactForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <Check className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Message envoyé !</h3>
                <p className="text-gray-600 mb-4">L&apos;agence vous recontactera dans les plus brefs délais.</p>
                <button
                  onClick={() => { setShowContactForm(false); setSent(false); }}
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder={`Bonjour, je suis intéressé(e) par le bien ${property.reference}...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
