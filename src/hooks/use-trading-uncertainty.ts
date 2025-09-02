"use client"

import { useMemo } from 'react'

export interface TradingUncertaintyData {
  timestamp: Date;
  symbol: string;
  action: 'buy' | 'sell';
  amount: number;
  price: number;
  perceivedUncertainty: number; // 1-5 scale (5 = very uncertain)
  unclearConcepts: string[];    // Array of unclear concept IDs
  aiConfidence: number;         // AI confidence for this decision
  marketCondition: string;      // Current market sentiment
}

export interface UncertaintyAnalytics {
  // Perceived Uncertainty (Likert Scale Data)
  averagePerceivedUncertainty: number;
  uncertaintyTrend: 'increasing' | 'decreasing' | 'stable';
  recentDecisions: number;
  
  // Epistemic Uncertainty (Unclear Concepts)
  totalUnclearConcepts: number;
  totalConcepts: number;
  unclearConceptsPercentage: number;
  mostUnclearConcepts: { conceptId: string; count: number }[];
  
  // Decision Stability & Consistency
  decisionConsistency: number; // Based on similar market conditions
  stabilityScore: number;      // Consistency across time
  
  // Performance Correlations
  averageAiConfidenceWhenUncertain: number;
  uncertaintyVsPerformance: 'positive' | 'negative' | 'neutral';
}

