import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js ";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";

connectDB();
connectCloudinary()

const app = express();


//middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); //cross variable resource sharing
app.use(express.json()); // To parse JSON request bodies
app.use(cookieParser());

//Routes
app.get("/", (req, res) => res.send("api is working"));
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/user", userRouter);
app.use('/api/hotel', hotelRouter);
app.use('/api/rooms', roomRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
