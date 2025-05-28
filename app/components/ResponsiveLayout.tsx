'use client'

import { ReactNode } from 'react'

interface ResponsiveLayoutProps {
  children: ReactNode
  className?: string
}

export default function ResponsiveLayout({ children, className = '' }: ResponsiveLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container-responsive py-4 sm:py-6 md:py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

// Responsive grid components
export function ResponsiveGrid({ children, className = '' }: ResponsiveLayoutProps) {
  return (
    <div className={`grid-responsive ${className}`}>
      {children}
    </div>
  )
}

// Responsive card component
export function ResponsiveCard({ children, className = '' }: ResponsiveLayoutProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  )
}

// Responsive table container
export function ResponsiveTableContainer({ children, className = '' }: ResponsiveLayoutProps) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

// Responsive form group
export function ResponsiveFormGroup({ children, className = '' }: ResponsiveLayoutProps) {
  return (
    <div className={`space-y-2 sm:space-y-3 ${className}`}>
      {children}
    </div>
  )
}

// Responsive button group
export function ResponsiveButtonGroup({ children, className = '' }: ResponsiveLayoutProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${className}`}>
      {children}
    </div>
  )
} 