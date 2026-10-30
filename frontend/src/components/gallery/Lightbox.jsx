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
      className="fixed inset-0 z-50 bg-[#344e41]/90 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Top Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white text-[#344e41] border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] flex items-center justify-center cursor-pointer font-bold"
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
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white text-[#344e41] border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] flex items-center justify-center cursor-pointer hidden sm:flex"
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
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white text-[#344e41] border-2 border-[#344e41] shadow-[2px_2px_0px_#344e41] flex items-center justify-center cursor-pointer hidden sm:flex"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Lightbox Content Container */}
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center bg-white p-3 sm:p-4 border-2 border-[#344e41] shadow-[6px_6px_0px_0px_#344e41] font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.image}
          alt={item.title}
          className="max-h-[65vh] w-auto max-w-full object-contain border border-[#344e41]"
        />

        {/* Captions and Location metadata */}
        <div className="mt-3 text-center max-w-2xl px-2 text-[#344e41]">
          <h3 className="font-serif text-lg sm:text-xl font-black uppercase text-[#344e41]">
            {item.title}
          </h3>
          <p className="text-xs text-[#344e41]/80 mt-0.5 font-medium">
            {item.caption}
          </p>

          <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-[#588157] font-bold">
            {item.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </span>
            )}
            {item.altitude && (
              <span className="flex items-center gap-1">
                <Mountain className="w-3 h-3" />
                {item.altitude}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Prev / Next Controls */}
        {hasMultiple && (
          <div className="flex sm:hidden items-center gap-4 mt-3">
            <button
              type="button"
              onClick={onPrev}
              className="px-3 py-1 bg-[#dad7cd] text-[#344e41] border border-[#344e41] text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-3 py-1 bg-[#dad7cd] text-[#344e41] border border-[#344e41] text-xs font-bold flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
