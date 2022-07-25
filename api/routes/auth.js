import express from 'express'
import { login, register } from '../controllers/auth.js'

const router = express.Router()

//register
router.post('/register', register)
//login
router.post('/login', login)

export default router