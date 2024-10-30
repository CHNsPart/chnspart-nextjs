// app/mmm/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

interface Contact {
  id: number;
  fullname: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

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

  const updateStatus = async (id: number, status: string) => {
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

  const deleteContact = async (id: number) => {
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
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
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
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Name</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Email</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Message</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Status</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Date</th>
              <th className="text-left p-4 bg-[var(--eerie-black-1)] text-[var(--white-2)] border-b border-[var(--jet)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="border-b border-[var(--jet)] last:border-0">
                <td className="p-4 text-[var(--white-2)]">{contact.fullname}</td>
                <td className="p-4 text-[var(--white-2)]">{contact.email}</td>
                <td className="p-4 text-[var(--white-2)]">
                  <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={contact.message}>
                    {contact.message}
                  </div>
                </td>
                <td className="p-4">
                  <select
                    value={contact.status}
                    onChange={(e) => updateStatus(contact.id, e.target.value)}
                    disabled={updating === contact.id}
                    className={`p-2 rounded-lg ${getStatusBadgeClass(contact.status)} 
                    text-[var(--white-2)] border-none focus:outline-none cursor-pointer
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
                <td className="p-4 text-[var(--white-2)]">
                  {formatDate(contact.createdAt)}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => deleteContact(contact.id)}
                    disabled={deleting === contact.id}
                    className="p-2 text-red-500 hover:text-red-400 transition-colors rounded-lg
                    hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2"
                  >
                    {deleting === contact.id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
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