import 'dotenv/config';
import express from "express";
import http from 'http';
import ConnectDB from "./config/ConnectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { initializeSocket } from './config/socket.js';

// Import routes
import userRouter from "./routes/userRoutes.js";
import mentorRouter from "./routes/mentorRoutes.js";
import applicationRouter from "./routes/mentorApplicationRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

const app = express();
const PORT = process.env.PORT || 7777;

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://mentor-app-kxzr.vercel.app',
  credentials: true
}));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/mentors", mentorRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/chat", chatRouter);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Connect to database and start server
ConnectDB()
  .then(() => {
    console.log("✅ Database connection established...");

    // Initialize Socket.io
    initializeSocket(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database cannot be connected!!", err);
    process.exit(1);
  });
