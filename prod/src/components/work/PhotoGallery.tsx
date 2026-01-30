import { useState, useRef } from 'react';
import type { Photo } from '../../types';
import { PhotoLightbox } from './PhotoLightbox';

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<{ photo: Photo; index: number } | null>(null);
  const [loupePosition, setLoupePosition] = useState({ x: 0, y: 0, visible: false, photoId: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, photoId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLoupePosition({ x, y, visible: true, photoId });
  };

  const handleMouseLeave = () => {
    setLoupePosition(prev => ({ ...prev, visible: false }));
  };

  const formatFrameNumber = (index: number): string => {
    return `BTS-${String(index + 1).padStart(3, '0')}`;
  };

  return (
    <>
      <div className="contact-sheet-gallery" ref={containerRef}>
        {/* Light table surface */}
        <div className="light-table">
          <div className="light-table-glow" aria-hidden="true" />

          {/* Film strip grid */}
          <div className="film-strip-grid">
            {photos.map((photo, index) => (
              <div key={photo.id} className="film-frame-wrapper">
                {/* Sprocket holes - left side */}
                <div className="sprocket-strip left" aria-hidden="true">
                  <div className="sprocket-hole" />
                  <div className="sprocket-hole" />
                  <div className="sprocket-hole" />
                </div>

                {/* Main frame */}
                <button
                  onClick={() => setSelectedPhoto({ photo, index: index + 1 })}
                  onMouseMove={(e) => handleMouseMove(e, photo.id)}
                  onMouseLeave={handleMouseLeave}
                  className="film-frame"
                >
                  {/* Frame number */}
                  <span className="frame-number">{formatFrameNumber(index)}</span>

                  {/* Photo container */}
                  <div className="photo-container">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="contact-photo"
                    />

                    {/* Loupe magnifier */}
                    {loupePosition.visible && loupePosition.photoId === photo.id && (
                      <div
                        className="loupe"
                        style={{
                          left: loupePosition.x - 50,
                          top: loupePosition.y - 50,
                          backgroundImage: `url(${photo.src})`,
                          backgroundPosition: `${-loupePosition.x * 2 + 50}px ${-loupePosition.y * 2 + 50}px`,
                          backgroundSize: '400%',
                        }}
                        aria-hidden="true"
                      />
                    )}

                    {/* Selection overlay */}
                    <div className="selection-overlay">
                      <div className="selection-corner tl" />
                      <div className="selection-corner tr" />
                      <div className="selection-corner bl" />
                      <div className="selection-corner br" />
                      <span className="select-text">SELECT</span>
                    </div>
                  </div>

                  {/* Caption/credit */}
                  <div className="frame-caption">
                    <span className="caption-text">{photo.caption}</span>
                  </div>
                </button>

                {/* Sprocket holes - right side */}
                <div className="sprocket-strip right" aria-hidden="true">
                  <div className="sprocket-hole" />
                  <div className="sprocket-hole" />
                  <div className="sprocket-hole" />
                </div>
              </div>
            ))}
          </div>

          {/* Light table controls */}
          <div className="light-table-controls" aria-hidden="true">
            <div className="control-indicator">
              <span className="indicator-dot" />
              <span className="indicator-label">LIGHT TABLE ACTIVE</span>
            </div>
            <span className="frame-count">{photos.length} FRAMES</span>
          </div>
        </div>
      </div>

      {selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto.photo}
          photoIndex={selectedPhoto.index}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      <style>{`
        .contact-sheet-gallery {
          font-family: var(--font-mono);
        }

        .light-table {
          position: relative;
          background: var(--color-light-table);
          border-radius: 8px;
          padding: 2rem;
          overflow: hidden;
        }

        .light-table-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.03) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .film-strip-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .film-frame-wrapper {
          display: flex;
          align-items: stretch;
        }

        /* Sprocket strips */
        .sprocket-strip {
          width: 16px;
          background: var(--color-film-base);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 8px 0;
          flex-shrink: 0;
        }

        .sprocket-strip.left {
          border-radius: 4px 0 0 4px;
        }

        .sprocket-strip.right {
          border-radius: 0 4px 4px 0;
        }

        .sprocket-hole {
          width: 8px;
          height: 12px;
          margin: 0 auto;
          background: var(--color-sprocket-hole);
          border-radius: 2px;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        /* Film frame */
        .film-frame {
          flex: 1;
          background: var(--color-film-frame);
          border: none;
          padding: 0;
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease;
        }

        .film-frame:hover {
          transform: scale(1.02);
        }

        .film-frame:focus {
          outline: 2px solid var(--color-loupe-border);
          outline-offset: 2px;
        }

        /* Frame number */
        .frame-number {
          position: absolute;
          top: 4px;
          left: 8px;
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--color-frame-number);
          z-index: 2;
        }

        /* Photo container */
        .photo-container {
          position: relative;
          padding: 20px 12px 8px;
          background: #fff;
          margin: 8px;
          overflow: hidden;
        }

        :global(.dark) .photo-container {
          background: #fff;
        }

        .contact-photo {
          width: 100%;
          height: auto;
          display: block;
          filter: grayscale(20%) contrast(1.05);
          transition: filter 0.3s ease;
        }

        .film-frame:hover .contact-photo {
          filter: grayscale(0%) contrast(1);
        }

        /* Loupe magnifier */
        .loupe {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 3px solid var(--color-loupe-border);
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
          pointer-events: none;
          z-index: 10;
          background-repeat: no-repeat;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .film-frame:hover .loupe {
          opacity: 1;
        }

        /* Selection overlay */
        .selection-overlay {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .film-frame:hover .selection-overlay {
          opacity: 1;
        }

        .selection-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--color-loupe-border);
        }

        .selection-corner.tl {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }

        .selection-corner.tr {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }

        .selection-corner.bl {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
        }

        .selection-corner.br {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }

        .select-text {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--color-loupe-border);
          background: rgba(0, 0, 0, 0.8);
          padding: 0.25rem 0.5rem;
        }

        /* Frame caption */
        .frame-caption {
          padding: 8px;
          background: var(--color-film-base);
        }

        .caption-text {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #888;
          display: block;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Light table controls */
        .light-table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #2a2a2a;
        }

        .control-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .indicator-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #22c55e;
        }

        .frame-count {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #666;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 8px #22c55e;
          }
          50% {
            opacity: 0.6;
            box-shadow: 0 0 16px #22c55e;
          }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .light-table {
            padding: 1rem;
          }

          .film-strip-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .sprocket-strip {
            width: 12px;
          }

          .sprocket-hole {
            width: 6px;
            height: 10px;
          }

          .loupe {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .indicator-dot {
            animation: none;
          }

          .film-frame:hover {
            transform: none;
          }

          .loupe {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
