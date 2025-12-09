'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Building2, Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-title', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.contact-form', {
        opacity: 0,
        x: -50,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.contact-info', {
        opacity: 0,
        x: 50,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.info-card', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.5,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 pt-32 text-center">
        <div className="contact-title max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600">
            Une question ? Besoin d'une démo personnalisée ? Notre équipe est là pour vous accompagner.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulaire */}
          <div ref={formRef} className="contact-form bg-white rounded-2xl p-8 shadow-lg border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="jean.dupont@agence.fr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sujet</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition">
                  <option>Demande de démo</option>
                  <option>Question sur les tarifs</option>
                  <option>Support technique</option>
                  <option>Partenariat</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
                  placeholder="Décrivez votre demande..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-lg font-medium flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Send className="h-5 w-5" />
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Infos de contact */}
          <div ref={infoRef} className="contact-info space-y-6">
            <div className="info-card bg-white rounded-xl p-6 shadow-sm border flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Mail className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">contact@bienvuimmo.fr</p>
                <p className="text-gray-600">support@bienvuimmo.fr</p>
              </div>
            </div>

            <div className="info-card bg-white rounded-xl p-6 shadow-sm border flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                <p className="text-gray-600">01 23 45 67 89</p>
                <p className="text-sm text-gray-500">Du lundi au vendredi, 9h-18h</p>
              </div>
            </div>

            <div className="info-card bg-white rounded-xl p-6 shadow-sm border flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                <p className="text-gray-600">123 Avenue de l'Innovation</p>
                <p className="text-gray-600">75008 Paris, France</p>
              </div>
            </div>

            <div className="info-card bg-white rounded-xl p-6 shadow-sm border flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>
                <p className="text-gray-600">Lundi - Vendredi : 9h - 18h</p>
                <p className="text-gray-600">Weekend : Fermé</p>
              </div>
            </div>

            <div className="info-card bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-6 w-6" />
                <h3 className="font-semibold text-lg">Chat en direct</h3>
              </div>
              <p className="text-amber-100 mb-4">
                Besoin d'une réponse rapide ? Discutez avec notre équipe en temps réel.
              </p>
              <button className="px-6 py-3 bg-white text-amber-600 rounded-lg hover:bg-gray-100 transition font-medium">
                Démarrer le chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
