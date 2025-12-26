import type { ContactInfo } from '../../types';
import { downloadVCard } from '../../utils/vcard';

interface QRCodeCardProps {
  contactInfo: ContactInfo;
  qrCodeDataUrl: string;
}

export default function QRCodeCard({ contactInfo, qrCodeDataUrl }: QRCodeCardProps) {
  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-6 sm:p-8 text-center">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
        Save My Contact
      </h2>
      <p className="text-stone-600 dark:text-stone-400 mb-6">
        Scan the QR code or download my contact card
      </p>

      {/* QR Code */}
      <div className="inline-block p-4 bg-white rounded-xl shadow-inner mb-6">
        <img src={qrCodeDataUrl} alt="Contact QR Code" className="w-48 h-48" />
      </div>

      {/* Contact Info Preview */}
      <div className="mb-6 text-sm text-stone-600 dark:text-stone-400">
        <p className="font-semibold text-stone-900 dark:text-white">{contactInfo.fullName}</p>
        <p>{contactInfo.title}</p>
      </div>

      {/* Download Button */}
      <button
        onClick={() => downloadVCard(contactInfo)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Contact
      </button>
    </div>
  );
}
