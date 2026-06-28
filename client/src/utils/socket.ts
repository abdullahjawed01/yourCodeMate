import { io, Socket } from 'socket.io-client';

/**
 * Shared Socket.IO client singleton.
 *
 * Previously every feature (Chat, etc.) created its own `io()` connection — and
 * Chat re-created it on every room switch, leaking connections. This module
 * exposes ONE resilient, auto-reconnecting connection for the whole app on the
 * default namespace. (Yjs collaboration uses its own dynamic `/yjs|*`
 * namespaces via SocketIOProvider, so it is intentionally separate.)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(API_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket', 'polling'],
    // Send the JWT so the server can authenticate the socket if/when needed.
    auth: (cb) => cb({ token: localStorage.getItem('token') || undefined }),
  });

  if (import.meta.env.DEV) {
    socket.on('connect', () => console.debug('[socket] connected', socket?.id));
    socket.on('disconnect', (reason) => console.debug('[socket] disconnected:', reason));
    socket.on('connect_error', (err) => console.debug('[socket] connect_error:', err.message));
  }

  return socket;
}

/** Fully tear down the shared socket (e.g. on logout). */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export default getSocket;
