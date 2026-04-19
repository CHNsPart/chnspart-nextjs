"use client";

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Loader2, Users, Search, Download, Eye } from 'lucide-react';
import Link from 'next/link';
import { AdminPage, AdminPageHeader } from '@/components/layout/AdminPage';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/ui/table';

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
      const res = await fetch('/api/clients', { cache: 'no-store' });
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
    <AdminPage>
      <AdminPageHeader
        title="Client Management"
        description="Manage your clients and track their projects."
        actions={
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--jet)] text-[var(--orange-yellow-crayola)] rounded-lg hover:bg-[var(--onyx)] transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Filters */}
      <div className="p-4 bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl">
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

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="min-w-[180px]">
                  <p className="text-[var(--white-2)] font-medium">{client.fullname}</p>
                  <p className="text-[var(--light-gray-70)] text-sm">{client.email}</p>
                </div>
              </TableCell>
              <TableCell>{client.company || '-'}</TableCell>
              <TableCell>
                {client.categories?.budgetTier ? (
                  <span className="px-2 py-1 bg-[var(--jet)] rounded text-sm text-[var(--white-2)] whitespace-nowrap">
                    {BUDGET_LABELS[client.categories.budgetTier]}
                  </span>
                ) : '-'}
              </TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-medium whitespace-nowrap">
                  {client.projects.length} {client.projects.length === 1 ? 'project' : 'projects'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[220px]">
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
              </TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeClass(client.status)}`}>
                  {client.status}
                </span>
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap">
                {formatDate(client.createdAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/mmm/clients/${client.id}`}
                  className="flex items-center gap-1 text-[var(--orange-yellow-crayola)] hover:text-[var(--vegas-gold)] transition-colors"
                >
                  <Eye size={16} />
                  <span className="text-sm">View</span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredClients.length === 0 && (
        <TableEmpty>No clients found matching your filters.</TableEmpty>
      )}
    </AdminPage>
  );
}
