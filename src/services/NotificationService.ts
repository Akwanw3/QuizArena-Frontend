import api from './Api';


export const notificationService = {
  // Get notifications
  getNotifications: async (unreadOnly: boolean = false) => {
    const response = await api.get('/notifications', {
      params: { unreadOnly }
    });
    return response.data.data;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  },

  // Mark as read
  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Delete all
  deleteAllNotifications: async () => {
    const response = await api.delete('/notifications');
    return response.data;
  },
};