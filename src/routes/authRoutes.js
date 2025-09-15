import express, { Router } from "express";
import {
  loginUser,
  registerUser,
  setPassword,
  verifyUser,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/verify", verifyUser);
authRouter.post("/setPassword", setPassword);

export default authRouter;
