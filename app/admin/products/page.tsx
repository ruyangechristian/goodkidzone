'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Loader, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react'
import { ProductModal } from '@/components/product-modal'
import ConfirmModal from '@/components/confirm-modal'
import { Pagination } from '@/components/pagination'

interface Product {
  _id?: string
  id: number
  name: string
  price: number
  category: string
  rating: number
  image?: string
}

type Toast = { type: 'success' | 'error'; message: string }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
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

  const fetchProducts = async (page = currentPage) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.data || [])
        if (data.pagination) {
          setTotalPages(data.pagination.pages)
          setCurrentPage(data.pagination.page)
        }
      } else {
        showToast('error', 'Failed to load products')
      }
    } catch {
      showToast('error', 'Network error — could not load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [currentPage])

  const handleAdd = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const requestDelete = (product: Product) => {
    const id = product._id || String(product.id)
    setDeletingId(id)
    setDeletingName(product.name)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${deletingId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        showToast('success', `"${deletingName}" has been deleted.`)
        fetchProducts()
      } else {
        showToast('error', data.error || 'Failed to delete product')
      }
    } catch {
      showToast('error', 'Network error — could not delete product')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
      setDeletingId(null)
      setDeletingName('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast notification */}
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
          <h2 className="text-2xl font-bold text-foreground">Products Management</h2>
          <p className="text-muted-foreground">Manage your shop inventory</p>
        </div>
        <button
          onClick={handleAdd}
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
        <div className="text-center py-16 bg-card border border-muted rounded-xl">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4 opacity-40" />
          <p className="text-lg text-muted-foreground">No products yet</p>
          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <>
          <div className="bg-card border border-muted rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Rating</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {products.map((product) => (
                    <tr key={product._id || product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <ShoppingBag size={20} className="text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-foreground">{product.name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">{product.price.toLocaleString()} RWF</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{'⭐'.repeat(Math.round(product.rating || 0))}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-primary hover:text-primary/80 p-2 hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => requestDelete(product)}
                            className="text-destructive hover:text-destructive/80 p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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

      {/* Product Modal (Add/Edit) */}
      <ProductModal
        isOpen={modalOpen}
        product={editingProduct}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          fetchProducts()
          showToast('success', `Product ${editingProduct ? 'updated' : 'added'} successfully!`)
        }}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Product"
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
