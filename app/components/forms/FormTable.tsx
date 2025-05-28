import { Form } from '../../types'

interface FormTableProps {
  forms: Form[]
}

export const FormTable = ({ forms }: FormTableProps) => {
  return (
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
  )
} 