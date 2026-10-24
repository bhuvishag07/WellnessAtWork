import Webinar from '../models/Webinar.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { emitSocketEvent, emitToUser } from '../sockets/socketHandler.js';

export const getWebinars = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id.toString() : null;
    const webinars = await Webinar.find().sort({ scheduledAt: 1 });

    const formatted = webinars.map(w => {
      const json = w.toJSON();
      json.isRegistered = userId ? w.participants.some(p => p.toString() === userId) : false;
      return json;
    });

    return successResponse(res, {
      message: 'Webinars fetched',
      data: { webinars: formatted }
    });
  } catch (error) {
    next(error);
  }
};

export const getWebinarById = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return errorResponse(res, { statusCode: 404, message: 'Webinar not found' });
    }
    const json = webinar.toJSON();
    const userId = req.user ? req.user._id.toString() : null;
    json.isRegistered = userId ? webinar.participants.some(p => p.toString() === userId) : false;

    return successResponse(res, {
      message: 'Webinar retrieved',
      data: { webinar: json }
    });
  } catch (error) {
    next(error);
  }
};

export const registerWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findById(req.params.id);
    if (!webinar) {
      return errorResponse(res, { statusCode: 404, message: 'Webinar not found' });
    }

    const userId = req.user._id;
    if (webinar.participants.some(p => p.toString() === userId.toString())) {
      return errorResponse(res, { statusCode: 400, message: 'Already registered for this webinar' });
    }

    if (webinar.participants.length >= webinar.capacity) {
      return errorResponse(res, { statusCode: 400, message: 'Webinar has reached maximum capacity.' });
    }

    webinar.participants.push(userId);
    await webinar.save();

    const notif = await Notification.create({
      recipient: userId,
      title: `Registered: ${webinar.title} 🎟️`,
      message: `Your seat is reserved for ${new Date(webinar.scheduledAt).toLocaleString()}. Facilitated by ${webinar.facilitator}.`,
      type: 'session',
      actionLink: '/sessions'
    });

    emitToUser(userId, 'notification:push', notif);
    emitSocketEvent('webinar:registered', {
      webinarId: webinar._id,
      registeredCount: webinar.participants.length
    });

    return successResponse(res, {
      message: 'Successfully registered for webinar',
      data: {
        webinarTitle: webinar.title,
        meetingLink: webinar.meetingLink,
        scheduledAt: webinar.scheduledAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.create({
      ...req.body,
      createdBy: req.user._id
    });
    return successResponse(res, {
      statusCode: 201,
      message: 'Webinar created',
      data: { webinar }
    });
  } catch (error) {
    next(error);
  }
};

export const updateWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!webinar) {
      return errorResponse(res, { statusCode: 404, message: 'Webinar not found' });
    }
    return successResponse(res, {
      message: 'Webinar updated',
      data: { webinar }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWebinar = async (req, res, next) => {
  try {
    const webinar = await Webinar.findByIdAndDelete(req.params.id);
    if (!webinar) {
      return errorResponse(res, { statusCode: 404, message: 'Webinar not found' });
    }
    return successResponse(res, {
      message: 'Webinar deleted'
    });
  } catch (error) {
    next(error);
  }
};
