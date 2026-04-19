"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Loader2, ArrowLeft, Save, Plus, X, Calendar, Briefcase, Mail, Phone, Linkedin, Twitter, Globe, MapPin, Building2 } from 'lucide-react';
import Link from 'next/link';

interface Client {
  id: string;
  email: string;
  fullname: string;
  company: string | null;
  industry: string | null;
  website: string | null;
  companySize: string | null;
  location: string | null;
  phone: string | null;
  linkedin: string | null;
  twitter: string | null;
  preferredContact: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  projects: Project[];
  tags: ClientTag[];
  categories: ClientCategory | null;
}

interface Project {
  id: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
  requirements: string | null;
  status: string;
  createdAt: string;
}

interface ClientTag {
  id: string;
  tag: string;
}

interface ClientCategory {
  budgetTier: string | null;
  priority: string;
  projectStage: string;
  industry: string | null;
}

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

const BUDGET_LABELS: { [key: string]: string } = {
  'xs': '$1.5k - $5k',
  'sm': '$5k - $10k',
  'md': '$10k - $25k',
  'lg': '$25k+'
};

const TIMELINE_LABELS: { [key: string]: string } = {
  '1m': 'Within 1 month',
  '1-3': '1-3 months',
  '3-6': '3-6 months',
  '6+': '6+ months'
};

