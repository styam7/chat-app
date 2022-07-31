import { createError } from "../utils/error.js"
import Chat from "../models/Chat.js"
import User from '../models/User.js'


export const accessChat = async (req, res, next) => {
    const { userId } = req.body
    const { id } = req.user

    if (!userId) return next(createError(400, "userid params not sent with request"))

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    }
    else {
         var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [ id, userId]
         }
         try {
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.find({_id: createdChat._id}).populate("users", "-password")

            res.status(200).json(fullChat)
         } catch (err) {
            next(err)
         }
    }
}


export const fetchChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ 
            users: { $elemMatch : { $eq: req.user.id}}
        }).populate("users" , "-password").populate("groupAdmin" , "-password").populate("latestMessage")
        
        const fullChats = await User.populate(chats, {
            path: 'latestMessage.sender',
            select: 'name pic email'
        })
        res.status(200).json(fullChats)
    } catch (err) {
        next(err)
    }
}
