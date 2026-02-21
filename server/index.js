import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors"
import authRouter from "./routes/auth.route.js";
const app =express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const port = process.env.PORT;

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.listen(port ,()=>{
    console.log(`Server is running on port ${port}`)
    connectDb()
})