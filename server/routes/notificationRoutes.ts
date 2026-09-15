import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import { ApiResponse } from '../types';

const router = Router();

// GET /api/notifications - List user notifications
router.get('/', (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'prakash';
    const unreadOnly = req.query.unreadOnly === 'true';

    const notifications = notificationService.getUserNotifications(userId, unreadOnly);
    const unreadCount = notificationService.getUnreadCount(userId);

    const response: ApiResponse = {
      success: true,
      data: notifications,
      meta: {
        total: notifications.length,
        unreadCount
      }
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error fetching notifications' });
  }
});

// GET /api/notifications/unread-count - Lightweight unread badge endpoint
router.get('/unread-count', (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'prakash';
    const unreadCount = notificationService.getUnreadCount(userId);

    const response: ApiResponse = {
      success: true,
      data: { unreadCount }
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error fetching unread count' });
  }
});

// POST /api/notifications - Dispatch custom notification
router.post('/', (req: Request, res: Response) => {
  try {
    const { recipientId, type, title, message, mentorId, mentorName, mentorAvatar, actorId, actorName, actorAvatar, postId, sessionId, actionUrl } = req.body;

    if (!recipientId || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'recipientId, title, and message are required'
      });
    }

    const notification = notificationService.sendNotification({
      recipientId,
      type: type || 'system_announcement',
      title,
      message,
      mentorId,
      mentorName,
      mentorAvatar,
      actorId,
      actorName,
      actorAvatar,
      postId,
      sessionId,
      actionUrl
    });

    const response: ApiResponse = {
      success: true,
      data: notification,
      message: 'Notification sent successfully'
    };
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || 'Error creating notification' });
  }
});

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', (req: Request<{ id: string }>, res: Response) => {
  try {
    const notificationId = req.params.id as string;
    const updated = notificationService.markAsRead(notificationId);

    if (!updated) {
      return res.status(404).json({ success: false, error: `Notification ${notificationId} not found` });
    }

    const response: ApiResponse = {
      success: true,
      data: updated,
      message: 'Notification marked as read'
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error updating notification' });
  }
});

// POST /api/notifications/mark-all-read - Mark all notifications as read
router.post('/mark-all-read', (req: Request, res: Response) => {
  try {
    const userId = (req.body?.userId || req.query?.userId || 'prakash') as string;
    const markedCount = notificationService.markAllAsRead(userId);

    const response: ApiResponse = {
      success: true,
      data: { markedCount },
      message: `${markedCount} notifications marked as read`
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Error marking all notifications as read' });
  }
});

// POST /api/notifications/broadcast - Broadcast system announcement to all users
router.post('/broadcast', (req: Request, res: Response) => {
  try {
    const { title, message, actionUrl } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'title and message are required for broadcast'
      });
    }

    const announcement = notificationService.broadcastAnnouncement(title, message, actionUrl);

    const response: ApiResponse = {
      success: true,
      data: announcement,
      message: 'Announcement broadcasted to all users'
    };
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || 'Error broadcasting announcement' });
  }
});

export default router;
