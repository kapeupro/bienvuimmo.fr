'use client';

import { useState } from 'react';

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données d'exemple
  const contacts = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      type: 'Acheteur',
      status: 'Actif',
      city: 'Paris',
      budget: 500000,
      interests: ['Appartement', 'Paris'],
      lastContact: '2024-12-08',
      createdAt: '2024-11-15'
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@email.com',
      phone: '+33 6 23 45 67 89',
      type: 'Vendeur',
      status: 'Actif',
      city: 'Lyon',
      propertyValue: 620000,
      interests: ['Maison', 'Lyon'],
      lastContact: '2024-12-07',
      createdAt: '2024-11-20'
    },
    {
      id: 3,
      firstName: 'Pierre',
      lastName: 'Dubois',
      email: 'pierre.dubois@email.com',
      phone: '+33 6 34 56 78 90',
      type: 'Locataire',
      status: 'Actif',
      city: 'Marseille',
      budget: 1200,
      interests: ['Appartement', 'Marseille'],
      lastContact: '2024-12-09',
      createdAt: '2024-12-01'
    },
    {
      id: 4,
      firstName: 'Sophie',
      lastName: 'Bernard',
      email: 'sophie.bernard@email.com',
      phone: '+33 6 45 67 89 01',
      type: 'Acheteur',
      status: 'Prospect',
      city: 'Nice',
      budget: 850000,
      interests: ['Villa', 'Nice'],
      lastContact: '2024-12-05',
      createdAt: '2024-11-28'
    },
    {
      id: 5,
      firstName: 'Thomas',
      lastName: 'Petit',
      email: 'thomas.petit@email.com',
      phone: '+33 6 56 78 90 12',
      type: 'Vendeur',
      status: 'Converti',
      city: 'Bordeaux',
      propertyValue: 385000,
      interests: ['Loft', 'Bordeaux'],
      lastContact: '2024-12-06',
      createdAt: '2024-10-15'
    },
    {
      id: 6,
      firstName: 'Isabelle',
      lastName: 'Rousseau',
      email: 'isabelle.rousseau@email.com',
      phone: '+33 6 67 89 01 23',
      type: 'Locataire',
      status: 'Inactif',
      city: 'Paris',
      budget: 1500,
      interests: ['Appartement', 'Paris'],
      lastContact: '2024-11-15',
      createdAt: '2024-09-10'
    }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    
    const matchesType = filterType === 'all' || contact.type === filterType;
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-700';
      case 'Prospect':
        return 'bg-amber-100 text-amber-700';
      case 'Converti':
        return 'bg-purple-100 text-purple-700';
      case 'Inactif':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Acheteur':
        return '🛒';
      case 'Vendeur':
        return '🏷️';
      case 'Locataire':
        return '🔑';
      default:
        return '👤';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des contacts</h1>
          <p className="mt-2 text-gray-600">Gérez votre base de contacts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau contact
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="Acheteur">Acheteur</option>
              <option value="Vendeur">Vendeur</option>
              <option value="Locataire">Locataire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Prospect">Prospect</option>
              <option value="Converti">Converti</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {contacts.filter(c => c.status === 'Actif').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Prospects</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {contacts.filter(c => c.status === 'Prospect').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Résultats</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{filteredContacts.length}</p>
        </div>
      </div>

      {/* Contacts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {contact.firstName[0]}{contact.lastName[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-lg">{getTypeIcon(contact.type)}</span>
                    <span className="text-sm text-gray-500">{contact.type}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                {contact.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {contact.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {contact.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {contact.city}
              </div>
            </div>

            {/* Budget/Value */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">
                {contact.type === 'Vendeur' ? 'Valeur du bien' : 'Budget'}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR',
                  maximumFractionDigits: 0 
                }).format(contact.budget || contact.propertyValue || 0)}
              </p>
            </div>

            {/* Interests */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Intérêts</p>
              <div className="flex flex-wrap gap-1">
                {contact.interests.map((interest, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-amber-50 text-amber-700 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Last contact */}
            <div className="text-xs text-gray-500 mb-4">
              Dernier contact : {new Date(contact.lastContact).toLocaleDateString('fr-FR')}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-sm text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                Contacter
              </button>
              <button className="flex-1 px-3 py-2 text-sm text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                Voir détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun contact trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        </div>
      )}
    </div>
  );
}
