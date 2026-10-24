import 'dotenv/config';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import app, { isOriginAllowed } from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/socketHandler.js';
import { assertAuthConfig } from './services/authService.js';
import mongoose from 'mongoose';

const PORT = Number(process.env.PORT || 7500);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const LOCK_PATH = path.resolve(process.cwd(), 'backend-server.lock');

const ensureSingleInstance = () => {
  try {
    const existing = fs.readFileSync(LOCK_PATH, 'utf8').trim();
    if (existing && /^\d+$/.test(existing)) {
      try {
        process.kill(Number(existing), 0);
        console.error('[Server] Another WellnessAtWork backend instance is already running.');
        console.error(`[Server] PID ${existing} is holding the lock file: ${LOCK_PATH}`);
        console.error(`[Server] To inspect it: ps -fp ${existing}`);
        console.error(`[Server] To check port usage: lsof -nP -iTCP:${PORT} -sTCP:LISTEN`);
        process.exit(1);
      } catch {
        fs.unlinkSync(LOCK_PATH);
      }
    }
  } catch {
    // No lock file yet; safe to continue.
  }

  fs.writeFileSync(LOCK_PATH, String(process.pid), 'utf8');
};

const clearSingleInstanceLock = () => {
  try {
    const current = Number(fs.readFileSync(LOCK_PATH, 'utf8').trim());
    if (Number.isFinite(current) && current === process.pid) {
      fs.unlinkSync(LOCK_PATH);
    }
  } catch {
    // Lock file may already be absent.
  }
};

const startServer = async () => {
  assertAuthConfig();
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  ensureSingleInstance();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not permitted by Socket.io CORS`));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  initSocket(io);

  let isListening = false;
  let startupReject;
  let isShuttingDown = false;

  const shutdown = async (signal, exitCode = 0) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);

    const forceExit = setTimeout(() => {
      console.error('[Server] Graceful shutdown timed out; forcing exit.');
      server.closeAllConnections?.();
      clearSingleInstanceLock();
      process.exit(1);
    }, 5000);
    forceExit.unref();

    try {
      server.closeAllConnections?.();
      await new Promise((resolve) => server.close(resolve));
      await new Promise((resolve) => io.close(resolve));
      await mongoose.disconnect();
      clearTimeout(forceExit);
      console.log('[Server] HTTP, Socket.io, and MongoDB connections closed.');
      clearSingleInstanceLock();
      process.exit(exitCode);
    } catch (error) {
      clearTimeout(forceExit);
      console.error(`[Server] Shutdown error: ${error.message}`);
      clearSingleInstanceLock();
      process.exit(1);
    }
  };

  server.on('error', (error) => {
    if (!isListening) {
      if (error.code === 'EADDRINUSE') {
        console.error(`[Server] Port ${PORT} is already occupied; this instance will not start.`);
        console.error(`[Server] Identify the listener with: lsof -nP -iTCP:${PORT} -sTCP:LISTEN`);
        console.error('[Server] Stop it only after confirming it is an old WellnessAtWork process.');
        clearSingleInstanceLock();
      }
      startupReject?.(error);
      return;
    }

    console.error(`[Server] Listener error: ${error.message}`);
    void shutdown('server error', 1);
  });

  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  process.once('SIGINT', () => void shutdown('SIGINT'));

  // Connect database before binding port to prevent serving traffic without DB
  await connectDB();

  await new Promise((resolve, reject) => {
    startupReject = reject;
    server.once('listening', () => {
      isListening = true;
      startupReject = null;
      resolve();
    });
    server.listen(PORT, '0.0.0.0');
  });

  console.log('====================================================');
  console.log(`  WELLNESSATWORK BACKEND RUNNING ON PORT ${PORT}`);
  console.log(`  API: http://localhost:${PORT}/api`);
  console.log(`  Socket.io: Connected on port ${PORT}`);
  console.log(`  Client Origin: ${CLIENT_URL}`);
  console.log('====================================================');
};

startServer().catch((error) => {
  console.error(`[Server] Failed to start: ${error.message}`);
  clearSingleInstanceLock();
  process.exitCode = 1;
});
