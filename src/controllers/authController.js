import jwt from "jsonwebtoken";
import User from "../model/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      console.log(user);
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email",
        data: {
          email: user.email,
        },
      });
    }
    const salt = await bcrypt.genSalt(Number(process.env.ENCRYPT_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
  }
};
export const loginUser = async (req, res) => {
    console.log( req.body);
    
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User does not exist with this email",
        data: {
          email,
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Ivalid Password",
        data: {
          email,
          password,
        },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_AUTH_SECRET_KEY,
      { expiresIn: "2d" }
    );
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
    console.log(err);
  }
};
