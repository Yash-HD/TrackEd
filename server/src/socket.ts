// src/socket.ts
// Singleton Socket.io server instance.
// Import `getIO()` from any service to emit events.

import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

/**
 * Initialise Socket.io and attach it to the HTTP server.
 * Called once from index.ts at startup.
 */
export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
    io = new SocketIOServer(httpServer, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // Faculty joins a room named after the sessionId so only
        // events for *their* session are received.
        socket.on('join_session', (sessionId: string) => {
            socket.join(sessionId);
            console.log(`[Socket] ${socket.id} joined room ${sessionId}`);
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

/**
 * Get the Socket.io server instance.
 * Throws if called before `initSocket()`.
 */
export const getIO = (): SocketIOServer => {
    if (!io) throw new Error('Socket.io not initialised. Call initSocket() first.');
    return io;
};
