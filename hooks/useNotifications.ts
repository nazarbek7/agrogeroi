import { useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useNotificationStore } from '@/app/_zustand/notificationStore';
import { notificationApi } from '@/lib/notification-api';
import { NotificationFilters } from '@/types/notification';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const { data: session } = useSession();
  const {
    notifications,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    selectedIds,
    setNotifications,
    setLoading,
    setError,
    setFilters,
    markAsRead,
    deleteNotification,
    clearSelection,
    setUnreadCount
  } = useNotificationStore();

  const getUserId = useCallback(() => {
    return (session?.user as any)?.id ?? null;
  }, [session?.user]);

  const fetchNotifications = useCallback(async (customFilters?: NotificationFilters) => {
    const userId = getUserId();
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const filtersToUse = customFilters || filters;
      const response = await notificationApi.getUserNotifications(userId, filtersToUse);
      setNotifications(response);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Не удалось загрузить уведомления';
      setError(msg);
      toast.error(msg);
    }
  }, [filters, getUserId, setNotifications, setLoading, setError]);

  const fetchUnreadCount = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const { unreadCount } = await notificationApi.getUnreadCount(userId);
      setUnreadCount(unreadCount);
    } catch {
      // silent
    }
  }, [getUserId, setUnreadCount]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationApi.updateNotification(notificationId, true);
      markAsRead(notificationId);
      toast.success('Уведомление прочитано');
    } catch (error) {
      toast.error('Не удалось отметить как прочитанное');
    }
  }, [markAsRead]);

  const markSelectedAsRead = useCallback(async () => {
    const userId = getUserId();
    const idsToMarkRead = [...selectedIds];
    if (!userId || idsToMarkRead.length === 0) return;

    try {
      await notificationApi.bulkMarkAsRead({ notificationIds: idsToMarkRead, userId });
      idsToMarkRead.forEach(id => markAsRead(id));
      clearSelection();
      await fetchUnreadCount();
      toast.success(`${idsToMarkRead.length} уведомлений прочитано`);
    } catch {
      toast.error('Не удалось отметить уведомления');
    }
  }, [selectedIds, getUserId, markAsRead, clearSelection, fetchUnreadCount]);

  const deleteNotificationById = useCallback(async (notificationId: string) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      await notificationApi.deleteNotification(notificationId, userId);
      deleteNotification(notificationId);
      toast.success('Уведомление удалено');
    } catch {
      toast.error('Не удалось удалить уведомление');
    }
  }, [getUserId, deleteNotification]);

  const deleteSelectedNotifications = useCallback(async () => {
    const userId = getUserId();
    const idsToDelete = [...selectedIds];
    if (!userId || idsToDelete.length === 0) return;

    try {
      await notificationApi.bulkDeleteNotifications({ notificationIds: idsToDelete, userId });
      idsToDelete.forEach(id => deleteNotification(id));
      clearSelection();
      await fetchNotifications();
      toast.success(`${idsToDelete.length} уведомлений удалено`);
    } catch {
      toast.error('Не удалось удалить уведомления');
    }
  }, [selectedIds, getUserId, deleteNotification, clearSelection, fetchNotifications]);

  const updateFilters = useCallback((newFilters: Partial<NotificationFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchNotifications(updatedFilters);
  }, [filters, setFilters, fetchNotifications]);

  const loadMore = useCallback(() => {
    if (page < totalPages) {
      updateFilters({ page: page + 1 });
    }
  }, [page, totalPages, updateFilters]);

  return {
    notifications,
    unreadCount,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    selectedIds,
    hasMore: page < totalPages,
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markSelectedAsRead,
    deleteNotificationById,
    deleteSelectedNotifications,
    updateFilters,
    loadMore,
    setFilters,
    clearSelection
  };
};

export const useUnreadCount = () => {
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const { data: session } = useSession();

  const fetchUnreadCount = useCallback(async () => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;

    try {
      const { unreadCount } = await notificationApi.getUnreadCount(userId);
      setUnreadCount(unreadCount);
    } catch {
      // silent
    }
  }, [session?.user, setUnreadCount]);

  useEffect(() => {
    fetchUnreadCount();

    // Poll every 5 minutes
    const interval = setInterval(fetchUnreadCount, 5 * 60 * 1000);

    // Also refresh when user comes back to the tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchUnreadCount();
    };

    const handleOrderCompleted = () => {
      setTimeout(fetchUnreadCount, 1000);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('orderCompleted', handleOrderCompleted);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('orderCompleted', handleOrderCompleted);
    };
  }, [fetchUnreadCount]);

  return { unreadCount, refreshUnreadCount: fetchUnreadCount };
};
