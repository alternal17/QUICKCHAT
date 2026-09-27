import express from "express";
import {
  signup,
  login,
  updateProfile,
  checkAuth,
} from "../controllers/userControllers.js"; // ✅ import all controller functions
import { protectRoute } from "../middleware/protectRoute.js"; // ✅ import middleware

const userRouter = express.Router();

// ✅ Auth routes
userRouter.post("/signup", signup);
userRouter.post("/login", login);

// ✅ Protected routes
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
