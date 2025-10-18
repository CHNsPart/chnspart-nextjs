// app/mmm/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

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

// Mapping objects for display labels
const PROJECT_TYPE_LABELS: { [key: string]: string } = {
  'sweb': 'Static Website',
  'aweb': 'Web Application',
  'app': 'Mobile App',
  'desktop': 'Desktop Application',
  'ai': 'AI/ML Solution',
  'ui': 'UI/UX Design',
  'logo': 'Logo Design',
  'branding': 'Branding'
};

const TIMELINE_LABELS: { [key: string]: string } = {
  '1m': 'Within 1 month',
  '1-3': '1-3 months',
  '3-6': '3-6 months',
  '6+': '6+ months'
};

const BUDGET_LABELS: { [key: string]: string } = {
  'xs': '$1.5k - $5k',
  'sm': '$5k - $10k',
  'md': '$10k - $25k',
  'lg': '$25k+'
};

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Helper functions to get display labels
  const getProjectTypeLabel = (code: string): string => {
    return PROJECT_TYPE_LABELS[code] || code;
  };

  const getTimelineLabel = (code: string): string => {
    return TIMELINE_LABELS[code] || code;
  };

  const getBudgetLabel = (code: string): string => {
    return BUDGET_LABELS[code] || code;
  };

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
      
      // Update the contact in the local state
      setContacts(prevContacts => 
        prevContacts.map(contact =>
          contact.id === id ? { ...contact, status } : contact
        )
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
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete contact');
      
      // Remove the contact from the local state
      setContacts(prevContacts => 
        prevContacts.filter(contact => contact.id !== id)
      );
      
      setError(null);
    } catch (error) {
      setError('Failed to delete contact');
      console.error('Error deleting contact:', error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesSearch =
      contact.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.projectType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
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
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--orange-yellow-crayola)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-[var(--white-2)]">Contact Submissions</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded-lg bg-[var(--eerie-black-2)] border border-[var(--jet)] 
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
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--jet)] bg-[var(--eerie-black-2)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[150px]">Name</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[200px]">Email</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[150px]">Project Type</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[120px]">Timeline</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[120px]">Budget</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[200px]">Message</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[200px]">Requirements</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[150px]">Status</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[100px]">Date</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)] min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="border-b border-[var(--jet)] last:border-0 hover:bg-[var(--jet)]/30 transition-colors">
                <td className="p-4 text-[var(--white-2)]">{contact.fullname}</td>
                <td className="p-4 text-[var(--white-2)]">
                  <a href={`mailto:${contact.email}`} className="text-[var(--orange-yellow-crayola)] hover:underline">
                    {contact.email}
                  </a>
                </td>
                <td className="p-4 text-[var(--white-2)]">
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--jet)] text-sm font-medium">
                    {getProjectTypeLabel(contact.projectType)}
                  </span>
                </td>
                <td className="p-4 text-[var(--white-2)] text-sm">{getTimelineLabel(contact.timeline)}</td>
                <td className="p-4 text-[var(--white-2)] text-sm font-medium">{getBudgetLabel(contact.budget)}</td>
                <td className="p-4 text-[var(--white-2)]">
                  <details className="cursor-pointer">
                    <summary className="text-[var(--orange-yellow-crayola)] hover:text-[var(--orange-yellow-crayola)]/80 text-sm">
                      View message
                    </summary>
                    <div className="mt-2 p-3 bg-[var(--smoky-black)] rounded border border-[var(--jet)] max-w-md whitespace-pre-wrap">
                      {contact.message}
                    </div>
                  </details>
                </td>
                <td className="p-4 text-[var(--white-2)]">
                  {contact.requirements ? (
                    <details className="cursor-pointer">
                      <summary className="text-[var(--orange-yellow-crayola)] hover:text-[var(--orange-yellow-crayola)]/80 text-sm">
                        View requirements
                      </summary>
                      <div className="mt-2 p-3 bg-[var(--smoky-black)] rounded border border-[var(--jet)] max-w-md whitespace-pre-wrap">
                        {contact.requirements}
                      </div>
                    </details>
                  ) : (
                    <span className="text-[var(--light-gray-70)] text-sm italic">No requirements</span>
                  )}
                </td>
                <td className="p-4">
                  <select
                    value={contact.status}
                    onChange={(e) => updateStatus(contact.id, e.target.value)}
                    disabled={updating === contact.id}
                    className={`p-2 rounded-lg ${getStatusBadgeClass(contact.status)}
                    text-[var(--white-2)] border-none focus:outline-none cursor-pointer text-sm
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  {updating === contact.id && (
                    <Loader2 size={16} className="ml-2 inline animate-spin" />
                  )}
                </td>
                <td className="p-4 text-[var(--white-2)] text-sm whitespace-nowrap">
                  {formatDate(contact.createdAt)}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => deleteContact(contact.id)}
                    disabled={deleting === contact.id}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors rounded-lg
                    hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm
                    flex items-center gap-1"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredContacts.length === 0 && (
          <div className="text-center p-8 text-[var(--light-gray)]">
            No contacts found.
          </div>
        )}
      </div>
    </div>
  );
}