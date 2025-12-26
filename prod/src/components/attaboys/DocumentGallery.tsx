import { useState } from 'react';
import type { Testimonial } from '../../types';
import { DocumentLightbox } from './DocumentLightbox';

interface DocumentGalleryProps {
  testimonials: Testimonial[];
}

export default function DocumentGallery({ testimonials }: DocumentGalleryProps) {
  const [selectedDoc, setSelectedDoc] = useState<Testimonial | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-white dark:bg-stone-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <img
              src={doc.src}
              alt={doc.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-medium">{doc.caption}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedDoc && (
        <DocumentLightbox
          testimonial={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </>
  );
}
