import { useEffect } from 'react';
import type { Photo } from '../../types';
import { LIGHTBOX_SIZES } from '../../utils/gallery-sizes';

interface PhotoLightboxProps {
  photo: Photo;
  onClose: () => void;
}

export function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
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
        className="max-w-5xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.lightboxSrc ?? photo.src}
          srcSet={photo.lightboxSrcSet}
          sizes={photo.lightboxSrcSet ? LIGHTBOX_SIZES : undefined}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          decoding="async"
          /* The grid's thumbnail, already decoded in cache, painted underneath
             the full-size file. It fills the frame the overlay opens on, where
             before there was an empty box until the download finished — about
             700ms of nothing on a 4G connection. The full file covers it
             exactly once it arrives: same image, same `contain` geometry, so
             there is nothing to fade or swap.
             The dimensions are what make this work. Without them the element
             has no size until its own bytes land, and a background has nothing
             to paint into. */
          style={
            photo.thumbSrc
              ? {
                  backgroundImage: `url("${photo.thumbSrc}")`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }
              : undefined
          }
          className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg"
        />
        <p className="mt-4 text-white text-center text-lg">{photo.caption}</p>
      </div>
    </div>
  );
}
