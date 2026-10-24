import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:7500';

let socket = null;

export const initSocketClient = () => {
  if (!socket) {
    socket = io(SOCKET_SERVER_URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log(`[Socket.io Client] Connected successfully (${socket.id})`);
    });

    socket.on('connect_error', (err) => {
      console.warn(`[Socket.io Client] Connection warning: ${err.message}`);
    });
  }
  socket.auth = {};
  if (!socket.connected) socket.connect();
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocketClient();
  }
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
};

export default {
  initSocketClient,
  getSocket,
  disconnectSocket
};
