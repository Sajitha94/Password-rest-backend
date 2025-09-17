import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/authRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import { protect } from "./src/middleware/authmiddleware.js";

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("Application is working well");
});

app.use("/api/auth", authRouter);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is Running on PORT ${PORT}`);
});
