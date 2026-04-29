import { ObjectId } from 'mongodb'

export interface Video {
  _id?: ObjectId
  id: number
  title: string
  description: string
  youtubeUrl?: string
  videoId?: string
  duration?: string
  category: string
  image: string
  folder?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Game {
  _id?: ObjectId
  id: number
  title: string
  description: string
  rating: number
  category: string
  premium: boolean
  color: string
  component?: string
  image?: string
  imageType?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Product {
  _id?: ObjectId
  id: number
  name: string
  price: number
  rating: number
  image: string
  category: string
  imageType?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
