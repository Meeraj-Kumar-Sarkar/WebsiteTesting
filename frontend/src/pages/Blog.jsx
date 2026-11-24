import React, { useRef, useEffect, useState } from 'react';
import BlogCard from '../components/blog/BlogCard';
import { frontendApi } from '../api/client';

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    frontendApi.getBlogs()
      .then((res) => setBlogPosts(Array.isArray(res) ? res : []))
      .catch(() => setBlogPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-transparent pb-20 min-h-[70vh]">

      {/* Header Banner */}
      <div className="page-hero py-14 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-up">
          <span className="section-label mb-5">
            Himalayan journal &amp; guides
          </span>
          <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-white">
            Stories, advice &amp; dispatches
          </h1>
          <p className="mt-4 text-sm sm:text-base text-soil/80 max-w-2xl mx-auto leading-relaxed">
            In-depth guides on high-altitude acclimatization, seasonal transitions in the valleys, and traveling gently through fragile mountain habitats.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[0, 1, 2].map((n) => (
              <div key={n} className="h-96 rounded-2xl shimmer border border-white/10" />
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="glass-card p-10 text-center max-w-lg mx-auto">
            <h3 className="font-sans text-xl font-bold text-white">No published stories yet</h3>
            <p className="text-sm text-soil/80 mt-2">
              New travel dispatches and mountain guides will appear here once published by our editorial team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-up">
            {blogPosts.map((post) => (
              <div key={post.id}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
