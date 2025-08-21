import { NextRequest, NextResponse } from 'next/server'
import { stockDataService } from '@/services/stockDataService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbols } = body
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json(
        { error: 'Request body must contain "symbols" array with at least one symbol' },
        { status: 400 }
      )
    }

    if (symbols.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 symbols allowed per request' },
        { status: 400 }
      )
    }

    const results = await stockDataService.getMultipleStocks(symbols)
    
    return NextResponse.json({
      success: true,
      data: results,
      requested: symbols.length,
      returned: results.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Multiple stocks API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}