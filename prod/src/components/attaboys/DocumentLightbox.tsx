import { useEffect } from 'react';
import type { Testimonial } from '../../types';

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={testimonial.src}
          alt={testimonial.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg bg-white"
        />
        <p className="mt-4 text-white text-center text-lg">{testimonial.caption}</p>
      </div>
    </div>
  );
}
