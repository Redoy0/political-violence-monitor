'use client'

import { useEffect, useState } from 'react'
import type { Incident } from '@/app/page'
import { formatDateBengali } from '@/lib/date-utils'

interface MapVisualizationProps {
  incidents: Incident[]
  selectedIncident: Incident | null
  onIncidentSelect: (incident: Incident) => void
}

const MapVisualization = ({ incidents, selectedIncident, onIncidentSelect }: MapVisualizationProps) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
    return formatDateBengali(dateString)
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full bg-gray-100">
      {/* Map Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-700">
          ইন্টারেক্টিভ ম্যাপ - {incidents.length}টি ঘটনা
        </h3>
        <p className="text-sm text-gray-500">
          বাংলাদেশের রাজনৈতিক সহিংসতার ঘটনা দেখানো হচ্ছে
        </p>
      </div>

      {/* Map Area - Grid view of incidents */}
      <div className="flex-1 overflow-auto p-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-full">
          {incidents.map((incident) => (
            <div 
              key={incident.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedIncident?.id === incident.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => onIncidentSelect(incident)}
            >
              {/* Severity indicator */}
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="px-2 py-1 rounded text-white text-xs font-medium"
                  style={{ backgroundColor: getSeverityColor(incident.severity) }}
                >
                  {getSeverityText(incident.severity)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(incident.date)}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-semibold text-sm text-gray-800 mb-2">
                {incident.title}
              </h4>

              {/* Location */}
              <div className="flex items-center text-xs text-gray-600 mb-2">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {incident.location}
              </div>

              {/* Political Party */}
              <div className="text-xs text-gray-600 mb-2">
                <span className="font-medium">দল:</span> {incident.politicalParty}
              </div>

              {/* Casualties */}
              <div className="flex gap-3 text-xs">
                <span className="text-red-600">
                  <span className="font-semibold">নিহত:</span> {incident.killed}
                </span>
                <span className="text-orange-600">
                  <span className="font-semibold">আহত:</span> {incident.injured}
                </span>
              </div>

              {/* Description preview */}
              <p className="text-xs text-gray-500 mt-2">
                {incident.description.substring(0, 100)}...
              </p>
            </div>
          ))}
        </div>

        {incidents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">কোনো ঘটনা পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapVisualization
