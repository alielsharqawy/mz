'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Notification, Employee } from '../../types'
import { fetchManagerForms, fetchManagerNotifications, managerLogout } from '../../services/api'
import { FormTable } from '../../components/forms/FormTable'
import { NotificationList } from '../../components/notifications/NotificationList'
import { showSuccess, showError, showConfirm, showLoading, closeLoading } from '../../services/notifications'

export default function ManagerDashboard() {
  const router = useRouter()
  const [forms, setForms] = useState<Form[]>([])
  const [pendingForms, setPendingForms] = useState<Form[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'forms' | 'employees' | 'notifications'>('forms')
  const [showNewEmployee, setShowNewEmployee] = useState(false)
  const [showEditEmployee, setShowEditEmployee] = useState<Employee | null>(null)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'manager') {
      router.push('/')
      return
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    showLoading()
    try {
      await Promise.all([
        fetchForms(),
        fetchPendingForms(),
        fetchEmployees(),
        fetchNotifications()
      ])
    } catch (err) {
      showError('An error occurred while fetching data')
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
      closeLoading()
    }
  }

  const fetchForms = async () => {
    const response = await fetch('https://form.legendsagencystuff.com/api/forms', {
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

  const fetchPendingForms = async () => {
    const response = await fetch('https://form.legendsagencystuff.com/api/pending-forms', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()
    if (data.key === 'success') {
      setPendingForms(data.data)
    }
  }

  const fetchEmployees = async () => {
    const response = await fetch('https://form.legendsagencystuff.com/api/employees', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data = await response.json()
    if (data.key === 'success') {
      setEmployees(data.data)
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

  const handleApproveForm = async (formId: number) => {
    showLoading('Approving form...')
    try {
      const response = await fetch(`https://form.legendsagencystuff.com/api/forms/${formId}/approve`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      if (data.key === 'success') {
        showSuccess('Form approved successfully')
        fetchData()
      }
    } catch (err) {
      showError('Failed to approve form')
      setError('Failed to approve form')
    }
  }

  const handleRejectForm = async (formId: number) => {
    const result = await showConfirm('Reject Form', 'Are you sure you want to reject this form?')
    if (result.isConfirmed) {
      showLoading('Rejecting form...')
      try {
        const response = await fetch(`https://form.legendsagencystuff.com/api/forms/${formId}/reject`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        const data = await response.json()
        if (data.key === 'success') {
          showSuccess('Form rejected successfully')
          fetchData()
        }
      } catch (err) {
        showError('Failed to reject form')
        setError('Failed to reject form')
      }
    }
  }

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    showLoading('Creating employee...')
    try {
      const response = await fetch('https://form.legendsagencystuff.com/api/employees', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: new URLSearchParams(newEmployee)
      })

      const data = await response.json()
      if (data.key === 'success') {
        showSuccess('Employee created successfully')
        setShowNewEmployee(false)
        setNewEmployee({ name: '', email: '', password: '' })
        fetchEmployees()
      }
    } catch (err) {
      showError('Failed to create employee')
      setError('Failed to create employee')
    }
  }

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showEditEmployee) return

    showLoading('Updating employee...')
    try {
      const response = await fetch(`https://form.legendsagencystuff.com/api/employees/${showEditEmployee.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: new URLSearchParams(newEmployee)
      })

      const data = await response.json()
      if (data.key === 'success') {
        showSuccess('Employee updated successfully')
        setShowEditEmployee(null)
        setNewEmployee({ name: '', email: '', password: '' })
        fetchEmployees()
      }
    } catch (err) {
      showError('Failed to update employee')
      setError('Failed to update employee')
    }
  }

  const handleDeleteEmployee = async (employeeId: number) => {
    const result = await showConfirm('Delete Employee', 'Are you sure you want to delete this employee?')
    if (result.isConfirmed) {
      showLoading('Deleting employee...')
      try {
        const response = await fetch(`https://form.legendsagencystuff.com/api/employees/${employeeId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        const data = await response.json()
        if (data.key === 'success') {
          showSuccess('Employee deleted successfully')
          fetchEmployees()
        }
      } catch (err) {
        showError('Failed to delete employee')
        setError('Failed to delete employee')
      }
    }
  }

  const handleLogout = async () => {
    const result = await showConfirm('Logout', 'Are you sure you want to logout?')
    if (result.isConfirmed) {
      showLoading('Logging out...')
      try {
        await managerLogout()
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        showSuccess('Logged out successfully')
        router.push('/')
      } catch (err) {
        console.log(err)
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
              <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
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
                onClick={() => setActiveTab('employees')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === 'employees' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Employees
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
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pending Forms</h2>
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
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingForms.map((form) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {form.employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleApproveForm(form.id)}
                            className="text-green-600 hover:text-green-900 mr-3 transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectForm(form.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">All Forms</h2>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
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
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {form.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {form.employee.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
              <button
                onClick={() => setShowNewEmployee(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Add Employee
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setShowEditEmployee(employee)
                            setNewEmployee({
                              name: employee.name,
                              email: employee.email,
                              password: ''
                            })
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        {showNewEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Add New Employee</h3>
              </div>
              <form onSubmit={handleCreateEmployee} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewEmployee(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Edit Employee</h3>
              </div>
              <form onSubmit={handleUpdateEmployee} className="p-6 space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    id="edit-password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditEmployee(null)
                      setNewEmployee({ name: '', email: '', password: '' })
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Update
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