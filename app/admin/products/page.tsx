'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader, ShoppingBag } from 'lucide-react'
import { AddProductModal } from '@/components/add-product-modal'

interface Product {
  _id?: string
  id: number
  name: string
  price: number
  category: string
  rating: number
  image?: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) fetchProducts()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products Management</h2>
          <p className="text-muted-foreground">Manage your shop inventory</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size={32} className="animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No products yet</p>
          <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Rating</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product._id || product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <ShoppingBag size={20} className="text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{product.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">{product.price.toLocaleString()} RWF</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.rating}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(product._id || String(product.id))}
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

      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowModal(false); fetchProducts() }}
      />
    </div>
  )
}
