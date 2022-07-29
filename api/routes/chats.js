import express from 'express'
import { accessChat } from '../controllers/chat.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router()

router.post('/', verifyToken, accessChat)

export default router;
