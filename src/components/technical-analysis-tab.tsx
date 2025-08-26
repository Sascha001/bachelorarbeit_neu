"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Dialog components removed as they're no longer used - replaced with Info-Box pattern
import React, { useState } from "react"
import 'katex/dist/katex.min.css'

// Custom CSS for formula scaling and violet bloom scrollbar
const formulaStyles = `
  .formula-container .katex {
    font-size: 0.9rem !important;
  }
  .formula-container .katex .frac-line {
    border-bottom-width: 0.08em !important;
  }
  .formula-container-small .katex {
    font-size: 0.8rem !important;
  }
  .formula-container-large .katex {
    font-size: 1rem !important;
  }

  /* Violet Bloom Scrollbar Styling */
  .violet-bloom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: hsl(270 95% 75%) hsl(270 20% 98%);
  }

  .violet-bloom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-track {
    background: linear-gradient(180deg, hsl(270 20% 98%) 0%, hsl(270 15% 95%) 100%);
    border-radius: 4px;
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, hsl(270 95% 75%) 0%, hsl(280 80% 70%) 50%, hsl(290 75% 65%) 100%);
    border-radius: 4px;
    border: 1px solid hsl(270 60% 85%);
    transition: all 0.3s ease;
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, hsl(270 95% 70%) 0%, hsl(280 85% 65%) 50%, hsl(290 80% 60%) 100%);
    border-color: hsl(270 70% 75%);
    transform: scale(1.1);
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-thumb:active {
    background: linear-gradient(180deg, hsl(270 95% 65%) 0%, hsl(280 90% 60%) 50%, hsl(290 85% 55%) 100%);
    border-color: hsl(270 80% 65%);
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-corner {
    background: hsl(270 20% 98%);
  }
`
import { BlockMath } from 'react-katex'
import { 
  Database, 
  Brain, 
  Users, 
  BarChart3, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Info,
  X
} from "lucide-react"

interface TechnicalAnalysisTabProps {
  selectedStock: string
}

// Mock technical data
interface FeatureImportance {
  name: string;
  weight: number;
}

interface ModelUncertaintyParams {
  epistemicUncertainty: { value: number; predictionVariance: number; meanPrediction: number };
  aleatoricUncertainty: { value: number; confidenceInterval: number; maxExpectedVariance: number };
  overfittingRisk: { value: number; trainLoss: number; testLoss: number };
  robustness: { value: number; perturbationSensitivity: number; baselinePrediction: number };
  explanationConsistency: { value: number; featureImportanceCorrelation: number };
}

interface TechnicalData {
  dataValidation: {
    fundamentalData: { score: number; status: string; issues: number };
    newsReliability: { score: number; status: string; sources: number };
    timeSeriesIntegrity: { score: number; status: string; gaps: number };
    tradingVolume: { score: number; status: string; anomalies: number };
  };
  modelMetrics: {
    trainingAccuracy: number;
    validationLoss: number;
    featureImportance: FeatureImportance[];
    predictionInterval: string;
    uncertaintyParams: ModelUncertaintyParams;
  };
  humanFactors: {
    expertConsensus: number;
    marketSentiment: number;
    analystReliability: number;
    behavioralBias: number;
  };
}

// Status based on score - Global helper functions
const getStatus = (score: number) => {
  if (score >= 90) return "excellent"
  if (score >= 80) return "good" 
  if (score >= 70) return "fair"
  return "poor"
}

// For validation loss (lower is better)
const getValidationLossStatus = (loss: number) => {
  if (loss <= 0.02) return "excellent"
  if (loss <= 0.05) return "good"
  if (loss <= 0.10) return "fair"
  return "poor"
}

// Get uncertainty value (1 - certainty) for each dimension
const getUncertaintyValue = (parameterName: string, uncertaintyParams: ModelUncertaintyParams) => {
  switch (parameterName) {
    case "Epistemische Unsicherheit":
      return (1 - uncertaintyParams.epistemicUncertainty.value) * 100;
    case "Aleatorische Unsicherheit":
      return (1 - uncertaintyParams.aleatoricUncertainty.value) * 100;
    case "Overfitting-Risiko":
      return (1 - uncertaintyParams.overfittingRisk.value) * 100;
    case "Robustheit":
      return (1 - uncertaintyParams.robustness.value) * 100;
    case "Erklärungs-Konsistenz":
      return (1 - uncertaintyParams.explanationConsistency.value) * 100;
    default:
      return 50; // fallback
  }
}

// For prediction interval (narrower is better)
const getPredictionIntervalStatus = (intervalString: string) => {
  const intervalValue = parseFloat(intervalString.replace(/[±%\(\)]/g, '').split(' ')[0]);
  if (intervalValue <= 1.0) return "excellent"
  if (intervalValue <= 2.0) return "good"
  if (intervalValue <= 4.0) return "fair"
  return "poor"
}

const getTechnicalData = (stock: string): TechnicalData => {
  // Calculate actual scores from parameter functions
  const fundamentalParams = getFundamentalDataParams(stock)
  const newsParams = getNewsReliabilityParams(stock) 
  const timeSeriesParams = getTimeSeriesIntegrityParams(stock)
  const tradingVolumeParams = getTradingVolumeParams(stock)
  
  // Calculate weighted averages for each dimension
  const fundamentalScore = Math.round((0.2 * fundamentalParams.completeness.value + 
                                      0.2 * fundamentalParams.timeliness.value + 
                                      0.2 * fundamentalParams.consistency.value + 
                                      0.2 * fundamentalParams.accuracy.value + 
                                      0.2 * fundamentalParams.stability.value) * 100)
  
  const newsScore = Math.round((0.3 * newsParams.sourceReliability.value + 
                               0.3 * newsParams.reputationAccuracy.value + 
                               0.25 * newsParams.crossSourceConsensus.value + 
                               0.15 * newsParams.biasCheck.value) * 100)
  
  const timeSeriesScore = Math.round((0.25 * timeSeriesParams.completeness.value + 
                                     0.25 * timeSeriesParams.outlierFreedom.value + 
                                     0.25 * timeSeriesParams.revisionStability.value + 
                                     0.25 * timeSeriesParams.continuity.value) * 100)
  
  const tradingVolumeScore = Math.round((0.4 * tradingVolumeParams.concentration.value + 
                                        0.3 * tradingVolumeParams.anomalousSpikes.value + 
                                        0.3 * tradingVolumeParams.timeStability.value) * 100)
  
  // Calculate derived metrics
  const fundamentalIssues = Math.max(0, Math.floor((100 - fundamentalScore) / 10))
  const newsSources = newsParams.sourceReliability.totalSources
  const timeSeriesGaps = timeSeriesParams.continuity.gaps > 30 ? Math.floor(timeSeriesParams.continuity.gaps / 15) : 0
  const tradingAnomalies = tradingVolumeParams.anomalousSpikes.spikes
  
  // Stock-specific model metrics with new uncertainty parameters
  const getModelMetrics = (stockSymbol: string) => {
    const baseAccuracy = fundamentalScore * 0.85 + timeSeriesScore * 0.15
    const baseValidationLoss = Math.max(0.01, (100 - baseAccuracy) / 1000)
    
    // Get uncertainty parameters for this stock
    const uncertaintyParams = getModelUncertaintyParams(stockSymbol)
    
    // Calculate new feature importance based on uncertainty framework (ChatGPT Framework)
    const newFeatureImportance = [
      { name: "Epistemische Unsicherheit", weight: 0.25 },
      { name: "Aleatorische Unsicherheit", weight: 0.15 },
      { name: "Overfitting-Risiko", weight: 0.20 },
      { name: "Robustheit", weight: 0.20 },
      { name: "Erklärungs-Konsistenz", weight: 0.20 }
    ]
    
    return {
      trainingAccuracy: Math.round(baseAccuracy * 10) / 10,
      validationLoss: Math.round(baseValidationLoss * 1000) / 1000,
      featureImportance: newFeatureImportance,
      predictionInterval: `±${uncertaintyParams.aleatoricUncertainty.confidenceInterval.toFixed(1)}% (95% Konfidenz)`,
      uncertaintyParams: uncertaintyParams
    }
  }
  
  const getHumanFactors = () => {
    const baseConsensus = Math.min(95, fundamentalScore * 0.8 + newsScore * 0.2)
    const baseSentiment = Math.min(95, newsScore * 0.7 + tradingVolumeScore * 0.3)
    
    return {
      expertConsensus: Math.round(baseConsensus),
      marketSentiment: Math.round(baseSentiment), 
      analystReliability: Math.round((fundamentalScore + newsScore) / 2),
      behavioralBias: Math.max(5, Math.round((100 - tradingVolumeScore) / 3))
    }
  }
  
  return {
    dataValidation: {
      fundamentalData: { score: fundamentalScore, status: getStatus(fundamentalScore), issues: fundamentalIssues },
      newsReliability: { score: newsScore, status: getStatus(newsScore), sources: newsSources },
      timeSeriesIntegrity: { score: timeSeriesScore, status: getStatus(timeSeriesScore), gaps: timeSeriesGaps },
      tradingVolume: { score: tradingVolumeScore, status: getStatus(tradingVolumeScore), anomalies: tradingAnomalies }
    },
    modelMetrics: getModelMetrics(stock),
    humanFactors: getHumanFactors()
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent": return "text-green-600 bg-green-500/10"
    case "good": return "text-blue-600 bg-blue-500/10"
    case "fair": return "text-yellow-600 bg-yellow-500/10"
    case "poor": return "text-red-600 bg-red-500/10"
    default: return "text-gray-600 bg-gray-500/10"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "excellent": return <CheckCircle className="h-4 w-4 text-green-600" />
    case "good": return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "fair": return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "poor": return <XCircle className="h-4 w-4 text-red-600" />
    default: return <Clock className="h-4 w-4 text-gray-600" />
  }
}

