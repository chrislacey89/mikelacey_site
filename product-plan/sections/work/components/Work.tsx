import { useState } from 'react'
import type { WorkProps, Photo } from '../types'
import { PhotoLightbox } from './PhotoLightbox'

export function Work({
  credits,
  photos,
  interviews,
  onPhotoClick,
  onNavigateToConnect
}: WorkProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
    onPhotoClick?.(photo.id)
  }

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    return match ? match[1] : ''
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <header className="relative py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-stone-50 to-amber-50/30 dark:from-stone-900 dark:via-stone-900 dark:to-blue-950/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-600 dark:text-amber-400 font-medium tracking-wide uppercase text-sm mb-4">
            Portfolio
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-white mb-6 leading-tight">
            The Work
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            44 years of sports and entertainment productions across networks and platforms.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Credits Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white mb-8">
            Production Credits
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {credits.map((credit) => (
              <div
                key={credit.id}
                className="p-4 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <p className="font-semibold text-stone-900 dark:text-white">
                  {credit.name}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {credit.network}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Photo Gallery Section - Masonry Layout */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white mb-8">
            Behind the Scenes
          </h2>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handlePhotoClick(photo)}
                className="group relative w-full overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 break-inside-avoid"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm font-medium px-3 py-1 bg-black/50 rounded-full">
                    View
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Video Interviews Section */}
        <section className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white mb-8">
            Video Interviews
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700"
              >
                {/* YouTube Embed */}
                <div className="aspect-video bg-stone-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(interview.youtubeUrl)}`}
                    title={interview.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-stone-900 dark:text-white mb-1">
                    {interview.title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {interview.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <footer className="pt-12 md:pt-16 border-t border-stone-200 dark:border-stone-800">
          <div className="text-center">
            <p className="text-stone-600 dark:text-stone-400 text-lg mb-8">
              Interested in working together?
            </p>
            <button
              onClick={onNavigateToConnect}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-base transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
            >
              Get in Touch
            </button>
          </div>
        </footer>
      </main>

      {/* Lightbox */}
      <PhotoLightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  )
}
