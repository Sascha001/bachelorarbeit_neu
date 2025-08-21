import { StockData, COMPREHENSIVE_MOCK_DATA, getStockBySymbol, searchStocks } from '@/data/mockStockData'

export type DataSource = 'yahoo' | 'alpha-vantage' | 'cache' | 'mock'

export interface EnhancedStockData extends StockData {
  source: DataSource
  isLive: boolean
  fetchedAt: string
}

interface CachedData {
  data: StockData
  timestamp: number
  ttl: number // Time to live in milliseconds
}

export class StockDataService {
  private cache = new Map<string, CachedData>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly ALPHA_VANTAGE_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY
  
  constructor() {
    // Cleanup cache every 10 minutes
    setInterval(() => this.cleanupCache(), 10 * 60 * 1000)
  }

  /**
   * Main method to get stock data with fallback system
   */
  async getStockData(symbol: string): Promise<EnhancedStockData> {
    const normalizedSymbol = symbol.toUpperCase()
    
    // 1. Try Yahoo Finance (primary source)
    try {
      const yahooData = await this.fetchFromYahoo(normalizedSymbol)
      if (yahooData) {
        this.cacheData(normalizedSymbol, yahooData)
        return {
          ...yahooData,
          source: 'yahoo',
          isLive: true,
          fetchedAt: new Date().toISOString()
        }
      }
    } catch (error) {
      console.warn(`Yahoo Finance failed for ${normalizedSymbol}:`, error)
    }

    // 2. Try Alpha Vantage (backup API)
    if (this.ALPHA_VANTAGE_KEY) {
      try {
        const alphaData = await this.fetchFromAlphaVantage(normalizedSymbol)
        if (alphaData) {
          this.cacheData(normalizedSymbol, alphaData)
          return {
            ...alphaData,
            source: 'alpha-vantage',
            isLive: true,
            fetchedAt: new Date().toISOString()
          }
        }
      } catch (error) {
        console.warn(`Alpha Vantage failed for ${normalizedSymbol}:`, error)
      }
    }

    // 3. Try cache (recent live data)
    const cachedData = this.getCachedData(normalizedSymbol)
    if (cachedData && this.isCacheValid(cachedData)) {
      return {
        ...cachedData.data,
        source: 'cache',
        isLive: false,
        fetchedAt: new Date(cachedData.timestamp).toISOString()
      }
    }

    // 4. Fallback to mock data
    const mockData = getStockBySymbol(normalizedSymbol)
    if (mockData) {
      return {
        ...mockData,
        source: 'mock',
        isLive: false,
        fetchedAt: new Date().toISOString()
      }
    }

    throw new Error(`No data available for symbol: ${normalizedSymbol}`)
  }

  /**
   * Search for stocks (also with fallback)
   */
  async searchStocks(query: string, limit: number = 10): Promise<EnhancedStockData[]> {
    if (!query || query.length < 1) return []

    // Try to search live data first, but for now fallback to mock
    // In production, you could implement live search via Yahoo Finance or Alpha Vantage
    
    const mockResults = searchStocks(query, limit)
    
    return mockResults.map(stock => ({
      ...stock,
      source: 'mock' as DataSource,
      isLive: false,
      fetchedAt: new Date().toISOString()
    }))
  }

