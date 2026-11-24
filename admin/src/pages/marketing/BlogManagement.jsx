import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import Modal from '../../components/common/Modal.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { Spinner } from '../../components/common/Loaders.jsx';
import { useToast, useConfirm } from '../../context/FeedbackContext.jsx';
import { usePreferences } from '../../context/PreferencesContext.jsx';
import {
  BookOpen,
  Plus,
  EyeOff,
  Edit2,
  Search,
  Globe,
  Trash2,
  Upload
} from 'lucide-react';

const STATUS_FILTERS = ['ALL', 'DRAFT', 'PUBLISHED', 'HIDDEN'];

const EMPTY_BLOG = {
  title: '',
  excerpt: '',
  body: '',
  coverImage: '',
  category: 'TRAVEL_GUIDE',
  tags: '',
  status: 'PUBLISHED'
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
  const toast = useToast();
  const confirm = useConfirm();
  const { formatDate } = usePreferences();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Create / Edit modal
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState(EMPTY_BLOG);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Hide modal (Master only)
  const [showHideModal, setShowHideModal] = useState(false);
  const [hidingBlog, setHidingBlog] = useState(null);
  const [hideReason, setHideReason] = useState('');
  const [hiding, setHiding] = useState(false);

  const loadBlogs = useCallback(() => {
    setLoading(true);
    api.get('/blogs?includeAll=true')
      .then((res) => {
        const list = Array.isArray(res) ? res : (res.data || []);
        setBlogs(list);
      })
      .catch((err) => toast.error('Failed to load blog posts: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleCoverUpload = async (file) => {
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/media/upload-file', fd);
      if (res.url) {
        setForm((prev) => ({ ...prev, coverImage: res.url }));
        toast.success('Cover image uploaded.');
      }
    } catch (err) {
      toast.error('Image upload failed: ' + err.message);
    } finally {
      setUploadingCover(false);
    }
  };

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
      status: blog.status || 'PUBLISHED'
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
        toast.success('Blog article updated successfully.');
      } else {
        await api.post('/blogs', payload);
        toast.success(payload.status === 'PUBLISHED' ? 'Article published to website.' : 'Blog draft saved.');
      }
      setShowForm(false);
      loadBlogs();
    } catch (err) {
      toast.error(err.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (blog) => {
    try {
      await api.post(`/blogs/${blog.id}/publish`);
      toast.success('Article published to public journal.');
      loadBlogs();
    } catch (err) {
      toast.error(err.message || 'Failed to publish');
    }
  };

  const handleDelete = async (blog) => {
    const ok = await confirm({
      title: `Delete "${blog.title}"?`,
      message: 'This will permanently delete this article.',
      confirmText: 'Delete Article',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await api.delete(`/blogs/${blog.id}`);
      toast.success('Article deleted.');
      loadBlogs();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
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
      await api.post(`/blogs/${hidingBlog.id}/hide`, { reason: hideReason });
      toast.success('Article unlisted and hidden from public portal.');
      setShowHideModal(false);
      loadBlogs();
    } catch (err) {
      toast.error(err.message || 'Failed to hide blog');
    } finally {
      setHiding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Editorial & Content Strategy"
        title="Journal & Blog Management"
        description="Draft, publish, and curate travel stories, high-pass guides, and cultural spotlights for the public website."
        icon={BookOpen}
        actions={
          <button
            onClick={openCreate}
            className="btn-primary text-xs"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, category, keywords..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filter === st
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Spinner className="w-7 h-7 text-brand-600" />
            <p className="text-xs text-slate-500">Loading blog publications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No blog stories found"
            description={search ? 'No articles matched your search query.' : 'Draft a new travel story or high-pass guide.'}
            action={
              <button onClick={openCreate} className="btn-primary text-xs">
                <Plus className="w-4 h-4" /> Create Article
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 truncate">{b.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{b.excerpt}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {b.authorName || b.authorEmpId || 'Editorial'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={b.status} />
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {b.publishedAt ? formatDate(b.publishedAt) : formatDate(b.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEdit(b)}
                        className="btn-secondary py-1 px-2.5 text-xs"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>

                      {b.status !== 'PUBLISHED' && (
                        <button
                          onClick={() => handlePublish(b)}
                          className="btn-primary py-1 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Globe className="w-3 h-3" /> Publish
                        </button>
                      )}

                      {isMaster && b.status === 'PUBLISHED' && (
                        <button
                          onClick={() => openHide(b)}
                          className="btn-secondary py-1 px-2.5 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                        >
                          <EyeOff className="w-3 h-3" /> Hide
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(b)}
                        className="btn-secondary py-1 px-2 text-xs text-rose-600 hover:bg-rose-50"
                        title="Delete article"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal
          isOpen={true}
          onClose={() => setShowForm(false)}
          title={editingBlog ? `Edit Article: ${editingBlog.title}` : 'Draft New Travel Article'}
          maxWidth="max-w-3xl"
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="blog-form"
                disabled={saving}
                className="btn-primary text-xs"
              >
                {saving ? 'Saving...' : editingBlog ? 'Update Article' : 'Save Article'}
              </button>
            </>
          }
        >
          <form id="blog-form" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Crossing Kunzum La: What Nobody Tells You About Autumn Snow"
                className="input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input text-xs"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input text-xs"
                >
                  <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                  <option value="DRAFT">DRAFT (Internal Only)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image (URL or Upload)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/... or upload file"
                  className="input text-xs font-mono flex-1"
                />
                <label className="btn-secondary text-xs cursor-pointer shrink-0 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  {uploadingCover ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Excerpt / Teaser <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A compelling 2-sentence summary shown on blog cards..."
                className="input resize-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Article Body Content <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={8}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write full article body..."
                className="input resize-none text-xs font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Spiti, Mountain Passes, High Altitude, Photography"
                className="input text-xs"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Hide Modal */}
      {showHideModal && hidingBlog && (
        <Modal
          isOpen={true}
          onClose={() => setShowHideModal(false)}
          title={`Executive Unlisting: ${hidingBlog.title}`}
          description="Master administrative action to remove article from public view."
          footer={
            <>
              <button
                type="button"
                onClick={() => setShowHideModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="hide-blog-form"
                disabled={hiding || !hideReason.trim()}
                className="btn-primary text-xs bg-rose-600 hover:bg-rose-700"
              >
                {hiding ? 'Unlisting...' : 'Confirm Unlist'}
              </button>
            </>
          }
        >
          <form id="hide-blog-form" onSubmit={handleHide} className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
              <strong>Public Unlisting Action:</strong>
              <p>This will change status to <strong>HIDDEN</strong>, removing it from public readers immediately while retaining all author revisions.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Unlisting <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={hideReason}
                onChange={(e) => setHideReason(e.target.value)}
                placeholder="e.g. Outdated route permit guidance / content revision needed..."
                className="input resize-none text-xs"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
