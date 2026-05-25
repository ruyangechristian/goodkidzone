'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from '@/lib/i18n/context'
import { Lock, Play, Volume2, VolumeX, ChevronLeft, RefreshCw, Star } from 'lucide-react'

// Interface for Canvas Confetti
interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

// ----------------------------------------------------
// Play Tone using Web Audio API
// ----------------------------------------------------
const playTone = (freq: number, type: OscillatorType, duration: number, delay = 0) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)

    gain.gain.setValueAtTime(0.12, ctx.currentTime + delay)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration)
  } catch (e) {
    console.error('[GKZ] Sound synthesis failed:', e)
  }
}

const playCorrectSound = () => {
  playTone(523.25, 'triangle', 0.25, 0)
  playTone(659.25, 'triangle', 0.35, 0.08)
}

const playWrongSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.35)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(250, ctx.currentTime)

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.35)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.35)
  } catch (e) {
    console.error('[GKZ] Sound sweep failed:', e)
  }
}

const playVictorySound = () => {
  playTone(523.25, 'sine', 0.2, 0)
  playTone(659.25, 'sine', 0.2, 0.07)
  playTone(783.99, 'sine', 0.2, 0.14)
  playTone(1046.50, 'sine', 0.45, 0.21)
}

// ----------------------------------------------------
// Data & SVGs
// ----------------------------------------------------
const allShapes = ['circle', 'square', 'triangle', 'star', 'heart'] as const
const allColors = [
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
  shape: typeof allShapes[number]
  color: typeof allColors[number]
  id: number
}

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
export default function ColorShapeMatch() {
  const { t, locale } = useTranslation()
  
  // Game states: 'map' | 'playing' | 'gameover'
  const [gameState, setGameState] = useState<'map' | 'playing' | 'gameover'>('map')
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1)
  
  // Current game states
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [grid, setGrid] = useState<GridItem[]>([])
  const [target, setTarget] = useState<{ shape: typeof allShapes[number]; color: typeof allColors[number] } | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  
  // Level unlocks notice popup
  const [showLevelUnlockMsg, setShowLevelUnlockMsg] = useState(false)

  // Canvas Refs for Confetti
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameIdRef = useRef<number | null>(null)

  // Load level from localStorage on mount
  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem('gkz_colorshape_unlocked_level')
      if (savedLevel) {
        setUnlockedLevel(parseInt(savedLevel, 10))
      }
    } catch (e) {
      console.error('[GKZ] Failed to load localStorage:', e)
    }
  }, [])

  // Background Audio Controller
  const [isMuted, setIsMuted] = useState(false)
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const audio = new Audio('/background-sound.mp3')
    audio.loop = true
    audio.volume = 0.12
    bgAudioRef.current = audio

    return () => {
      audio.pause()
      bgAudioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = bgAudioRef.current
    if (!audio) return

    if (gameState === 'playing' && !isMuted) {
      audio.play().catch(err => {
        console.log('[GKZ] Music autoplay was blocked or failed:', err)
      })
    } else {
      audio.pause()
    }
  }, [gameState, isMuted])

  // Confetti trigger function
  const triggerConfetti = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffed4a']
    const particles: ConfettiParticle[] = []

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 8 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      })
    }

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let active = false

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.22 // gravity
        p.vx *= 0.985 // drag
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        
        ctx.beginPath()
        ctx.roundRect(-p.size / 2, -p.size / 2, p.size, p.size, 3)
        ctx.fill()
        ctx.restore()

        if (p.y < canvas.height + 20) {
          active = true
        }
      })

      if (active) {
        animationFrameIdRef.current = requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animate()
  }, [])

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
    }
  }, [])

  // ----------------------------------------------------
  // Level configurations
  // ----------------------------------------------------
  const levels = [
    { 
      id: 1, 
      nameRw: "Urwego 1: Ibibanza", 
      nameEn: "Level 1: Novice", 
      descRw: "Shaka mu bishushanyo 6", 
      descEn: "Find among 6 items", 
      shapesCount: 4, colorsCount: 3, gridItems: 6, cols: 3,
      color: "bg-blue-400 border-blue-500 text-blue-800"
    },
    { 
      id: 2, 
      nameRw: "Urwego 2: Umusomyi", 
      nameEn: "Level 2: Apprentice", 
      descRw: "Shaka mu bishushanyo 9", 
      descEn: "Find among 9 items", 
      shapesCount: 5, colorsCount: 4, gridItems: 9, cols: 3,
      color: "bg-green-400 border-green-500 text-green-800"
    },
    { 
      id: 3, 
      nameRw: "Urwego 3: Ubwenge", 
      nameEn: "Level 3: Expert", 
      descRw: "Shaka mu bishushanyo 12", 
      descEn: "Find among 12 items", 
      shapesCount: 5, colorsCount: 5, gridItems: 12, cols: 4,
      color: "bg-purple-400 border-purple-500 text-purple-800"
    },
    { 
      id: 4, 
      nameRw: "Urwego 4: Intwari", 
      nameEn: "Level 4: Master", 
      descRw: "Shaka mu bishushanyo 16", 
      descEn: "Find among 16 items", 
      shapesCount: 5, colorsCount: 5, gridItems: 16, cols: 4,
      color: "bg-orange-400 border-orange-500 text-orange-800"
    }
  ]

  const activeLevel = levels.find(l => l.id === selectedLevel) || levels[0]

  // Generate individual round
  const generateRound = useCallback(() => {
    const items: GridItem[] = []
    const usedCombos = new Set<string>()

    const availableShapes = allShapes.slice(0, activeLevel.shapesCount)
    const availableColors = allColors.slice(0, activeLevel.colorsCount)

    // Ensure we don't try to generate more unique items than mathematically possible
    const maxCombinations = availableShapes.length * availableColors.length
    const numItems = Math.min(activeLevel.gridItems, maxCombinations)

    for (let i = 0; i < numItems; i++) {
      let shape: typeof allShapes[number], color: typeof allColors[number], key: string
      do {
        shape = availableShapes[Math.floor(Math.random() * availableShapes.length)]
        color = availableColors[Math.floor(Math.random() * availableColors.length)]
        key = `${shape}-${color.name}`
      } while (usedCombos.has(key))
      usedCombos.add(key)
      items.push({ shape, color, id: i })
    }

    const targetItem = items[Math.floor(Math.random() * items.length)]
    
    // Shuffle
    const shuffledItems = [...items].sort(() => Math.random() - 0.5)
    
    setGrid(shuffledItems)
    setTarget({ shape: targetItem.shape, color: targetItem.color })
    setFeedback(null)
    setSelectedItemId(null)
  }, [selectedLevel, activeLevel])

  // Trigger game start
  const startLevel = (lvlId: number) => {
    setSelectedLevel(lvlId)
    setRound(1)
    setScore(0)
    setFeedback(null)
    setSelectedItemId(null)
    setGameState('playing')
  }

  // Trigger question generation when round changes inside playing state
  useEffect(() => {
    if (gameState === 'playing') {
      generateRound()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, gameState])

  // Answer handler
  const handleClick = (item: GridItem) => {
    if (feedback) return 
    
    setSelectedItemId(item.id)
    
    let newScore = score
    if (item.shape === target?.shape && item.color.name === target?.color.name) {
      setFeedback('correct')
      playCorrectSound()
      triggerConfetti()
      newScore = score + 10
      setScore(newScore)
    } else {
      setFeedback('wrong')
      playWrongSound()
    }
    
    setTimeout(() => {
      if (round >= 10) {
        handleGameOver(newScore)
      } else {
        setRound(r => r + 1)
      }
    }, 1450)
  }

  // Handle Game Completion
  const handleGameOver = (finalScore: number) => {
    setGameState('gameover')
    
    if (finalScore >= 60) {
      playVictorySound()
      const nextLvl = selectedLevel + 1
      if (nextLvl <= 4 && nextLvl > unlockedLevel) {
        setUnlockedLevel(nextLvl)
        setShowLevelUnlockMsg(true)
        try {
          localStorage.setItem('gkz_colorshape_unlocked_level', String(nextLvl))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }

  const restart = () => {
    setGameState('map')
    setShowLevelUnlockMsg(false)
  }

  // ----------------------------------------------------
  // View 1: Level Map Selection Screen
  // ----------------------------------------------------
  if (gameState === 'map') {
    return (
      <main className="min-h-[85vh] bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 bg-pattern-doodles flex items-center justify-center">
        <div className="max-w-xl w-full bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl p-8 md:p-10 shadow-2xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-pink-300 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white animate-bounce">
            🎨
          </div>

          <div className="text-center mt-6 mb-10">
            <h2 className="text-3xl font-black text-purple-800 uppercase tracking-wide">
              {t('games.colorShapeMatch')}
            </h2>
            <p className="text-muted-foreground font-semibold mt-1">
              {locale === 'rw' ? 'Hitamo Urwego ufungure ibishya!' : 'Unlock levels as you prove your matching skills!'}
            </p>
          </div>

          {/* Level List */}
          <div className="space-y-5 relative">
            {levels.map((lvl) => {
              const isUnlocked = lvl.id <= unlockedLevel
              return (
                <div 
                  key={lvl.id}
                  className={`flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-card border-purple-200 shadow-md hover:shadow-xl hover:-translate-y-0.5' 
                      : 'bg-muted/40 border-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shadow-inner ${
                      isUnlocked ? lvl.color.split(' ')[0] + ' text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      {lvl.id}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-foreground text-lg">
                        {locale === 'rw' ? lvl.nameRw : lvl.nameEn}
                      </h4>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                        {locale === 'rw' ? lvl.descRw : lvl.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isUnlocked ? (
                      <button
                        onClick={() => startLevel(lvl.id)}
                        className="px-6 py-3 bg-secondary text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Play size={14} fill="currentColor" />
                        {locale === 'rw' ? 'Tangira' : 'Play'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider border">
                        <Lock size={12} />
                        {locale === 'rw' ? 'Hagaritswe' : 'Locked'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    )
  }

  // ----------------------------------------------------
  // View 2: Victory / Game Over Screen
  // ----------------------------------------------------
  if (gameState === 'gameover') {
    const passed = score >= 60

    return (
      <main className="min-h-[85vh] bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4 bg-pattern-shapes">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400" />
          
          <div className="text-7xl mb-4 animate-bounce mt-4">
            {passed ? '🎊' : '💪'}
          </div>

          <h2 className="text-3xl font-black text-purple-900 mb-2">
            {passed ? t('games.excellent') : t('games.keepTrying')}
          </h2>
          
          <p className="text-xl font-extrabold text-foreground mb-1">
            {locale === 'rw' ? activeLevel.nameRw : activeLevel.nameEn}
          </p>
          <p className="text-muted-foreground font-black text-md uppercase tracking-wider mb-6">
            {t('games.score')}: <span className="text-purple-600 text-lg font-black">{score}</span>/100
          </p>

          <div className="flex justify-center gap-1.5 my-6">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-4xl transition-all duration-500 transform ${
                i < Math.ceil(score / 20) ? 'scale-110 drop-shadow' : 'opacity-20 scale-90'
              }`}>⭐</span>
            ))}
          </div>

          {/* Level unlocked message */}
          {passed && showLevelUnlockMsg && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8 text-yellow-900 font-bold text-sm leading-relaxed animate-pulse">
              🏆 {locale === 'rw' 
                ? 'Wabikoze neza cyane! Urwego rukurikira rwafunguwe!' 
                : 'Spectacular job! The next level is now fully unlocked!'}
            </div>
          )}

          {!passed && (
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-8 text-red-900 font-bold text-xs leading-relaxed">
              💡 {locale === 'rw' 
                ? 'Gira amanota 60 cyangwa arenga kugirango ufungure urwego rukurikira!' 
                : 'Get 60 or more points to unlock the next level!'}
            </div>
          )}

          {/* Dual Action Buttons */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                if (score >= 60 && selectedLevel < 4) {
                  startLevel(selectedLevel + 1)
                }
              }} 
              disabled={score < 60 || selectedLevel === 4}
              className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                score < 60 || selectedLevel === 4
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl active:scale-95 cursor-pointer'
              }`}
            >
              <Play size={20} fill={score < 60 || selectedLevel === 4 ? "none" : "currentColor"} />
              {locale === 'rw' ? 'KINA URUKURIKIRA' : 'PLAY NEXT LEVEL'}
              {score < 60 && <Lock size={16} className="ml-1" />}
            </button>

            <button 
              onClick={() => startLevel(selectedLevel)} 
              className="w-full py-4 border-2 border-purple-200 hover:border-purple-300 text-purple-700 bg-white rounded-2xl font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <RefreshCw size={20} />
              {locale === 'rw' ? 'ONGERA UKINE' : 'RETRY AGAIN'}
            </button>

            <button 
              onClick={restart} 
              className="w-full py-2.5 text-purple-500 hover:text-purple-700 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer mt-1"
            >
              {locale === 'rw' ? 'SUBIRA KU MAPU' : 'BACK TO MAP'}
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ----------------------------------------------------
  // View 3: Playing Game View
  // ----------------------------------------------------
  const colorLabel = locale === 'rw' ? target?.color.rw : target?.color.en
  const shapeLabel = locale === 'rw' ? shapeNames[target?.shape || 'circle'].rw : shapeNames[target?.shape || 'circle'].en

  return (
    <main className="min-h-[85vh] bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4 relative overflow-hidden flex items-center justify-center bg-pattern-doodles">
      
      {/* Dynamic Overlay Confetti Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-40" />

      <div className="max-w-xl w-full relative z-10">
        
        {/* Game Navigation Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGameState('map')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/90 hover:bg-white text-purple-700 border border-purple-100 rounded-full font-extrabold text-xs uppercase tracking-wider shadow active:scale-95 transition-all pointer-events-auto cursor-pointer"
            >
              <ChevronLeft size={14} />
              {locale === 'rw' ? 'Hagarika' : 'Exit'}
            </button>
            
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="flex items-center justify-center p-2.5 bg-white/90 hover:bg-white text-purple-700 border border-purple-100 rounded-full shadow active:scale-95 transition-all cursor-pointer pointer-events-auto"
              title={isMuted ? (locale === 'rw' ? 'Fungura umuziki' : 'Unmute music') : (locale === 'rw' ? 'Bika umuziki' : 'Mute music')}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-purple-100 text-purple-900 border border-purple-200 rounded-full font-black text-xs uppercase tracking-wider shadow-sm">
              {locale === 'rw' ? 'Urwego' : 'Level'} {selectedLevel}
            </span>
            <span className="px-4 py-2 bg-white rounded-full font-black text-xs text-muted-foreground shadow-sm uppercase">
              {t('games.round')} {round}/10
            </span>
          </div>
        </div>

        {/* Target prompt */}
        <div className={`text-center mb-8 p-6 rounded-3xl transition-all duration-300 border ${
          feedback === 'correct' 
            ? 'bg-green-50 border-green-200 shadow-green-100/50 shadow-lg' 
            : feedback === 'wrong' 
            ? 'bg-red-50 border-red-200 shadow-red-100/50 shadow-lg animate-shake' 
            : 'bg-white border-purple-100 shadow-purple-100/20 shadow-lg'
        }`}>
          <p className="text-xl font-bold text-foreground">
            {t('games.findThe')} <span className="font-black" style={{ color: target?.color.hex }}>{colorLabel}</span> <span className="font-black">{shapeLabel}</span>!
          </p>
          
          <div className="flex justify-center mt-4">
            {target && (
              <div className="bg-gray-100/50 p-4 rounded-2xl inline-block border border-gray-100">
                <svg width={60} height={60} viewBox="0 0 60 60">
                  <ShapeSVG shape={target.shape} color={target.color.hex} />
                </svg>
              </div>
            )}
          </div>
          
          {feedback === 'correct' && <p className="text-green-600 font-extrabold mt-4 text-sm animate-bounce">✅ {t('games.correct')}</p>}
          {feedback === 'wrong' && <p className="text-red-600 font-extrabold mt-4 text-sm animate-pulse">❌ {t('games.tryAgain')}</p>}
          {!feedback && <div className="w-16 h-1 bg-purple-200 mx-auto rounded-full mt-4 opacity-50" />}
        </div>

        {/* Grid */}
        <div className={`grid gap-3 ${activeLevel.cols === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {grid.map((item) => {
            const isSelected = selectedItemId === item.id
            const isCorrectAnswer = target && item.shape === target.shape && item.color.name === target.color.name
            
            let btnStyle = 'bg-white hover:shadow-xl hover:scale-105 border border-purple-100 shadow-md'
            
            if (feedback === 'correct') {
              if (isCorrectAnswer) {
                btnStyle = 'bg-green-100 border-2 border-green-500 scale-105 shadow-green-200 shadow-lg animate-bounce'
              }
            } else if (feedback === 'wrong') {
              if (isCorrectAnswer) {
                btnStyle = 'bg-green-100 border-2 border-green-500 shadow-lg'
              } else if (isSelected) {
                btnStyle = 'bg-red-100 border-2 border-red-500 scale-95 animate-shake'
              }
            }

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                disabled={feedback !== null}
                className={`aspect-square rounded-2xl transition-all duration-300 flex items-center justify-center active:scale-95 cursor-pointer ${btnStyle}`}
              >
                <svg width={activeLevel.cols === 3 ? 60 : 45} height={activeLevel.cols === 3 ? 60 : 45} viewBox="0 0 60 60">
                  <ShapeSVG shape={item.shape} color={item.color.hex} />
                </svg>
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
