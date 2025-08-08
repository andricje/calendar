import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001'

export async function GET() {
  try {
    // Fetch status from backend
    const response = await fetch(`${BACKEND_URL}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const htmlContent = await response.text()
    
    // Parse the HTML to extract last updated times
    const ufcMatch = htmlContent.match(/Last updated: (.*?) PST/i)
    const onefcMatch = htmlContent.match(/Last updated: (.*?) PST/i)
    
    const status = {
      ufc: {
        lastUpdated: ufcMatch ? ufcMatch[1] : 'Unknown',
        status: 'online',
        url: `${BACKEND_URL}/ufc`
      },
      onefc: {
        lastUpdated: onefcMatch ? onefcMatch[1] : 'Unknown', 
        status: 'online',
        url: `${BACKEND_URL}/onefccalendar`
      },
      backend: {
        status: 'online',
        url: BACKEND_URL
      }
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Error fetching status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch status',
        ufc: { status: 'offline', lastUpdated: 'Unknown' },
        onefc: { status: 'offline', lastUpdated: 'Unknown' },
        backend: { status: 'offline' }
      },
      { status: 500 }
    )
  }
}
