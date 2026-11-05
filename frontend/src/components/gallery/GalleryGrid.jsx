import React, { useState } from 'react';
import { ZoomIn, MapPin } from 'lucide-react';
import Lightbox from './Lightbox';

export default function GalleryGrid({ items = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openLightbox  = (i) => setSelectedIndex(i);
  const closeLightbox = () => setSelectedIndex(null);
  const handleNext = () => setSelectedIndex((selectedIndex + 1) % items.length);
  const handlePrev = () => setSelectedIndex((selectedIndex - 1 + items.length) % items.length);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="card-organic group relative rounded-2xl overflow-hidden cursor-pointer border border-bark/20 shadow-nature aspect-[4/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-soil/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Info bar — visible on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-[10px] uppercase font-semibold text-sage block tracking-wide">{item.location}</span>
              <span className="font-serif text-sm font-bold text-cream block truncate">{item.title}</span>
            </div>

            {/* Zoom icon */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-nature-sm">
              <ZoomIn className="w-4 h-4 text-soil" />
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <Lightbox
          item={items[selectedIndex]}
          onClose={closeLightbox}
          onNext={handleNext}
          onPrev={handlePrev}
          hasMultiple={items.length > 1}
        />
      )}
    </>
  );
}
