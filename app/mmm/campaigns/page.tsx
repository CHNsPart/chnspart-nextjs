"use client";

import { useEffect, useState, useCallback } from 'react';
import { Loader2, Download, Mail, Tag, Users, Filter, X } from 'lucide-react';

interface Client {
  id: string;
  email: string;
  fullname: string;
  company: string | null;
  status: string;
  createdAt: string;
  projects: Project[];
  tags: ClientTag[];
  categories: ClientCategory | null;
}

interface Project {
  id: string;
  projectType: string;
  status: string;
  createdAt: string;
}

interface ClientTag {
  tag: string;
}

interface ClientCategory {
  budgetTier: string | null;
  priority: string;
  projectStage: string;
  industry: string | null;
}

const PROJECT_TYPES = ['web', 'mobile', 'ui', 'ai', 'other'];
const STATUSES = ['lead', 'active', 'inactive', 'converted'];
const BUDGET_TIERS = ['xs', 'sm', 'md', 'lg'];
const PRIORITIES = ['low', 'medium', 'high'];
const PROJECT_STAGES = ['inquiry', 'proposal', 'ongoing', 'completed', 'cancelled'];

const BUDGET_LABELS: { [key: string]: string } = {
  'xs': '$1.5k - $5k',
  'sm': '$5k - $10k',
  'md': '$10k - $25k',
  'lg': '$25k+'
};

