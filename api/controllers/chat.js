import { createError } from "../utils/error.js"
import Chat from "../models/Chat.js"


export const accessChat = async (req, res, next) => {
    const { userId } = req.body
    const { id } = req.user

    if(!userId) return next(createError(400, "userid params not sent with request"))
    
    const isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: {$elemMatch: { $eq: id}}},
            { users: {$elemMatch: { $eq: id}}}
        ]
    }).populate("users", "-password").populate("latestMessage")
}

