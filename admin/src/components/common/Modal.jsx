import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Accessible modal dialog.
 * - Closes on Escape / backdrop click, locks body scroll, restores focus.
 * - Renders as a bottom sheet on small screens and a centred dialog on larger ones.
 * - Optional `footer` renders a sticky action bar.
 */
export default function Modal({ isOpen, onClose, title, description, children, footer, maxWidth = 'max-w-2xl' }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCloseRef.current?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center sm:p-6" onClick={onClose}>
          <div
            ref={panelRef}
            tabIndex={-1}
            className={`relative w-full ${maxWidth} flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white text-left shadow-lift border border-slate-200 animate-pop-in focus:outline-none`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile grab handle */}
            <div className="sm:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 sm:px-6 py-4">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">{title}</h3>
                {description && <p className="mt-0.5 text-xs sm:text-sm text-slate-500">{description}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1">{children}</div>

            {footer && (
              <div className="border-t border-slate-200 px-5 sm:px-6 py-3 bg-slate-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
