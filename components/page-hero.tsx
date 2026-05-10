'use client'

interface PageHeroProps {
  title: string
  subtitle?: string
  gradient?: string
}

export default function PageHero({
  title,
  subtitle,
  gradient = 'from-primary via-accent to-red-500',
}: PageHeroProps) {
  return (
    <section className={`py-12 md:py-16 bg-gradient-to-r ${gradient} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{title}</h1>
        {subtitle && (
          <p className="text-xl opacity-90 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
