import QRCode from 'qrcode';
import type { ContactInfo } from '../types';
import { generateVCard } from './vcard';

export async function generateVCardQR(contact: ContactInfo): Promise<string> {
  const vcard = generateVCard(contact);
  return QRCode.toDataURL(vcard, {
    type: 'image/png',
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#292524', // stone-800
      light: '#ffffff'
    }
  });
}
