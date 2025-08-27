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

export const getFundamentalDataParams = (stock: string): FundamentalDataParams => {
  const params: Record<string, FundamentalDataParams> = {
    AAPL: {
      completeness: { missingValues: 2, totalValues: 25 },
      timeliness: { daysOld: 1, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 1, totalEntries: 25 },
      accuracy: { accurateReports: 23, totalReports: 25 },
      stability: { revisions: 1, totalDataPoints: 25 }
    },
    MSFT: {
      completeness: { missingValues: 1, totalValues: 25 },
      timeliness: { daysOld: 1, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 0, totalEntries: 25 },
      accuracy: { accurateReports: 24, totalReports: 25 },
      stability: { revisions: 0, totalDataPoints: 25 }
    },
    TSLA: {
      completeness: { missingValues: 6, totalValues: 25 },
      timeliness: { daysOld: 3, maxAcceptableDays: 7 },
      consistency: { inconsistentEntries: 4, totalEntries: 25 },
      accuracy: { accurateReports: 19, totalReports: 25 },
      stability: { revisions: 3, totalDataPoints: 25 }
    }
  }
  return params[stock] || params.AAPL
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
      return `1 - \\frac{${sigma}}{${mu} + ${epsilonVal}} = ${finalScore}`;
    
    case "Aleatorische Unsicherheit":
      // A = 1 - (mittlere Varianz)/(max. erwartete Varianz)
      const meanVar = Object.values(rawData)[0];     // Mittlere Vorhersagevarianz
      const maxVar = Object.values(rawData)[1];      // Maximale erwartete Varianz  
      const aleatoricScore = Object.values(rawData)[2]; // A Score
      return `1 - \\frac{${meanVar}}{${maxVar}} = ${aleatoricScore}`;
    
    case "Overfitting-Risiko":
      // C = 1 - |L_train - L_test|/(L_train + ε)
      const lTrain = Object.values(rawData)[0];
      const lTest = Object.values(rawData)[1];
      const overfittingScore = Object.values(rawData)[2];
      return `1 - \\frac{|${lTrain} - ${lTest}|}{${lTrain} + 0.001} = ${overfittingScore}`;
    
    case "Robustheit":
      // R = 1 - Δŷ/ŷ
      const deltaY = Object.values(rawData)[0];      // Δŷ (mittlere Änderung)
      const baselineY = Object.values(rawData)[1];   // ŷ (Baseline-Vorhersage)
      const robustnessScore = Object.values(rawData)[2];
      return `1 - \\frac{${deltaY}}{${baselineY}} = ${robustnessScore}`;
    
    case "Erklärungs-Konsistenz":
      // X = normalized ρ from [-1,1] to [0,1]: X = (ρ + 1)/2
      const rho = Object.values(rawData)[0];         // ρ (Korrelation)
      const consistencyScore = Object.values(rawData)[1]; // X Score (normalisiert)
      return `X = \\frac{\\rho + 1}{2} = \\frac{${rho} + 1}{2} = ${consistencyScore}`;
    
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

export const getModelUncertaintyParams = (stock: string): ModelUncertaintyParams => {
  const params: Record<string, ModelUncertaintyParams> = {
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
    }
  };
  return params[stock] || params.AAPL;
};

// Data Parameter Export Functions
export const getNewsReliabilityParams = (_stock: string): NewsReliabilityParams => {
  const defaultParams = {
    sourceReliability: { totalSources: 15, averageReliability: 0.89 },
    reputationAccuracy: { totalNews: 100, falseNews: 10 },
    crossSourceConsensus: { totalNews: 10, confirmedNews: 8.5 },
    biasCheck: { biasIndex: 0.15, maxBiasValue: 1.0 }
  };
  return defaultParams;
};

export const getTimeSeriesIntegrityParams = (_stock: string): TimeSeriesIntegrityParams => {
  const defaultParams = {
    completeness: { missingTimepoints: 2, expectedTimepoints: 100 },
    outlierFreedom: { outliers: 3, totalObservations: 100 },
    revisionStability: { revisedValues: 1, totalValues: 100 },
    continuity: { gaps: 2, totalIntervals: 100 }
  };
  return defaultParams;
};

