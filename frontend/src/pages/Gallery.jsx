import React, { useState, useRef, useEffect } from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { galleryCategories } from '../data/gallery';
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

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    frontendApi.getPublicGallery()
      .then((res) => setGalleryItems(Array.isArray(res) ? res : []))
      .catch(() => setGalleryItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => (item.galleryCategory || item.category) === selectedCategory);

  return (
    <div className="bg-transparent pb-20 min-h-[70vh]">

      {/* Header Banner */}
      <div className="page-hero py-14 px-4 sm:px-6 lg:px-8 mb-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-up">
          <span className="section-label mb-5">
            Himalayan visual archive
          </span>
          <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-white">
            Moments, stays &amp; landscapes
          </h1>
          <p className="mt-4 text-sm sm:text-base text-soil/80 max-w-2xl mx-auto leading-relaxed">
            A window into the high passes, tranquil apple valleys, timber sanctuaries, and silent monasteries across our routes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {galleryCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sage text-[#06150a] border-sage shadow-nature-sm'
                    : 'bg-white/[0.06] backdrop-blur-md text-soil/85 border-white/15 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="aspect-[4/3] rounded-2xl shimmer border border-white/10" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="glass-card p-10 text-center max-w-lg mx-auto">
            <h3 className="font-sans text-xl font-bold text-white">No photographs in this gallery view yet</h3>
            <p className="text-sm text-soil/80 mt-2">
              Expedition photographs promoted to the public gallery by our media team will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="animate-fade-up">
            <GalleryGrid items={filteredItems} />
          </div>
        )}

      </div>

    </div>
  );
}