// Model Uncertainty Parameters Function
export const getModelUncertaintyParams = (stock: string): ModelUncertaintyParams => {
  const params: Record<string, ModelUncertaintyParams> = {
    // AAPL: Stable Tech - High model certainty
    AAPL: {
      epistemicUncertainty: { value: 0.85, predictionVariance: 0.12, meanPrediction: 2.1 },
      aleatoricUncertainty: { value: 0.75, confidenceInterval: 1.8, maxExpectedVariance: 3.2 },
      overfittingRisk: { value: 0.90, trainLoss: 0.05, testLoss: 0.07 },
      robustness: { value: 0.88, perturbationSensitivity: 0.15, baselinePrediction: 2.1 },
      explanationConsistency: { value: 0.92, featureImportanceCorrelation: 0.89 }
    },
    MSFT: {
      epistemicUncertainty: { value: 0.88, predictionVariance: 0.10, meanPrediction: 1.9 },
      aleatoricUncertainty: { value: 0.78, confidenceInterval: 1.6, maxExpectedVariance: 2.9 },
      overfittingRisk: { value: 0.92, trainLoss: 0.04, testLoss: 0.06 },
      robustness: { value: 0.90, perturbationSensitivity: 0.12, baselinePrediction: 1.9 },
      explanationConsistency: { value: 0.94, featureImportanceCorrelation: 0.91 }
    },
    GOOGL: {
      epistemicUncertainty: { value: 0.82, predictionVariance: 0.15, meanPrediction: 2.3 },
      aleatoricUncertainty: { value: 0.72, confidenceInterval: 2.1, maxExpectedVariance: 3.5 },
      overfittingRisk: { value: 0.87, trainLoss: 0.06, testLoss: 0.08 },
      robustness: { value: 0.85, perturbationSensitivity: 0.18, baselinePrediction: 2.3 },
      explanationConsistency: { value: 0.89, featureImportanceCorrelation: 0.86 }
    },
    
    // NVDA: Volatile Tech - Low model certainty
    NVDA: {
      epistemicUncertainty: { value: 0.65, predictionVariance: 0.35, meanPrediction: 3.2 },
      aleatoricUncertainty: { value: 0.55, confidenceInterval: 4.2, maxExpectedVariance: 6.8 },
      overfittingRisk: { value: 0.70, trainLoss: 0.12, testLoss: 0.18 },
      robustness: { value: 0.60, perturbationSensitivity: 0.42, baselinePrediction: 3.2 },
      explanationConsistency: { value: 0.68, featureImportanceCorrelation: 0.65 }
    },
    META: {
      epistemicUncertainty: { value: 0.72, predictionVariance: 0.25, meanPrediction: 2.8 },
      aleatoricUncertainty: { value: 0.65, confidenceInterval: 3.1, maxExpectedVariance: 4.9 },
      overfittingRisk: { value: 0.75, trainLoss: 0.09, testLoss: 0.13 },
      robustness: { value: 0.68, perturbationSensitivity: 0.32, baselinePrediction: 2.8 },
      explanationConsistency: { value: 0.74, featureImportanceCorrelation: 0.71 }
    },
    AMZN: {
      epistemicUncertainty: { value: 0.62, predictionVariance: 0.38, meanPrediction: 3.5 },
      aleatoricUncertainty: { value: 0.52, confidenceInterval: 4.8, maxExpectedVariance: 7.2 },
      overfittingRisk: { value: 0.68, trainLoss: 0.15, testLoss: 0.22 },
      robustness: { value: 0.58, perturbationSensitivity: 0.45, baselinePrediction: 3.5 },
      explanationConsistency: { value: 0.64, featureImportanceCorrelation: 0.61 }
    },
    
    // Traditional US - High model certainty
    "BRK.B": {
      epistemicUncertainty: { value: 0.92, predictionVariance: 0.08, meanPrediction: 1.6 },
      aleatoricUncertainty: { value: 0.85, confidenceInterval: 1.2, maxExpectedVariance: 2.1 },
      overfittingRisk: { value: 0.95, trainLoss: 0.03, testLoss: 0.04 },
      robustness: { value: 0.93, perturbationSensitivity: 0.09, baselinePrediction: 1.6 },
      explanationConsistency: { value: 0.96, featureImportanceCorrelation: 0.94 }
    },
    JPM: {
      epistemicUncertainty: { value: 0.90, predictionVariance: 0.09, meanPrediction: 1.7 },
      aleatoricUncertainty: { value: 0.83, confidenceInterval: 1.4, maxExpectedVariance: 2.3 },
      overfittingRisk: { value: 0.93, trainLoss: 0.04, testLoss: 0.05 },
      robustness: { value: 0.91, perturbationSensitivity: 0.11, baselinePrediction: 1.7 },
      explanationConsistency: { value: 0.94, featureImportanceCorrelation: 0.92 }
    },
    
    // Traditional US Healthcare/Finance - Very high model certainty
    JNJ: {
      epistemicUncertainty: { value: 0.94, predictionVariance: 0.06, meanPrediction: 1.4 },
      aleatoricUncertainty: { value: 0.87, confidenceInterval: 1.1, maxExpectedVariance: 1.9 },
      overfittingRisk: { value: 0.96, trainLoss: 0.02, testLoss: 0.03 },
      robustness: { value: 0.95, perturbationSensitivity: 0.07, baselinePrediction: 1.4 },
      explanationConsistency: { value: 0.97, featureImportanceCorrelation: 0.95 }
    },
    V: {
      epistemicUncertainty: { value: 0.91, predictionVariance: 0.08, meanPrediction: 1.7 },
      aleatoricUncertainty: { value: 0.84, confidenceInterval: 1.3, maxExpectedVariance: 2.2 },
      overfittingRisk: { value: 0.94, trainLoss: 0.03, testLoss: 0.04 },
      robustness: { value: 0.92, perturbationSensitivity: 0.10, baselinePrediction: 1.7 },
      explanationConsistency: { value: 0.95, featureImportanceCorrelation: 0.93 }
    },
    MA: {
      epistemicUncertainty: { value: 0.89, predictionVariance: 0.09, meanPrediction: 1.8 },
      aleatoricUncertainty: { value: 0.82, confidenceInterval: 1.4, maxExpectedVariance: 2.4 },
      overfittingRisk: { value: 0.92, trainLoss: 0.04, testLoss: 0.05 },
      robustness: { value: 0.90, perturbationSensitivity: 0.12, baselinePrediction: 1.8 },
      explanationConsistency: { value: 0.93, featureImportanceCorrelation: 0.91 }
    },
    UNH: {
      epistemicUncertainty: { value: 0.87, predictionVariance: 0.11, meanPrediction: 1.9 },
      aleatoricUncertainty: { value: 0.80, confidenceInterval: 1.6, maxExpectedVariance: 2.7 },
      overfittingRisk: { value: 0.90, trainLoss: 0.05, testLoss: 0.06 },
      robustness: { value: 0.88, perturbationSensitivity: 0.14, baselinePrediction: 1.9 },
      explanationConsistency: { value: 0.91, featureImportanceCorrelation: 0.89 }
    },
    HD: {
      epistemicUncertainty: { value: 0.85, predictionVariance: 0.13, meanPrediction: 2.0 },
      aleatoricUncertainty: { value: 0.78, confidenceInterval: 1.7, maxExpectedVariance: 2.9 },
      overfittingRisk: { value: 0.88, trainLoss: 0.06, testLoss: 0.07 },
      robustness: { value: 0.86, perturbationSensitivity: 0.16, baselinePrediction: 2.0 },
      explanationConsistency: { value: 0.89, featureImportanceCorrelation: 0.87 }
    },
    PG: {
      epistemicUncertainty: { value: 0.92, predictionVariance: 0.07, meanPrediction: 1.5 },
      aleatoricUncertainty: { value: 0.85, confidenceInterval: 1.2, maxExpectedVariance: 2.0 },
      overfittingRisk: { value: 0.95, trainLoss: 0.03, testLoss: 0.04 },
      robustness: { value: 0.93, perturbationSensitivity: 0.08, baselinePrediction: 1.5 },
      explanationConsistency: { value: 0.96, featureImportanceCorrelation: 0.94 }
    },
    KO: {
      epistemicUncertainty: { value: 0.93, predictionVariance: 0.06, meanPrediction: 1.4 },
      aleatoricUncertainty: { value: 0.86, confidenceInterval: 1.1, maxExpectedVariance: 1.8 },
      overfittingRisk: { value: 0.96, trainLoss: 0.02, testLoss: 0.03 },
      robustness: { value: 0.94, perturbationSensitivity: 0.07, baselinePrediction: 1.4 },
      explanationConsistency: { value: 0.97, featureImportanceCorrelation: 0.95 }
    },
    
    // German Stocks - Medium model certainty (mixed quality)
    "SAP.DE": {
      epistemicUncertainty: { value: 0.78, predictionVariance: 0.22, meanPrediction: 2.4 },
      aleatoricUncertainty: { value: 0.72, confidenceInterval: 2.8, maxExpectedVariance: 4.2 },
      overfittingRisk: { value: 0.82, trainLoss: 0.08, testLoss: 0.11 },
      robustness: { value: 0.80, perturbationSensitivity: 0.25, baselinePrediction: 2.4 },
      explanationConsistency: { value: 0.84, featureImportanceCorrelation: 0.81 }
    },
    "BMW.DE": {
      epistemicUncertainty: { value: 0.70, predictionVariance: 0.28, meanPrediction: 2.9 },
      aleatoricUncertainty: { value: 0.65, confidenceInterval: 3.4, maxExpectedVariance: 5.1 },
      overfittingRisk: { value: 0.75, trainLoss: 0.11, testLoss: 0.16 },
      robustness: { value: 0.72, perturbationSensitivity: 0.35, baselinePrediction: 2.9 },
      explanationConsistency: { value: 0.76, featureImportanceCorrelation: 0.73 }
    },
    "SIE.DE": {
      epistemicUncertainty: { value: 0.82, predictionVariance: 0.18, meanPrediction: 2.1 },
      aleatoricUncertainty: { value: 0.76, confidenceInterval: 2.4, maxExpectedVariance: 3.6 },
      overfittingRisk: { value: 0.86, trainLoss: 0.07, testLoss: 0.09 },
      robustness: { value: 0.84, perturbationSensitivity: 0.20, baselinePrediction: 2.1 },
      explanationConsistency: { value: 0.87, featureImportanceCorrelation: 0.84 }
    },
    "ALV.DE": {
      epistemicUncertainty: { value: 0.85, predictionVariance: 0.15, meanPrediction: 1.8 },
      aleatoricUncertainty: { value: 0.79, confidenceInterval: 2.1, maxExpectedVariance: 3.2 },
      overfittingRisk: { value: 0.89, trainLoss: 0.05, testLoss: 0.07 },
      robustness: { value: 0.87, perturbationSensitivity: 0.17, baselinePrediction: 1.8 },
      explanationConsistency: { value: 0.90, featureImportanceCorrelation: 0.87 }
    },
    "BAS.DE": {
      epistemicUncertainty: { value: 0.75, predictionVariance: 0.25, meanPrediction: 2.6 },
      aleatoricUncertainty: { value: 0.68, confidenceInterval: 3.2, maxExpectedVariance: 4.8 },
      overfittingRisk: { value: 0.78, trainLoss: 0.10, testLoss: 0.14 },
      robustness: { value: 0.76, perturbationSensitivity: 0.30, baselinePrediction: 2.6 },
      explanationConsistency: { value: 0.80, featureImportanceCorrelation: 0.77 }
    },
    
    // International Stocks - Variable model certainty
    "ASML.AS": {
      epistemicUncertainty: { value: 0.79, predictionVariance: 0.21, meanPrediction: 2.5 },
      aleatoricUncertainty: { value: 0.73, confidenceInterval: 2.9, maxExpectedVariance: 4.4 },
      overfittingRisk: { value: 0.83, trainLoss: 0.08, testLoss: 0.11 },
      robustness: { value: 0.81, perturbationSensitivity: 0.24, baselinePrediction: 2.5 },
      explanationConsistency: { value: 0.85, featureImportanceCorrelation: 0.82 }
    },
    "NESN.SW": {
      epistemicUncertainty: { value: 0.86, predictionVariance: 0.14, meanPrediction: 1.9 },
      aleatoricUncertainty: { value: 0.80, confidenceInterval: 1.9, maxExpectedVariance: 3.0 },
      overfittingRisk: { value: 0.89, trainLoss: 0.05, testLoss: 0.07 },
      robustness: { value: 0.87, perturbationSensitivity: 0.16, baselinePrediction: 1.9 },
      explanationConsistency: { value: 0.91, featureImportanceCorrelation: 0.88 }
    }
  }
  return params[stock] || params.AAPL
}

// Fundamentaldaten parameters with calculated values
interface FundamentalDataParams {
  completeness: { value: number; missingValues: number; totalValues: number };
  timeliness: { value: number; delayDays: number; maxTolerance: number };
  consistency: { value: number; avgDeviation: number; referenceValue: number };
  accuracy: { value: number; deviation: number; officialValue: number };
  stability: { value: number; revisions: number; totalDataPoints: number };
}

export const getFundamentalDataParams = (stock: string): FundamentalDataParams => {
  const params: Record<string, FundamentalDataParams> = {
    // AAPL: Score should be 92% => (C + T + K + A + S) / 5 = 0.92
    AAPL: {
      completeness: { value: 0.95, missingValues: 5, totalValues: 100 },        // C = 1 - (5/100) = 0.95
      timeliness: { value: 0.90, delayDays: 3, maxTolerance: 30 },             // T = max(0, 1 - (3/30)) = 0.90  
      consistency: { value: 0.92, avgDeviation: 0.097, referenceValue: 1.21 },  // K = 1 - (0.097/1.21) = 0.92
      accuracy: { value: 0.92, deviation: 0.096, officialValue: 1.20 },        // A = 1 - (0.096/1.20) = 0.92
      stability: { value: 0.91, revisions: 9, totalDataPoints: 100 }           // S = 1 - (9/100) = 0.91
    },
    // MSFT: Score should be 96% => (C + T + K + A + S) / 5 = 0.96  
    MSFT: {
      completeness: { value: 0.98, missingValues: 2, totalValues: 100 },        // C = 1 - (2/100) = 0.98
      timeliness: { value: 0.95, delayDays: 1.5, maxTolerance: 30 },           // T = max(0, 1 - (1.5/30)) = 0.95
      consistency: { value: 0.96, avgDeviation: 0.098, referenceValue: 2.45 }, // K = 1 - (0.098/2.45) = 0.96
      accuracy: { value: 0.97, deviation: 0.072, officialValue: 2.40 },        // A = 1 - (0.072/2.40) = 0.97
      stability: { value: 0.94, revisions: 6, totalDataPoints: 100 }           // S = 1 - (6/100) = 0.94
    },
    // TSLA: Score should be 75% => (C + T + K + A + S) / 5 = 0.75
    TSLA: {
      completeness: { value: 0.85, missingValues: 15, totalValues: 100 },       // C = 1 - (15/100) = 0.85
      timeliness: { value: 0.70, delayDays: 9, maxTolerance: 30 },             // T = max(0, 1 - (9/30)) = 0.70
      consistency: { value: 0.68, avgDeviation: 0.592, referenceValue: 1.85 }, // K = 1 - (0.592/1.85) = 0.68
      accuracy: { value: 0.72, deviation: 0.509, officialValue: 1.82 },        // A = 1 - (0.509/1.82) = 0.72
      stability: { value: 0.75, revisions: 25, totalDataPoints: 100 }          // S = 1 - (25/100) = 0.75
    },

    // Additional US Tech Giants
    GOOGL: {
      completeness: { value: 0.96, missingValues: 4, totalValues: 100 },
      timeliness: { value: 0.92, delayDays: 2.4, maxTolerance: 30 },
      consistency: { value: 0.94, avgDeviation: 0.078, referenceValue: 1.30 },
      accuracy: { value: 0.93, deviation: 0.091, officialValue: 1.30 },
      stability: { value: 0.93, revisions: 7, totalDataPoints: 100 }
    },
    AMZN: {
      completeness: { value: 0.60, missingValues: 40, totalValues: 100 },         // Low completeness
      timeliness: { value: 0.55, delayDays: 13.5, maxTolerance: 30 },            // High delays
      consistency: { value: 0.58, avgDeviation: 0.651, referenceValue: 1.55 },    // High inconsistency
      accuracy: { value: 0.62, deviation: 0.589, officialValue: 1.55 },          // Low accuracy
      stability: { value: 0.52, revisions: 48, totalDataPoints: 100 }            // Many revisions
    },
    META: {
      completeness: { value: 0.78, missingValues: 22, totalValues: 100 },         // Medium completeness
      timeliness: { value: 0.75, delayDays: 7.5, maxTolerance: 30 },             // Medium delays
      consistency: { value: 0.73, avgDeviation: 0.648, referenceValue: 2.40 },    // Medium inconsistency
      accuracy: { value: 0.76, deviation: 0.576, officialValue: 2.40 },          // Medium accuracy
      stability: { value: 0.72, revisions: 28, totalDataPoints: 100 }            // Medium revisions
    },
    NVDA: {
      completeness: { value: 0.68, missingValues: 32, totalValues: 100 },        // Lower completeness
      timeliness: { value: 0.62, delayDays: 11.4, maxTolerance: 30 },            // Higher delays
      consistency: { value: 0.65, avgDeviation: 0.840, referenceValue: 2.40 },    // More inconsistency
      accuracy: { value: 0.63, deviation: 0.888, officialValue: 2.40 },          // Lower accuracy
      stability: { value: 0.58, revisions: 42, totalDataPoints: 100 }            // Many revisions
    },

    // Traditional US Finance/Healthcare - Very reliable
    "BRK.B": {
      completeness: { value: 0.99, missingValues: 1, totalValues: 100 },
      timeliness: { value: 0.97, delayDays: 0.9, maxTolerance: 30 },
      consistency: { value: 0.98, avgDeviation: 0.048, referenceValue: 2.40 },
      accuracy: { value: 0.98, deviation: 0.048, officialValue: 2.40 },
      stability: { value: 0.98, revisions: 2, totalDataPoints: 100 }
    },
    JPM: {
      completeness: { value: 0.98, missingValues: 2, totalValues: 100 },
      timeliness: { value: 0.96, delayDays: 1.2, maxTolerance: 30 },
      consistency: { value: 0.97, avgDeviation: 0.060, referenceValue: 2.00 },
      accuracy: { value: 0.97, deviation: 0.060, officialValue: 2.00 },
      stability: { value: 0.97, revisions: 3, totalDataPoints: 100 }
    },
    JNJ: {
      completeness: { value: 0.97, missingValues: 3, totalValues: 100 },
      timeliness: { value: 0.95, delayDays: 1.5, maxTolerance: 30 },
      consistency: { value: 0.96, avgDeviation: 0.064, referenceValue: 1.60 },
      accuracy: { value: 0.96, deviation: 0.064, officialValue: 1.60 },
      stability: { value: 0.96, revisions: 4, totalDataPoints: 100 }
    },

    // German Stocks - Good quality, slight delays
    "SAP.DE": {
      completeness: { value: 0.78, missingValues: 22, totalValues: 100 },               // More missing data
      timeliness: { value: 0.70, delayDays: 9, maxTolerance: 30 },                     // Higher delays
      consistency: { value: 0.75, avgDeviation: 0.400, referenceValue: 1.60 },         // More inconsistency
      accuracy: { value: 0.72, deviation: 0.448, officialValue: 1.60 },                // Lower accuracy
      stability: { value: 0.68, revisions: 32, totalDataPoints: 100 }                  // More revisions
    },
    "BMW.DE": {
      completeness: { value: 0.65, missingValues: 35, totalValues: 100 },               // High missing data
      timeliness: { value: 0.58, delayDays: 12.6, maxTolerance: 30 },                  // Very high delays
      consistency: { value: 0.62, avgDeviation: 0.494, referenceValue: 1.30 },         // High inconsistency
      accuracy: { value: 0.60, deviation: 0.520, officialValue: 1.30 },                // Low accuracy
      stability: { value: 0.55, revisions: 45, totalDataPoints: 100 }                  // Many revisions
    },
    "SIE.DE": {
      completeness: { value: 0.93, missingValues: 7, totalValues: 100 },
      timeliness: { value: 0.85, delayDays: 4.5, maxTolerance: 30 },
      consistency: { value: 0.90, avgDeviation: 0.180, referenceValue: 1.80 },
      accuracy: { value: 0.89, deviation: 0.198, officialValue: 1.80 },
      stability: { value: 0.88, revisions: 12, totalDataPoints: 100 }
    },
    "ALV.DE": {
      completeness: { value: 0.95, missingValues: 5, totalValues: 100 },
      timeliness: { value: 0.90, delayDays: 3, maxTolerance: 30 },
      consistency: { value: 0.92, avgDeviation: 0.144, referenceValue: 1.80 },
      accuracy: { value: 0.91, deviation: 0.162, officialValue: 1.80 },
      stability: { value: 0.92, revisions: 8, totalDataPoints: 100 }
    },
    "BAS.DE": {
      completeness: { value: 0.89, missingValues: 11, totalValues: 100 },
      timeliness: { value: 0.80, delayDays: 6, maxTolerance: 30 },
      consistency: { value: 0.85, avgDeviation: 0.195, referenceValue: 1.30 },
      accuracy: { value: 0.84, deviation: 0.208, officialValue: 1.30 },
      stability: { value: 0.82, revisions: 18, totalDataPoints: 100 }
    },

    // More US stocks
    V: {
      completeness: { value: 0.97, missingValues: 3, totalValues: 100 },
      timeliness: { value: 0.94, delayDays: 1.8, maxTolerance: 30 },
      consistency: { value: 0.95, avgDeviation: 0.090, referenceValue: 1.80 },
      accuracy: { value: 0.94, deviation: 0.108, officialValue: 1.80 },
      stability: { value: 0.95, revisions: 5, totalDataPoints: 100 }
    },
    MA: {
      completeness: { value: 0.96, missingValues: 4, totalValues: 100 },
      timeliness: { value: 0.93, delayDays: 2.1, maxTolerance: 30 },
      consistency: { value: 0.94, avgDeviation: 0.108, referenceValue: 1.80 },
      accuracy: { value: 0.93, deviation: 0.126, officialValue: 1.80 },
      stability: { value: 0.94, revisions: 6, totalDataPoints: 100 }
    },
    UNH: {
      completeness: { value: 0.95, missingValues: 5, totalValues: 100 },
      timeliness: { value: 0.92, delayDays: 2.4, maxTolerance: 30 },
      consistency: { value: 0.93, avgDeviation: 0.119, referenceValue: 1.70 },
      accuracy: { value: 0.92, deviation: 0.136, officialValue: 1.70 },
      stability: { value: 0.93, revisions: 7, totalDataPoints: 100 }
    },
    HD: {
      completeness: { value: 0.92, missingValues: 8, totalValues: 100 },
      timeliness: { value: 0.89, delayDays: 3.3, maxTolerance: 30 },
      consistency: { value: 0.91, avgDeviation: 0.144, referenceValue: 1.60 },
      accuracy: { value: 0.90, deviation: 0.160, officialValue: 1.60 },
      stability: { value: 0.88, revisions: 12, totalDataPoints: 100 }
    },
    PG: {
      completeness: { value: 0.96, missingValues: 4, totalValues: 100 },
      timeliness: { value: 0.93, delayDays: 2.1, maxTolerance: 30 },
      consistency: { value: 0.94, avgDeviation: 0.084, referenceValue: 1.40 },
      accuracy: { value: 0.93, deviation: 0.098, officialValue: 1.40 },
      stability: { value: 0.94, revisions: 6, totalDataPoints: 100 }
    },
    KO: {
      completeness: { value: 0.95, missingValues: 5, totalValues: 100 },
      timeliness: { value: 0.91, delayDays: 2.7, maxTolerance: 30 },
      consistency: { value: 0.93, avgDeviation: 0.098, referenceValue: 1.40 },
      accuracy: { value: 0.92, deviation: 0.112, officialValue: 1.40 },
      stability: { value: 0.94, revisions: 6, totalDataPoints: 100 }
    },

    // International stocks
    "ASML.AS": {
      completeness: { value: 0.93, missingValues: 7, totalValues: 100 },
      timeliness: { value: 0.86, delayDays: 4.2, maxTolerance: 30 },
      consistency: { value: 0.90, avgDeviation: 0.200, referenceValue: 2.00 },
      accuracy: { value: 0.89, deviation: 0.220, officialValue: 2.00 },
      stability: { value: 0.87, revisions: 13, totalDataPoints: 100 }
    },
    "NESN.SW": {
      completeness: { value: 0.94, missingValues: 6, totalValues: 100 },
      timeliness: { value: 0.88, delayDays: 3.6, maxTolerance: 30 },
      consistency: { value: 0.92, avgDeviation: 0.128, referenceValue: 1.60 },
      accuracy: { value: 0.91, deviation: 0.144, officialValue: 1.60 },
      stability: { value: 0.90, revisions: 10, totalDataPoints: 100 }
    }
  }
  return params[stock] || params.AAPL
}

