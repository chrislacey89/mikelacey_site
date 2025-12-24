// =============================================================================
// Data Types
// =============================================================================

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

// =============================================================================
// Component Props
// =============================================================================

export interface WorkProps {
  /** List of production credits to display */
  credits: Credit[]
  /** Photos for the gallery grid */
  photos: Photo[]
  /** YouTube video interviews */
  interviews: Interview[]
  /** Called when user clicks a photo to view enlarged */
  onPhotoClick?: (id: string) => void
  /** Called when user clicks "Get in Touch" CTA */
  onNavigateToConnect?: () => void
}
