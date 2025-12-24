// =============================================================================
// Data Types
// =============================================================================

export interface TimelineEvent {
  id: string
  year: string
  title: string
  narrative: string
  photo: string | null
}

// =============================================================================
// Component Props
// =============================================================================

export interface StoryProps {
  /** The timeline events to display in chronological order */
  timelineEvents: TimelineEvent[]
  /** Called when user clicks "See My Work" CTA */
  onNavigateToWork?: () => void
  /** Called when user clicks "Get in Touch" CTA */
  onNavigateToConnect?: () => void
}
