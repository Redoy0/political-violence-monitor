'use client'

import { useState, useEffect, useCallback } from 'react'
import { IncidentFilters } from '@/components/IncidentFilters'
import { IncidentList } from '@/components/IncidentList'
import { StatisticsPanel } from '@/components/StatisticsPanel'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import MapVisualization from '@/components/MapVisualization'
import ClientOnly from '@/components/ClientOnly'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Footer } from '@/components/Footer'

export interface Incident {
  id: string
  title: string
  location: string
  latitude: number
  longitude: number
  injured: number
  killed: number
  politicalParty: string
  date: string
  severity: 'light' | 'medium' | 'heavy' | 'severe'
  description: string
  sourceUrl: string
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface Filters {
  dateRange: {
    start: string
    end: string
  }
  politicalParty: string
  severity: string[]
}

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [filters, setFilters] = useState<Filters>({
    dateRange: {
      start: '',
      end: ''
    },
    politicalParty: '',
    severity: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  const applyFilters = useCallback(() => {
    let filtered = incidents

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(incident => {
        const incidentDate = new Date(incident.date)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        return incidentDate >= startDate && incidentDate <= endDate
      })
    }

    // Political party filter
    if (filters.politicalParty) {
      filtered = filtered.filter(incident => 
        incident.politicalParty.toLowerCase().includes(filters.politicalParty.toLowerCase())
      )
    }

    // Severity filter
    if (filters.severity.length > 0) {
      filtered = filtered.filter(incident => 
        filters.severity.includes(incident.severity)
      )
    }

    setFilteredIncidents(filtered)
  }, [incidents, filters])

  useEffect(() => {
    fetchIncidents()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [incidents, filters, applyFilters])

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/incidents')
      const data = await response.json()
      setIncidents(data.incidents || [])
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-3 sm:p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Political Violence Monitor
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Tracking political violence incidents by perpetrator party
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col max-h-screen lg:max-h-none overflow-hidden">
            {/* Filters */}
            <div className="p-2 sm:p-3 border-b border-gray-200">
              <ClientOnly fallback={<div className="h-20 bg-gray-100 animate-pulse rounded"></div>}>
                <IncidentFilters 
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </ClientOnly>
            </div>

            {/* Statistics */}
            <div className="p-2 sm:p-3 border-b border-gray-200">
              <ClientOnly fallback={<div className="h-16 bg-gray-100 animate-pulse rounded"></div>}>
                <StatisticsPanel incidents={filteredIncidents} />
              </ClientOnly>
            </div>

            {/* Incident List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <ClientOnly fallback={<div className="h-40 bg-gray-100 animate-pulse rounded m-2"></div>}>
                <IncidentList 
                  incidents={filteredIncidents}
                  selectedIncident={selectedIncident}
                  onIncidentSelect={setSelectedIncident}
                  loading={loading}
                />
              </ClientOnly>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-0">
            <ClientOnly 
              fallback={
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              }
            >
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              ) : (
                <MapVisualization 
                  incidents={filteredIncidents}
                  selectedIncident={selectedIncident}
                  onIncidentSelect={setSelectedIncident}
                />
              )}
            </ClientOnly>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  )
}
