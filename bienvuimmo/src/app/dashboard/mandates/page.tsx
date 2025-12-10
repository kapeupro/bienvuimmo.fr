'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Download, Edit, Trash2, Search, X, Calendar, Building2, User, Loader2, AlertCircle } from 'lucide-react';

interface Mandate {
  id: string;
  reference: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string | null;
  commission: number | null;
  exclusivity: boolean;
  propertyId: string;
  propertyTitle: string;
  propertyReference: string;
  ownerId: string | null;
  ownerFirstName: string | null;
  ownerLastName: string | null;
  createdAt: string;
}

interface Property {
  id: string;
  title: string;
  reference: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
}

export default function MandatesPage() {
  const [mandates, setMandates] = useState<Mandate[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMandate, setEditingMandate] = useState<Mandate | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    propertyId: '',
    ownerId: '',
    type: 'SALE',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    commission: '',
    exclusivity: true,
  });

  const fetchMandates = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterType !== 'all') params.append('type', filterType);

      const response = await fetch(`/api/mandates?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Erreur lors du chargement');
      
      const data = await response.json();
      setMandates(data.mandates || []);
    } catch (err) {
      setError('Impossible de charger les mandats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterType]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties?limit=100', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts?type=SELLER&limit=100', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  useEffect(() => {
    fetchMandates();
    fetchProperties();
    fetchContacts();
  }, [fetchMandates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = editingMandate 
        ? `/api/mandates/${editingMandate.id}`
        : '/api/mandates';
      
      const response = await fetch(url, {
        method: editingMandate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          commission: formData.commission ? parseFloat(formData.commission) : null,
          ownerId: formData.ownerId || null,
          endDate: formData.endDate || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setShowModal(false);
      setEditingMandate(null);
      resetForm();
      fetchMandates();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (mandate: Mandate) => {
    setEditingMandate(mandate);
    setFormData({
      propertyId: mandate.propertyId,
      ownerId: mandate.ownerId || '',
      type: mandate.type,
      startDate: mandate.startDate?.split('T')[0] || '',
      endDate: mandate.endDate?.split('T')[0] || '',
      commission: mandate.commission?.toString() || '',
      exclusivity: mandate.exclusivity,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce mandat ?')) return;

    try {
      const response = await fetch(`/api/mandates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      fetchMandates();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: '',
      ownerId: '',
      type: 'SALE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      commission: '',
      exclusivity: true,
    });
  };

  const openNewModal = () => {
    setEditingMandate(null);
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'COMPLETED':
        return 'bg-amber-100 text-amber-700';
      case 'EXPIRED':
        return 'bg-red-100 text-red-700';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'COMPLETED': return 'Terminé';
      case 'EXPIRED': return 'Expiré';
      case 'CANCELLED': return 'Annulé';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'SALE': return 'Vente';
      case 'RENTAL': return 'Location';
      case 'MANAGEMENT': return 'Gestion';
      default: return type;
    }
  };

  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredMandates = mandates.filter(mandate => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      mandate.reference?.toLowerCase().includes(search) ||
      mandate.propertyTitle?.toLowerCase().includes(search) ||
      mandate.propertyReference?.toLowerCase().includes(search) ||
      `${mandate.ownerFirstName} ${mandate.ownerLastName}`.toLowerCase().includes(search)
    );
  });

  // Stats
  const stats = {
    total: mandates.length,
    active: mandates.filter(m => m.status === 'ACTIVE').length,
    completed: mandates.filter(m => m.status === 'COMPLETED').length,
    exclusive: mandates.filter(m => m.status === 'ACTIVE' && m.exclusivity).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des mandats</h1>
          <p className="mt-2 text-gray-600">Gérez vos mandats de vente et location</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Créer un mandat
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>
      )}

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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              <option value="SALE">Vente</option>
              <option value="RENTAL">Location</option>
              <option value="MANAGEMENT">Gestion</option>
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
              <option value="ACTIVE">Actif</option>
              <option value="COMPLETED">Terminé</option>
              <option value="EXPIRED">Expiré</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Terminés</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Exclusifs actifs</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.exclusive}</p>
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
                  Propriétaire
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{mandate.propertyTitle || 'Non défini'}</div>
                          <div className="text-sm text-gray-500">Réf: {mandate.propertyReference}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {mandate.ownerFirstName ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {mandate.ownerFirstName} {mandate.ownerLastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Non défini</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getTypeLabel(mandate.type)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-900">
                            {new Date(mandate.startDate).toLocaleDateString('fr-FR')}
                          </div>
                          {mandate.endDate && (
                            <>
                              <div className="text-sm text-gray-500">
                                → {new Date(mandate.endDate).toLocaleDateString('fr-FR')}
                              </div>
                              {mandate.status === 'ACTIVE' && daysRemaining !== null && (
                                <div className={`text-xs mt-1 ${daysRemaining < 30 ? 'text-orange-600' : 'text-gray-500'}`}>
                                  {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Expiré'}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {mandate.commission ? (
                        <div className="text-sm font-medium text-gray-900">
                          {mandate.commission}%
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mandate.status)}`}>
                        {getStatusLabel(mandate.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="text-amber-600 hover:text-amber-700"
                          title="Voir le PDF"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          title="Télécharger"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleEdit(mandate)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(mandate.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
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
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun mandat trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {mandates.length === 0 
                ? 'Commencez par créer votre premier mandat'
                : 'Essayez de modifier vos critères de recherche'
              }
            </p>
            {mandates.length === 0 && (
              <button
                onClick={openNewModal}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                <Plus className="w-5 h-5" />
                Créer un mandat
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMandate ? 'Modifier le mandat' : 'Nouveau mandat'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bien *
                </label>
                <select
                  required
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un bien</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.reference} - {p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Propriétaire
                </label>
                <select
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un propriétaire</option>
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de mandat *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="SALE">Vente</option>
                  <option value="RENTAL">Location</option>
                  <option value="MANAGEMENT">Gestion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                  placeholder="5.0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="exclusivity"
                  checked={formData.exclusivity}
                  onChange={(e) => setFormData({ ...formData, exclusivity: e.target.checked })}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="exclusivity" className="ml-2 block text-sm text-gray-700">
                  Mandat exclusif
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    editingMandate ? 'Modifier' : 'Créer le mandat'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
