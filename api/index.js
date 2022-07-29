import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.js"
import userRouter from "./routes/users.js"
import chatRouter from './routes/chats.js'
import cookieParser from "cookie-parser";

connectDB()
const app = express()
dotenv.config()
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/chat', chatRouter)

//error handling middleware 
app.use((err, req, res, next) => {
    const errStatus = err.status || 500
    const errMsg = err.message || "something went wrong"
    return res.status(errStatus).json(errMsg)
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})