// News Reliability Parameters Interface  
interface NewsReliabilityParams {
  sourceReliability: { value: number; totalSources: number; averageReliability: number };
  reputationAccuracy: { value: number; totalNews: number; falseNews: number };
  crossSourceConsensus: { value: number; totalNews: number; confirmedNews: number };
  biasCheck: { value: number; biasIndex: number; maxBiasValue: number };
}

// Time Series Integrity Parameters Interface
interface TimeSeriesIntegrityParams {
  completeness: { value: number; missingTimepoints: number; expectedTimepoints: number };
  outlierFreedom: { value: number; outliers: number; totalObservations: number };
  revisionStability: { value: number; revisedValues: number; totalValues: number };
  continuity: { value: number; gaps: number; totalIntervals: number };
}

export const getNewsReliabilityParams = (stock: string): NewsReliabilityParams => {
  const params: Record<string, NewsReliabilityParams> = {
    // AAPL: Score should be 88% => (R + P + K + (1-B)) * weights = 0.88
    // Weights: w1=0.3, w2=0.3, w3=0.25, w4=0.15
    AAPL: {
      sourceReliability: { value: 0.89, totalSources: 15, averageReliability: 0.89 },        // R = 0.89 (Reuters=0.98, Bloomberg=0.95, CNN=0.75, etc.)
      reputationAccuracy: { value: 0.90, totalNews: 100, falseNews: 10 },                   // P = 1 - (10/100) = 0.90
      crossSourceConsensus: { value: 0.85, totalNews: 10, confirmedNews: 8 },               // K = 8/10 = 0.85 (8 von 10 News bestätigt)
      biasCheck: { value: 0.85, biasIndex: 0.15, maxBiasValue: 1.0 }                       // B = 0.15/1.0 = 0.15, so (1-B) = 0.85
    },
    // MSFT: Score should be 91% => (R + P + K + (1-B)) * weights = 0.91
    MSFT: {
      sourceReliability: { value: 0.93, totalSources: 12, averageReliability: 0.93 },       // R = 0.93 (mehr premium sources)
      reputationAccuracy: { value: 0.92, totalNews: 100, falseNews: 8 },                    // P = 1 - (8/100) = 0.92
      crossSourceConsensus: { value: 0.90, totalNews: 10, confirmedNews: 9 },               // K = 9/10 = 0.90
      biasCheck: { value: 0.88, biasIndex: 0.12, maxBiasValue: 1.0 }                       // B = 0.12, so (1-B) = 0.88
    },
    // TSLA: Score should be 68% => (R + P + K + (1-B)) * weights = 0.68
    TSLA: {
      sourceReliability: { value: 0.70, totalSources: 8, averageReliability: 0.70 },        // R = 0.70 (mehr unreliable sources, Twitter hype)
      reputationAccuracy: { value: 0.75, totalNews: 100, falseNews: 25 },                   // P = 1 - (25/100) = 0.75
      crossSourceConsensus: { value: 0.60, totalNews: 10, confirmedNews: 6 },               // K = 6/10 = 0.60 (viel speculation)
      biasCheck: { value: 0.65, biasIndex: 0.35, maxBiasValue: 1.0 }                       // B = 0.35 (high bias), so (1-B) = 0.65
    },

    // Additional US Tech Giants
    GOOGL: {
      sourceReliability: { value: 0.91, totalSources: 14, averageReliability: 0.91 },
      reputationAccuracy: { value: 0.89, totalNews: 100, falseNews: 11 },
      crossSourceConsensus: { value: 0.87, totalNews: 10, confirmedNews: 8.7 },
      biasCheck: { value: 0.86, biasIndex: 0.14, maxBiasValue: 1.0 }
    },
    AMZN: {
      sourceReliability: { value: 0.62, totalSources: 13, averageReliability: 0.62 },    // Low reliability
      reputationAccuracy: { value: 0.55, totalNews: 100, falseNews: 45 },               // Many false news
      crossSourceConsensus: { value: 0.52, totalNews: 10, confirmedNews: 5.2 },         // Low consensus
      biasCheck: { value: 0.58, biasIndex: 0.42, maxBiasValue: 1.0 }                   // High bias
    },
    META: {
      sourceReliability: { value: 0.72, totalSources: 11, averageReliability: 0.72 },    // Medium reliability
      reputationAccuracy: { value: 0.68, totalNews: 100, falseNews: 32 },               // More false news
      crossSourceConsensus: { value: 0.65, totalNews: 10, confirmedNews: 6.5 },         // Medium consensus
      biasCheck: { value: 0.70, biasIndex: 0.30, maxBiasValue: 1.0 }                   // Medium bias
    },
    NVDA: {
      sourceReliability: { value: 0.65, totalSources: 10, averageReliability: 0.65 },    // Lower reliability
      reputationAccuracy: { value: 0.58, totalNews: 100, falseNews: 42 },               // More false news
      crossSourceConsensus: { value: 0.55, totalNews: 10, confirmedNews: 5.5 },         // Less consensus
      biasCheck: { value: 0.60, biasIndex: 0.40, maxBiasValue: 1.0 }                   // More bias
    },

    // Traditional US Finance/Healthcare - Very reliable sources
    "BRK.B": {
      sourceReliability: { value: 0.96, totalSources: 18, averageReliability: 0.96 },
      reputationAccuracy: { value: 0.95, totalNews: 100, falseNews: 5 },
      crossSourceConsensus: { value: 0.93, totalNews: 10, confirmedNews: 9.3 },
      biasCheck: { value: 0.94, biasIndex: 0.06, maxBiasValue: 1.0 }
    },
    JPM: {
      sourceReliability: { value: 0.94, totalSources: 16, averageReliability: 0.94 },
      reputationAccuracy: { value: 0.93, totalNews: 100, falseNews: 7 },
      crossSourceConsensus: { value: 0.91, totalNews: 10, confirmedNews: 9.1 },
      biasCheck: { value: 0.92, biasIndex: 0.08, maxBiasValue: 1.0 }
    },
    JNJ: {
      sourceReliability: { value: 0.93, totalSources: 15, averageReliability: 0.93 },
      reputationAccuracy: { value: 0.91, totalNews: 100, falseNews: 9 },
      crossSourceConsensus: { value: 0.89, totalNews: 10, confirmedNews: 8.9 },
      biasCheck: { value: 0.90, biasIndex: 0.10, maxBiasValue: 1.0 }
    },

    // German Stocks - More problematic for demo variety
    "SAP.DE": {
      sourceReliability: { value: 0.75, totalSources: 8, averageReliability: 0.75 },      // Reduced reliability
      reputationAccuracy: { value: 0.68, totalNews: 100, falseNews: 32 },                 // More false news
      crossSourceConsensus: { value: 0.65, totalNews: 10, confirmedNews: 6.5 },           // Lower consensus
      biasCheck: { value: 0.72, biasIndex: 0.28, maxBiasValue: 1.0 }                      // Higher bias
    },
    "BMW.DE": {
      sourceReliability: { value: 0.62, totalSources: 7, averageReliability: 0.62 },      // Much lower reliability
      reputationAccuracy: { value: 0.58, totalNews: 100, falseNews: 42 },                 // High false news rate
      crossSourceConsensus: { value: 0.55, totalNews: 10, confirmedNews: 5.5 },           // Low consensus
      biasCheck: { value: 0.60, biasIndex: 0.40, maxBiasValue: 1.0 }                      // High bias (speculation)
    },
    "SIE.DE": {
      sourceReliability: { value: 0.85, totalSources: 11, averageReliability: 0.85 },
      reputationAccuracy: { value: 0.82, totalNews: 100, falseNews: 18 },
      crossSourceConsensus: { value: 0.78, totalNews: 10, confirmedNews: 7.8 },
      biasCheck: { value: 0.80, biasIndex: 0.20, maxBiasValue: 1.0 }
    },
    "ALV.DE": {
      sourceReliability: { value: 0.88, totalSources: 13, averageReliability: 0.88 },
      reputationAccuracy: { value: 0.86, totalNews: 100, falseNews: 14 },
      crossSourceConsensus: { value: 0.83, totalNews: 10, confirmedNews: 8.3 },
      biasCheck: { value: 0.84, biasIndex: 0.16, maxBiasValue: 1.0 }
    },
    "BAS.DE": {
      sourceReliability: { value: 0.79, totalSources: 9, averageReliability: 0.79 },
      reputationAccuracy: { value: 0.75, totalNews: 100, falseNews: 25 },
      crossSourceConsensus: { value: 0.71, totalNews: 10, confirmedNews: 7.1 },
      biasCheck: { value: 0.74, biasIndex: 0.26, maxBiasValue: 1.0 }
    },

    // More US stocks
    V: {
      sourceReliability: { value: 0.92, totalSources: 15, averageReliability: 0.92 },
      reputationAccuracy: { value: 0.90, totalNews: 100, falseNews: 10 },
      crossSourceConsensus: { value: 0.88, totalNews: 10, confirmedNews: 8.8 },
      biasCheck: { value: 0.89, biasIndex: 0.11, maxBiasValue: 1.0 }
    },
    MA: {
      sourceReliability: { value: 0.91, totalSources: 14, averageReliability: 0.91 },
      reputationAccuracy: { value: 0.88, totalNews: 100, falseNews: 12 },
      crossSourceConsensus: { value: 0.86, totalNews: 10, confirmedNews: 8.6 },
      biasCheck: { value: 0.87, biasIndex: 0.13, maxBiasValue: 1.0 }
    },
    UNH: {
      sourceReliability: { value: 0.89, totalSources: 13, averageReliability: 0.89 },
      reputationAccuracy: { value: 0.86, totalNews: 100, falseNews: 14 },
      crossSourceConsensus: { value: 0.84, totalNews: 10, confirmedNews: 8.4 },
      biasCheck: { value: 0.85, biasIndex: 0.15, maxBiasValue: 1.0 }
    },
    HD: {
      sourceReliability: { value: 0.87, totalSources: 12, averageReliability: 0.87 },
      reputationAccuracy: { value: 0.84, totalNews: 100, falseNews: 16 },
      crossSourceConsensus: { value: 0.81, totalNews: 10, confirmedNews: 8.1 },
      biasCheck: { value: 0.83, biasIndex: 0.17, maxBiasValue: 1.0 }
    },
    PG: {
      sourceReliability: { value: 0.90, totalSources: 14, averageReliability: 0.90 },
      reputationAccuracy: { value: 0.88, totalNews: 100, falseNews: 12 },
      crossSourceConsensus: { value: 0.85, totalNews: 10, confirmedNews: 8.5 },
      biasCheck: { value: 0.87, biasIndex: 0.13, maxBiasValue: 1.0 }
    },
    KO: {
      sourceReliability: { value: 0.89, totalSources: 13, averageReliability: 0.89 },
      reputationAccuracy: { value: 0.87, totalNews: 100, falseNews: 13 },
      crossSourceConsensus: { value: 0.84, totalNews: 10, confirmedNews: 8.4 },
      biasCheck: { value: 0.86, biasIndex: 0.14, maxBiasValue: 1.0 }
    },

    // International stocks - Mixed source quality
    "ASML.AS": {
      sourceReliability: { value: 0.83, totalSources: 10, averageReliability: 0.83 },
      reputationAccuracy: { value: 0.80, totalNews: 100, falseNews: 20 },
      crossSourceConsensus: { value: 0.76, totalNews: 10, confirmedNews: 7.6 },
      biasCheck: { value: 0.79, biasIndex: 0.21, maxBiasValue: 1.0 }
    },
    "NESN.SW": {
      sourceReliability: { value: 0.85, totalSources: 11, averageReliability: 0.85 },
      reputationAccuracy: { value: 0.83, totalNews: 100, falseNews: 17 },
      crossSourceConsensus: { value: 0.79, totalNews: 10, confirmedNews: 7.9 },
      biasCheck: { value: 0.81, biasIndex: 0.19, maxBiasValue: 1.0 }
    }
  }
  return params[stock] || params.AAPL
}

