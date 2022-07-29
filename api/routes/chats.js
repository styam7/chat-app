import express from 'express'
import { accessChat, fetchChats } from '../controllers/chat.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router()

router.post('/', verifyToken, accessChat)
router.get('/', verifyToken, fetchChats)

export default router;
