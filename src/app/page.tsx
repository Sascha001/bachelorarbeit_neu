"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { StockSearch } from "@/components/stock-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationButton } from "@/components/notification-button"
import { Progress } from "@/components/ui/progress"

// Import uncertainty calculation functions
import { getFundamentalDataParams, getNewsReliabilityParams, getTimeSeriesIntegrityParams, getTradingVolumeParams, getModelUncertaintyParams, calculateAllHumanUncertainty, getHumanUncertaintyParams } from "@/components/technical-analysis-tab"

// Calculate uncertainty data for dashboard stocks
const getDashboardStockData = (stock: string) => {
  // Get calculated scores from parameter functions (stock-specific)
  const fundamentalParams = getFundamentalDataParams(stock)
  const newsParams = getNewsReliabilityParams(stock) 
  const timeSeriesParams = getTimeSeriesIntegrityParams(stock)
  const tradingVolumeParams = getTradingVolumeParams(stock)
  
  // Calculate individual dimension certainties using calculation functions (higher score = lower uncertainty)
  const fundamentalCalculated = {
    completeness: 1 - (fundamentalParams.completeness.missingValues / fundamentalParams.completeness.totalValues),
    timeliness: Math.max(0, 1 - (fundamentalParams.timeliness.daysOld / fundamentalParams.timeliness.maxAcceptableDays)),
    consistency: 1 - (fundamentalParams.consistency.inconsistentEntries / fundamentalParams.consistency.totalEntries),
    accuracy: fundamentalParams.accuracy.accurateReports / fundamentalParams.accuracy.totalReports,
    stability: 1 - (fundamentalParams.stability.revisions / fundamentalParams.stability.totalDataPoints)
  };
  const fundamentalCertainty = (0.2 * fundamentalCalculated.completeness + 
                               0.2 * fundamentalCalculated.timeliness + 
                               0.2 * fundamentalCalculated.consistency + 
                               0.2 * fundamentalCalculated.accuracy + 
                               0.2 * fundamentalCalculated.stability) * 100
  
  const newsCalculated = {
    sourceReliability: newsParams.sourceReliability.averageReliability,
    reputationAccuracy: 1 - (newsParams.reputationAccuracy.falseNews / newsParams.reputationAccuracy.totalNews),
    crossSourceConsensus: newsParams.crossSourceConsensus.confirmedNews / newsParams.crossSourceConsensus.totalNews,
    biasCheck: 1 - (newsParams.biasCheck.biasIndex / newsParams.biasCheck.maxBiasValue)
  };
  const newsCertainty = (0.3 * newsCalculated.sourceReliability + 
                        0.3 * newsCalculated.reputationAccuracy + 
                        0.25 * newsCalculated.crossSourceConsensus + 
                        0.15 * newsCalculated.biasCheck) * 100
  
  const timeSeriesCalculated = {
    completeness: 1 - (timeSeriesParams.completeness.missingTimepoints / timeSeriesParams.completeness.expectedTimepoints),
    outlierFreedom: 1 - (timeSeriesParams.outlierFreedom.outliers / timeSeriesParams.outlierFreedom.totalObservations),
    revisionStability: 1 - (timeSeriesParams.revisionStability.revisedValues / timeSeriesParams.revisionStability.totalValues),
    continuity: 1 - (timeSeriesParams.continuity.gaps / timeSeriesParams.continuity.totalIntervals)
  };
  const timeSeriesCertainty = (0.25 * timeSeriesCalculated.completeness + 
                              0.25 * timeSeriesCalculated.outlierFreedom + 
                              0.25 * timeSeriesCalculated.revisionStability + 
                              0.25 * timeSeriesCalculated.continuity) * 100
  
  const tradingVolumeCalculated = {
    concentration: 1 - (tradingVolumeParams.concentration.topTradersVolume / tradingVolumeParams.concentration.totalVolume),
    anomalousSpikes: 1 - (tradingVolumeParams.anomalousSpikes.spikes / tradingVolumeParams.anomalousSpikes.totalTradingDays),
    timeStability: 1 - (tradingVolumeParams.timeStability.varianceCoefficient / tradingVolumeParams.timeStability.maxVarianceCoefficient)
  };
  const tradingVolumeCertainty = (0.4 * tradingVolumeCalculated.concentration + 
                                 0.3 * tradingVolumeCalculated.anomalousSpikes + 
                                 0.3 * tradingVolumeCalculated.timeStability) * 100
  
  // STEP 1: Calculate average certainty for data dimension (4 parameters)
  const dataCertainty = (fundamentalCertainty + newsCertainty + timeSeriesCertainty + tradingVolumeCertainty) / 4
  
  // STEP 2: Calculate model certainty using ChatGPT Framework
  const modelParams = getModelUncertaintyParams(stock)
  
  // Calculate the actual values using the calculation functions
  const epistemicValue = 1 - (modelParams.epistemicUncertainty.predictionStdDev / (modelParams.epistemicUncertainty.meanPrediction + modelParams.epistemicUncertainty.epsilon))
  const aleatoricValue = 1 - (modelParams.aleatoricUncertainty.meanPredictionVariance / modelParams.aleatoricUncertainty.maxExpectedVariance)
  const overfittingValue = 1 - (Math.abs(modelParams.overfittingRisk.trainLoss - modelParams.overfittingRisk.testLoss) / (modelParams.overfittingRisk.trainLoss + modelParams.overfittingRisk.epsilon))
  const robustnessValue = 1 - (modelParams.robustness.meanPerturbationChange / modelParams.robustness.baselinePrediction)
  const explanationValue = (modelParams.explanationConsistency.featureImportanceCorrelation + 1) / 2
  
  const modelCertainty = (0.25 * epistemicValue + 
                         0.15 * aleatoricValue + 
                         0.20 * overfittingValue + 
                         0.20 * robustnessValue + 
                         0.20 * explanationValue) * 100
  
  // STEP 3: Calculate human certainty from static parameters (pure static data)
  const humanParams = getHumanUncertaintyParams(stock)
  const humanCalculated = calculateAllHumanUncertainty(humanParams)
  
  // Convert human uncertainty to certainty (weighted average of 4 dimensions)
  const humanCertainty = (1 - (0.3 * humanCalculated.perceivedUncertainty + 
                               0.25 * humanCalculated.epistemicUncertainty + 
                               0.25 * humanCalculated.aleatoricUncertainty + 
                               0.2 * humanCalculated.decisionStability)) * 100
  
  // STEP 4: Convert certainties to uncertainties (inversion)
  const dataUncertaintyRaw = 100 - dataCertainty
  const modelUncertaintyRaw = 100 - modelCertainty  
  const humanUncertaintyRaw = 100 - humanCertainty
  
  // STEP 5: Calculate total uncertainty (sum divided by maximum possible = 300%)
  const totalUncertaintyRaw = dataUncertaintyRaw + modelUncertaintyRaw + humanUncertaintyRaw
  const totalUncertainty = Math.round((totalUncertaintyRaw / 300) * 100)
  
  // Get confidence level and recommendation
  const getConfidenceLevel = (uncertainty: number) => {
    if (uncertainty < 11) return "SEHR SICHER"
    if (uncertainty < 21) return "SICHER"
    if (uncertainty < 36) return "UNSICHER"
    return "SEHR UNSICHER"
  }
  
  const getRecommendation = (uncertainty: number, stock: string) => {
    const stockAnalysis: Record<string, string> = {
      AAPL: "BUY", MSFT: "BUY", GOOGL: "BUY", V: "BUY", MA: "BUY",
      JNJ: "BUY", PG: "BUY", KO: "BUY", UNH: "BUY",
      HD: "HOLD", JPM: "HOLD",
      TSLA: "SELL", META: "HOLD", NVDA: "SELL", AMZN: "HOLD"
    };
    
    const marketRecommendation = stockAnalysis[stock] || "HOLD";
    if (uncertainty > 40) return "HOLD";
    return marketRecommendation;
  }

  return {
    totalUncertainty,
    confidenceLevel: getConfidenceLevel(totalUncertainty),
    recommendation: getRecommendation(totalUncertainty, stock)
  }
}

