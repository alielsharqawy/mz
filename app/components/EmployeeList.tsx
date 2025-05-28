'use client'

import { ResponsiveTableContainer, ResponsiveCard } from './ResponsiveLayout'

interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
}

interface EmployeeListProps {
  employees: Employee[]
  onEdit?: (employee: Employee) => void
  onDelete?: (employee: Employee) => void
}

export default function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  return (
    <ResponsiveTableContainer>
      <div className="min-w-full divide-y divide-gray-200">
        <div className="bg-gray-50">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Name</div>
            <div className="hidden sm:block">Email</div>
            <div>Position</div>
            <div className="text-right">Actions</div>
          </div>
        </div>
        <div className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <div key={employee.id} className="grid grid-cols-4 sm:grid-cols-5 gap-4 px-4 sm:px-6 py-4">
              <div className="col-span-2">
                <div className="text-sm sm:text-base font-medium text-gray-900">{employee.name}</div>
                <div className="sm:hidden text-sm text-gray-500">{employee.email}</div>
              </div>
              <div className="hidden sm:block text-sm text-gray-500">{employee.email}</div>
              <div className="text-sm text-gray-500">{employee.position}</div>
              <div className="text-right space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(employee)}
                    className="inline-flex items-center px-2.5 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(employee)}
                    className="inline-flex items-center px-2.5 py-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveTableContainer>
  )
}
