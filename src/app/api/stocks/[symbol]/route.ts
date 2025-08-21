import { NextRequest, NextResponse } from 'next/server'
import { stockDataService } from '@/services/stockDataService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params
    
    if (!symbol || symbol.length === 0) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    const stockData = await stockDataService.getStockData(symbol)
    
    return NextResponse.json({
      success: true,
      data: stockData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Stock API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        symbol: (await params).symbol
      },
      { status: 500 }
    )
  }
}