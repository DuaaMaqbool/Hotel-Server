import express from "express"
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js ";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";


connectDB()

const app =express()
app.use(cookieParser());


//middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));  //cross variable resource sharing
app.use(express.json()); // To parse JSON request bodies


//Routes
app.get('/', (req, res)=> res.send('api is working'))
app.use("/api/auth", authRoutes); 
app.use("/api/protected", protectedRoutes);

const PORT= process.env.PORT  || 3000;

app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));