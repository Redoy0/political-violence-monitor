'use client'

import { useEffect, useState } from 'react'
import type { Incident } from '@/app/page'
import { LoadingSpinner } from './LoadingSpinner'

interface MapWrapperProps {
  incidents: Incident[]
  selectedIncident: Incident | null
  onIncidentSelect: (incident: Incident) => void
}

export default function MapWrapper(props: MapWrapperProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<MapWrapperProps> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMap = async () => {
      try {
        // Dynamically import only on client side
        if (typeof window !== 'undefined') {
          const { default: MapVisualization } = await import('./MapVisualization')
          setMapComponent(() => MapVisualization)
        }
      } catch (error) {
        console.error('Failed to load map component:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMap()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  if (!MapComponent) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <p className="text-gray-500">Map could not be loaded</p>
      </div>
    )
  }

  return <MapComponent {...props} />
}