export default function CampaignsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagMatchMode, setTagMatchMode] = useState<'any' | 'all'>('any');
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Available options
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);

  // Bulk operations
  const [bulkOperation, setBulkOperation] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);

      // Extract unique tags and industries
      const tags = new Set<string>();
      const industries = new Set<string>();

      data.forEach((client: Client) => {
        client.tags.forEach(t => tags.add(t.tag));
        if (client.categories?.industry) {
          industries.add(client.categories.industry);
        }
      });

      setAvailableTags(Array.from(tags).sort());
      setAvailableIndustries(Array.from(industries).sort());
      setError(null);
    } catch (err) {
      setError('Failed to load clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...clients];

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(client => {
        const clientTags = client.tags.map(t => t.tag);
        if (tagMatchMode === 'all') {
          return selectedTags.every(tag => clientTags.includes(tag));
        } else {
          return selectedTags.some(tag => clientTags.includes(tag));
        }
      });
    }

    // Budget filter
    if (selectedBudgets.length > 0) {
      filtered = filtered.filter(client =>
        client.categories?.budgetTier && selectedBudgets.includes(client.categories.budgetTier)
      );
    }

    // Industry filter
    if (selectedIndustries.length > 0) {
      filtered = filtered.filter(client =>
        client.categories?.industry && selectedIndustries.includes(client.categories.industry)
      );
    }

    // Project type filter
    if (selectedProjectTypes.length > 0) {
      filtered = filtered.filter(client =>
        client.projects.some(p => selectedProjectTypes.includes(p.projectType))
      );
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(client => selectedStatuses.includes(client.status));
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(client =>
        client.categories?.priority && selectedPriorities.includes(client.categories.priority)
      );
    }

    // Project stage filter
    if (selectedStages.length > 0) {
      filtered = filtered.filter(client =>
        client.categories?.projectStage && selectedStages.includes(client.categories.projectStage)
      );
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(client =>
        new Date(client.createdAt) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filtered = filtered.filter(client =>
        new Date(client.createdAt) <= new Date(dateTo)
      );
    }

    setFilteredClients(filtered);
  }, [clients, selectedTags, tagMatchMode, selectedBudgets, selectedIndustries,
      selectedProjectTypes, selectedStatuses, selectedPriorities, selectedStages, dateFrom, dateTo]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedBudgets([]);
    setSelectedIndustries([]);
    setSelectedProjectTypes([]);
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedStages([]);
    setDateFrom('');
    setDateTo('');
  };

  const exportToCSV = (fields: string[]) => {
    const headers = fields;
    const rows = filteredClients.map(client => {
      const row: string[] = [];

      fields.forEach(field => {
        switch(field) {
          case 'Name':
            row.push(client.fullname);
            break;
          case 'Email':
            row.push(client.email);
            break;
          case 'Company':
            row.push(client.company || '');
            break;
          case 'Status':
            row.push(client.status);
            break;
          case 'Budget':
            row.push(client.categories?.budgetTier ? BUDGET_LABELS[client.categories.budgetTier] : '');
            break;
          case 'Industry':
            row.push(client.categories?.industry || '');
            break;
          case 'Priority':
            row.push(client.categories?.priority || '');
            break;
          case 'Projects':
            row.push(client.projects.length.toString());
            break;
          case 'Tags':
            row.push(client.tags.map(t => t.tag).join('; '));
            break;
          case 'Created':
            row.push(new Date(client.createdAt).toLocaleDateString());
            break;
        }
      });

      return row;
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportEmailList = () => {
    const emails = filteredClients.map(c => c.email).join('\n');
    const blob = new Blob([emails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emails-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const exportJSON = () => {
    const json = JSON.stringify(filteredClients, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleBulkOperation = async () => {
    if (!bulkOperation || !bulkValue || filteredClients.length === 0) return;

    setProcessing(true);
    try {
      const promises = filteredClients.map(client => {
        if (bulkOperation === 'addTag') {
          return fetch(`/api/clients/${client.id}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag: bulkValue }),
          });
        } else if (bulkOperation === 'changeStatus') {
          return fetch(`/api/clients/${client.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: bulkValue }),
          });
        } else if (bulkOperation === 'changePriority') {
          return fetch(`/api/clients/${client.id}/category`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priority: bulkValue }),
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      await fetchClients();
      setBulkOperation('');
      setBulkValue('');
    } catch (err) {
      setError('Failed to perform bulk operation');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const toggleArrayFilter = (value: string, current: string[], setter: (v: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--smoky-black)]">
        <Loader2 className="animate-spin text-[var(--orange-yellow-crayola)]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--smoky-black)] p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--white-2)] mb-2">Campaign Manager</h1>
              <p className="text-[var(--light-gray-70)]">Filter and export client lists for marketing campaigns</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--light-gray-70)]">Total Clients</p>
              <p className="text-3xl font-bold text-[var(--orange-yellow-crayola)]">{clients.length}</p>
            </div>
          </div>

          {/* Results Summary */}
          <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="text-[var(--orange-yellow-crayola)]" size={24} />
                <div>
                  <p className="text-[var(--light-gray-70)] text-sm">Filtered Results</p>
                  <p className="text-2xl font-bold text-[var(--white-2)]">{filteredClients.length}</p>
                </div>
              </div>
              {(selectedTags.length > 0 || selectedBudgets.length > 0 || selectedIndustries.length > 0 ||
                selectedProjectTypes.length > 0 || selectedStatuses.length > 0 || selectedPriorities.length > 0 ||
                selectedStages.length > 0 || dateFrom || dateTo) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--jet)] text-[var(--white-2)] rounded-lg hover:bg-[var(--onyx)] transition-colors"
                >
                  <X size={16} />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="text-[var(--orange-yellow-crayola)]" size={20} />
                  <h2 className="text-xl font-bold text-[var(--white-2)]">Filters</h2>
                </div>

                <div className="space-y-4">
                  {/* Tags Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--white-2)] mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={() => setTagMatchMode('any')}
                        className={`flex-1 px-3 py-1 rounded text-sm ${
                          tagMatchMode === 'any'
                            ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                            : 'bg-[var(--jet)] text-[var(--light-gray)]'
                        }`}
                      >
                        Any
                      </button>
                      <button
                        onClick={() => setTagMatchMode('all')}
                        className={`flex-1 px-3 py-1 rounded text-sm ${
                          tagMatchMode === 'all'
                            ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                            : 'bg-[var(--jet)] text-[var(--light-gray)]'
                        }`}
                      >
                        All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleArrayFilter(tag, selectedTags, setSelectedTags)}
                          className={`px-3 py-1 rounded-full text-xs transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                              : 'bg-[var(--jet)] text-[var(--light-gray)] hover:bg-[var(--onyx)]'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--white-2)] mb-2">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(status => (
                        <button
                          key={status}
                          onClick={() => toggleArrayFilter(status, selectedStatuses, setSelectedStatuses)}
                          className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                            selectedStatuses.includes(status)
                              ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                              : 'bg-[var(--jet)] text-[var(--light-gray)] hover:bg-[var(--onyx)]'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--white-2)] mb-2">
                      Budget Tier
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {BUDGET_TIERS.map(budget => (
                        <button
                          key={budget}
                          onClick={() => toggleArrayFilter(budget, selectedBudgets, setSelectedBudgets)}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            selectedBudgets.includes(budget)
                              ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                              : 'bg-[var(--jet)] text-[var(--light-gray)] hover:bg-[var(--onyx)]'
                          }`}
                        >
                          {BUDGET_LABELS[budget]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--white-2)] mb-2">
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRIORITIES.map(priority => (
                        <button
                          key={priority}
                          onClick={() => toggleArrayFilter(priority, selectedPriorities, setSelectedPriorities)}
                          className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                            selectedPriorities.includes(priority)
                              ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                              : 'bg-[var(--jet)] text-[var(--light-gray)] hover:bg-[var(--onyx)]'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Industry Filter */}
                  {availableIndustries.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--white-2)] mb-2">
                        Industry
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableIndustries.map(industry => (
                          <button
                            key={industry}
                            onClick={() => toggleArrayFilter(industry, selectedIndustries, setSelectedIndustries)}
                            className={`px-3 py-1 rounded text-xs transition-colors ${
                              selectedIndustries.includes(industry)
                                ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                                : 'bg-[var(--jet)] text-[var(--light-gray)] hover:bg-[var(--onyx)]'
                            }`}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--white-2)] mb-2">
                      Project Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => toggleArrayFilter(type, selectedProjectTypes, setSelectedProjectTypes)}
                          className={`px-3 py-1 rounded text-xs uppercase transition-colors ${
                            selectedProjectTypes.includes(type)
                              ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                              : 'bg-[var(--jet)] text-[var(--light-gray)] hover:bg-[var(--onyx)]'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Stage Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--white-2)] mb-2">
                      Project Stage
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_STAGES.map(stage => (
                        <button
                          key={stage}
                          onClick={() => toggleArrayFilter(stage, selectedStages, setSelectedStages)}
                          className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                            selectedStages.includes(stage)
                              ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]'
                              : 'bg-[var(--jet)] text-[var(--light-gray)] hover:bg-[var(--onyx)]'
                          }`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--white-2)] mb-2">
                      Date Range (Created)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded text-[var(--white-2)] text-sm focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                        placeholder="From"
                      />
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded text-[var(--white-2)] text-sm focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                        placeholder="To"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results & Actions */}
          <div className="lg:col-span-2 space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                {error}
              </div>
            )}

            {/* Export Options */}
            <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Download className="text-[var(--orange-yellow-crayola)]" size={20} />
                <h2 className="text-xl font-bold text-[var(--white-2)]">Export Options</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => exportToCSV(['Name', 'Email', 'Company', 'Status', 'Budget', 'Priority', 'Projects', 'Tags', 'Created'])}
                  disabled={filteredClients.length === 0}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--jet)] text-[var(--white-2)] rounded-lg hover:bg-[var(--onyx)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  Full CSV
                </button>
                <button
                  onClick={exportEmailList}
                  disabled={filteredClients.length === 0}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--jet)] text-[var(--white-2)] rounded-lg hover:bg-[var(--onyx)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail size={18} />
                  Email List
                </button>
                <button
                  onClick={exportJSON}
                  disabled={filteredClients.length === 0}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--jet)] text-[var(--white-2)] rounded-lg hover:bg-[var(--onyx)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  JSON Export
                </button>
              </div>
            </div>

            {/* Bulk Operations */}
            <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="text-[var(--orange-yellow-crayola)]" size={20} />
                <h2 className="text-xl font-bold text-[var(--white-2)]">Bulk Operations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={bulkOperation}
                  onChange={(e) => {
                    setBulkOperation(e.target.value);
                    setBulkValue('');
                  }}
                  className="px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                >
                  <option value="">Select operation...</option>
                  <option value="addTag">Add Tag</option>
                  <option value="changeStatus">Change Status</option>
                  <option value="changePriority">Change Priority</option>
                </select>

                {bulkOperation === 'addTag' && (
                  <input
                    type="text"
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    placeholder="Enter tag name..."
                    className="px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                  />
                )}

                {bulkOperation === 'changeStatus' && (
                  <select
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    className="px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                  >
                    <option value="">Select status...</option>
                    {STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                )}

                {bulkOperation === 'changePriority' && (
                  <select
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    className="px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                  >
                    <option value="">Select priority...</option>
                    {PRIORITIES.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                )}

                <button
                  onClick={handleBulkOperation}
                  disabled={!bulkOperation || !bulkValue || filteredClients.length === 0 || processing}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)] rounded-lg hover:bg-[var(--vegas-gold)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Processing...
                    </>
                  ) : (
                    <>Apply to {filteredClients.length} clients</>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-[var(--light-gray-70)]">
                This will apply the selected operation to all {filteredClients.length} filtered clients.
              </p>
            </div>

            {/* Results Preview */}
            <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
              <h2 className="text-xl font-bold text-[var(--white-2)] mb-4">Preview ({filteredClients.length} clients)</h2>

              {filteredClients.length === 0 ? (
                <div className="p-12 text-center text-[var(--light-gray-70)]">
                  No clients match your current filters.
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      className="p-4 bg-[var(--smoky-black)] border border-[var(--jet)] rounded-lg hover:border-[var(--onyx)] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[var(--white-2)] font-medium">{client.fullname}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              client.status === 'active' ? 'bg-green-500/20 text-green-400' :
                              client.status === 'lead' ? 'bg-blue-500/20 text-blue-400' :
                              client.status === 'converted' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {client.status}
                            </span>
                            {client.categories?.priority && (
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                client.categories.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                client.categories.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {client.categories.priority} priority
                              </span>
                            )}
                          </div>
                          <p className="text-[var(--light-gray-70)] text-sm mb-2">{client.email}</p>
                          {client.company && (
                            <p className="text-[var(--light-gray)] text-sm mb-2">{client.company}</p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {client.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-[var(--orange-yellow-crayola)]/20 text-[var(--orange-yellow-crayola)] rounded text-xs"
                              >
                                {tag.tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-[var(--light-gray-70)]">{client.projects.length} project{client.projects.length !== 1 ? 's' : ''}</p>
                          {client.categories?.budgetTier && (
                            <p className="text-[var(--white-2)] mt-1">{BUDGET_LABELS[client.categories.budgetTier]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
