import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), '.data')
const FESTIVALS_FILE = join(DATA_DIR, 'festivals.json')

async function initializeStorage() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    try {
      await readFile(FESTIVALS_FILE, 'utf-8')
    } catch {
      const initialData = { events: [] }
      await writeFile(FESTIVALS_FILE, JSON.stringify(initialData, null, 2), 'utf-8')
    }
  } catch (error) {
    console.error('[v0] Error initializing festivals storage:', error)
  }
}

async function readFestivals() {
  try {
    await initializeStorage()
    const data = await readFile(FESTIVALS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('[v0] Error reading festivals:', error)
    return { events: [] }
  }
}

async function writeFestivals(data: any) {
  try {
    await initializeStorage()
    await writeFile(FESTIVALS_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('[v0] Error writing festivals:', error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const festivalsData = await readFestivals()
    return NextResponse.json({ success: true, data: festivalsData.events }, { status: 200 })
  } catch (error) {
    console.error('[v0] Error fetching festivals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, time, location, image, ticketPrice, availableTickets, category } = body

    if (!title || !date || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newEvent = {
      id: Date.now(),
      title,
      description: description || '',
      date,
      time: time || '09:00',
      location,
      image: image || 'https://images.unsplash.com/photo-1514785291840-2e0a9bf2a9ae?w=800&h=600&fit=crop',
      ticketPrice: ticketPrice || 5000,
      availableTickets: availableTickets || 100,
      category: category || 'Event',
      createdAt: new Date().toISOString(),
    }

    const festivalsData = await readFestivals()
    festivalsData.events.push(newEvent)
    await writeFestivals(festivalsData)

    console.log('[v0] Event added:', newEvent.id)
    return NextResponse.json(
      { success: true, data: newEvent },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error adding event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add event' },
      { status: 500 }
    )
  }
}
