import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    // Proxy Yahoo Finance request to avoid CORS issues
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`
    
    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Yahoo Finance API returned ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data)

  } catch (error) {
    console.error('Yahoo Finance proxy error:', error)
    
    // Return error but don't expose internal details
    return NextResponse.json(
      {
        error: 'Failed to fetch data from Yahoo Finance',
        symbol: new URL(request.url).searchParams.get('symbol')
      },
      { status: 503 }
    )
  }
}