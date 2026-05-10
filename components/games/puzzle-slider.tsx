'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/context'

export default function PuzzleSlider() {
  const { t } = useTranslation()
  const [size, setSize] = useState(3)
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [timer, setTimer] = useState(0)

  const isSolved = (arr: number[]) => arr.every((v,i)=>v===i)

  const shuffle = useCallback((s: number) => {
    const total = s*s
    const arr = Array.from({length:total},(_,i)=>i)
    // Do random moves to ensure solvability
    let emptyIdx = 0
    for(let i=0;i<total*20;i++){
      const neighbors: number[]=[]
      const row=Math.floor(emptyIdx/s), col=emptyIdx%s
      if(row>0) neighbors.push(emptyIdx-s)
      if(row<s-1) neighbors.push(emptyIdx+s)
      if(col>0) neighbors.push(emptyIdx-1)
      if(col<s-1) neighbors.push(emptyIdx+1)
      const pick=neighbors[Math.floor(Math.random()*neighbors.length)]
      ;[arr[emptyIdx],arr[pick]]=[arr[pick],arr[emptyIdx]]
      emptyIdx=pick
    }
    if(isSolved(arr)) { [arr[1],arr[2]]=[arr[2],arr[1]] }
    return arr
  },[])

  const start = (s: number) => {
    setSize(s)
    setTiles(shuffle(s))
    setMoves(0); setTimer(0); setStarted(true); setDone(false)
  }

  useEffect(()=>{
    if(!started||done) return
    const iv=setInterval(()=>setTimer(t=>t+1),1000)
    return ()=>clearInterval(iv)
  },[started,done])

  const click = (idx: number) => {
    if(done||tiles[idx]===0) return
    const emptyIdx=tiles.indexOf(0)
    const row=Math.floor(idx/size), col=idx%size
    const eRow=Math.floor(emptyIdx/size), eCol=emptyIdx%size
    if(Math.abs(row-eRow)+Math.abs(col-eCol)!==1) return

    const nt=[...tiles]
    ;[nt[idx],nt[emptyIdx]]=[nt[emptyIdx],nt[idx]]
    setTiles(nt)
    setMoves(m=>m+1)
    if(isSolved(nt)) setTimeout(()=>setDone(true),300)
  }

  const fmt=(s:number)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`

  // Colors for tiles
  const tileColors = [
    '','bg-red-400','bg-orange-400','bg-amber-400','bg-yellow-400',
    'bg-lime-400','bg-green-400','bg-emerald-400','bg-teal-400',
    'bg-cyan-400','bg-sky-400','bg-blue-400','bg-indigo-400',
    'bg-violet-400','bg-purple-400','bg-fuchsia-400','bg-pink-400',
    'bg-rose-400','bg-red-300','bg-orange-300','bg-amber-300',
    'bg-yellow-300','bg-lime-300','bg-green-300','bg-emerald-300','bg-teal-300'
  ]

  if(!started) return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🧩</div>
        <h2 className="text-3xl font-bold mb-2">{t('games.puzzleSlider')}</h2>
        <p className="text-muted-foreground mb-8">{t('games.selectDifficulty')}</p>
        <div className="space-y-3">
          <button onClick={()=>start(3)} className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-primary-foreground hover:shadow-lg">{t('games.easy')} (3×3)</button>
          <button onClick={()=>start(4)} className="w-full py-3 rounded-xl font-bold text-lg bg-primary text-primary-foreground hover:shadow-lg">{t('games.hard')} (4×4)</button>
        </div>
      </div>
    </main>
  )

  if(done) {
    const stars = size===3?(moves<=15?5:moves<=25?4:3):(moves<=40?5:moves<=60?4:3)
    return (
      <main className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">{t('games.wellDone')}</h2>
          <p className="text-muted-foreground">{t('games.moves')}: {moves} | {t('games.time')}: {fmt(timer)}</p>
          <div className="flex justify-center gap-1 my-4">{[...Array(5)].map((_,i)=><span key={i} className={`text-3xl ${i<stars?'':'opacity-20'}`}>⭐</span>)}</div>
          <button onClick={()=>start(size)} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:shadow-lg">{t('games.playAgain')}</button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 pt-20 p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold">{t('games.moves')}: {moves}</div>
          <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-bold text-primary">{t('games.time')}: {fmt(timer)}</div>
        </div>
        <div className="grid gap-1.5 bg-white/50 rounded-2xl p-2 shadow-inner" style={{gridTemplateColumns:`repeat(${size},1fr)`}}>
          {tiles.map((tile,idx)=>(
            <button key={idx} onClick={()=>click(idx)}
              className={`aspect-square rounded-xl text-2xl font-bold transition-all duration-200 ${
                tile===0?'bg-transparent':'text-white shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer ' + (tileColors[tile]||'bg-gray-400')
              }`}>
              {tile||''}
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">Slide numbered tiles to arrange 1→{size*size-1}</p>
      </div>
    </main>
  )
}
