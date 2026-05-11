'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader, Gamepad2, AlertCircle, CheckCircle } from 'lucide-react'
import { AddGameModal } from '@/components/add-game-modal'
import ConfirmModal from '@/components/confirm-modal'
import { Pagination } from '@/components/pagination'

interface Game {
  _id?: string
  id: number
  title: string
  category: string
  premium: boolean
  rating: number
  image?: string
}

type Toast = { type: 'success' | 'error'; message: string }

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingName, setDeletingName] = useState('')
  const [deleting, setDeleting] = useState(false)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchGames = async (page = currentPage) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/games?page=${page}&limit=${limit}`)
      if (res.ok) {
        const data = await res.json()
        setGames(data.data || [])
        if (data.pagination) {
          setTotalPages(data.pagination.pages)
          setCurrentPage(data.pagination.page)
        }
      } else {
        showToast('error', 'Failed to load games')
      }
    } catch {
      showToast('error', 'Network error — could not load games')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGames() }, [currentPage])

  const requestDelete = (game: Game) => {
    const id = game._id || String(game.id)
    setDeletingId(id)
    setDeletingName(game.title)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/games/${deletingId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        showToast('success', `"${deletingName}" has been deleted.`)
        fetchGames()
      } else {
        showToast('error', data.error || 'Failed to delete game')
      }
    } catch {
      showToast('error', 'Network error — could not delete game')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
      setDeletingId(null)
      setDeletingName('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl font-semibold text-white animate-in slide-in-from-top duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
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
        <div className="text-center py-16 bg-card border border-muted rounded-xl">
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
        <>
          <div className="bg-card border border-muted rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Premium</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Rating</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
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
                      <td className="px-6 py-4 text-sm text-muted-foreground">{'⭐'.repeat(Math.min(game.rating, 5))}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => requestDelete(game)}
                          className="text-destructive hover:text-destructive/80 p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete game"
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
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </>
      )}

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchGames(); showToast('success', 'Game added successfully!') }}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Game"
        message={`Are you sure you want to delete "${deletingName}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Yes, Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingId(null); setDeletingName('') }}
      />
    </div>
  )
}
