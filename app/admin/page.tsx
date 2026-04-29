'use client'

import { useState, useEffect } from 'react'
import Header from "@/components/header"
import { Plus, Trash2, Edit2, Loader } from "lucide-react"
import { AddProductModal } from "@/components/add-product-modal"
import { AddVideoModal } from "@/components/add-video-modal"
import { AddGameModal } from "@/components/add-game-modal"

type Tab = 'games' | 'products' | 'videos-religion' | 'videos-films'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('games')
  const [games, setGames] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [religionVideos, setReligionVideos] = useState<any[]>([])
  const [filmVideos, setFilmVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const [showGameModal, setShowGameModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showReligionModal, setShowReligionModal] = useState(false)
  const [showFilmModal, setShowFilmModal] = useState(false)

  // Fetch data based on active tab
  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'games') {
        const res = await fetch('/api/games')
        if (res.ok) {
          const data = await res.json()
          setGames(data.data || [])
        }
      } else if (activeTab === 'products') {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          setProducts(data.data || [])
        }
      } else if (activeTab === 'videos-religion') {
        const res = await fetch('/api/videos?category=religion')
        if (res.ok) {
          const data = await res.json()
          setReligionVideos(data.data || [])
        }
      } else if (activeTab === 'videos-films') {
        const res = await fetch('/api/videos?category=short-films')
        if (res.ok) {
          const data = await res.json()
          setFilmVideos(data.data || [])
        }
      }
    } catch (error) {
      console.error('[v0] Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const endpoint = type === 'game' ? '/api/games' : type === 'product' ? '/api/products' : '/api/videos'
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('[v0] Error deleting item:', error)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Admin Control Panel</h1>
            <p className="text-lg opacity-90">Manage all your content: Games, Products, and Videos</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 flex-wrap border-b border-border pb-4">
            <button
              onClick={() => setActiveTab('games')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'games'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Games
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('videos-religion')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'videos-religion'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Religion Videos
            </button>
            <button
              onClick={() => setActiveTab('videos-films')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'videos-films'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Short Films
            </button>
          </div>

          {/* Add Button */}
          <div className="mb-6">
            {activeTab === 'games' && (
              <button
                onClick={() => setShowGameModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Game
              </button>
            )}
            {activeTab === 'products' && (
              <button
                onClick={() => setShowProductModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Product
              </button>
            )}
            {activeTab === 'videos-religion' && (
              <button
                onClick={() => setShowReligionModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Religion Video
              </button>
            )}
            {activeTab === 'videos-films' && (
              <button
                onClick={() => setShowFilmModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Short Film
              </button>
            )}
          </div>

          {/* Content Display */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader size={40} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Games Table */}
              {activeTab === 'games' && (
                <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Premium</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map((game) => (
                        <tr key={game._id || game.id} className="border-b border-border hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm">{game.title}</td>
                          <td className="px-6 py-3 text-sm">{game.category}</td>
                          <td className="px-6 py-3 text-sm">{game.premium ? 'Yes' : 'No'}</td>
                          <td className="px-6 py-3 text-sm">
                            <button
                              onClick={() => handleDelete(game._id || game.id, 'game')}
                              className="text-red-500 hover:text-red-700 inline-flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {games.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No games found</div>
                  )}
                </div>
              )}

              {/* Products Table */}
              {activeTab === 'products' && (
                <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id || product.id} className="border-b border-border hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm">{product.name}</td>
                          <td className="px-6 py-3 text-sm">{product.price.toLocaleString()} RWF</td>
                          <td className="px-6 py-3 text-sm">{product.category}</td>
                          <td className="px-6 py-3 text-sm">
                            <button
                              onClick={() => handleDelete(product._id || product.id, 'product')}
                              className="text-red-500 hover:text-red-700 inline-flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No products found</div>
                  )}
                </div>
              )}

              {/* Religion Videos Table */}
              {activeTab === 'videos-religion' && (
                <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Duration</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {religionVideos.map((video) => (
                        <tr key={video._id || video.id} className="border-b border-border hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm">{video.title}</td>
                          <td className="px-6 py-3 text-sm">{video.category}</td>
                          <td className="px-6 py-3 text-sm">{video.duration || 'N/A'}</td>
                          <td className="px-6 py-3 text-sm">
                            <button
                              onClick={() => handleDelete(video._id || video.id, 'video')}
                              className="text-red-500 hover:text-red-700 inline-flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {religionVideos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No videos found</div>
                  )}
                </div>
              )}

              {/* Short Films Table */}
              {activeTab === 'videos-films' && (
                <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Duration</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filmVideos.map((video) => (
                        <tr key={video._id || video.id} className="border-b border-border hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm">{video.title}</td>
                          <td className="px-6 py-3 text-sm">{video.category}</td>
                          <td className="px-6 py-3 text-sm">{video.duration || 'N/A'}</td>
                          <td className="px-6 py-3 text-sm">
                            <button
                              onClick={() => handleDelete(video._id || video.id, 'video')}
                              className="text-red-500 hover:text-red-700 inline-flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filmVideos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No videos found</div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Modals */}
      <AddGameModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        onSuccess={() => {
          setShowGameModal(false)
          fetchData()
        }}
      />

      <AddProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSuccess={() => {
          setShowProductModal(false)
          fetchData()
        }}
      />

      <AddVideoModal
        isOpen={showReligionModal}
        onClose={() => setShowReligionModal(false)}
        onSuccess={() => {
          setShowReligionModal(false)
          fetchData()
        }}
        defaultCategory="religion"
        categories={["INYIGISHO ZA GIKEISTO", "INYIGISHO ZA QURAN", "NI IYOBOKAMANA"]}
      />

      <AddVideoModal
        isOpen={showFilmModal}
        onClose={() => setShowFilmModal(false)}
        onSuccess={() => {
          setShowFilmModal(false)
          fetchData()
        }}
        defaultCategory="short-films"
        categories={["UBUZIMA", "IMIRIRE MYIZA", "AMATEKA", "UBUREZI", "FILM Z'ABANA IMYAKA 1-5", "VIDEWO Z'ABANA 5-14"]}
      />
    </>
  )
}
