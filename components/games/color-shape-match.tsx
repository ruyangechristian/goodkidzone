'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n/context'

const shapes = ['circle', 'square', 'triangle', 'star', 'heart'] as const
const colors = [
  { name: 'red', en: 'Red', rw: 'Umutuku', hex: '#ef4444' },
  { name: 'blue', en: 'Blue', rw: 'Ubururu', hex: '#3b82f6' },
  { name: 'green', en: 'Green', rw: 'Icyatsi', hex: '#22c55e' },
  { name: 'yellow', en: 'Yellow', rw: 'Umuhondo', hex: '#eab308' },
  { name: 'purple', en: 'Purple', rw: 'Ibara ry\'umuhengeri', hex: '#a855f7' },
]

const shapeNames: Record<string, { en: string; rw: string }> = {
  circle: { en: 'Circle', rw: 'Uruziga' },
  square: { en: 'Square', rw: 'Ikwadarato' },
  triangle: { en: 'Triangle', rw: 'Mpandeshatu' },
  star: { en: 'Star', rw: 'Inyenyeri' },
  heart: { en: 'Heart', rw: 'Umutima' },
}

function ShapeSVG({ shape, color, size = 60 }: { shape: string; color: string; size?: number }) {
  switch (shape) {
    case 'circle':
      return <circle cx={size/2} cy={size/2} r={size/2 - 4} fill={color} />
    case 'square':
      return <rect x={4} y={4} width={size - 8} height={size - 8} rx={4} fill={color} />
    case 'triangle':
      return <polygon points={`${size/2},4 ${size - 4},${size - 4} 4,${size - 4}`} fill={color} />
    case 'star':
      const cx = size / 2, cy = size / 2, r = size / 2 - 6
      const points = Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180
        const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)} ${cx + r * 0.4 * Math.cos(innerAngle)},${cy + r * 0.4 * Math.sin(innerAngle)}`
      }).join(' ')
      return <polygon points={points} fill={color} />
    case 'heart':
      return <path d={`M${size/2} ${size - 8} C${size/2} ${size - 8} 4 ${size/2} 4 ${size/3} C4 ${size/6} ${size/2} 4 ${size/2} ${size/4} C${size/2} 4 ${size - 4} ${size/6} ${size - 4} ${size/3} C${size - 4} ${size/2} ${size/2} ${size - 8} ${size/2} ${size - 8}Z`} fill={color} />
    default:
      return null
  }
}

interface GridItem {
  shape: typeof shapes[number]
  color: typeof colors[number]
  id: number
}

export default function ColorShapeMatch() {
  const { t, locale } = useTranslation()
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [grid, setGrid] = useState<GridItem[]>([])
  const [target, setTarget] = useState<{ shape: typeof shapes[number]; color: typeof colors[number] } | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const generateRound = useCallback(() => {
    const items: GridItem[] = []
    const usedCombos = new Set<string>()

    for (let i = 0; i < 9; i++) {
      let shape: typeof shapes[number], color: typeof colors[number], key: string
      do {
        shape = shapes[Math.floor(Math.random() * shapes.length)]
        color = colors[Math.floor(Math.random() * colors.length)]
        key = `${shape}-${color.name}`
      } while (usedCombos.has(key))
      usedCombos.add(key)
      items.push({ shape, color, id: i })
    }

    const targetItem = items[Math.floor(Math.random() * items.length)]
    setGrid(items)
    setTarget({ shape: targetItem.shape, color: targetItem.color })
    setFeedback(null)
  }, [])

  useEffect(() => { generateRound() }, [generateRound])

  const handleClick = (item: GridItem) => {
    if (feedback || gameOver) return

    if (item.shape === target?.shape && item.color.name === target?.color.name) {
      setFeedback('correct')
      setScore(s => s + 10)
      setTimeout(() => {
        if (round >= 10) {
          setGameOver(true)
        } else {
          setRound(r => r + 1)
          generateRound()
        }
      }, 800)
    } else {
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 600)
    }
  }

  const restart = () => {
    setRound(1)
    setScore(0)
    setGameOver(false)
    generateRound()
  }

  if (gameOver) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{t('games.wellDone')}</h2>
          <p className="text-muted-foreground mb-2">{t('games.score')}: {score}/100</p>
          <div className="flex justify-center gap-1 my-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-3xl ${i < Math.ceil(score / 20) ? '' : 'opacity-20'}`}>⭐</span>
            ))}
          </div>
          <button onClick={restart} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:shadow-lg transition-all">
            {t('games.playAgain')}
          </button>
        </div>
      </main>
    )
  }

  const colorLabel = locale === 'rw' ? target?.color.rw : target?.color.en
  const shapeLabel = locale === 'rw' ? shapeNames[target?.shape || 'circle'].rw : shapeNames[target?.shape || 'circle'].en

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pt-20 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold">
            {t('games.round')} {round}/10
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold text-primary">
            {t('games.score')}: {score}
          </div>
        </div>

        {/* Target prompt */}
        <div className={`text-center mb-8 p-6 rounded-2xl transition-all ${
          feedback === 'correct' ? 'bg-green-100' : feedback === 'wrong' ? 'bg-red-100 animate-shake' : 'bg-white'
        } shadow-lg`}>
          <p className="text-lg font-bold text-foreground">
            {t('games.findThe')} <span style={{ color: target?.color.hex }}>{colorLabel}</span> {shapeLabel}!
          </p>
          {target && (
            <div className="flex justify-center mt-3">
              <svg width={50} height={50} viewBox="0 0 60 60">
                <ShapeSVG shape={target.shape} color={target.color.hex} />
              </svg>
            </div>
          )}
          {feedback === 'correct' && <p className="text-green-600 font-bold mt-2 text-lg">✅ {t('games.correct')}</p>}
          {feedback === 'wrong' && <p className="text-red-600 font-bold mt-2 text-lg">❌ {t('games.tryAgain')}</p>}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3">
          {grid.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className="aspect-square bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center active:scale-95"
            >
              <svg width={60} height={60} viewBox="0 0 60 60">
                <ShapeSVG shape={item.shape} color={item.color.hex} />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
