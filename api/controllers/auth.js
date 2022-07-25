import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import { createError } from "../utils/error.js";
import config from "config";

const secretKey = config.get("jwtSecret")

export const register = async (req, res, next) => {

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const newUser = new User({
    ...req.body,
    password: hash,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  }  
  catch (err) {
    next(err)
  }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(!user) {
            return next(createError(401, 'user not found'))
        }

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if(!isPasswordCorrect){
            return next(createError(401, 'Invalid credentials'))
        }

        var token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, secretKey );

        const { password, isAdmin, ...otherDetails } = user._doc

        res.cookie('access_token', token, {
            httpOnly: true,
        }).status(200).json({ ...otherDetails })

    } catch (err) {
        next(err)
    }
};