export const getTimeSeriesIntegrityParams = (stock: string): TimeSeriesIntegrityParams => {
  const params: Record<string, TimeSeriesIntegrityParams> = {
    // AAPL: Score should be 95% => (C + O + R + K) / 4 = 0.95
    AAPL: {
      completeness: { value: 0.96, missingTimepoints: 10, expectedTimepoints: 250 },   // C = 1 - (10/250) = 0.96
      outlierFreedom: { value: 0.952, outliers: 12, totalObservations: 250 },         // O = 1 - (12/250) = 0.952
      revisionStability: { value: 0.944, revisedValues: 14, totalValues: 250 },       // R = 1 - (14/250) = 0.944
      continuity: { value: 0.944, gaps: 14, totalIntervals: 250 }                     // K = 1 - (14/250) = 0.944
    },
    // MSFT: Score should be 89% => (C + O + R + K) / 4 = 0.89  
    MSFT: {
      completeness: { value: 0.96, missingTimepoints: 10, expectedTimepoints: 250 },   // C = 1 - (10/250) = 0.96
      outlierFreedom: { value: 0.92, outliers: 20, totalObservations: 250 },          // O = 1 - (20/250) = 0.92
      revisionStability: { value: 0.896, revisedValues: 26, totalValues: 250 },       // R = 1 - (26/250) = 0.896
      continuity: { value: 0.784, gaps: 54, totalIntervals: 250 }                     // K = 1 - (54/250) = 0.784
    },
    // TSLA: Score should be 82% => (C + O + R + K) / 4 = 0.82
    TSLA: {
      completeness: { value: 0.88, missingTimepoints: 30, expectedTimepoints: 250 },   // C = 1 - (30/250) = 0.88
      outlierFreedom: { value: 0.84, outliers: 40, totalObservations: 250 },          // O = 1 - (40/250) = 0.84
      revisionStability: { value: 0.78, revisedValues: 55, totalValues: 250 },        // R = 1 - (55/250) = 0.78
      continuity: { value: 0.78, gaps: 55, totalIntervals: 250 }                      // K = 1 - (55/250) = 0.78
    },

    // Additional US Tech Giants
    GOOGL: {
      completeness: { value: 0.94, missingTimepoints: 15, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.92, outliers: 20, totalObservations: 250 },
      revisionStability: { value: 0.90, revisedValues: 25, totalValues: 250 },
      continuity: { value: 0.88, gaps: 30, totalIntervals: 250 }
    },
    AMZN: {
      completeness: { value: 0.58, missingTimepoints: 105, expectedTimepoints: 250 },    // High missing data
      outlierFreedom: { value: 0.52, outliers: 120, totalObservations: 250 },          // Many outliers
      revisionStability: { value: 0.50, revisedValues: 125, totalValues: 250 },        // Many revisions
      continuity: { value: 0.48, gaps: 130, totalIntervals: 250 }                      // Many gaps
    },
    META: {
      completeness: { value: 0.75, missingTimepoints: 63, expectedTimepoints: 250 },     // Medium missing data
      outlierFreedom: { value: 0.70, outliers: 75, totalObservations: 250 },           // Medium outliers
      revisionStability: { value: 0.68, revisedValues: 80, totalValues: 250 },         // Medium revisions
      continuity: { value: 0.72, gaps: 70, totalIntervals: 250 }                       // Medium gaps
    },
    NVDA: {
      completeness: { value: 0.62, missingTimepoints: 95, expectedTimepoints: 250 },     // More missing data
      outlierFreedom: { value: 0.58, outliers: 105, totalObservations: 250 },           // More outliers
      revisionStability: { value: 0.55, revisedValues: 113, totalValues: 250 },         // More revisions
      continuity: { value: 0.52, gaps: 120, totalIntervals: 250 }                       // More gaps
    },

    // Traditional US Finance/Healthcare - Very stable
    "BRK.B": {
      completeness: { value: 0.99, missingTimepoints: 3, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.98, outliers: 5, totalObservations: 250 },
      revisionStability: { value: 0.99, revisedValues: 3, totalValues: 250 },
      continuity: { value: 0.98, gaps: 5, totalIntervals: 250 }
    },
    JPM: {
      completeness: { value: 0.97, missingTimepoints: 8, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.95, outliers: 13, totalObservations: 250 },
      revisionStability: { value: 0.96, revisedValues: 10, totalValues: 250 },
      continuity: { value: 0.94, gaps: 15, totalIntervals: 250 }
    },
    JNJ: {
      completeness: { value: 0.96, missingTimepoints: 10, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.94, outliers: 15, totalObservations: 250 },
      revisionStability: { value: 0.95, revisedValues: 13, totalValues: 250 },
      continuity: { value: 0.93, gaps: 18, totalIntervals: 250 }
    },

    // German Stocks - Moderate stability
    "SAP.DE": {
      completeness: { value: 0.91, missingTimepoints: 23, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.87, outliers: 33, totalObservations: 250 },
      revisionStability: { value: 0.85, revisedValues: 38, totalValues: 250 },
      continuity: { value: 0.83, gaps: 43, totalIntervals: 250 }
    },
    "BMW.DE": {
      completeness: { value: 0.88, missingTimepoints: 30, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.84, outliers: 40, totalObservations: 250 },
      revisionStability: { value: 0.81, revisedValues: 48, totalValues: 250 },
      continuity: { value: 0.79, gaps: 53, totalIntervals: 250 }
    },
    "SIE.DE": {
      completeness: { value: 0.90, missingTimepoints: 25, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.86, outliers: 35, totalObservations: 250 },
      revisionStability: { value: 0.84, revisedValues: 40, totalValues: 250 },
      continuity: { value: 0.82, gaps: 45, totalIntervals: 250 }
    },
    "ALV.DE": {
      completeness: { value: 0.93, missingTimepoints: 18, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.89, outliers: 28, totalObservations: 250 },
      revisionStability: { value: 0.87, revisedValues: 33, totalValues: 250 },
      continuity: { value: 0.85, gaps: 38, totalIntervals: 250 }
    },
    "BAS.DE": {
      completeness: { value: 0.85, missingTimepoints: 38, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.80, outliers: 50, totalObservations: 250 },
      revisionStability: { value: 0.77, revisedValues: 58, totalValues: 250 },
      continuity: { value: 0.74, gaps: 65, totalIntervals: 250 }
    },

    // More US stocks
    V: {
      completeness: { value: 0.95, missingTimepoints: 13, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.93, outliers: 18, totalObservations: 250 },
      revisionStability: { value: 0.94, revisedValues: 15, totalValues: 250 },
      continuity: { value: 0.92, gaps: 20, totalIntervals: 250 }
    },
    MA: {
      completeness: { value: 0.94, missingTimepoints: 15, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.91, outliers: 23, totalObservations: 250 },
      revisionStability: { value: 0.92, revisedValues: 20, totalValues: 250 },
      continuity: { value: 0.90, gaps: 25, totalIntervals: 250 }
    },
    UNH: {
      completeness: { value: 0.93, missingTimepoints: 18, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.90, outliers: 25, totalObservations: 250 },
      revisionStability: { value: 0.91, revisedValues: 23, totalValues: 250 },
      continuity: { value: 0.89, gaps: 28, totalIntervals: 250 }
    },
    HD: {
      completeness: { value: 0.91, missingTimepoints: 23, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.88, outliers: 30, totalObservations: 250 },
      revisionStability: { value: 0.89, revisedValues: 28, totalValues: 250 },
      continuity: { value: 0.86, gaps: 35, totalIntervals: 250 }
    },
    PG: {
      completeness: { value: 0.94, missingTimepoints: 15, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.92, outliers: 20, totalObservations: 250 },
      revisionStability: { value: 0.93, revisedValues: 18, totalValues: 250 },
      continuity: { value: 0.91, gaps: 23, totalIntervals: 250 }
    },
    KO: {
      completeness: { value: 0.93, missingTimepoints: 18, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.91, outliers: 23, totalObservations: 250 },
      revisionStability: { value: 0.92, revisedValues: 20, totalValues: 250 },
      continuity: { value: 0.90, gaps: 25, totalIntervals: 250 }
    },

    // International stocks
    "ASML.AS": {
      completeness: { value: 0.89, missingTimepoints: 28, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.85, outliers: 38, totalObservations: 250 },
      revisionStability: { value: 0.82, revisedValues: 45, totalValues: 250 },
      continuity: { value: 0.80, gaps: 50, totalIntervals: 250 }
    },
    "NESN.SW": {
      completeness: { value: 0.92, missingTimepoints: 20, expectedTimepoints: 250 },
      outlierFreedom: { value: 0.88, outliers: 30, totalObservations: 250 },
      revisionStability: { value: 0.86, revisedValues: 35, totalValues: 250 },
      continuity: { value: 0.84, gaps: 40, totalIntervals: 250 }
    }
  }
  return params[stock] || params.AAPL
}

// Trading Volume Distribution Parameters Interface
interface TradingVolumeParams {
  concentration: { value: number; hhi: number; mainActors: number };
  anomalousSpikes: { value: number; spikes: number; totalDays: number };
  timeStability: { value: number; stdev: number; avgVolume: number };
}

export const getTradingVolumeParams = (stock: string): TradingVolumeParams => {
  const params: Record<string, TradingVolumeParams> = {
    // US Tech Giants - Mixed patterns due to high retail interest
    AAPL: {
      concentration: { value: 0.82, hhi: 0.18, mainActors: 5 },
      anomalousSpikes: { value: 0.91, spikes: 3, totalDays: 30 },
      timeStability: { value: 0.76, stdev: 0.24, avgVolume: 45123456 }
    },
    MSFT: {
      concentration: { value: 0.88, hhi: 0.12, mainActors: 4 },
      anomalousSpikes: { value: 0.95, spikes: 2, totalDays: 30 },
      timeStability: { value: 0.82, stdev: 0.18, avgVolume: 23567890 }
    },
    GOOGL: {
      concentration: { value: 0.85, hhi: 0.15, mainActors: 6 },
      anomalousSpikes: { value: 0.89, spikes: 4, totalDays: 30 },
      timeStability: { value: 0.78, stdev: 0.22, avgVolume: 18456789 }
    },
    AMZN: {
      concentration: { value: 0.52, hhi: 0.48, mainActors: 9 },                         // High concentration risk
      anomalousSpikes: { value: 0.45, spikes: 17, totalDays: 30 },                     // Many anomalies
      timeStability: { value: 0.42, stdev: 0.58, avgVolume: 35789123 }                 // Very unstable
    },
    TSLA: {
      concentration: { value: 0.65, hhi: 0.35, mainActors: 8 },
      anomalousSpikes: { value: 0.71, spikes: 9, totalDays: 30 },
      timeStability: { value: 0.68, stdev: 0.32, avgVolume: 89456123 }
    },
    META: {
      concentration: { value: 0.72, hhi: 0.28, mainActors: 6 },                         // Medium concentration
      anomalousSpikes: { value: 0.75, spikes: 8, totalDays: 30 },                      // Medium anomalies
      timeStability: { value: 0.68, stdev: 0.32, avgVolume: 12345678 }                 // Medium stability
    },
    NVDA: {
      concentration: { value: 0.58, hhi: 0.42, mainActors: 8 },                         // Higher concentration risk
      anomalousSpikes: { value: 0.52, spikes: 14, totalDays: 30 },                     // Many anomalies
      timeStability: { value: 0.48, stdev: 0.52, avgVolume: 45678912 }                 // Very unstable
    },

    // Traditional US Companies - More stable institutional trading
    "BRK.B": {
      concentration: { value: 0.94, hhi: 0.06, mainActors: 3 },
      anomalousSpikes: { value: 0.97, spikes: 1, totalDays: 30 },
      timeStability: { value: 0.91, stdev: 0.09, avgVolume: 2345678 }
    },
    JPM: {
      concentration: { value: 0.91, hhi: 0.09, mainActors: 4 },
      anomalousSpikes: { value: 0.94, spikes: 2, totalDays: 30 },
      timeStability: { value: 0.88, stdev: 0.12, avgVolume: 8901234 }
    },
    JNJ: {
      concentration: { value: 0.93, hhi: 0.07, mainActors: 3 },
      anomalousSpikes: { value: 0.96, spikes: 1, totalDays: 30 },
      timeStability: { value: 0.90, stdev: 0.10, avgVolume: 5678901 }
    },
    V: {
      concentration: { value: 0.89, hhi: 0.11, mainActors: 4 },
      anomalousSpikes: { value: 0.93, spikes: 2, totalDays: 30 },
      timeStability: { value: 0.86, stdev: 0.14, avgVolume: 4567890 }
    },
    MA: {
      concentration: { value: 0.92, hhi: 0.08, mainActors: 3 },
      anomalousSpikes: { value: 0.95, spikes: 1, totalDays: 30 },
      timeStability: { value: 0.89, stdev: 0.11, avgVolume: 2109876 }
    },
    UNH: {
      concentration: { value: 0.90, hhi: 0.10, mainActors: 4 },
      anomalousSpikes: { value: 0.94, spikes: 2, totalDays: 30 },
      timeStability: { value: 0.87, stdev: 0.13, avgVolume: 1987654 }
    },
    HD: {
      concentration: { value: 0.87, hhi: 0.13, mainActors: 5 },
      anomalousSpikes: { value: 0.91, spikes: 3, totalDays: 30 },
      timeStability: { value: 0.84, stdev: 0.16, avgVolume: 3456789 }
    },
    PG: {
      concentration: { value: 0.93, hhi: 0.07, mainActors: 3 },
      anomalousSpikes: { value: 0.96, spikes: 1, totalDays: 30 },
      timeStability: { value: 0.91, stdev: 0.09, avgVolume: 4321098 }
    },
    KO: {
      concentration: { value: 0.95, hhi: 0.05, mainActors: 3 },
      anomalousSpikes: { value: 0.98, spikes: 1, totalDays: 30 },
      timeStability: { value: 0.93, stdev: 0.07, avgVolume: 6789012 }
    },

    // German Stocks - Lower volumes, more concentrated
    "SAP.DE": {
      concentration: { value: 0.86, hhi: 0.14, mainActors: 4 },
      anomalousSpikes: { value: 0.89, spikes: 3, totalDays: 30 },
      timeStability: { value: 0.83, stdev: 0.17, avgVolume: 1234567 }
    },
    "BMW.DE": {
      concentration: { value: 0.81, hhi: 0.19, mainActors: 5 },
      anomalousSpikes: { value: 0.85, spikes: 4, totalDays: 30 },
      timeStability: { value: 0.78, stdev: 0.22, avgVolume: 987654 }
    },
    "SIE.DE": {
      concentration: { value: 0.88, hhi: 0.12, mainActors: 4 },
      anomalousSpikes: { value: 0.92, spikes: 2, totalDays: 30 },
      timeStability: { value: 0.85, stdev: 0.15, avgVolume: 765432 }
    },
    "ALV.DE": {
      concentration: { value: 0.90, hhi: 0.10, mainActors: 3 },
      anomalousSpikes: { value: 0.94, spikes: 2, totalDays: 30 },
      timeStability: { value: 0.87, stdev: 0.13, avgVolume: 543210 }
    },
    "BAS.DE": {
      concentration: { value: 0.84, hhi: 0.16, mainActors: 4 },
      anomalousSpikes: { value: 0.88, spikes: 4, totalDays: 30 },
      timeStability: { value: 0.80, stdev: 0.20, avgVolume: 1876543 }
    },

    // International Stocks - Mixed patterns based on local markets
    "ASML.AS": {
      concentration: { value: 0.85, hhi: 0.15, mainActors: 5 },
      anomalousSpikes: { value: 0.88, spikes: 4, totalDays: 30 },
      timeStability: { value: 0.81, stdev: 0.19, avgVolume: 234567 }
    },
    "NESN.SW": {
      concentration: { value: 0.91, hhi: 0.09, mainActors: 3 },
      anomalousSpikes: { value: 0.95, spikes: 2, totalDays: 30 },
      timeStability: { value: 0.88, stdev: 0.12, avgVolume: 345678 }
    }
  }
  return params[stock] || params.AAPL
}

