'use client';

import { useState } from 'react';

export default function MandatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données d'exemple
  const mandates = [
    {
      id: 1,
      reference: 'MAN-2024-001',
      type: 'Vente',
      property: 'Appartement T3 - Paris',
      propertyRef: 'BV001',
      contact: 'Jean Dupont',
      startDate: '2024-11-01',
      endDate: '2025-02-01',
      exclusivity: true,
      commission: 5.5,
      commissionAmount: 24750,
      status: 'Actif',
      signedAt: '2024-10-28',
      propertyValue: 450000
    },
    {
      id: 2,
      reference: 'MAN-2024-002',
      type: 'Vente',
      property: 'Maison 5 pièces - Lyon',
      propertyRef: 'BV002',
      contact: 'Marie Martin',
      startDate: '2024-11-15',
      endDate: '2025-05-15',
      exclusivity: true,
      commission: 5,
      commissionAmount: 31000,
      status: 'Actif',
      signedAt: '2024-11-12',
      propertyValue: 620000
    },
    {
      id: 3,
      reference: 'MAN-2024-003',
      type: 'Location',
      property: 'Studio meublé - Paris',
      propertyRef: 'BV003',
      contact: 'Pierre Dubois',
      startDate: '2024-12-01',
      endDate: '2025-12-01',
      exclusivity: false,
      commission: 8.33,
      commissionAmount: 100,
      status: 'Actif',
      signedAt: '2024-11-28',
      propertyValue: 1200
    },
    {
      id: 4,
      reference: 'MAN-2024-004',
      type: 'Vente',
      property: 'Villa moderne - Nice',
      propertyRef: 'BV004',
      contact: 'Sophie Bernard',
      startDate: '2024-10-01',
      endDate: '2025-04-01',
      exclusivity: true,
      commission: 4.5,
      commissionAmount: 56250,
      status: 'Expiré',
      signedAt: '2024-09-28',
      propertyValue: 1250000
    },
    {
      id: 5,
      reference: 'MAN-2024-005',
      type: 'Vente',
      property: 'Loft industriel - Bordeaux',
      propertyRef: 'BV006',
      contact: 'Thomas Petit',
      startDate: '2024-11-20',
      endDate: '2025-05-20',
      exclusivity: true,
      commission: 5.5,
      commissionAmount: 21175,
      status: 'Terminé',
      signedAt: '2024-11-18',
      propertyValue: 385000
    }
  ];

  const filteredMandates = mandates.filter(mandate => {
    const matchesSearch = 
      mandate.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandate.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandate.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mandate.propertyRef.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || mandate.type === filterType;
    const matchesStatus = filterStatus === 'all' || mandate.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-green-100 text-green-700';
      case 'Terminé':
        return 'bg-blue-100 text-blue-700';
      case 'Expiré':
        return 'bg-red-100 text-red-700';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des mandats</h1>
          <p className="mt-2 text-gray-600">Gérez vos mandats de vente et location</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Créer un mandat
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
                placeholder="Référence, bien, contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="Vente">Vente</option>
              <option value="Location">Location</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Terminé">Terminé</option>
              <option value="Expiré">Expiré</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mandates.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {mandates.filter(m => m.status === 'Actif').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Terminés</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {mandates.filter(m => m.status === 'Terminé').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Commission totale</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'EUR',
              maximumFractionDigits: 0 
            }).format(mandates.reduce((acc, m) => acc + m.commissionAmount, 0))}
          </p>
        </div>
      </div>

      {/* Mandates list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mandat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMandates.map((mandate) => {
                const daysRemaining = getDaysRemaining(mandate.endDate);
                return (
                  <tr key={mandate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{mandate.reference}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {mandate.exclusivity && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                              Exclusif
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            Signé le {new Date(mandate.signedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{mandate.property}</div>
                        <div className="text-sm text-gray-500">Réf: {mandate.propertyRef}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mandate.contact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mandate.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(mandate.startDate).toLocaleDateString('fr-FR')} →
                        </div>
                        <div className="text-sm text-gray-900">
                          {new Date(mandate.endDate).toLocaleDateString('fr-FR')}
                        </div>
                        {mandate.status === 'Actif' && (
                          <div className={`text-xs mt-1 ${daysRemaining < 30 ? 'text-orange-600' : 'text-gray-500'}`}>
                            {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Expiré'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: 'EUR',
                            maximumFractionDigits: 0 
                          }).format(mandate.commissionAmount)}
                        </div>
                        <div className="text-xs text-gray-500">{mandate.commission}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mandate.status)}`}>
                        {mandate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir le PDF"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          title="Télécharger"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMandates.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun mandat trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}
