import { useState } from 'react'
import type { KudosProps, Testimonial } from '../types'
import { DocumentLightbox } from './DocumentLightbox'

export function Kudos({
  testimonials,
  onDocumentClick,
  onNavigateToConnect
}: KudosProps) {
  const [selectedDocument, setSelectedDocument] = useState<Testimonial | null>(null)

  const handleDocumentClick = (doc: Testimonial) => {
    setSelectedDocument(doc)
    onDocumentClick?.(doc.id)
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-stone-50 to-amber-50/30 dark:from-stone-900 dark:via-stone-900 dark:to-blue-950/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-600 dark:text-amber-400 font-medium tracking-wide uppercase text-sm mb-4">
            Recognition
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-white mb-6 leading-tight">
            Kudos
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Thank-you notes, letters, and recognition from colleagues and industry professionals over four decades.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Masonry Gallery */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {testimonials.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleDocumentClick(doc)}
              className="group relative w-full overflow-hidden rounded-lg bg-white dark:bg-stone-800 shadow-md hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 break-inside-avoid"
            >
              <img
                src={doc.src}
                alt={doc.alt}
                className="w-full h-auto object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white text-sm font-medium px-4 py-2 bg-black/50 rounded-full">
                  View Document
                </span>
              </div>
              {/* Caption on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium truncate">
                  {doc.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA Section */}
        <footer className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-stone-200 dark:border-stone-800">
          <div className="text-center">
            <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
              Want to work together?
            </p>
            <button
              onClick={onNavigateToConnect}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-base transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
            >
              Get in Touch
            </button>
          </div>
        </footer>
      </main>

      {/* Lightbox */}
      <DocumentLightbox
        testimonial={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />
    </div>
  )
}
