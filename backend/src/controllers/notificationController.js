import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { emitSocketEvent, emitToUser } from '../sockets/socketHandler.js';
import { sendFirebasePush } from '../config/firebase.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const records = await Notification.find({
      $or: [{ recipient: userId }, { recipient: null }]
    }).sort({ createdAt: -1 }).limit(50);

    const notifications = records.map((notification) => {
      const formatted = notification.toJSON();
      if (!notification.recipient) {
        formatted.read = notification.readBy.some((id) => id.equals(userId));
      }
      return formatted;
    });
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    return successResponse(res, {
      message: 'Notifications fetched',
      data: { notifications, unreadCount }
    });
  } catch (error) {
    next(error);
  }
};

export const getNotificationById = async (req, res, next) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      $or: [{ recipient: req.user._id }, { recipient: null }]
    });
    if (!notif) {
      return errorResponse(res, { statusCode: 404, message: 'Notification not found' });
    }

    return successResponse(res, {
      message: 'Notification retrieved',
      data: { notification: notif }
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOne({
      _id: req.params.id,
      $or: [{ recipient: req.user._id }, { recipient: null }]
    });
    if (!notif) {
      return errorResponse(res, { statusCode: 404, message: 'Notification not found' });
    }
    if (notif.recipient) {
      notif.read = true;
    } else {
      notif.readBy.addToSet(req.user._id);
    }
    await notif.save();
    return successResponse(res, {
      message: 'Notification marked as read',
      data: { notification: notif }
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Promise.all([
      Notification.updateMany({ recipient: req.user._id }, { read: true }),
      Notification.updateMany(
        { recipient: null, readBy: { $ne: req.user._id } },
        { $addToSet: { readBy: req.user._id } }
      )
    ]);

    return successResponse(res, {
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (req, res, next) => {
  try {
    const { recipientId, title, message, type, actionLink } = req.body;

    const notif = await Notification.create({
      recipient: recipientId || null,
      title,
      message,
      type: type || 'wellness',
      actionLink: actionLink || null
    });

    if (recipientId) {
      emitToUser(recipientId, 'notification:push', notif);
      const recipientUser = await User.findById(recipientId);
      if (recipientUser && recipientUser.firebaseDeviceTokens?.length > 0) {
        sendFirebasePush({
          tokens: recipientUser.firebaseDeviceTokens,
          title,
          body: message
        }).catch(err => console.warn(err.message));
      }
    } else {
      emitSocketEvent('notification:push', notif);
    }

    return successResponse(res, {
      statusCode: 201,
      message: 'Notification sent successfully',
      data: { notification: notif }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const scope = req.user.role === 'admin'
      ? { $or: [{ recipient: req.user._id }, { recipient: null }] }
      : { recipient: req.user._id };
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      ...scope
    });
    if (!notification) {
      return errorResponse(res, { statusCode: 404, message: 'Notification not found' });
    }
    return successResponse(res, {
      message: 'Notification deleted'
    });
  } catch (error) {
    next(error);
  }
};
