import type { ContactInfo } from '../types';

export function generateVCard(contact: ContactInfo): string {
  return `BEGIN:VCARD
VERSION:3.0
FN:${contact.fullName}
N:${contact.lastName};${contact.firstName};;;
TITLE:${contact.title}
TEL;TYPE=CELL:${contact.phone}
EMAIL:${contact.email}
URL:${contact.website}
URL;TYPE=LinkedIn:${contact.linkedin}
URL;TYPE=IMDb:${contact.imdb}
END:VCARD`;
}

export function downloadVCard(contact: ContactInfo): void {
  const vcard = generateVCard(contact);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${contact.firstName.toLowerCase()}-${contact.lastName.toLowerCase()}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
