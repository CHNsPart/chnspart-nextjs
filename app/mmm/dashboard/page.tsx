"use client";

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  PROJECT_TYPE_LABELS,
  TIMELINE_LABELS,
  BUDGET_LABELS,
} from '@/lib/project-labels';
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

interface Contact {
  id: string;
  fullname: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
  requirements: string | null;
  status: string;
  createdAt: string;
}

const label = (map: Record<string, string>, code: string) => map[code] || code;

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data);
      setError(null);
    } catch (error) {
      setError('Failed to load contacts');
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdating(id);
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      setError(null);
    } catch (error) {
      setError('Failed to update status');
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      setDeleting(id);
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete contact');
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setError(null);
    } catch (error) {
      setError('Failed to delete contact');
      console.error('Error deleting contact:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      contact.fullname.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.message.toLowerCase().includes(q) ||
      contact.projectType.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'badge-new';
      case 'contacted':
        return 'badge-pending';
      case 'resolved':
        return 'badge-contacted';
      default:
        return 'badge-new';
    }
  };

  if (loading) {
    return (
      <AdminPage>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--orange-yellow-crayola)] border-t-transparent" />
        </div>
      </AdminPage>
    );
  }

  const filters = (
    <>
      <input
        type="text"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-auto p-2 rounded-lg bg-[var(--eerie-black-2)] border border-[var(--jet)]
          text-[var(--white-2)] placeholder-[var(--light-gray-70)]
          focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="p-2 rounded-lg bg-[var(--eerie-black-2)] border border-[var(--jet)]
          text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
      >
        <option value="all">All Status</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="resolved">Resolved</option>
      </select>
    </>
  );

  return (
    <AdminPage>
      <AdminPageHeader
        title="Contact Submissions"
        description="Review and triage inbound contact form submissions."
        actions={filters}
      />

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Project Type</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Requirements</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="whitespace-nowrap">{contact.fullname}</TableCell>
              <TableCell>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[var(--orange-yellow-crayola)] hover:underline whitespace-nowrap"
                >
                  {contact.email}
                </a>
              </TableCell>
              <TableCell>
                <span className="inline-block px-3 py-1.5 rounded-lg bg-[var(--jet)] text-sm font-medium whitespace-nowrap">
                  {label(PROJECT_TYPE_LABELS, contact.projectType)}
                </span>
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap">
                {label(TIMELINE_LABELS, contact.timeline)}
              </TableCell>
              <TableCell className="text-sm font-medium whitespace-nowrap">
                {label(BUDGET_LABELS, contact.budget)}
              </TableCell>
              <TableCell>
                <details className="cursor-pointer">
                  <summary className="text-[var(--orange-yellow-crayola)] hover:opacity-80 text-sm whitespace-nowrap">
                    View message
                  </summary>
                  <div className="mt-2 p-3 bg-[var(--smoky-black)] rounded border border-[var(--jet)] max-w-md whitespace-pre-wrap">
                    {contact.message}
                  </div>
                </details>
              </TableCell>
              <TableCell>
                {contact.requirements ? (
                  <details className="cursor-pointer">
                    <summary className="text-[var(--orange-yellow-crayola)] hover:opacity-80 text-sm whitespace-nowrap">
                      View requirements
                    </summary>
                    <div className="mt-2 p-3 bg-[var(--smoky-black)] rounded border border-[var(--jet)] max-w-md whitespace-pre-wrap">
                      {contact.requirements}
                    </div>
                  </details>
                ) : (
                  <span className="text-[var(--light-gray-70)] text-sm italic whitespace-nowrap">
                    No requirements
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <select
                    value={contact.status}
                    onChange={(e) => updateStatus(contact.id, e.target.value)}
                    disabled={updating === contact.id}
                    className={`p-2 rounded-lg ${statusBadgeClass(contact.status)}
                      text-[var(--white-2)] border-none focus:outline-none cursor-pointer text-sm
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  {updating === contact.id && <Loader2 size={16} className="animate-spin" />}
                </div>
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap">
                {formatDate(contact.createdAt)}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => deleteContact(contact.id)}
                  disabled={deleting === contact.id}
                  className="p-2 text-red-500 hover:text-red-400 transition-colors rounded-lg
                    hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm
                    flex items-center gap-1 whitespace-nowrap"
                >
                  {deleting === contact.id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span className="hidden md:inline">Deleting...</span>
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredContacts.length === 0 && <TableEmpty>No contacts found.</TableEmpty>}
    </AdminPage>
  );
}
