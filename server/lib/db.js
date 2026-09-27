
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URL;
    if (!uri) {
      throw new Error("MongoDB connection string is not set in environment variables.");
    }

    // Sanity check for scheme
    if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
      throw new Error("Invalid MongoDB URI scheme. It must start with mongodb:// or mongodb+srv://");
    }

    console.log("Mongo URI preview:", uri.slice(0, 50) + "...");

    mongoose.connection.on("connected", () => console.log("Database connected"));
    mongoose.connection.on("error", (err) => console.error("Mongoose connection error:", err));

    // Do NOT pass useNewUrlParser or useUnifiedTopology with Mongoose 6+
    await mongoose.connect(uri);

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
