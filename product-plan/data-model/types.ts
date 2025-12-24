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
  youtubeUrl: string
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
