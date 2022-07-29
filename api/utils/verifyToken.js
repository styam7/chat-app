import jwt from 'jsonwebtoken'
import { createError } from './error.js'
import config from "config"

const secretKey = config.get("jwtSecret")

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token

    if(!token){
        return next(createError(401, 'You are not authenticated'))
    }

    jwt.verify(token, secretKey , (err, user) => {
        if(err) return next(createError(403, 'Token is not valid'))

        req.user = user
        next()
    } )
}

export const verifyAdmin = (req, res, next) =>{
    verifyToken(req, res, next, () =>{
        if(req.user.isAdmin){
            next()
        }
        else{
            return next(createError(403, 'You are not authorized'))
        }
    })
}