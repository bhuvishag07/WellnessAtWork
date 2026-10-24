import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getJwtSecret } from '../services/authService.js';

let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie || '';
    const cookieToken = cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('token='))
      ?.slice('token='.length);

    try {
      const token = socket.handshake.auth?.token || (cookieToken ? decodeURIComponent(cookieToken) : null);
      if (!token) return next(new Error('Authentication required.'));
      const claims = jwt.verify(token, getJwtSecret());
      const user = await User.findById(claims.id).select('_id role tokenVersion');
      if (!user || claims.ver !== (user.tokenVersion || 0)) {
        return next(new Error('Invalid session.'));
      }
      socket.data.user = { id: user._id.toString(), role: user.role };
      return next();
    } catch {
      return next(new Error('Invalid session.'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);
    socket.join(`user:${socket.data.user.id}`);
    if (socket.data.user.role === 'admin') socket.join('admins');

    socket.on('join:user', (userId) => {
      if (userId === socket.data.user.id) {
        socket.join(`user:${socket.data.user.id}`);
      }
    });

    socket.on('join:admin', () => {
      if (socket.data.user.role === 'admin') socket.join('admins');
    });

    socket.on('simulate:event', (payload) => {
      if (socket.data.user.role === 'admin') io.emit('activity:logged', payload);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  return ioInstance;
};

/**
 * Broadcast event to all connected clients
 */
export const emitSocketEvent = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
    console.log(`[Socket.io] Broadcasted "${event}":`, data?.title || '');
  }
};

/**
 * Send event to a specific user room
 */
export const emitToUser = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user:${userId.toString()}`).emit(event, data);
    console.log(`[Socket.io] Emitted "${event}" to user:${userId}:`, data?.title || '');
  }
};

/**
 * Send event to admins
 */
export const emitToAdmins = (event, data) => {
  if (ioInstance) {
    ioInstance.to('admins').emit(event, data);
    console.log(`[Socket.io] Emitted "${event}" to admins room:`, data?.title || '');
  }
};
