import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loaders.jsx';
import { usePreferences } from '../../context/PreferencesContext.jsx';
import {
  Megaphone,
  Camera,
  BookOpen,
  Image,
  Share2,
  ArrowRight,
  Globe,
  MapPin,
  CheckCircle2,
  Layers
} from 'lucide-react';

export default function MarketingDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatDate } = usePreferences();

  const [trips, setTrips] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/trips'),
      api.get('/blogs?includeAll=true'),
    ])
      .then(([tripsRes, blogsRes]) => {
        const allTrips = Array.isArray(tripsRes) ? tripsRes : (tripsRes.data || []);
        const allBlogs = Array.isArray(blogsRes) ? blogsRes : (blogsRes.data || []);
        setTrips(allTrips);
        setBlogs(allBlogs);

        // Collect media counts across assigned trips
        return Promise.all(
          allTrips.slice(0, 8).map((t) =>
            api.get(`/media/trips/${t.id || t.tripId}`).catch(() => [])
          )
        );
      })
      .then((mediaResults) => {
        const all = mediaResults.flatMap((r) => (Array.isArray(r) ? r : (r.data || [])));
        setMedia(all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading && !trips.length && !blogs.length) {
    return <PageLoader />;
  }

  const publishedBlogs = blogs.filter((b) => b.status === 'PUBLISHED');

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        eyebrow="Media Curation & Journal Strategy"
        title="Marketing & Content Dashboard"
        description="Expedition photography management, customer archive deliveries, travel blog articles, and brand storytelling."
        icon={Megaphone}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/marketing/blogs"
              className="btn-primary text-xs"
            >
              <BookOpen className="w-4 h-4" /> New Article
            </Link>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Expedition Trips"
          value={trips.length}
          subtitle="Cleared operational assignments"
          icon={MapPin}
          color="brand"
        />

        <StatCard
          title="Media Uploaded"
          value={media.length}
          subtitle="Photographs recorded in active trips"
          icon={Camera}
          color="blue"
        />

        <StatCard
          title="Published Stories"
          value={publishedBlogs.length}
          subtitle={`${blogs.length} articles written in total`}
          icon={Globe}
          color="emerald"
        />

        <StatCard
          title="Brand Deliverables"
          value={trips.filter((t) => t.status === 'COMPLETED').length}
          subtitle="Completed guest expeditions"
          icon={Share2}
          color="purple"
        />
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/marketing/trips')}
          className="card p-6 text-left border-2 border-dashed border-brand-300 hover:border-brand-500 hover:bg-brand-50/50 transition duration-200 group flex items-start gap-4"
        >
          <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 group-hover:scale-110 transition">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-700 flex items-center gap-1.5 text-base">
              Trip Media Workspace <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload raw DSLR photos, manage customer deliverable archives, and promote hero shots to the public gallery.
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/marketing/blogs')}
          className="card p-6 text-left border-2 border-dashed border-brand-300 hover:border-brand-500 hover:bg-brand-50/50 transition duration-200 group flex items-start gap-4"
        >
          <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 group-hover:scale-110 transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-brand-700 flex items-center gap-1.5 text-base">
              Blog Journal Management <ArrowRight className="w-4 h-4" />
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Write, edit, and publish high-altitude guides, local culture stories, and travel photography showcases.
            </p>
          </div>
        </button>
      </div>

      {/* Two Column Section: Assigned Trips & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Trips */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Operational Trips ({trips.length})
              </h2>
            </div>
            <Link to="/marketing/trips" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
              Open Workspace <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              No active expeditions assigned.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {trips.slice(0, 5).map((trip) => (
                <div key={trip.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-700">{trip.tripId}</span>
                      <span className="font-bold text-slate-900">{trip.customerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{trip.packageName} ({trip.travelDates})</div>
                  </div>
                  <Badge status={trip.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Blogs */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Recent Journal Articles ({blogs.length})
              </h2>
            </div>
            <Link to="/marketing/blogs" className="text-xs text-brand-600 font-semibold hover:underline flex items-center gap-1">
              Manage All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {blogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No journal articles created yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {blogs.slice(0, 5).map((blog) => (
                <div key={blog.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{blog.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      {blog.category} • {formatDate(blog.createdAt)}
                    </div>
                  </div>
                  <Badge status={blog.status} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
