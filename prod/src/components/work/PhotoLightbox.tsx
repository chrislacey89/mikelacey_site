import { useEffect, useState } from 'react';
import type { Photo } from '../../types';
import { ViewfinderOverlay } from '../global/ViewfinderOverlay';

interface PhotoLightboxProps {
  photo: Photo;
  photoIndex?: number;
  onClose: () => void;
}

export function PhotoLightbox({ photo, photoIndex = 1, onClose }: PhotoLightboxProps) {
  const [showViewfinder, setShowViewfinder] = useState(false);

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
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-20"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Viewfinder toggle hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs font-mono tracking-wider z-20">
        HOVER FOR COMPOSITION GUIDES
      </div>

      <div
        className="max-w-5xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative rounded-lg overflow-hidden cursor-crosshair"
          onMouseEnter={() => setShowViewfinder(true)}
          onMouseLeave={() => setShowViewfinder(false)}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            decoding="async"
            className="max-w-full max-h-[80vh] object-contain"
          />
          <ViewfinderOverlay
            visible={showViewfinder}
            scene="BTS"
            take={String(photoIndex)}
          />
        </div>
        <p className="mt-4 text-white text-center text-lg">{photo.caption}</p>
      </div>
    </div>
  );
}
