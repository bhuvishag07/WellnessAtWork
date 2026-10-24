import SessionBooking from '../models/SessionBooking.js';
import Notification from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { emitSocketEvent, emitToUser } from '../sockets/socketHandler.js';

export const getSessions = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id.toString() : null;
    const sessions = await SessionBooking.find().sort({ createdAt: -1 });

    const formatted = sessions.map(s => {
      const isBookedByCurrentUser = userId
        ? s.bookedUsers.some(b => b.userId && b.userId.toString() === userId)
        : false;

      const userBooking = userId
        ? s.bookedUsers.find(b => b.userId && b.userId.toString() === userId)
        : null;

      const json = s.toJSON();
      // Remove other users' private identities from bookedUsers for confidentiality
      delete json.bookedUsers;
      json.booked = isBookedByCurrentUser;
      json.userBookedDate = userBooking ? `${s.date}, ${s.time.split('-')[0].trim()}` : null;
      return json;
    });

    return successResponse(res, {
      message: 'Sessions fetched successfully',
      data: { sessions: formatted }
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const session = await SessionBooking.findById(req.params.id);
    if (!session) {
      return errorResponse(res, { statusCode: 404, message: 'Session not found' });
    }

    const userId = req.user ? req.user._id.toString() : null;
    const isBooked = userId ? session.bookedUsers.some(b => b.userId.toString() === userId) : false;

    const json = session.toJSON();
    delete json.bookedUsers;
    json.booked = isBooked;

    return successResponse(res, {
      message: 'Session retrieved successfully',
      data: { session: json }
    });
  } catch (error) {
    next(error);
  }
};

export const bookSession = async (req, res, next) => {
  try {
    const sessionId = req.body.sessionId || req.params.id;
    const notes = req.body.notes || '';
    const userId = req.user._id;

    const existingSession = await SessionBooking.findById(sessionId);
    if (!existingSession) {
      return errorResponse(res, { statusCode: 404, message: 'Session not found' });
    }

    const session = await SessionBooking.findOneAndUpdate(
      {
        _id: sessionId,
        availableSlots: { $gt: 0 },
        'bookedUsers.userId': { $ne: userId }
      },
      {
        $inc: { availableSlots: -1 },
        $push: { bookedUsers: { userId, notes, bookedAt: new Date() } }
      },
      { new: true, runValidators: true }
    );
    if (!session) {
      const alreadyBooked = existingSession.bookedUsers.some(
        (booking) => booking.userId.toString() === userId.toString()
      );
      return errorResponse(res, {
        statusCode: 400,
        message: alreadyBooked
          ? 'You have already booked a slot in this session.'
          : 'No slots available for this session.'
      });
    }
    if (session.availableSlots === 0) {
      session.status = 'booked';
      await session.save();
    }

    // Create confirmation notification
    const notif = await Notification.create({
      recipient: userId,
      title: `Session Confirmed: ${session.title} 🌿`,
      message: `Your appointment with ${session.facilitator} is locked for ${session.date}.`,
      type: 'session',
      actionLink: '/sessions'
    });

    emitToUser(userId, 'notification:push', {
      id: notif._id,
      title: notif.title,
      message: notif.message,
      type: 'session',
      actionLink: notif.actionLink
    });

    emitSocketEvent('session:updated', {
      sessionId: session._id,
      availableSlots: session.availableSlots
    });

    return successResponse(res, {
      message: 'Session successfully booked',
      data: {
        session: {
          id: session._id,
          title: session.title,
          facilitator: session.facilitator,
          date: session.date,
          time: session.time,
          booked: true,
          userBookedDate: `${session.date}, ${session.time.split('-')[0].trim()}`
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user._id;

    const session = await SessionBooking.findById(sessionId);
    if (!session) {
      return errorResponse(res, { statusCode: 404, message: 'Session not found' });
    }

    const updatedSession = await SessionBooking.findOneAndUpdate(
      { _id: sessionId, 'bookedUsers.userId': userId },
      {
        $pull: { bookedUsers: { userId } },
        $inc: { availableSlots: 1 }
      },
      { new: true }
    );
    if (!updatedSession) {
      return errorResponse(res, { statusCode: 400, message: 'You do not have an active booking for this session.' });
    }

    updatedSession.status = 'available';
    await updatedSession.save();

    emitSocketEvent('session:updated', {
      sessionId: updatedSession._id,
      availableSlots: updatedSession.availableSlots
    });

    return successResponse(res, {
      message: 'Booking cancelled successfully and slot released.'
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req, res, next) => {
  try {
    // Only current user or admin can view user's bookings
    const targetUserId = req.params.id;
    if (targetUserId !== req.user._id.toString()) {
      return errorResponse(res, {
        statusCode: 403,
        message: 'You can only view your own counseling bookings.'
      });
    }

    const sessions = await SessionBooking.find({ 'bookedUsers.userId': targetUserId });
    const privateBookings = sessions.map((session) => {
      const formatted = session.toJSON();
      formatted.bookedUsers = session.bookedUsers
        .filter((booking) => booking.userId.toString() === targetUserId)
        .map((booking) => ({
          bookedAt: booking.bookedAt,
          notes: booking.notes
        }));
      return formatted;
    });
    return successResponse(res, {
      message: 'User bookings retrieved',
      data: { sessions: privateBookings }
    });
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const session = await SessionBooking.create(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: 'Session created successfully',
      data: { session }
    });
  } catch (error) {
    next(error);
  }
};
