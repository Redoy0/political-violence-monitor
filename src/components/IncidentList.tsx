'use client'

import type { Incident } from '@/app/page'
import { formatDateSafe } from '@/lib/date-utils'

interface IncidentListProps {
  incidents: Incident[]
  selectedIncident: Incident | null
  onIncidentSelect: (incident: Incident) => void
  loading: boolean
}

export const IncidentList = ({ 
  incidents, 
  selectedIncident, 
  onIncidentSelect, 
  loading 
}: IncidentListProps) => {
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

  const formatDate = (dateString: string) => {
    return formatDateSafe(dateString)
  }

  if (loading) {
    return (
      <div className="p-2">
        <div className="animate-pulse space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-16 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (incidents.length === 0) {
    return (
      <div className="p-3 text-center text-gray-500">
        <p className="text-sm">কোন ঘটনা পাওয়া যায়নি</p>
      </div>
    )
  }

  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800 text-sm">
          ঘটনা ({incidents.length})
        </h3>
      </div>

      {incidents.map((incident) => (
        <div
          key={incident.id}
          onClick={() => onIncidentSelect(incident)}
          className={`
            p-2 rounded border cursor-pointer transition-all duration-200
            ${selectedIncident?.id === incident.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-gray-900 text-xs leading-tight pr-1 flex-1">
              {incident.title.length > 40 ? incident.title.substring(0, 40) + '...' : incident.title}
            </h4>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: getSeverityColor(incident.severity) }}
              title={getSeverityText(incident.severity)}
            ></div>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{incident.location}</span>
              </span>
              <span className="text-xs text-gray-500">{formatDate(incident.date).split(' ')[0]}</span>
            </div>

            <div className="text-gray-800 font-medium text-xs truncate">
              {incident.politicalParty}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-red-600 text-xs">
                  নিহত: {incident.killed}
                </span>
                <span className="text-orange-600 text-xs">
                  আহত: {incident.injured}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
