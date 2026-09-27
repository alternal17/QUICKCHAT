import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cloudinary from "./lib/cloudinary.js";
import Message from "./models/Message.js";

const app = express();
const httpServer = http.createServer(app);

// ✅ Allowed origins (local + production frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://quickchatapp-rho.vercel.app"
];

// ✅ Configure Socket.io CORS
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  },
});

// ✅ Export userSocketMap so controllers can import it
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ✅ Configure Express CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: "4mb" }));

// Routes
app.get("/api/status", (req, res) => {
  res.send("server is live 🚀");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

// ✅ Start server locally only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
}

// ✅ Export httpServer for Vercel
export default httpServer;
