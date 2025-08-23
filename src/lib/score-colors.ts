/**
 * Utility functions for consistent score-based color coding throughout the application
 */

export interface ScoreColors {
  bg: string;
  border: string;
  text: string;
}

export interface PercentageColors {
  text: string;
  bg?: string;
  border?: string;
}

/**
 * Returns color classes for score values based on quality ranges
 * ≥90% = Excellent (Green)
 * 70-89% = Good (Yellow/Orange)
 * <70% = Poor (Red)
 */
export const getScoreColor = (score: number): ScoreColors => {
  if (score >= 90) {
    return { 
      bg: 'bg-green-500/5', 
      border: 'border-green-500/20', 
      text: 'text-green-700 dark:text-green-400' 
    }
  }
  if (score >= 70) {
    return { 
      bg: 'bg-yellow-500/5', 
      border: 'border-yellow-500/20', 
      text: 'text-yellow-700 dark:text-yellow-400' 
    }
  }
  return { 
    bg: 'bg-red-500/5', 
    border: 'border-red-500/20', 
    text: 'text-red-700 dark:text-red-400' 
  }
}

/**
 * Returns color classes for percentage values (simpler version for inline text)
 * ≥90% = Green
 * 70-89% = Yellow/Orange  
 * <70% = Red
 */
export const getPercentageColor = (percentage: number): PercentageColors => {
  if (percentage >= 90) {
    return { text: 'text-green-600 dark:text-green-400' }
  }
  if (percentage >= 70) {
    return { text: 'text-yellow-600 dark:text-yellow-400' }
  }
  return { text: 'text-red-600 dark:text-red-400' }
}

/**
 * Returns color classes for uncertainty/risk values (inverted logic)
 * <30% uncertainty = Good (Green)
 * 30-60% uncertainty = Medium (Yellow)
 * >60% uncertainty = High (Red)
 */
export const getUncertaintyColor = (uncertaintyLevel: number): PercentageColors => {
  if (uncertaintyLevel < 30) {
    return { text: 'text-green-600 dark:text-green-400' }
  }
  if (uncertaintyLevel < 60) {
    return { text: 'text-yellow-600 dark:text-yellow-400' }
  }
  return { text: 'text-red-600 dark:text-red-400' }
}

/**
 * Returns Badge color classes for confidence levels
 */
export const getConfidenceColor = (confidence: string): string => {
  switch (confidence.toUpperCase()) {
    case "HOCH": 
    case "EXCELLENT":
      return "bg-green-500/10 text-green-600 border-green-500/20"
    case "MITTEL": 
    case "GOOD":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    case "NIEDRIG":
    case "FAIR": 
      return "bg-orange-500/10 text-orange-600 border-orange-500/20"
    case "SEHR NIEDRIG":
    case "POOR":
      return "bg-red-500/10 text-red-600 border-red-500/20"
    default: 
      return "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }
}

/**
 * Returns color classes for recommendation types
 */
export const getRecommendationColor = (recommendation: string): string => {
  switch (recommendation.toUpperCase()) {
    case "BUY": 
      return "bg-green-500/10 text-green-600 border-green-500/20"
    case "HOLD": 
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "SELL": 
      return "bg-red-500/10 text-red-600 border-red-500/20"
    default: 
      return "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }
}