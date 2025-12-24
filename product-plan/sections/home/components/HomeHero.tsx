import type { HomeProps } from '../types'

export function HomeHero({ hero, profile, ctas, onNavigate }: HomeProps) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      >
        {/* Gradient overlay - lighter on left to show production rundown */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/60 to-stone-950/50 dark:from-stone-950/80 dark:via-stone-950/70 dark:to-stone-950/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Eyebrow */}
            <p className="text-amber-400 font-medium tracking-wide uppercase text-sm mb-4">
              {profile.subtitle}
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              {hero.headline}
            </h1>

            {/* Name & Title */}
            <div className="mb-6">
              <p className="text-2xl sm:text-3xl font-semibold text-white">
                {profile.name}
              </p>
              <p className="text-lg text-stone-300">
                {profile.title}
              </p>
            </div>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-stone-300 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {hero.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {ctas.map((cta) => (
                <button
                  key={cta.id}
                  onClick={() => onNavigate?.(cta.href)}
                  className={`
                    px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200
                    ${cta.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 active:scale-[0.98]'
                    }
                  `}
                >
                  {cta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Headshot */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-blue-500/20 to-amber-500/20 blur-xl" />

              {/* Headshot container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                <img
                  src={profile.headshotImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 rounded-full shadow-inner" />
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-2 -right-2 sm:bottom-4 sm:right-0 bg-amber-500 text-stone-950 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                44+ Years
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-950/50 to-transparent pointer-events-none" />
    </section>
  )
}
