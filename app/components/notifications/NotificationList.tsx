import { Notification } from '../../types'

interface NotificationListProps {
  notifications: Notification[]
}

export const NotificationList = ({ notifications }: NotificationListProps) => {
  return (
    <div className="divide-y divide-gray-200">
      {notifications.map((notification, index) => (
        <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{notification.title}</h3>
          <p className="text-gray-600">{notification.body}</p>
        </div>
      ))}
    </div>
  )
} 