// Static dummy trading data for realistic simulation
const getDummyTradingData = (symbol: string): TradingUncertaintyData[] => {
  const baseData: Record<string, TradingUncertaintyData[]> = {
    'AAPL': [
      {
        timestamp: new Date('2024-08-20T10:30:00'),
        symbol: 'AAPL',
        action: 'buy',
        amount: 100,
        price: 225.50,
        perceivedUncertainty: 3,
        unclearConcepts: ['riskAssessment'],
        aiConfidence: 0.85,
        marketCondition: 'bullish'
      },
      {
        timestamp: new Date('2024-08-25T14:15:00'),
        symbol: 'AAPL',
        action: 'sell',
        amount: 50,
        price: 230.20,
        perceivedUncertainty: 2,
        unclearConcepts: [],
        aiConfidence: 0.92,
        marketCondition: 'neutral'
      },
      {
        timestamp: new Date('2024-08-28T09:45:00'),
        symbol: 'AAPL',
        action: 'buy',
        amount: 75,
        price: 228.80,
        perceivedUncertainty: 4,
        unclearConcepts: ['aiRecommendation', 'marketAnalysis'],
        aiConfidence: 0.78,
        marketCondition: 'bearish'
      }
    ],
    'TSLA': [
      {
        timestamp: new Date('2024-08-19T11:20:00'),
        symbol: 'TSLA',
        action: 'buy',
        amount: 25,
        price: 245.30,
        perceivedUncertainty: 4,
        unclearConcepts: ['riskAssessment', 'financialImpact'],
        aiConfidence: 0.71,
        marketCondition: 'volatile'
      },
      {
        timestamp: new Date('2024-08-23T16:00:00'),
        symbol: 'TSLA',
        action: 'sell',
        amount: 15,
        price: 251.60,
        perceivedUncertainty: 5,
        unclearConcepts: ['aiRecommendation', 'marketAnalysis', 'riskAssessment'],
        aiConfidence: 0.65,
        marketCondition: 'bearish'
      },
      {
        timestamp: new Date('2024-08-27T13:30:00'),
        symbol: 'TSLA',
        action: 'buy',
        amount: 40,
        price: 248.90,
        perceivedUncertainty: 3,
        unclearConcepts: ['financialImpact'],
        aiConfidence: 0.82,
        marketCondition: 'neutral'
      }
    ],
    'NVDA': [
      {
        timestamp: new Date('2024-08-21T10:00:00'),
        symbol: 'NVDA',
        action: 'buy',
        amount: 20,
        price: 125.40,
        perceivedUncertainty: 2,
        unclearConcepts: [],
        aiConfidence: 0.94,
        marketCondition: 'bullish'
      },
      {
        timestamp: new Date('2024-08-26T12:45:00'),
        symbol: 'NVDA',
        action: 'buy',
        amount: 30,
        price: 128.70,
        perceivedUncertainty: 1,
        unclearConcepts: [],
        aiConfidence: 0.96,
        marketCondition: 'bullish'
      }
    ],
    // NEW STOCKS - 8 additional stocks with trading data
    // SICHER (11-20% uncertainty)
    'ALV.DE': [
      {
        timestamp: new Date('2024-08-22T11:15:00'),
        symbol: 'ALV.DE',
        action: 'buy',
        amount: 50,
        price: 268.90,
        perceivedUncertainty: 2,
        unclearConcepts: [],
        aiConfidence: 0.89,
        marketCondition: 'neutral'
      },
      {
        timestamp: new Date('2024-08-28T14:30:00'),
        symbol: 'ALV.DE',
        action: 'buy',
        amount: 25,
        price: 265.40,
        perceivedUncertainty: 2,
        unclearConcepts: ['riskAssessment'],
        aiConfidence: 0.86,
        marketCondition: 'bearish'
      }
    ],
    'NESN.SW': [
      {
        timestamp: new Date('2024-08-23T09:45:00'),
        symbol: 'NESN.SW',
        action: 'buy',
        amount: 40,
        price: 93.24,
        perceivedUncertainty: 2,
        unclearConcepts: [],
        aiConfidence: 0.91,
        marketCondition: 'bullish'
      }
    ],
    'SAP.DE': [
      {
        timestamp: new Date('2024-08-24T16:20:00'),
        symbol: 'SAP.DE',
        action: 'sell',
        amount: 30,
        price: 145.82,
        perceivedUncertainty: 3,
        unclearConcepts: ['marketAnalysis'],
        aiConfidence: 0.78,
        marketCondition: 'volatile'
      },
      {
        timestamp: new Date('2024-08-29T13:10:00'),
        symbol: 'SAP.DE',
        action: 'sell',
        amount: 20,
        price: 142.60,
        perceivedUncertainty: 3,
        unclearConcepts: ['riskAssessment', 'financialImpact'],
        aiConfidence: 0.74,
        marketCondition: 'bearish'
      }
    ],
    'SIE.DE': [
      {
        timestamp: new Date('2024-08-25T10:50:00'),
        symbol: 'SIE.DE',
        action: 'sell',
        amount: 35,
        price: 172.45,
        perceivedUncertainty: 3,
        unclearConcepts: ['aiRecommendation'],
        aiConfidence: 0.81,
        marketCondition: 'neutral'
      }
    ],
    // UNSICHER (21-35% uncertainty)
    'BRK_B': [
      {
        timestamp: new Date('2024-08-26T15:40:00'),
        symbol: 'BRK_B',
        action: 'buy',
        amount: 15,
        price: 452.31,
        perceivedUncertainty: 3,
        unclearConcepts: ['marketAnalysis', 'riskAssessment'],
        aiConfidence: 0.73,
        marketCondition: 'volatile'
      },
      {
        timestamp: new Date('2024-08-30T11:25:00'),
        symbol: 'BRK_B',
        action: 'buy',
        amount: 10,
        price: 448.20,
        perceivedUncertainty: 4,
        unclearConcepts: ['aiRecommendation', 'financialImpact', 'marketAnalysis'],
        aiConfidence: 0.69,
        marketCondition: 'bearish'
      }
    ],
    'ASML.AS': [
      {
        timestamp: new Date('2024-08-27T12:35:00'),
        symbol: 'ASML.AS',
        action: 'buy',
        amount: 8,
        price: 745.60,
        perceivedUncertainty: 3,
        unclearConcepts: ['riskAssessment', 'marketAnalysis'],
        aiConfidence: 0.76,
        marketCondition: 'volatile'
      }
    ],
    'BMW.DE': [
      {
        timestamp: new Date('2024-08-28T14:15:00'),
        symbol: 'BMW.DE',
        action: 'sell',
        amount: 45,
        price: 89.34,
        perceivedUncertainty: 4,
        unclearConcepts: ['aiRecommendation', 'marketAnalysis', 'riskAssessment'],
        aiConfidence: 0.64,
        marketCondition: 'bearish'
      },
      {
        timestamp: new Date('2024-08-31T10:20:00'),
        symbol: 'BMW.DE',
        action: 'sell',
        amount: 30,
        price: 87.80,
        perceivedUncertainty: 4,
        unclearConcepts: ['financialImpact', 'riskAssessment', 'aiRecommendation', 'marketAnalysis'],
        aiConfidence: 0.61,
        marketCondition: 'bearish'
      }
    ],
    'BAS.DE': [
      {
        timestamp: new Date('2024-08-29T16:45:00'),
        symbol: 'BAS.DE',
        action: 'sell',
        amount: 60,
        price: 48.62,
        perceivedUncertainty: 4,
        unclearConcepts: ['marketAnalysis', 'riskAssessment', 'financialImpact'],
        aiConfidence: 0.66,
        marketCondition: 'volatile'
      }
    ]
  }
  
  return baseData[symbol] || []
}

