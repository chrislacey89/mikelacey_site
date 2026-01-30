import type { ContactInfo } from '../../types';
import { downloadVCard } from '../../utils/vcard';

interface QRCodeCardProps {
  contactInfo: ContactInfo;
  qrCodeDataUrl: string;
}

export default function QRCodeCard({ contactInfo, qrCodeDataUrl }: QRCodeCardProps) {
  return (
    <div className="credential-badge">
      {/* Lanyard clip */}
      <div className="lanyard-clip" aria-hidden="true">
        <div className="clip-hole" />
        <div className="lanyard-strap" />
      </div>

      {/* Badge header */}
      <div className="badge-header">
        <span className="badge-type">PRODUCTION CREW</span>
        <div className="badge-stripe" />
      </div>

      {/* Badge content */}
      <div className="badge-content">
        {/* QR Code */}
        <div className="qr-container">
          <img src={qrCodeDataUrl} alt="Contact QR Code" />
          <div className="qr-corner tl" />
          <div className="qr-corner tr" />
          <div className="qr-corner bl" />
          <div className="qr-corner br" />
        </div>

        {/* Contact Info */}
        <div className="credential-info">
          <span className="credential-name">{contactInfo.fullName}</span>
          <span className="credential-title">{contactInfo.title}</span>
        </div>

        {/* Scan instruction */}
        <p className="scan-instruction">SCAN TO SAVE CONTACT</p>
      </div>

      {/* Badge footer */}
      <div className="badge-footer">
        <button
          onClick={() => downloadVCard(contactInfo)}
          className="download-button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          DOWNLOAD vCARD
        </button>
      </div>

      <style>{`
        .credential-badge {
          position: relative;
          background: linear-gradient(180deg, #f8f6f1 0%, #f0ede5 100%);
          border: 1px solid #d4d0c8;
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.08);
          font-family: var(--font-mono);
        }

        :global(.dark) .credential-badge {
          background: linear-gradient(180deg, #1c1a17 0%, #141210 100%);
          border-color: #2a2722;
        }

        /* Lanyard */
        .lanyard-clip {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .clip-hole {
          width: 24px;
          height: 12px;
          background: #666;
          border-radius: 3px 3px 0 0;
          position: relative;
        }

        .clip-hole::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 4px;
          background: #1e3a5f;
          border-radius: 2px;
        }

        .lanyard-strap {
          width: 20px;
          height: 16px;
          background: linear-gradient(90deg, #1e3a5f 0%, #2d5a8f 50%, #1e3a5f 100%);
          margin: 0 auto;
          position: relative;
          top: -1px;
        }

        /* Badge header */
        .badge-header {
          background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
          padding: 1.5rem 1rem 0.75rem;
          text-align: center;
        }

        .badge-type {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #d4af37;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }

        .badge-stripe {
          height: 3px;
          margin-top: 0.75rem;
          background: repeating-linear-gradient(
            90deg,
            #d4af37 0px,
            #d4af37 20px,
            transparent 20px,
            transparent 24px
          );
        }

        /* Badge content */
        .badge-content {
          padding: 1.5rem;
          text-align: center;
        }

        .qr-container {
          position: relative;
          display: inline-block;
          padding: 12px;
          background: #fff;
          border: 2px solid #1a1a1a;
          margin-bottom: 1rem;
        }

        :global(.dark) .qr-container {
          background: #fff;
        }

        .qr-container img {
          display: block;
          width: 140px;
          height: 140px;
        }

        .qr-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid #d4af37;
        }

        .qr-corner.tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
        .qr-corner.tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
        .qr-corner.bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
        .qr-corner.br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

        .credential-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .credential-name {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #1a1a1a;
          text-transform: uppercase;
        }

        :global(.dark) .credential-name {
          color: #f5f5f4;
        }

        .credential-title {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #666;
          text-transform: uppercase;
        }

        :global(.dark) .credential-title {
          color: #a8a29e;
        }

        .scan-instruction {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #888;
          margin: 0;
        }

        /* Badge footer */
        .badge-footer {
          padding: 0 1rem 1rem;
        }

        .download-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(180deg, #d4af37 0%, #b8960b 100%);
          border: none;
          border-radius: 4px;
          color: #1a1a1a;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .download-button:hover {
          background: linear-gradient(180deg, #e5c048 0%, #c9a71c 100%);
          transform: translateY(-1px);
        }

        .download-button:active {
          transform: translateY(0);
        }

        .download-button svg {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </div>
  );
}
