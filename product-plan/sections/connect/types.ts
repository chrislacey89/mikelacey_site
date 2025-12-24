// =============================================================================
// Data Types
// =============================================================================

export interface ContactInfo {
  fullName: string
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  phoneDisplay: string
  website: string
  linkedin: string
  imdb: string
}

export interface ProfessionalLink {
  id: string
  type: 'imdb' | 'linkedin' | 'email' | 'phone'
  label: string
  url: string
  icon: 'film' | 'linkedin' | 'mail' | 'phone'
}

export interface FormField {
  label: string
  placeholder: string
  required: boolean
}

export interface FormFields {
  name: FormField
  email: FormField
  phone: FormField
  message: FormField
}

export interface SectionContent {
  title: string
  intro: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface ConnectProps {
  /** Mike's contact information for vCard */
  contactInfo: ContactInfo
  /** Professional profile and contact links */
  professionalLinks: ProfessionalLink[]
  /** Form field configuration */
  formFields: FormFields
  /** Section header content */
  sectionContent: SectionContent
  /** Called when user submits the contact form */
  onFormSubmit?: (data: ContactFormData) => void
  /** Called when user clicks download vCard button */
  onDownloadVCard?: () => void
  /** Called when user clicks a professional link */
  onLinkClick?: (linkId: string) => void
}
