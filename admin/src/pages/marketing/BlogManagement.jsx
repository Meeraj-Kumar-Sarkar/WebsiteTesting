import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';

const STATUS_FILTERS = ['ALL', 'DRAFT', 'PUBLISHED', 'HIDDEN'];

const EMPTY_BLOG = {
  title: '',
  excerpt: '',
  body: '',
  coverImage: '',
  category: 'TRAVEL_GUIDE',
  tags: '',
};

const CATEGORIES = [
  'TRAVEL_GUIDE',
  'DESTINATION_SPOTLIGHT',
  'PHOTOGRAPHY',
  'CULTURE',
  'ADVENTURE',
  'TIPS_AND_TRICKS',
];

export default function BlogManagement() {
  const { user } = useAuth();
  const isMaster = user?.departments?.includes('MASTER');

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Create / Edit modal
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); // null = create
  const [form, setForm] = useState(EMPTY_BLOG);
  const [saving, setSaving] = useState(false);

  // Hide modal (Master only)
  const [showHideModal, setShowHideModal] = useState(false);
  const [hidingBlog, setHidingBlog] = useState(null);
  const [hideReason, setHideReason] = useState('');
  const [hiding, setHiding] = useState(false);

  const loadBlogs = useCallback(() => {
    setLoading(true);
    api.get('/blogs?includeAll=true')
      .then((res) => setBlogs(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadBlogs(); }, [loadBlogs]);

  const filtered = blogs.filter((b) => {
    const matchStatus = filter === 'ALL' || b.status === filter;
    const matchSearch =
      !search ||
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const openCreate = () => {
    setEditingBlog(null);
    setForm(EMPTY_BLOG);
    setShowForm(true);
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      body: blog.body || '',
      coverImage: blog.coverImage || '',
      category: blog.category || 'TRAVEL_GUIDE',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || ''),
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingBlog) {
        await api.patch(`/blogs/${editingBlog.id}`, payload);
      } else {
        await api.post('/blogs', payload);
      }
      setShowForm(false);
      loadBlogs();
    } catch (err) {
      alert(err.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (blog) => {
    if (!window.confirm(`Publish "${blog.title}"?`)) return;
    try {
      await api.post(`/blogs/${blog.id}/publish`);
      loadBlogs();
    } catch (err) {
      alert(err.message || 'Failed to publish');
    }
  };

  const openHide = (blog) => {
    setHidingBlog(blog);
    setHideReason('');
    setShowHideModal(true);
  };

  const handleHide = async (e) => {
    e.preventDefault();
    setHiding(true);
    try {
      await api.patch(`/blogs/${hidingBlog.id}/hide`, { reason: hideReason });
      setShowHideModal(false);
      loadBlogs();
    } catch (err) {
      alert(err.message || 'Failed to hide blog');
    } finally {
      setHiding(false);
    }
  };

  const statusDot = {
    DRAFT: 'bg-yellow-400',
    PUBLISHED: 'bg-green-400',
    HIDDEN: 'bg-gray-400',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 mt-1">Create and publish travel stories & guides</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          + New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'ALL' ? 'All Posts' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by title or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[220px]"
        />
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} posts</span>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">📝</div>
            <p>No blog posts found</p>
            <button onClick={openCreate} className="mt-3 text-brand-600 hover:underline text-sm">
              Create your first post
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Status', 'Title', 'Category', 'Tags', 'Author', 'Published', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[blog.status] || 'bg-gray-300'}`}
                      />
                      <span className="text-xs text-gray-600">{blog.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                      <p className="text-xs text-gray-400 truncate">{blog.excerpt}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">
                    {blog.category?.replace(/_/g, ' ')}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(blog.tags || []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {(blog.tags || []).length > 3 && (
                        <span className="text-xs text-gray-400">+{blog.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{blog.author}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString('en-IN')
                      : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(blog)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                      >
                        Edit
                      </button>
                      {blog.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublish(blog)}
                          className="text-xs px-2 py-1 bg-green-50 border border-green-200 rounded hover:bg-green-100 text-green-700"
                        >
                          Publish
                        </button>
                      )}
                      {isMaster && blog.status === 'PUBLISHED' && (
                        <button
                          onClick={() => openHide(blog)}
                          className="text-xs px-2 py-1 bg-red-50 border border-red-200 rounded hover:bg-red-100 text-red-700"
                        >
                          Hide
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create / Edit Blog Modal ── */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingBlog ? `Edit: ${editingBlog.title}` : 'New Blog Post'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. 7 Hidden Gems of Spiti Valley"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="Short description shown in blog listing"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags <span className="text-xs text-gray-400">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="spiti, adventure, photography"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={form.coverImage}
                onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
                placeholder="https://example.com/cover.jpg"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body (Markdown) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={10}
                value={form.body}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                placeholder={`# My Spiti Adventure\n\nWrite your travel story here in Markdown...`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">
                Markdown is supported — headings, bold, lists, links, images
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingBlog ? 'Save Changes' : 'Create Draft'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Hide Blog Modal (Master only) ── */}
      <Modal
        isOpen={showHideModal}
        onClose={() => setShowHideModal(false)}
        title="Hide Blog Post"
      >
        <form onSubmit={handleHide} className="space-y-4">
          <p className="text-sm text-gray-600">
            Hide <strong>"{hidingBlog?.title}"</strong> from the public. It will be removed from
            the website but remain accessible internally.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={hideReason}
              onChange={(e) => setHideReason(e.target.value)}
              placeholder="e.g. Contains outdated pricing information"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            ⚠️ Only Master administrators can hide blog posts.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowHideModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hiding}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {hiding ? 'Hiding…' : 'Hide Post'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
