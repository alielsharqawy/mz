'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface FormProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export default function Form({ isOpen, onClose, children, title }: FormProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="form-backdrop" onClick={onClose}>
      <div 
        className="form-content" 
        onClick={e => e.stopPropagation()}
      >
        <div className="form-header">
          <h2 className="form-title">{title}</h2>
          <button
            onClick={onClose}
            className="form-close-button"
            aria-label="Close form"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-responsive">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
} 