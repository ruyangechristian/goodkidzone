'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
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
// Word Database
// ----------------------------------------------------
const allWords = [
  // 3-4 letters
  { word: 'IGI', image: '🥚', en: 'Egg', rw: 'Igi' },
  { word: 'IFU', image: '🌾', en: 'Flour', rw: 'Ifu' },
  { word: 'ISAA', image: '⌚', en: 'Clock', rw: 'Isaa' },
  { word: 'INKA', image: '🐄', en: 'Cow', rw: 'Inka' },
  { word: 'INZU', image: '🏠', en: 'House', rw: 'Inzu' },
  // 5 letters
  { word: 'AMATA', image: '🥛', en: 'Milk', rw: 'Amata' },
  { word: 'AMAZI', image: '💧', en: 'Water', rw: 'Amazi' },
  { word: 'IZUBA', image: '☀️', en: 'Sun', rw: 'Izuba' },
  { word: 'IGITI', image: '🌳', en: 'Tree', rw: 'Igiti' },
  { word: 'IMBWA', image: '🐕', en: 'Dog', rw: 'Imbwa' },
  { word: 'ISUKA', image: '⛏️', en: 'Hoe', rw: 'Isuka' },
  { word: 'IBUYE', image: '🪨', en: 'Stone', rw: 'Ibuye' },
  { word: 'INGWE', image: '🐆', en: 'Leopard', rw: 'Ingwe' },
  { word: 'IGARE', image: '🚲', en: 'Bicycle', rw: 'Igare' },
  // 6 letters
  { word: 'UMWANA', image: '👶', en: 'Child', rw: 'Umwana' },
  { word: 'INYONI', image: '🐦', en: 'Bird', rw: 'Inyoni' },
  { word: 'IMBEBA', image: '🐁', en: 'Mouse', rw: 'Imbeba' },
  { word: 'INTARE', image: '🦁', en: 'Lion', rw: 'Intare' },
  { word: 'INKOKO', image: '🐔', en: 'Chicken', rw: 'Inkoko' },
  { word: 'ISHURI', image: '🏫', en: 'School', rw: 'Ishuri' },
  { word: 'INZOZI', image: '💭', en: 'Dream', rw: 'Inzozi' },
  { word: 'IJISHO', image: '👁️', en: 'Eye', rw: 'Ijisho' },
  // 7-8 letters
  { word: 'UMUGATI', image: '🍞', en: 'Bread', rw: 'Umugati' },
  { word: 'UMUSOZI', image: '⛰️', en: 'Mountain', rw: 'Umusozi' },
  { word: 'IMODOKA', image: '🚗', en: 'Car', rw: 'Imodoka' },
  { word: 'ISAHANI', image: '🍽️', en: 'Plate', rw: 'Isahani' },
  { word: 'IGITABO', image: '📖', en: 'Book', rw: 'Igitabo' },
  { word: 'IKARAMU', image: '🖊️', en: 'Pen', rw: 'Ikaramu' },
  { word: 'IKIBAHO', image: '⬛', en: 'Blackboard', rw: 'Ikibaho' },
  { word: 'INJANGWE', image: '🐱', en: 'Cat', rw: 'Injangwe' },
  { word: 'IFARANGA', image: '💰', en: 'Money', rw: 'Ifaranga' },
  { word: 'UMUKOBWA', image: '👧', en: 'Girl', rw: 'Umukobwa' },
  { word: 'UMUHUNGU', image: '👦', en: 'Boy', rw: 'Umuhungu' },
]

