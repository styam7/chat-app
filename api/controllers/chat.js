import { createError } from "../utils/error.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const accessChat = async (req, res, next) => {
  const { userId } = req.body;
  const { id } = req.user;

  if (!userId)
    return next(createError(400, "userid params not sent with request"));

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.find({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(fullChat);
    } catch (err) {
      next(err);
    }
  }
};

export const fetchChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    const fullChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).json(fullChats);
  } catch (err) {
    next(err);
  }
};

export const createGroupChat = async (req, res, next) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return next(createError(400, "Please fill all the fields"));
  }

  const groupUsers = JSON.parse(users);

  if (groupUsers.length < 2) {
    return next(
      createError(400, "More than 2 Users are required to form a group chat")
    );
  }

  groupUsers.push(req.user.id);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: groupUsers,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat)
  } catch (err) {
    next(err);
  }
};

export const renameGroupChat = async (req, res, next) => {
    const { chatId, chatName} = req.body

    try {
        const updateGroupName = await Chat.findByIdAndUpdate(chatId, {chatName}, { new: true})

        if(!updateGroupName){
            return next(createError(400, "Group chat not found"))
        }
        res.status(200).json(updateGroupName)
    } catch (err) {
        next(err)
    }
}

export const groupAdd = async (req, res, next) => {
    const { chatId, userId } = req.body
    
    try {
        const adduser = await Chat.findByIdAndUpdate(
            chatId,
            { $push: {users: userId}},
            { new: true }
        )
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

        if(!adduser){
            return next(createError(400, "Chat not found"))
        }
        res.status(200).json(adduser)
    } catch (err) {
        next(err)
    }
}

export const groupRemove = async (req, res, next) => {
    const { chatId, userId } = req.body
    
    try {
        const removeuser = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: {users: userId}},
            { new: true }
        )
        .populate('users', '-password')
        .populate('groupAdmin', '-password')

        if(!removeuser){
            return next(createError(400, "Chat not found"))
        }
        res.status(200).json(removeuser)
    } catch (err) {
        next(err)
    }
}