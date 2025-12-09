'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Building2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function InscriptionPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    // Étape 1 - Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Étape 2 - Informations agence
    agencyName: '',
    agencyAddress: '',
    agencyCity: '',
    agencyPostalCode: '',
    siret: '',
    carteT: '',
    // Étape 3 - Plan
    plan: 'starter',
    acceptTerms: false,
    acceptNewsletter: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.agencyName.trim()) newErrors.agencyName = 'Le nom de l\'agence est requis';
    if (!formData.agencyAddress.trim()) newErrors.agencyAddress = 'L\'adresse est requise';
    if (!formData.agencyCity.trim()) newErrors.agencyCity = 'La ville est requise';
    if (!formData.agencyPostalCode.trim()) newErrors.agencyPostalCode = 'Le code postal est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Afficher un loading si on vérifie l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        agencyName: formData.agencyName,
        agencyAddress: formData.agencyAddress,
        agencyCity: formData.agencyCity,
        agencyPostalCode: formData.agencyPostalCode,
        siret: formData.siret,
        carteT: formData.carteT,
        plan: formData.plan,
      });
      
      setSuccess('Compte créé avec succès ! Redirection...');
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '29€',
      period: '/mois',
      description: 'Parfait pour démarrer',
      features: ['50 biens', '2 utilisateurs', 'Support email'],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '79€',
      period: '/mois',
      description: 'Pour les agences en croissance',
      features: ['200 biens', '10 utilisateurs', 'Support prioritaire', 'API accès'],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '199€',
      period: '/mois',
      description: 'Pour les grandes agences',
      features: ['Biens illimités', 'Utilisateurs illimités', 'Support dédié', 'Formation incluse'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                BienVu<span className="text-amber-600">Immo</span>
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-600">Déjà inscrit ?</span>
              <Link 
                href="/connexion"
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                  ${step >= s 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' 
                    : 'bg-stone-200 text-stone-500'}
                `}>
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-24 h-1 mx-2 rounded ${step > s ? 'bg-amber-500' : 'bg-stone-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex gap-16 text-sm">
              <span className={step >= 1 ? 'text-amber-600 font-medium' : 'text-stone-500'}>
                Vos informations
              </span>
              <span className={step >= 2 ? 'text-amber-600 font-medium' : 'text-stone-500'}>
                Votre agence
              </span>
              <span className={step >= 3 ? 'text-amber-600 font-medium' : 'text-stone-500'}>
                Votre plan
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-600">{errors.submit}</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-600">{success}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">
                  Créez votre compte
                </h2>
                <p className="text-stone-600 mb-8">
                  Commencez par renseigner vos informations personnelles
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.firstName ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="Jean"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Nom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.lastName ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="Dupont"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email professionnel *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="jean.dupont@agence.fr"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.password ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirmer mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.confirmPassword ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Password strength indicator */}
                <div className="mt-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          formData.password.length >= level * 3
                            ? formData.password.length >= 12
                              ? 'bg-green-500'
                              : formData.password.length >= 8
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            : 'bg-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Minimum 8 caractères, incluez des chiffres et caractères spéciaux
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Agency Information */}
            {step === 2 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">
                  Votre agence
                </h2>
                <p className="text-stone-600 mb-8">
                  Renseignez les informations de votre agence immobilière
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom agence */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Nom de l&apos;agence *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.agencyName ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="Immobilier Parisien"
                      />
                    </div>
                    {errors.agencyName && (
                      <p className="mt-1 text-sm text-red-500">{errors.agencyName}</p>
                    )}
                  </div>

                  {/* Adresse */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Adresse *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                      <input
                        type="text"
                        name="agencyAddress"
                        value={formData.agencyAddress}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                          errors.agencyAddress ? 'border-red-500' : 'border-stone-300'
                        }`}
                        placeholder="123 Avenue des Champs-Élysées"
                      />
                    </div>
                    {errors.agencyAddress && (
                      <p className="mt-1 text-sm text-red-500">{errors.agencyAddress}</p>
                    )}
                  </div>

                  {/* Code postal */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      name="agencyPostalCode"
                      value={formData.agencyPostalCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                        errors.agencyPostalCode ? 'border-red-500' : 'border-stone-300'
                      }`}
                      placeholder="75008"
                    />
                    {errors.agencyPostalCode && (
                      <p className="mt-1 text-sm text-red-500">{errors.agencyPostalCode}</p>
                    )}
                  </div>

                  {/* Ville */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="agencyCity"
                      value={formData.agencyCity}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                        errors.agencyCity ? 'border-red-500' : 'border-stone-300'
                      }`}
                      placeholder="Paris"
                    />
                    {errors.agencyCity && (
                      <p className="mt-1 text-sm text-red-500">{errors.agencyCity}</p>
                    )}
                  </div>

                  {/* SIRET */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Numéro SIRET
                    </label>
                    <input
                      type="text"
                      name="siret"
                      value={formData.siret}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="123 456 789 00012"
                    />
                  </div>

                  {/* Carte T */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Numéro Carte T
                    </label>
                    <input
                      type="text"
                      name="carteT"
                      value={formData.carteT}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="CPI 7501 2023 000 123 456"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {step === 3 && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">
                  Choisissez votre plan
                </h2>
                <p className="text-stone-600 mb-8">
                  Sélectionnez l&apos;offre qui correspond le mieux à vos besoins
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.plan === plan.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Populaire
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-stone-900">{plan.name}</h3>
                        <p className="text-sm text-stone-500">{plan.description}</p>
                      </div>
                      
                      <div className="text-center mb-4">
                        <span className="text-3xl font-bold text-stone-900">{plan.price}</span>
                        <span className="text-stone-500">{plan.period}</span>
                      </div>
                      
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-stone-600">
                            <Check className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {formData.plan === plan.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Terms */}
                <div className="space-y-4 border-t border-stone-200 pt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-stone-600">
                      J&apos;accepte les{' '}
                      <Link href="/conditions" className="text-amber-600 hover:underline">
                        conditions générales d&apos;utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link href="/confidentialite" className="text-amber-600 hover:underline">
                        politique de confidentialité
                      </Link>{' '}
                      *
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-500 ml-7">{errors.acceptTerms}</p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptNewsletter"
                      checked={formData.acceptNewsletter}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-stone-600">
                      Je souhaite recevoir les actualités et conseils de BienVuImmo
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="px-8 py-6 bg-stone-50 border-t border-stone-200 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 text-stone-600 hover:text-stone-900 font-medium transition-colors"
                >
                  Retour
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  Continuer
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-200">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900">Données sécurisées</h4>
              <p className="text-sm text-stone-500">Chiffrement SSL 256-bit</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-200">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900">Activation immédiate</h4>
              <p className="text-sm text-stone-500">Commencez en 2 minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-stone-200">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-stone-900">+1 500 agences</h4>
              <p className="text-sm text-stone-500">Nous font confiance</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-stone-500">
          <p>Créé avec <span className="text-red-500">❤</span> par <span className="text-amber-600 font-medium">Dimitri Sarrazin</span></p>
        </div>
      </div>
    </div>
  );
}
