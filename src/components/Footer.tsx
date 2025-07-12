'use client'

import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-2 px-4 text-center border-t border-gray-300">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs text-gray-400 mb-1">
          * Tracking incidents where political parties are perpetrators of violence
        </p>
        <p className="text-sm text-gray-300">
          Developed by{' '}
          <span className="font-medium text-white">Sabbir Ahamed</span>,{' '}
          <span className="font-medium text-white">Shakib Howlader</span>, {' '}
          <span className="font-medium text-white">Syed Sabbir</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Political Violence Monitor &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
