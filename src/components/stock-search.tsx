"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
}

interface StockSearchProps {
  onStockSelect?: (stock: string) => void
}

const DUMMY_STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.32, change: 2.1 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.26, change: -0.8 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: 1.2 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 155.89, change: 0.9 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 242.68, change: -3.2 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 507.42, change: 1.8 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 459.12, change: -1.5 },
  { symbol: "BRK.B", name: "Berkshire Hathaway", price: 452.31, change: 0.3 },
  { symbol: "LLY", name: "Eli Lilly and Co.", price: 847.29, change: 2.7 },
  { symbol: "V", name: "Visa Inc.", price: 285.47, change: 0.6 },
  { symbol: "UNH", name: "UnitedHealth Group", price: 587.93, change: -0.4 },
  { symbol: "JPM", name: "JPMorgan Chase", price: 229.85, change: 1.1 },
  { symbol: "WMT", name: "Walmart Inc.", price: 84.52, change: 0.7 },
  { symbol: "MA", name: "Mastercard Inc.", price: 485.67, change: -0.2 },
  { symbol: "PG", name: "Procter & Gamble", price: 164.78, change: 0.8 },
  { symbol: "HD", name: "Home Depot Inc.", price: 412.19, change: 1.4 },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 148.73, change: -0.6 },
  { symbol: "BAC", name: "Bank of America", price: 43.21, change: 1.9 },
  { symbol: "ABBV", name: "AbbVie Inc.", price: 175.84, change: 0.5 },
  { symbol: "KO", name: "Coca-Cola Co.", price: 58.92, change: -0.3 }
]

export function StockSearch({ onStockSelect }: StockSearchProps = {}) {
  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  
  const filteredStocks = React.useMemo(() => {
    if (!query) return []
    return DUMMY_STOCKS.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10)
  }, [query])

  const handleStockClick = (stock: Stock) => {
    setQuery("")
    setIsOpen(false)
    if (onStockSelect) {
      onStockSelect(stock.symbol)
    } else {
      window.location.href = `/statistik?stock=${stock.symbol}`
    }
  }

  return (
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
      
      {isOpen && filteredStocks.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-primary/20 rounded-lg shadow-lg shadow-primary/10 z-50 max-h-80 overflow-y-auto">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => handleStockClick(stock)}
              className="flex items-center justify-between p-3 hover:bg-primary/10 cursor-pointer border-b border-border/50 last:border-b-0 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-mono font-bold text-foreground">{stock.symbol}</span>
                <span className="text-sm text-muted-foreground truncate">{stock.name}</span>
              </div>
              <div className="text-right">
                <span className="font-medium">${stock.price}</span>
                <div className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}