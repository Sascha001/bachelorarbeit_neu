import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DataSource } from "@/services/stockDataService"

interface DataSourceBadgeProps {
  source: DataSource
  isLive?: boolean
  showTooltip?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DataSourceBadge({ 
  source, 
  isLive, 
  showTooltip = true,
  size = 'sm',
  className = '' 
}: DataSourceBadgeProps) {
  const getSourceInfo = (source: DataSource) => {
    const sourceInfo = {
      yahoo: {
        name: 'Yahoo Finance',
        shortName: 'Live',
        color: 'bg-green-500 hover:bg-green-600 text-white',
        description: 'Live-Kursdaten von Yahoo Finance',
        isLive: true
      },
      'alpha-vantage': {
        name: 'Alpha Vantage',
        shortName: 'Live',
        color: 'bg-green-500 hover:bg-green-600 text-white',
        description: 'Live-Kursdaten von Alpha Vantage API',
        isLive: true
      },
      cache: {
        name: 'Zwischenspeicher',
        shortName: 'Cache',
        color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        description: 'Gespeicherte Live-Daten (bis zu 5 Min. alt)',
        isLive: false
      },
      mock: {
        name: 'Demo-Daten',
        shortName: 'Demo',
        color: 'bg-gray-500 hover:bg-gray-600 text-white',
        description: 'Simulierte Kursdaten für Demonstrationszwecke',
        isLive: false
      }
    }

    return sourceInfo[source] || sourceInfo.mock
  }

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 h-5',
    md: 'text-sm px-2 py-1 h-6',
    lg: 'text-base px-3 py-1.5 h-8'
  }

  const info = getSourceInfo(source)
  const actualIsLive = isLive !== undefined ? isLive : info.isLive

  const badge = (
    <Badge 
      className={`${info.color} ${sizeClasses[size]} ${className} border-0 font-medium transition-colors`}
      title={showTooltip ? undefined : info.description}
    >
      {info.shortName}
      {size !== 'sm' && actualIsLive && (
        <span className="ml-1 h-2 w-2 bg-white rounded-full animate-pulse" />
      )}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-medium">{info.name}</p>
          <p className="text-sm text-muted-foreground">{info.description}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className={`h-2 w-2 rounded-full ${actualIsLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span>{actualIsLive ? 'Live-Daten' : 'Statische Daten'}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

// Wrapper für einfache Verwendung mit nur dem Source-Parameter
export function SimpleDataSourceBadge({ source }: { source: DataSource }) {
  return <DataSourceBadge source={source} />
}