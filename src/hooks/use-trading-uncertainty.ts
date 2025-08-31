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