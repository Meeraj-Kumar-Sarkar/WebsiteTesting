import React, { useState, useRef, useEffect } from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { galleryCategories, galleryItems } from '../data/gallery';

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
  const [heroRef, heroInView] = useInView(0.08);
  const [galleryRef, galleryInView] = useInView(0.05);

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-cream pb-20">

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-beige to-cream py-14 px-4 sm:px-6 lg:px-8 mb-10 border-b border-bark/20">
        <div
          ref={heroRef}
          className={`max-w-5xl mx-auto text-center transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block rounded-full bg-sage/20 text-pine border border-sage/30 text-xs font-medium tracking-widest uppercase px-4 py-1 mb-5">
            Himalayan visual archive
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-soil">
            Moments, stays &amp; landscapes
          </h1>
          <p className="mt-4 text-sm text-soil/70 max-w-2xl mx-auto leading-relaxed">
            A window into the high passes, tranquil apple valleys, hand-carved houseboats, and silent monasteries across our routes.
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
                className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-pine text-cream border-pine shadow-nature-sm'
                    : 'bg-cream text-soil border-bark/25 hover:bg-beige'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid & Lightbox */}
        <div
          ref={galleryRef}
          className={`transition-all duration-700 ease-out ${galleryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <GalleryGrid items={filteredItems} />
        </div>

        {/* Note on imagery */}
        <div className="mt-12 p-4 bg-beige rounded-2xl border border-bark/20 text-center text-sm text-soil/60 max-w-2xl mx-auto">
          <span>* Visual archive features representative photography from Spiti, Ladakh, Kashmir, and Garhwal demonstration voyages.</span>
        </div>

      </div>

    </div>
  );
}
