import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.js"
import userRouter from "./routes/users.js"
import chatRouter from './routes/chats.js'
import messageRouter from './routes/messages.js'
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

connectDB()
const app = express()
dotenv.config()
app.use(cookieParser())
app.use(express.json())



app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

//error handling middleware 
app.use((err, req, res, next) => {
    const errStatus = err.status || 500
    const errMsg = err.message || "something went wrong"
    return res.status(errStatus).json(errMsg)
})


const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        path: "hhtp://localhost:3000",
    }
})

io.on("connection", (socket) => {
   console.log("connected to socket.io")

   socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit("connected")
   })

   socket.on('join chat', (room) => {
    socket.join(room)
    console.log("User joined room: " + room)
   })
   
   socket.on("typing", (room) => {
    socket.in(room).emit("typing")
   })

   socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing")
   })

   socket.on('new message', (newMessageRecieved) => {

    var chat = newMessageRecieved.chat
    if(!chat.users) return console.log("chat.user not defined")

    chat.users.forEach((user) => {
        if(user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved)
    })

   })
})