export interface Form {
  id: number
  report_name: string
  client_name: string
  client_id: string
  opponent_name: string
  opponent_id: string
  status: 'pending' | 'approved' | 'rejected'
  employee: Employee
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  title: string
  body: string
  created_at: string
}

export interface NewFormData {
  report_name: string
  client_name: string
  client_id: string
  opponent_name: string
  opponent_id: string
}

export interface Employee {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
} 