import QRCode from 'qrcode';
import { stegaClean } from '@sanity/client/stega';
import type { ContactInfo } from '../types';
import { generateVCard } from './vcard';

export async function generateVCardQR(contact: ContactInfo): Promise<string> {
  // Strip stega encoding (invisible chars from visual editing) before generating QR
  const cleanContact = stegaClean(contact) as ContactInfo;
  const vcard = generateVCard(cleanContact);
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