export default function ClientDetailPage() {
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    company: '',
    industry: '',
    website: '',
    companySize: '',
    location: '',
    phone: '',
    linkedin: '',
    twitter: '',
    preferredContact: '',
    notes: '',
    status: 'lead',
  });

  const [categoryData, setCategoryData] = useState({
    priority: 'medium',
    projectStage: 'inquiry',
  });

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${params.id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch client');
      const data = await res.json();
      setClient(data);

      // Populate form data
      setFormData({
        company: data.company || '',
        industry: data.industry || '',
        website: data.website || '',
        companySize: data.companySize || '',
        location: data.location || '',
        phone: data.phone || '',
        linkedin: data.linkedin || '',
        twitter: data.twitter || '',
        preferredContact: data.preferredContact || '',
        notes: data.notes || '',
        status: data.status,
      });

      setCategoryData({
        priority: data.categories?.priority || 'medium',
        projectStage: data.categories?.projectStage || 'inquiry',
      });

      setError(null);
    } catch (error) {
      setError('Failed to load client');
      console.error('Error fetching client:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchClient();
    }
  }, [params.id, fetchClient]);

  const handleSave = async () => {
    if (!client) return;

    setSaving(true);
    try {
      // Update client
      await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Update category
      await fetch(`/api/clients/${client.id}/category`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      await fetchClient();
      setEditMode(false);
      setError(null);
    } catch (error) {
      setError('Failed to save changes');
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = async () => {
    if (!client || !newTag.trim()) return;

    try {
      await fetch(`/api/clients/${client.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: newTag.toLowerCase().trim() }),
      });

      setNewTag('');
      await fetchClient();
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!client) return;

    try {
      await fetch(`/api/clients/${client.id}/tags`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag }),
      });

      await fetchClient();
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'lead': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'inactive': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'converted': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[status as keyof typeof colors] || colors.lead;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'urgent': 'bg-red-500/20 text-red-400',
      'high': 'bg-orange-500/20 text-orange-400',
      'medium': 'bg-yellow-500/20 text-yellow-400',
      'low': 'bg-gray-500/20 text-gray-400',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--smoky-black)]">
        <Loader2 className="animate-spin text-[var(--orange-yellow-crayola)]" size={40} />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[var(--smoky-black)] p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[var(--light-gray-70)] mb-4">Client not found</p>
          <Link href="/mmm/clients" className="text-[var(--orange-yellow-crayola)] hover:underline">
            Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--smoky-black)] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/mmm/clients"
            className="inline-flex items-center gap-2 text-[var(--light-gray-70)] hover:text-[var(--orange-yellow-crayola)] transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            Back to Clients
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--white-2)] mb-2">{client.fullname}</h1>
              <p className="text-[var(--light-gray-70)]">{client.email}</p>
            </div>
            <div className="flex items-center gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-[var(--jet)] text-[var(--white-2)] rounded-lg hover:bg-[var(--onyx)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)] rounded-lg hover:bg-[var(--vegas-gold)] transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-[var(--jet)] text-[var(--orange-yellow-crayola)] rounded-lg hover:bg-[var(--onyx)] transition-colors"
                >
                  Edit Client
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <div className="bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl p-6">
              <h2 className="text-xl font-bold text-[var(--white-2)] mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-[var(--orange-yellow-crayola)]" />
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Company</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                      placeholder="Company name"
                    />
                  ) : (
                    <p className="text-[var(--white-2)]">{client.company || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Industry</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                      placeholder="e.g., Technology, Healthcare"
                    />
                  ) : (
                    <p className="text-[var(--white-2)]">{client.industry || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Website</label>
                  {editMode ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                      placeholder="https://example.com"
                    />
                  ) : (
                    client.website ? (
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-[var(--orange-yellow-crayola)] hover:underline flex items-center gap-1">
                        <Globe size={14} />
                        {client.website}
                      </a>
                    ) : <p className="text-[var(--white-2)]">-</p>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Company Size</label>
                  {editMode ? (
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="form-select w-full"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  ) : (
                    <p className="text-[var(--white-2)]">{client.companySize || '-'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Location</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-[var(--white-2)] flex items-center gap-2">
                      {client.location && <MapPin size={14} className="text-[var(--orange-yellow-crayola)]" />}
                      {client.location || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl p-6">
              <h2 className="text-xl font-bold text-[var(--white-2)] mb-4 flex items-center gap-2">
                <Mail size={20} className="text-[var(--orange-yellow-crayola)]" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Phone</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                      placeholder="+1 234 567 8900"
                    />
                  ) : (
                    <p className="text-[var(--white-2)] flex items-center gap-2">
                      {client.phone && <Phone size={14} className="text-[var(--orange-yellow-crayola)]" />}
                      {client.phone || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">LinkedIn</label>
                  {editMode ? (
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                      placeholder="https://linkedin.com/in/..."
                    />
                  ) : (
                    client.linkedin ? (
                      <a href={client.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--orange-yellow-crayola)] hover:underline flex items-center gap-1">
                        <Linkedin size={14} />
                        LinkedIn Profile
                      </a>
                    ) : <p className="text-[var(--white-2)]">-</p>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Twitter</label>
                  {editMode ? (
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                      placeholder="https://twitter.com/..."
                    />
                  ) : (
                    client.twitter ? (
                      <a href={client.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--orange-yellow-crayola)] hover:underline flex items-center gap-1">
                        <Twitter size={14} />
                        Twitter Profile
                      </a>
                    ) : <p className="text-[var(--white-2)]">-</p>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Preferred Contact</label>
                  {editMode ? (
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="form-select w-full"
                    >
                      <option value="">Select method</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  ) : (
                    <p className="text-[var(--white-2)] capitalize">{client.preferredContact || '-'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl p-6">
              <h2 className="text-xl font-bold text-[var(--white-2)] mb-4">Admin Notes</h2>
              {editMode ? (
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] focus:outline-none focus:border-[var(--orange-yellow-crayola)] min-h-[120px]"
                  placeholder="Internal notes about this client..."
                />
              ) : (
                <p className="text-[var(--white-2)] whitespace-pre-wrap">{client.notes || 'No notes yet'}</p>
              )}
            </div>

            {/* Project History */}
            <div className="bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl p-6">
              <h2 className="text-xl font-bold text-[var(--white-2)] mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-[var(--orange-yellow-crayola)]" />
                Project History ({client.projects.length})
              </h2>
              <div className="space-y-4">
                {client.projects.map((project) => (
                  <div key={project.id} className="p-4 bg-[var(--jet)] rounded-lg border border-[var(--onyx)]">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-[var(--white-2)] font-medium">
                          {PROJECT_TYPE_LABELS[project.projectType]}
                        </h3>
                        <p className="text-[var(--light-gray-70)] text-sm flex items-center gap-2 mt-1">
                          <Calendar size={14} />
                          {formatDate(project.createdAt)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-[var(--light-gray-70)] text-sm">
                        <strong>Timeline:</strong> {TIMELINE_LABELS[project.timeline]}
                      </p>
                      <p className="text-[var(--light-gray-70)] text-sm">
                        <strong>Budget:</strong> {BUDGET_LABELS[project.budget]}
                      </p>
                      <details className="mt-2">
                        <summary className="text-[var(--orange-yellow-crayola)] text-sm cursor-pointer hover:underline">
                          View details
                        </summary>
                        <div className="mt-2 p-3 bg-[var(--smoky-black)] rounded">
                          <p className="text-[var(--white-2)] text-sm mb-2"><strong>Message:</strong></p>
                          <p className="text-[var(--light-gray-70)] text-sm">{project.message}</p>
                          {project.requirements && (
                            <>
                              <p className="text-[var(--white-2)] text-sm mt-3 mb-2"><strong>Requirements:</strong></p>
                              <p className="text-[var(--light-gray-70)] text-sm whitespace-pre-wrap">{project.requirements}</p>
                            </>
                          )}
                        </div>
                      </details>
                    </div>
                  </div>
                ))}

                {client.projects.length === 0 && (
                  <p className="text-center text-[var(--light-gray-70)] py-8">No projects yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Category */}
            <div className="bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[var(--white-2)] mb-4">Status & Priority</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Client Status</label>
                  {editMode ? (
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="form-select w-full"
                    >
                      <option value="lead">Lead</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="converted">Converted</option>
                    </select>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Priority</label>
                  {editMode ? (
                    <select
                      value={categoryData.priority}
                      onChange={(e) => setCategoryData({ ...categoryData, priority: e.target.value })}
                      className="form-select w-full"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getPriorityColor(client.categories?.priority || 'medium')}`}>
                      {client.categories?.priority || 'medium'}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Project Stage</label>
                  {editMode ? (
                    <select
                      value={categoryData.projectStage}
                      onChange={(e) => setCategoryData({ ...categoryData, projectStage: e.target.value })}
                      className="form-select w-full"
                    >
                      <option value="inquiry">Inquiry</option>
                      <option value="discussion">Discussion</option>
                      <option value="proposal">Proposal</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <p className="text-[var(--white-2)] capitalize">{client.categories?.projectStage || 'inquiry'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[var(--light-gray-70)] text-sm mb-2">Budget Tier</label>
                  <p className="text-[var(--white-2)]">
                    {client.categories?.budgetTier ? BUDGET_LABELS[client.categories.budgetTier] : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[var(--white-2)] mb-4">Tags</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {client.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--orange-yellow-crayola)]/20 text-[var(--orange-yellow-crayola)] rounded-full text-sm"
                  >
                    {tag.tag}
                    <button
                      onClick={() => handleRemoveTag(tag.tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 bg-[var(--jet)] border border-[var(--onyx)] rounded-lg text-[var(--white-2)] text-sm focus:outline-none focus:border-[var(--orange-yellow-crayola)]"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-[var(--jet)] text-[var(--orange-yellow-crayola)] rounded-lg hover:bg-[var(--onyx)] transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-[var(--eerie-black-2)] border border-[var(--jet)] rounded-xl p-6">
              <h2 className="text-lg font-bold text-[var(--white-2)] mb-4">Metadata</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[var(--light-gray-70)]">Created</p>
                  <p className="text-[var(--white-2)]">{formatDate(client.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[var(--light-gray-70)]">Last Updated</p>
                  <p className="text-[var(--white-2)]">{formatDate(client.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-[var(--light-gray-70)]">Total Projects</p>
                  <p className="text-[var(--white-2)] font-medium">{client.projects.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
