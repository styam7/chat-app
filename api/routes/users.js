import express from 'express'
import { getAllUsers } from '../controllers/user.js'
import { verifyToken } from "../utils/verifyToken.js"

const router = express.Router()

router.get("/", verifyToken, getAllUsers)


export default router