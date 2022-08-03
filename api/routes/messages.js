import express from 'express'
import { allMessages, sendMessage } from '../controllers/message.js';
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, sendMessage )

router.get('/:chatId', verifyToken, allMessages)

export default router;