// Static dummy analytics calculation
const calculateDummyAnalytics = (data: TradingUncertaintyData[]): UncertaintyAnalytics => {
  if (data.length === 0) {
    return {
      averagePerceivedUncertainty: 3.0,
      uncertaintyTrend: 'stable',
      recentDecisions: 0,
      totalUnclearConcepts: 0,
      totalConcepts: 0,
      unclearConceptsPercentage: 0,
      mostUnclearConcepts: [],
      decisionConsistency: 0.7,
      stabilityScore: 0.8,
      averageAiConfidenceWhenUncertain: 0.75,
      uncertaintyVsPerformance: 'neutral'
    }
  }

  const recentData = data.slice(-10)
  const avgUncertainty = recentData.reduce((sum, d) => sum + d.perceivedUncertainty, 0) / recentData.length
  
  const allUnclearConcepts = recentData.flatMap(d => d.unclearConcepts)
  const totalPossibleConcepts = recentData.length * 4
  const unclearPercentage = (allUnclearConcepts.length / totalPossibleConcepts) * 100

  const conceptCounts = allUnclearConcepts.reduce((acc, concept) => {
    acc[concept] = (acc[concept] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostUnclearConcepts = Object.entries(conceptCounts)
    .map(([conceptId, count]) => ({ conceptId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const uncertaintyVariance = recentData.reduce((sum, d) => {
    return sum + Math.pow(d.perceivedUncertainty - avgUncertainty, 2)
  }, 0) / recentData.length
  
  const stabilityScore = Math.max(0, 1 - (uncertaintyVariance / 2))
  const decisionConsistency = 1 - (unclearPercentage / 100)

  return {
    averagePerceivedUncertainty: avgUncertainty,
    uncertaintyTrend: avgUncertainty > 3.5 ? 'increasing' : avgUncertainty < 2.5 ? 'decreasing' : 'stable',
    recentDecisions: recentData.length,
    totalUnclearConcepts: allUnclearConcepts.length,
    totalConcepts: totalPossibleConcepts,
    unclearConceptsPercentage: unclearPercentage,
    mostUnclearConcepts,
    decisionConsistency,
    stabilityScore,
    averageAiConfidenceWhenUncertain: 0.75,
    uncertaintyVsPerformance: 'neutral'
  }
}

export function useTradingUncertainty() {
  // Static dummy data - no localStorage, no state changes
  const dummyData = useMemo(() => {
    const allData = [
      ...getDummyTradingData('AAPL'),
      ...getDummyTradingData('TSLA'),
      ...getDummyTradingData('NVDA')
    ]
    return allData
  }, [])

  const analytics = useMemo(() => calculateDummyAnalytics(dummyData), [dummyData])

  // Demo function - doesn't actually save data
  const addUncertaintyData = (data: TradingUncertaintyData) => {
    console.log('Demo: Trading decision recorded (not saved):', data)
  }

  // Get uncertainty data for a specific stock from dummy data
  const getStockUncertaintyHistory = (symbol: string) => {
    return getDummyTradingData(symbol)
  }

  // Get recent uncertainty trend from dummy data  
  const getRecentTrend = (days: number = 7) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return dummyData
      .filter(d => d.timestamp >= cutoffDate)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  // Demo functions - no actual clearing or export needed
  const clearAllData = () => {
    console.log('Demo: Clear all data (no action taken)')
  }

  const exportData = () => {
    return {
      rawData: dummyData,
      analytics,
      exportTimestamp: new Date()
    }
  }

  return {
    uncertaintyData: dummyData,
    analytics,
    addUncertaintyData,
    getStockUncertaintyHistory,
    getRecentTrend,
    clearAllData,
    exportData,
    hasData: dummyData.length > 0
  }
}