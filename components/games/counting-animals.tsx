'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/context'

const animals = ['🐱', '🐶', '🐦', '🐘', '🐸', '🐰', '🐻', '🦁', '🐮', '🐷']

export default function CountingAnimals() {
  const { t } = useTranslation()
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [count, setCount] = useState(0)
  const [animalEmoji, setAnimalEmoji] = useState('🐱')
  const [options, setOptions] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const generateRound = useCallback(() => {
    const max = round <= 4 ? 5 : round <= 7 ? 10 : 15
    const min = round <= 4 ? 1 : round <= 7 ? 3 : 6
    const correctCount = Math.floor(Math.random() * (max - min + 1)) + min
    const emoji = animals[Math.floor(Math.random() * animals.length)]

    const opts = new Set<number>()
    opts.add(correctCount)
    while (opts.size < 4) {
      const fake = correctCount + (Math.floor(Math.random() * 5) - 2)
      if (fake > 0 && fake !== correctCount) opts.add(fake)
    }

    setCount(correctCount)
    setAnimalEmoji(emoji)
    setOptions([...opts].sort(() => Math.random() - 0.5))
    setFeedback(null)
  }, [round])

  useEffect(() => { generateRound() }, [generateRound])

  const handleAnswer = (answer: number) => {
    if (feedback) return
    if (answer === count) {
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
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{t('games.excellent')}</h2>
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

  // Generate animal positions
  const animalPositions = Array.from({ length: count }, (_, i) => ({
    left: `${10 + Math.random() * 70}%`,
    top: `${10 + Math.random() * 60}%`,
    delay: `${i * 0.1}s`,
    rotation: Math.random() * 30 - 15,
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold">
            {t('games.round')} {round}/10
          </div>
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold text-primary">
            {t('games.score')}: {score}
          </div>
        </div>

        <div className={`text-center mb-6 p-4 rounded-2xl shadow-lg transition-all ${
          feedback === 'correct' ? 'bg-green-100' : feedback === 'wrong' ? 'bg-red-100' : 'bg-white'
        }`}>
          <p className="text-lg font-bold text-foreground">{t('games.howMany')}</p>
          {feedback === 'correct' && <p className="text-green-600 font-bold mt-1">✅ {t('games.correct')}</p>}
          {feedback === 'wrong' && <p className="text-red-600 font-bold mt-1">❌ {t('games.tryAgain')}</p>}
        </div>

        {/* Animal Scene */}
        <div className="relative bg-gradient-to-b from-sky-200 to-green-200 rounded-3xl h-64 mb-8 overflow-hidden shadow-inner">
          {/* Grass */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-green-300 rounded-b-3xl" />
          {/* Sun */}
          <div className="absolute top-4 right-6 text-4xl">☀️</div>
          {/* Cloud */}
          <div className="absolute top-6 left-8 text-2xl">☁️</div>
          {/* Animals */}
          {animalPositions.map((pos, i) => (
            <span
              key={i}
              className="absolute text-3xl animate-bounce"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.delay,
                animationDuration: '2s',
                transform: `rotate(${pos.rotation}deg)`,
              }}
            >
              {animalEmoji}
            </span>
          ))}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              <span className="text-4xl font-bold text-foreground">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
