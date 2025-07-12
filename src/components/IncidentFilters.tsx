'use client'

import { useState } from 'react'
import type { Filters } from '@/app/page'

interface IncidentFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export const IncidentFilters = ({ filters, onFiltersChange }: IncidentFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    })
  }

  const handlePartyChange = (value: string) => {
    onFiltersChange({
      ...filters,
      politicalParty: value
    })
  }

  const handleSeverityChange = (severity: string, checked: boolean) => {
    const newSeverity = checked
      ? [...filters.severity, severity]
      : filters.severity.filter(s => s !== severity)
    
    onFiltersChange({
      ...filters,
      severity: newSeverity
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      dateRange: { start: '', end: '' },
      politicalParty: '',
      severity: []
    })
  }

  const severityOptions = [
    { value: 'light', label: 'হালকা', color: '#ffeb3b' },
    { value: 'medium', label: 'মধ্যম', color: '#ff9800' },
    { value: 'heavy', label: 'ভারী', color: '#f44336' },
    { value: 'severe', label: 'গুরুতর', color: '#1a1a1a' }
  ]

  const commonParties = [
    'আওয়ামী লীগ',
    'বিএনপি',
    'জাতীয় পার্টি',
    'জামায়াতে ইসলামী',
    'এনসিপি',
    'অন্যান্য'
  ]

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">ফিল্টার</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? 'কম' : 'আরো'}
        </button>
      </div>

      {/* Date Range - Always visible */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">
          তারিখের পরিসর
        </label>
        <div className="grid grid-cols-2 gap-1">
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            className="block w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
            placeholder="শুরু"
          />
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            className="block w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
            placeholder="শেষ"
          />
        </div>
      </div>

      {/* Political Party - Always visible */}
      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">
          অপরাধী দল (Perpetrator Party)
        </label>
        <select
          value={filters.politicalParty}
          onChange={(e) => handlePartyChange(e.target.value)}
          className="block w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
        >
          <option value="" className="text-gray-500">সব দল</option>
          {commonParties.map(party => (
            <option key={party} value={party} className="text-gray-900">
              {party}
            </option>
          ))}
        </select>
      </div>

      {/* Expandable Severity Section */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-2 pt-2">
          <label className="block text-sm font-medium text-gray-700">
            তীব্রতার স্তর
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {severityOptions.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.severity.includes(option.value)}
                  onChange={(e) => handleSeverityChange(option.value, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  ></span>
                  <span className="truncate">{option.label}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters - Always visible */}
      <button
        onClick={clearFilters}
        className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        সব ফিল্টার মুছুন
      </button>
    </div>
  )
}
