'use client'

import { useState } from 'react'
import { NewFormData } from '../../types'

interface NewFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NewFormData) => void
}

export function NewFormModal({ isOpen, onClose, onSubmit }: NewFormModalProps) {
  const [formData, setFormData] = useState<NewFormData>({
    report_name: '',
    client_name: '',
    client_id: '',
    opponent_name: '',
    opponent_id: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Create New Form</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="report_name" className="block text-sm font-medium text-gray-700 mb-1">
              Report Name
            </label>
            <input
              type="text"
              id="report_name"
              value={formData.report_name}
              onChange={(e) => setFormData({ ...formData, report_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-1">
              Client ID
            </label>
            <input
              type="text"
              id="client_id"
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="opponent_name" className="block text-sm font-medium text-gray-700 mb-1">
              Opponent Name
            </label>
            <input
              type="text"
              id="opponent_name"
              value={formData.opponent_name}
              onChange={(e) => setFormData({ ...formData, opponent_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="opponent_id" className="block text-sm font-medium text-gray-700 mb-1">
              Opponent ID
            </label>
            <input
              type="text"
              id="opponent_id"
              value={formData.opponent_id}
              onChange={(e) => setFormData({ ...formData, opponent_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 