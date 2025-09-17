import express, { Router } from "express";
import {
  forgotPassword,
  loginUser,
  registerUser,
  setPassword,
  UserController,
  verifyUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authmiddleware.js";

const authRouter = express.Router();
authRouter.get("/", protect, UserController);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/verify", verifyUser);
authRouter.post("/setPassword", setPassword);
authRouter.post("/forgotPassword", forgotPassword);

export default authRouter;
