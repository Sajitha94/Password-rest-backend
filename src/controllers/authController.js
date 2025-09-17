import jwt from "jsonwebtoken";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendMailer from "../utils/sendMailer.js";

export const registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (user && user?.password) {
      console.log(user);
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email",
        data: {
          email: user.email,
        },
      });
    }

    if (!user) {
      user = new User({ email });
    }
    // token generate
    const token = crypto.randomBytes(6).toString("hex");
    user.verifyToken = token;
    user.verifyTokenExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // send email
    await sendMailer(
      email,
      "Your Verification Code",
      `<p>Your code is: <b>${token}</b></p>`
    );
    res.json({ message: "Verification code sent to email" });
  } catch (err) {
    console.log(err);
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, token } = req.body;
    console.log(req.body, "n");

    const user = await User.findOne({
      email,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    res.json({ message: "Token verified. You can now set your password." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({
      email,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(Number(process.env.ENCRYPT_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password set successfully. You can now login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User does not exist with this email",
        data: { email },
      });
    }

    if (!user.password) {
      return res.status(400).json({
        status: "error",
        message: "User has not set a password yet. Please reset your password.",
        data: { email },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
        data: { email },
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_AUTH_SECRET_KEY, {
      expiresIn: "2d",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const UserController = (req, res) => {
  const { _id, email } = req.user;
  res.status(200).json({
    status: "success",
    message: "This is a protected route",
    data: {
      info: "Some protected information",
      data: { id: _id, email },
    },
  });
};
