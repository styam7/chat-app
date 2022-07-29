import User from "../models/User.js"


export const getAllUsers = async (req, res, next) => {

    const { id } = req.user

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search } },
            { email: { $regex: req.query.search } }
        ],
    }
        : {};

    try {
        const users = await User.find(keyword).find({ _id: { $ne: id } })  
        res.status(200).json(users)
    } catch (err) {
        next(err)
    }
}