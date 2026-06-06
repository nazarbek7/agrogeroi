const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Generate ID using nanoid with dynamic import
 */
const generateId = async () => {
  try {
    const { nanoid } = await import('nanoid');
    return nanoid();
  } catch (error) {
    console.error('Error generating nanoid:', error);
    // Fallback ID generation
    return Math.random().toString(36).substr(2, 10);
  }
};

/**
 * Create an order update notification
 */
const createOrderUpdateNotification = async (userId, orderStatus, orderId, totalAmount = null) => {
  try {
    const statusMessages = {
      'pending': {
        title: 'Заказ получен',
        message: `Спасибо! Ваш заказ #${orderId} получен и обрабатывается.`,
        priority: 'NORMAL'
      },
      'confirmed': {
        title: 'Заказ подтверждён',
        message: `Ваш заказ #${orderId} подтверждён и будет подготовлен к отправке.`,
        priority: 'HIGH'
      },
      'processing': {
        title: 'Заказ обрабатывается',
        message: `Ваш заказ #${orderId} находится в обработке и скоро будет отправлен.`,
        priority: 'NORMAL'
      },
      'shipped': {
        title: 'Заказ отправлен',
        message: `Ваш заказ #${orderId} отправлен и уже в пути!`,
        priority: 'HIGH'
      },
      'delivered': {
        title: 'Заказ доставлен',
        message: `Ваш заказ #${orderId} успешно доставлен. Спасибо за покупку!`,
        priority: 'HIGH'
      },
      'cancelled': {
        title: 'Заказ отменён',
        message: `Ваш заказ #${orderId} был отменён. По вопросам обращайтесь в поддержку.`,
        priority: 'URGENT'
      }
    };

    const statusInfo = statusMessages[orderStatus.toLowerCase()] || {
      title: 'Обновление заказа',
      message: `Статус вашего заказа #${orderId} обновлён: ${orderStatus}`,
      priority: 'NORMAL'
    };

    const notificationId = await generateId();

    const notification = await prisma.notification.create({
      data: {
        id: notificationId,
        userId: userId,
        title: statusInfo.title,
        message: statusInfo.message,
        type: 'ORDER_UPDATE',
        priority: statusInfo.priority,
        isRead: false,
        metadata: {
          orderId: orderId,
          status: orderStatus,
          ...(totalAmount && { totalAmount: totalAmount })
        }
      }
    });

    console.log(`✅ Notification created for user ${userId}: ${statusInfo.title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating order notification:', error);
    throw error;
  }
};

/**
 * Create a payment status notification
 */
const createPaymentNotification = async (userId, paymentStatus, amount, orderId) => {
  try {
    const statusMessages = {
      'success': {
        title: 'Оплата прошла успешно',
        message: `Ваш платёж на сумму ${amount} сом для заказа #${orderId} успешно обработан.`,
        priority: 'HIGH'
      },
      'failed': {
        title: 'Ошибка оплаты',
        message: `Платёж на сумму ${amount} сом для заказа #${orderId} не прошёл. Пожалуйста, попробуйте снова.`,
        priority: 'URGENT'
      },
      'pending': {
        title: 'Оплата обрабатывается',
        message: `Платёж на сумму ${amount} сом для заказа #${orderId} обрабатывается.`,
        priority: 'NORMAL'
      }
    };

    const statusInfo = statusMessages[paymentStatus.toLowerCase()] || {
      title: 'Обновление оплаты',
      message: `Статус оплаты для заказа #${orderId} обновлён.`,
      priority: 'NORMAL'
    };

    const notificationId = await generateId();

    const notification = await prisma.notification.create({
      data: {
        id: notificationId,
        userId: userId,
        title: statusInfo.title,
        message: statusInfo.message,
        type: 'PAYMENT_STATUS',
        priority: statusInfo.priority,
        isRead: false,
        metadata: {
          orderId: orderId,
          paymentStatus: paymentStatus,
          amount: amount
        }
      }
    });

    console.log(`✅ Payment notification created for user ${userId}: ${statusInfo.title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating payment notification:', error);
    throw error;
  }
};

/**
 * Create a promotional notification
 */
const createPromotionNotification = async (userId, title, message, promoCode = null, discount = null) => {
  try {
    const notificationId = await generateId();

    const notification = await prisma.notification.create({
      data: {
        id: notificationId,
        userId: userId,
        title: title,
        message: message,
        type: 'PROMOTION',
        priority: 'NORMAL',
        isRead: false,
        metadata: {
          ...(promoCode && { promoCode: promoCode }),
          ...(discount && { discount: discount })
        }
      }
    });

    console.log(`✅ Promotion notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating promotion notification:', error);
    throw error;
  }
};

/**
 * Create a system alert notification
 */
const createSystemAlertNotification = async (userId, title, message, priority = 'HIGH') => {
  try {
    const notificationId = await generateId();

    const notification = await prisma.notification.create({
      data: {
        id: notificationId,
        userId: userId,
        title: title,
        message: message,
        type: 'SYSTEM_ALERT',
        priority: priority,
        isRead: false,
        metadata: {
          alertType: 'system'
        }
      }
    });

    console.log(`✅ System alert notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating system alert notification:', error);
    throw error;
  }
};

/**
 * Bulk create notifications for multiple users
 */
const createBulkNotifications = async (userIds, title, message, type = 'SYSTEM_ALERT', priority = 'NORMAL', metadata = {}) => {
  try {
    // Generate all IDs first
    const notificationData = await Promise.all(
      userIds.map(async (userId) => {
        const notificationId = await generateId();
        return {
          id: notificationId,
          userId: userId,
          title: title,
          message: message,
          type: type,
          priority: priority,
          isRead: false,
          metadata: metadata
        };
      })
    );

    await prisma.notification.createMany({
      data: notificationData
    });

    console.log(`✅ Bulk notifications created for ${userIds.length} users: ${title}`);
    return notificationData.length;
  } catch (error) {
    console.error('❌ Error creating bulk notifications:', error);
    throw error;
  }
};

module.exports = {
  createOrderUpdateNotification,
  createPaymentNotification,
  createPromotionNotification,
  createSystemAlertNotification,
  createBulkNotifications
};
