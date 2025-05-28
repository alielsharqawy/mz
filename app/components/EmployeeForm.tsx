'use client'

import { useState } from 'react'
import { ResponsiveFormGroup, ResponsiveButtonGroup } from './ResponsiveLayout'

interface FormData {
  name: string
  email: string
  position: string
  department: string
}

interface EmployeeFormProps {
  onSubmit: (data: FormData) => void
  initialData?: FormData
}

export default function EmployeeForm({ onSubmit, initialData }: EmployeeFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData || {
    name: '',
    email: '',
    position: '',
    department: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-responsive">
      <ResponsiveFormGroup>
        <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
          required
        />
      </ResponsiveFormGroup>

      <ResponsiveFormGroup>
        <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
          required
        />
      </ResponsiveFormGroup>

      <ResponsiveFormGroup>
        <label htmlFor="position" className="block text-sm sm:text-base font-medium text-gray-700">
          Position
        </label>
        <input
          type="text"
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
          required
        />
      </ResponsiveFormGroup>

      <ResponsiveFormGroup>
        <label htmlFor="department" className="block text-sm sm:text-base font-medium text-gray-700">
          Department
        </label>
        <input
          type="text"
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
          required
        />
      </ResponsiveFormGroup>

      <ResponsiveButtonGroup className="mt-6">
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => setFormData(initialData || { name: '', email: '', position: '', department: '' })}
          className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm sm:text-base"
        >
          Reset
        </button>
      </ResponsiveButtonGroup>
    </form>
  )
}