export default function WordBuilder() {
  const { t, locale } = useTranslation()
  
  // Game states: 'map' | 'playing' | 'gameover'
  const [gameState, setGameState] = useState<'map' | 'playing' | 'gameover'>('map')
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1)
  
  // Current game states
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [currentWord, setCurrentWord] = useState(allWords[0])
  const [scrambled, setScrambled] = useState<string[]>([])
  const [answer, setAnswer] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set())
  
  // Level unlocks notice popup
  const [showLevelUnlockMsg, setShowLevelUnlockMsg] = useState(false)

  // Canvas Refs for Confetti
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameIdRef = useRef<number | null>(null)

  // Load level from localStorage on mount
  useEffect(() => {
    try {
      const savedLevel = localStorage.getItem('gkz_wordbuilder_unlocked_level')
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
      descRw: "Amagambo magufi", 
      descEn: "Short words (3-4 letters)", 
      minLen: 3, maxLen: 4,
      color: "bg-blue-400 border-blue-500 text-blue-800"
    },
    { 
      id: 2, 
      nameRw: "Urwego 2: Umusomyi", 
      nameEn: "Level 2: Apprentice", 
      descRw: "Amagambo aringaniye", 
      descEn: "Medium words (5 letters)", 
      minLen: 5, maxLen: 5,
      color: "bg-green-400 border-green-500 text-green-800"
    },
    { 
      id: 3, 
      nameRw: "Urwego 3: Ubwenge", 
      nameEn: "Level 3: Expert", 
      descRw: "Amagambo maremare", 
      descEn: "Long words (6 letters)", 
      minLen: 6, maxLen: 6,
      color: "bg-purple-400 border-purple-500 text-purple-800"
    },
    { 
      id: 4, 
      nameRw: "Urwego 4: Intwari", 
      nameEn: "Level 4: Master", 
      descRw: "Amagambo agoye", 
      descEn: "Advanced words (7-8 letters)", 
      minLen: 7, maxLen: 8,
      color: "bg-orange-400 border-orange-500 text-orange-800"
    }
  ]

  const activeLevel = levels.find(l => l.id === selectedLevel) || levels[0]

  // Generate individual round
  const generateRound = useCallback(() => {
    const minL = activeLevel.minLen
    const maxL = activeLevel.maxLen
    
    // Filter words matching length criteria
    const levelWords = allWords.filter(w => w.word.length >= minL && w.word.length <= maxL)
    
    // Find words not yet used
    let availableIndices = levelWords.map((_, i) => i).filter(i => {
      // Find original index in allWords
      const originalIdx = allWords.findIndex(w => w.word === levelWords[i].word)
      return !usedWords.has(originalIdx)
    })
    
    // Reset if all used
    if (availableIndices.length === 0) {
      availableIndices = levelWords.map((_, i) => i)
      setUsedWords(new Set())
    }
    
    const randomLevelIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    const selectedWord = levelWords[randomLevelIdx]
    const originalIdx = allWords.findIndex(w => w.word === selectedWord.word)

    setCurrentWord(selectedWord)
    
    const targetText = locale === 'rw' ? selectedWord.rw.toUpperCase() : selectedWord.en.toUpperCase()

    // Scramble letters, ensuring they aren't exactly in order
    let chars = targetText.split('')
    let scrambledChars = [...chars].sort(() => Math.random() - 0.5)
    
    // If it accidentally sorted correctly, swap two letters
    if (scrambledChars.join('') === targetText && chars.length > 1) {
      const temp = scrambledChars[0]
      scrambledChars[0] = scrambledChars[1]
      scrambledChars[1] = temp
    }

    setScrambled(scrambledChars)
    setAnswer(new Array(targetText.length).fill(''))
    setFeedback(null)
    setUsedWords(prev => new Set([...prev, originalIdx]))
  }, [selectedLevel, activeLevel, usedWords, locale])

  // Trigger game start
  const startLevel = (lvlId: number) => {
    setSelectedLevel(lvlId)
    setRound(1)
    setScore(0)
    setFeedback(null)
    setUsedWords(new Set())
    setGameState('playing')
  }

  useEffect(() => {
    if (gameState === 'playing') {
      generateRound()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, gameState])

  // Game mechanics
  const addLetter = (letter: string, idx: number) => {
    if (feedback) return
    
    // Find first empty slot
    const emptyIdx = answer.findIndex(char => char === '')
    if (emptyIdx === -1) return
    
    const newAnswer = [...answer]
    newAnswer[emptyIdx] = letter
    
    const newScrambled = [...scrambled]
    newScrambled[idx] = '_' + letter // Mark as used
    
    setScrambled(newScrambled)
    setAnswer(newAnswer)

    const targetText = locale === 'rw' ? currentWord.rw.toUpperCase() : currentWord.en.toUpperCase()

    // Check if word is complete
    if (newAnswer.join('').length === targetText.length) {
      const isCorrect = newAnswer.join('') === targetText
      
      if (isCorrect) {
        setFeedback('correct')
        playCorrectSound()
        triggerConfetti()
        setScore(s => s + 10)
      } else {
        setFeedback('wrong')
        playWrongSound()
      }
      
      setTimeout(() => {
        if (round >= 10) {
          handleGameOver(score + (isCorrect ? 10 : 0))
        } else {
          setRound(r => r + 1)
        }
      }, 1450)
    }
  }

  const removeLetter = (idx: number) => {
    if (feedback) return
    
    const letter = answer[idx]
    if (!letter) return
    
    const newAnswer = [...answer]
    newAnswer[idx] = ''
    
    // Find its original slot in scrambled to put it back
    const newScrambled = [...scrambled]
    const emptyIdx = newScrambled.findIndex(char => char === '_' + letter)
    if (emptyIdx !== -1) {
      newScrambled[emptyIdx] = letter
    }
    
    setAnswer(newAnswer)
    setScrambled(newScrambled)
  }

  const handleGameOver = (finalScore: number) => {
    setGameState('gameover')
    
    if (finalScore >= 60) {
      playVictorySound()
      const nextLvl = selectedLevel + 1
      if (nextLvl <= 4 && nextLvl > unlockedLevel) {
        setUnlockedLevel(nextLvl)
        setShowLevelUnlockMsg(true)
        try {
          localStorage.setItem('gkz_wordbuilder_unlocked_level', String(nextLvl))
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
      <main className="min-h-[85vh] bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 bg-pattern-doodles flex items-center justify-center">
        <div className="max-w-xl w-full bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl p-8 md:p-10 shadow-2xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-300 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white animate-bounce">
            📝
          </div>

          <div className="text-center mt-6 mb-10">
            <h2 className="text-3xl font-black text-orange-800 uppercase tracking-wide">
              {t('games.wordBuilder')}
            </h2>
            <p className="text-muted-foreground font-semibold mt-1">
              {locale === 'rw' ? 'Hitamo Urwego wige gusoma!' : 'Unlock levels as you build words!'}
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
                      ? 'bg-card border-orange-200 shadow-md hover:shadow-xl hover:-translate-y-0.5' 
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
      <main className="min-h-[85vh] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4 bg-pattern-shapes">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400" />
          
          <div className="text-7xl mb-4 animate-bounce mt-4">
            {passed ? '🎊' : '💪'}
          </div>

          <h2 className="text-3xl font-black text-orange-900 mb-2">
            {passed ? t('games.excellent') : t('games.keepTrying')}
          </h2>
          
          <p className="text-xl font-extrabold text-foreground mb-1">
            {locale === 'rw' ? activeLevel.nameRw : activeLevel.nameEn}
          </p>
          <p className="text-muted-foreground font-black text-md uppercase tracking-wider mb-6">
            {t('games.score')}: <span className="text-orange-600 text-lg font-black">{score}</span>/100
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
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl active:scale-95 cursor-pointer'
              }`}
            >
              <Play size={20} fill={score < 60 || selectedLevel === 4 ? "none" : "currentColor"} />
              {locale === 'rw' ? 'KINA URUKURIKIRA' : 'PLAY NEXT LEVEL'}
              {score < 60 && <Lock size={16} className="ml-1" />}
            </button>

            <button 
              onClick={() => startLevel(selectedLevel)} 
              className="w-full py-4 border-2 border-orange-200 hover:border-orange-300 text-orange-700 bg-white rounded-2xl font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <RefreshCw size={20} />
              {locale === 'rw' ? 'ONGERA UKINE' : 'RETRY AGAIN'}
            </button>

            <button 
              onClick={restart} 
              className="w-full py-2.5 text-orange-500 hover:text-orange-700 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer mt-1"
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
  return (
    <main className="min-h-[85vh] bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 relative overflow-hidden flex items-center justify-center bg-pattern-doodles">
      
      {/* Dynamic Overlay Confetti Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-40" />

      <div className="max-w-xl w-full relative z-10">
        
        {/* Game Navigation Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGameState('map')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/90 hover:bg-white text-orange-700 border border-orange-100 rounded-full font-extrabold text-xs uppercase tracking-wider shadow active:scale-95 transition-all pointer-events-auto cursor-pointer"
            >
              <ChevronLeft size={14} />
              {locale === 'rw' ? 'Hagarika' : 'Exit'}
            </button>
            
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="flex items-center justify-center p-2.5 bg-white/90 hover:bg-white text-orange-700 border border-orange-100 rounded-full shadow active:scale-95 transition-all cursor-pointer pointer-events-auto"
              title={isMuted ? (locale === 'rw' ? 'Fungura umuziki' : 'Unmute music') : (locale === 'rw' ? 'Bika umuziki' : 'Mute music')}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-orange-100 text-orange-900 border border-orange-200 rounded-full font-black text-xs uppercase tracking-wider shadow-sm">
              {locale === 'rw' ? 'Urwego' : 'Level'} {selectedLevel}
            </span>
            <span className="px-4 py-2 bg-white rounded-full font-black text-xs text-muted-foreground shadow-sm uppercase">
              {t('games.round')} {round}/10
            </span>
          </div>
        </div>

        {/* Prompt */}
        <div className={`p-6 rounded-3xl shadow-lg border transition-all duration-300 mb-6 text-center ${
          feedback === 'correct' 
            ? 'bg-green-50 border-green-200 shadow-green-100/50' 
            : feedback === 'wrong' 
            ? 'bg-red-50 border-red-200 shadow-red-100/50 animate-shake' 
            : 'bg-white border-orange-100 shadow-orange-100/20'
        }`}>
          <div className="text-7xl mb-3 animate-bounce">{currentWord.image}</div>
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2">{t('games.spellTheWord')}</p>
          
          <p className="text-2xl font-black text-orange-600 mb-2">
            {locale === 'rw' ? currentWord.rw : currentWord.en}
          </p>
          
          {feedback === 'correct' && (
            <p className="text-green-600 font-extrabold mt-1 text-sm animate-bounce flex items-center justify-center gap-1.5">
              ✅ {t('games.correct')}
            </p>
          )}
          
          {feedback === 'wrong' && (
            <p className="text-red-600 font-extrabold mt-1 text-sm flex items-center justify-center gap-1.5 animate-pulse">
              ❌ {locale === 'rw' ? 'Oya! Dore uko byandikwa:' : 'Oops! Here is the correct spelling:'}
            </p>
          )}
          
          {/* Answer slots */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {(locale === 'rw' ? currentWord.rw.toUpperCase() : currentWord.en.toUpperCase()).split('').map((char, i) => {
              const showCorrect = feedback === 'wrong'
              const displayChar = showCorrect ? char : (answer[i] || '')
              
              let slotStyle = 'bg-white border-dashed border-gray-300 text-transparent'
              
              if (showCorrect) {
                slotStyle = 'bg-green-100 border-green-500 text-green-700 scale-105'
              } else if (answer[i]) {
                slotStyle = feedback === 'correct' 
                  ? 'bg-green-500 border-green-600 text-white shadow-lg scale-105'
                  : 'bg-orange-500 border-orange-600 text-white shadow-md'
              }

              return (
                <button 
                  key={`ans-${i}`} 
                  onClick={() => !showCorrect && answer[i] && removeLetter(i)}
                  disabled={feedback !== null}
                  className={`w-12 h-14 rounded-xl text-2xl font-black border-2 transition-all flex items-center justify-center ${
                    !showCorrect && answer[i] && !feedback ? 'cursor-pointer hover:bg-orange-600' : ''
                  } ${slotStyle}`}
                >
                  {displayChar}
                </button>
              )
            })}
          </div>
        </div>

        {/* Scrambled letters */}
        {!feedback && (
          <div className="flex justify-center gap-2 flex-wrap bg-white/50 p-6 rounded-3xl border border-orange-100 shadow-inner">
            {scrambled.map((letter, i) => {
              const isUsed = letter.startsWith('_')
              const displayLetter = isUsed ? letter.slice(1) : letter
              return (
                <button 
                  key={`scramble-${i}`} 
                  onClick={() => !isUsed && addLetter(letter, i)}
                  disabled={isUsed}
                  className={`w-12 h-14 rounded-xl text-2xl font-black border-2 transition-all flex items-center justify-center ${
                    !isUsed 
                      ? 'bg-white border-orange-200 text-orange-900 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-orange-400 active:scale-95 cursor-pointer' 
                      : 'bg-gray-100 border-gray-200 text-gray-300 pointer-events-none'
                  }`}
                >
                  {displayLetter}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