// Info box content mapping
const getInfoBoxContent = (metric: string) => {
  const infoContent: Record<string, { title: string; content: string }> = {
    fundamentalData: {
      title: "Fundamentaldaten-Qualität – Technische Dimensionen",
      content: "Die Fundamentaldaten-Qualität wird aus 5 kritischen Parametern berechnet, die direkt die Zuverlässigkeit Ihrer Trading-Entscheidungen beeinflussen."
    },
    newsReliability: {
      title: "Nachrichten-Verlässlichkeit Berechnung", 
      content: "Die Nachrichten-Verlässlichkeit evaluiert die Qualität und Glaubwürdigkeit von Marktinformationen durch vier zentrale Dimensionen: Source Reliability (Seriosität der Quelle), Reputation Accuracy (historische Trefferquote), Cross-Source Consensus (Bestätigung durch mehrere Quellen) und Bias Check (Verzerrungsanalyse). Diese Parameter werden gewichtet kombiniert, um die Gesamtverlässlichkeit der verwendeten Nachrichtenquellen zu bewerten."
    },
    timeSeriesIntegrity: {
      title: "Zeitreihen-Integrität Berechnung",
      content: "Die Zeitreihen-Integrität bewertet die Qualität und Vollständigkeit von Kursdaten über die Zeit. Sie berücksichtigt vier Hauptdimensionen: Vollständigkeit (ob alle Zeitpunkte vorhanden sind), Ausreißer-Freiheit (Erkennung von Datenfehlern), Revision-Stabilität (Konsistenz historischer Korrekturen) und Kontinuität (gleichmäßige Zeitverteilung ohne Gaps)."
    },
    tradingVolume: {
      title: "Handelsvolumen-Verteilung Berechnung",
      content: "Die Handelsvolumen-Verteilung bewertet drei kritische Dimensionen: Marktteilnehmer-Konzentration (HHI), Anomalous Spikes und Zeit-Stabilität."
    },
    // Modellunsicherheits-Parameter
    "Epistemische Unsicherheit": {
      title: "Epistemische Unsicherheit – Modellwissen",
      content: "Epistemische Unsicherheit entsteht durch begrenzte Trainingsdaten und Modellkomplexität. Sie kann durch mehr Daten reduziert werden und zeigt, wie sicher sich das Modell bei seinen Vorhersagen ist."
    },
    "Aleatorische Unsicherheit": {
      title: "Aleatorische Unsicherheit – Marktvolatilität",
      content: "Aleatorische Unsicherheit stammt aus der inhärenten Zufälligkeit der Finanzmärkte. Sie ist irreduzibel und spiegelt die natürliche Volatilität der Aktienkurse wider."
    },
    "Overfitting-Risiko": {
      title: "Overfitting-Risiko – Generalisierungsfähigkeit", 
      content: "Overfitting-Risiko misst, wie gut das Modell auf neue, ungesehene Daten generalisiert. Hohe Werte deuten auf Überanpassung an Trainingsdaten hin."
    },
    "Robustheit": {
      title: "Robustheit/Stabilität – Eingabesensitivität",
      content: "Robustheit misst, wie empfindlich das Modell auf kleine Änderungen in den Eingabedaten reagiert. Instabile Modelle ändern Empfehlungen bei minimalen Preisänderungen."
    },
    "Erklärungs-Konsistenz": {
      title: "Erklärungs-Konsistenz – Interpretierbarkeit",
      content: "Selbst bei gleichen Eingaben können verschiedene Trainingsläufe unterschiedliche Erklärungen liefern ('warum' es eine Empfehlung gibt). Wichtig für Vertrauen und Nachvollziehbarkeit."
    }
  }
  return infoContent[metric] || { title: "Information", content: "Keine Informationen verfügbar." }
}

// Mathematical Formula Component for Tooltips
const FormulaTooltip = ({ param, stock, type = "fundamental" }: { param: string; stock: string; type?: "fundamental" | "timeSeries" | "newsReliability" | "tradingVolume" }) => {
  const fundamentalData = getFundamentalDataParams(stock)
  const timeSeriesData = getTimeSeriesIntegrityParams(stock)
  const newsReliabilityData = getNewsReliabilityParams(stock)
  const tradingVolumeData = getTradingVolumeParams(stock)
  
  const fundamentalFormulas = {
    completeness: {
      title: `Vollständigkeit (C = ${fundamentalData.completeness.value})`,
      description: "Sind alle Pflichtfelder verfügbar?",
      formula: "C = 1 - \\frac{\\text{Fehlende Werte}}{\\text{Gesamte erwartete Werte}}",
      calculation: `C = 1 - \\frac{${fundamentalData.completeness.missingValues}}{${fundamentalData.completeness.totalValues}} = ${fundamentalData.completeness.value}`,
      impact: `${fundamentalData.completeness.missingValues} fehlende Werte reduzieren die Datenqualität um ${((1 - fundamentalData.completeness.value) * 100).toFixed(1)}%.`
    },
    timeliness: {
      title: `Aktualität (T = ${fundamentalData.timeliness.value})`,
      description: "Wie zeitnah sind die Daten verfügbar?",
      formula: "T = \\max\\left(0, 1 - \\frac{\\text{Verzögerung in Tagen}}{\\text{Maximaltoleranz}}\\right)",
      calculation: `T = \\max\\left(0, 1 - \\frac{${fundamentalData.timeliness.delayDays}}{${fundamentalData.timeliness.maxTolerance}}\\right) = ${fundamentalData.timeliness.value}`,
      impact: `${fundamentalData.timeliness.delayDays} Tage Verzögerung reduzieren die Aktualität um ${((1 - fundamentalData.timeliness.value) * 100).toFixed(1)}%.`
    },
    consistency: {
      title: `Konsistenz (K = ${fundamentalData.consistency.value})`,
      description: "Stimmen Daten über verschiedene Quellen überein?",
      formula: "K = 1 - \\frac{\\text{Durchschnittliche Abweichung}}{\\text{Referenzwert}}",
      calculation: `K = 1 - \\frac{${fundamentalData.consistency.avgDeviation}}{${fundamentalData.consistency.referenceValue}} = ${fundamentalData.consistency.value}`,
      impact: "Geringe Abweichung zwischen Quellen sorgt für hohe Verlässlichkeit."
    },
    accuracy: {
      title: `Genauigkeit (A = ${fundamentalData.accuracy.value})`,
      description: "Stimmen Daten mit offiziellen Quellen überein?",
      formula: "A = 1 - \\frac{\\text{Abweichung von offizieller Quelle}}{\\text{Referenzwert}}",
      calculation: `A = 1 - \\frac{${fundamentalData.accuracy.deviation}}{${fundamentalData.accuracy.officialValue}} = ${fundamentalData.accuracy.value}`,
      impact: `${((1 - fundamentalData.accuracy.value) * 100).toFixed(1)}% Abweichung von SEC-Filings bedeutet moderate Ungenauigkeit.`
    },
    stability: {
      title: `Stabilität (S = ${fundamentalData.stability.value})`,
      description: "Werden Daten häufig nachträglich korrigiert?",
      formula: "S = 1 - \\frac{\\text{Anzahl Revisionen}}{\\text{Gesamte Anzahl Datenpunkte}}",
      calculation: `S = 1 - \\frac{${fundamentalData.stability.revisions}}{${fundamentalData.stability.totalDataPoints}} = ${fundamentalData.stability.value}`,
      impact: `${fundamentalData.stability.revisions} nachträgliche Korrekturen reduzieren die Verlässlichkeit um ${((1 - fundamentalData.stability.value) * 100).toFixed(1)}%.`
    }
  }

  const timeSeriesFormulas = {
    completeness: {
      title: `Vollständigkeit (C = ${timeSeriesData.completeness.value})`,
      description: "Sind alle erwarteten Zeitpunkte vorhanden?",
      formula: "C = 1 - \\frac{\\text{fehlende Zeitpunkte}}{\\text{gesamte erwartete Zeitpunkte}}",
      calculation: `C = 1 - \\frac{${timeSeriesData.completeness.missingTimepoints}}{${timeSeriesData.completeness.expectedTimepoints}} = ${timeSeriesData.completeness.value}`,
      impact: `${timeSeriesData.completeness.missingTimepoints} fehlende Handelstage von ${timeSeriesData.completeness.expectedTimepoints} reduzieren die Vollständigkeit um ${((1 - timeSeriesData.completeness.value) * 100).toFixed(1)}%.`
    },
    outlierFreedom: {
      title: `Ausreißer-Freiheit (O = ${timeSeriesData.outlierFreedom.value})`,
      description: "Gibt es unplausible Sprünge oder Werte?",
      formula: "O = 1 - \\frac{\\text{Anzahl Ausreißer}}{\\text{Gesamtanzahl Beobachtungen}}",
      calculation: `O = 1 - \\frac{${timeSeriesData.outlierFreedom.outliers}}{${timeSeriesData.outlierFreedom.totalObservations}} = ${timeSeriesData.outlierFreedom.value}`,
      impact: `${timeSeriesData.outlierFreedom.outliers} Ausreißer bei ${timeSeriesData.outlierFreedom.totalObservations} Handelstagen deuten auf Datenfeed-Fehler hin.`
    },
    revisionStability: {
      title: `Revision-Stabilität (R = ${timeSeriesData.revisionStability.value})`,
      description: "Werden historische Zeitreihen später korrigiert?",
      formula: "R = 1 - \\frac{\\text{revidierte Werte}}{\\text{gesamte Werte}}",
      calculation: `R = 1 - \\frac{${timeSeriesData.revisionStability.revisedValues}}{${timeSeriesData.revisionStability.totalValues}} = ${timeSeriesData.revisionStability.value}`,
      impact: `${timeSeriesData.revisionStability.revisedValues} nachträgliche Korrekturen von ${timeSeriesData.revisionStability.totalValues} Werten zeigen Instabilität der Datenquelle.`
    },
    continuity: {
      title: `Kontinuität (K = ${timeSeriesData.continuity.value})`,
      description: "Ist die Serie gleichmäßig über die Zeit verteilt?",
      formula: "K = 1 - \\frac{\\text{Anzahl an Gaps > Intervall}}{\\text{Gesamtanzahl Intervalle}}",
      calculation: `K = 1 - \\frac{${timeSeriesData.continuity.gaps}}{${timeSeriesData.continuity.totalIntervals}} = ${timeSeriesData.continuity.value}`,
      impact: `${timeSeriesData.continuity.gaps} Gaps in der Zeitreihe unterbrechen die Kontinuität der Datenversorgung.`
    }
  }

  const newsReliabilityFormulas = {
    sourceReliability: {
      title: `Source Reliability (R = ${newsReliabilityData.sourceReliability.value})`,
      description: "Gewichtete Zuverlässigkeit der Quellen (Reuters > privater Blog)",
      formula: "R = \\frac{\\sum \\text{Gewichtete Zuverlässigkeit der Quellen}}{\\text{Anzahl Nachrichten}}",
      calculation: `R = \\frac{\\text{Durchschnittliche Quellenreliabilität}}{1} = ${newsReliabilityData.sourceReliability.value}`,
      impact: `${newsReliabilityData.sourceReliability.totalSources} Quellen mit durchschnittlicher Verlässlichkeit von ${(newsReliabilityData.sourceReliability.averageReliability * 100).toFixed(1)}%.`
    },
    reputationAccuracy: {
      title: `Reputation Accuracy (P = ${newsReliabilityData.reputationAccuracy.value})`,
      description: "Historische Trefferquote der Quellen gegen tatsächliche Marktereignisse",
      formula: "P = 1 - \\frac{\\text{Anzahl widerlegter Nachrichten}}{\\text{Gesamtanzahl Nachrichten}}",
      calculation: `P = 1 - \\frac{${newsReliabilityData.reputationAccuracy.falseNews}}{${newsReliabilityData.reputationAccuracy.totalNews}} = ${newsReliabilityData.reputationAccuracy.value}`,
      impact: `${newsReliabilityData.reputationAccuracy.falseNews} von ${newsReliabilityData.reputationAccuracy.totalNews} Nachrichten erwiesen sich als falsch.`
    },
    crossSourceConsensus: {
      title: `Cross-Source Consensus (K = ${newsReliabilityData.crossSourceConsensus.value})`,
      description: "Anteil der von mehreren unabhängigen Quellen bestätigten Nachrichten",
      formula: "K = \\frac{\\text{Anzahl bestätigter Nachrichten}}{\\text{Gesamtanzahl Nachrichten}}",
      calculation: `K = \\frac{${newsReliabilityData.crossSourceConsensus.confirmedNews}}{${newsReliabilityData.crossSourceConsensus.totalNews}} = ${newsReliabilityData.crossSourceConsensus.value}`,
      impact: `${newsReliabilityData.crossSourceConsensus.confirmedNews} von ${newsReliabilityData.crossSourceConsensus.totalNews} wichtigen News wurden von mind. 2 unabhängigen Quellen bestätigt.`
    },
    biasCheck: {
      title: `Bias Check (1-B = ${newsReliabilityData.biasCheck.value})`,
      description: "Einschätzung der Einseitigkeit durch NLP-Sentiment-Analyse",
      formula: "B = \\frac{\\text{Bias-Index}}{\\text{Max-Bias-Wert}}, \\quad \\text{Score} = 1 - B",
      calculation: `B = \\frac{${newsReliabilityData.biasCheck.biasIndex}}{${newsReliabilityData.biasCheck.maxBiasValue}} = ${1 - newsReliabilityData.biasCheck.value}, \\quad \\text{Score} = ${newsReliabilityData.biasCheck.value}`,
      impact: `Bias-Index von ${newsReliabilityData.biasCheck.biasIndex} deutet auf ${newsReliabilityData.biasCheck.biasIndex > 0.3 ? 'starke' : newsReliabilityData.biasCheck.biasIndex > 0.15 ? 'moderate' : 'geringe'} Verzerrung hin.`
    }
  }

  const tradingVolumeFormulas = {
    concentration: {
      title: `Konzentration (S = ${tradingVolumeData.concentration.value})`,
      description: "Herfindahl-Hirschman Index für Marktkonzentration",
      formula: "HHI = \\sum_{i=1}^{N} s_i^2, \\quad S = 1 - HHI",
      calculation: `S = 1 - ${tradingVolumeData.concentration.hhi.toFixed(3)} = ${tradingVolumeData.concentration.value.toFixed(3)}`,
      impact: `${tradingVolumeData.concentration.mainActors} Hauptakteure mit HHI=${tradingVolumeData.concentration.hhi.toFixed(2)} zeigen ${tradingVolumeData.concentration.hhi > 0.25 ? 'hohe' : tradingVolumeData.concentration.hhi > 0.15 ? 'moderate' : 'geringe'} Konzentration.`
    },
    anomalousSpikes: {
      title: `Anomalous Spikes (A = ${tradingVolumeData.anomalousSpikes.value})`,
      description: "Erkennung untypischer Volumenschübe",
      formula: "A = 1 - \\frac{\\text{Spike-Zeitpunkte}}{\\text{Gesamtanzahl}}",
      calculation: `A = 1 - \\frac{${tradingVolumeData.anomalousSpikes.spikes}}{${tradingVolumeData.anomalousSpikes.totalDays}} = ${tradingVolumeData.anomalousSpikes.value.toFixed(3)}`,
      impact: `${tradingVolumeData.anomalousSpikes.spikes} Spikes in ${tradingVolumeData.anomalousSpikes.totalDays} Tagen (${((tradingVolumeData.anomalousSpikes.spikes / tradingVolumeData.anomalousSpikes.totalDays) * 100).toFixed(1)}%) deuten auf ${tradingVolumeData.anomalousSpikes.spikes > 6 ? 'erhöhte' : 'normale'} Marktvolatilität hin.`
    },
    timeStability: {
      title: `Zeit-Stabilität (T = ${tradingVolumeData.timeStability.value})`,
      description: "Coefficient of Variation für Volumen-Stabilität",
      formula: "T = 1 - \\frac{\\sigma_V}{\\mu_V + \\epsilon}",
      calculation: `T = 1 - \\frac{${(tradingVolumeData.timeStability.stdev * tradingVolumeData.timeStability.avgVolume / 1000000).toFixed(1)}M}{${(tradingVolumeData.timeStability.avgVolume / 1000000).toFixed(1)}M} = ${tradingVolumeData.timeStability.value.toFixed(3)}`,
      impact: `CV von ${tradingVolumeData.timeStability.stdev.toFixed(2)} zeigt ${tradingVolumeData.timeStability.stdev > 0.3 ? 'hohe' : tradingVolumeData.timeStability.stdev > 0.2 ? 'moderate' : 'geringe'} Volumen-Volatilität.`
    }
  }

  let formula: { title: string; description: string; formula: string; calculation: string; impact: string } | undefined
  
  if (type === "newsReliability") {
    formula = newsReliabilityFormulas[param as keyof typeof newsReliabilityFormulas]
  } else if (type === "timeSeries") {
    formula = timeSeriesFormulas[param as keyof typeof timeSeriesFormulas]
  } else if (type === "tradingVolume") {
    formula = tradingVolumeFormulas[param as keyof typeof tradingVolumeFormulas]
  } else {
    formula = fundamentalFormulas[param as keyof typeof fundamentalFormulas]
  }
  
  if (!formula) return <div>Keine Informationen verfügbar.</div>
  
  return (
    <div className="space-y-3 max-w-sm">
      <div className="font-semibold text-sm text-white">{formula.title}</div>
      <div className="text-xs text-gray-200">{formula.description}</div>
      
      <div className="space-y-2">
        <div className="text-xs font-medium text-white">Formel:</div>
        <div className="bg-white p-2 rounded border text-black overflow-hidden formula-container">
          <div className="flex items-center justify-center min-h-[60px]">
            <BlockMath math={formula.formula} />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs font-medium text-white">Aktuell:</div>
        <div className="bg-white p-2 rounded border text-black overflow-hidden formula-container-small">
          <div className="flex items-center justify-center min-h-[50px]">
            <BlockMath math={formula.calculation} />
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-200 border-t border-gray-300 pt-2">
        <strong className="text-white">Auswirkung:</strong> {formula.impact}
      </div>
    </div>
  )
}

