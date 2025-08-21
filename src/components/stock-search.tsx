"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DataSourceBadge } from "@/components/ui/data-source-badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { EnhancedStockData } from "@/services/stockDataService"

interface StockSearchProps {
  onStockSelect?: (stock: string) => void
}

export function StockSearch({ onStockSelect }: StockSearchProps = {}) {
  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [results, setResults] = React.useState<EnhancedStockData[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  // Debounced search function
  const debouncedSearch = React.useCallback(
    React.useMemo(
      () => {
        let timeoutId: NodeJS.Timeout
        return (searchQuery: string) => {
          clearTimeout(timeoutId)
          timeoutId = setTimeout(async () => {
            if (!searchQuery.trim()) {
              setResults([])
              setIsLoading(false)
              return
            }

            setIsLoading(true)
            setError(null)

            try {
              const response = await fetch(
                `/api/stocks/search?q=${encodeURIComponent(searchQuery)}&limit=10`
              )
              
              if (!response.ok) {
                throw new Error(`Search failed: ${response.status}`)
              }
              
              const data = await response.json()
              
              if (data.success) {
                setResults(data.data || [])
              } else {
                throw new Error(data.error || 'Search failed')
              }
            } catch (err) {
              console.error('Stock search error:', err)
              setError(err instanceof Error ? err.message : 'Search failed')
              setResults([])
            } finally {
              setIsLoading(false)
            }
          }, 300) // 300ms debounce
        }
      },
      []
    ),
    []
  )

  React.useEffect(() => {
    if (query.length > 0) {
      debouncedSearch(query)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [query, debouncedSearch])

  const handleStockClick = (stock: EnhancedStockData) => {
    setQuery("")
    setIsOpen(false)
    if (onStockSelect) {
      onStockSelect(stock.symbol)
    } else {
      window.location.href = `/statistik/unsicherheits-analyse?stock=${stock.symbol}`
    }
  }


  return (
    <TooltipProvider>
      <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Wertpapiere suchen..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(e.target.value.length > 0)
          }}
          onFocus={() => setIsOpen(query.length > 0)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 violet-bloom-hover border-primary/20 focus:border-primary/40 focus:ring-primary/20"
        />
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-card border border-primary/20 rounded-lg shadow-lg shadow-primary/10 z-50 max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Suche läuft...</span>
            </div>
          )}
          
          {error && (
            <div className="p-3 text-sm text-red-600 border-b border-border/50">
              Fehler: {error}
            </div>
          )}
          
          {!isLoading && !error && results.length === 0 && query.length > 0 && (
            <div className="p-3 text-sm text-muted-foreground text-center">
              Keine Ergebnisse für "{query}" gefunden
            </div>
          )}
          
          {!isLoading && results.length > 0 && (
            <>
              {results.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleStockClick(stock)}
                  className="flex items-center justify-between p-3 hover:bg-primary/10 cursor-pointer border-b border-border/50 last:border-b-0 transition-colors"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground">{stock.symbol}</span>
                      <DataSourceBadge source={stock.source} isLive={stock.isLive} />
                      {stock.exchange && (
                        <span className="text-xs text-muted-foreground bg-muted px-1 rounded">
                          {stock.exchange}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground truncate">{stock.name}</span>
                    {stock.sector && (
                      <span className="text-xs text-muted-foreground">{stock.sector}</span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="font-medium">
                      ${stock.price.toFixed(2)}
                    </span>
                    <div className={`text-xs ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      </div>
    </TooltipProvider>
  )
}