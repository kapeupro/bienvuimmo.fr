'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, Search, Filter, Users, Home, RefreshCw, ChevronDown,
  Phone, Mail, Eye, Check, X, Loader2, AlertCircle, TrendingUp, Target
} from 'lucide-react';

interface Match {
  id: string;
  score: number;
  status: string;
  notes?: string;
  propertyId: string;
  propertyTitle: string;
  propertyRef: string;
  propertyCity: string;
  propertyPrice: number;
  contactId: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone?: string;
  createdAt: string;
}

interface Property {
  id: string;
  reference: string;
  title: string;
  city: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
}

export default function MatchingPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProperty, setFilterProperty] = useState('');
  const [filterContact, setFilterContact] = useState('');
  const [minScore, setMinScore] = useState('');
  
  // Selected match for update
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterProperty) params.append('propertyId', filterProperty);
      if (filterContact) params.append('contactId', filterContact);
      if (minScore) params.append('minScore', minScore);

      const res = await fetch(`/api/matches?${params.toString()}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      setError('Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterProperty, filterContact, minScore]);

  const fetchFiltersData = async () => {
    try {
      const [propsRes, contactsRes] = await Promise.all([
        fetch('/api/properties?limit=100', { credentials: 'include' }),
        fetch('/api/contacts?type=BUYER&limit=100', { credentials: 'include' })
      ]);
      
      if (propsRes.ok) {
        const data = await propsRes.json();
        setProperties(data.properties || []);
      }
      if (contactsRes.ok) {
        const data = await contactsRes.json();
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error('Error fetching filter data:', err);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchFiltersData();
  }, [fetchMatches]);

  const runMatching = async (propertyId?: string, contactId?: string) => {
    setRunning(true);
    setMessage(null);

    try {
      const res = await fetch('/api/matches/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ propertyId, contactId })
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({ 
          type: 'success', 
          text: `${data.matchesCreated} nouveau(x) match(s) créé(s) !` 
        });
        fetchMatches();
      } else {
        setMessage({ type: 'error', text: 'Erreur lors du matching' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors du matching' });
    } finally {
      setRunning(false);
    }
  };

  const updateMatchStatus = async (matchId: string, status: string, notes?: string) => {
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, notes })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Statut mis à jour' });
        setSelectedMatch(null);
        fetchMatches();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  const deleteMatch = async (matchId: string) => {
    if (!confirm('Supprimer ce match ?')) return;

    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        fetchMatches();
      }
    } catch (err) {
      console.error('Error deleting match:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CONTACTED': return 'bg-blue-100 text-blue-700';
      case 'INTERESTED': return 'bg-green-100 text-green-700';
      case 'NOT_INTERESTED': return 'bg-red-100 text-red-700';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'CONTACTED': return 'Contacté';
      case 'INTERESTED': return 'Intéressé';
      case 'NOT_INTERESTED': return 'Non intéressé';
      case 'ARCHIVED': return 'Archivé';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-lime-600 bg-lime-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  // Stats
  const stats = {
    total: matches.length,
    pending: matches.filter(m => m.status === 'PENDING').length,
    interested: matches.filter(m => m.status === 'INTERESTED').length,
    avgScore: matches.length > 0 
      ? Math.round(matches.reduce((acc, m) => acc + m.score, 0) / matches.length) 
      : 0
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
          <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-500" />
            Matching intelligent
          </h1>
          <p className="mt-2 text-stone-600">
            Associez automatiquement vos biens aux acquéreurs potentiels
          </p>
        </div>
        <button
          onClick={() => runMatching()}
          disabled={running}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
        >
          {running ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          Lancer le matching
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-stone-500">Total matchs</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-stone-500">En attente</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-stone-500">Intéressés</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.interested}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-stone-500">Score moyen</span>
          </div>
          <p className="text-3xl font-bold text-stone-900">{stats.avgScore}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="PENDING">En attente</option>
              <option value="CONTACTED">Contacté</option>
              <option value="INTERESTED">Intéressé</option>
              <option value="NOT_INTERESTED">Non intéressé</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Bien</label>
            <select
              value={filterProperty}
              onChange={(e) => setFilterProperty(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Tous les biens</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.reference} - {p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Contact</label>
            <select
              value={filterContact}
              onChange={(e) => setFilterContact(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Tous les contacts</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Score minimum</label>
            <input
              type="number"
              placeholder="Ex: 50"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus('');
                setFilterProperty('');
                setFilterContact('');
                setMinScore('');
              }}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Matches list */}
      {matches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <Sparkles className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-900 mb-2">Aucun match trouvé</h3>
          <p className="text-stone-600 mb-6">
            Lancez le matching pour associer vos biens aux acquéreurs potentiels
          </p>
          <button
            onClick={() => runMatching()}
            disabled={running}
            className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition disabled:opacity-50"
          >
            Lancer le matching
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Bien</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-stone-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {matches.map((match) => (
                  <tr key={match.id} className="hover:bg-stone-50">
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-bold ${getScoreColor(match.score)}`}>
                        <Target className="w-4 h-4" />
                        {match.score}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-stone-900">{match.propertyTitle}</p>
                        <p className="text-sm text-stone-500">
                          {match.propertyRef} • {match.propertyCity}
                        </p>
                        <p className="text-sm font-semibold text-amber-600">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(match.propertyPrice)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-stone-900">
                          {match.contactFirstName} {match.contactLastName}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {match.contactEmail && (
                            <a href={`mailto:${match.contactEmail}`} className="text-stone-400 hover:text-amber-600">
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                          {match.contactPhone && (
                            <a href={`tel:${match.contactPhone}`} className="text-stone-400 hover:text-amber-600">
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedMatch(match)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}
                      >
                        {getStatusLabel(match.status)}
                        <ChevronDown className="w-4 h-4 inline ml-1" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteMatch(match.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status update modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-4">
              Mettre à jour le statut
            </h3>
            <p className="text-stone-600 mb-4">
              {selectedMatch.contactFirstName} {selectedMatch.contactLastName} → {selectedMatch.propertyRef}
            </p>
            <div className="space-y-2 mb-6">
              {['PENDING', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'ARCHIVED'].map(status => (
                <button
                  key={status}
                  onClick={() => updateMatchStatus(selectedMatch.id, status)}
                  className={`w-full px-4 py-3 rounded-xl text-left font-medium transition ${
                    selectedMatch.status === status 
                      ? 'bg-amber-100 text-amber-700 border-2 border-amber-500' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedMatch(null)}
              className="w-full py-2 text-stone-600 hover:text-stone-900"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
