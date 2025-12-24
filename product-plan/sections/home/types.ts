// =============================================================================
// Data Types
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

export interface CTA {
  id: string
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

// =============================================================================
// Component Props
// =============================================================================

export interface HomeProps {
  /** Hero section content including background image and headline */
  hero: Hero
  /** Mike's profile information (name, title, headshot) */
  profile: Profile
  /** Call-to-action buttons */
  ctas: CTA[]
  /** Called when user clicks a CTA button */
  onNavigate?: (href: string) => void
}