// Function to get real values calculation formulas
const getCalculationWithRealValues = (parameterName: string, rawData: Record<string, string | number>) => {
  switch (parameterName) {
    case "Epistemische Unsicherheit":
      const varianceVal = Object.values(rawData)[0];
      const meanVal = Object.values(rawData)[1];
      return `E = 1 - \\frac{${varianceVal}}{${meanVal.toString().replace('%', '')} + 0.01} = ${Object.values(rawData)[2]}`;
    
    case "Aleatorische Unsicherheit":
      const confInterval = Object.values(rawData)[0];
      const maxVariance = Object.values(rawData)[1];
      return `A = 1 - \\frac{${confInterval.toString().replace('±', '').replace('%', '')}}{${maxVariance}} = ${Object.values(rawData)[2]}`;
    
    case "Overfitting-Risiko":
      const trainLoss = Object.values(rawData)[0];
      const testLoss = Object.values(rawData)[1];
      return `C = 1 - \\frac{|${trainLoss} - ${testLoss}|}{${trainLoss} + 0.001} = ${Object.values(rawData)[2]}`;
    
    case "Robustheit":
      const sensitivity = Object.values(rawData)[0];
      const baseline = Object.values(rawData)[1];
      return `R = 1 - \\frac{${sensitivity}}{${baseline.toString().replace('%', '')}} = ${Object.values(rawData)[2]}`;
    
    case "Erklärungs-Konsistenz":
      const correlation = Object.values(rawData)[0];
      return `X = \\text{Korrelation}(FI_{run1}, FI_{run2}) = ${correlation} = ${Object.values(rawData)[1]}`;
    
    default:
      return "Formel nicht verfügbar";
  }
}

// Function to get specific parameter explanations for hover tooltips
const getParameterExplanation = (parameterName: string, dimensionName: string): string => {
  const explanations: Record<string, Record<string, string>> = {
    "Epistemische Unsicherheit": {
      "Vorhersage-Varianz (σ)": "Misst wie stark die Vorhersagen des Modells schwanken. Niedrige Werte bedeuten konsistentere Vorhersagen.",
      "Mittlere Vorhersage (μ)": "Der durchschnittliche Kurs-Vorhersagewert des Modells für diese Aktie. Zeigt die erwartete Kursentwicklung.",
      "Modell-Konfidenz": "Wie sicher sich das Modell bei seinen Vorhersagen ist. Höhere Werte = höhere Sicherheit des Modells."
    },
    "Aleatorische Unsicherheit": {
      "Konfidenzintervall": "Der Bereich, in dem die tatsächliche Kursentwicklung mit 95% Wahrscheinlichkeit liegen wird.",
      "Max. erwartete Varianz": "Die maximale Schwankungsbreite, die aufgrund von Marktvolatilität erwartet wird.",
      "Markt-Vorhersagbarkeit": "Wie gut der Markt für diese Aktie grundsätzlich vorhersagbar ist. Höhere Werte = berechenbarerer Markt."
    },
    "Overfitting-Risiko": {
      "Trainingsfehler": "Wie gut das Modell auf den Trainingsdaten performt. Sehr niedrige Werte können auf Überanpassung hindeuten.",
      "Testfehler": "Wie gut das Modell auf neuen, ungesehenen Daten performt. Wichtiger als der Trainingsfehler.",
      "Generalisierungsgüte": "Wie gut das Modell auf neue Daten verallgemeinern kann. Höhere Werte = bessere Übertragbarkeit."
    },
    "Robustheit": {
      "Störungs-Sensitivität": "Wie empfindlich das Modell auf kleine Datenänderungen reagiert. Niedrige Werte = robusteres Modell.",
      "Baseline-Vorhersage": "Die Grundvorhersage des Modells ohne Störungen. Referenzwert für Stabilitätsmessungen.",
      "Stabilität": "Wie konstant die Modellergebnisse bei ähnlichen Eingaben sind. Höhere Werte = stabileres Modell."
    },
    "Erklärungs-Konsistenz": {
      "Feature-Korrelation": "Wie konsistent das Modell dieselben Faktoren als wichtig bewertet. Höhere Werte = verlässlichere Erklärungen.",
      "Erklärbarkeits-Score": "Gesamtbewertung der Interpretierbarkeit des Modells. Höhere Werte = nachvollziehbarere Entscheidungen.",
      "Interpretierbarkeit": "Qualitative Bewertung wie gut die Modellentscheidungen verstanden werden können."
    }
  }
  
  return explanations[dimensionName]?.[parameterName] || "Erklärung für diesen Parameter ist noch nicht verfügbar."
}

