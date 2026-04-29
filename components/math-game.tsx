'use client'

import { useState, useEffect } from 'react'
import { Volume2, RotateCcw, Star } from 'lucide-react'

interface Question {
  id: number
  num1: number
  num2: number
  operation: string
  answer: number
  options?: number[]
  question?: string
}

export default function MathGame() {
  const [gameMode, setGameMode] = useState<'menu' | 'addition' | 'puzzle'>('menu')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // Generate Addition Challenge Question
  const generateAdditionQuestion = (): Question => {
    let num1, num2

    if (difficulty === 'easy') {
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
    } else if (difficulty === 'medium') {
      num1 = Math.floor(Math.random() * 20) + 1
      num2 = Math.floor(Math.random() * 20) + 1
    } else {
      num1 = Math.floor(Math.random() * 50) + 1
      num2 = Math.floor(Math.random() * 50) + 1
    }

    const answer = num1 + num2

    const options = [
      answer,
      answer + Math.floor(Math.random() * 5) + 1,
      answer - Math.floor(Math.random() * 5) - 1,
      answer + Math.floor(Math.random() * 10) + 5,
    ]

    const shuffled = options.sort(() => Math.random() - 0.5)

    return {
      id: Date.now(),
      num1,
      num2,
      operation: '+',
      answer,
      options: shuffled.filter((opt, idx, arr) => arr.indexOf(opt) === idx).slice(0, 4),
    }
  }

  // Generate Puzzle Challenge Question (Mixed operations)
  const generatePuzzleQuestion = (): Question => {
    let num1, num2, answer, operation, question

    const puzzleTypes = ['subtraction', 'multiplication', 'missing_number', 'sequence']
    const puzzleType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)]

    if (difficulty === 'easy') {
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
    } else if (difficulty === 'medium') {
      num1 = Math.floor(Math.random() * 15) + 1
      num2 = Math.floor(Math.random() * 15) + 1
    } else {
      num1 = Math.floor(Math.random() * 20) + 1
      num2 = Math.floor(Math.random() * 20) + 1
    }

    switch (puzzleType) {
      case 'subtraction': {
        const a = Math.max(num1, num2)
        const b = Math.min(num1, num2)
        answer = a - b
        operation = '-'
        question = `${a} - ${b} = ?`
        break
      }
      case 'multiplication': {
        answer = num1 * num2
        operation = '*'
        question = `${num1} × ${num2} = ?`
        break
      }
      case 'missing_number': {
        const a = Math.floor(Math.random() * 20) + 1
        const b = Math.floor(Math.random() * 20) + 1
        answer = a + b
        operation = '+'
        question = `${a} + ? = ${a + b}`
        break
      }
      case 'sequence': {
        const start = Math.floor(Math.random() * 5) + 1
        const position = Math.floor(Math.random() * 4) + 1
        answer = start * position
        operation = '×'
        question = `Sequence (${start}, ${start * 2}, ${start * 3}, ...): 4th number = ?`
        break
      }
      default:
        answer = num1 + num2
        operation = '+'
        question = `${num1} + ${num2} = ?`
    }

    const options = [
      answer,
      answer + Math.floor(Math.random() * 8) + 1,
      answer - Math.floor(Math.random() * 8) - 1,
      answer + Math.floor(Math.random() * 15) + 5,
    ]

    const shuffled = options.sort(() => Math.random() - 0.5)

    return {
      id: Date.now(),
      num1,
      num2,
      operation,
      answer,
      question,
      options: shuffled.filter((opt, idx, arr) => arr.indexOf(opt) === idx).slice(0, 4),
    }
  }

  // Start the game
  const startGame = (mode: 'addition' | 'puzzle') => {
    setGameMode(mode)
    setScore(0)
    setStreak(0)
    setQuestionCount(0)
    if (mode === 'addition') {
      setCurrentQuestion(generateAdditionQuestion())
    } else {
      setCurrentQuestion(generatePuzzleQuestion())
    }
  }

  // Check answer
  const checkAnswer = (selected: number) => {
    if (!currentQuestion || answered) return

    setSelectedAnswer(selected)
    setAnswered(true)

    if (selected === currentQuestion.answer) {
      setScore(score + 10 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3))
      setStreak(streak + 1)
      setFeedbackMessage('Correct! Great job!')
    } else {
      setStreak(0)
      setFeedbackMessage(`Wrong! The correct answer is ${currentQuestion.answer}`)
    }

    setShowFeedback(true)
  }

  // Next question
  const nextQuestion = () => {
    setQuestionCount(questionCount + 1)

    if (questionCount >= 9) {
      // Game over after 10 questions
      setGameMode('menu')
      setCurrentQuestion(null)
      setAnswered(false)
      setShowFeedback(false)
      setSelectedAnswer(null)
    } else {
      if (gameMode === 'addition') {
        setCurrentQuestion(generateAdditionQuestion())
      } else {
        setCurrentQuestion(generatePuzzleQuestion())
      }
      setAnswered(false)
      setShowFeedback(false)
      setSelectedAnswer(null)
    }
  }

  // Text to speech
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  const resetGame = () => {
    setGameMode('menu')
    setScore(0)
    setStreak(0)
    setCurrentQuestion(null)
    setSelectedAnswer(null)
    setAnswered(false)
    setQuestionCount(0)
    setShowFeedback(false)
  }

  // Menu
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unnamed-1M2J430Y5jgNG84r6R0XpZL0Z7wdwC.png"
              alt="Math Game"
              className="w-full h-32 object-contain mb-4"
            />
            <h1 className="text-5xl font-bold text-blue-600 mb-2">Math Game</h1>
            <p className="text-gray-600 text-lg">Learn math while having fun!</p>
          </div>

          {score > 0 && (
            <div className="bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl p-6 mb-8 text-center">
              <p className="text-gray-800 text-lg font-semibold mb-2">Last Score</p>
              <p className="text-5xl font-bold text-orange-600">{score}</p>
              <p className="text-gray-700 text-sm mt-2">Questions: {questionCount + 1}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <button
              onClick={() => startGame('addition')}
              className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Addition Challenge 🧮
            </button>

            <button
              onClick={() => startGame('puzzle')}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Puzzle Challenge 🧩 (Mixed Ops)
            </button>
          </div>

          <div className="text-center text-gray-600 text-sm">
            <p>Select a difficulty level before starting:</p>
            <div className="flex gap-2 justify-center mt-3">
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  difficulty === 'easy'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  difficulty === 'medium'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  difficulty === 'hard'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Hard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Game screen
  if (currentQuestion) {
    const gameTitle = gameMode === 'addition' ? 'Addition Challenge' : 'Puzzle Challenge'
    const questionText = gameMode === 'addition' 
      ? `${currentQuestion.num1} + ${currentQuestion.num2}` 
      : currentQuestion.question || `${currentQuestion.num1} ${currentQuestion.operation} ${currentQuestion.num2}`

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
              <span className="text-2xl font-bold text-blue-600">{score}</span>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">{gameTitle}</p>
              <p className="text-gray-600 text-sm">Question {questionCount + 1}/10</p>
              <div className="w-32 bg-gray-300 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${((questionCount + 1) / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
            >
              <RotateCcw size={24} />
            </button>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg mb-4">What is the answer?</p>
              <div className={`${gameMode === 'addition' ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-purple-400 to-pink-400'} rounded-2xl p-8 mb-6`}>
                <div className="text-6xl font-bold text-white">
                  {questionText}
                </div>
              </div>

              <button
                onClick={() => speak(questionText)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Volume2 size={20} />
                Hear Question
              </button>
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`rounded-2xl p-4 mb-6 text-center font-bold text-lg transition-all ${
                  selectedAnswer === currentQuestion.answer
                    ? 'bg-green-200 text-green-800 animate-bounce'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {feedbackMessage}
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => checkAnswer(option)}
                  disabled={answered}
                  className={`py-4 px-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105 ${
                    selectedAnswer === option
                      ? selectedAnswer === currentQuestion.answer
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-red-500 text-white shadow-lg scale-105'
                      : answered && option === currentQuestion.answer
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Next Button */}
            {answered && (
              <button
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all transform hover:scale-105"
              >
                {questionCount >= 9 ? 'See Final Score' : 'Next Question'}
              </button>
            )}
          </div>

          {streak > 0 && (
            <div className="text-center text-yellow-600 font-bold text-lg animate-pulse">
              🔥 Streak: {streak}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
