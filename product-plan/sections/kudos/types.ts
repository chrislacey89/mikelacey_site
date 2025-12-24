// =============================================================================
// Data Types
// =============================================================================

export interface Testimonial {
  id: string
  src: string
  alt: string
  caption: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface KudosProps {
  /** List of attaboy documents to display in the gallery */
  testimonials: Testimonial[]
  /** Called when user clicks a document to view enlarged */
  onDocumentClick?: (id: string) => void
  /** Called when user clicks "Get in Touch" CTA */
  onNavigateToConnect?: () => void
}
