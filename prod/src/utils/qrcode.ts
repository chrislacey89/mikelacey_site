import QRCode from 'qrcode';
import type { ContactInfo } from '../types';
import { generateVCard } from './vcard';

export async function generateVCardQR(contact: ContactInfo): Promise<string> {
  const vcard = generateVCard(contact);
  return QRCode.toDataURL(vcard, {
    width: 200,
    margin: 2,
    color: {
      dark: '#292524', // stone-800
      light: '#ffffff'
    }
  });
}
