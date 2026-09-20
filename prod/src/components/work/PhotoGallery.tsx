import { useState } from 'react';
import type { Photo } from '../../types';
import { GALLERY_GRID_SIZES, LIGHTBOX_SIZES } from '../../utils/gallery-sizes';
import { prefetchImage } from '../../utils/prefetch-image';
import { PhotoLightbox } from './PhotoLightbox';

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Hover, keyboard focus and the touch that starts a tap all land before the
  // click, so the lightbox's file is already in flight by the time it opens.
  const warm = (photo: Photo) =>
    prefetchImage(photo.lightboxSrc, photo.lightboxSrcSet, LIGHTBOX_SIZES);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((photo) => (
          <button
            type="button"
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            onPointerEnter={() => warm(photo)}
            onFocus={() => warm(photo)}
            onTouchStart={() => warm(photo)}
            className="group relative w-full overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 break-inside-avoid"
          >
            <img
              src={photo.thumbSrc ?? photo.src}
              srcSet={photo.thumbSrcSet}
              sizes={photo.thumbSrcSet ? GALLERY_GRID_SIZES : undefined}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-medium">{photo.caption}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </>
  );
}
