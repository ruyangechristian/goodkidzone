'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/context'

const cardIcons = ['🥁','🧺','🏔️','🦍','🌸','🎭','🦅','🌍','🎵','🏠','🌳','☕']

interface Card { id: number; icon: string; isFlipped: boolean; isMatched: boolean }

export default function MemoryCards() {
  const { t } = useTranslation()
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [pairs, setPairs] = useState(0)
  const [totalPairs, setTotalPairs] = useState(6)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)
  const [diff, setDiff] = useState<'easy'|'medium'|'hard'>('easy')

  const start = useCallback((d: 'easy'|'medium'|'hard') => {
    const pc = d==='easy'?6:d==='medium'?8:10
    setTotalPairs(pc); setDiff(d)
    const icons = cardIcons.slice(0,pc)
    setCards([...icons,...icons].sort(()=>Math.random()-0.5).map((icon,i)=>({id:i,icon,isFlipped:false,isMatched:false})))
    setFlipped([]); setMoves(0); setPairs(0); setTimer(0); setStarted(true); setDone(false)
  },[])

  useEffect(()=>{
    if(!started||done) return
    const iv = setInterval(()=>setTimer(t=>t+1),1000)
    return ()=>clearInterval(iv)
  },[started,done])

  const click = (id:number) => {
    if(flipped.length===2||cards[id].isFlipped||cards[id].isMatched) return
    const nc=[...cards]; nc[id].isFlipped=true; setCards(nc)
    const nf=[...flipped,id]; setFlipped(nf)
    if(nf.length===2){
      setMoves(m=>m+1)
      if(nc[nf[0]].icon===nc[nf[1]].icon){
        nc[nf[0]].isMatched=true; nc[nf[1]].isMatched=true; setCards([...nc])
        setPairs(p=>{const np=p+1; if(np===totalPairs) setTimeout(()=>setDone(true),500); return np})
        setFlipped([])
      } else {
        setTimeout(()=>{nc[nf[0]].isFlipped=false; nc[nf[1]].isFlipped=false; setCards([...nc]); setFlipped([])},700)
      }
    }
  }

  const fmt=(s:number)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`
  const stars = moves<=totalPairs*1.5?5:moves<=totalPairs*2?4:moves<=totalPairs*3?3:2
  const cols = diff==='hard'?5:4

  if(!started) return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🃏</div>
        <h2 className="text-3xl font-bold mb-2">{t('games.memoryCards')}</h2>
        <p className="text-muted-foreground mb-8">{t('games.selectDifficulty')}</p>
        <div className="space-y-3">
          {(['easy','medium','hard'] as const).map(d=>(
            <button key={d} onClick={()=>start(d)} className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-primary-foreground hover:shadow-lg">{t(`games.${d}`)}</button>
          ))}
        </div>
      </div>
    </main>
  )

  if(done) return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold mb-2">{t('games.wellDone')}</h2>
        <p className="text-muted-foreground">{t('games.moves')}: {moves} | {t('games.time')}: {fmt(timer)}</p>
        <div className="flex justify-center gap-1 my-4">{[...Array(5)].map((_,i)=><span key={i} className={`text-3xl ${i<stars?'':'opacity-20'}`}>⭐</span>)}</div>
        <button onClick={()=>start(diff)} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:shadow-lg">{t('games.playAgain')}</button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 pt-20 p-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold">{t('games.pairs')}: {pairs}/{totalPairs}</div>
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold">{t('games.moves')}: {moves}</div>
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold text-primary">{t('games.time')}: {fmt(timer)}</div>
        </div>
        <div className="grid gap-2" style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
          {cards.map(c=>(
            <button key={c.id} onClick={()=>click(c.id)} disabled={c.isMatched}
              className={`aspect-square rounded-xl text-3xl font-bold transition-all duration-300 ${c.isMatched?'bg-green-100 border-2 border-green-300 scale-95':c.isFlipped?'bg-white shadow-lg scale-105 border-2 border-primary':'bg-gradient-to-br from-primary to-accent text-transparent hover:shadow-lg hover:scale-105 cursor-pointer'}`}>
              {c.isFlipped||c.isMatched?c.icon:'?'}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
