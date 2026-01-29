// =============================================================================
// Core Entities
// =============================================================================

export interface TimelineEvent {
  id: string
  year: string
  title: string
  narrative: string
  photo: string | null
}

export interface Credit {
  id: string
  name: string
  network: string
}

export interface Photo {
  id: string
  src: string
  alt: string
  caption: string
}

export interface Interview {
  id: string
  title: string
  description: string
  videoType: 'youtube' | 'direct'
  youtubeUrl?: string
  directVideoUrl?: string
}

export interface Testimonial {
  id: string
  src: string
  alt: string
  caption: string
}

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

// =============================================================================
// Form Types
// =============================================================================

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

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

// =============================================================================
// Navigation Types
// =============================================================================

export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

export interface CTA {
  id: string
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

// =============================================================================
// Section-Specific Types
// =============================================================================

export interface Hero {
  backgroundImage: string
  headline: string
  tagline: string
}

export interface Profile {
  name: string
  title: string
  headshotImage: string
  subtitle: string
}

export interface SectionContent {
  title: string
  intro: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface HomeProps {
  hero: Hero
  profile: Profile
  ctas: CTA[]
  onNavigate?: (href: string) => void
}

export interface StoryProps {
  timelineEvents: TimelineEvent[]
  onNavigateToWork?: () => void
  onNavigateToConnect?: () => void
}

export interface WorkProps {
  credits: Credit[]
  photos: Photo[]
  interviews: Interview[]
  onPhotoClick?: (id: string) => void
  onNavigateToConnect?: () => void
}

export interface AttaboysProps {
  testimonials: Testimonial[]
  onDocumentClick?: (id: string) => void
  onNavigateToConnect?: () => void
}

export interface ConnectProps {
  contactInfo: ContactInfo
  professionalLinks: ProfessionalLink[]
  formFields: FormFields
  sectionContent: SectionContent
  onFormSubmit?: (data: ContactFormData) => void
  onDownloadVCard?: () => void
  onLinkClick?: (linkId: string) => void
}
