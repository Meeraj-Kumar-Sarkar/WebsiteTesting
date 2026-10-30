import React, { useState } from 'react';
import SectionHeading from '../components/common/SectionHeading';
import GalleryGrid from '../components/gallery/GalleryGrid';
import { galleryCategories, galleryItems } from '../data/gallery';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#dad7cd] pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#344e41] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 border-b-2 border-[#344e41]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#3a5a40] border-2 border-white font-mono text-xs uppercase font-bold text-[#dad7cd] mb-3 shadow-[2px_2px_0px_#ffffff]">
            <span>// HIMALAYAN VISUAL ARCHIVE</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            MOMENTS, STAYS &amp; LANDSCAPES
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#dad7cd] max-w-2xl mx-auto font-medium leading-relaxed">
            A window into the high passes, tranquil apple valleys, hand-carved houseboats, and silent monasteries across our routes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filter Pills (Brutalist boxes) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 font-mono">
          {galleryCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold uppercase rounded-none border-2 transition-none cursor-pointer ${
                  isActive
                    ? 'bg-[#3a5a40] text-white border-[#344e41] shadow-[2px_2px_0px_#344e41]'
                    : 'bg-white text-[#344e41] border-[#344e41] hover:bg-[#dad7cd]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid & Lightbox */}
        <GalleryGrid items={filteredItems} />

        {/* Note on imagery */}
        <div className="mt-12 p-4 bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_#344e41] text-center font-mono text-xs text-[#344e41]/80 max-w-2xl mx-auto">
          <span>* Visual archive features representative photography from Spiti, Ladakh, Kashmir, and Garhwal demonstration voyages.</span>
        </div>

      </div>

    </div>
  );
}
