"use client";

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Loader2, Users, Search, Download, Eye } from 'lucide-react';
import Link from 'next/link';

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
}

interface ClientTag {
  tag: string;
}

interface ClientCategory {
  budgetTier: string | null;
  priority: string;
}

const BUDGET_LABELS: { [key: string]: string } = {
  'xs': '$1.5k - $5k',
  'sm': '$5k - $10k',
  'md': '$10k - $25k',
  'lg': '$25k+'
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
      setError(null);
    } catch (error) {
      setError('Failed to load clients');
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesBudget = budgetFilter === 'all' || client.categories?.budgetTier === budgetFilter;

    return matchesSearch && matchesStatus && matchesBudget;
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    leads: clients.filter(c => c.status === 'lead').length,
  };

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      'lead': 'bg-blue-500/20 text-blue-400',
      'active': 'bg-green-500/20 text-green-400',
      'inactive': 'bg-gray-500/20 text-gray-400',
      'converted': 'bg-purple-500/20 text-purple-400',
    };
    return classes[status as keyof typeof classes] || classes.lead;
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Status', 'Budget Tier', 'Projects', 'Created'];
    const rows = filteredClients.map(client => [
      client.fullname,
      client.email,
      client.company || '',
      client.status,
      client.categories?.budgetTier || '',
      client.projects.length.toString(),
      new Date(client.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
              <h1 className="text-3xl font-bold text-[var(--white-2)] mb-2">Client Management</h1>
              <p className="text-[var(--light-gray-70)]">Manage your clients and track their projects</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--jet)] text-[var(--orange-yellow-crayola)] rounded-lg hover:bg-[var(--onyx)] transition-colors"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="text-[var(--orange-yellow-crayola)]" size={24} />
                <div>
                  <p className="text-[var(--light-gray-70)] text-sm">Total Clients</p>
                  <p className="text-2xl font-bold text-[var(--white-2)]">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
              <p className="text-[var(--light-gray-70)] text-sm mb-1">Active Projects</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
              <p className="text-[var(--light-gray-70)] text-sm mb-1">New Leads</p>
              <p className="text-2xl font-bold text-blue-400">{stats.leads}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-gray-70)]" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] placeholder-[var(--light-gray-70)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                />
              </div>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select w-full"
              >
                <option value="all">All Status</option>
                <option value="lead">Leads</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            <div>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="form-select w-full"
              >
                <option value="all">All Budgets</option>
                <option value="xs">$1.5k - $5k</option>
                <option value="sm">$5k - $10k</option>
                <option value="md">$10k - $25k</option>
                <option value="lg">$25k+</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Clients Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--jet)] bg-[var(--eerie-black-2)]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Client</th>
                <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Company</th>
                <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Budget</th>
                <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Projects</th>
                <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Tags</th>
                <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Status</th>
                <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Created</th>
                <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-[var(--jet)] last:border-0 hover:bg-[var(--jet)]/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-[var(--white-2)] font-medium">{client.fullname}</p>
                      <p className="text-[var(--light-gray-70)] text-sm">{client.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--white-2)]">{client.company || '-'}</td>
                  <td className="p-4">
                    {client.categories?.budgetTier ? (
                      <span className="px-2 py-1 bg-[var(--jet)] rounded text-sm text-[var(--white-2)]">
                        {BUDGET_LABELS[client.categories.budgetTier]}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-medium">
                      {client.projects.length} {client.projects.length === 1 ? 'project' : 'projects'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {client.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[var(--orange-yellow-crayola)]/20 text-[var(--orange-yellow-crayola)] rounded text-xs">
                          {tag.tag}
                        </span>
                      ))}
                      {client.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-[var(--jet)] text-[var(--light-gray)] rounded text-xs">
                          +{client.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--white-2)] text-sm">
                    {formatDate(client.createdAt)}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/mmm/clients/${client.id}`}
                      className="flex items-center gap-1 text-[var(--orange-yellow-crayola)] hover:text-[var(--vegas-gold)] transition-colors"
                    >
                      <Eye size={16} />
                      <span className="text-sm">View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="p-12 text-center text-[var(--light-gray-70)]">
              No clients found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
