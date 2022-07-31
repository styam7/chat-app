import express from 'express'
import { accessChat, createGroupChat, fetchChats, groupAdd, groupRemove, renameGroupChat } from '../controllers/chat.js';
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router()

router.post('/', verifyToken, accessChat)
router.get('/', verifyToken, fetchChats)
router.post('/group', verifyToken, createGroupChat)
router.put('/rename', verifyToken, renameGroupChat)
router.put('/groupadd', verifyToken, groupAdd)
router.put('/groupremove', verifyToken, groupRemove)

export default router;
