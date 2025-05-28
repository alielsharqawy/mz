'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Form {
  id: number
  report_name: string
  client_name: string
  client_id: string
  opponent_name: string
  opponent_id: string
  status: string
}

interface Notification {
  title: string
  body: string
}

export default function EmployeeDashboard() {
  const router = useRouter()
  const [forms, setForms] = useState<Form[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'forms' | 'notifications'>('forms')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newForm, setNewForm] = useState({
    report_name: '',
    client_name: '',
    client_id: '',
    opponent_name: '',
    opponent_id: ''
  })

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
    try {
      await Promise.all([
        fetchForms(),
        fetchNotifications()
      ])
    } catch (err) {
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  const fetchForms = async () => {
    const response = await fetch('https://form.legendsagencystuff.com/api/employee/forms', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()
    if (data.key === 'success') {
      setForms(data.data)
    }
  }

  const fetchNotifications = async () => {
    const response = await fetch('https://form.legendsagencystuff.com/api/notifications', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()
    if (data.key === 'success') {
      setNotifications(data.data)
    }
  }

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('https://form.legendsagencystuff.com/api/forms', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: new URLSearchParams(newForm)
      })

      const data = await response.json()
      if (data.key === 'success') {
        setShowNewForm(false)
        setNewForm({
          report_name: '',
          client_name: '',
          client_id: '',
          opponent_name: '',
          opponent_id: ''
        })
        fetchForms()
      }
    } catch (err) {
      setError('Failed to create form')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.push('/')
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opponent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {forms.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {form.report_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {form.client_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {form.opponent_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            form.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : form.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {form.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.map((notification, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{notification.title}</h3>
                  <p className="text-gray-600">{notification.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showNewForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">New Form</h2>
              </div>
              <form onSubmit={handleCreateForm} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Report Name</label>
                  <input
                    type="text"
                    value={newForm.report_name}
                    onChange={(e) => setNewForm({ ...newForm, report_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client Name</label>
                  <input
                    type="text"
                    value={newForm.client_name}
                    onChange={(e) => setNewForm({ ...newForm, client_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Client ID</label>
                  <input
                    type="text"
                    value={newForm.client_id}
                    onChange={(e) => setNewForm({ ...newForm, client_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opponent Name</label>
                  <input
                    type="text"
                    value={newForm.opponent_name}
                    onChange={(e) => setNewForm({ ...newForm, opponent_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Opponent ID</label>
                  <input
                    type="text"
                    value={newForm.opponent_id}
                    onChange={(e) => setNewForm({ ...newForm, opponent_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
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
        )}
      </main>
    </div>
  )
} 