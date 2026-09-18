import { useEffect } from 'react';
import type { Testimonial } from '../../types';
import { LIGHTBOX_SIZES } from '../../utils/gallery-sizes';

interface DocumentLightboxProps {
  testimonial: Testimonial;
  onClose: () => void;
}

export function DocumentLightbox({ testimonial, onClose }: DocumentLightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Backdrop and panel clicks are a mouse convenience only. Keyboard users
  // close with Escape (bound above) or the labelled Close button, so the
  // static-element handlers below add no path that lacks a keyboard equivalent.
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: see note above
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled on window
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: stops the backdrop handler, not an action */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: as above */}
      <div
        className="max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={testimonial.lightboxSrc ?? testimonial.src}
          srcSet={testimonial.lightboxSrcSet}
          sizes={testimonial.lightboxSrcSet ? LIGHTBOX_SIZES : undefined}
          alt={testimonial.alt}
          decoding="async"
          className="max-w-full max-h-[80vh] object-contain rounded-lg bg-white"
        />
        <p className="mt-4 text-white text-center text-lg">{testimonial.caption}</p>
      </div>
    </div>
  );
}
