import type { StoryProps } from '../types'
import { TimelineEra } from './TimelineEra'

export function Story({
  timelineEvents,
  onNavigateToWork,
  onNavigateToConnect
}: StoryProps) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Hero Header */}
      <header className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-stone-50 to-amber-50/30 dark:from-stone-900 dark:via-stone-900 dark:to-blue-950/20" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] dark:opacity-[0.02]">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-10 right-40 w-64 h-64 rounded-full bg-amber-500 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-600 dark:text-amber-400 font-medium tracking-wide uppercase text-sm mb-4">
            The Journey
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-white mb-6 leading-tight">
            44 Years Behind<br className="hidden sm:block" /> the Camera
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            From the shipping department at National Video Center to directing PGA Tour golf—a story of persistence, passion, and never giving up on the dream.
          </p>
        </div>
      </header>

      {/* Timeline Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="space-y-0">
          {timelineEvents.map((event, index) => (
            <TimelineEra
              key={event.id}
              event={event}
              isLast={index === timelineEvents.length - 1}
            />
          ))}
        </div>

        {/* CTAs */}
        <footer className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-stone-200 dark:border-stone-800">
          <div className="text-center">
            <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
              Ready to see the work or start a conversation?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onNavigateToWork}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-base transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
              >
                See My Work
              </button>
              <button
                onClick={onNavigateToConnect}
                className="px-8 py-4 bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white rounded-lg font-semibold text-base transition-all duration-200 hover:bg-stone-300 dark:hover:bg-stone-700 active:scale-[0.98]"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
