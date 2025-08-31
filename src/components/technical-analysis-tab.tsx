"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// Dialog components removed as they're no longer used - replaced with Info-Box pattern
import React, { useState } from "react"
import { useTradingUncertainty, TradingUncertaintyData, UncertaintyAnalytics } from "@/hooks/use-trading-uncertainty"
import 'katex/dist/katex.min.css'

// Custom CSS for formula scaling
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

`
import { BlockMath, InlineMath } from 'react-katex'
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

// Updated interface according to ChatGPT Framework specification - NO dummy result values, only input parameters
interface ModelUncertaintyParams {
  // E = 1 - σ_ŷ/(μ_ŷ + ε) - all in decimal format
  epistemicUncertainty: { 
    predictionStdDev: number; // σ_ŷ - standard deviation of predictions (decimal)
    meanPrediction: number;   // μ_ŷ - mean prediction value (decimal, e.g. 0.035 for 3.5%)
    epsilon: number;          // ε - small stabilization value (e.g. 1e-8)
  };
  // A = 1 - (mean prediction variance)/(max expected variance)
  aleatoricUncertainty: { 
    meanPredictionVariance: number; // Average of model's estimated uncertainties
    maxExpectedVariance: number;    // Normalization parameter
    confidenceInterval95: number;   // 95% confidence interval for UI display
  };
  // C = 1 - |L_train - L_test|/(L_train + ε)
  overfittingRisk: { 
    trainLoss: number; // Training loss (unitless decimal)
    testLoss: number;  // Test loss (unitless decimal)
    epsilon: number;   // Small stabilization value
  };
  // R = 1 - Δŷ/ŷ
  robustness: { 
    meanPerturbationChange: number;   // Δŷ - average change after perturbations
    baselinePrediction: number;       // ŷ - original prediction (decimal)
  };
  // X = normalized correlation ρ from [-1,1] to [0,1]
  explanationConsistency: { 
    featureImportanceCorrelation: number; // ρ - Pearson correlation [-1,1]
  };
}

// Model Uncertainty Calculation Functions - ChatGPT Framework
const calculateEpistemicUncertainty = (params: ModelUncertaintyParams['epistemicUncertainty']): number => {
  // E = 1 - σ_ŷ/(μ_ŷ + ε)
  return 1 - (params.predictionStdDev / (params.meanPrediction + params.epsilon));
};

const calculateAleatoricUncertainty = (params: ModelUncertaintyParams['aleatoricUncertainty']): number => {
  // A = 1 - (mean prediction variance)/(max expected variance)
  return 1 - (params.meanPredictionVariance / params.maxExpectedVariance);
};

const calculateOverfittingRisk = (params: ModelUncertaintyParams['overfittingRisk']): number => {
  // C = 1 - |L_train - L_test|/(L_train + ε)
  return 1 - (Math.abs(params.trainLoss - params.testLoss) / (params.trainLoss + params.epsilon));
};

const calculateRobustness = (params: ModelUncertaintyParams['robustness']): number => {
  // R = 1 - Δŷ/ŷ
  return 1 - (params.meanPerturbationChange / params.baselinePrediction);
};

const calculateExplanationConsistency = (params: ModelUncertaintyParams['explanationConsistency']): number => {
  // X = normalized correlation ρ from [-1,1] to [0,1]: X = (ρ + 1)/2
  return (params.featureImportanceCorrelation + 1) / 2;
};

// Combined calculation function for all model uncertainty dimensions
const calculateAllModelUncertainty = (params: ModelUncertaintyParams) => {
  return {
    epistemicUncertainty: calculateEpistemicUncertainty(params.epistemicUncertainty),
    aleatoricUncertainty: calculateAleatoricUncertainty(params.aleatoricUncertainty),
    overfittingRisk: calculateOverfittingRisk(params.overfittingRisk),
    robustness: calculateRobustness(params.robustness),
    explanationConsistency: calculateExplanationConsistency(params.explanationConsistency)
  };
};

// Data Uncertainty Aggregation Functions
const calculateAllNewsReliability = (params: NewsReliabilityParams) => ({
  sourceReliability: params.sourceReliability.averageReliability,
  reputationAccuracy: 1 - (params.reputationAccuracy.falseNews / params.reputationAccuracy.totalNews),
  crossSourceConsensus: params.crossSourceConsensus.confirmedNews / params.crossSourceConsensus.totalNews,
  biasCheck: 1 - (params.biasCheck.biasIndex / params.biasCheck.maxBiasValue)
});

const calculateAllTimeSeries = (params: TimeSeriesIntegrityParams) => ({
  completeness: 1 - (params.completeness.missingTimepoints / params.completeness.expectedTimepoints),
  outlierFreedom: 1 - (params.outlierFreedom.outliers / params.outlierFreedom.totalObservations),
  revisionStability: 1 - (params.revisionStability.revisedValues / params.revisionStability.totalValues),
  continuity: 1 - (params.continuity.gaps / params.continuity.totalIntervals)
});

const calculateAllTradingVolume = (params: TradingVolumeParams) => ({
  concentration: 1 - (params.concentration.topTradersVolume / params.concentration.totalVolume),
  anomalousSpikes: 1 - (params.anomalousSpikes.spikes / params.anomalousSpikes.totalTradingDays),
  timeStability: 1 - (params.timeStability.varianceCoefficient / params.timeStability.maxVarianceCoefficient)
});

// Human Uncertainty Calculation Functions
const calculatePerceivedUncertainty = (params: HumanUncertaintyParams['perceivedUncertainty']): number => {
  // P = (likert_response - 1) / (max_scale - 1)
  return (params.likertResponse - 1) / (params.maxScale - 1);
};

const calculateHumanEpistemicUncertainty = (params: HumanUncertaintyParams['epistemicUncertainty']): number => {
  // E_human = unclear_answers / total_questions
  return params.unclearAnswers / params.totalQuestions;
};

const calculateHumanAleatoricUncertainty = (params: HumanUncertaintyParams['aleatoricUncertainty']): number => {
  // A_human = 1 - (consistency_score / max_possible_consistency)
  return 1 - (params.consistencyScore / params.maxPossibleConsistency);
};

const calculateHumanDecisionStability = (params: HumanUncertaintyParams['decisionStability']): number => {
  // S_human = max(0, 1 - (decision_change / input_change))
  // For uncertainty calculation, we use (1 - S_human) to represent instability
  if (params.inputChange === 0) return 0; // Handle division by zero
  const stability = Math.max(0, 1 - (params.decisionChange / params.inputChange));
  return 1 - stability; // Return instability for uncertainty measure
};

export const calculateAllHumanUncertainty = (params: HumanUncertaintyParams): HumanUncertaintyCalculated => ({
  perceivedUncertainty: calculatePerceivedUncertainty(params.perceivedUncertainty),
  epistemicUncertainty: calculateHumanEpistemicUncertainty(params.epistemicUncertainty),
  aleatoricUncertainty: calculateHumanAleatoricUncertainty(params.aleatoricUncertainty),
  decisionStability: calculateHumanDecisionStability(params.decisionStability)
});

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
  // Calculate all values first using the calculation functions
  const calculatedValues = calculateAllModelUncertainty(uncertaintyParams);
  
  switch (parameterName) {
    case "Epistemische Unsicherheit":
      return (1 - calculatedValues.epistemicUncertainty) * 100;
    case "Aleatorische Unsicherheit":
      return (1 - calculatedValues.aleatoricUncertainty) * 100;
    case "Overfitting-Risiko":
      return (1 - calculatedValues.overfittingRisk) * 100;
    case "Robustheit":
      return (1 - calculatedValues.robustness) * 100;
    case "Erklärungs-Konsistenz":
      return (1 - calculatedValues.explanationConsistency) * 100;
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
  
  // Calculate weighted averages for each dimension using calculation functions
  const fundamentalCalculated = calculateAllFundamentalData(fundamentalParams);
  const fundamentalScore = Math.round((0.2 * fundamentalCalculated.completeness + 
                                      0.2 * fundamentalCalculated.timeliness + 
                                      0.2 * fundamentalCalculated.consistency + 
                                      0.2 * fundamentalCalculated.accuracy + 
                                      0.2 * fundamentalCalculated.stability) * 100)
  
  const newsCalculated = calculateAllNewsReliability(newsParams);
  const newsScore = Math.round((0.3 * newsCalculated.sourceReliability + 
                               0.3 * newsCalculated.reputationAccuracy + 
                               0.25 * newsCalculated.crossSourceConsensus + 
                               0.15 * newsCalculated.biasCheck) * 100)
  
  const timeSeriesCalculated = calculateAllTimeSeries(timeSeriesParams);
  const timeSeriesScore = Math.round((0.25 * timeSeriesCalculated.completeness + 
                                     0.25 * timeSeriesCalculated.outlierFreedom + 
                                     0.25 * timeSeriesCalculated.revisionStability + 
                                     0.25 * timeSeriesCalculated.continuity) * 100)
  
  const tradingVolumeCalculated = calculateAllTradingVolume(tradingVolumeParams);
  const tradingVolumeScore = Math.round((0.4 * tradingVolumeCalculated.concentration + 
                                        0.3 * tradingVolumeCalculated.anomalousSpikes + 
                                        0.3 * tradingVolumeCalculated.timeStability) * 100)
  
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
      predictionInterval: `±${uncertaintyParams.aleatoricUncertainty.confidenceInterval95.toFixed(1)}% (95% Konfidenz)`,
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

// Human Uncertainty Status Mapping (inverted: lower uncertainty = better status)
const getHumanUncertaintyStatus = (uncertaintyPercentage: number): string => {
  if (uncertaintyPercentage <= 20) return "excellent"
  if (uncertaintyPercentage <= 40) return "good"  
  if (uncertaintyPercentage <= 60) return "fair"
  return "poor"
}

// Model Uncertainty Status Mapping (inverted: lower uncertainty = better status)
const getModelUncertaintyStatus = (uncertaintyPercentage: number): string => {
  if (uncertaintyPercentage <= 20) return "excellent"  // 80-100% Sicherheit
  if (uncertaintyPercentage <= 40) return "good"       // 60-80% Sicherheit  
  if (uncertaintyPercentage <= 60) return "fair"       // 40-60% Sicherheit
  return "poor"                                         // <40% Sicherheit
}

// Data Uncertainty Interface Definitions
interface FundamentalDataParams {
  completeness: { missingValues: number; totalValues: number };
  timeliness: { daysOld: number; maxAcceptableDays: number };
  consistency: { inconsistentEntries: number; totalEntries: number };
  accuracy: { accurateReports: number; totalReports: number };
  stability: { revisions: number; totalDataPoints: number };
}

interface NewsReliabilityParams {
  sourceReliability: { totalSources: number; averageReliability: number };
  reputationAccuracy: { totalNews: number; falseNews: number };
  crossSourceConsensus: { totalNews: number; confirmedNews: number };
  biasCheck: { biasIndex: number; maxBiasValue: number };
}

interface TimeSeriesIntegrityParams {
  completeness: { missingTimepoints: number; expectedTimepoints: number };
  outlierFreedom: { outliers: number; totalObservations: number };
  revisionStability: { revisedValues: number; totalValues: number };
  continuity: { gaps: number; totalIntervals: number };
}

interface TradingVolumeParams {
  concentration: { topTradersVolume: number; totalVolume: number };
  anomalousSpikes: { spikes: number; totalTradingDays: number };
  timeStability: { varianceCoefficient: number; maxVarianceCoefficient: number };
}

interface HumanUncertaintyParams {
  perceivedUncertainty: { 
    likertResponse: number; // 1-5 Likert scale
    maxScale: 5;
  };
  epistemicUncertainty: { 
    unclearAnswers: number; // Number of "unclear"/"don't know" responses
    totalQuestions: number; // Total questions asked
  };
  aleatoricUncertainty: { 
    consistencyScore: number; // Consistency score on similar questions
    maxPossibleConsistency: number; // Maximum possible consistency score
  };
  decisionStability: { 
    decisionChange: number; // Magnitude of decision change (0-1)
    inputChange: number; // Magnitude of input change that caused it (0-1)
  };
}

interface HumanUncertaintyCalculated {
  perceivedUncertainty: number;
  epistemicUncertainty: number;
  aleatoricUncertainty: number;
  decisionStability: number;
}

// Data Uncertainty Calculation Functions
const calculateFundamentalCompleteness = (params: FundamentalDataParams['completeness']): number => {
  // C = 1 - (missing values / total values)
  return 1 - (params.missingValues / params.totalValues);
};

const calculateFundamentalTimeliness = (params: FundamentalDataParams['timeliness']): number => {
  // T = max(0, 1 - days_old/max_acceptable_days)
  return Math.max(0, 1 - (params.daysOld / params.maxAcceptableDays));
};

const calculateFundamentalConsistency = (params: FundamentalDataParams['consistency']): number => {
  // K = 1 - (inconsistent entries / total entries)
  return 1 - (params.inconsistentEntries / params.totalEntries);
};

const calculateFundamentalAccuracy = (params: FundamentalDataParams['accuracy']): number => {
  // A = accurate reports / total reports
  return params.accurateReports / params.totalReports;
};

const calculateFundamentalStability = (params: FundamentalDataParams['stability']): number => {
  // S = 1 - (revisions / total data points)
  return 1 - (params.revisions / params.totalDataPoints);
};

// Combined calculation function for all fundamental data dimensions
const calculateAllFundamentalData = (params: FundamentalDataParams) => {
  return {
    completeness: calculateFundamentalCompleteness(params.completeness),
    timeliness: calculateFundamentalTimeliness(params.timeliness),
    consistency: calculateFundamentalConsistency(params.consistency),
    accuracy: calculateFundamentalAccuracy(params.accuracy),
    stability: calculateFundamentalStability(params.stability)
  };
};

export const getFundamentalDataParams = (stock?: string): FundamentalDataParams => {
  // Stock-specific fundamental data parameters for diversified uncertainty patterns
  const params: Record<string, FundamentalDataParams> = {
    // HIGH DATA UNCERTAINTY - Poor fundamental data quality
    TSLA: { // Data uncertainty dominant
      completeness: { missingValues: 8, totalValues: 25 }, // More missing data
      timeliness: { daysOld: 4, maxAcceptableDays: 7 }, // Older data
      consistency: { inconsistentEntries: 5, totalEntries: 25 }, // Less consistent  
      accuracy: { accurateReports: 18, totalReports: 25 }, // Lower accuracy
      stability: { revisions: 4, totalDataPoints: 25 } // More revisions
    },
    NVDA: { // Data uncertainty dominant
      completeness: { missingValues: 7, totalValues: 25 },
      timeliness: { daysOld: 3, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 4, totalEntries: 25 },
      accuracy: { accurateReports: 19, totalReports: 25 },
      stability: { revisions: 3, totalDataPoints: 25 }
    },
    META: { // Model uncertainty dominant, decent data
      completeness: { missingValues: 3, totalValues: 25 },
      timeliness: { daysOld: 2, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 2, totalEntries: 25 },
      accuracy: { accurateReports: 22, totalReports: 25 },
      stability: { revisions: 2, totalDataPoints: 25 }
    },
    AAPL: { // Model uncertainty dominant, decent data
      completeness: { missingValues: 2, totalValues: 25 },
      timeliness: { daysOld: 1, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 1, totalEntries: 25 },
      accuracy: { accurateReports: 23, totalReports: 25 },
      stability: { revisions: 1, totalDataPoints: 25 }
    },
    // MEDIUM UNCERTAINTY - Mixed data quality
    MSFT: { // Human uncertainty dominant, good data
      completeness: { missingValues: 1, totalValues: 25 },
      timeliness: { daysOld: 1, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 1, totalEntries: 25 },
      accuracy: { accurateReports: 24, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    },
    GOOGL: { // Human uncertainty dominant, good data
      completeness: { missingValues: 1, totalValues: 25 },
      timeliness: { daysOld: 1, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 1, totalEntries: 25 },
      accuracy: { accurateReports: 24, totalReports: 25 },
      stability: { revisions: 1, totalDataPoints: 25 }
    },
    AMZN: { // Model uncertainty dominant, average data
      completeness: { missingValues: 4, totalValues: 25 },
      timeliness: { daysOld: 2, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 3, totalEntries: 25 },
      accuracy: { accurateReports: 21, totalReports: 25 },
      stability: { revisions: 2, totalDataPoints: 25 }
    },
    HD: { // Balanced uncertainty, good data
      completeness: { missingValues: 1, totalValues: 25 },
      timeliness: { daysOld: 1, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 1, totalEntries: 25 },
      accuracy: { accurateReports: 23, totalReports: 25 },
      stability: { revisions: 1, totalDataPoints: 25 }
    },
    JPM: { // Balanced uncertainty, excellent financial reporting
      completeness: { missingValues: 0, totalValues: 25 },
      timeliness: { daysOld: 0, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 0, totalEntries: 25 },
      accuracy: { accurateReports: 25, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    },
    // LOW UNCERTAINTY - Excellent data quality
    JNJ: { // Balanced low uncertainty, pharmaceutical compliance
      completeness: { missingValues: 0, totalValues: 25 },
      timeliness: { daysOld: 0, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 0, totalEntries: 25 },
      accuracy: { accurateReports: 25, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    },
    PG: { // Balanced low uncertainty, consumer goods stability
      completeness: { missingValues: 0, totalValues: 25 },
      timeliness: { daysOld: 0, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 0, totalEntries: 25 },
      accuracy: { accurateReports: 25, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    },
    KO: { // Balanced low uncertainty, established company
      completeness: { missingValues: 0, totalValues: 25 },
      timeliness: { daysOld: 0, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 0, totalEntries: 25 },
      accuracy: { accurateReports: 25, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    },
    UNH: { // Balanced low uncertainty, healthcare regulations
      completeness: { missingValues: 0, totalValues: 25 },
      timeliness: { daysOld: 0, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 0, totalEntries: 25 },
      accuracy: { accurateReports: 25, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    },
    V: { // Balanced low uncertainty, financial services
      completeness: { missingValues: 0, totalValues: 25 },
      timeliness: { daysOld: 0, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 0, totalEntries: 25 },
      accuracy: { accurateReports: 25, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    },
    MA: { // Balanced low uncertainty, financial services
      completeness: { missingValues: 0, totalValues: 25 },
      timeliness: { daysOld: 0, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 0, totalEntries: 25 },
      accuracy: { accurateReports: 25, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    }
  };
  
  const defaultParams = {
    completeness: { missingValues: 2, totalValues: 25 },
    timeliness: { daysOld: 1, maxAcceptableDays: 7 },
    consistency: { inconsistentEntries: 1, totalEntries: 25 },
    accuracy: { accurateReports: 23, totalReports: 25 },
    stability: { revisions: 1, totalDataPoints: 25 }
  };
  
  return stock ? (params[stock] || defaultParams) : defaultParams;
}

// FormulaTooltip component removed to fix build issues

// Function to render parameter names with KaTeX symbols
const renderParameterName = (paramName: string): React.ReactNode => {
  const symbolMap: Record<string, { text: string; symbol: string }> = {
    "Standardabweichung (σ_ŷ)": { text: "Standardabweichung", symbol: "\\sigma_{\\hat{y}}" },
    "Mittlere Vorhersage (μ_ŷ)": { text: "Mittlere Vorhersage", symbol: "\\mu_{\\hat{y}}" },
    "Mittlere Perturbation (Δŷ)": { text: "Mittlere Perturbation", symbol: "\\Delta\\hat{y}" },
    "Baseline-Vorhersage (ŷ)": { text: "Baseline-Vorhersage", symbol: "\\hat{y}" },
    "Feature-Korrelation (ρ)": { text: "Feature-Korrelation", symbol: "\\rho" },
    "Trainingsfehler (L_train)": { text: "Trainingsfehler", symbol: "L_{train}" },
    "Testfehler (L_test)": { text: "Testfehler", symbol: "L_{test}" },
    "Epistemische Unsicherheit (E)": { text: "Epistemische Unsicherheit", symbol: "E" },
    "Aleatorische Unsicherheit (A)": { text: "Aleatorische Unsicherheit", symbol: "A" },
    "Overfitting-Score (C)": { text: "Overfitting-Score", symbol: "C" },
    "Robustheit (R)": { text: "Robustheit", symbol: "R" },
    "Erklärungs-Konsistenz (X)": { text: "Erklärungs-Konsistenz", symbol: "X" }
  }

  const mapping = symbolMap[paramName]
  if (mapping) {
    return (
      <span>
        {mapping.text} (<InlineMath math={mapping.symbol} />)
      </span>
    )
  }
  
  // Fallback for parameters without symbols
  return paramName
}

// Function to get real values calculation formulas - updated for ChatGPT Framework
const getCalculationWithRealValues = (parameterName: string, rawData: Record<string, string | number>) => {
  switch (parameterName) {
    case "Epistemische Unsicherheit":
      // E = 1 - σ_ŷ/(μ_ŷ + ε) - get σ, μ, final score from rawData
      const sigma = Object.values(rawData)[0];    // σ_ŷ (Standardabweichung)
      const mu = Object.values(rawData)[1];       // μ_ŷ (mittlere Vorhersage)
      const epsilonVal = "0.00001";
      const finalScore = Object.values(rawData)[2]; // E (Epistemische Unsicherheit Score)
      
      // Konvertiere "2.1%" zu "0.021" für saubere LaTeX-Darstellung
      const muNumeric = typeof mu === 'string' && mu.includes('%') ? 
        (parseFloat(mu.replace('%', '')) / 100).toFixed(4) : mu;
      
      return `\\text{Aktuell} = 1 - \\frac{${sigma}}{${muNumeric} + ${epsilonVal}} = ${finalScore}`;
    
    case "Aleatorische Unsicherheit":
      // A = 1 - (mittlere Varianz)/(max. erwartete Varianz)
      const meanVar = Object.values(rawData)[0];     // Mittlere Vorhersagevarianz
      const maxVar = Object.values(rawData)[1];      // Maximale erwartete Varianz  
      const aleatoricScore = Object.values(rawData)[2]; // A Score
      return `\\text{Aktuell} = 1 - \\frac{${meanVar}}{${maxVar}} = ${aleatoricScore}`;
    
    case "Overfitting-Risiko":
      // C = 1 - |L_train - L_test|/(L_train + ε)
      const lTrain = Object.values(rawData)[0];
      const lTest = Object.values(rawData)[1];
      const overfittingScore = Object.values(rawData)[2];
      return `\\text{Aktuell} = 1 - \\frac{|${lTrain} - ${lTest}|}{${lTrain} + 0.001} = ${overfittingScore}`;
    
    case "Robustheit":
      // R = 1 - Δŷ/ŷ
      const deltaY = Object.values(rawData)[0];      // Δŷ (mittlere Änderung)
      const baselineY = Object.values(rawData)[1];   // ŷ (Baseline-Vorhersage)
      const robustnessScore = Object.values(rawData)[2];
      
      // Konvertiere "2.1%" zu "0.021" für saubere LaTeX-Darstellung
      const baselineYNumeric = typeof baselineY === 'string' && baselineY.includes('%') ? 
        (parseFloat(baselineY.replace('%', '')) / 100).toFixed(4) : baselineY;
      
      return `\\text{Aktuell} = 1 - \\frac{${deltaY}}{${baselineYNumeric}} = ${robustnessScore}`;
    
    case "Erklärungs-Konsistenz":
      // X = normalized ρ from [-1,1] to [0,1]: X = (ρ + 1)/2
      const rho = Object.values(rawData)[0];         // ρ (Korrelation)
      const consistencyScore = Object.values(rawData)[1]; // X Score (normalisiert)
      return `\\text{Aktuell} = \\frac{${rho} + 1}{2} = ${consistencyScore}`;
    
    default:
      return "Formel nicht verfügbar";
  }
}

// Function to get specific parameter explanations for hover tooltips
const getParameterExplanation = (parameterName: string, dimensionName: string): string => {
  const explanations: Record<string, Record<string, string>> = {
    "Epistemische Unsicherheit": {
      "Standardabweichung (σ_ŷ)": "Misst wie stark die Vorhersagen des Modells schwanken. Niedrige Werte bedeuten konsistentere Vorhersagen.",
      "Mittlere Vorhersage (μ_ŷ)": "Der durchschnittliche Kurs-Vorhersagewert des Modells für diese Aktie in Dezimalform (z.B. 0.021 = 2.1%).",
      "Epistemische Unsicherheit (E)": "Wie sicher sich das Modell bei seinen Vorhersagen ist. Höhere Werte = geringere Modell-Unsicherheit."
    },
    "Aleatorische Unsicherheit": {
      "Mittlere Vorhersagevarianz": "Die durchschnittliche Unsicherheit, die das Modell selbst schätzt. Spiegelt die natürliche Marktvolatilität wider.",
      "Max. erwartete Varianz": "Normierungsparameter - die maximale Schwankungsbreite, die aufgrund von Marktvolatilität erwartet wird.",
      "Aleatorische Unsicherheit (A)": "Unvermeidbare Unsicherheit durch natürliche Marktvolatilität. Höhere Werte = vorhersagbarerer Markt."
    },
    "Overfitting-Risiko": {
      "Trainingsfehler (L_train)": "Wie gut das Modell auf den Trainingsdaten performt. Sehr niedrige Werte können auf Überanpassung hindeuten.",
      "Testfehler (L_test)": "Wie gut das Modell auf neuen, ungesehenen Daten performt. Wichtiger als der Trainingsfehler.",
      "Overfitting-Score (C)": "Generalisierungsfähigkeit des Modells. Höhere Werte = bessere Übertragbarkeit auf neue Daten."
    },
    "Robustheit": {
      "Mittlere Perturbation (Δŷ)": "Durchschnittliche Änderung der Vorhersage nach kleinen Eingabe-Störungen. Niedrige Werte = robusteres Modell.",
      "Baseline-Vorhersage (ŷ)": "Die ursprüngliche Vorhersage des Modells ohne Störungen. Referenzwert für Stabilitätsmessungen.",
      "Robustheit (R)": "Wie konstant die Modellergebnisse bei ähnlichen Eingaben sind. Höhere Werte = stabileres Modell."
    },
    "Erklärungs-Konsistenz": {
      "Feature-Korrelation (ρ)": "Pearson-Korrelation zwischen Feature-Wichtigkeiten verschiedener Trainingsläufe. Werte zwischen -1 und +1.",
      "Erklärungs-Konsistenz (X)": "Normalisierte Interpretierbarkeit des Modells. Höhere Werte = nachvollziehbarere und konsistentere Entscheidungen.",
      "Interpretierbarkeit": "Qualitative Bewertung wie gut die Modellentscheidungen verstanden werden können (Hoch/Mittel/Niedrig)."
    }
  }
  
  return explanations[dimensionName]?.[parameterName] || "Erklärung für diesen Parameter ist noch nicht verfügbar."
}

// Info Box Content Function
const getInfoBoxContent = (parameterName: string | null) => {
  if (!parameterName) return { title: "Information", content: "Keine Informationen verfügbar." };
  
  const infoContent: Record<string, { title: string; content: string }> = {
    // Data Uncertainty Dimensions
    "fundamentalData": {
      title: "Analyse der Fundamentaldaten",
      content: "Bewertung der Qualität und Verlässlichkeit von Unternehmens-Fundamentaldaten."
    },
    "timeSeriesIntegrity": {
      title: "Analyse der Zeitreihen-Integrität",
      content: "Bewertung der Qualität und Konsistenz von Zeitreihendaten."
    },
    "newsReliability": {
      title: "Analyse der Nachrichten-Verlässlichkeit",
      content: "Bewertung der Qualität und Verlässlichkeit von Nachrichtenquellen."
    },
    "tradingVolume": {
      title: "Analyse der Handelsvolumen-Verteilung",
      content: "Bewertung der Marktstruktur und Handelsvolumen-Charakteristika."
    },
    // Model Uncertainty Dimensions
    "Epistemische Unsicherheit": {
      title: "Analyse der epistemischen Unsicherheit",
      content: "Epistemische Unsicherheit entsteht durch begrenzte Trainingsdaten und Modellkomplexität. Sie kann durch mehr Daten reduziert werden und zeigt, wie sicher sich das Modell bei seinen Vorhersagen ist."
    },
    "Aleatorische Unsicherheit": {
      title: "Analyse der aleatorischen Unsicherheit", 
      content: "Aleatorische Unsicherheit stammt aus der inhärenten Zufälligkeit der Finanzmärkte. Sie ist irreduzibel und spiegelt die natürliche Volatilität der Aktienkurse wider."
    },
    "Overfitting-Risiko": {
      title: "Analyse des Overfitting-Risikos",
      content: "Overfitting-Risiko misst, wie gut das Modell auf neue, ungesehene Daten generalisiert. Hohe Werte deuten auf Überanpassung an Trainingsdaten hin."
    },
    "Robustheit": {
      title: "Analyse der Robustheit",
      content: "Robustheit misst, wie empfindlich das Modell auf kleine Änderungen in den Eingabedaten reagiert. Instabile Modelle ändern Empfehlungen bei minimalen Preisänderungen."
    },
    "Erklärungs-Konsistenz": {
      title: "Analyse der Erklärungs-Konsistenz",
      content: "Selbst bei gleichen Eingaben können verschiedene Trainingsläufe unterschiedliche Erklärungen liefern ('warum' es eine Empfehlung gibt). Wichtig für Vertrauen und Nachvollziehbarkeit."
    }
  };
  
  return infoContent[parameterName] || { title: "Information", content: "Keine Informationen verfügbar." };
}

// Function to create pop-up content for uncertainty parameters
const getUncertaintyParameterPopup = (parameterName: string, selectedStock: string, uncertaintyParams: ModelUncertaintyParams) => {
  // Calculate all uncertainty values using the new calculation functions
  const calculatedValues = calculateAllModelUncertainty(uncertaintyParams);
  
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
      currentValue: calculatedValues.epistemicUncertainty,
      rawData: {
        "Standardabweichung (σ_ŷ)": uncertaintyParams.epistemicUncertainty.predictionStdDev.toFixed(4),
        "Mittlere Vorhersage (μ_ŷ)": (uncertaintyParams.epistemicUncertainty.meanPrediction * 100).toFixed(1) + "%",
        "Epistemische Unsicherheit (E)": (calculatedValues.epistemicUncertainty * 100).toFixed(1) + "%"
      }
    },
    "Aleatorische Unsicherheit": {
      title: "Aleatorische Unsicherheit", 
      icon: <Activity className="h-6 w-6 text-blue-600" />,
      description: "Natürliche Zufälligkeit im Markt, die selbst das beste Modell nicht erklären kann (z.B. plötzliche News, Messrauschen).",
      importance: "Unvermeidbare Unsicherheit durch Markt-Volatilität. Kann durch bessere Modelle nicht reduziert werden, nur quantifiziert.",
      formula: "A = 1 - \\frac{\\sigma_{pred}^2}{\\sigma_{max}^2}",
      currentValue: calculatedValues.aleatoricUncertainty,
      rawData: {
        "Mittlere Vorhersagevarianz": uncertaintyParams.aleatoricUncertainty.meanPredictionVariance.toFixed(4),
        "Max. erwartete Varianz": uncertaintyParams.aleatoricUncertainty.maxExpectedVariance.toFixed(4),
        "Aleatorische Unsicherheit (A)": (calculatedValues.aleatoricUncertainty * 100).toFixed(1) + "%"
      }
    },
    "Overfitting-Risiko": {
      title: "Overfitting-Risiko",
      icon: <AlertCircle className="h-6 w-6 text-orange-600" />,
      description: "Wenn ein Modell zu komplex ist, 'merkt' es sich Trainingsdaten, anstatt Muster zu lernen. Im Test auf neuen Daten wird es viel schlechter.",
      importance: "Kritisch für die Generalisierungsfähigkeit. Hohes Overfitting bedeutet schlechte Performance auf neuen Marktdaten.",
      formula: "C = 1 - \\frac{|L_{train} - L_{test}|}{L_{train} + \\epsilon}",
      currentValue: calculatedValues.overfittingRisk,
      rawData: {
        "Trainingsfehler (L_train)": uncertaintyParams.overfittingRisk.trainLoss.toFixed(3),
        "Testfehler (L_test)": uncertaintyParams.overfittingRisk.testLoss.toFixed(3),
        "Overfitting-Score (C)": (calculatedValues.overfittingRisk * 100).toFixed(1) + "%"
      }
    },
    "Robustheit": {
      title: "Robustheit/Stabilität",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: "Misst, wie empfindlich das Modell auf kleine Änderungen in den Eingabedaten reagiert. Instabile Modelle ändern Empfehlungen bei minimalen Preisänderungen.",
      importance: "Entscheidend für verlässliche Trading-Entscheidungen. Robuste Modelle geben konsistente Empfehlungen bei ähnlichen Marktbedingungen.",
      formula: "R = 1 - \\frac{\\Delta\\hat{y}}{\\hat{y}}",
      currentValue: calculatedValues.robustness,
      rawData: {
        "Mittlere Perturbation (Δŷ)": uncertaintyParams.robustness.meanPerturbationChange.toFixed(4),
        "Baseline-Vorhersage (ŷ)": (uncertaintyParams.robustness.baselinePrediction * 100).toFixed(1) + "%",
        "Robustheit (R)": (calculatedValues.robustness * 100).toFixed(1) + "%"
      }
    },
    "Erklärungs-Konsistenz": {
      title: "Erklärungs-Konsistenz",
      icon: <BarChart3 className="h-6 w-6 text-indigo-600" />,
      description: "Selbst bei gleichen Eingaben können verschiedene Trainingsläufe unterschiedliche Erklärungen liefern ('warum' es eine Empfehlung gibt).",
      importance: "Wichtig für Vertrauen und Nachvollziehbarkeit. Inkonsistente Erklärungen deuten auf instabile Feature-Wichtigkeiten hin.",
      formula: "X = \\frac{\\rho + 1}{2}",
      currentValue: calculatedValues.explanationConsistency,
      rawData: {
        "Feature-Korrelation (ρ)": uncertaintyParams.explanationConsistency.featureImportanceCorrelation.toFixed(3),
        "Erklärungs-Konsistenz (X)": (calculatedValues.explanationConsistency * 100).toFixed(1) + "%",
        "Interpretierbarkeit": calculatedValues.explanationConsistency > 0.8 ? "Hoch" : calculatedValues.explanationConsistency > 0.6 ? "Mittel" : "Niedrig"
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
                  <p className="text-xs text-white leading-relaxed">
                    {param.description}
                  </p>
                  <p className="text-xs text-white leading-relaxed">
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

      {/* Overall Score - matching Data Uncertainty structure */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold mb-2 text-primary">Gesamtscore: {(param.currentValue * 100).toFixed(1)}%</h4>
        <p className="text-sm text-muted-foreground">
          Bewertung für {selectedStock}
        </p>
      </div>
      
      <div className="space-y-6 py-6">
        
        {/* Parameter-Aufschlüsselung */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Detaillierte Parameter-Aufschlüsselung:</h4>
          
          {Object.entries(param.rawData)
            .filter(([key]) => !key.includes('Unsicherheit (E)') && 
                               !key.includes('Unsicherheit (A)') && 
                               !key.includes('Score (C)') && 
                               !key.includes('Robustheit (R)') && 
                               !key.includes('Konsistenz (X)'))
            .map(([key, value], index) => (
            <div key={key} className="p-3 bg-gradient-to-r from-card via-card to-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{index + 1}. {renderParameterName(key)}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-muted/50 transition-colors">
                        <Info className="h-3 w-3 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <div className="p-2">
                        <p className="text-xs text-white leading-relaxed">
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
        
        {/* Gesamtberechnung - einheitliche grüne Box wie bei Datenunsicherheit */}
        <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-medium text-green-700">Gesamtberechnung</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-muted/50">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-lg">
                  <div className="space-y-3 p-2">
                    <div className="font-semibold text-sm text-white">{param.title} Gesamtformel</div>
                    <div className="formula-container bg-muted/30 p-2 rounded">
                      <div className="flex items-center justify-center min-h-[50px]">
                        <BlockMath math={param.formula} />
                      </div>
                    </div>
                    <div className="text-xs text-white">
                      {parameterName === "Epistemische Unsicherheit" && "Misst Unsicherheit über das Modellwissen selbst"}
                      {parameterName === "Aleatorische Unsicherheit" && "Misst natürliche Marktvolatilität und Zufälligkeit"}
                      {parameterName === "Overfitting-Risiko" && "Misst Generalisierungsfähigkeit auf neue Daten"}
                      {parameterName === "Robustheit" && "Misst Stabilität gegen kleine Eingabeänderungen"}
                      {parameterName === "Erklärungs-Konsistenz" && "Misst Konsistenz der Modellerklärungen"}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="formula-container bg-muted/30 p-2 rounded text-xs">
            <div className="flex items-center justify-center min-h-[40px]">
              <BlockMath math={getCalculationWithRealValues(parameterName, param.rawData)} />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export const getModelUncertaintyParams = (stock: string): ModelUncertaintyParams => {
  const params: Record<string, ModelUncertaintyParams> = {
    // HIGH UNCERTAINTY STOCKS (55-80%) - Model uncertainty dominant
    AAPL: {
      epistemicUncertainty: { 
        predictionStdDev: 0.008,
        meanPrediction: 0.021,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.0015,
        maxExpectedVariance: 0.005,
        confidenceInterval95: 1.8
      },
      overfittingRisk: { 
        trainLoss: 0.05,
        testLoss: 0.07,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.003,
        baselinePrediction: 0.021
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.89
      }
    },
    TSLA: { // High uncertainty, data uncertainty dominant
      epistemicUncertainty: { 
        predictionStdDev: 0.022,
        meanPrediction: 0.045,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.008,
        maxExpectedVariance: 0.012,
        confidenceInterval95: 4.2
      },
      overfittingRisk: { 
        trainLoss: 0.095,
        testLoss: 0.125,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.012,
        baselinePrediction: 0.045
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.65
      }
    },
    META: { // High uncertainty, model uncertainty dominant
      epistemicUncertainty: { 
        predictionStdDev: 0.018,
        meanPrediction: 0.032,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.009,
        maxExpectedVariance: 0.014,
        confidenceInterval95: 3.8
      },
      overfittingRisk: { 
        trainLoss: 0.08,
        testLoss: 0.115,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.015,
        baselinePrediction: 0.032
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.58
      }
    },
    NVDA: { // High uncertainty, data uncertainty dominant
      epistemicUncertainty: { 
        predictionStdDev: 0.025,
        meanPrediction: 0.038,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.011,
        maxExpectedVariance: 0.016,
        confidenceInterval95: 5.1
      },
      overfittingRisk: { 
        trainLoss: 0.092,
        testLoss: 0.135,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.019,
        baselinePrediction: 0.038
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.62
      }
    },
    // MEDIUM UNCERTAINTY STOCKS (40-50%)
    MSFT: { // Medium uncertainty, human uncertainty dominant
      epistemicUncertainty: { 
        predictionStdDev: 0.006,
        meanPrediction: 0.028,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.003,
        maxExpectedVariance: 0.008,
        confidenceInterval95: 2.1
      },
      overfittingRisk: { 
        trainLoss: 0.042,
        testLoss: 0.055,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.005,
        baselinePrediction: 0.028
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.82
      }
    },
    GOOGL: { // Medium uncertainty, human uncertainty dominant
      epistemicUncertainty: { 
        predictionStdDev: 0.007,
        meanPrediction: 0.026,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.0035,
        maxExpectedVariance: 0.009,
        confidenceInterval95: 2.3
      },
      overfittingRisk: { 
        trainLoss: 0.038,
        testLoss: 0.052,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.006,
        baselinePrediction: 0.026
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.78
      }
    },
    AMZN: { // Medium uncertainty, model uncertainty dominant
      epistemicUncertainty: { 
        predictionStdDev: 0.011,
        meanPrediction: 0.033,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.005,
        maxExpectedVariance: 0.011,
        confidenceInterval95: 2.8
      },
      overfittingRisk: { 
        trainLoss: 0.055,
        testLoss: 0.078,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.009,
        baselinePrediction: 0.033
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.71
      }
    },
    HD: { // Medium uncertainty, balanced
      epistemicUncertainty: { 
        predictionStdDev: 0.005,
        meanPrediction: 0.022,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.002,
        maxExpectedVariance: 0.006,
        confidenceInterval95: 1.9
      },
      overfittingRisk: { 
        trainLoss: 0.035,
        testLoss: 0.048,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.004,
        baselinePrediction: 0.022
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.85
      }
    },
    JPM: { // Medium uncertainty, balanced
      epistemicUncertainty: { 
        predictionStdDev: 0.0045,
        meanPrediction: 0.024,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.0025,
        maxExpectedVariance: 0.007,
        confidenceInterval95: 2.0
      },
      overfittingRisk: { 
        trainLoss: 0.032,
        testLoss: 0.045,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.0035,
        baselinePrediction: 0.024
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.87
      }
    },
    // LOW UNCERTAINTY STOCKS (15-35%) - Balanced/stable
    JNJ: { // Low uncertainty, balanced distribution
      epistemicUncertainty: { 
        predictionStdDev: 0.003,
        meanPrediction: 0.018,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.001,
        maxExpectedVariance: 0.004,
        confidenceInterval95: 1.2
      },
      overfittingRisk: { 
        trainLoss: 0.022,
        testLoss: 0.028,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.002,
        baselinePrediction: 0.018
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.92
      }
    },
    PG: { // Low uncertainty, balanced distribution
      epistemicUncertainty: { 
        predictionStdDev: 0.0025,
        meanPrediction: 0.016,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.0008,
        maxExpectedVariance: 0.0035,
        confidenceInterval95: 1.1
      },
      overfittingRisk: { 
        trainLoss: 0.019,
        testLoss: 0.025,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.0018,
        baselinePrediction: 0.016
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.94
      }
    },
    KO: { // Low uncertainty, balanced distribution
      epistemicUncertainty: { 
        predictionStdDev: 0.0022,
        meanPrediction: 0.015,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.0007,
        maxExpectedVariance: 0.003,
        confidenceInterval95: 1.0
      },
      overfittingRisk: { 
        trainLoss: 0.018,
        testLoss: 0.023,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.0015,
        baselinePrediction: 0.015
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.95
      }
    },
    UNH: { // Low uncertainty, balanced distribution
      epistemicUncertainty: { 
        predictionStdDev: 0.0032,
        meanPrediction: 0.019,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.0012,
        maxExpectedVariance: 0.0042,
        confidenceInterval95: 1.3
      },
      overfittingRisk: { 
        trainLoss: 0.024,
        testLoss: 0.031,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.0022,
        baselinePrediction: 0.019
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.91
      }
    },
    V: { // Low uncertainty, balanced distribution  
      epistemicUncertainty: { 
        predictionStdDev: 0.0028,
        meanPrediction: 0.017,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.0009,
        maxExpectedVariance: 0.0038,
        confidenceInterval95: 1.15
      },
      overfittingRisk: { 
        trainLoss: 0.021,
        testLoss: 0.027,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.0019,
        baselinePrediction: 0.017
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.93
      }
    },
    MA: { // Low uncertainty, balanced distribution
      epistemicUncertainty: { 
        predictionStdDev: 0.003,
        meanPrediction: 0.0175,
        epsilon: 0.00001
      },
      aleatoricUncertainty: { 
        meanPredictionVariance: 0.001,
        maxExpectedVariance: 0.004,
        confidenceInterval95: 1.2
      },
      overfittingRisk: { 
        trainLoss: 0.0215,
        testLoss: 0.0275,
        epsilon: 0.001
      },
      robustness: { 
        meanPerturbationChange: 0.002,
        baselinePrediction: 0.0175
      },
      explanationConsistency: { 
        featureImportanceCorrelation: 0.925
      }
    }
  };
  return params[stock] || params.AAPL;
};

// Function to create pop-up content for human uncertainty parameters
const getHumanUncertaintyParameterPopup = (parameterName: string, selectedStock: string, humanParams: HumanUncertaintyParams) => {
  // Calculate all human uncertainty values
  const calculatedValues = calculateAllHumanUncertainty(humanParams);
  
  const parameterMap: Record<string, {
    title: string;
    icon: React.ReactNode;
    description: string;
    importance: string;
    formula: string;
    currentValue: number;
    rawData: Record<string, string | number>;
  }> = {
    "perceivedUncertainty": {
      title: "Wahrgenommene Unsicherheit",
      icon: <Users className="h-6 w-6 text-orange-600" />,
      description: "Subjektive Einschätzung der eigenen Unsicherheit bei Trading-Entscheidungen basierend auf 1-5 Likert-Skala.",
      importance: "Zeigt das bewusste Unsicherheitsgefühl des Traders. Beeinflusst direkt Entscheidungsverhalten und Risikobereitschaft.",
      formula: "U_{perceived} = \\frac{L_{response} - 1}{L_{max} - 1}",
      currentValue: calculatedValues.perceivedUncertainty,
      rawData: {
        "Likert-Antwort": `${humanParams.perceivedUncertainty.likertResponse}/${humanParams.perceivedUncertainty.maxScale}`,
        "Normalisierter Score": (calculatedValues.perceivedUncertainty * 100).toFixed(1) + "%",
        "Interpretierbarkeit": calculatedValues.perceivedUncertainty > 0.6 ? "Hoch" : calculatedValues.perceivedUncertainty > 0.4 ? "Mittel" : "Niedrig"
      }
    },
    "epistemicUncertaintyHuman": {
      title: "Epistemische Unsicherheit (Mensch)",
      icon: <Brain className="h-6 w-6 text-purple-600" />,
      description: "Wissenslücken basierend auf 'unklar'-Antworten bei Fragen zum Marktverständnis und Entscheidungsgrundlagen.",
      importance: "Misst explizites Unwissen. Hohe Werte deuten auf Bedarf für zusätzliche Information oder Training hin.",
      formula: "E_{human} = \\frac{\\text{Unklare Antworten}}{\\text{Gesamte Fragen}}",
      currentValue: calculatedValues.epistemicUncertainty,
      rawData: {
        "Unklare Antworten": humanParams.epistemicUncertainty.unclearAnswers.toString(),
        "Gesamte Fragen": humanParams.epistemicUncertainty.totalQuestions.toString(),
        "Wissens-Score": (calculatedValues.epistemicUncertainty * 100).toFixed(1) + "%"
      }
    },
    "aleatoricUncertaintyHuman": {
      title: "Aleatorische Unsicherheit (Mensch)",
      icon: <Activity className="h-6 w-6 text-blue-600" />,
      description: "Inkonsistenz und Widersprüche bei ähnlichen Entscheidungssituationen durch Analyse des Konsistenz-Scores.",
      importance: "Zeigt zufällige Schwankungen im Entscheidungsverhalten. Niedrige Konsistenz deutet auf unvorhersagbare Entscheidungen hin.",
      formula: "A_{human} = 1 - \\frac{\\text{Konsistenz-Score}}{\\text{Max. Konsistenz}}",
      currentValue: calculatedValues.aleatoricUncertainty,
      rawData: {
        "Konsistenz-Score": humanParams.aleatoricUncertainty.consistencyScore.toString(),
        "Max. Konsistenz": humanParams.aleatoricUncertainty.maxPossibleConsistency.toString(),
        "Inkonsistenz-Rate": (calculatedValues.aleatoricUncertainty * 100).toFixed(1) + "%"
      }
    },
    "decisionStabilityHuman": {
      title: "Entscheidungsstabilität",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      description: "Robustheit von Entscheidungen gegen kleine Input-Änderungen zur Messung der Entscheidungsstabilität.",
      importance: "Kritisch für verlässliche Trading-Entscheidungen. Instabile Entscheidungen führen zu inkonsistenten Portfolios.",
      formula: "S_{decision} = 1 - \\frac{\\text{Entscheidungsänderungen}}{\\text{Gesamte Tests}}",
      currentValue: calculatedValues.decisionStability,
      rawData: {
        "Entscheidungsänderungen": humanParams.decisionStability.decisionChange.toString(),
        "Gesamte Tests": humanParams.decisionStability.inputChange.toString(),
        "Stabilität-Score": (calculatedValues.decisionStability * 100).toFixed(1) + "%"
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
                <button className="p-1 rounded-full hover:bg-muted/50 transition-colors">
                  <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <div className="p-3 space-y-2">
                  <div className="font-medium text-sm text-white">{param.importance}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {param.description}
        </p>
      </div>

      {/* Overall Score - matching Modellunsicherheit structure */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold mb-2 text-primary">Gesamtscore: {(param.currentValue * 100).toFixed(1)}%</h4>
        <p className="text-sm text-muted-foreground">
          Bewertung für {selectedStock}
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
                        <p className="text-xs text-white leading-relaxed">
                          {key === "Likert-Antwort" && "Selbsteinschätzung auf 1-5 Skala, wobei höhere Werte mehr Unsicherheit bedeuten."}
                          {key === "Normalisierter Score" && "Auf 0-100% normalisierte Unsicherheit für bessere Vergleichbarkeit."}
                          {key === "Interpretierbarkeit" && "Qualitative Bewertung der Unsicherheitsstärke (Niedrig/Mittel/Hoch)."}
                          {key === "Unklare Antworten" && "Anzahl der Fragen, bei denen 'unklar' als Antwort gegeben wurde."}
                          {key === "Gesamte Fragen" && "Gesamtanzahl der gestellten Wissensfragen zur Markteinschätzung."}
                          {key === "Wissens-Score" && "Anteil der unklaren Antworten als Prozentsatz der Wissenslücken."}
                          {key === "Konsistenz-Score" && "Numerische Bewertung der Entscheidungskonsistenz bei ähnlichen Szenarien."}
                          {key === "Max. Konsistenz" && "Maximaler Konsistenz-Wert, der erreicht werden kann."}
                          {key === "Inkonsistenz-Rate" && "Umgekehrte Konsistenz als Maß für aleatorische Unsicherheit."}
                          {key === "Entscheidungsänderungen" && "Anzahl der Fälle, in denen sich Entscheidungen bei kleinen Input-Änderungen änderten."}
                          {key === "Gesamte Tests" && "Gesamtanzahl der Stabilitätstests mit leicht veränderten Eingaben."}
                          {key === "Stabilität-Score" && "Anteil stabiler Entscheidungen als Robustheitsmaß."}
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
        
        {/* Gesamtberechnung */}
        <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-medium text-green-700">Gesamtberechnung</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-muted/50">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-lg">
                  <div className="space-y-3 p-2">
                    <div className="font-semibold text-sm text-white">{param.title} Gesamtformel</div>
                    <div className="formula-container bg-muted/30 p-2 rounded">
                      <div className="flex items-center justify-center min-h-[50px]">
                        <BlockMath math={param.formula} />
                      </div>
                    </div>
                    <div className="text-xs text-white">
                      {parameterName === "perceivedUncertainty" && "Normalisiert subjektive Selbsteinschätzung auf 0-1 Skala"}
                      {parameterName === "epistemicUncertaintyHuman" && "Misst explizites Unwissen durch unklare Antworten"}
                      {parameterName === "aleatoricUncertaintyHuman" && "Quantifiziert Inkonsistenz in ähnlichen Entscheidungssituationen"}
                      {parameterName === "decisionStabilityHuman" && "Bewertet Robustheit gegen kleine Input-Änderungen"}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="formula-container bg-muted/30 p-2 rounded text-xs">
            <div className="flex items-center justify-center min-h-[40px]">
              <BlockMath math={(() => {
                // Create specific calculation for each parameter type
                switch (parameterName) {
                  case "perceivedUncertainty":
                    const likert = humanParams.perceivedUncertainty?.likertResponse || 4;
                    const maxScale = humanParams.perceivedUncertainty?.maxScale || 5;
                    return `U_{perceived} = \\frac{${likert} - 1}{${maxScale} - 1} = ${param.currentValue.toFixed(3)}`;
                  
                  case "epistemicUncertaintyHuman": 
                    const unclear = humanParams.epistemicUncertainty?.unclearAnswers || 2;
                    const total = humanParams.epistemicUncertainty?.totalQuestions || 10;
                    return `E_{human} = \\frac{${unclear}}{${total}} = ${param.currentValue.toFixed(3)}`;
                  
                  case "aleatoricUncertaintyHuman":
                    const consistency = humanParams.aleatoricUncertainty?.consistencyScore || 8;
                    const maxConsist = humanParams.aleatoricUncertainty?.maxPossibleConsistency || 10;
                    return `A_{human} = 1 - \\frac{${consistency}}{${maxConsist}} = ${param.currentValue.toFixed(3)}`;
                  
                  case "decisionStabilityHuman":
                    const changes = humanParams.decisionStability?.decisionChange || 2;
                    const tests = humanParams.decisionStability?.inputChange || 15;
                    return `S_{decision} = 1 - \\frac{${changes}}{${tests}} = ${param.currentValue.toFixed(3)}`;
                  
                  default:
                    return param.formula;
                }
              })()} />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

// Data Parameter Export Functions
export const getNewsReliabilityParams = (stock?: string): NewsReliabilityParams => {
  // Stock-specific news reliability parameters for diversified uncertainty patterns
  const params: Record<string, NewsReliabilityParams> = {
    // HIGH DATA UNCERTAINTY - Poor news reliability
    TSLA: { // Data uncertainty dominant - volatile news coverage
      sourceReliability: { totalSources: 15, averageReliability: 0.72 }, // Lower reliability
      reputationAccuracy: { totalNews: 100, falseNews: 25 }, // More false news
      crossSourceConsensus: { totalNews: 10, confirmedNews: 6.2 }, // Less consensus
      biasCheck: { biasIndex: 0.38, maxBiasValue: 1.0 } // Higher bias
    },
    NVDA: { // Data uncertainty dominant - hyped coverage
      sourceReliability: { totalSources: 15, averageReliability: 0.75 },
      reputationAccuracy: { totalNews: 100, falseNews: 22 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 6.8 },
      biasCheck: { biasIndex: 0.32, maxBiasValue: 1.0 }
    },
    META: { // Model uncertainty dominant - mixed news quality
      sourceReliability: { totalSources: 15, averageReliability: 0.81 },
      reputationAccuracy: { totalNews: 100, falseNews: 15 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 7.5 },
      biasCheck: { biasIndex: 0.22, maxBiasValue: 1.0 }
    },
    AAPL: { // Model uncertainty dominant - decent news quality
      sourceReliability: { totalSources: 15, averageReliability: 0.85 },
      reputationAccuracy: { totalNews: 100, falseNews: 12 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 8.1 },
      biasCheck: { biasIndex: 0.18, maxBiasValue: 1.0 }
    },
    // MEDIUM UNCERTAINTY - Average news reliability
    MSFT: { // Human uncertainty dominant - stable news coverage
      sourceReliability: { totalSources: 15, averageReliability: 0.91 }, // High reliability
      reputationAccuracy: { totalNews: 100, falseNews: 6 }, // Less false news
      crossSourceConsensus: { totalNews: 10, confirmedNews: 8.8 }, // Good consensus
      biasCheck: { biasIndex: 0.12, maxBiasValue: 1.0 } // Lower bias
    },
    GOOGL: { // Human uncertainty dominant - stable coverage
      sourceReliability: { totalSources: 15, averageReliability: 0.89 },
      reputationAccuracy: { totalNews: 100, falseNews: 8 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 8.6 },
      biasCheck: { biasIndex: 0.14, maxBiasValue: 1.0 }
    },
    AMZN: { // Model uncertainty dominant - mixed coverage
      sourceReliability: { totalSources: 15, averageReliability: 0.83 },
      reputationAccuracy: { totalNews: 100, falseNews: 16 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 7.3 },
      biasCheck: { biasIndex: 0.25, maxBiasValue: 1.0 }
    },
    HD: { // Balanced uncertainty - steady coverage
      sourceReliability: { totalSources: 15, averageReliability: 0.87 },
      reputationAccuracy: { totalNews: 100, falseNews: 9 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 8.3 },
      biasCheck: { biasIndex: 0.16, maxBiasValue: 1.0 }
    },
    JPM: { // Balanced uncertainty - financial expertise
      sourceReliability: { totalSources: 15, averageReliability: 0.93 },
      reputationAccuracy: { totalNews: 100, falseNews: 4 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 9.1 },
      biasCheck: { biasIndex: 0.09, maxBiasValue: 1.0 }
    },
    // LOW UNCERTAINTY - Excellent news reliability
    JNJ: { // Balanced low uncertainty - established coverage
      sourceReliability: { totalSources: 15, averageReliability: 0.95 },
      reputationAccuracy: { totalNews: 100, falseNews: 2 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 9.4 },
      biasCheck: { biasIndex: 0.06, maxBiasValue: 1.0 }
    },
    PG: { // Balanced low uncertainty - consumer goods stability
      sourceReliability: { totalSources: 15, averageReliability: 0.94 },
      reputationAccuracy: { totalNews: 100, falseNews: 3 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 9.3 },
      biasCheck: { biasIndex: 0.07, maxBiasValue: 1.0 }
    },
    KO: { // Balanced low uncertainty - iconic brand coverage
      sourceReliability: { totalSources: 15, averageReliability: 0.96 },
      reputationAccuracy: { totalNews: 100, falseNews: 2 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 9.5 },
      biasCheck: { biasIndex: 0.05, maxBiasValue: 1.0 }
    },
    UNH: { // Balanced low uncertainty - regulated industry
      sourceReliability: { totalSources: 15, averageReliability: 0.92 },
      reputationAccuracy: { totalNews: 100, falseNews: 4 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 9.0 },
      biasCheck: { biasIndex: 0.08, maxBiasValue: 1.0 }
    },
    V: { // Balanced low uncertainty - financial stability
      sourceReliability: { totalSources: 15, averageReliability: 0.93 },
      reputationAccuracy: { totalNews: 100, falseNews: 3 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 9.2 },
      biasCheck: { biasIndex: 0.07, maxBiasValue: 1.0 }
    },
    MA: { // Balanced low uncertainty - financial stability
      sourceReliability: { totalSources: 15, averageReliability: 0.94 },
      reputationAccuracy: { totalNews: 100, falseNews: 3 },
      crossSourceConsensus: { totalNews: 10, confirmedNews: 9.2 },
      biasCheck: { biasIndex: 0.06, maxBiasValue: 1.0 }
    }
  };
  
  const defaultParams = {
    sourceReliability: { totalSources: 15, averageReliability: 0.89 },
    reputationAccuracy: { totalNews: 100, falseNews: 10 },
    crossSourceConsensus: { totalNews: 10, confirmedNews: 8.5 },
    biasCheck: { biasIndex: 0.15, maxBiasValue: 1.0 }
  };
  
  return stock ? (params[stock] || defaultParams) : defaultParams;
};

export const getTimeSeriesIntegrityParams = (stock?: string): TimeSeriesIntegrityParams => {
  // Stock-specific time series integrity parameters for diversified uncertainty patterns
  const params: Record<string, TimeSeriesIntegrityParams> = {
    // HIGH DATA UNCERTAINTY - Poor time series quality
    TSLA: { // Data uncertainty dominant - volatile time series
      completeness: { missingTimepoints: 8, expectedTimepoints: 100 }, // More gaps
      outlierFreedom: { outliers: 12, totalObservations: 100 }, // Many outliers
      revisionStability: { revisedValues: 6, totalValues: 100 }, // Frequent revisions
      continuity: { gaps: 7, totalIntervals: 100 } // Many gaps
    },
    NVDA: { // Data uncertainty dominant - erratic patterns
      completeness: { missingTimepoints: 6, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 10, totalObservations: 100 },
      revisionStability: { revisedValues: 5, totalValues: 100 },
      continuity: { gaps: 5, totalIntervals: 100 }
    },
    META: { // Model uncertainty dominant - decent time series
      completeness: { missingTimepoints: 3, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 5, totalObservations: 100 },
      revisionStability: { revisedValues: 2, totalValues: 100 },
      continuity: { gaps: 3, totalIntervals: 100 }
    },
    AAPL: { // Model uncertainty dominant - decent time series
      completeness: { missingTimepoints: 2, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 3, totalObservations: 100 },
      revisionStability: { revisedValues: 1, totalValues: 100 },
      continuity: { gaps: 2, totalIntervals: 100 }
    },
    // MEDIUM UNCERTAINTY - Average time series quality
    MSFT: { // Human uncertainty dominant - stable time series
      completeness: { missingTimepoints: 1, expectedTimepoints: 100 }, // Minimal gaps
      outlierFreedom: { outliers: 2, totalObservations: 100 }, // Few outliers
      revisionStability: { revisedValues: 0, totalValues: 100 }, // No revisions
      continuity: { gaps: 1, totalIntervals: 100 } // Excellent continuity
    },
    GOOGL: { // Human uncertainty dominant - stable patterns
      completeness: { missingTimepoints: 1, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 2, totalObservations: 100 },
      revisionStability: { revisedValues: 1, totalValues: 100 },
      continuity: { gaps: 1, totalIntervals: 100 }
    },
    AMZN: { // Model uncertainty dominant - moderate volatility
      completeness: { missingTimepoints: 4, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 6, totalObservations: 100 },
      revisionStability: { revisedValues: 3, totalValues: 100 },
      continuity: { gaps: 3, totalIntervals: 100 }
    },
    HD: { // Balanced uncertainty - steady time series
      completeness: { missingTimepoints: 2, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 3, totalObservations: 100 },
      revisionStability: { revisedValues: 1, totalValues: 100 },
      continuity: { gaps: 2, totalIntervals: 100 }
    },
    JPM: { // Balanced uncertainty - financial regulatory stability
      completeness: { missingTimepoints: 0, expectedTimepoints: 100 }, // Perfect completeness
      outlierFreedom: { outliers: 1, totalObservations: 100 }, // Minimal outliers
      revisionStability: { revisedValues: 0, totalValues: 100 }, // No revisions
      continuity: { gaps: 0, totalIntervals: 100 } // Perfect continuity
    },
    // LOW UNCERTAINTY - Excellent time series quality
    JNJ: { // Balanced low uncertainty - pharmaceutical stability
      completeness: { missingTimepoints: 0, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 0, totalObservations: 100 },
      revisionStability: { revisedValues: 0, totalValues: 100 },
      continuity: { gaps: 0, totalIntervals: 100 }
    },
    PG: { // Balanced low uncertainty - consumer stability
      completeness: { missingTimepoints: 0, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 0, totalObservations: 100 },
      revisionStability: { revisedValues: 0, totalValues: 100 },
      continuity: { gaps: 0, totalIntervals: 100 }
    },
    KO: { // Balanced low uncertainty - iconic stability
      completeness: { missingTimepoints: 0, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 0, totalObservations: 100 },
      revisionStability: { revisedValues: 0, totalValues: 100 },
      continuity: { gaps: 0, totalIntervals: 100 }
    },
    UNH: { // Balanced low uncertainty - healthcare regulation
      completeness: { missingTimepoints: 0, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 1, totalObservations: 100 },
      revisionStability: { revisedValues: 0, totalValues: 100 },
      continuity: { gaps: 0, totalIntervals: 100 }
    },
    V: { // Balanced low uncertainty - payment stability
      completeness: { missingTimepoints: 0, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 0, totalObservations: 100 },
      revisionStability: { revisedValues: 0, totalValues: 100 },
      continuity: { gaps: 0, totalIntervals: 100 }
    },
    MA: { // Balanced low uncertainty - payment stability
      completeness: { missingTimepoints: 0, expectedTimepoints: 100 },
      outlierFreedom: { outliers: 0, totalObservations: 100 },
      revisionStability: { revisedValues: 0, totalValues: 100 },
      continuity: { gaps: 0, totalIntervals: 100 }
    }
  };
  
  const defaultParams = {
    completeness: { missingTimepoints: 2, expectedTimepoints: 100 },
    outlierFreedom: { outliers: 3, totalObservations: 100 },
    revisionStability: { revisedValues: 1, totalValues: 100 },
    continuity: { gaps: 2, totalIntervals: 100 }
  };
  
  return stock ? (params[stock] || defaultParams) : defaultParams;
};

export const getTradingVolumeParams = (stock?: string): TradingVolumeParams => {
  // Stock-specific trading volume parameters for diversified uncertainty patterns
  const params: Record<string, TradingVolumeParams> = {
    // HIGH DATA UNCERTAINTY - Volatile trading patterns
    TSLA: { // Data uncertainty dominant - erratic volume patterns
      concentration: { topTradersVolume: 0.55, totalVolume: 1.0 }, // High concentration
      anomalousSpikes: { spikes: 45, totalTradingDays: 250 }, // Frequent spikes
      timeStability: { varianceCoefficient: 0.68, maxVarianceCoefficient: 1.0 } // High variance
    },
    NVDA: { // Data uncertainty dominant - momentum-driven volatility
      concentration: { topTradersVolume: 0.48, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 38, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.62, maxVarianceCoefficient: 1.0 }
    },
    META: { // Model uncertainty dominant - moderate volume issues
      concentration: { topTradersVolume: 0.38, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 20, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.42, maxVarianceCoefficient: 1.0 }
    },
    AAPL: { // Model uncertainty dominant - decent volume stability
      concentration: { topTradersVolume: 0.3, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 12, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.25, maxVarianceCoefficient: 1.0 }
    },
    // MEDIUM UNCERTAINTY - Moderate trading patterns
    MSFT: { // Human uncertainty dominant - stable institutional trading
      concentration: { topTradersVolume: 0.22, totalVolume: 1.0 }, // Lower concentration
      anomalousSpikes: { spikes: 8, totalTradingDays: 250 }, // Rare spikes
      timeStability: { varianceCoefficient: 0.18, maxVarianceCoefficient: 1.0 } // Low variance
    },
    GOOGL: { // Human uncertainty dominant - predictable patterns
      concentration: { topTradersVolume: 0.25, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 10, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.21, maxVarianceCoefficient: 1.0 }
    },
    AMZN: { // Model uncertainty dominant - mixed patterns
      concentration: { topTradersVolume: 0.35, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 18, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.38, maxVarianceCoefficient: 1.0 }
    },
    HD: { // Balanced uncertainty - steady retail patterns
      concentration: { topTradersVolume: 0.28, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 10, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.23, maxVarianceCoefficient: 1.0 }
    },
    JPM: { // Balanced uncertainty - institutional stability
      concentration: { topTradersVolume: 0.18, totalVolume: 1.0 }, // Very distributed
      anomalousSpikes: { spikes: 5, totalTradingDays: 250 }, // Minimal spikes
      timeStability: { varianceCoefficient: 0.12, maxVarianceCoefficient: 1.0 } // Excellent stability
    },
    // LOW UNCERTAINTY - Excellent trading stability
    JNJ: { // Balanced low uncertainty - dividend-focused stability
      concentration: { topTradersVolume: 0.15, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 3, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.08, maxVarianceCoefficient: 1.0 }
    },
    PG: { // Balanced low uncertainty - consumer goods stability
      concentration: { topTradersVolume: 0.14, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 2, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.07, maxVarianceCoefficient: 1.0 }
    },
    KO: { // Balanced low uncertainty - iconic brand stability
      concentration: { topTradersVolume: 0.12, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 1, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.06, maxVarianceCoefficient: 1.0 }
    },
    UNH: { // Balanced low uncertainty - healthcare sector stability
      concentration: { topTradersVolume: 0.16, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 3, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.09, maxVarianceCoefficient: 1.0 }
    },
    V: { // Balanced low uncertainty - payment processor stability
      concentration: { topTradersVolume: 0.13, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 2, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.08, maxVarianceCoefficient: 1.0 }
    },
    MA: { // Balanced low uncertainty - payment processor stability
      concentration: { topTradersVolume: 0.14, totalVolume: 1.0 },
      anomalousSpikes: { spikes: 2, totalTradingDays: 250 },
      timeStability: { varianceCoefficient: 0.08, maxVarianceCoefficient: 1.0 }
    }
  };
  
  const defaultParams = {
    concentration: { topTradersVolume: 0.3, totalVolume: 1.0 },
    anomalousSpikes: { spikes: 5, totalTradingDays: 250 },
    timeStability: { varianceCoefficient: 0.2, maxVarianceCoefficient: 1.0 }
  };
  
  return stock ? (params[stock] || defaultParams) : defaultParams;
};

// Compute human uncertainty parameters from trading data (now using static dummy data)
export const computeHumanUncertaintyFromTradingData = (
  stockData: TradingUncertaintyData[], 
  analytics: UncertaintyAnalytics | null
): HumanUncertaintyParams => {
  if (!stockData || stockData.length === 0 || !analytics) {
    // Fallback to default values when no trading data exists
    return {
      perceivedUncertainty: { likertResponse: 3, maxScale: 5 },
      epistemicUncertainty: { unclearAnswers: 0, totalQuestions: 1 },
      aleatoricUncertainty: { consistencyScore: 5, maxPossibleConsistency: 10 },
      decisionStability: { decisionChange: 0.2, inputChange: 0.1 }
    };
  }

  // 1. Perceived Uncertainty: Average Likert response from stock decisions
  const avgPerceivedUncertainty = stockData.length > 0 
    ? stockData.reduce((sum, d) => sum + d.perceivedUncertainty, 0) / stockData.length 
    : 3;

  // 2. Epistemic Uncertainty: Based on unclear concepts from stock decisions
  const allUnclearConcepts = stockData.flatMap(d => d.unclearConcepts || []);
  const unclearAnswers = allUnclearConcepts.length;
  const totalQuestions = stockData.length * 4; // 4 concepts per decision

  // 3. Aleatorische Uncertainty: Based on decision consistency
  const consistencyScore = analytics ? Math.round(analytics.decisionConsistency * 10) : 7;
  
  // 4. Decision Stability: Based on uncertainty variance (lower variance = higher stability)
  const stabilityScore = analytics ? analytics.stabilityScore : 0.5;
  const decisionChange = 1 - stabilityScore; // Higher instability = higher decision change
  const inputChange = 0.1; // Assume 10% input variation

  return {
    perceivedUncertainty: { 
      likertResponse: Math.round(avgPerceivedUncertainty), 
      maxScale: 5 
    },
    epistemicUncertainty: { 
      unclearAnswers: unclearAnswers, 
      totalQuestions: Math.max(totalQuestions, 1) // Prevent division by zero
    },
    aleatoricUncertainty: { 
      consistencyScore: consistencyScore, 
      maxPossibleConsistency: 10 
    },
    decisionStability: { 
      decisionChange: decisionChange, 
      inputChange: inputChange 
    }
  };
};

export const getHumanUncertaintyParams = (stock: string): HumanUncertaintyParams => {
  // Stock-specific variations for realistic mock data (fallback)
  const stockVariations: Record<string, Partial<HumanUncertaintyParams>> = {
    'AAPL': {
      perceivedUncertainty: { likertResponse: 3, maxScale: 5 },
      epistemicUncertainty: { unclearAnswers: 2, totalQuestions: 10 },
      aleatoricUncertainty: { consistencyScore: 8, maxPossibleConsistency: 10 },
      decisionStability: { decisionChange: 0.15, inputChange: 0.05 }
    },
    'TSLA': {
      perceivedUncertainty: { likertResponse: 4, maxScale: 5 },
      epistemicUncertainty: { unclearAnswers: 4, totalQuestions: 12 },
      aleatoricUncertainty: { consistencyScore: 6, maxPossibleConsistency: 10 },
      decisionStability: { decisionChange: 0.3, inputChange: 0.1 }
    },
    'NVDA': {
      perceivedUncertainty: { likertResponse: 2, maxScale: 5 },
      epistemicUncertainty: { unclearAnswers: 1, totalQuestions: 8 },
      aleatoricUncertainty: { consistencyScore: 9, maxPossibleConsistency: 10 },
      decisionStability: { decisionChange: 0.1, inputChange: 0.08 }
    }
  };

  // Default parameters if stock not found
  const defaultParams: HumanUncertaintyParams = {
    perceivedUncertainty: { likertResponse: 3, maxScale: 5 },
    epistemicUncertainty: { unclearAnswers: 3, totalQuestions: 10 },
    aleatoricUncertainty: { consistencyScore: 7, maxPossibleConsistency: 10 },
    decisionStability: { decisionChange: 0.2, inputChange: 0.1 }
  };

  return { ...defaultParams, ...stockVariations[stock] } as HumanUncertaintyParams;
};

export function TechnicalAnalysisTab({ selectedStock }: TechnicalAnalysisTabProps) {
  const data = getTechnicalData(selectedStock)
  const [activeInfoBox, setActiveInfoBox] = useState<string | null>(null)
  
  // Get real trading uncertainty data
  const { getStockUncertaintyHistory, analytics } = useTradingUncertainty()
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
                        {getStatusIcon(getModelUncertaintyStatus(getUncertaintyValue(feature.name, data.modelMetrics.uncertaintyParams)))}
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
                      <Badge className={getStatusColor(getModelUncertaintyStatus(getUncertaintyValue(feature.name, data.modelMetrics.uncertaintyParams)))}>
                        {getUncertaintyValue(feature.name, data.modelMetrics.uncertaintyParams).toFixed(1)}%
                      </Badge>
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
                Menschliche Unsicherheit
              </CardTitle>
              <CardDescription>
                Analyse der menschlichen Unsicherheitsfaktoren bei Entscheidungsfindung
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                // Use real trading data from hook for human uncertainty
                const stockData = getStockUncertaintyHistory(selectedStock)
                const humanParams = computeHumanUncertaintyFromTradingData(stockData, analytics)
                const humanCalculated = calculateAllHumanUncertainty(humanParams)
                
                
                return (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                    {/* Wahrgenommene Unsicherheit */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(getHumanUncertaintyStatus((humanCalculated.perceivedUncertainty * 100)))}
                          <span className="font-medium">Wahrgenommene Unsicherheit</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleInfoClick('perceivedUncertainty')}
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
                        <Badge className={getStatusColor(getHumanUncertaintyStatus((humanCalculated.perceivedUncertainty * 100)))}>
                          {(humanCalculated.perceivedUncertainty * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={humanCalculated.perceivedUncertainty * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Likert-Skala: {humanParams.perceivedUncertainty.likertResponse}/{humanParams.perceivedUncertainty.maxScale}
                      </p>
                    </div>

                    {/* Epistemische Unsicherheit */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(getHumanUncertaintyStatus((humanCalculated.epistemicUncertainty * 100)))}
                          <span className="font-medium">Epistemische Unsicherheit</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleInfoClick('epistemicUncertaintyHuman')}
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
                        <Badge className={getStatusColor(getHumanUncertaintyStatus((humanCalculated.epistemicUncertainty * 100)))}>
                          {(humanCalculated.epistemicUncertainty * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={humanCalculated.epistemicUncertainty * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {humanParams.epistemicUncertainty.unclearAnswers} unklare Antworten erkannt
                      </p>
                    </div>

                    {/* Aleatorische Unsicherheit */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(getHumanUncertaintyStatus((humanCalculated.aleatoricUncertainty * 100)))}
                          <span className="font-medium">Aleatorische Unsicherheit</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleInfoClick('aleatoricUncertaintyHuman')}
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
                        <Badge className={getStatusColor(getHumanUncertaintyStatus((humanCalculated.aleatoricUncertainty * 100)))}>
                          {(humanCalculated.aleatoricUncertainty * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={humanCalculated.aleatoricUncertainty * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {humanParams.aleatoricUncertainty.consistencyScore} konsistente Entscheidungen
                      </p>
                    </div>

                    {/* Entscheidungsstabilität */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(getHumanUncertaintyStatus((humanCalculated.decisionStability * 100)))}
                          <span className="font-medium">Entscheidungsstabilität</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button 
                                onClick={() => handleInfoClick('decisionStabilityHuman')}
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
                        <Badge className={getStatusColor(getHumanUncertaintyStatus((humanCalculated.decisionStability * 100)))}>
                          {(humanCalculated.decisionStability * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={humanCalculated.decisionStability * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {(humanParams.decisionStability.decisionChange * 100).toFixed(1)}% Entscheidungsänderung
                      </p>
                    </div>
                  </div>
                  </>
                )
              })()}
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
                <div 
                  className="flex-1 overflow-y-auto violet-bloom-scrollbar" 
                  data-popup="true"
                >
                  <div className="space-y-4">
                    
                    {/* Fundamentaldaten detailed parameters */}
                    {activeInfoBox === 'fundamentalData' && (() => {
                      const params = getFundamentalDataParams(selectedStock)
                      const calculatedValues = calculateAllFundamentalData(params)
                      const overallScore = ((calculatedValues.completeness + calculatedValues.timeliness + calculatedValues.consistency + calculatedValues.accuracy + calculatedValues.stability) / 5 * 100).toFixed(1)
                      
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Vollständigkeit (Fundamentaldaten)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="C = 1 - \frac{\text{Fehlende Werte}}{\text{Gesamte Werte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`C = 1 - \\frac{${params.completeness.missingValues}}{${params.completeness.totalValues}} = ${(calculatedValues.completeness).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Misst den Anteil verfügbarer Fundamentaldaten. Höhere Werte bedeuten weniger fehlende Daten.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.completeness * 100).toFixed(1)}%</Badge>
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Aktualität (Fundamentaldaten)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="T = \max(0, 1 - \frac{\text{Tage alt}}{\text{Max. akzeptable Tage}})" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`T = \\max(0, 1 - \\frac{${params.timeliness.daysOld}}{${params.timeliness.maxAcceptableDays}}) = ${calculatedValues.timeliness.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der Aktualität der Fundamentaldaten basierend auf der Verzögerung seit letztem Update. Neuere Daten erhalten höhere Bewertungen.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.timeliness * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Durchschnittlich {params.timeliness.daysOld} Tage Verzögerung
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Konsistenz (Fundamentaldaten)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="K = 1 - \frac{\text{Inkonsistente Datenpunkte}}{\text{Gesamte Datenpunkte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`K = 1 - \\frac{${params.consistency.inconsistentEntries}}{${params.consistency.totalEntries}} = ${calculatedValues.consistency.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der Datenkonsistenz zwischen verschiedenen Quellen und historischen Trends. Hohe Konsistenz reduziert Datenunsicherheit erheblich.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.consistency * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.consistency.totalEntries - params.consistency.inconsistentEntries} konsistente Einträge von {params.consistency.totalEntries}
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Genauigkeit (Fundamentaldaten)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="A = \frac{\text{Genaue Berichte}}{\text{Gesamte Berichte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`A = \\frac{${params.accuracy.accurateReports}}{${params.accuracy.totalReports}} = ${calculatedValues.accuracy.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der Richtigkeit der Fundamentaldaten durch Vergleich mit verifizierten Quellen. Höhere Genauigkeit reduziert Datenunsicherheit erheblich.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.accuracy * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.accuracy.accurateReports} akkurate Berichte von {params.accuracy.totalReports}
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Stabilität (Fundamentaldaten)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="S = 1 - \frac{\text{Revisionen}}{\text{Datenpunkte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`S = 1 - \\frac{${params.stability.revisions}}{${params.stability.totalDataPoints}} = ${(calculatedValues.stability).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Misst wie oft Daten nachträglich korrigiert wurden. Rev = Anzahl Revisionen, D = Gesamte Datenpunkte. Weniger Revisionen bedeuten stabilere Daten.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.stability * 100).toFixed(1)}%</Badge>
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
                                    <div className="formula-container bg-muted/30 p-2 rounded">
                                      <div className="flex items-center justify-center min-h-[50px]">
                                        <BlockMath math="\text{Score} = \frac{C + T + K + A + S}{5}" />
                                      </div>
                                    </div>
                                    <div className="text-xs text-white">
                                      Gleichgewichteter Durchschnitt aller 5 Parameter
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            
                            <div className="formula-container bg-muted/30 p-2 rounded text-xs">
                              <div className="flex items-center justify-center min-h-[40px]">
                                <BlockMath math={`\\text{Aktuell} = \\frac{${(calculatedValues.completeness * 100).toFixed(1)} + ${(calculatedValues.timeliness * 100).toFixed(1)} + ${(calculatedValues.consistency * 100).toFixed(1)} + ${(calculatedValues.accuracy * 100).toFixed(1)} + ${(calculatedValues.stability * 100).toFixed(1)}}{5} = ${overallScore}\\%`} />
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* Time Series Integrity Details */}
                    {activeInfoBox === 'timeSeriesIntegrity' && (() => {
                      const params = getTimeSeriesIntegrityParams(selectedStock)
                      const calculatedValues = calculateAllTimeSeries(params)
                      const overallScoreNum = (calculatedValues.completeness + calculatedValues.outlierFreedom + calculatedValues.revisionStability + calculatedValues.continuity) / 4 * 100
                      const overallScore = overallScoreNum.toFixed(1)
                      
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Vollständigkeit (Zeitreihen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="C = 1 - \frac{\text{Fehlende Zeitpunkte}}{\text{Erwartete Zeitpunkte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`C = 1 - \\frac{${params.completeness.missingTimepoints}}{${params.completeness.expectedTimepoints}} = ${(calculatedValues.completeness).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Misst Lücken in der Zeitreihe. M = Fehlende Zeitpunkte, E = Erwartete Zeitpunkte. Höhere Werte bedeuten vollständigere Datenreihen.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.completeness * 100).toFixed(1)}%</Badge>
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Ausreißer-Freiheit (Zeitreihen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="O = 1 - \frac{\text{Ausreißer}}{\text{Beobachtungen}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`O = 1 - \\frac{${params.outlierFreedom.outliers}}{${params.outlierFreedom.totalObservations}} = ${calculatedValues.outlierFreedom.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der Abwesenheit statistischer Ausreißer in den Zeitreihendaten. Sauberere Daten ohne Ausreißer reduzieren Zeitreihenunsicherheit.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.outlierFreedom * 100).toFixed(1)}%</Badge>
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Revision-Stabilität (Zeitreihen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="R = 1 - \frac{\text{Revisionen}}{\text{Total}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`R = 1 - \\frac{${params.revisionStability.revisedValues}}{${params.revisionStability.totalValues}} = ${calculatedValues.revisionStability.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der Stabilität gegen nachträgliche Korrekturen in den Zeitreihendaten. Stabile Daten ohne nachträgliche Revisionen erhöhen Vertrauen.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.revisionStability * 100).toFixed(1)}%</Badge>
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Kontinuität (Zeitreihen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="K = 1 - \frac{\text{Lücken}}{\text{Intervalle}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`K = 1 - \\frac{${params.continuity.gaps}}{${params.continuity.totalIntervals}} = ${(calculatedValues.continuity).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Misst zeitliche Lücken in der Datenreihe. G = Gaps, I = Gesamte Intervalle. Höhere Werte bedeuten kontinuierlichere Daten.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.continuity * 100).toFixed(1)}%</Badge>
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
                                    <div className="formula-container bg-muted/30 p-2 rounded">
                                      <div className="flex items-center justify-center min-h-[50px]">
                                        <BlockMath math="\text{Score} = \frac{C + O + R + K}{4}" />
                                      </div>
                                    </div>
                                    <div className="text-xs text-white">
                                      Gleichgewichteter Durchschnitt aller 4 Parameter
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            
                            <div className="formula-container bg-muted/30 p-2 rounded text-xs">
                              <div className="flex items-center justify-center min-h-[40px]">
                                <BlockMath math={`\\text{Aktuell} = \\frac{${(calculatedValues.completeness * 100).toFixed(1)} + ${(calculatedValues.outlierFreedom * 100).toFixed(1)} + ${(calculatedValues.revisionStability * 100).toFixed(1)} + ${(calculatedValues.continuity * 100).toFixed(1)}}{4} = ${overallScore}\\%`} />
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* News Reliability Details */}
                    {activeInfoBox === 'newsReliability' && (() => {
                      const params = getNewsReliabilityParams(selectedStock)
                      const calculatedValues = calculateAllNewsReliability(params)
                      // Weighted calculation: w1=0.3, w2=0.3, w3=0.25, w4=0.15
                      const w1 = 0.3, w2 = 0.3, w3 = 0.25, w4 = 0.15
                      const overallScoreNum = (w1 * calculatedValues.sourceReliability + w2 * calculatedValues.reputationAccuracy + w3 * calculatedValues.crossSourceConsensus + w4 * calculatedValues.biasCheck) * 100
                      const overallScore = overallScoreNum.toFixed(1)
                      
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Quellenseriosität (News)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="R = \frac{\sum \text{Gewichtung} \cdot \text{Zuverlässigkeit}}{\text{Anzahl Quellen}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`R = ${(calculatedValues.sourceReliability).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertet die Glaubwürdigkeit der Nachrichtenquellen. w_i = Gewichtung, r_i = Zuverlässigkeit, N = Anzahl Nachrichten (Reuters=0.98, Bloomberg=0.95).
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.sourceReliability * 100).toFixed(1)}%</Badge>
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Reputation Accuracy (News-Verlässlichkeit)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="P = 1 - \frac{\text{Falsche Nachrichten}}{\text{Gesamte Nachrichten}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`P = 1 - \\frac{${params.reputationAccuracy.falseNews}}{${params.reputationAccuracy.totalNews}} = ${calculatedValues.reputationAccuracy.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der historischen Genauigkeit von Nachrichtenquellen basierend auf vergangenen Falschmeldungen. Höhere Werte bedeuten weniger widerlegte Nachrichten.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.reputationAccuracy * 100).toFixed(1)}%</Badge>
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Cross-Source Consensus (News-Verlässlichkeit)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="K = \frac{\text{Bestätigte Nachrichten}}{\text{Gesamte Nachrichten}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`K = \\frac{${params.crossSourceConsensus.confirmedNews}}{${params.crossSourceConsensus.totalNews}} = ${calculatedValues.crossSourceConsensus.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der Übereinstimmung zwischen verschiedenen unabhängigen Nachrichtenquellen. Höhere Werte bedeuten besseren Konsens zwischen Quellen.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.crossSourceConsensus * 100).toFixed(1)}%</Badge>
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Bias-Check (News-Verlässlichkeit)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="B = 1 - \frac{\text{Bias-Index}}{\text{Max-Bias-Wert}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`B = 1 - \\frac{${params.biasCheck.biasIndex}}{${params.biasCheck.maxBiasValue}} = ${calculatedValues.biasCheck.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der Neutralität und Objektivität der Nachrichtenquellen. Höhere Werte bedeuten weniger Bias und objektivere Berichterstattung.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.biasCheck * 100).toFixed(1)}%</Badge>
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
                                    <div className="formula-container bg-muted/30 p-2 rounded">
                                      <div className="flex items-center justify-center min-h-[50px]">
                                        <BlockMath math="Q_{news} = w_1 \cdot R + w_2 \cdot P + w_3 \cdot K + w_4 \cdot (1-B)" />
                                      </div>
                                    </div>
                                    <div className="text-xs text-white">
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
                              
                              <div className="formula-container bg-muted/30 p-2 rounded text-xs">
                                <div className="flex items-center justify-center min-h-[40px]">
                                  <BlockMath math={`\\text{Aktuell} = ${w1} \\cdot ${calculatedValues.sourceReliability} + ${w2} \\cdot ${calculatedValues.reputationAccuracy} + ${w3} \\cdot ${calculatedValues.crossSourceConsensus} + ${w4} \\cdot ${calculatedValues.biasCheck} = ${(overallScoreNum/100).toFixed(3)}`} />
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
                      const calculatedValues = calculateAllTradingVolume(params)
                      const w1 = 0.4, w2 = 0.3, w3 = 0.3 // Gewichtungen
                      const overallScoreNum = (w1 * calculatedValues.concentration + w2 * calculatedValues.anomalousSpikes + w3 * calculatedValues.timeStability) * 100
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
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Konzentration (Handelsvolumen-Verteilung)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="S = 1 - \frac{\text{Top-Trader-Volumen}}{\text{Gesamt-Volumen}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`S = 1 - \\frac{${params.concentration.topTradersVolume}}{${params.concentration.totalVolume}} = ${calculatedValues.concentration.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Bewertung der Marktkonzentration durch Handelsvolumen-Verteilung. Höhere Werte bedeuten weniger Marktkonzentration und fairere Verteilung.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.concentration * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Top-Trader-Anteil: {(params.concentration.topTradersVolume * 100).toFixed(1)}% von {params.concentration.totalVolume * 100}%
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Anomalous Spikes (Handelsvolumen-Verteilung)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="A = 1 - \frac{\text{Anomale Spitzen}}{\text{Handelstage}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`A = 1 - \\frac{${params.anomalousSpikes.spikes}}{${params.anomalousSpikes.totalTradingDays}} = ${calculatedValues.anomalousSpikes.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Erkennung ungewöhnlicher Handelsaktivität und Volumen-Anomalien. Höhere Werte bedeuten normalere und vorhersagbarere Volumenmuster.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.anomalousSpikes * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.anomalousSpikes.spikes} Spike-Zeitpunkte von {params.anomalousSpikes.totalTradingDays} Handelstagen ({((params.anomalousSpikes.spikes / params.anomalousSpikes.totalTradingDays) * 100).toFixed(1)}%)
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Zeitstabilität (Handelsvolumen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="T = 1 - \frac{\text{Variationskoeffizient}}{\text{Max-Variation}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-white font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math={`T = 1 - \\frac{${params.timeStability.varianceCoefficient.toFixed(2)}}{${params.timeStability.maxVarianceCoefficient.toFixed(2)}} = ${calculatedValues.timeStability.toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-white">
                                        Misst die Stabilität des Handelsvolumens über Zeit. Höhere Werte bedeuten stabilere und vorhersagbarere Volumenentwicklung.
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(calculatedValues.timeStability * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Variationskoeffizient: {params.timeStability.varianceCoefficient.toFixed(2)} von max. {params.timeStability.maxVarianceCoefficient.toFixed(2)}
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
                                    <div className="formula-container bg-muted/30 p-2 rounded">
                                      <div className="flex items-center justify-center min-h-[50px]">
                                        <BlockMath math="Q_{volume} = w_1 \cdot S + w_2 \cdot A + w_3 \cdot T" />
                                      </div>
                                    </div>
                                    <div className="text-xs text-white">
                                      Gewichteter Durchschnitt: w₁=40%, w₂=30%, w₃=30%
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            
                            <div className="formula-container bg-muted/30 p-2 rounded text-xs">
                              <div className="flex items-center justify-center min-h-[40px]">
                                <BlockMath math={`\\text{Aktuell} = ${w1} \\cdot ${calculatedValues.concentration.toFixed(3)} + ${w2} \\cdot ${calculatedValues.anomalousSpikes.toFixed(3)} + ${w3} \\cdot ${calculatedValues.timeStability.toFixed(3)} = ${(overallScoreNum/100).toFixed(3)}`} />
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
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
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

                    {/* Human Uncertainty Info Panels */}
                    {activeInfoBox === 'perceivedUncertainty' && (() => {
                      const stockData = getStockUncertaintyHistory(selectedStock)
                      const humanParams = computeHumanUncertaintyFromTradingData(stockData, analytics)
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
                            <p className="text-sm text-muted-foreground">
                              Subjektive Einschätzung der eigenen Unsicherheit bei Trading-Entscheidungen basierend auf 1-5 Likert-Skala.
                            </p>
                          </div>
                          
                          {/* Parameter-spezifische Details mit getHumanUncertaintyParameterPopup */}
                          <div className="mt-6">
                            {getHumanUncertaintyParameterPopup('perceivedUncertainty', selectedStock, humanParams)}
                          </div>
                        </>
                      )
                    })()}

                    {activeInfoBox === 'epistemicUncertaintyHuman' && (() => {
                      const stockData = getStockUncertaintyHistory(selectedStock)
                      const humanParams = computeHumanUncertaintyFromTradingData(stockData, analytics)
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
                            <p className="text-sm text-muted-foreground">
                              Bewertung der Wissenslücken basierend auf &quot;unklar&quot;-Antworten bei Fragen zum Marktverständnis und Entscheidungsgrundlagen.
                            </p>
                          </div>
                          
                          {/* Parameter-spezifische Details mit getHumanUncertaintyParameterPopup */}
                          <div className="mt-6">
                            {getHumanUncertaintyParameterPopup('epistemicUncertaintyHuman', selectedStock, humanParams)}
                          </div>
                        </>
                      )
                    })()}

                    {activeInfoBox === 'aleatoricUncertaintyHuman' && (() => {
                      const stockData = getStockUncertaintyHistory(selectedStock)
                      const humanParams = computeHumanUncertaintyFromTradingData(stockData, analytics)
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
                            <p className="text-sm text-muted-foreground">
                              Bewertung der Inkonsistenz und Widersprüche bei ähnlichen Entscheidungssituationen durch Analyse des Konsistenz-Scores.
                            </p>
                          </div>
                          
                          {/* Parameter-spezifische Details mit getHumanUncertaintyParameterPopup */}
                          <div className="mt-6">
                            {getHumanUncertaintyParameterPopup('aleatoricUncertaintyHuman', selectedStock, humanParams)}
                          </div>
                        </>
                      )
                    })()}

                    {activeInfoBox === 'decisionStabilityHuman' && (() => {
                      const stockData = getStockUncertaintyHistory(selectedStock)
                      const humanParams = computeHumanUncertaintyFromTradingData(stockData, analytics)
                      return (
                        <>
                          {/* Short intro text */}
                          <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg violet-bloom-card">
                            <p className="text-sm text-muted-foreground">
                              Bewertung der Robustheit von Entscheidungen gegen kleine Input-Änderungen zur Messung der Entscheidungsstabilität.
                            </p>
                          </div>
                          
                          {/* Parameter-spezifische Details mit getHumanUncertaintyParameterPopup */}
                          <div className="mt-6">
                            {getHumanUncertaintyParameterPopup('decisionStabilityHuman', selectedStock, humanParams)}
                          </div>
                        </>
                      )
                    })()}

                    {/* Other metrics placeholder */}
                    {activeInfoBox !== 'fundamentalData' && activeInfoBox !== 'timeSeriesIntegrity' && activeInfoBox !== 'newsReliability' && activeInfoBox !== 'tradingVolume' && !["Epistemische Unsicherheit", "Aleatorische Unsicherheit", "Overfitting-Risiko", "Robustheit", "Erklärungs-Konsistenz"].includes(activeInfoBox || '') && !(['perceivedUncertainty', 'epistemicUncertaintyHuman', 'aleatoricUncertaintyHuman', 'decisionStabilityHuman', 'humanUncertaintyOverall'].includes(activeInfoBox || '')) && (
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