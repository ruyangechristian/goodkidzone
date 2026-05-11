import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/lib/auth'
import { Product, ApiResponse } from '@/lib/models'
import { pusherServer } from '@/lib/pusher'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()
    const productsCollection = db.collection('products')

    const total = await productsCollection.countDocuments({})
    const products = await productsCollection
      .find({})
      .sort({ id: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const serialized = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json(
      { 
        success: true, 
        data: serialized,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      } as unknown as ApiResponse<Product[]>,
      { status: 200 }
    )
  } catch (error) {
    console.error('[GKZ] Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse<null>,
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, price, rating, category, image } = body

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, price, category' } as ApiResponse<null>,
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const productsCollection = db.collection('products')

    const lastProduct = await productsCollection.findOne({}, { sort: { id: -1 } })
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
    const insertedProduct = { ...newProduct, _id: result.insertedId.toString() }

    // Trigger real-time update
    try {
      await pusherServer.trigger('gkz-shop', 'product-update', { message: 'New product added' })
    } catch (e) {
      console.error('[GKZ] Pusher trigger failed:', e)
    }

    console.log('[GKZ] Product added successfully:', result.insertedId)

    return NextResponse.json(
      { success: true, data: insertedProduct } as unknown as ApiResponse<Product>,
      { status: 201 }
    )
  } catch (error) {
    console.error('[GKZ] Error adding product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add product' } as ApiResponse<null>,
      { status: 500 }
    )
  }
}

