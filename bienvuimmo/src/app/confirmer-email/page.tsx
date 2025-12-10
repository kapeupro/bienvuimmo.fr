'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await fetch(`/api/auth/confirm-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Votre email a été confirmé avec succès !');
        } else {
          setStatus('error');
          setMessage(data.error || 'Une erreur est survenue');
        }
      } catch {
        setStatus('error');
        setMessage('Impossible de contacter le serveur');
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">Confirmation d&apos;email</h1>
          </div>

          {/* Loading */}
          {status === 'loading' && (
            <div className="py-8">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
              <p className="text-stone-600">Vérification en cours...</p>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <div className="py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-green-700 mb-2">Email confirmé !</h2>
              <p className="text-stone-600 mb-8">{message}</p>
              <Link 
                href="/connexion" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-700 mb-2">Erreur</h2>
              <p className="text-stone-600 mb-8">{message}</p>
              <div className="space-y-3">
                <Link 
                  href="/connexion" 
                  className="block w-full px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold transition-all"
                >
                  Retour à la connexion
                </Link>
                <button 
                  onClick={() => window.location.reload()}
                  className="block w-full px-6 py-3 text-amber-600 hover:text-amber-700 font-semibold transition-all"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* No token */}
          {status === 'no-token' && (
            <div className="py-8">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-stone-700 mb-2">Lien invalide</h2>
              <p className="text-stone-600 mb-8">
                Ce lien de confirmation n&apos;est pas valide. Veuillez utiliser le lien reçu par email.
              </p>
              <Link 
                href="/connexion" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                Retour à la connexion
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-stone-500 text-sm mt-6">
          Besoin d&apos;aide ?{' '}
          <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
            Contactez-nous
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
}
