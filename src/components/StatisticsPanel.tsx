'use client'

import type { Incident } from '@/app/page'

interface StatisticsPanelProps {
  incidents: Incident[]
}

export const StatisticsPanel = ({ incidents }: StatisticsPanelProps) => {
  const totalKilled = incidents.reduce((sum, incident) => sum + incident.killed, 0)
  const totalInjured = incidents.reduce((sum, incident) => sum + incident.injured, 0)
  
  const severityStats = incidents.reduce((stats, incident) => {
    stats[incident.severity] = (stats[incident.severity] || 0) + 1
    return stats
  }, {} as Record<string, number>)

  const partyStats = incidents.reduce((stats, incident) => {
    const party = incident.politicalParty || 'অজানা'
    stats[party] = (stats[party] || 0) + 1
    return stats
  }, {} as Record<string, number>)

  const topParties = Object.entries(partyStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'light': return '#ffeb3b'
      case 'medium': return '#ff9800'
      case 'heavy': return '#f44336'
      case 'severe': return '#1a1a1a'
      default: return '#2196f3'
    }
  }

  const getSeverityText = (severity: string): string => {
    switch (severity) {
      case 'light': return 'হালকা'
      case 'medium': return 'মধ্যম'
      case 'heavy': return 'ভারী'
      case 'severe': return 'গুরুতর'
      default: return 'অজানা'
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-800">পরিসংখ্যান</h3>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-1">
        <div className="bg-blue-50 p-1.5 rounded text-center">
          <div className="text-sm font-bold text-blue-600">{incidents.length}</div>
          <div className="text-xs text-blue-800">ঘটনা</div>
        </div>
        <div className="bg-red-50 p-1.5 rounded text-center">
          <div className="text-sm font-bold text-red-600">{totalKilled}</div>
          <div className="text-xs text-red-800">নিহত</div>
        </div>
        <div className="bg-orange-50 p-1.5 rounded text-center">
          <div className="text-sm font-bold text-orange-600">{totalInjured}</div>
          <div className="text-xs text-orange-800">আহত</div>
        </div>
      </div>

      {/* Severity Breakdown */}
      <div>
        <h4 className="text-xs font-medium text-gray-700 mb-1">তীব্রতা</h4>
        <div className="space-y-1">
          {Object.entries(severityStats).map(([severity, count]) => (
            <div key={severity} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
                  style={{ backgroundColor: getSeverityColor(severity) }}
                ></div>
                <span className="text-xs text-gray-700">
                  {getSeverityText(severity)}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Political Parties */}
      {topParties.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1">অপরাধী দল</h4>
          <div className="space-y-1">
            {topParties.slice(0, 2).map(([party, count]) => (
              <div key={party} className="flex items-center justify-between">
                <span className="text-xs text-gray-700 truncate flex-1 pr-1" title={party}>
                  {party.length > 12 ? party.substring(0, 12) + '...' : party}
                </span>
                <span className="text-xs font-medium text-gray-900 flex-shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