export default function Home() {
  // Get uncertainty data for dashboard stocks (one per uncertainty category)
  const vData = getDashboardStockData("V")        // SEHR SICHER (~8%)
  const msftData = getDashboardStockData("MSFT")  // SICHER (~16%)
  const aaplData = getDashboardStockData("AAPL")  // UNSICHER (~26%)
  const tslaData = getDashboardStockData("TSLA")  // SEHR UNSICHER (~47%)

  // Calculate average uncertainty across all 23 supported stocks
  const getAllStocksUncertainty = () => {
    // All 23 supported stocks in the system
    const allStocks = [
      // US Tech Giants (7)
      "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA",
      // US Financial (4)
      "JPM", "V", "MA", "BRK_B",
      // US Healthcare/Consumer (4)
      "JNJ", "UNH", "PG", "KO",
      // US Retail (1)
      "HD",
      // European Stocks (7)
      "ALV.DE", "NESN.SW", "SAP.DE", "SIE.DE", "ASML.AS", "BMW.DE", "BAS.DE"
    ]

    // Calculate uncertainty for each stock and get averages
    let totalUncertaintySum = 0
    let dataUncertaintySum = 0
    let modelUncertaintySum = 0
    let humanUncertaintySum = 0

    allStocks.forEach(stock => {
      const stockData = getDashboardStockData(stock)
      const stockBreakdown = getDetailedUncertaintyData(stock)
      
      totalUncertaintySum += stockData.totalUncertainty
      dataUncertaintySum += stockBreakdown.dataUncertainty
      modelUncertaintySum += stockBreakdown.modelUncertainty
      humanUncertaintySum += stockBreakdown.humanUncertainty
    })

    // Calculate simple averages across all 23 stocks
    const avgTotalUncertainty = totalUncertaintySum / allStocks.length
    const avgDataUncertainty = dataUncertaintySum / allStocks.length
    const avgModelUncertainty = modelUncertaintySum / allStocks.length
    const avgHumanUncertainty = humanUncertaintySum / allStocks.length

    // Get confidence level for average uncertainty
    const getConfidenceLevel = (uncertainty: number) => {
      if (uncertainty < 11) return "SEHR SICHER"
      if (uncertainty < 21) return "SICHER"
      if (uncertainty < 36) return "UNSICHER"
      return "SEHR UNSICHER"
    }

    return {
      totalUncertainty: Math.round(avgTotalUncertainty),
      dataUncertainty: Math.round(avgDataUncertainty * 10) / 10,
      modelUncertainty: Math.round(avgModelUncertainty * 10) / 10,
      humanUncertainty: Math.round(avgHumanUncertainty * 10) / 10,
      confidenceLevel: getConfidenceLevel(avgTotalUncertainty)
    }
  }

  // Helper function to get detailed uncertainty breakdown for a stock
  const getDetailedUncertaintyData = (stock: string) => {
    // Get calculated scores from parameter functions (stock-specific) - same logic as getDashboardStockData but returns breakdown
    const fundamentalParams = getFundamentalDataParams(stock)
    const newsParams = getNewsReliabilityParams(stock) 
    const timeSeriesParams = getTimeSeriesIntegrityParams(stock)
    const tradingVolumeParams = getTradingVolumeParams(stock)
    
    const fundamentalCalculated = {
      completeness: 1 - (fundamentalParams.completeness.missingValues / fundamentalParams.completeness.totalValues),
      timeliness: Math.max(0, 1 - (fundamentalParams.timeliness.daysOld / fundamentalParams.timeliness.maxAcceptableDays)),
      consistency: 1 - (fundamentalParams.consistency.inconsistentEntries / fundamentalParams.consistency.totalEntries),
      accuracy: fundamentalParams.accuracy.accurateReports / fundamentalParams.accuracy.totalReports,
      stability: 1 - (fundamentalParams.stability.revisions / fundamentalParams.stability.totalDataPoints)
    };
    const fundamentalCertainty = (0.2 * fundamentalCalculated.completeness + 0.2 * fundamentalCalculated.timeliness + 0.2 * fundamentalCalculated.consistency + 0.2 * fundamentalCalculated.accuracy + 0.2 * fundamentalCalculated.stability) * 100
    
    const newsCalculated = {
      sourceReliability: newsParams.sourceReliability.averageReliability,
      reputationAccuracy: 1 - (newsParams.reputationAccuracy.falseNews / newsParams.reputationAccuracy.totalNews),
      crossSourceConsensus: newsParams.crossSourceConsensus.confirmedNews / newsParams.crossSourceConsensus.totalNews,
      biasCheck: 1 - (newsParams.biasCheck.biasIndex / newsParams.biasCheck.maxBiasValue)
    };
    const newsCertainty = (0.3 * newsCalculated.sourceReliability + 0.3 * newsCalculated.reputationAccuracy + 0.25 * newsCalculated.crossSourceConsensus + 0.15 * newsCalculated.biasCheck) * 100
    
    const timeSeriesCalculated = {
      completeness: 1 - (timeSeriesParams.completeness.missingTimepoints / timeSeriesParams.completeness.expectedTimepoints),
      outlierFreedom: 1 - (timeSeriesParams.outlierFreedom.outliers / timeSeriesParams.outlierFreedom.totalObservations),
      revisionStability: 1 - (timeSeriesParams.revisionStability.revisedValues / timeSeriesParams.revisionStability.totalValues),
      continuity: 1 - (timeSeriesParams.continuity.gaps / timeSeriesParams.continuity.totalIntervals)
    };
    const timeSeriesCertainty = (0.25 * timeSeriesCalculated.completeness + 0.25 * timeSeriesCalculated.outlierFreedom + 0.25 * timeSeriesCalculated.revisionStability + 0.25 * timeSeriesCalculated.continuity) * 100
    
    const tradingVolumeCalculated = {
      concentration: 1 - (tradingVolumeParams.concentration.topTradersVolume / tradingVolumeParams.concentration.totalVolume),
      anomalousSpikes: 1 - (tradingVolumeParams.anomalousSpikes.spikes / tradingVolumeParams.anomalousSpikes.totalTradingDays),
      timeStability: 1 - (tradingVolumeParams.timeStability.varianceCoefficient / tradingVolumeParams.timeStability.maxVarianceCoefficient)
    };
    const tradingVolumeCertainty = (0.4 * tradingVolumeCalculated.concentration + 0.3 * tradingVolumeCalculated.anomalousSpikes + 0.3 * tradingVolumeCalculated.timeStability) * 100
    
    const dataCertainty = (fundamentalCertainty + newsCertainty + timeSeriesCertainty + tradingVolumeCertainty) / 4
    
    const modelParams = getModelUncertaintyParams(stock)
    const epistemicValue = 1 - (modelParams.epistemicUncertainty.predictionStdDev / (modelParams.epistemicUncertainty.meanPrediction + modelParams.epistemicUncertainty.epsilon))
    const aleatoricValue = 1 - (modelParams.aleatoricUncertainty.meanPredictionVariance / modelParams.aleatoricUncertainty.maxExpectedVariance)
    const overfittingValue = 1 - (Math.abs(modelParams.overfittingRisk.trainLoss - modelParams.overfittingRisk.testLoss) / (modelParams.overfittingRisk.trainLoss + modelParams.overfittingRisk.epsilon))
    const robustnessValue = 1 - (modelParams.robustness.meanPerturbationChange / modelParams.robustness.baselinePrediction)
    const explanationValue = (modelParams.explanationConsistency.featureImportanceCorrelation + 1) / 2
    const modelCertainty = (0.25 * epistemicValue + 0.15 * aleatoricValue + 0.20 * overfittingValue + 0.20 * robustnessValue + 0.20 * explanationValue) * 100
    
    const humanParams = getHumanUncertaintyParams(stock)
    const humanCalculated = calculateAllHumanUncertainty(humanParams)
    const humanCertainty = (1 - (0.3 * humanCalculated.perceivedUncertainty + 0.25 * humanCalculated.epistemicUncertainty + 0.25 * humanCalculated.aleatoricUncertainty + 0.2 * humanCalculated.decisionStability)) * 100
    
    const dataUncertaintyRaw = 100 - dataCertainty
    const modelUncertaintyRaw = 100 - modelCertainty
    const humanUncertaintyRaw = 100 - humanCertainty
    const totalRawUncertainty = dataUncertaintyRaw + modelUncertaintyRaw + humanUncertaintyRaw
    
    return {
      dataUncertainty: Math.round((dataUncertaintyRaw / totalRawUncertainty) * 100 * 10) / 10,
      modelUncertainty: Math.round((modelUncertaintyRaw / totalRawUncertainty) * 100 * 10) / 10,
      humanUncertainty: Math.round((humanUncertaintyRaw / totalRawUncertainty) * 100 * 10) / 10
    }
  }

  const allStocksUncertainty = getAllStocksUncertainty()

  // Helper function for uncertainty colors
  const getUncertaintyColor = (confidenceLevel: string) => {
    switch (confidenceLevel) {
      case "SEHR SICHER": return "text-green-600 bg-green-500/10"
      case "SICHER": return "text-blue-600 bg-blue-500/10"
      case "UNSICHER": return "text-orange-600 bg-orange-500/10"
      case "SEHR UNSICHER": return "text-red-600 bg-red-500/10"
      default: return "text-gray-600 bg-gray-500/10"
    }
  }

  // Helper function for recommendation colors
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "BUY": return "text-green-600 bg-green-500/10"
      case "SELL": return "text-red-600 bg-red-500/10" 
      case "HOLD": return "text-blue-600 bg-blue-500/10"
      default: return "text-gray-600 bg-gray-500/10"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 violet-bloom-hover rounded-md p-2" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex-1 flex justify-center">
            <StockSearch />
          </div>
          
          <div className="flex items-center gap-2">
            <NotificationButton />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-hidden">
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Portfolio Wert */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Portfolio Wert</p>
                <p className="text-2xl font-bold text-foreground">€127.432,50</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">↗ +3.34%</span>
                </div>
                <p className="text-xs text-muted-foreground">Trending up today ↗</p>
                <p className="text-xs text-primary font-medium">Performance heute</p>
              </div>
            </div>

            {/* Aktive Positionen */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Aktive Positionen</p>
                <p className="text-2xl font-bold text-foreground">24</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">+8 neu</span>
                </div>
                <p className="text-xs text-muted-foreground">8 neue Empfehlungen 📊</p>
                <p className="text-xs text-primary font-medium">KI-Signale aktiv</p>
              </div>
            </div>

            {/* KI Vertrauen */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">KI Vertrauen</p>
                <p className="text-2xl font-bold text-foreground">87%</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">🔒 Hoch</span>
                </div>
                <p className="text-xs text-muted-foreground">Starke KI Konfidenz 🎯</p>
                <p className="text-xs text-primary font-medium">Durchschnittliche Sicherheit</p>
              </div>
            </div>

            {/* Unsicherheits-Score */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Unsicherheits-Score</p>
                <p className="text-2xl font-bold text-foreground">Medium</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full">⚠ 3 Alerts</span>
                </div>
                <p className="text-xs text-muted-foreground">3 Risiko-Alerts ⚠</p>
                <p className="text-xs text-primary font-medium">Überwachung aktiv</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Aktuelle KI-Empfehlungen */}
            <div className="lg:col-span-2 bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card min-h-0">
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Aktuelle KI-Empfehlungen</h3>
                  <p className="text-xs text-muted-foreground">Neueste Trading-Signale mit Unsicherheitsanalyse</p>
                </div>
                
                <div className="space-y-2">
                  {/* V - SEHR SICHER */}
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">V</span>
                      <span className={`text-sm px-2 py-1 rounded ${getUncertaintyColor(vData.confidenceLevel)}`}>
                        {vData.totalUncertainty}% {vData.confidenceLevel}
                      </span>
                      <span className="text-muted-foreground">$284.52</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-2 py-1 rounded ${getRecommendationColor(vData.recommendation)}`}>
                        {vData.recommendation === "BUY" ? "KAUFEN" : vData.recommendation === "SELL" ? "VERKAUFEN" : "HALTEN"}
                      </span>
                      <a 
                        href={`/statistik/unsicherheits-analyse?stock=V`}
                        className="text-primary hover:text-primary/80 text-sm cursor-pointer"
                      >
                        👁 Details
                      </a>
                    </div>
                  </div>

                  {/* MSFT - SICHER */}
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">MSFT</span>
                      <span className={`text-sm px-2 py-1 rounded ${getUncertaintyColor(msftData.confidenceLevel)}`}>
                        {msftData.totalUncertainty}% {msftData.confidenceLevel}
                      </span>
                      <span className="text-muted-foreground">$425.89</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-2 py-1 rounded ${getRecommendationColor(msftData.recommendation)}`}>
                        {msftData.recommendation === "BUY" ? "KAUFEN" : msftData.recommendation === "SELL" ? "VERKAUFEN" : "HALTEN"}
                      </span>
                      <a 
                        href={`/statistik/unsicherheits-analyse?stock=MSFT`}
                        className="text-primary hover:text-primary/80 text-sm cursor-pointer"
                      >
                        👁 Details
                      </a>
                    </div>
                  </div>

                  {/* AAPL - UNSICHER */}
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">AAPL</span>
                      <span className={`text-sm px-2 py-1 rounded ${getUncertaintyColor(aaplData.confidenceLevel)}`}>
                        {aaplData.totalUncertainty}% {aaplData.confidenceLevel}
                      </span>
                      <span className="text-muted-foreground">$178.32</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-2 py-1 rounded ${getRecommendationColor(aaplData.recommendation)}`}>
                        {aaplData.recommendation === "BUY" ? "KAUFEN" : aaplData.recommendation === "SELL" ? "VERKAUFEN" : "HALTEN"}
                      </span>
                      <a 
                        href={`/statistik/unsicherheits-analyse?stock=AAPL`}
                        className="text-primary hover:text-primary/80 text-sm cursor-pointer"
                      >
                        👁 Details
                      </a>
                    </div>
                  </div>

                  {/* TSLA - SEHR UNSICHER */}
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">TSLA</span>
                      <span className={`text-sm px-2 py-1 rounded ${getUncertaintyColor(tslaData.confidenceLevel)}`}>
                        {tslaData.totalUncertainty}% {tslaData.confidenceLevel}
                      </span>
                      <span className="text-muted-foreground">$242.68</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-2 py-1 rounded ${getRecommendationColor(tslaData.recommendation)}`}>
                        {tslaData.recommendation === "BUY" ? "KAUFEN" : tslaData.recommendation === "SELL" ? "VERKAUFEN" : "HALTEN"}
                      </span>
                      <a 
                        href={`/statistik/unsicherheits-analyse?stock=TSLA`}
                        className="text-primary hover:text-primary/80 text-sm cursor-pointer"
                      >
                        👁 Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unsicherheits-Quellen */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card min-h-0">
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Unsicherheits-Quellen</h3>
                  <p className="text-xs text-muted-foreground">Durchschnittliche Unsicherheit aller 23 Wertpapiere im System</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Modell-Unsicherheit</span>
                      <span className="text-sm text-muted-foreground ml-auto">{allStocksUncertainty.modelUncertainty}%</span>
                    </div>
                    <Progress value={allStocksUncertainty.modelUncertainty} className="w-full h-3" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Daten-Unsicherheit</span>
                      <span className="text-sm text-muted-foreground ml-auto">{allStocksUncertainty.dataUncertainty}%</span>
                    </div>
                    <Progress value={allStocksUncertainty.dataUncertainty} className="w-full h-3" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Menschliche Unsicherheit</span>
                      <span className="text-sm text-muted-foreground ml-auto">{allStocksUncertainty.humanUncertainty}%</span>
                    </div>
                    <Progress value={allStocksUncertainty.humanUncertainty} className="w-full h-3" />
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Gesamt-Unsicherheit</p>
                      <span className={`text-sm font-medium ${getUncertaintyColor(allStocksUncertainty.confidenceLevel).split(' ')[0]}`}>
                        {allStocksUncertainty.totalUncertainty}%
                      </span>
                    </div>
                    <Progress value={allStocksUncertainty.totalUncertainty} className="w-full h-3" />
                    <p className={`text-center text-sm font-medium ${getUncertaintyColor(allStocksUncertainty.confidenceLevel).split(' ')[0]}`}>
                      {allStocksUncertainty.confidenceLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Risiko-Management */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Risiko-Management</h3>
                  <p className="text-xs text-muted-foreground">Aktuelle Warnungen und Empfehlungen</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium">Hohe Volatilität erkannt</p>
                      <p className="text-xs text-muted-foreground">TSLA zeigt ungewöhnliche Kursbewegungen</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium">Datenqualität-Warnung</p>
                      <p className="text-xs text-muted-foreground">Verzögerung bei Realtime-Daten für NVDA</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium">Portfolio ausbalanciert</p>
                      <p className="text-xs text-muted-foreground">Diversifikation innerhalb der Zielwerte</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aktivitäts-Feed */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Aktivitäts-Feed</h3>
                  <p className="text-xs text-muted-foreground">Letzte Trading-Aktivitäten und KI-Updates</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium">AAPL Position eröffnet</p>
                      <p className="text-xs text-muted-foreground">vor 15 Minuten • Kauforder ausgeführt</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium">KI-Modell aktualisiert</p>
                      <p className="text-xs text-muted-foreground">vor 32 Minuten • Neue Gewichtungen aktiv</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium">Markt-Anomalie erkannt</p>
                      <p className="text-xs text-muted-foreground">vor 1 Stunde • Erhöhte Überwachung aktiv</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-xs font-medium">Stop-Loss ausgelöst</p>
                      <p className="text-xs text-muted-foreground">vor 2 Stunden • META Position geschlossen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}