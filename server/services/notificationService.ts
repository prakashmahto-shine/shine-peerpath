import { store } from '../data/store';
import { CommunityNotification, NotificationType } from '../types';
import { sendUserNotification } from './socketService';

class NotificationService {
  /**
   * Get list of notifications for a user
   */
  public getUserNotifications(userId?: string, unreadOnly: boolean = false): CommunityNotification[] {
    const targetUser = userId || 'prakash';
    return store.getNotifications(targetUser, unreadOnly);
  }

  /**
   * Get unread notifications counter for badge display
   */
  public getUnreadCount(userId?: string): number {
    const targetUser = userId || 'prakash';
    return store.getUnreadNotificationCount(targetUser);
  }

  /**
   * Dispatch a new notification to a specific user and broadcast over socket
   */
  public sendNotification(params: {
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    mentorId?: string;
    mentorName?: string;
    mentorAvatar?: string;
    actorId?: string;
    actorName?: string;
    actorAvatar?: string;
    postId?: string;
    sessionId?: string;
    actionUrl?: string;
  }): CommunityNotification {
    const notification: CommunityNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recipientId: params.recipientId,
      type: params.type,
      title: params.title,
      message: params.message,
      mentorId: params.mentorId,
      mentorName: params.mentorName,
      mentorAvatar: params.mentorAvatar,
      actorId: params.actorId,
      actorName: params.actorName,
      actorAvatar: params.actorAvatar,
      postId: params.postId,
      sessionId: params.sessionId,
      createdAt: new Date().toISOString(),
      isRead: false,
      actionUrl: params.actionUrl || (params.postId ? `/community#${params.postId}` : undefined)
    };

    const saved = store.createNotification(notification);
    
    // Real-time push notification over socket
    sendUserNotification(params.recipientId, saved);

    return saved;
  }

  /**
   * Mark a single notification as read
   */
  public markAsRead(notificationId: string): CommunityNotification | null {
    const updated = store.markNotificationAsRead(notificationId);
    return updated || null;
  }

  /**
   * Mark all notifications as read for a user
   */
  public markAllAsRead(userId: string): number {
    return store.markAllNotificationsAsRead(userId);
  }

  /**
   * Delete a single notification by ID
   */
  public deleteNotification(notificationId: string): boolean {
    return store.deleteNotification(notificationId);
  }

  /**
   * Clear all notifications for a user
   */
  public clearAll(userId?: string): number {
    return store.clearAllNotifications(userId);
  }

  /**
   * Broadcast an announcement notification to all registered candidates & mentors
   */
  public broadcastAnnouncement(title: string, message: string, actionUrl?: string): CommunityNotification {
    const notification: CommunityNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recipientId: 'all',
      type: 'system_announcement',
      title,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
      actionUrl: actionUrl || '/community'
    };

    const saved = store.createNotification(notification);
    sendUserNotification('all', saved);
    return saved;
  }
}

export const notificationService = new NotificationService();
