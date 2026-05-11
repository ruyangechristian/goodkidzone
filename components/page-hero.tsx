'use client'

import WavyDivider from "./ui/wavy-divider"

interface PageHeroProps {
  title: string
  subtitle?: string
  gradient?: string
}

export default function PageHero({
  title,
  subtitle,
  gradient = 'from-primary via-primary/80 to-kids-purple',
}: PageHeroProps) {
  return (
    <section className={`relative py-16 md:py-28 bg-gradient-to-br ${gradient} text-white overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tighter leading-none animate-in slide-in-from-left duration-500">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl font-medium leading-relaxed animate-in slide-in-from-left duration-700">
            {subtitle}
          </p>
        )}
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/20 rounded-full blur-[80px] -z-0"></div>

      <WavyDivider color="var(--background)" position="bottom" />
    </section>
  )
}
