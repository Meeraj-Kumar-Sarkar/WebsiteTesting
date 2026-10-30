import React, { useState } from 'react';
import { ZoomIn, MapPin } from 'lucide-react';
import Lightbox from './Lightbox';

export default function GalleryGrid({ items = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % items.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="group relative rounded-none overflow-hidden cursor-pointer bg-white border-2 border-[#344e41] shadow-[3px_3px_0px_0px_#344e41] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#344e41] transition-none aspect-[4/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-none"
              loading="lazy"
            />
            
            {/* Brutalist info bottom bar visible immediately or on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#344e41] text-[#dad7cd] border-t-2 border-[#344e41] flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#a3b18a] block">
                  {item.location}
                </span>
                <span className="font-bold text-white truncate block">
                  {item.title}
                </span>
              </div>
              <span className="w-6 h-6 border border-[#dad7cd] flex items-center justify-center text-white bg-[#3a5a40]">
                <ZoomIn className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
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
