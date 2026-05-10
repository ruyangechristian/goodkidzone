'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/context'

const words = [
  { word: 'INKA', image: '🐄', en: 'Cow', rw: 'Inka' },
  { word: 'INZU', image: '🏠', en: 'House', rw: 'Inzu' },
  { word: 'IZUBA', image: '☀️', en: 'Sun', rw: 'Izuba' },
  { word: 'AMAZI', image: '💧', en: 'Water', rw: 'Amazi' },
  { word: 'IGITI', image: '🌳', en: 'Tree', rw: 'Igiti' },
  { word: 'UMWANA', image: '👶', en: 'Child', rw: 'Umwana' },
  { word: 'IMBWA', image: '🐕', en: 'Dog', rw: 'Imbwa' },
  { word: 'INJANGWE', image: '🐱', en: 'Cat', rw: 'Injangwe' },
  { word: 'UMUSOZI', image: '⛰️', en: 'Mountain', rw: 'Umusozi' },
  { word: 'INYONI', image: '🐦', en: 'Bird', rw: 'Inyoni' },
  { word: 'IFARANGA', image: '💰', en: 'Money', rw: 'Ifaranga' },
  { word: 'UMUGATI', image: '🍞', en: 'Bread', rw: 'Umugati' },
]

export default function WordBuilder() {
  const { t, locale } = useTranslation()
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [currentWord, setCurrentWord] = useState(words[0])
  const [scrambled, setScrambled] = useState<string[]>([])
  const [answer, setAnswer] = useState<string[]>([])
  const [feedback, setFeedback] = useState<'correct'|'wrong'|null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set())

  const generateRound = useCallback(() => {
    let idx: number
    const available = words.map((_,i)=>i).filter(i=>!usedWords.has(i))
    if(available.length===0) { setGameOver(true); return }
    idx = available[Math.floor(Math.random()*available.length)]
    const w = words[idx]
    setCurrentWord(w)
    setScrambled(w.word.split('').sort(()=>Math.random()-0.5))
    setAnswer([])
    setFeedback(null)
    setUsedWords(prev=>new Set([...prev,idx]))
  },[usedWords])

  useEffect(()=>{ generateRound() },[])

  const addLetter = (letter: string, idx: number) => {
    if(feedback) return
    const newAnswer = [...answer, letter]
    const newScrambled = [...scrambled]
    newScrambled.splice(idx,1)
    setScrambled(newScrambled)
    setAnswer(newAnswer)

    if(newAnswer.length === currentWord.word.length) {
      if(newAnswer.join('') === currentWord.word) {
        setFeedback('correct')
        setScore(s=>s+10)
        setTimeout(()=>{
          if(round>=10) { setGameOver(true) }
          else { setRound(r=>r+1); generateRound() }
        },1000)
      } else {
        setFeedback('wrong')
        setTimeout(()=>{
          setScrambled(currentWord.word.split('').sort(()=>Math.random()-0.5))
          setAnswer([])
          setFeedback(null)
        },800)
      }
    }
  }

  const removeLetter = (idx: number) => {
    if(feedback) return
    const letter = answer[idx]
    const newAnswer = [...answer]
    newAnswer.splice(idx,1)
    setAnswer(newAnswer)
    setScrambled([...scrambled, letter])
  }

  const restart = () => {
    setRound(1); setScore(0); setGameOver(false); setUsedWords(new Set())
    generateRound()
  }

  if(gameOver) return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-3xl font-bold mb-2">{t('games.excellent')}</h2>
        <p className="text-muted-foreground mb-2">{t('games.score')}: {score}/{round*10}</p>
        <div className="flex justify-center gap-1 my-4">{[...Array(5)].map((_,i)=><span key={i} className={`text-3xl ${i<Math.ceil(score/20)?'':'opacity-20'}`}>⭐</span>)}</div>
        <button onClick={restart} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:shadow-lg">{t('games.playAgain')}</button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pt-20 p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold">{t('games.round')} {round}/10</div>
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold text-primary">{t('games.score')}: {score}</div>
        </div>

        <div className={`text-center mb-8 p-6 rounded-2xl shadow-lg transition-all ${feedback==='correct'?'bg-green-100':feedback==='wrong'?'bg-red-100':'bg-white'}`}>
          <div className="text-7xl mb-3">{currentWord.image}</div>
          <p className="text-sm text-muted-foreground">{t('games.spellTheWord')}</p>
          <p className="text-lg font-bold mt-1">{locale==='rw'?currentWord.rw:currentWord.en}</p>
          {feedback==='correct'&&<p className="text-green-600 font-bold mt-2">✅ {t('games.correct')}</p>}
          {feedback==='wrong'&&<p className="text-red-600 font-bold mt-2">❌ {t('games.tryAgain')}</p>}
        </div>

        {/* Answer slots */}
        <div className="flex justify-center gap-2 mb-6">
          {currentWord.word.split('').map((_,i)=>(
            <button key={i} onClick={()=>answer[i]&&removeLetter(i)}
              className={`w-12 h-14 rounded-xl text-xl font-bold border-2 transition-all ${answer[i]?'bg-primary text-primary-foreground border-primary shadow-lg':'bg-white border-dashed border-border'}`}>
              {answer[i]||''}
            </button>
          ))}
        </div>

        {/* Scrambled letters */}
        <div className="flex justify-center gap-2 flex-wrap">
          {scrambled.map((letter,i)=>(
            <button key={i} onClick={()=>addLetter(letter,i)}
              className="w-12 h-14 rounded-xl text-xl font-bold bg-white border-2 border-border shadow-md hover:shadow-xl hover:scale-110 transition-all active:scale-95">
              {letter}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
