'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationType } from '@/types/notification';
import NotificationCard from '@/components/NotificationCard';
import { useNotificationStore } from '@/app/_zustand/notificationStore';
import {
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTrash,
  FaSpinner,
  FaBell,
  FaTimes
} from 'react-icons/fa';

const typeOptions = [
  { value: 'all', label: 'Все' },
  { value: NotificationType.ORDER_UPDATE, label: 'Заказы' },
  { value: NotificationType.PAYMENT_STATUS, label: 'Оплата' },
  { value: NotificationType.PROMOTION, label: 'Акции' },
  { value: NotificationType.SYSTEM_ALERT, label: 'Система' },
];

const statusOptions = [
  { value: 'all', label: 'Все' },
  { value: 'unread', label: 'Непрочитанные' },
  { value: 'read', label: 'Прочитанные' },
];

const NotificationsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    notifications,
    total,
    page,
    totalPages,
    loading,
    error,
    selectedIds,
    filters,
    fetchNotifications,
    markSelectedAsRead,
    deleteSelectedNotifications,
    updateFilters,
    loadMore,
    markNotificationAsRead,
    deleteNotificationById
  } = useNotifications();

  const { toggleSelection, selectAll, clearSelection } = useNotificationStore();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedType, setSelectedType] = useState<string>(filters.type || 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>(
    filters.isRead === undefined ? 'all' : filters.isRead ? 'read' : 'unread'
  );

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
  }, [session, status, router]);

  useEffect(() => {
    setSearchTerm(filters.search || '');
    setSelectedType(filters.type || 'all');
    setSelectedStatus(
      filters.isRead === undefined ? 'all' : filters.isRead ? 'read' : 'unread'
    );
  }, [filters]);

  useEffect(() => {
    if (session) fetchNotifications();
  }, [session, fetchNotifications]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ ...filters, search: searchTerm || undefined, page: 1 });
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    updateFilters({ ...filters, type: type === 'all' ? undefined : type as NotificationType, page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    updateFilters({ ...filters, isRead: status === 'all' ? undefined : status === 'read', page: 1 });
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedIds.length > 0) await markSelectedAsRead();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length > 0 && confirm(`Удалить ${selectedIds.length} уведомлений?`)) {
      await deleteSelectedNotifications();
    }
  };

  // clearing the box must also drop the applied query, otherwise the list stays
  // filtered by a search term that is no longer visible anywhere
  const clearSearch = () => {
    setSearchTerm('');
    updateFilters({ ...filters, search: undefined, page: 1 });
  };

  const hasActiveFilters =
    selectedType !== 'all' || selectedStatus !== 'all' || Boolean(searchTerm);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedStatus('all');
    updateFilters({
      type: undefined,
      isRead: undefined,
      search: undefined,
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) clearSelection();
    else selectAll();
  };

  // Only admins have a page that can render an order. Regular customers get no
  // link rather than one that 404s — there is no customer-facing order view yet.
  const isAdmin = (session?.user as any)?.role === 'admin';
  const orderHref = (notification: { metadata?: any }) => {
    const orderId = notification.metadata?.orderId;
    return isAdmin && orderId ? `/admin/orders/${orderId}` : undefined;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-brand" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <FaBell className="text-2xl text-brand" />
            <h1 className="text-3xl font-bold text-gray-900">Центр уведомлений</h1>
          </div>
          <p className="text-gray-600">Все ваши уведомления в одном месте</p>
        </div>

        {/* Фильтры и поиск */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSearch} className="mb-5">
            {/* flex row instead of absolute positioning — the clear button appears
                and disappears, so a hand-tuned `pr-` on the input would drift */}
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 pl-4 pr-2 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
              <FaSearch className="flex-shrink-0 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск уведомлений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && searchTerm) clearSearch();
                }}
                className="min-w-0 flex-1 border-0 bg-transparent px-0 py-3 text-base outline-none focus:ring-0"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Очистить поиск"
                  title="Очистить"
                  className="flex-shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <FaTimes className="text-sm" />
                </button>
              )}
              <button
                type="submit"
                className="flex-shrink-0 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Найти
              </button>
            </div>
          </form>

          {/* Native selects looked out of place here — pills for type, a segment for status */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                <FaFilter className="text-[11px]" />
                Тип
              </span>
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTypeFilter(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    selectedType === option.value
                      ? 'bg-brand text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Статус
              </span>
              <div className="flex rounded-xl bg-gray-100 p-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleStatusFilter(option.value)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedStatus === option.value
                        ? 'bg-white text-brand shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  Сбросить
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Групповые действия */}
        {selectedIds.length > 0 && (
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-brand">
                Выбрано: {selectedIds.length}
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={handleBulkMarkAsRead}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-brand bg-white border border-brand/40 rounded-lg hover:bg-brand/5"
                >
                  <FaCheckCircle className="w-4 h-4 mr-1" />
                  Прочитать все
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
                >
                  <FaTrash className="w-4 h-4 mr-1" />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Выбрать все */}
        {notifications.length > 0 && (
          <div className="mb-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-600">
              <input
                type="checkbox"
                checked={selectedIds.length === notifications.length && notifications.length > 0}
                onChange={handleSelectAll}
                className="h-[18px] w-[18px] cursor-pointer rounded border-gray-300 text-brand focus:ring-2 focus:ring-brand/40"
              />
              <span>Выбрать все</span>
            </label>
          </div>
        )}

        {/* Список уведомлений */}
        <div className="space-y-4">
          {loading && notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-3xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Загрузка уведомлений...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 font-medium mb-2">Ошибка загрузки уведомлений</p>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => fetchNotifications()}
                className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand-dark"
              >
                Повторить
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <FaBell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Нет уведомлений</h3>
              <p className="text-gray-500">
                {Object.keys(filters).some(key => filters[key as keyof typeof filters] !== undefined && key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder')
                  ? 'Попробуйте изменить фильтры.'
                  : 'У вас пока нет уведомлений.'}
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedIds.includes(notification.id)}
                  onToggleSelect={toggleSelection}
                  onMarkAsRead={markNotificationAsRead}
                  targetHref={orderHref(notification)}
                  onDelete={async (id) => {
                    if (confirm('Удалить это уведомление?')) {
                      await deleteNotificationById(id);
                    }
                  }}
                />
              ))}

              {page < totalPages && (
                <div className="text-center pt-6">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin inline mr-2" />
                        Загрузка...
                      </>
                    ) : 'Загрузить ещё'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {total > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Показано {notifications.length} из {total}
            {page < totalPages && ` (Страница ${page} из ${totalPages})`}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
