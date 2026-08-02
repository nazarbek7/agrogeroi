'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaShoppingCart,
  FaCreditCard,
  FaTag,
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
  FaCircle,
  FaChevronDown,
  FaArrowRight,
} from 'react-icons/fa';
import { Notification, NotificationType, NotificationPriority } from '@/types/notification';

const formatTimeAgo = (date: string) => {
  const diffInSeconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return 'Только что';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;
  return new Date(date).toLocaleDateString('ru-RU');
};

const formatExactDate = (date: string) =>
  new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// A full UUID in the middle of a sentence is unreadable — show the short form
// in the collapsed view, the whole id once the card is opened.
const shortenIds = (text: string) =>
  text.replace(
    /#([0-9a-f]{8})-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
    '#$1'
  );

const typeMeta: Record<
  string,
  { icon: React.ReactNode; label: string; chip: string }
> = {
  [NotificationType.ORDER_UPDATE]: {
    icon: <FaShoppingCart />,
    label: 'Заказ',
    chip: 'bg-brand/10 text-brand',
  },
  [NotificationType.PAYMENT_STATUS]: {
    icon: <FaCreditCard />,
    label: 'Оплата',
    chip: 'bg-emerald-50 text-emerald-700',
  },
  [NotificationType.PROMOTION]: {
    icon: <FaTag />,
    label: 'Акция',
    chip: 'bg-violet-50 text-violet-700',
  },
  [NotificationType.SYSTEM_ALERT]: {
    icon: <FaExclamationTriangle />,
    label: 'Система',
    chip: 'bg-red-50 text-red-700',
  },
};

const fallbackMeta = {
  icon: <FaCircle />,
  label: 'Уведомление',
  chip: 'bg-gray-100 text-gray-600',
};

interface NotificationCardProps {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  /** Where this notification leads, if the current user can open it at all. */
  targetHref?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isSelected,
  onToggleSelect,
  onMarkAsRead,
  onDelete,
  targetHref,
}) => {
  const [expanded, setExpanded] = useState(false);
  const meta = typeMeta[notification.type] ?? fallbackMeta;
  const isUnread = !notification.isRead;
  const orderId = notification.metadata?.orderId as string | undefined;

  // opening a notification is what "reading" it means — no separate button needed
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && isUnread) onMarkAsRead(notification.id);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all ${
        isSelected
          ? 'border-brand ring-2 ring-brand/30'
          : isUnread
            ? 'border-brand/20 bg-brand/[0.03] shadow-sm'
            : 'border-gray-200 bg-white'
      }`}
    >
      {isUnread && <span className="absolute inset-y-0 left-0 w-1 bg-brand" />}

      <div className="flex items-start gap-3 p-4 pl-5">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(notification.id)}
          aria-label={`Выбрать «${notification.title}»`}
          className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-gray-300 text-brand focus:ring-2 focus:ring-brand/40"
        />

        <div className="min-w-0 flex-1">
          {/* Clickable body: opens the full text and marks it read */}
          <button
            type="button"
            onClick={toggle}
            aria-expanded={expanded}
            className="block w-full text-left"
          >
            <div className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm ${meta.chip}`}
              >
                {meta.icon}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={`truncate text-sm ${
                      isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                    }`}
                  >
                    {notification.title}
                  </h3>
                  {isUnread && (
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                  )}
                  {notification.priority === NotificationPriority.URGENT && (
                    <span className="flex-shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">
                      Срочно
                    </span>
                  )}
                </div>

                <p
                  className={`mt-1 text-sm leading-relaxed text-gray-600 ${
                    expanded ? '' : 'line-clamp-2'
                  }`}
                >
                  {expanded ? notification.message : shortenIds(notification.message)}
                </p>
              </div>

              <FaChevronDown
                className={`mt-1.5 flex-shrink-0 text-xs text-gray-400 transition-transform ${
                  expanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {expanded && (
            <div className="mt-3 space-y-1.5 rounded-xl bg-gray-50 px-3.5 py-3 text-xs text-gray-500">
              <p>
                <span className="font-semibold text-gray-600">Получено:</span>{' '}
                {formatExactDate(notification.createdAt)}
              </p>
              {orderId && (
                <p className="break-all">
                  <span className="font-semibold text-gray-600">Номер заказа:</span>{' '}
                  {orderId}
                </p>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${meta.chip}`}
              >
                {meta.label}
              </span>
              <span
                className="text-xs text-gray-400"
                title={formatExactDate(notification.createdAt)}
              >
                {formatTimeAgo(notification.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {targetHref && (
                <Link
                  href={targetHref}
                  onClick={() => isUnread && onMarkAsRead(notification.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  Открыть заказ
                  <FaArrowRight className="text-[10px]" />
                </Link>
              )}
              {isUnread && (
                <button
                  type="button"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-brand hover:text-brand"
                >
                  <FaCheck className="text-[10px]" />
                  Прочитано
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(notification.id)}
                aria-label="Удалить уведомление"
                title="Удалить"
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
