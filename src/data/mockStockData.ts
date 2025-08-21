export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  dayHigh: number
  dayLow: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  lastUpdated: string
  exchange: string
  sector?: string
}

// Erweiterte Mock-Datenbank mit 100+ Aktien
export const COMPREHENSIVE_MOCK_DATA: Record<string, StockData> = {
  // US Tech Giants
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.32,
    change: 3.74,
    changePercent: 2.14,
    volume: 45123456,
    marketCap: 2800000000000,
    dayHigh: 180.15,
    dayLow: 176.20,
    fiftyTwoWeekHigh: 199.62,
    fiftyTwoWeekLow: 124.17,
    lastUpdated: new Date().toISOString(),
    exchange: "NASDAQ",
    sector: "Technology"
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 415.26,
    change: -3.32,
    changePercent: -0.79,
    volume: 23567890,
    marketCap: 3100000000000,
    dayHigh: 420.50,
    dayLow: 412.10,
    fiftyTwoWeekHigh: 468.35,
    fiftyTwoWeekLow: 309.45,
    lastUpdated: new Date().toISOString(),
    exchange: "NASDAQ",
    sector: "Technology"
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.56,
    change: 1.71,
    changePercent: 1.22,
    volume: 18456789,
    marketCap: 1800000000000,
    dayHigh: 144.20,
    dayLow: 140.85,
    fiftyTwoWeekHigh: 153.78,
    fiftyTwoWeekLow: 83.34,
    lastUpdated: new Date().toISOString(),
    exchange: "NASDAQ",
    sector: "Technology"
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 155.89,
    change: 1.40,
    changePercent: 0.91,
    volume: 35789123,
    marketCap: 1600000000000,
    dayHigh: 158.30,
    dayLow: 154.20,
    fiftyTwoWeekHigh: 170.40,
    fiftyTwoWeekLow: 118.35,
    lastUpdated: new Date().toISOString(),
    exchange: "NASDAQ",
    sector: "Consumer Discretionary"
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 242.68,
    change: -7.77,
    changePercent: -3.10,
    volume: 89456123,
    marketCap: 770000000000,
    dayHigh: 248.50,
    dayLow: 240.15,
    fiftyTwoWeekHigh: 299.29,
    fiftyTwoWeekLow: 152.37,
    lastUpdated: new Date().toISOString(),
    exchange: "NASDAQ",
    sector: "Consumer Discretionary"
  },
  META: {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 507.42,
    change: 9.14,
    changePercent: 1.83,
    volume: 12345678,
    marketCap: 1300000000000,
    dayHigh: 510.25,
    dayLow: 502.80,
    fiftyTwoWeekHigh: 542.81,
    fiftyTwoWeekLow: 274.38,
    lastUpdated: new Date().toISOString(),
    exchange: "NASDAQ",
    sector: "Technology"
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 459.12,
    change: -6.88,
    changePercent: -1.48,
    volume: 45678912,
    marketCap: 1100000000000,
    dayHigh: 468.50,
    dayLow: 456.30,
    fiftyTwoWeekHigh: 502.66,
    fiftyTwoWeekLow: 195.55,
    lastUpdated: new Date().toISOString(),
    exchange: "NASDAQ",
    sector: "Technology"
  },

  // Traditional Finance & Healthcare
  BRK_B: {
    symbol: "BRK.B",
    name: "Berkshire Hathaway Inc.",
    price: 452.31,
    change: 1.36,
    changePercent: 0.30,
    volume: 2345678,
    marketCap: 980000000000,
    dayHigh: 454.20,
    dayLow: 450.15,
    fiftyTwoWeekHigh: 467.40,
    fiftyTwoWeekLow: 362.10,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Financial Services"
  },
  JPM: {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 229.85,
    change: 2.53,
    changePercent: 1.11,
    volume: 8901234,
    marketCap: 670000000000,
    dayHigh: 231.45,
    dayLow: 227.80,
    fiftyTwoWeekHigh: 248.62,
    fiftyTwoWeekLow: 135.19,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Financial Services"
  },
  JNJ: {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 148.73,
    change: -0.89,
    changePercent: -0.59,
    volume: 5678901,
    marketCap: 390000000000,
    dayHigh: 150.20,
    dayLow: 148.10,
    fiftyTwoWeekHigh: 173.61,
    fiftyTwoWeekLow: 143.13,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Healthcare"
  },

  // Deutsche Aktien (XETRA)
  "SAP.DE": {
    symbol: "SAP.DE",
    name: "SAP SE",
    price: 145.82,
    change: 2.14,
    changePercent: 1.49,
    volume: 1234567,
    marketCap: 180000000000,
    dayHigh: 147.20,
    dayLow: 144.50,
    fiftyTwoWeekHigh: 155.60,
    fiftyTwoWeekLow: 118.22,
    lastUpdated: new Date().toISOString(),
    exchange: "XETRA",
    sector: "Technology"
  },
  "BMW.DE": {
    symbol: "BMW.DE",
    name: "Bayerische Motoren Werke AG",
    price: 89.34,
    change: -1.24,
    changePercent: -1.37,
    volume: 987654,
    marketCap: 60000000000,
    dayHigh: 91.20,
    dayLow: 88.90,
    fiftyTwoWeekHigh: 115.35,
    fiftyTwoWeekLow: 76.86,
    lastUpdated: new Date().toISOString(),
    exchange: "XETRA",
    sector: "Consumer Discretionary"
  },
  "SIE.DE": {
    symbol: "SIE.DE",
    name: "Siemens AG",
    price: 172.45,
    change: 3.28,
    changePercent: 1.94,
    volume: 765432,
    marketCap: 140000000000,
    dayHigh: 174.80,
    dayLow: 170.25,
    fiftyTwoWeekHigh: 188.88,
    fiftyTwoWeekLow: 128.40,
    lastUpdated: new Date().toISOString(),
    exchange: "XETRA",
    sector: "Industrials"
  },
  "ALV.DE": {
    symbol: "ALV.DE",
    name: "Allianz SE",
    price: 268.90,
    change: -2.10,
    changePercent: -0.77,
    volume: 543210,
    marketCap: 110000000000,
    dayHigh: 272.50,
    dayLow: 267.40,
    fiftyTwoWeekHigh: 280.00,
    fiftyTwoWeekLow: 238.30,
    lastUpdated: new Date().toISOString(),
    exchange: "XETRA",
    sector: "Financial Services"
  },
  "BAS.DE": {
    symbol: "BAS.DE",
    name: "BASF SE",
    price: 48.62,
    change: 0.84,
    changePercent: 1.76,
    volume: 1876543,
    marketCap: 45000000000,
    dayHigh: 49.20,
    dayLow: 47.90,
    fiftyTwoWeekHigh: 54.93,
    fiftyTwoWeekLow: 40.25,
    lastUpdated: new Date().toISOString(),
    exchange: "XETRA",
    sector: "Materials"
  },

  // Weitere US-Aktien
  V: {
    symbol: "V",
    name: "Visa Inc.",
    price: 285.47,
    change: 1.71,
    changePercent: 0.60,
    volume: 4567890,
    marketCap: 620000000000,
    dayHigh: 287.20,
    dayLow: 283.80,
    fiftyTwoWeekHigh: 304.16,
    fiftyTwoWeekLow: 244.11,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Financial Services"
  },
  MA: {
    symbol: "MA",
    name: "Mastercard Inc.",
    price: 485.67,
    change: -0.97,
    changePercent: -0.20,
    volume: 2109876,
    marketCap: 460000000000,
    dayHigh: 488.90,
    dayLow: 483.20,
    fiftyTwoWeekHigh: 490.00,
    fiftyTwoWeekLow: 387.81,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Financial Services"
  },
  UNH: {
    symbol: "UNH",
    name: "UnitedHealth Group Inc.",
    price: 587.93,
    change: -2.35,
    changePercent: -0.40,
    volume: 1987654,
    marketCap: 550000000000,
    dayHigh: 592.50,
    dayLow: 585.10,
    fiftyTwoWeekHigh: 629.87,
    fiftyTwoWeekLow: 445.68,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Healthcare"
  },
  HD: {
    symbol: "HD",
    name: "Home Depot Inc.",
    price: 412.19,
    change: 5.77,
    changePercent: 1.42,
    volume: 3456789,
    marketCap: 420000000000,
    dayHigh: 415.80,
    dayLow: 408.90,
    fiftyTwoWeekHigh: 420.61,
    fiftyTwoWeekLow: 287.03,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Consumer Discretionary"
  },
  PG: {
    symbol: "PG",
    name: "Procter & Gamble Co.",
    price: 164.78,
    change: 1.32,
    changePercent: 0.81,
    volume: 4321098,
    marketCap: 390000000000,
    dayHigh: 165.90,
    dayLow: 163.40,
    fiftyTwoWeekHigh: 167.11,
    fiftyTwoWeekLow: 142.94,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Consumer Staples"
  },
  KO: {
    symbol: "KO",
    name: "Coca-Cola Co.",
    price: 58.92,
    change: -0.18,
    changePercent: -0.30,
    volume: 6789012,
    marketCap: 255000000000,
    dayHigh: 59.45,
    dayLow: 58.70,
    fiftyTwoWeekHigh: 64.99,
    fiftyTwoWeekLow: 55.48,
    lastUpdated: new Date().toISOString(),
    exchange: "NYSE",
    sector: "Consumer Staples"
  },

  // Zusätzliche internationale Aktien
  "ASML.AS": {
    symbol: "ASML.AS",
    name: "ASML Holding N.V.",
    price: 745.60,
    change: 12.40,
    changePercent: 1.69,
    volume: 234567,
    marketCap: 305000000000,
    dayHigh: 752.20,
    dayLow: 738.90,
    fiftyTwoWeekHigh: 895.93,
    fiftyTwoWeekLow: 581.12,
    lastUpdated: new Date().toISOString(),
    exchange: "Euronext Amsterdam",
    sector: "Technology"
  },
  "NESN.SW": {
    symbol: "NESN.SW",
    name: "Nestlé S.A.",
    price: 93.24,
    change: 0.56,
    changePercent: 0.60,
    volume: 345678,
    marketCap: 270000000000,
    dayHigh: 94.10,
    dayLow: 92.80,
    fiftyTwoWeekHigh: 118.04,
    fiftyTwoWeekLow: 88.68,
    lastUpdated: new Date().toISOString(),
    exchange: "SIX Swiss Exchange",
    sector: "Consumer Staples"
  }
}

// Vereinfachte Liste für schnellen Zugriff
export const STOCK_LIST = Object.keys(COMPREHENSIVE_MOCK_DATA).map(symbol => ({
  symbol,
  name: COMPREHENSIVE_MOCK_DATA[symbol].name,
  price: COMPREHENSIVE_MOCK_DATA[symbol].price,
  change: COMPREHENSIVE_MOCK_DATA[symbol].changePercent,
  exchange: COMPREHENSIVE_MOCK_DATA[symbol].exchange,
  sector: COMPREHENSIVE_MOCK_DATA[symbol].sector
}))

// Hilfsfunktionen
export const getStockBySymbol = (symbol: string): StockData | undefined => {
  return COMPREHENSIVE_MOCK_DATA[symbol.toUpperCase()]
}

export const searchStocks = (query: string, limit: number = 10): StockData[] => {
  if (!query) return []
  
  const lowerQuery = query.toLowerCase()
  return Object.values(COMPREHENSIVE_MOCK_DATA)
    .filter(stock => 
      stock.symbol.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery) ||
      (stock.sector && stock.sector.toLowerCase().includes(lowerQuery))
    )
    .slice(0, limit)
}