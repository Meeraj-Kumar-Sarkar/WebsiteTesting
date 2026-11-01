import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import Badge from '../../components/common/Badge.jsx';

export default function MarketingDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/trips'),
      api.get('/blogs'),
    ])
      .then(([tripsRes, blogsRes]) => {
        const myTrips = (tripsRes.data || []).filter(
          (t) =>
            t.assignedMediaEmpIds?.includes(user?.id) ||
            user?.departments?.includes('MASTER')
        );
        setTrips(myTrips);
        setBlogs(blogsRes.data || []);
        // Collect media counts across all assigned trips
        return Promise.all(
          myTrips.map((t) =>
            api.get(`/media/trips/${t.id}`).catch(() => ({ data: [] }))
          )
        );
      })
      .then((mediaResults) => {
        const all = mediaResults.flatMap((r) => r.data || []);
        setMedia(all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const publishedBlogs = blogs.filter((b) => b.status === 'PUBLISHED');
  const sharedArchives = trips.filter((t) => t.archiveShared).length;

  const stats = [
    {
      title: 'Assigned Trips',
      value: trips.length,
      icon: '🏔️',
      color: 'green',
      subtitle: 'Active trip assignments',
    },
    {
      title: 'Media Uploaded',
      value: media.length,
      icon: '🖼️',
      color: 'blue',
      subtitle: 'Total assets across trips',
    },
    {
      title: 'Published Blogs',
      value: publishedBlogs.length,
      icon: '📝',
      color: 'purple',
      subtitle: `${blogs.length} total posts`,
    },
    {
      title: 'Archives Shared',
      value: sharedArchives,
      icon: '📦',
      color: 'amber',
      subtitle: 'Delivered to customers',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage trip media, galleries, and blog content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/marketing/trips')}
          className="bg-white border-2 border-dashed border-brand-300 rounded-xl p-6 text-left hover:border-brand-500 hover:bg-brand-50 transition-colors group"
        >
          <div className="text-3xl mb-3">🖼️</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-700">
            Trip Media Workspace
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Upload, curate, and share trip photos & videos
          </p>
        </button>
        <button
          onClick={() => navigate('/marketing/blogs')}
          className="bg-white border-2 border-dashed border-brand-300 rounded-xl p-6 text-left hover:border-brand-500 hover:bg-brand-50 transition-colors group"
        >
          <div className="text-3xl mb-3">✍️</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-700">
            Blog Management
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Create and publish travel stories & guides
          </p>
        </button>
      </div>

      {/* Assigned Trips */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">My Assigned Trips</h2>
          <button
            onClick={() => navigate('/marketing/trips')}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Open Workspace →
          </button>
        </div>
        {trips.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">
            <div className="text-4xl mb-2">🏔️</div>
            <p>No trips assigned yet.</p>
            <p className="text-sm">Ask your Master admin to assign you to a trip.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Trip ID', 'Destination', 'Dates', 'Status', 'Media'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {trips.map((trip) => {
                const tripMedia = media.filter((m) => m.tripId === trip.id);
                return (
                  <tr
                    key={trip.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('/marketing/trips')}
                  >
                    <td className="px-6 py-3 text-sm font-mono text-gray-700">
                      {trip.id}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {trip.destination}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {trip.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN') : '—'}
                      {trip.endDate ? ` – ${new Date(trip.endDate).toLocaleDateString('en-IN')}` : ''}
                    </td>
                    <td className="px-6 py-3">
                      <Badge status={trip.status} />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {tripMedia.length} assets
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Blogs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Blog Posts</h2>
          <button
            onClick={() => navigate('/marketing/blogs')}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            Manage All →
          </button>
        </div>
        {blogs.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400">
            <p>No blog posts yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {blogs.slice(0, 5).map((blog) => (
              <li key={blog.id} className="px-6 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{blog.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{blog.category} · {blog.author}</p>
                </div>
                <Badge status={blog.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
