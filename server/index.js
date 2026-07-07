import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDB.js";
dotenv.config();

const app =express();

const port = process.env.PORT;

app.get("/",(req,res)=>{
    return res.json({message:"Server Started"})
})

app.listen(port ,()=>{
    console.log(`Server is running on port ${port}`)
    connectDb()
})