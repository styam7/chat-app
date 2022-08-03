import { createError } from "../utils/error.js"
import Message from "../models/Message.js"
import User from "../models/User.js"
import Chat from "../models/Chat.js"

export const sendMessage = async (req, res, next) => {
    const { content, chatId } = req.body

    if (!content || !chatId) {
        return next(createError(400, "Invalid data"))
    }

    var newMessage = {
        sender: req.user.id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage)

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })

        res.status(200).json(message)
    } catch (err) {
        next(err)
    }
}

export const allMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat")

        res.status(200).json(messages)
    } catch (err) {
        next(err)
    }
}