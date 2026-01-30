import { useState, useEffect, useRef } from 'react';
import type { Testimonial } from '../../types';
import { DocumentLightbox } from './DocumentLightbox';

interface DocumentGalleryProps {
  testimonials: Testimonial[];
}

export default function DocumentGallery({ testimonials }: DocumentGalleryProps) {
  const [selectedDoc, setSelectedDoc] = useState<Testimonial | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisibleItems(new Set(testimonials.map(t => t.id)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-testimonial-id');
            if (id) {
              setVisibleItems((prev) => new Set([...prev, id]));
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '50px' }
    );

    const items = containerRef.current?.querySelectorAll('[data-testimonial-id]');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [testimonials]);

  return (
    <>
      <div
        ref={containerRef}
        className="award-gallery grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {testimonials.map((doc, index) => {
          const isVisible = visibleItems.has(doc.id);
          return (
            <button
              key={doc.id}
              data-testimonial-id={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="award-item group relative aspect-[3/4] overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-900"
              style={{
                '--reveal-delay': `${index * 0.1}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                transitionDelay: isVisible ? `var(--reveal-delay)` : '0s',
              } as React.CSSProperties}
            >
              {/* Spotlight effect */}
              <div className="absolute inset-0 z-0 spotlight-effect pointer-events-none" />

              {/* Gold frame */}
              <div className="absolute inset-0 z-10 pointer-events-none frame-border rounded-lg" />

              {/* Document image */}
              <div className="relative z-[5] w-full h-full p-3">
                <img
                  src={doc.src}
                  alt={doc.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover rounded-sm transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Hover overlay with caption */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-amber-400 text-xs font-medium uppercase tracking-wider">Recognition</span>
                  </div>
                  <p className="text-white text-sm font-medium">{doc.caption}</p>
                </div>
              </div>

              {/* Sparkle effect on hover */}
              <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="sparkle sparkle-1" />
                <div className="sparkle sparkle-2" />
                <div className="sparkle sparkle-3" />
              </div>
            </button>
          );
        })}
      </div>

      {selectedDoc && (
        <DocumentLightbox
          testimonial={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      <style>{`
        .award-gallery {
          --frame-gold: #b8860b;
          --frame-gold-light: #d4af37;
        }

        .award-item {
          background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .spotlight-effect {
          background: radial-gradient(
            ellipse 80% 60% at 50% 0%,
            rgba(255, 215, 0, 0.15) 0%,
            rgba(255, 215, 0, 0.05) 40%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.6s ease-out;
        }

        .award-item:hover .spotlight-effect,
        .award-item:focus .spotlight-effect {
          opacity: 1;
        }

        .frame-border {
          border: 3px solid var(--frame-gold);
          background: transparent;
          box-shadow:
            inset 0 0 0 1px rgba(255, 215, 0, 0.1),
            0 0 15px rgba(212, 175, 55, 0.2);
          transition: box-shadow 0.4s ease-out, border-color 0.4s ease-out;
        }

        .award-item:hover .frame-border,
        .award-item:focus .frame-border {
          box-shadow:
            inset 0 0 0 1px rgba(255, 215, 0, 0.2),
            0 0 25px rgba(212, 175, 55, 0.35),
            0 0 50px rgba(212, 175, 55, 0.15);
        }

        /* Sparkle animations */
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 6px 2px rgba(255, 215, 0, 0.8);
        }

        .sparkle-1 {
          top: 15%;
          right: 20%;
          animation: sparkle-float 2s ease-in-out infinite;
        }

        .sparkle-2 {
          top: 25%;
          left: 15%;
          animation: sparkle-float 2.3s ease-in-out 0.3s infinite;
        }

        .sparkle-3 {
          bottom: 30%;
          right: 15%;
          animation: sparkle-float 1.8s ease-in-out 0.6s infinite;
        }

        @keyframes sparkle-float {
          0%, 100% {
            opacity: 0;
            transform: scale(0) translateY(0);
          }
          50% {
            opacity: 1;
            transform: scale(1) translateY(-5px);
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .award-item {
            transition: none !important;
          }
          .spotlight-effect,
          .frame-border {
            transition: none !important;
          }
          .sparkle {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
