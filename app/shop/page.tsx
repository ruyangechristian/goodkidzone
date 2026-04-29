'use client'

import Header from "@/components/header"
import { ShoppingCart, Star, Loader } from "lucide-react"
import { useState, useEffect } from "react"

interface Product {
  _id?: string
  id: number
  name: string
  price: number
  rating: number
  image: string
  category: string
  imageType?: string
}

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Colorful Sweatshirt Set",
    price: 18000,
    rating: 4.8,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rBVa3V_iyHaAEbCTAAbxcfWGtRk728.jpg.jpeg-K52esmomkwxH9ip1aBzI08Ep1ej6kO.webp",
    category: "Outfits",
    imageType: "url",
  },
  {
    id: 2,
    name: "Beige Sneaker Shoes",
    price: 22000,
    rating: 4.9,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e56048d5-6849-4f4f-8b7e-ab416544c285.jpg.jpeg-HHZF1BiWcv9bfswhbA6V5dT5Ws2hIg.webp",
    category: "Shoes",
    imageType: "url",
  },
  {
    id: 3,
    name: "Brown Leather Shoes",
    price: 19000,
    rating: 4.7,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images.jfif-Vsu6J4AKueIy4aX57LaRWHsNhu6CEF.jpeg",
    category: "Shoes",
    imageType: "url",
  },
  {
    id: 4,
    name: "Pink Sparkly Girl Shoes",
    price: 20000,
    rating: 4.6,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/61NaabhO7vL._AC_UF1000%2C1000_QL80_.jpg-kOYulDSjQm1WbG6E3mvmufwxRpQRtG.jpeg",
    category: "Shoes",
    imageType: "url",
  },
  {
    id: 5,
    name: "Blue Orange Clothing Set",
    price: 17500,
    rating: 4.9,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6613cb75a323b407bd014d6e-kaoayi-kids-clothing-for-boy-spring.jpg-PMEfz8bpPAhHjm1CNyaVaZyDm44Mrn.jpeg",
    category: "Outfits",
    imageType: "url",
  },
  {
    id: 6,
    name: "Colorful Multi-Sneaker",
    price: 21000,
    rating: 4.8,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/403795-mnpc-erkek-cocuk-gunluk-spor-ayakkabi-yesil-renk-10002-20ye-c5-9e-c4-b0l-2011.jpg-3eOkBDpCpOY6Td6W4667XWt8Cjwu4Z.jpeg",
    category: "Shoes",
    imageType: "url",
  },
  {
    id: 7,
    name: "Gray Sweatshirt Pants Set",
    price: 16000,
    rating: 4.7,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/71k6JCP3Z8L._AC_UY1000_.jpg-DbahurOlq2KqofOuz6N41foSHY65Yy.jpeg",
    category: "Outfits",
    imageType: "url",
  },
  {
    id: 8,
    name: "Pastel Rainbow Sneaker",
    price: 23000,
    rating: 4.9,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/360_F_502208226_wn8UCWkBLahAxjLZpVKXqf1ruWwchY8i.jpg-0HcXfLrUhcHi4ZT1Zhh0x0IiwJjpUy.jpeg",
    category: "Shoes",
    imageType: "url",
  },
]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data && data.data.length > 0 ? data.data : defaultProducts)
      } else {
        setProducts(defaultProducts)
      }
    } catch (error) {
      console.error('[v0] Error fetching products:', error)
      setProducts(defaultProducts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <section className="py-12 md:py-16 bg-gradient-to-r from-primary via-green-500 to-emerald-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Kids Fashion Store</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Discover stylish clothing and comfortable shoes for kids of all ages!
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size={40} className="animate-spin text-primary" />
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="h-40 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-primary mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.category}</p>

                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-secondary">{product.price.toLocaleString()} RWF</span>
                      <button className="bg-accent text-white p-2 rounded-lg hover:shadow-lg transition-all active:scale-95">
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Shop the Latest Styles</h2>
            <p className="text-lg text-gray-700 mb-8">Comfortable, stylish, and durable kids clothing and shoes!</p>
            <button className="btn-primary bg-secondary text-white text-lg">View Cart & Checkout</button>
          </div>
        </section>
      </main>
    </>
  )
}
