import { useState } from 'react';

/**
 * ViewfinderOverlay - Director's composition guides (React version)
 *
 * Visual elements:
 * - Rule of thirds grid (3x3)
 * - Center crosshair focus point
 * - Frame metadata ("SCENE X TAKE Y")
 * - Subtle vignette edge darkening
 */

interface ViewfinderOverlayProps {
  scene?: string;
  take?: string;
  aspectRatio?: '16:9' | '2.39:1' | '4:3' | 'auto';
  showGrid?: boolean;
  showCrosshair?: boolean;
  showMetadata?: boolean;
  showVignette?: boolean;
  visible?: boolean;
}

export function ViewfinderOverlay({
  scene = 'BTS',
  take = '1',
  aspectRatio = 'auto',
  showGrid = true,
  showCrosshair = true,
  showMetadata = true,
  showVignette = true,
  visible = false,
}: ViewfinderOverlayProps) {
  const formattedScene = scene.toUpperCase().padStart(3, ' ');
  const formattedTake = take.padStart(2, '0');

  return (
    <>
      <div
        className={`viewfinder-overlay-react ${visible ? 'visible' : ''}`}
        aria-hidden="true"
      >
        {/* Vignette effect */}
        {showVignette && <div className="vf-vignette" />}

        {/* Rule of thirds grid */}
        {showGrid && (
          <div className="vf-grid">
            <div className="vf-grid-line horizontal line-1" />
            <div className="vf-grid-line horizontal line-2" />
            <div className="vf-grid-line vertical line-1" />
            <div className="vf-grid-line vertical line-2" />
          </div>
        )}

        {/* Center crosshair */}
        {showCrosshair && (
          <div className="vf-crosshair">
            <div className="vf-crosshair-h" />
            <div className="vf-crosshair-v" />
            <div className="vf-crosshair-circle" />
          </div>
        )}

        {/* Frame corners */}
        <div className="vf-corners">
          <div className="vf-corner vf-corner-tl" />
          <div className="vf-corner vf-corner-tr" />
          <div className="vf-corner vf-corner-bl" />
          <div className="vf-corner vf-corner-br" />
        </div>

        {/* Frame metadata */}
        {showMetadata && (
          <div className="vf-metadata">
            <span className="vf-metadata-text">SCENE {formattedScene}</span>
            <span className="vf-metadata-text">TAKE {formattedTake}</span>
          </div>
        )}

        {/* Aspect ratio indicator */}
        {aspectRatio !== 'auto' && (
          <div className="vf-aspect">
            <span className="vf-aspect-text">{aspectRatio}</span>
          </div>
        )}

        {/* Safe area - inner frame guide */}
        <div className="vf-safe-area" />
      </div>

      <style>{`
        .viewfinder-overlay-react {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
          font-family: var(--font-mono);
          z-index: 10;
        }

        .viewfinder-overlay-react.visible {
          opacity: 1;
        }

        /* Vignette */
        .vf-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 50%,
            rgba(0, 0, 0, 0.4) 100%
          );
          pointer-events: none;
        }

        /* Grid */
        .vf-grid {
          position: absolute;
          inset: 0;
        }

        .vf-grid-line {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
          transform-origin: center;
        }

        .viewfinder-overlay-react.visible .vf-grid-line {
          animation: vf-grid-draw 0.3s ease-out forwards;
        }

        .vf-grid-line.horizontal {
          left: 0;
          right: 0;
          height: 1px;
        }

        .vf-grid-line.horizontal.line-1 {
          top: 33.33%;
          animation-delay: 0.05s;
        }

        .vf-grid-line.horizontal.line-2 {
          top: 66.66%;
          animation-delay: 0.1s;
        }

        .vf-grid-line.vertical {
          top: 0;
          bottom: 0;
          width: 1px;
          animation-name: vf-grid-draw-v;
        }

        .vf-grid-line.vertical.line-1 {
          left: 33.33%;
          animation-delay: 0.15s;
        }

        .vf-grid-line.vertical.line-2 {
          left: 66.66%;
          animation-delay: 0.2s;
        }

        @keyframes vf-grid-draw {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }

        @keyframes vf-grid-draw-v {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }

        /* Crosshair */
        .vf-crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          opacity: 0;
        }

        .viewfinder-overlay-react.visible .vf-crosshair {
          animation: vf-crosshair-appear 0.25s ease-out 0.15s both;
        }

        @keyframes vf-crosshair-appear {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        .vf-crosshair-h,
        .vf-crosshair-v {
          position: absolute;
          background: rgba(255, 255, 255, 0.7);
        }

        .vf-crosshair-h {
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          transform: translateY(-50%);
        }

        .vf-crosshair-v {
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          transform: translateX(-50%);
        }

        .vf-crosshair-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        /* Corners */
        .vf-corners {
          position: absolute;
          inset: 12px;
        }

        .vf-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: rgba(255, 255, 255, 0.6);
          border-style: solid;
          opacity: 0;
        }

        .viewfinder-overlay-react.visible .vf-corner {
          animation-duration: 0.2s;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }

        .vf-corner-tl {
          top: 0;
          left: 0;
          border-width: 2px 0 0 2px;
          animation-name: vf-corner-tl;
        }

        .vf-corner-tr {
          top: 0;
          right: 0;
          border-width: 2px 2px 0 0;
          animation-name: vf-corner-tr;
          animation-delay: 0.05s;
        }

        .vf-corner-bl {
          bottom: 0;
          left: 0;
          border-width: 0 0 2px 2px;
          animation-name: vf-corner-bl;
          animation-delay: 0.1s;
        }

        .vf-corner-br {
          bottom: 0;
          right: 0;
          border-width: 0 2px 2px 0;
          animation-name: vf-corner-br;
          animation-delay: 0.15s;
        }

        @keyframes vf-corner-tl {
          from { opacity: 0; transform: translate(-10px, -10px); }
          to { opacity: 1; transform: translate(0, 0); }
        }

        @keyframes vf-corner-tr {
          from { opacity: 0; transform: translate(10px, -10px); }
          to { opacity: 1; transform: translate(0, 0); }
        }

        @keyframes vf-corner-bl {
          from { opacity: 0; transform: translate(-10px, 10px); }
          to { opacity: 1; transform: translate(0, 0); }
        }

        @keyframes vf-corner-br {
          from { opacity: 0; transform: translate(10px, 10px); }
          to { opacity: 1; transform: translate(0, 0); }
        }

        /* Metadata */
        .vf-metadata {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1.5rem;
          opacity: 0;
        }

        .viewfinder-overlay-react.visible .vf-metadata {
          animation: vf-metadata-fade 0.25s ease-out 0.2s both;
        }

        @keyframes vf-metadata-fade {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .vf-metadata-text {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(0, 0, 0, 0.6);
          padding: 0.25rem 0.5rem;
          border-radius: 2px;
        }

        /* Aspect indicator */
        .vf-aspect {
          position: absolute;
          top: 16px;
          right: 16px;
          opacity: 0;
        }

        .viewfinder-overlay-react.visible .vf-aspect {
          animation: vf-aspect-fade 0.2s ease-out 0.1s both;
        }

        @keyframes vf-aspect-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .vf-aspect-text {
          font-size: 0.55rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.6);
          background: rgba(0, 0, 0, 0.5);
          padding: 0.2rem 0.4rem;
          border-radius: 2px;
        }

        /* Safe area */
        .vf-safe-area {
          position: absolute;
          inset: 5%;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          opacity: 0;
        }

        .viewfinder-overlay-react.visible .vf-safe-area {
          animation: vf-safe-area-in 0.3s ease-out 0.25s both;
        }

        @keyframes vf-safe-area-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .viewfinder-overlay-react {
            transition: none;
          }

          .viewfinder-overlay-react.visible .vf-grid-line,
          .viewfinder-overlay-react.visible .vf-crosshair,
          .viewfinder-overlay-react.visible .vf-corner,
          .viewfinder-overlay-react.visible .vf-metadata,
          .viewfinder-overlay-react.visible .vf-aspect,
          .viewfinder-overlay-react.visible .vf-safe-area {
            animation: none;
            opacity: 1;
            transform: none;
          }

          .viewfinder-overlay-react.visible .vf-metadata {
            transform: translateX(-50%);
          }

          .viewfinder-overlay-react.visible .vf-crosshair {
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
