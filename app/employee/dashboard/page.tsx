'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Notification, NewFormData } from '../../types'
import { fetchEmployeeForms, fetchEmployeeNotifications, createEmployeeForm, employeeLogout } from '../../services/api'
import { FormTable } from '../../components/forms/FormTable'
import { NewFormModal } from '../../components/forms/NewFormModal'
import { NotificationList } from '../../components/notifications/NotificationList'
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../../services/notifications'

export default function EmployeeDashboard() {
  const router = useRouter()
  const [forms, setForms] = useState<Form[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'forms' | 'notifications'>('forms')
  const [showNewForm, setShowNewForm] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'employee') {
      router.push('/')
      return
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    showLoading()
    try {
      const [formsData, notificationsData] = await Promise.all([
        fetchEmployeeForms(),
        fetchEmployeeNotifications()
      ])
      setForms(formsData)
      setNotifications(notificationsData)
    } catch (err) {
      showError('An error occurred while fetching data')
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
      closeLoading()
    }
  }

  const handleCreateForm = async (formData: NewFormData) => {
    showLoading('Creating form...')
    try {
      await createEmployeeForm(formData)
      setShowNewForm(false)
      await fetchData()
      showSuccess('Form created successfully')
    } catch (err) {
      showError('Failed to create form')
      setError('Failed to create form')
    }
  }

  const handleLogout = async () => {
    const result = await showConfirm('Logout', 'Are you sure you want to logout?')
    if (result.isConfirmed) {
      showLoading('Logging out...')
      try {
        await employeeLogout()
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        showSuccess('Logged out successfully')
        router.push('/')
      } catch (err) {
        showError('Failed to logout')
        setError('Failed to logout')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-900">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setActiveTab('forms')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === 'forms' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Forms
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">My Forms</h2>
                <button
                  onClick={() => setShowNewForm(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  New Form
                </button>
              </div>
              <FormTable forms={forms} />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <NotificationList notifications={notifications} />
          </div>
        )}

        <NewFormModal
          isOpen={showNewForm}
          onClose={() => setShowNewForm(false)}
          onSubmit={handleCreateForm}
        />
      </main>
    </div>
  )
} 