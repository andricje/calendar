import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/ufc`, {
      headers: {
        'Content-Type': 'text/calendar',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const calendarData = await response.text()
    
    return new NextResponse(calendarData, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error fetching UFC calendar:', error)
    return NextResponse.json(
      { error: 'Failed to fetch UFC calendar' },
      { status: 500 }
    )
  }
}