export const getTradingVolumeParams = (_stock: string): TradingVolumeParams => {
  const defaultParams = {
    concentration: { topTradersVolume: 0.3, totalVolume: 1.0 },
    anomalousSpikes: { spikes: 5, totalTradingDays: 250 },
    timeStability: { varianceCoefficient: 0.2, maxVarianceCoefficient: 1.0 }
  };
  return defaultParams;
};

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
                      const calculatedValues = calculateAllFundamentalData(params)
                      const overallScore = ((calculatedValues.completeness + calculatedValues.timeliness + calculatedValues.consistency + calculatedValues.accuracy + calculatedValues.stability) / 5 * 100).toFixed(1)
                      
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Vollständigkeit (Fundamentaldaten)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="C = 1 - \\frac{\\text{Fehlende Werte}}{\\text{Gesamte Werte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`C = 1 - \\frac{${params.completeness.missingValues}}{${params.completeness.totalValues}} = ${(calculatedValues.completeness).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
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
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="T = \\max(0, 1 - \\frac{\\text{Tage alt}}{\\text{Max. akzeptable Tage}})" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`T = \\max(0, 1 - \\frac{${params.timeliness.daysOld}}{${params.timeliness.maxAcceptableDays}}) = ${(calculatedValues.timeliness).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Bewertet wie aktuell die Fundamentaldaten sind. d = Verzögerung in Tagen, d_max = Maximaltoleranz. Neuere Daten erhalten höhere Bewertungen.
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
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="K = 1 - \\frac{\\text{Inkonsistente Einträge}}{\\text{Gesamte Einträge}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`K = 1 - \\frac{${params.consistency.inconsistentEntries}}{${params.consistency.totalEntries}} = ${(calculatedValues.consistency).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Misst interne Konsistenz der Daten. I = Inkonsistente Einträge, E = Gesamte Einträge. Höhere Werte zeigen weniger Widersprueche an.
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
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="A = \\frac{\\text{Genaue Berichte}}{\\text{Gesamte Berichte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`A = \\frac{${params.accuracy.accurateReports}}{${params.accuracy.totalReports}} = ${(calculatedValues.accuracy).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Misst die Richtigkeit der Fundamentaldaten durch Vergleich mit verifizierten Quellen. R = Richtige Berichte, N = Gesamte Berichte.
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
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="S = 1 - \frac{\text{Revisionen}}{\text{Datenpunkte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`S = 1 - \\frac{${params.stability.revisions}}{${params.stability.totalDataPoints}} = ${(calculatedValues.stability).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Vollständigkeit (Zeitreihen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="C = 1 - \frac{\text{Fehlende Zeitpunkte}}{\text{Erwartete Zeitpunkte}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`C = 1 - \\frac{${params.completeness.missingTimepoints}}{${params.completeness.expectedTimepoints}} = ${(calculatedValues.completeness).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
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
                                      <div className="font-semibold text-sm text-white">Ausreißerfreiheit (Zeitreihen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="O = 1 - \\frac{\\text{Ausreißer}}{\\text{Beobachtungen}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`O = 1 - \\frac{${params.outlierFreedom.outliers}}{${params.outlierFreedom.totalObservations}} = ${(calculatedValues.outlierFreedom).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Bewertet das Vorhandensein statistischer Ausreißer. Out = Ausreißer, Obs = Beobachtungen. Höhere Werte zeigen sauberere Daten.
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
                                      <div className="font-semibold text-sm text-white">Revisionsstabilität (Zeitreihen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="R = 1 - \\frac{\\text{Revisionen}}{\\text{Total}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`R = 1 - \\frac{${params.revisionStability.revisedValues}}{${params.revisionStability.totalValues}} = ${(calculatedValues.revisionStability).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Misst nachträgliche Korrekturen der Zeitreihe. Rev = Revidierte Werte, Tot = Gesamte Werte. Stabile Daten haben weniger Revisionen.
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
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="K = 1 - \frac{\text{Lücken}}{\text{Intervalle}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`K = 1 - \\frac{${params.continuity.gaps}}{${params.continuity.totalIntervals}} = ${(calculatedValues.continuity).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Quellenseriosität (News)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="R = \frac{\sum \text{Gewichtung} \cdot \text{Zuverlässigkeit}}{\text{Anzahl Quellen}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`R = ${(calculatedValues.sourceReliability).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
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
                                      <div className="font-semibold text-sm text-white">Historische Trefferquote (News)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="P = 1 - \\frac{\\text{Falsche Nachrichten}}{\\text{Gesamte Nachrichten}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`P = 1 - \\frac{${params.reputationAccuracy.falseNews}}{${params.reputationAccuracy.totalNews}} = ${(calculatedValues.reputationAccuracy).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Misst die Genauigkeit vergangener Nachrichten. F = Falsche Nachrichten, N = Gesamte Nachrichten. Höhere Werte = weniger Falschmeldungen.
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
                                      <div className="font-semibold text-sm text-white">Quellenübereinstimmung (News)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="K = \\frac{\\text{Bestätigte Nachrichten}}{\\text{Gesamte Nachrichten}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`K = \\frac{${params.crossSourceConsensus.confirmedNews}}{${params.crossSourceConsensus.totalNews}} = ${(calculatedValues.crossSourceConsensus).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Misst Konsens zwischen unabhängigen Quellen. C = Bestätigte Nachrichten, N = Gesamte Nachrichten. Höhere Werte = bessere Bestätigung.
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
                                      <div className="font-semibold text-sm text-white">Verzerrungsanalyse (News)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="B = 1 - \\frac{\\text{Bias-Index}}{\\text{Max-Bias}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`B = 1 - \\frac{${params.biasCheck.biasIndex}}{${params.biasCheck.maxBiasValue}} = ${(calculatedValues.biasCheck).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Erkennt systematische Verzerrungen in der Berichterstattung. Bias = Normierter Bias-Index, Max = Maximaler Bias-Wert. Höhere Werte = neutralere Quellen.
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
                                    <div className="space-y-3 p-2">
                                      <div className="font-semibold text-sm text-white">Konzentration (Handelsvolumen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="S = 1 - \\text{HHI-Index}" />
                                        </div>
                                        <div className="text-xs text-gray-200">HHI = Herfindahl-Hirschman Index</div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`S = 1 - \\frac{${params.concentration.topTradersVolume}}{${params.concentration.totalVolume}} = ${(calculatedValues.concentration).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Misst Marktverteilung. Höhere Werte bedeuten weniger Marktkonzentration bei Großinvestoren.
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
                                      <div className="font-semibold text-sm text-white">Anomale Spitzen (Handelsvolumen)</div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="A = 1 - \\frac{\\text{Anomale Spitzen}}{\\text{Handelstage}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <div className="text-xs text-gray-200 font-medium">Aktuelle Berechnung für {selectedStock}:</div>
                                        <div className="bg-white p-2 rounded border text-black overflow-hidden">
                                          <InlineMath math={`A = 1 - \\frac{${params.anomalousSpikes.spikes}}{${params.anomalousSpikes.totalTradingDays}} = ${(calculatedValues.anomalousSpikes).toFixed(3)}`} />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        Erkennt ungewöhnliche Handelsaktivität. Spikes = Anomale Volumenspitzen, Days = Handelstage. Höhere Werte = normalere Volumenmuster.
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
                                        <div className="text-xs text-gray-200 font-medium">Generelle Formel:</div>
                                        <div className="formula-container bg-muted/30 p-2 rounded">
                                          <BlockMath math="T = 1 - \frac{\text{Variationskoeffizient}}{\text{Max-Variation}}" />
                                        </div>
                                      </div>
                                      
                                      <div className="text-xs text-gray-200">
                                        CV = Variationskoeffizient, CV_max = max. Wert. Höhere Werte = stabilere Entwicklung.
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