'use client';

import { useState, useEffect } from 'react';

interface Visit {
  id: number;
  propertyId: number;
  contactId: number;
  property: {
    id: number;
    title: string;
    reference: string;
    address: string;
  } | null;
  contact: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
  scheduledAt: string;
  duration: number;
  status: string;
  notes: string;
  feedback: string | null;
  createdAt: string;
}

interface Property {
  id: number;
  title: string;
  reference: string;
}

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
}

export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showModal, setShowModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    propertyId: '',
    contactId: '',
    date: '',
    time: '',
    duration: '60',
    status: 'En attente',
    notes: ''
  });

  // Fetch data
  useEffect(() => {
    fetchVisits();
    fetchProperties();
    fetchContacts();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/visits', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des visites');
      }
      
      const data = await response.json();
      setVisits(data.visits || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (err) {
      console.error('Erreur chargement propriétés:', err);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error('Erreur chargement contacts:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const url = editingVisit 
        ? `/api/visits/${editingVisit.id}` 
        : '/api/visits';
      
      const method = editingVisit ? 'PUT' : 'POST';
      
      // Combine date and time into scheduledAt
      const scheduledAt = `${formData.date}T${formData.time}:00`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          propertyId: parseInt(formData.propertyId),
          contactId: parseInt(formData.contactId),
          scheduledAt,
          duration: parseInt(formData.duration),
          status: formData.status,
          notes: formData.notes
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }
      
      await fetchVisits();
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/visits/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }
      
      await fetchVisits();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette visite ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/visits/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }
      
      await fetchVisits();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const openCreateModal = () => {
    setEditingVisit(null);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData({
      propertyId: properties[0]?.id?.toString() || '',
      contactId: contacts[0]?.id?.toString() || '',
      date: tomorrow.toISOString().split('T')[0],
      time: '14:00',
      duration: '60',
      status: 'En attente',
      notes: ''
    });
    setShowModal(true);
  };

  const openEditModal = (visit: Visit) => {
    setEditingVisit(visit);
    const scheduledDate = new Date(visit.scheduledAt);
    
    setFormData({
      propertyId: visit.propertyId?.toString() || '',
      contactId: visit.contactId?.toString() || '',
      date: scheduledDate.toISOString().split('T')[0],
      time: scheduledDate.toTimeString().slice(0, 5),
      duration: visit.duration?.toString() || '60',
      status: visit.status,
      notes: visit.notes || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVisit(null);
  };

  const filteredVisits = visits.filter(visit => {
    const propertyTitle = visit.property?.title || '';
    const propertyRef = visit.property?.reference || '';
    const contactName = visit.contact ? `${visit.contact.firstName} ${visit.contact.lastName}` : '';
    const address = visit.property?.address || '';
    
    const matchesSearch = 
      propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propertyRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    const date = new Date(visit.scheduledAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(visit);
    return acc;
  }, {} as Record<string, typeof visits>);

  const sortedDates = Object.keys(groupedVisits).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchVisits}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

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
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
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
            {visits.filter(v => new Date(v.scheduledAt).toDateString() === new Date().toDateString()).length}
          </p>
        </div>
      </div>

      {/* Visits by date */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {sortedDates.length > 0 ? (
            sortedDates.map(date => (
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
                    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                    .map((visit) => (
                      <div key={visit.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Time */}
                          <div className="flex-shrink-0 w-20">
                            <div className="text-lg font-semibold text-gray-900">
                              {new Date(visit.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
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
                                <h3 className="font-semibold text-gray-900">
                                  {visit.property?.title || 'Propriété non définie'}
                                </h3>
                                {visit.property?.reference && (
                                  <p className="text-sm text-gray-500 mt-1">Réf: {visit.property.reference}</p>
                                )}
                                {visit.property?.address && (
                                  <p className="text-sm text-gray-600 mt-1">{visit.property.address}</p>
                                )}
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(visit.status)}`}>
                                <span className="mr-1">{getStatusIcon(visit.status)}</span>
                                {visit.status}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                              {visit.contact && (
                                <>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{visit.contact.firstName} {visit.contact.lastName}</span>
                                  </div>
                                  {visit.contact.phone && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      <span>{visit.contact.phone}</span>
                                    </div>
                                  )}
                                </>
                              )}
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
                              <button 
                                onClick={() => handleStatusChange(visit.id, 'Confirmée')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                                title="Confirmer"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            {visit.status === 'Confirmée' && (
                              <button 
                                onClick={() => handleStatusChange(visit.id, 'Terminée')}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                                title="Marquer comme terminée"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                            <button 
                              onClick={() => openEditModal(visit)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {visit.status !== 'Annulée' && visit.status !== 'Terminée' && (
                              <button 
                                onClick={() => handleStatusChange(visit.id, 'Annulée')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                title="Annuler"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(visit.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune visite trouvée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {visits.length === 0 
                    ? 'Commencez par planifier votre première visite'
                    : 'Essayez de modifier vos critères de recherche'}
                </p>
                {visits.length === 0 && (
                  <button
                    onClick={openCreateModal}
                    className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Planifier une visite
                  </button>
                )}
              </div>
            </div>
          )}
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

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingVisit ? 'Modifier la visite' : 'Planifier une visite'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propriété *
                </label>
                <select
                  required
                  value={formData.propertyId}
                  onChange={(e) => setFormData({...formData, propertyId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une propriété</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.reference} - {property.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact *
                </label>
                <select
                  required
                  value={formData.contactId}
                  onChange={(e) => setFormData({...formData, contactId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un contact</option>
                  {contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée (minutes)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 heure</option>
                    <option value="90">1h30</option>
                    <option value="120">2 heures</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  placeholder="Informations complémentaires..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : (editingVisit ? 'Mettre à jour' : 'Planifier')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
