// src/index.ts

import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { prisma } from './db.js';
import { initSocket } from './socket.js';

// Import the types config to extend Express Request with `user`
import './config/types.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Import route modules
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import facultyRoutes from './routes/faculty.routes.js';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// --- Initialise Socket.io ---
initSocket(server);

// --- Global Middleware ---
app.use(cors({
  origin: "https://w6txh4kf-3000.inc1.devtunnels.ms",
  credentials: true
}));
app.use(express.json());

// --- Health Routes ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Attendance Analytics API is running' });
});

app.get('/health/db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ status: 'ok', message: 'Database connected', usersCount: userCount });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
  }
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);

// --- Global Error Handler (MUST be last middleware) ---
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`WebSocket server attached`);
});