// Function to create pop-up content for uncertainty parameters
const getUncertaintyParameterPopup = (parameterName: string, selectedStock: string, uncertaintyParams: ModelUncertaintyParams) => {
  const parameterMap: Record<string, {
    title: string;
    icon: React.ReactNode;
    description: string;
    importance: string;
    formula: string;
    currentValue: number;
    rawData: Record<string, string | number>;
  }> = {
    "Epistemische Unsicherheit": {
      title: "Epistemische Unsicherheit",
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      description: "Unsicherheit über das Modellwissen selbst. Misst, ob das Modell genug Erfahrung mit ähnlichen Marktsituationen hat.",
      importance: "Zeigt, ob das Modell für die aktuelle Marktsituation trainiert wurde. Besonders kritisch bei neuen Marktregimen oder extremen Ereignissen.",
      formula: "E = 1 - \\frac{\\sigma_{\\hat{y}}}{\\mu_{\\hat{y}} + \\epsilon}",
      currentValue: uncertaintyParams.epistemicUncertainty.value,
      rawData: {
        "Vorhersage-Varianz (σ)": uncertaintyParams.epistemicUncertainty.predictionVariance.toFixed(3),
        "Mittlere Vorhersage (μ)": uncertaintyParams.epistemicUncertainty.meanPrediction.toFixed(2) + "%",
        "Modell-Konfidenz": (uncertaintyParams.epistemicUncertainty.value * 100).toFixed(1) + "%"
      }
    },
    "Aleatorische Unsicherheit": {
      title: "Aleatorische Unsicherheit", 
      icon: <Activity className="h-6 w-6 text-blue-600" />,
      description: "Natürliche Zufälligkeit im Markt, die selbst das beste Modell nicht erklären kann (z.B. plötzliche News, Messrauschen).",
      importance: "Unvermeidbare Unsicherheit durch Markt-Volatilität. Kann durch bessere Modelle nicht reduziert werden, nur quantifiziert.",
      formula: "A = 1 - \\frac{\\text{mittlere Vorhersagevarianz}}{\\text{maximale erwartete Varianz}}",
      currentValue: uncertaintyParams.aleatoricUncertainty.value,
      rawData: {
        "Konfidenzintervall": "±" + uncertaintyParams.aleatoricUncertainty.confidenceInterval.toFixed(1) + "%",
        "Max. erwartete Varianz": uncertaintyParams.aleatoricUncertainty.maxExpectedVariance.toFixed(1),
        "Markt-Vorhersagbarkeit": (uncertaintyParams.aleatoricUncertainty.value * 100).toFixed(1) + "%"
      }
    },
    "Overfitting-Risiko": {
      title: "Overfitting-Risiko",
      icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
      description: "Wenn ein Modell zu komplex ist, 'merkt' es sich Trainingsdaten, anstatt Muster zu lernen. Im Test auf neuen Daten wird es viel schlechter.",
      importance: "Kritisch für die Generalisierungsfähigkeit. Hohes Overfitting bedeutet schlechte Performance auf neuen Marktdaten.",
      formula: "C = 1 - \\frac{|L_{train} - L_{test}|}{L_{train} + \\epsilon}",
      currentValue: uncertaintyParams.overfittingRisk.value,
      rawData: {
        "Trainingsfehler": uncertaintyParams.overfittingRisk.trainLoss.toFixed(3),
        "Testfehler": uncertaintyParams.overfittingRisk.testLoss.toFixed(3),
        "Generalisierungsgüte": (uncertaintyParams.overfittingRisk.value * 100).toFixed(1) + "%"
      }
    },
    "Robustheit": {
      title: "Robustheit/Stabilität",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: "Misst, wie empfindlich das Modell auf kleine Änderungen in den Eingabedaten reagiert. Instabile Modelle ändern Empfehlungen bei minimalen Preisänderungen.",
      importance: "Entscheidend für verlässliche Trading-Entscheidungen. Robuste Modelle geben konsistente Empfehlungen bei ähnlichen Marktbedingungen.",
      formula: "R = 1 - \\frac{\\Delta\\hat{y}}{\\hat{y}}",
      currentValue: uncertaintyParams.robustness.value,
      rawData: {
        "Störungs-Sensitivität": uncertaintyParams.robustness.perturbationSensitivity.toFixed(3),
        "Baseline-Vorhersage": uncertaintyParams.robustness.baselinePrediction.toFixed(2) + "%",
        "Stabilität": (uncertaintyParams.robustness.value * 100).toFixed(1) + "%"
      }
    },
    "Erklärungs-Konsistenz": {
      title: "Erklärungs-Konsistenz",
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      description: "Selbst bei gleichen Eingaben können verschiedene Trainingsläufe unterschiedliche Erklärungen liefern ('warum' es eine Empfehlung gibt).",
      importance: "Wichtig für Vertrauen und Nachvollziehbarkeit. Inkonsistente Erklärungen deuten auf instabile Feature-Wichtigkeiten hin.",
      formula: "X = \\text{Korrelation}(FI_{run1}, FI_{run2})",
      currentValue: uncertaintyParams.explanationConsistency.value,
      rawData: {
        "Feature-Korrelation": uncertaintyParams.explanationConsistency.featureImportanceCorrelation.toFixed(3),
        "Erklärbarkeits-Score": (uncertaintyParams.explanationConsistency.value * 100).toFixed(1) + "%",
        "Interpretierbarkeit": uncertaintyParams.explanationConsistency.value > 0.8 ? "Hoch" : uncertaintyParams.explanationConsistency.value > 0.6 ? "Mittel" : "Niedrig"
      }
    }
  };

  const param = parameterMap[parameterName];
  if (!param) return <div>Parameter nicht gefunden</div>;

  return (
    <>
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          {param.icon}
          <h3 className="text-xl font-semibold">{param.title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded-full hover:bg-muted/50">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-lg">
                <div className="space-y-2 p-2">
                  <div className="font-semibold text-sm text-white">Beschreibung</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {param.description}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Bedeutung:</strong> {param.importance}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          Detaillierte Analyse für {selectedStock}
        </p>
      </div>
      
      <div className="space-y-6 py-6">
        
        {/* Parameter-Aufschlüsselung */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Detaillierte Parameter-Aufschlüsselung:</h4>
          
          {Object.entries(param.rawData).map(([key, value], index) => (
            <div key={key} className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{index + 1}. {key}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-muted/50 transition-colors">
                        <Info className="h-3 w-3 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {getParameterExplanation(key, parameterName)}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-sm text-muted-foreground">
                Aktueller Wert: <span className="font-medium text-foreground">{value}</span> für {selectedStock}
              </div>
            </div>
          ))}
        </div>
        
        {/* Formel-Sektion */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">Berechnung</h4>
            <TooltipProvider key="inner-tooltip">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-muted/50">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-lg">
                  <div className="space-y-2 p-2">
                    <div className="font-semibold text-sm text-white">Generelle Formel</div>
                    <div className="formula-container bg-muted/30 p-2 rounded">
                      <BlockMath math={param.formula} />
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="formula-container">
              <BlockMath math={getCalculationWithRealValues(parameterName, param.rawData)} />
            </div>
          </div>
        </div>

        {/* Gesamtbewertung */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold mb-2 text-primary">Gesamtscore: 
            <span className={`ml-2 ${getStatusColor(getStatus(param.currentValue * 100))}`}>
              {(param.currentValue * 100).toFixed(1)}%
            </span>
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Bewertung für {selectedStock}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Qualitätsbewertung:</span>
            <span className={`text-sm font-bold ${
              param.currentValue > 0.8 ? 'text-green-600' : 
              param.currentValue > 0.6 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {param.currentValue > 0.8 ? 'Sehr gut' : 
               param.currentValue > 0.6 ? 'Gut' : 
               param.currentValue > 0.4 ? 'Mäßig' : 'Schlecht'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function TechnicalAnalysisTab({ selectedStock }: TechnicalAnalysisTabProps) {
  const data = getTechnicalData(selectedStock)
  const [activeInfoBox, setActiveInfoBox] = useState<string | null>(null)
  const [isInfoBoxVisible, setIsInfoBoxVisible] = useState(false)

  // Inject custom CSS for formula scaling
  React.useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = formulaStyles
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])
  
  const handleInfoClick = (metric: string) => {
    if (activeInfoBox === metric) {
      setIsInfoBoxVisible(false)
      setTimeout(() => setActiveInfoBox(null), 300) // Wait for animation
    } else {
      setActiveInfoBox(metric)
      // Small delay to ensure DOM update before animation
      setTimeout(() => setIsInfoBoxVisible(true), 10)
    }
  }

  const closeInfoBox = () => {
    setIsInfoBoxVisible(false)
    setTimeout(() => setActiveInfoBox(null), 300) // Wait for animation
  }
  
  return (
    <TooltipProvider>
      <div className="relative space-y-4">
        <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Datenunsicherheit
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Modellunsicherheit
          </TabsTrigger>
          <TabsTrigger value="human" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Menschliche Unsicherheit
          </TabsTrigger>
        </TabsList>

        {/* Data Uncertainty Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Datenvalidierung & -qualität
              </CardTitle>
              <CardDescription>
                Analyse der Eingangsdaten für die KI-Empfehlung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fundamental Data */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.dataValidation.fundamentalData.status)}
                  <span className="font-medium">Fundamentaldaten</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleInfoClick('fundamentalData')}
                        className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Für nähere Information klicken Sie auf das Icon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={getStatusColor(data.dataValidation.fundamentalData.status)}>
                  {data.dataValidation.fundamentalData.score}%
                </Badge>
              </div>
              <Progress value={data.dataValidation.fundamentalData.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.dataValidation.fundamentalData.issues} Qualitätsprobleme erkannt
              </p>
            </div>

            {/* News Reliability */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.dataValidation.newsReliability.status)}
                  <span className="font-medium">Nachrichten-Verlässlichkeit</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleInfoClick('newsReliability')}
                        className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Für nähere Information klicken Sie auf das Icon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={getStatusColor(data.dataValidation.newsReliability.status)}>
                  {data.dataValidation.newsReliability.score}%
                </Badge>
              </div>
              <Progress value={data.dataValidation.newsReliability.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.dataValidation.newsReliability.sources} vertrauenswürdige Quellen
              </p>
            </div>

            {/* Time Series Integrity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.dataValidation.timeSeriesIntegrity.status)}
                  <span className="font-medium">Zeitreihen-Integrität</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleInfoClick('timeSeriesIntegrity')}
                        className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Für nähere Information klicken Sie auf das Icon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={getStatusColor(data.dataValidation.timeSeriesIntegrity.status)}>
                  {data.dataValidation.timeSeriesIntegrity.score}%
                </Badge>
              </div>
              <Progress value={data.dataValidation.timeSeriesIntegrity.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.dataValidation.timeSeriesIntegrity.gaps} Datenlücken gefunden
              </p>
            </div>

            {/* Trading Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.dataValidation.tradingVolume.status)}
                  <span className="font-medium">Handelsvolumen-Verteilung</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleInfoClick('tradingVolume')}
                        className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Für nähere Information klicken Sie auf das Icon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={getStatusColor(data.dataValidation.tradingVolume.status)}>
                  {data.dataValidation.tradingVolume.score}%
                </Badge>
              </div>
              <Progress value={data.dataValidation.tradingVolume.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.dataValidation.tradingVolume.anomalies} Volumen-Anomalien
              </p>
            </div>
          </div>
        </CardContent>
          </Card>
        </TabsContent>

        {/* Model Uncertainty Tab */}
        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Modell-Metriken & Performance
              </CardTitle>
              <CardDescription>
                Technische Details zur KI-Modell-Performance
              </CardDescription>
            </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Model Performance Metrics with Hover Tooltips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className={`text-2xl font-bold ${getStatusColor(getStatus(data.modelMetrics.trainingAccuracy)).split(' ')[0]}`}>
                  {data.modelMetrics.trainingAccuracy}%
                </div>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-sm text-muted-foreground">Trainings-Genauigkeit</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Wie gut das Modell auf Trainingsdaten abschneidet. 
                          Höhere Werte = bessere Performance auf historischen Daten. 
                          Werte über 90% sind sehr gut.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className={`text-2xl font-bold ${getStatusColor(getValidationLossStatus(data.modelMetrics.validationLoss)).split(' ')[0]}`}>
                  {data.modelMetrics.validationLoss}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-sm text-muted-foreground">Validierungsfehler</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Wie schlecht das Modell auf ungesehenen Testdaten abschneidet.
                          Niedrigere Werte = bessere Generalisierung. 
                          Werte unter 0.05 sind sehr gut.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className={`text-sm font-bold text-center ${getStatusColor(getPredictionIntervalStatus(data.modelMetrics.predictionInterval)).split(' ')[0]}`}>
                  {data.modelMetrics.predictionInterval}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-sm text-muted-foreground">Prognoseintervall</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Unsicherheitsspanne um eine Vorhersage. 
                          Beispiel: &quot;Kurs steigt um 2% ±1.5%&quot;. 
                          Schmalere Intervalle = präzisere Vorhersagen.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Feature Importance with Pop-up Details */}
            <div>
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Modellunsicherheits-Dimensionen
              </h4>
              <div className="space-y-3">
                {data.modelMetrics.featureImportance.map((feature: FeatureImportance, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm items-center">
                      <div className="flex items-center gap-2">
                        <span>{feature.name}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={() => handleInfoClick(feature.name)}
                              className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                            >
                              <Info className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Für nähere Information klicken Sie auf das Icon</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-medium">{getUncertaintyValue(feature.name, data.modelMetrics.uncertaintyParams).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={getUncertaintyValue(feature.name, data.modelMetrics.uncertaintyParams)} 
                      className={`h-2`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
          </Card>
        </TabsContent>

        {/* Human Uncertainty Tab */}
        <TabsContent value="human" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Menschliche Faktoren & Experteneinschätzung
              </CardTitle>
              <CardDescription>
                Analyse der menschlichen Unsicherheitsfaktoren
              </CardDescription>
            </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Experten-Konsens</span>
                  <span className="font-medium">{data.humanFactors.expertConsensus}%</span>
                </div>
                <Progress value={data.humanFactors.expertConsensus} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Markt-Sentiment</span>
                  <span className="font-medium">{data.humanFactors.marketSentiment}%</span>
                </div>
                <Progress value={data.humanFactors.marketSentiment} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analysten-Verlässlichkeit</span>
                  <span className="font-medium">{data.humanFactors.analystReliability}%</span>
                </div>
                <Progress value={data.humanFactors.analystReliability} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verhaltens-Bias</span>
                  <span className="font-medium text-red-600">{data.humanFactors.behavioralBias}%</span>
                </div>
                <Progress value={data.humanFactors.behavioralBias} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Niedrigere Werte sind besser
                </p>
              </div>
            </div>
          </div>
            </CardContent>
          </Card>

          {/* Uncertainty Heatmap Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Unsicherheits-Heatmap
              </CardTitle>
              <CardDescription>
                Visuelle Darstellung der Unsicherheitsquellen über Zeit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {/* Heatmap simulation */}
                <div className="text-center font-medium">Mo</div>
                <div className="text-center font-medium">Di</div>
                <div className="text-center font-medium">Mi</div>
                <div className="text-center font-medium">Do</div>
                <div className="text-center font-medium">Fr</div>
                <div className="text-center font-medium">Sa</div>
                <div className="text-center font-medium">So</div>
                
                {/* Week 1 */}
                <div className="h-8 bg-green-500/30 rounded flex items-center justify-center">15%</div>
                <div className="h-8 bg-yellow-500/40 rounded flex items-center justify-center">23%</div>
                <div className="h-8 bg-green-500/20 rounded flex items-center justify-center">12%</div>
                <div className="h-8 bg-yellow-500/50 rounded flex items-center justify-center">28%</div>
                <div className="h-8 bg-red-500/30 rounded flex items-center justify-center">42%</div>
                <div className="h-8 bg-green-500/25 rounded flex items-center justify-center">18%</div>
                <div className="h-8 bg-green-500/15 rounded flex items-center justify-center">9%</div>
                
                {/* Week 2 */}
                <div className="h-8 bg-yellow-500/35 rounded flex items-center justify-center">25%</div>
                <div className="h-8 bg-green-500/30 rounded flex items-center justify-center">16%</div>
                <div className="h-8 bg-red-500/40 rounded flex items-center justify-center">45%</div>
                <div className="h-8 bg-yellow-500/45 rounded flex items-center justify-center">31%</div>
                <div className="h-8 bg-green-500/20 rounded flex items-center justify-center">11%</div>
                <div className="h-8 bg-yellow-500/30 rounded flex items-center justify-center">22%</div>
                <div className="h-8 bg-green-500/25 rounded flex items-center justify-center">17%</div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                <span>Niedrig (0-20%)</span>
                <span>Mittel (21-40%)</span>
                <span>Hoch (41%+)</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>

        {/* Slide-in Info Box */}
        {activeInfoBox && (
          <>
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
              onClick={closeInfoBox}
            />
            
            {/* Info Box sliding from right */}
            <div className={`fixed right-0 top-0 h-full w-96 bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              isInfoBoxVisible ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h3 className="text-lg font-semibold text-foreground">
                    {getInfoBoxContent(activeInfoBox).title}
                  </h3>
                  <button 
                    onClick={closeInfoBox}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto violet-bloom-scrollbar">
                  <div className="space-y-4">
                    
                    {/* Fundamentaldaten detailed parameters */}
                    {activeInfoBox === 'fundamentalData' && (() => {
                      const params = getFundamentalDataParams(selectedStock)
                      const overallScore = ((params.completeness.value + params.timeliness.value + params.consistency.value + params.accuracy.value + params.stability.value) / 5 * 100).toFixed(1)
                      
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Die Fundamentaldaten-Qualität wird aus 5 kritischen Parametern berechnet: Vollständigkeit, Aktualität, Konsistenz, Genauigkeit und Stabilität der Finanzdaten.
                            </p>
                          </div>
                          {/* Overall Score */}
                          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-semibold mb-2 text-primary">Gesamtscore: {overallScore}%</h4>
                            <p className="text-sm text-muted-foreground">
                              Durchschnitt aller 5 Dimensionen für {selectedStock}
                            </p>
                          </div>

                          {/* Parameter Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-foreground">Detaillierte Parameter-Aufschlüsselung:</h4>
                            
                            {/* Completeness */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">1. Vollständigkeit (C)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="completeness" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.completeness.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.completeness.totalValues - params.completeness.missingValues} von {params.completeness.totalValues} Feldern verfügbar
                              </div>
                            </div>

                            {/* Timeliness */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">2. Aktualität (T)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="timeliness" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.timeliness.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Durchschnittlich {params.timeliness.delayDays} Tage Verzögerung
                              </div>
                            </div>

                            {/* Consistency */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">3. Konsistenz (K)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="consistency" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.consistency.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Durchschnittliche Abweichung zwischen Quellen: {params.consistency.avgDeviation}
                              </div>
                            </div>

                            {/* Accuracy */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">4. Genauigkeit (A)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="accuracy" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.accuracy.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Abweichung von SEC-Filings: {params.accuracy.deviation}
                              </div>
                            </div>

                            {/* Stability */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">5. Stabilität (S)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="stability" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.stability.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.stability.revisions} von {params.stability.totalDataPoints} Datenpunkten revidiert
                              </div>
                            </div>
                          </div>

                          {/* Formula Explanation */}
                          <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <h4 className="font-medium text-green-700">Gesamtberechnung</h4>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="p-1 rounded-full hover:bg-muted/50">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-lg">
                                  <div className="space-y-3 p-2">
                                    <div className="font-semibold text-sm text-white">Fundamentaldaten Gesamtformel</div>
                                    <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                      <div className="flex items-center justify-center min-h-[60px]">
                                        <BlockMath math="\\text{Score} = \\frac{C + T + K + A + S}{5}" />
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-200">
                                      Gleichgewichteter Durchschnitt aller 5 Parameter
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            
                            <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                              <div className="flex items-center justify-center min-h-[60px]">
                                <BlockMath math={`\\text{Aktuell} = \\frac{${(params.completeness.value * 100).toFixed(1)} + ${(params.timeliness.value * 100).toFixed(1)} + ${(params.consistency.value * 100).toFixed(1)} + ${(params.accuracy.value * 100).toFixed(1)} + ${(params.stability.value * 100).toFixed(1)}}{5} = ${overallScore}\\%`} />
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* Time Series Integrity Details */}
                    {activeInfoBox === 'timeSeriesIntegrity' && (() => {
                      const params = getTimeSeriesIntegrityParams(selectedStock)
                      const overallScoreNum = (params.completeness.value + params.outlierFreedom.value + params.revisionStability.value + params.continuity.value) / 4 * 100
                      const overallScore = overallScoreNum.toFixed(1)
                      
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Die Zeitreihen-Integrität bewertet die Qualität der Kursdaten über die Zeit anhand von 4 Dimensionen: Vollständigkeit, Ausreißer-Freiheit, Revision-Stabilität und Kontinuität.
                            </p>
                          </div>
                          {/* Overall Score */}
                          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-semibold mb-2 text-primary">Gesamtscore: {overallScore}%</h4>
                            <p className="text-sm text-muted-foreground">
                              Durchschnitt aller 4 Dimensionen für {selectedStock}
                            </p>
                          </div>

                          {/* Parameter Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-foreground">Detaillierte Parameter-Aufschlüsselung:</h4>
                            
                            {/* Completeness */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">1. Vollständigkeit (C)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="completeness" stock={selectedStock} type="timeSeries" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.completeness.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.completeness.expectedTimepoints - params.completeness.missingTimepoints} von {params.completeness.expectedTimepoints} Zeitpunkten verfügbar
                              </div>
                            </div>

                            {/* Outlier Freedom */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">2. Ausreißer-Freiheit (O)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="outlierFreedom" stock={selectedStock} type="timeSeries" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.outlierFreedom.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.outlierFreedom.totalObservations - params.outlierFreedom.outliers} von {params.outlierFreedom.totalObservations} Beobachtungen ohne Ausreißer
                              </div>
                            </div>

                            {/* Revision Stability */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">3. Revision-Stabilität (R)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="revisionStability" stock={selectedStock} type="timeSeries" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.revisionStability.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.revisionStability.totalValues - params.revisionStability.revisedValues} von {params.revisionStability.totalValues} Werten ohne Revision
                              </div>
                            </div>

                            {/* Continuity */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">4. Kontinuität (K)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="continuity" stock={selectedStock} type="timeSeries" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.continuity.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.continuity.totalIntervals - params.continuity.gaps} von {params.continuity.totalIntervals} Intervallen ohne Gaps
                              </div>
                            </div>
                          </div>

                          {/* Overall Formula */}
                          <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <h4 className="font-medium text-green-700">Gesamtberechnung</h4>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="p-1 rounded-full hover:bg-muted/50">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-lg">
                                  <div className="space-y-3 p-2">
                                    <div className="font-semibold text-sm text-white">Zeitreihen-Integrität Gesamtformel</div>
                                    <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                      <div className="flex items-center justify-center min-h-[60px]">
                                        <BlockMath math="\\text{Score} = \\frac{C + O + R + K}{4}" />
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-200">
                                      Gleichgewichteter Durchschnitt aller 4 Parameter
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            
                            <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                              <div className="flex items-center justify-center min-h-[60px]">
                                <BlockMath math={`\\text{Aktuell} = \\frac{${(params.completeness.value * 100).toFixed(1)} + ${(params.outlierFreedom.value * 100).toFixed(1)} + ${(params.revisionStability.value * 100).toFixed(1)} + ${(params.continuity.value * 100).toFixed(1)}}{4} = ${overallScore}\\%`} />
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* News Reliability Details */}
                    {activeInfoBox === 'newsReliability' && (() => {
                      const params = getNewsReliabilityParams(selectedStock)
                      // Weighted calculation: w1=0.3, w2=0.3, w3=0.25, w4=0.15
                      const w1 = 0.3, w2 = 0.3, w3 = 0.25, w4 = 0.15
                      const overallScoreNum = (w1 * params.sourceReliability.value + w2 * params.reputationAccuracy.value + w3 * params.crossSourceConsensus.value + w4 * params.biasCheck.value) * 100
                      const overallScore = overallScoreNum.toFixed(1)
                      
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Die Nachrichten-Verlässlichkeit bewertet die Qualität von Marktinformationen durch 4 gewichtete Dimensionen: Quellenseriosität, historische Trefferquote, Bestätigung durch mehrere Quellen und Verzerrungsanalyse.
                            </p>
                          </div>
                          {/* Overall Score */}
                          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-semibold mb-2 text-primary">Gesamtscore: {overallScore}%</h4>
                            <p className="text-sm text-muted-foreground">
                              Gewichteter Durchschnitt aller 4 Dimensionen für {selectedStock}
                            </p>
                          </div>

                          {/* Parameter Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-foreground">Detaillierte Parameter-Aufschlüsselung:</h4>
                            
                            {/* Source Reliability */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">1. Source Reliability (R)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="sourceReliability" stock={selectedStock} type="newsReliability" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.sourceReliability.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.sourceReliability.totalSources} Quellen analysiert, durchschnittliche Verlässlichkeit: {(params.sourceReliability.averageReliability * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w1 * 100}% (Reuters=0.98, Bloomberg=0.95, CNN=0.75)
                              </div>
                            </div>

                            {/* Reputation Accuracy */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">2. Reputation Accuracy (P)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="reputationAccuracy" stock={selectedStock} type="newsReliability" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.reputationAccuracy.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.reputationAccuracy.falseNews} widerlegte Nachrichten von {params.reputationAccuracy.totalNews} geprüften
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w2 * 100}% - Track Record gegen tatsächliche Marktereignisse
                              </div>
                            </div>

                            {/* Cross-Source Consensus */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">3. Cross-Source Consensus (K)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="crossSourceConsensus" stock={selectedStock} type="newsReliability" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.crossSourceConsensus.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.crossSourceConsensus.confirmedNews} von {params.crossSourceConsensus.totalNews} wichtigen News wurden bestätigt
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w3 * 100}% - Bestätigung durch mind. 2 unabhängige Quellen
                              </div>
                            </div>

                            {/* Bias Check */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">4. Bias Check (1-B)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="biasCheck" stock={selectedStock} type="newsReliability" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.biasCheck.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Bias-Index: {params.biasCheck.biasIndex} (NLP-Sentiment-Analyse)
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w4 * 100}% - Erkennung von Sensationalismus und Pump & Dump
                              </div>
                            </div>
                          </div>

                          {/* Formula Explanation */}
                          <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <h4 className="font-medium text-green-700">Gesamtberechnung</h4>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="p-1 rounded-full hover:bg-muted/50">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-lg">
                                  <div className="space-y-3 p-2">
                                    <div className="font-semibold text-sm text-white">Nachrichten-Verlässlichkeit Gesamtformel</div>
                                    <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                      <div className="flex items-center justify-center min-h-[60px]">
                                        <BlockMath math="Q_{news} = w_1 \\cdot R + w_2 \\cdot P + w_3 \\cdot K + w_4 \\cdot (1-B)" />
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-200">
                                      Gewichteter Durchschnitt: w₁=30%, w₂=30%, w₃=25%, w₄=15%
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="text-xs text-muted-foreground space-y-1 mb-3">
                                <p><strong>R</strong> = Source Reliability, <strong>P</strong> = Reputation Accuracy</p>
                                <p><strong>K</strong> = Cross-Source Consensus, <strong>B</strong> = Bias-Score</p>
                                <p><strong>Gewichte:</strong> w₁={w1}, w₂={w2}, w₃={w3}, w₄={w4}</p>
                              </div>
                              
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                <div className="flex items-center justify-center min-h-[60px]">
                                  <BlockMath math={`\\text{Aktuell} = ${w1} \\cdot ${params.sourceReliability.value} + ${w2} \\cdot ${params.reputationAccuracy.value} + ${w3} \\cdot ${params.crossSourceConsensus.value} + ${w4} \\cdot ${params.biasCheck.value} = ${(overallScoreNum/100).toFixed(3)}`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* Trading Volume Distribution Info */}
                    {(() => {
                      if (activeInfoBox !== 'tradingVolume') return null
                      
                      const params = getTradingVolumeParams(selectedStock)
                      const w1 = 0.4, w2 = 0.3, w3 = 0.3 // Gewichtungen
                      const overallScoreNum = (w1 * params.concentration.value + w2 * params.anomalousSpikes.value + w3 * params.timeStability.value) * 100
                      const overallScore = overallScoreNum.toFixed(1)
                      
                      // Farblogik für Score-Qualität
                      const getScoreColor = (score: number) => {
                        if (score >= 90) return { bg: 'bg-green-500/5', border: 'border-green-500/20', text: 'text-green-700' }
                        if (score >= 70) return { bg: 'bg-yellow-500/5', border: 'border-yellow-500/20', text: 'text-yellow-700' }
                        return { bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-700' }
                      }
                      
                      const scoreColors = getScoreColor(overallScoreNum)
                      
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              Die Handelsvolumen-Verteilung bewertet die Marktstruktur durch 3 gewichtete Dimensionen: Marktteilnehmer-Konzentration, Anomalous Spikes und Zeit-Stabilität des Handelsvolumens.
                            </p>
                          </div>
                          {/* Overall Score */}
                          <div className={`mt-6 p-4 ${scoreColors.bg} border ${scoreColors.border} rounded-lg`}>
                            <h4 className={`font-semibold mb-2 ${scoreColors.text}`}>Gesamtscore: {overallScore}%</h4>
                            <p className="text-sm text-muted-foreground">
                              Durchschnitt aller 3 Dimensionen für {selectedStock}
                            </p>
                          </div>

                          {/* Parameter Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-foreground">Detaillierte Parameter-Aufschlüsselung:</h4>
                            
                            {/* Concentration */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">1. Konzentration (S)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="concentration" stock={selectedStock} type="tradingVolume" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.concentration.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.concentration.mainActors} Hauptakteure mit HHI = {params.concentration.hhi.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w1 * 100}% - Dominanter Einfluss auf Marktstruktur
                              </div>
                            </div>

                            {/* Anomalous Spikes */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">2. Anomalous Spikes (A)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="anomalousSpikes" stock={selectedStock} type="tradingVolume" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.anomalousSpikes.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.anomalousSpikes.spikes} Spike-Zeitpunkte von {params.anomalousSpikes.totalDays} Handelstagen ({((params.anomalousSpikes.spikes / params.anomalousSpikes.totalDays) * 100).toFixed(1)}%)
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w2 * 100}% - Erkennung von Marktmanipulation
                              </div>
                            </div>

                            {/* Time Stability */}
                            <div className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">3. Stabilität (T)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="timeStability" stock={selectedStock} type="tradingVolume" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.timeStability.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                σ = {(params.timeStability.stdev * params.timeStability.avgVolume / 1000000).toFixed(1)}M Aktien, μ = {(params.timeStability.avgVolume / 1000000).toFixed(1)}M Aktien (CV = {params.timeStability.stdev.toFixed(2)})
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w3 * 100}% - Vorhersagbarkeit des Handelsvolumens
                              </div>
                            </div>
                          </div>

                          {/* Formula Explanation */}
                          <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                              <h4 className="font-medium text-green-700">Gesamtberechnung</h4>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="p-1 rounded-full hover:bg-muted/50">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-lg">
                                  <div className="space-y-3 p-2">
                                    <div className="font-semibold text-sm text-white">Handelsvolumen-Verteilung Gesamtformel</div>
                                    <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                      <div className="flex items-center justify-center min-h-[60px]">
                                        <BlockMath math="Q_{volume} = w_1 \\cdot S + w_2 \\cdot A + w_3 \\cdot T" />
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-200">
                                      Gewichteter Durchschnitt: w₁=40%, w₂=30%, w₃=30%
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            
                            <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                              <div className="flex items-center justify-center min-h-[60px]">
                                <BlockMath math={`\\text{Aktuell} = ${w1} \\cdot ${params.concentration.value.toFixed(3)} + ${w2} \\cdot ${params.anomalousSpikes.value.toFixed(3)} + ${w3} \\cdot ${params.timeStability.value.toFixed(3)} = ${(overallScoreNum/100).toFixed(3)}`} />
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}

                    {/* Modellunsicherheits-Parameter Details */}
                    {["Epistemische Unsicherheit", "Aleatorische Unsicherheit", "Overfitting-Risiko", "Robustheit", "Erklärungs-Konsistenz"].includes(activeInfoBox || '') && (() => {
                      const uncertaintyParams = getModelUncertaintyParams(selectedStock)
                      const parameterName = activeInfoBox as string
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              {getInfoBoxContent(parameterName).content}
                            </p>
                          </div>
                          
                          {/* Parameter-spezifische Details mit getUncertaintyParameterPopup */}
                          <div className="mt-6">
                            {getUncertaintyParameterPopup(parameterName, selectedStock, uncertaintyParams)}
                          </div>
                        </>
                      )
                    })()}

                    {/* Other metrics placeholder */}
                    {activeInfoBox !== 'fundamentalData' && activeInfoBox !== 'timeSeriesIntegrity' && activeInfoBox !== 'newsReliability' && activeInfoBox !== 'tradingVolume' && !["Epistemische Unsicherheit", "Aleatorische Unsicherheit", "Overfitting-Risiko", "Robustheit", "Erklärungs-Konsistenz"].includes(activeInfoBox || '') && (
                      <>
                        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-2 text-foreground">Berechnungsdetails</h4>
                          <p className="text-sm text-muted-foreground">
                            Hier werden später detaillierte Informationen zur Berechnung dieser Metrik angezeigt.
                          </p>
                        </div>
                        
                        <div className="mt-4 p-4 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
                          <h4 className="font-medium mb-2 text-blue-700">Wichtige Faktoren</h4>
                          <p className="text-sm text-muted-foreground">
                            Diese Sektion wird später mit spezifischen Faktoren befüllt, die diese Metrik beeinflussen.
                          </p>
                        </div>
                        
                        <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                          <h4 className="font-medium mb-2 text-green-700">Interpretation</h4>
                          <p className="text-sm text-muted-foreground">
                            Anleitung zur Interpretation der Werte und deren Auswirkung auf die Gesamteinschätzung.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="pt-4 mt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Detaillierte Berechnungsinformationen für {selectedStock}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}