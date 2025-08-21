import { NextRequest, NextResponse } from 'next/server'
import { stockDataService } from '@/services/stockDataService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limitParam = searchParams.get('limit')
    
    if (!query || query.length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 10
    
    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be a number between 1 and 50' },
        { status: 400 }
      )
    }

    const results = await stockDataService.searchStocks(query, limit)
    
    return NextResponse.json({
      success: true,
      data: results,
      query,
      count: results.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Stock search API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        query: new URL(request.url).searchParams.get('q')
      },
      { status: 500 }
    )
  }
}