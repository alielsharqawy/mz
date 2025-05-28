import { Form, Notification, NewFormData } from '../types'

const API_BASE_URL = 'https://form.legendsagencystuff.com/api'

const getAuthHeaders = () => ({
  'Accept': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

// Employee Forms
export const fetchEmployeeForms = async (): Promise<Form[]> => {
  const response = await fetch(`${API_BASE_URL}/employee/forms`, {
    headers: getAuthHeaders()
  })
  const data = await response.json()
  if (data.key === 'success') {
    return data.data
  }
  throw new Error('Failed to fetch forms')
}

export const getEmployeeForm = async (formId: number): Promise<Form> => {
  const response = await fetch(`${API_BASE_URL}/employee/forms/${formId}`, {
    headers: getAuthHeaders()
  })
  const data = await response.json()
  if (data.key === 'success') {
    return data.data
  }
  throw new Error('Failed to fetch form')
}

export const createEmployeeForm = async (formData: NewFormData): Promise<void> => {
  // Fixed the type issue by converting `formData` to a compatible format
  const formattedData = Object.entries(formData).reduce((acc, [key, value]) => {
    acc[key] = String(value);
    return acc;
  }, {} as Record<string, string>);

  const response = await fetch(`${API_BASE_URL}/employee/forms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: new URLSearchParams(formattedData)
  })
  const data = await response.json()
  if (data.key !== 'success') {
    throw new Error('Failed to create form')
  }
}

// Employee Notifications
export const fetchEmployeeNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_BASE_URL}/employee/notifications`, {
    headers: getAuthHeaders()
  })
  const data = await response.json()
  if (data.key === 'success') {
    return data.data
  }
  throw new Error('Failed to fetch notifications')
}

// Employee Auth
export const employeeLogin = async (email: string, password: string): Promise<{ token: string, role: string }> => {
  const response = await fetch(`${API_BASE_URL}/employee/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: new URLSearchParams({ email, password })
  })
  const data = await response.json()
  if (data.key === 'success') {
    return {
      token: data.data.token,
      role: data.data.role
    }
  }
  throw new Error('Login failed')
}

export const employeeLogout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/employee/logout`, {
    method: 'POST',
    headers: getAuthHeaders()
  })
  const data = await response.json()
  if (data.key !== 'success') {
    throw new Error('Failed to logout')
  }
}

// Manager Forms
export const fetchManagerForms = async (): Promise<Form[]> => {
  const response = await fetch(`${API_BASE_URL}/manager/forms`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  const data = await response.json()
  if (data.key === 'success') {
    return data.data
  }
  throw new Error(data.message || 'Failed to fetch forms')
}

// Manager Notifications
export const fetchManagerNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_BASE_URL}/manager/notifications`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  const data = await response.json()
  if (data.key === 'success') {
    return data.data
  }
  throw new Error(data.message || 'Failed to fetch notifications')
}

// Manager Logout
export const managerLogout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  const data = await response.json()
  if (data.key !== 'success') {
    throw new Error(data.message || 'Failed to logout')
  }
}
