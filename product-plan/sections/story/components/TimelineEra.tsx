import type { TimelineEvent } from '../types'

interface TimelineEraProps {
  event: TimelineEvent
  isLast: boolean
}

export function TimelineEra({ event, isLast }: TimelineEraProps) {
  return (
    <article className="relative grid md:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr] gap-6 md:gap-8 lg:gap-12">
      {/* Year Marker - Side on desktop, top on mobile */}
      <div className="md:text-right">
        <div className="inline-flex md:flex md:flex-col md:items-end gap-2 md:gap-1">
          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-500 dark:text-blue-400 tracking-tight">
            {event.year}
          </span>
          <span className="text-stone-500 dark:text-stone-400 text-sm font-medium uppercase tracking-wider md:tracking-widest">
            {event.title}
          </span>
        </div>
      </div>

      {/* Content Column */}
      <div className="relative">
        {/* Timeline line - only visible on md+ */}
        <div className="hidden md:block absolute -left-6 lg:-left-8 top-0 bottom-0 w-px">
          <div className="absolute top-2 w-3 h-3 -left-[5px] rounded-full bg-blue-500 dark:bg-blue-400 ring-4 ring-stone-50 dark:ring-stone-900" />
          {!isLast && (
            <div className="absolute top-6 bottom-0 left-0 w-px bg-gradient-to-b from-blue-500/40 to-stone-300/20 dark:from-blue-400/40 dark:to-stone-700/20" />
          )}
        </div>

        {/* Optional Photo */}
        {event.photo && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
            <img
              src={event.photo}
              alt={`${event.title} era`}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Narrative Content */}
        <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
          {event.narrative.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Spacing before next era */}
        {!isLast && <div className="h-12 md:h-16 lg:h-20" />}
      </div>
    </article>
  )
}
