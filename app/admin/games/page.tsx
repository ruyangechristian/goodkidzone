'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader, Gamepad2 } from 'lucide-react'
import { AddGameModal } from '@/components/add-game-modal'

interface Game {
  _id?: string
  id: number
  title: string
  category: string
  premium: boolean
  rating: number
  image?: string
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchGames = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/games')
      if (res.ok) {
        const data = await res.json()
        setGames(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGames() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return
    try {
      const res = await fetch(`/api/games/${id}`, { method: 'DELETE' })
      if (res.ok) fetchGames()
    } catch (error) {
      console.error('Error deleting game:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Games Management</h2>
          <p className="text-muted-foreground">Add and manage educational games</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          Add Game
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size={32} className="animate-spin text-primary" />
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <Gamepad2 size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No games yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Add Your First Game
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Premium</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Rating</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {games.map((game) => (
                  <tr key={game._id || game.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      {game.image ? (
                        <img src={game.image} alt={game.title} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Gamepad2 size={20} className="text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground max-w-xs truncate">{game.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{game.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        game.premium ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {game.premium ? 'Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{game.rating}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(game._id || String(game.id))}
                        className="text-destructive hover:text-destructive/80 p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddGameModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchGames() }}
      />
    </div>
  )
}
