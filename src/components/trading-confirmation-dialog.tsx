"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { Slider } from "@/components/ui/slider" // Component not available - using range input instead
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface TradingConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (uncertaintyData: TradingUncertaintyData) => void
  tradingData: {
    symbol: string
    action: 'buy' | 'sell'
    amount: number
    price: number
    totalValue: number
    aiConfidence: number
    aiRecommendation: string
    marketSentiment: string
  }
}

export function TradingConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  tradingData 
}: TradingConfirmationDialogProps) {
  const [perceivedUncertainty, setPerceivedUncertainty] = useState([3]) // Default to middle (neutral)
  const [unclearConcepts, setUnclearConcepts] = useState<string[]>([])

  const concepts = [
    {
      id: 'aiRecommendation',
      label: 'KI-Empfehlung verstanden',
      tooltip: 'Die Begründung der KI-Empfehlung ist mir klar und nachvollziehbar.'
    },
    {
      id: 'marketAnalysis', 
      label: 'Marktanalyse nachvollziehbar',
      tooltip: 'Ich verstehe die zugrunde liegenden Marktfaktoren und Trends.'
    },
    {
      id: 'riskAssessment',
      label: 'Risiken bewusst',
      tooltip: 'Mir sind die möglichen Verluste und Risiken dieser Entscheidung klar.'
    },
    {
      id: 'financialImpact',
      label: 'Finanzielle Auswirkung verstanden', 
      tooltip: 'Ich verstehe, wie sich diese Entscheidung auf mein Portfolio auswirkt.'
    }
  ]

  const handleConceptToggle = (conceptId: string, isUnclear: boolean) => {
    if (isUnclear) {
      setUnclearConcepts(prev => [...prev.filter(id => id !== conceptId), conceptId])
    } else {
      setUnclearConcepts(prev => prev.filter(id => id !== conceptId))
    }
  }

  const handleConfirm = () => {
    const uncertaintyData: TradingUncertaintyData = {
      timestamp: new Date(),
      symbol: tradingData.symbol,
      action: tradingData.action,
      amount: tradingData.amount,
      price: tradingData.price,
      perceivedUncertainty: perceivedUncertainty[0],
      unclearConcepts,
      aiConfidence: tradingData.aiConfidence,
      marketCondition: tradingData.marketSentiment
    }

    onConfirm(uncertaintyData)
  }

  const getUncertaintyLabel = (value: number) => {
    const labels = ['Sehr sicher', 'Sicher', 'Neutral', 'Unsicher', 'Sehr unsicher']
    return labels[value - 1] || 'Neutral'
  }

  const getUncertaintyColor = (value: number) => {
    if (value <= 2) return 'text-green-600'
    if (value === 3) return 'text-yellow-600' 
    return 'text-red-600'
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-2xl violet-bloom-card uncertainty-modal-positioning">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {tradingData.action === 'buy' ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Unsicherheits-Assessment
              </DialogTitle>
            </div>
            <DialogDescription>
              Bewerten Sie Ihre Unsicherheit bei dieser {tradingData.action === 'buy' ? 'Kauf' : 'Verkauf'}sentscheidung
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Uncertainty Assessment */}
            <div className="space-y-4 relative">
              <h3 className="font-medium text-foreground">Unsicherheits-Assessment</h3>
              
              {/* Perceived Uncertainty Slider */}
              <div className="p-4 border border-primary/20 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Wie sicher fühlen Sie sich bei dieser Entscheidung?
                  </label>
                  <span className={`text-sm font-medium ${getUncertaintyColor(perceivedUncertainty[0])}`}>
                    {getUncertaintyLabel(perceivedUncertainty[0])}
                  </span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={perceivedUncertainty[0]}
                    onChange={(e) => setPerceivedUncertainty([parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Sehr sicher</span>
                    <span>Neutral</span>
                    <span>Sehr unsicher</span>
                  </div>
                </div>
              </div>

              {/* Concept Understanding */}
              <div className="p-4 border border-primary/20 rounded-lg space-y-3">
                <h4 className="text-sm font-medium">Verständnis-Check</h4>
                <p className="text-xs text-muted-foreground">
                  Markieren Sie &quot;Unklar&quot;, wenn Sie Konzepte nicht vollständig verstehen
                </p>
                
                <div className="space-y-3">
                  {concepts.map(concept => (
                    <div key={concept.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id={concept.id}
                          checked={!unclearConcepts.includes(concept.id)}
                          onCheckedChange={(checked) => handleConceptToggle(concept.id, !checked)}
                        />
                        <label 
                          htmlFor={concept.id} 
                          className="text-sm cursor-pointer"
                        >
                          {concept.label}
                        </label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{concept.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConceptToggle(concept.id, true)}
                        className={`text-xs ${unclearConcepts.includes(concept.id) ? 'bg-red-100 text-red-700' : ''}`}
                      >
                        {unclearConcepts.includes(concept.id) ? 'Unklar ✓' : 'Unklar?'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Absolutely Positioned Warning Box */}
              <div 
                className={`absolute right-[-350px] top-8 w-64 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 transition-opacity duration-300 ease-in-out ${
                  perceivedUncertainty[0] >= 4 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  Sie haben eine hohe Unsicherheit angegeben. Möchten Sie die Entscheidung nochmals überdenken?
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Überspringen
            </Button>
            <Button onClick={handleConfirm} className="violet-bloom-button">
              <HelpCircle className="h-4 w-4 mr-2" />
              Assessment senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}