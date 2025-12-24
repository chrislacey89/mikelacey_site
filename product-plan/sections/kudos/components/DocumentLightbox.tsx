import { useEffect } from 'react'
import type { Testimonial } from '../types'

interface DocumentLightboxProps {
  testimonial: Testimonial | null
  onClose: () => void
}

export function DocumentLightbox({ testimonial, onClose }: DocumentLightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (testimonial) {
      window.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [testimonial, onClose])

  if (!testimonial) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Document container */}
      <div
        className="relative max-w-4xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={testimonial.src}
          alt={testimonial.alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white"
        />
        {/* Caption */}
        <p className="text-center text-white/80 mt-4 text-lg">
          {testimonial.caption}
        </p>
      </div>
    </div>
  )
}
