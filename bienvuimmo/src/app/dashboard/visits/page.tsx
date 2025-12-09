'use client';

import { useState } from 'react';

export default function VisitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Données d'exemple
  const visits = [
    {
      id: 1,
      property: 'Appartement T3 - Paris',
      propertyRef: 'BV001',
      address: '15 rue de Rivoli, 75001 Paris',
      contact: 'Jean Dupont',
      contactPhone: '+33 6 12 34 56 78',
      date: '2024-12-10',
      time: '14:00',
      duration: 60,
      status: 'Confirmée',
      agent: 'Sophie Martin',
      notes: 'Client très intéressé, première visite'
    },
    {
      id: 2,
      property: 'Maison 5 pièces - Lyon',
      propertyRef: 'BV002',
      address: '8 avenue Jean Jaurès, 69002 Lyon',
      contact: 'Marie Martin',
      contactPhone: '+33 6 23 45 67 89',
      date: '2024-12-10',
      time: '16:30',
      duration: 90,
      status: 'En attente',
      agent: 'Jean Dupont',
      notes: 'Confirmer 24h avant'
    },
    {
      id: 3,
      property: 'Studio meublé - Paris',
      propertyRef: 'BV003',
      address: '22 rue Mouffetard, 75005 Paris',
      contact: 'Pierre Dubois',
      contactPhone: '+33 6 34 56 78 90',
      date: '2024-12-11',
      time: '10:00',
      duration: 45,
      status: 'Confirmée',
      agent: 'Marie Dubois',
      notes: ''
    },
    {
      id: 4,
      property: 'Villa moderne - Nice',
      propertyRef: 'BV004',
      address: '45 promenade des Anglais, 06000 Nice',
      contact: 'Sophie Bernard',
      contactPhone: '+33 6 45 67 89 01',
      date: '2024-12-11',
      time: '15:00',
      duration: 120,
      status: 'Confirmée',
      agent: 'Sophie Martin',
      notes: 'Visite complète avec jardin et piscine'
    },
    {
      id: 5,
      property: 'Appartement T3 - Paris',
      propertyRef: 'BV001',
      address: '15 rue de Rivoli, 75001 Paris',
      contact: 'Thomas Petit',
      contactPhone: '+33 6 56 78 90 12',
      date: '2024-12-12',
      time: '11:00',
      duration: 60,
      status: 'En attente',
      agent: 'Sophie Martin',
      notes: 'Deuxième visite demandée'
    },
    {
      id: 6,
      property: 'Loft industriel - Bordeaux',
      propertyRef: 'BV006',
      address: '12 quai des Chartrons, 33000 Bordeaux',
      contact: 'Isabelle Rousseau',
      contactPhone: '+33 6 67 89 01 23',
      date: '2024-12-09',
      time: '14:00',
      duration: 60,
      status: 'Terminée',
      agent: 'Marie Dubois',
      notes: 'Client intéressé, fait une offre'
    },
    {
      id: 7,
      property: 'Maison 5 pièces - Lyon',
      propertyRef: 'BV002',
      address: '8 avenue Jean Jaurès, 69002 Lyon',
      contact: 'Lucas Martin',
      contactPhone: '+33 6 78 90 12 34',
      date: '2024-12-08',
      time: '10:00',
      duration: 90,
      status: 'Annulée',
      agent: 'Jean Dupont',
      notes: 'Client a annulé la veille'
    }
  ];

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = 
      visit.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.propertyRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || visit.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmée':
        return 'bg-green-100 text-green-700';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-700';
      case 'Terminée':
        return 'bg-amber-100 text-amber-700';
      case 'Annulée':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmée':
        return '✓';
      case 'En attente':
        return '⏳';
      case 'Terminée':
        return '✔';
      case 'Annulée':
        return '✗';
      default:
        return '•';
    }
  };

  // Grouper les visites par date
  const groupedVisits = filteredVisits.reduce((acc, visit) => {
    const date = visit.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(visit);
    return acc;
  }, {} as Record<string, typeof visits>);

  const sortedDates = Object.keys(groupedVisits).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des visites</h1>
          <p className="mt-2 text-gray-600">Planifiez et suivez vos rendez-vous</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendrier
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Planifier une visite
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Bien, contact, adresse..."
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
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="Confirmée">Confirmée</option>
              <option value="En attente">En attente</option>
              <option value="Terminée">Terminée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{visits.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Confirmées</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {visits.filter(v => v.status === 'Confirmée').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {visits.filter(v => v.status === 'En attente').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Aujourd'hui</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {visits.filter(v => v.date === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
      </div>

      {/* Visits by date */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {groupedVisits[date].length} visite{groupedVisits[date].length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {groupedVisits[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((visit) => (
                    <div key={visit.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Time */}
                        <div className="flex-shrink-0 w-20">
                          <div className="text-lg font-semibold text-gray-900">{visit.time}</div>
                          <div className="text-xs text-gray-500">{visit.duration} min</div>
                        </div>

                        {/* Status indicator */}
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-3 h-3 rounded-full ${
                            visit.status === 'Confirmée' ? 'bg-green-500' :
                            visit.status === 'En attente' ? 'bg-yellow-500' :
                            visit.status === 'Terminée' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`} />
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{visit.property}</h3>
                              <p className="text-sm text-gray-500 mt-1">Réf: {visit.propertyRef}</p>
                              <p className="text-sm text-gray-600 mt-1">{visit.address}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                              <span className="mr-1">{getStatusIcon(visit.status)}</span>
                              {visit.status}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{visit.contact}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{visit.contactPhone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>Agent: {visit.agent}</span>
                            </div>
                          </div>

                          {visit.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Note:</span> {visit.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {visit.status === 'En attente' && (
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Confirmer">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {visit.status !== 'Annulée' && visit.status !== 'Terminée' && (
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Annuler">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Vue calendrier</h3>
          <p className="mt-2 text-gray-500">Cette fonctionnalité sera bientôt disponible</p>
        </div>
      )}

      {filteredVisits.length === 0 && viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune visite trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        </div>
      )}
    </div>
  );
}
