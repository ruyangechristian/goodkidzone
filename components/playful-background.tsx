'use client'

/**
 * Playful SVG squiggle decorations for kid-friendly backgrounds.
 * Uses a single full-width SVG to guarantee even distribution across the section.
 */

interface PlayfulShapesProps {
  variant?: 'default' | 'alt' | 'minimal'
}

export default function PlayfulShapes({ variant = 'default' }: PlayfulShapesProps) {
  if (variant === 'alt') {
    return (
      <svg
        className="squiggle-layer"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Spiral — top-right */}
        <path d="M1100 80 Q1100 50 1120 50 Q1145 50 1145 80 Q1145 110 1110 110 Q1080 110 1080 75 Q1080 40 1120 40 Q1160 40 1160 80" fill="none" stroke="oklch(0.85 0.2 80)" strokeWidth="3" strokeLinecap="round" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" values="0 1120 80;360 1120 80" dur="30s" repeatCount="indefinite" />
        </path>

        {/* Zigzag — bottom-left */}
        <path d="M80 480 L120 440 L160 480 L200 440 L240 480 L280 440 L320 480" fill="none" stroke="oklch(0.75 0.22 150)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="5s" repeatCount="indefinite" />
        </path>

        {/* Star — center */}
        <path d="M720 280 L735 320 L775 320 L745 345 L755 385 L720 360 L685 385 L695 345 L665 320 L705 320 Z" fill="none" stroke="oklch(0.85 0.2 80)" strokeWidth="3" strokeLinejoin="round" opacity="0.45">
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="6s" repeatCount="indefinite" />
        </path>

        {/* Dotted circle — top-left */}
        <circle cx="200" cy="120" r="45" fill="none" stroke="oklch(0.7 0.2 300)" strokeWidth="3" strokeDasharray="8 6" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" values="0 200 120;360 200 120" dur="25s" repeatCount="indefinite" />
        </circle>

        {/* Wavy — bottom-right */}
        <path d="M950 500 Q1000 460 1050 500 Q1100 540 1150 500 Q1200 460 1250 500" fill="none" stroke="oklch(0.65 0.25 260)" strokeWidth="3.5" strokeLinecap="round" opacity="0.5">
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="4.5s" repeatCount="indefinite" />
        </path>

        {/* Dots */}
        <circle cx="500" cy="150" r="7" fill="oklch(0.75 0.25 350)" opacity="0.5" />
        <circle cx="900" cy="200" r="5" fill="oklch(0.85 0.2 80)" opacity="0.5" />
        <circle cx="400" cy="400" r="8" fill="oklch(0.65 0.25 260)" opacity="0.45" />
        <circle cx="1300" cy="350" r="6" fill="oklch(0.75 0.22 150)" opacity="0.5" />
        <circle cx="650" cy="520" r="9" fill="oklch(0.7 0.2 300)" opacity="0.45" />
      </svg>
    )
  }

  // Default variant
  return (
    <svg
      className="squiggle-layer"
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Wavy line — top-left */}
      <path d="M60 80 Q110 30 160 80 Q210 130 260 80 Q310 30 360 80 Q410 130 450 80" fill="none" stroke="oklch(0.65 0.25 260)" strokeWidth="3.5" strokeLinecap="round" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="5s" repeatCount="indefinite" />
      </path>

      {/* Spiral — top-right */}
      <path d="M1200 90 Q1200 60 1220 60 Q1245 60 1245 90 Q1245 120 1210 120 Q1180 120 1180 85 Q1180 50 1220 50 Q1260 50 1260 90 Q1260 135 1215 135" fill="none" stroke="oklch(0.75 0.25 350)" strokeWidth="3" strokeLinecap="round" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" values="0 1220 90;360 1220 90" dur="28s" repeatCount="indefinite" />
      </path>

      {/* Plus/cross — top-center */}
      <path d="M720 50 L720 110 M690 80 L750 80" fill="none" stroke="oklch(0.75 0.25 350)" strokeWidth="4" strokeLinecap="round" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="4s" repeatCount="indefinite" />
      </path>

      {/* Zigzag — middle-left */}
      <path d="M50 320 L90 270 L130 320 L170 270 L210 320 L250 270 L290 320 L330 270 L370 320" fill="none" stroke="oklch(0.85 0.2 80)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="5.5s" repeatCount="indefinite" />
      </path>

      {/* Dotted circle — center */}
      <circle cx="720" cy="310" r="55" fill="none" stroke="oklch(0.75 0.22 150)" strokeWidth="3" strokeDasharray="10 7" opacity="0.45">
        <animateTransform attributeName="transform" type="rotate" values="0 720 310;360 720 310" dur="25s" repeatCount="indefinite" />
      </circle>

      {/* Star — middle-right */}
      <path d="M1200 290 L1215 330 L1258 330 L1224 355 L1235 395 L1200 370 L1165 395 L1176 355 L1142 330 L1185 330 Z" fill="none" stroke="oklch(0.85 0.2 80)" strokeWidth="3" strokeLinejoin="round" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="6s" repeatCount="indefinite" />
      </path>

      {/* Triangle — bottom-left */}
      <path d="M180 500 L250 420 L320 500 Z" fill="none" stroke="oklch(0.65 0.25 260)" strokeWidth="3" strokeLinejoin="round" opacity="0.45">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="5s" repeatCount="indefinite" />
      </path>

      {/* Wavy — bottom-center */}
      <path d="M550 520 Q600 480 650 520 Q700 560 750 520 Q800 480 850 520 Q900 560 950 520" fill="none" stroke="oklch(0.7 0.2 300)" strokeWidth="3.5" strokeLinecap="round" opacity="0.45">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="4.5s" repeatCount="indefinite" />
      </path>

      {/* Curly swoosh — bottom-right */}
      <path d="M1100 530 Q1150 470 1200 510 Q1250 550 1300 490 Q1330 465 1370 490" fill="none" stroke="oklch(0.75 0.25 350)" strokeWidth="3" strokeLinecap="round" opacity="0.5">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="5s" repeatCount="indefinite" />
      </path>

      {/* Scattered dots across entire canvas */}
      <circle cx="450" cy="130" r="8" fill="oklch(0.75 0.25 350)" opacity="0.5" />
      <circle cx="950" cy="100" r="6" fill="oklch(0.7 0.2 300)" opacity="0.5" />
      <circle cx="550" cy="380" r="9" fill="oklch(0.85 0.2 80)" opacity="0.45" />
      <circle cx="1050" cy="450" r="7" fill="oklch(0.75 0.22 150)" opacity="0.5" />
      <circle cx="300" cy="200" r="6" fill="oklch(0.65 0.25 260)" opacity="0.5" />
      <circle cx="850" cy="530" r="8" fill="oklch(0.75 0.25 350)" opacity="0.45" />
      <circle cx="1350" cy="200" r="5" fill="oklch(0.85 0.2 80)" opacity="0.5" />
      <circle cx="150" cy="450" r="7" fill="oklch(0.7 0.2 300)" opacity="0.45" />
    </svg>
  )
}
