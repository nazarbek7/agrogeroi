import React from 'react';
import { Notification, NotificationType, NotificationPriority } from '@/types/notification';

const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Только что';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;
  return past.toLocaleDateString('ru-RU');
};

import {
  FaShoppingCart,
  FaCreditCard,
  FaTag,
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
  FaCircle
} from 'react-icons/fa';

interface NotificationCardProps {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_UPDATE:
      return <FaShoppingCart className="text-brand" />;
    case NotificationType.PAYMENT_STATUS:
      return <FaCreditCard className="text-green-500" />;
    case NotificationType.PROMOTION:
      return <FaTag className="text-purple-500" />;
    case NotificationType.SYSTEM_ALERT:
      return <FaExclamationTriangle className="text-red-500" />;
    default:
      return <FaCircle className="text-gray-500" />;
  }
};

const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_UPDATE:
      return 'bg-blue-100 text-blue-800';
    case NotificationType.PAYMENT_STATUS:
      return 'bg-green-100 text-green-800';
    case NotificationType.PROMOTION:
      return 'bg-purple-100 text-purple-800';
    case NotificationType.SYSTEM_ALERT:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeLabel = (type: NotificationType) => {
  switch (type) {
    case NotificationType.ORDER_UPDATE: return 'Заказ';
    case NotificationType.PAYMENT_STATUS: return 'Оплата';
    case NotificationType.PROMOTION: return 'Акция';
    case NotificationType.SYSTEM_ALERT: return 'Система';
    default: return type;
  }
};

const getPriorityBadge = (priority: NotificationPriority) => {
  const styles = {
    [NotificationPriority.LOW]: 'bg-gray-100 text-gray-600 border-gray-300',
    [NotificationPriority.NORMAL]: 'bg-blue-100 text-brand border-blue-300',
    [NotificationPriority.HIGH]: 'bg-orange-100 text-orange-600 border-orange-300',
    [NotificationPriority.URGENT]: 'bg-red-100 text-red-600 border-red-300'
  };

  const labels = {
    [NotificationPriority.LOW]: 'Низкий',
    [NotificationPriority.NORMAL]: 'Обычный',
    [NotificationPriority.HIGH]: 'Высокий',
    [NotificationPriority.URGENT]: 'Срочно'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isSelected,
  onToggleSelect,
  onMarkAsRead,
  onDelete
}) => {
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <div className={`
      border rounded-lg p-4 transition-all duration-200 hover:shadow-md
      ${notification.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200 shadow-sm'}
      ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
    `}>
      <div className="flex items-start space-x-3">
        <div className="flex items-center pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(notification.id)}
            className="w-4 h-4 text-brand bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2 flex-1">
              <div className="flex-shrink-0">
                {getTypeIcon(notification.type)}
              </div>
              <h3 className={`text-sm font-medium truncate ${
                notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
              }`}>
                {notification.title}
              </h3>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-brand rounded-full flex-shrink-0" />
              )}
            </div>
            <div className="flex-shrink-0 ml-2">
              {getPriorityBadge(notification.priority)}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                {getTypeLabel(notification.type)}
              </span>
              <span className="text-xs text-gray-500" title={new Date(notification.createdAt).toLocaleString('ru-RU')}>
                {timeAgo}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {!notification.isRead && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-brand bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                >
                  <FaCheck className="w-3 h-3 mr-1" />
                  Прочитать
                </button>
              )}
              <button
                onClick={() => onDelete(notification.id)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 transition-colors"
              >
                <FaTrash className="w-3 h-3 mr-1" />
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
