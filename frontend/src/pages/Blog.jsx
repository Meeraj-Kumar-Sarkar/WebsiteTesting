import React, { useRef, useEffect, useState } from 'react';
import BlogCard from '../components/blog/BlogCard';
import { blogPosts } from '../data/blogPosts';

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
  const [heroRef, heroInView] = useInView(0.08);
  const [gridRef, gridInView] = useInView(0.08);

  return (
    <div className="bg-cream pb-20">

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-beige to-cream py-14 px-4 sm:px-6 lg:px-8 mb-10 border-b border-bark/20">
        <div
          ref={heroRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-5">
            Himalayan journal &amp; guides
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-soil">
            Stories, advice &amp; dispatches
          </h1>
          <p className="mt-4 text-sm text-soil/70 max-w-2xl mx-auto leading-relaxed">
            In-depth guides on high-altitude acclimatization, seasonal transitions in the valleys, and traveling gently through fragile mountain habitats.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className={`transition-all duration-700 ease-out ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
