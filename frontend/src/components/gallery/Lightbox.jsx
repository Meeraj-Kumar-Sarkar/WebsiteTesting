import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Mountain } from 'lucide-react';

export default function Lightbox({
  item,
  onClose,
  onNext,
  onPrev,
  hasMultiple = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrev]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-soil/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-cream/90 hover:bg-cream text-soil shadow-nature-md flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
        aria-label="Close Lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev Button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-cream/90 hover:bg-cream text-soil shadow-nature-md flex items-center justify-center cursor-pointer hidden sm:flex transition-all duration-200 hover:scale-110"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Button */}
      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-cream/90 hover:bg-cream text-soil shadow-nature-md flex items-center justify-center cursor-pointer hidden sm:flex transition-all duration-200 hover:scale-110"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Lightbox Content Container */}
      <div
        className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center bg-cream rounded-3xl p-4 sm:p-6 border border-bark/20 shadow-float animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image}
          alt={item.title}
          className="max-h-[66vh] w-auto max-w-full object-contain rounded-2xl shadow-nature-sm"
        />

        {/* Captions and Location metadata */}
        <div className="mt-4 text-center max-w-2xl px-2 text-soil">
          <h3 className="font-serif text-lg sm:text-2xl font-bold text-soil">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-soil/75 mt-1 font-sans">
            {item.caption}
          </p>

          <div className="flex items-center justify-center flex-wrap gap-2.5 mt-2.5 text-xs text-pine font-medium">
            {item.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/20 border border-sage/30 text-pine">
                <MapPin className="w-3.5 h-3.5" />
                {item.location}
              </span>
            )}
            {item.altitude && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-beige/60 border border-bark/15 text-soil">
                <Mountain className="w-3.5 h-3.5 text-fern" />
                {item.altitude}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Prev / Next Controls */}
        {hasMultiple && (
          <div className="flex sm:hidden items-center gap-3 mt-4">
            <button
              type="button"
              onClick={onPrev}
              className="px-4 py-2 rounded-full bg-beige/60 hover:bg-beige text-soil text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-4 py-2 rounded-full bg-beige/60 hover:bg-beige text-soil text-xs font-semibold flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