  /**
   * Get multiple stocks at once
   */
  async getMultipleStocks(symbols: string[]): Promise<EnhancedStockData[]> {
    const promises = symbols.map(symbol => this.getStockData(symbol))
    const results = await Promise.allSettled(promises)
    
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<EnhancedStockData>).value)
  }

  /**
   * Yahoo Finance implementation (using public endpoints)
   */
  private async fetchFromYahoo(symbol: string): Promise<StockData | null> {
    try {
      // Using Yahoo Finance public API (might be blocked)
      const response = await fetch(
        `/api/proxy/yahoo?symbol=${symbol}`,
        { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      
      if (!response.ok) throw new Error(`Yahoo API error: ${response.status}`)
      
      const data = await response.json()
      
      if (!data || !data.chart || !data.chart.result) {
        throw new Error('Invalid Yahoo Finance response format')
      }

      const result = data.chart.result[0]
      const meta = result.meta
      
      return {
        symbol: symbol,
        name: meta.longName || symbol,
        price: meta.regularMarketPrice || 0,
        change: meta.regularMarketChange || 0,
        changePercent: meta.regularMarketChangePercent || 0,
        volume: meta.regularMarketVolume || 0,
        marketCap: meta.marketCap || 0,
        dayHigh: meta.regularMarketDayHigh || 0,
        dayLow: meta.regularMarketDayLow || 0,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
        lastUpdated: new Date().toISOString(),
        exchange: meta.exchangeName || 'Unknown',
        sector: meta.sector
      }
    } catch (error) {
      console.warn('Yahoo Finance fetch failed:', error)
      return null
    }
  }

  /**
   * Alpha Vantage implementation
   */
  private async fetchFromAlphaVantage(symbol: string): Promise<StockData | null> {
    if (!this.ALPHA_VANTAGE_KEY) return null
    
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.ALPHA_VANTAGE_KEY}`
      )
      
      if (!response.ok) throw new Error(`Alpha Vantage API error: ${response.status}`)
      
      const data = await response.json()
      const quote = data['Global Quote']
      
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error('No data from Alpha Vantage')
      }

      return {
        symbol: quote['01. symbol'],
        name: quote['01. symbol'], // Alpha Vantage doesn't provide company names in GLOBAL_QUOTE
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        marketCap: 0, // Not available in this endpoint
        dayHigh: parseFloat(quote['03. high']),
        dayLow: parseFloat(quote['04. low']),
        fiftyTwoWeekHigh: 0, // Not available in this endpoint
        fiftyTwoWeekLow: 0, // Not available in this endpoint
        lastUpdated: quote['07. latest trading day'],
        exchange: 'Unknown',
        sector: undefined
      }
    } catch (error) {
      console.warn('Alpha Vantage fetch failed:', error)
      return null
    }
  }

  /**
   * Cache management
   */
  private cacheData(symbol: string, data: StockData): void {
    this.cache.set(symbol, {
      data,
      timestamp: Date.now(),
      ttl: this.CACHE_TTL
    })
  }

  private getCachedData(symbol: string): CachedData | undefined {
    return this.cache.get(symbol)
  }

  private isCacheValid(cachedData: CachedData): boolean {
    return Date.now() - cachedData.timestamp < cachedData.ttl
  }

  private cleanupCache(): void {
    const now = Date.now()
    for (const [symbol, cachedData] of this.cache.entries()) {
      if (now - cachedData.timestamp > cachedData.ttl) {
        this.cache.delete(symbol)
      }
    }
  }

  /**
   * Utility methods
   */
  getDataSourceInfo(source: DataSource) {
    const sourceInfo = {
      yahoo: {
        name: 'Yahoo Finance',
        isLive: true,
        color: 'green',
        description: 'Live-Daten'
      },
      'alpha-vantage': {
        name: 'Alpha Vantage',
        isLive: true,
        color: 'green',
        description: 'Live-Daten'
      },
      cache: {
        name: 'Zwischenspeicher',
        isLive: false,
        color: 'yellow',
        description: 'Gespeicherte Daten'
      },
      mock: {
        name: 'Demo',
        isLive: false,
        color: 'gray',
        description: 'Demo-Daten'
      }
    }

    return sourceInfo[source] || sourceInfo.mock
  }

  /**
   * Get all available stocks (for development/testing)
   */
  getAllAvailableStocks(): { symbol: string; name: string }[] {
    return Object.entries(COMPREHENSIVE_MOCK_DATA).map(([symbol, data]) => ({
      symbol,
      name: data.name
    }))
  }
}

// Singleton instance
export const stockDataService = new StockDataService()