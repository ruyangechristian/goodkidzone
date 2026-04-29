import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Product, ApiResponse } from '@/lib/models'

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const productsCollection = db.collection('products')

    const products = await productsCollection
      .find({})
      .sort({ id: 1 })
      .toArray()

    console.log('[v0] Fetched products. Count:', products.length)

    return NextResponse.json(
      { success: true, data: products } as ApiResponse<Product[]>,
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price, rating, category, image } = body

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, category' } as ApiResponse<null>,
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const productsCollection = db.collection('products')

    // Get the next ID
    const lastProduct = await productsCollection
      .findOne({}, { sort: { id: -1 } })
    const nextId = (lastProduct?.id || 0) + 1

    const newProduct: Product = {
      id: nextId,
      name,
      price: parseFloat(price.toString()),
      rating: rating || 0,
      category,
      image: image || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await productsCollection.insertOne(newProduct)

    console.log('[v0] Product added successfully:', result.insertedId)

    return NextResponse.json(
      { success: true, data: { ...newProduct, _id: result.insertedId } } as ApiResponse<Product>,
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error adding product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add product' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}
