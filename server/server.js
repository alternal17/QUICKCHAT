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

// ✅ Configure Socket.io CORS
export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",   // allow your frontend dev server
    credentials: true                  // allow cookies/headers
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
  origin: "http://localhost:5173",
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

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
     server.listen(PORT,()=> console.log("Server is running on PORT :"
    + PORT
))}
// Export server for vercel
export default server;