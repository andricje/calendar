import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

// Server-side proxy to avoid CORS in the browser
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/stats`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const statsPayload = await response.json()
    return NextResponse.json(statsPayload, { status: 200 })
  } catch (error) {
    console.error('Error proxying backend /stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch backend stats' },
      { status: 500 }
    )
  }
}
